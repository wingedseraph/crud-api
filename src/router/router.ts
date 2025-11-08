import { type IncomingMessage, type ServerResponse } from 'node:http';
import { MESSAGE } from '../consts/messages';
import { get } from '../controllers/get';
import { sendGenericResponse } from '../handler/send-response';
import { post } from '../controllers/post';

const ROUTES_BY_METHOD = {
  GET: (request: IncomingMessage, response: ServerResponse<IncomingMessage>) =>
    get(request, response),
  POST: (
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage>,
    body: string,
  ) => post(request, response, body),
  PUT: () => 'put',
  DELETE: () => 'delete',
} as const;

export const route = (
  request: IncomingMessage,
  response: ServerResponse<IncomingMessage>,
  body: string,
) => {
  if (!(request || response)) return null;

  const { method } = request;

  const handler =
    method && ROUTES_BY_METHOD[method as keyof typeof ROUTES_BY_METHOD];

  if (handler) {
    handler(request, response, body);
  } else {
    sendGenericResponse(response, 405, MESSAGE.METHOD_NOT_ALLOWED);
  }
};
