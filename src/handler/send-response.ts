import { IncomingMessage, ServerResponse } from 'node:http';
import { MESSAGE } from '../consts/messages';

export const sendGenericResponse = ({
  response,
  responseCode = 404,
  message = MESSAGE.UNKNOWN_ERROR,
}: {
  response: ServerResponse<IncomingMessage>;
  responseCode?: number;
  message?: 'Unknown Error' | undefined;
}) => {
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
