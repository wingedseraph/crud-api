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

  if (url && url.startsWith('/api/users')) {
    route(request, response);
  } else {
    sendNotFoundResponse(response);
  }
};

const SERVER = createServer(requestListener);
SERVER.listen(PORT);
