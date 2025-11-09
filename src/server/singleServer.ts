import { createServer } from 'node:http';
import { styleText } from 'node:util';
import { getServerConfig } from '../config/serverConfig';
import { createRequestListener } from '../requestHandler';

const styledSingle = styleText('greenBright', 'Single');

export const createSingleServer = () => {
  const { SINGLE_PORT } = getServerConfig();

  const requestListener = createRequestListener();
  const server = createServer(requestListener);

  server.listen(SINGLE_PORT, () => {
    console.log(
      `${styledSingle} process listening on port ${SINGLE_PORT} (PID: ${process.pid})`,
    );
  });

  server.on('error', (err) => {
    console.error(`${styledSingle} error: ${err}`);
    process.exit(1);
  });

  return server;
};
