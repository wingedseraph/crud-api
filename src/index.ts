import 'dotenv/config';
import cluster from 'node:cluster';
import { createServer } from 'node:http';
import { parseArgs, styleText } from 'node:util';
import { getServerConfig } from './config/serverConfig';
import { setupCluster } from './cluster/clusterManager';
import { createLoadBalancer } from './cluster/loadBalancer';
import { createSingleServer } from './server/singleServer';
import { createWorkerServer } from './server/workerServer';

const { values } = parseArgs({
  options: {
    multi: {
      type: 'boolean',
    },
  },
});

const isMultiMode = values.multi || false;

export const styledBalancer = styleText('cyanBright', 'Load Balancer')

if (isMultiMode && cluster.isPrimary) {
  const { WORKER_PORTS } = setupCluster();
  
  const loadBalancerRequestListener = createLoadBalancer(WORKER_PORTS);
  const loadBalancer = createServer(loadBalancerRequestListener);
  
  const { MULTI_PORT } = getServerConfig();
  loadBalancer.listen(MULTI_PORT, () => {
    console.log(`${styledBalancer} listening on port ${MULTI_PORT}`);
  });

  loadBalancer.on('error', (err) => {
    console.error(`${styledBalancer} error: ${err}`);
    process.exit(1);
  });
} else if (cluster.isWorker) {
  createWorkerServer();
} else {
  createSingleServer();
}
