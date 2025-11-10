import { type IncomingMessage, type ServerResponse } from 'node:http';
import { users } from '../db';
import { sendGenericResponse } from '../handler/sendResponse';
import { parseId } from '../utils/parseId';
import { validateUserId } from '../utils/validateUserId';

export const get = (
  request: IncomingMessage,
  response: ServerResponse<IncomingMessage>,
) => {
  const userId = parseId(request);

  if (userId) {
    const validation = validateUserId(userId);
    if (!validation.isValid) {
      return sendGenericResponse(response, 400, validation.error);
    }

    const userExist = users.getState().find((user) => user.id === userId);
    if (!userExist) {
      return sendGenericResponse(response, 404, `${userId} doesn't exist`);
    }

    return sendGenericResponse(response, 200, userExist);
  }

  sendGenericResponse(response, 200, users.getState());
};
