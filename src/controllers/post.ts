import { type IncomingMessage, type ServerResponse } from 'node:http';
import { users } from '../db';
import { sendGenericResponse } from '../handler/send-response';
import { parseId } from '../utils/parseId';
import { parseBody } from '../utils/parseBody';
import { randomUUID } from 'node:crypto';

export const post = (
  request: IncomingMessage,
  response: ServerResponse<IncomingMessage>,
  body: string,
) => {
  const { parsed, missingFieldsArray } = parseBody(body);

  if (missingFieldsArray.length > 1) {
    return sendGenericResponse(
      response,
      400,
      `Request body is missing required fields: ${missingFieldsArray.join(', ')}.`,
    );
  }

  // todo: move to separate fn? do i need validate smh there?
  parsed.id = randomUUID();
  users.push(parsed);

  // return sendGenericResponse(response, 201, 'Created');
  return sendGenericResponse(response, 201, users);
};
