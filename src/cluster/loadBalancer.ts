import { request, type IncomingMessage, type ServerResponse } from 'node:http';
import { MESSAGE } from '../consts/messages';
import { sendGenericResponse } from '../handler/sendResponse';
import { styledBalancer } from '..';
import { styledWorker } from '../server/workerServer';

export const createLoadBalancer = (WORKER_PORTS: number[]) => {
  let currentWorkerIndex = 0;

  const loadBalancerRequestListener = (
    clientRequest: IncomingMessage,
    clientResponse: ServerResponse,
  ) => {
    if (WORKER_PORTS.length === 0) {
      return sendGenericResponse(clientResponse, 500, MESSAGE.UNKNOWN_ERROR);
    }

    const targetPort = WORKER_PORTS[currentWorkerIndex];
    currentWorkerIndex = (currentWorkerIndex + 1) % WORKER_PORTS.length;

    console.log(
      `${styledBalancer} Routing ${clientRequest.method} ${clientRequest.url} to ${styledWorker} on port: ${targetPort}`,
    );

    const proxyOptions = {
      hostname: 'localhost',
      port: targetPort,
      path: clientRequest.url,
      method: clientRequest.method,
      headers: clientRequest.headers,
    };

    const proxyRequest = request(proxyOptions, (workerRes) => {
      clientResponse.writeHead(workerRes.statusCode!, workerRes.headers);
      workerRes.pipe(clientResponse, { end: true });
    });

    proxyRequest.on('error', (err) => {
      console.error(
        `${styledBalancer} Error communicating with ${styledWorker} on port ${targetPort}:`,
        err,
      );
      sendGenericResponse(clientResponse, 500, MESSAGE.UNKNOWN_ERROR);
    });

    clientRequest.pipe(proxyRequest, { end: true });
  };

  return loadBalancerRequestListener;
};
