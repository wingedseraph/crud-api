import { type IncomingMessage, type ServerResponse } from 'node:http';
import { MESSAGE } from '../consts/messages';
import { sendGenericResponse } from '../handler/send-response';

const ROUTES_BY_METHOD = {
  GET: () => 'get',
  POST: () => 'post',
  PUT: () => 'put',
  DELETE: () => 'delete',
} as const;

export const route = (
  request: IncomingMessage,
  response: ServerResponse<IncomingMessage>,
) => {
  if (!(request || response)) return null;

  const { method, url } = request;

  const handler =
    method && ROUTES_BY_METHOD[method as keyof typeof ROUTES_BY_METHOD];

  if (handler) {
    console.log(request, response, url);
  } else {
    sendGenericResponse(response, 405, MESSAGE.METHOD_NOT_ALLOWED);
  }
};
