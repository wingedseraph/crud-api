import { type IncomingMessage, type ServerResponse } from 'node:http';
import { MESSAGE } from '../consts/messages';
import { users } from '../db';
import { sendGenericResponse } from '../handler/sendResponse';
import { parseBody } from '../utils/parseBody';
import { parseId } from '../utils/parseId';
import { validateUserId } from '../utils/validateUserId';

export const put = (
  request: IncomingMessage,
  response: ServerResponse<IncomingMessage>,
  body: string,
) => {
  const userId = parseId(request);
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

  if (userId) {
    const validation = validateUserId(userId);
    if (!validation.isValid) {
      return sendGenericResponse(response, 400, validation.error);
    }

    const userExist = users.getState().find((user) => user.id === userId);
    if (!userExist) {
      return sendGenericResponse(response, 404, `${userId} doesn't exist`);
    }

    users.dispatch({
      type: 'UPDATE_USER',
      id: userId,
      user: parsed,
    });

    return sendGenericResponse(response, 200, parsed);
  }

  sendGenericResponse(response, 404);
};
