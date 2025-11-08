import { IncomingMessage, ServerResponse } from 'node:http';
import { MESSAGE } from '../consts/messages';

// todo: do we sure need to place it there? may be utils?
export const sendGenericResponse = (
  response: ServerResponse<IncomingMessage>,
  responseCode = 404,
  message?: string,
) => {
  if (!response) return null;

  response.writeHead(responseCode, { 'Content-Type': 'application/json' });
  return response.end(
    JSON.stringify({
      message: message ?? MESSAGE.RESOURCE_NOT_FOUND,
    }),
  );
};

export const sendNotFoundResponse = (
  response: ServerResponse<IncomingMessage>,
) => {
  if (!response) return null;

  response.writeHead(404, { 'Content-Type': 'application/json' });
  return response.end(
    JSON.stringify({
      message: MESSAGE.RESOURCE_NOT_FOUND,
    }),
  );
};
