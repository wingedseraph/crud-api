import cluster from 'node:cluster';
import { getServerConfig } from '../config/serverConfig';
import { User } from '../db';
import { styledWorker } from '../server/workerServer';

export type StoreChange = {
  cmd: 'STORE_CHANGE';
  action: 'ADD_USER' | 'ADD_USER_WITH_ID' | 'UPDATE_USER' | 'DELETE_USER';
  id?: string;
  user?: User;
};

export const setupCluster = () => {
  const { MULTI_PORT, numCPUs } = getServerConfig();
  const WORKER_PORTS: number[] = [];

  for (let i = 1; i <= numCPUs; i++) {
    WORKER_PORTS.push(MULTI_PORT + i);
  }

  console.log(
    `Primary process (PID ${process.pid}) is running. Forking ${numCPUs} workers...`,
  );
  console.log(
    `${styledWorker} will listen on ports: ${WORKER_PORTS.join(', ')}`,
  );

  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork({ PORT: WORKER_PORTS[i] });

    worker.on('error', (err) => {
      console.error(`${styledWorker} ${worker.process.pid} error: ${err}`);
    });

    worker.on('exit', () => {
      console.error(`${styledWorker} (PID ${worker.process.pid}) exited`);

      if (!worker.exitedAfterDisconnect) {
        const currentWorkersCount = Object.keys(cluster.workers ?? {}).length;
        cluster.fork({
          PORT: WORKER_PORTS[currentWorkersCount % WORKER_PORTS.length],
        });
      }
    });

    worker.on('message', (message) => {
      const msg = message as StoreChange;
      if (msg.cmd === 'STORE_CHANGE') {
        for (const id in cluster.workers) {
          const otherWorker = cluster.workers[id];
          if (
            otherWorker &&
            otherWorker !== worker &&
            otherWorker.isConnected()
          ) {
            otherWorker.send(msg);
          }
        }
      }
    });
  }

  return { WORKER_PORTS };
};
