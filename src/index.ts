import 'dotenv/config';
import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http';
import {
  sendGenericResponse,
  sendNotFoundResponse,
} from './handler/send-response';
import { route } from './router/router';
import { MESSAGE } from './consts/messages';

const PORT = Number(process.env.SINGLE_PORT) || 4000;

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
      sendGenericResponse(response, 500, MESSAGE.UNKNOWN_ERROR);
    }
  });

  request.on('error', (err) => {
    console.error(err);
  });
};

const SERVER = createServer(requestListener);
SERVER.listen(PORT);
