import 'dotenv/config';
import { createServer } from 'node:http';
import { route } from './router/router';
import { IncomingMessage, ServerResponse } from 'http';
import { MESSAGE } from './consts/messages';

const PORT = process.env.PORT;

const requestListener = (
  request: IncomingMessage,
  response: ServerResponse<IncomingMessage>,
) => {
  const { url } = request;

  if (url && url.startsWith('/api/users')) {
    route(request, response);
  } else {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: MESSAGE.RESOURCE_NOT_FOUND,
      }),
    );
  }
};

const SERVER = createServer(requestListener);
SERVER.listen(PORT);
