import { type IncomingMessage, type ServerResponse } from 'node:http';
import { MESSAGE } from '../consts/messages';
import { users } from '../db';
import { sendGenericResponse } from '../handler/send-response';
import { parseBody } from '../utils/parseBody';

export const post = (
  _request: IncomingMessage,
  response: ServerResponse<IncomingMessage>,
  body: string,
) => {
  const { parsed, missingFieldsArray, error } = parseBody(body);
  if (error) {
    return sendGenericResponse(response, 400, MESSAGE.INVALID_JSON_BODY);
  }

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

  const user = users.getState();
  const newUser = user[user.length - 1];

  return sendGenericResponse(response, 201, newUser);
};
