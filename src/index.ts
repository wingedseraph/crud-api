import 'dotenv/config';
import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http';
import { sendNotFoundResponse } from './handler/send-response';
import { route } from './router/router';

const PORT = process.env.SINGLE_PORT;

const requestListener = (
  request: IncomingMessage,
  response: ServerResponse<IncomingMessage>,
) => {
  const { url } = request;
  let body = '';
  request.on('data', (chunk) => (body += chunk));

  request.on('end', () => {
    try {
      if (url && url.startsWith('/api/users')) {
        route(request, response, body);
      } else {
        sendNotFoundResponse(response);
      }
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  });
};

const SERVER = createServer(requestListener);
SERVER.listen(PORT);
