import { createServer } from 'node:http';
import { styleText } from 'node:util';
import { setupWorkerHandler } from '../cluster/workerHandler';
import { createRequestListener } from '../requestHandler';

export const styledWorker = styleText('magentaBright', 'Worker');

export const createWorkerServer = () => {
  const PORT = Number(process.env.PORT) || 5050;

  const requestListener = createRequestListener();
  const server = createServer(requestListener);

  server.listen(PORT, () => {
    console.log(
      `${styledWorker} process listening on port ${PORT} (PID: ${process.pid})`,
    );
  });

  server.on('error', (err) => {
    console.error(`${styledWorker} error: ${err}`);
    process.exit(1);
  });

  setupWorkerHandler();

  return server;
};
