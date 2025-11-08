import 'dotenv/config';
import { createServer } from 'node:http';
import { route } from './router/router';
import { IncomingMessage, ServerResponse } from 'node:http';
import { sendNotFoundResponse } from './handler/send-response';

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
