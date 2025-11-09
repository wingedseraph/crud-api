import { type IncomingMessage, type ServerResponse } from 'node:http';
import { users } from '../db';
import { sendGenericResponse } from '../handler/send-response';
import { parseBody } from '../utils/parseBody';

export const post = (
  _request: IncomingMessage,
  response: ServerResponse<IncomingMessage>,
  body: string,
) => {
  const { parsed, missingFieldsArray } = parseBody(body);

  if (missingFieldsArray.length > 0) {
    return sendGenericResponse(
      response,
      400,
      `Request body is missing required fields: ${missingFieldsArray.join(', ')}.`,
    );
  }

  users.dispatch({
    type: 'ADD_USER',
    user: parsed,
  });

  return sendGenericResponse(response, 201, parsed);
};
