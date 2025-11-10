import { type IncomingMessage, type ServerResponse } from 'http';
import { users } from '../db';
import { sendGenericResponse } from '../handler/sendResponse';
import { parseId } from '../utils/parseId';
import { validateUserId } from '../utils/validateUserId';

export const delete_ = (
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

    users.dispatch({
      type: 'DELETE_USER',
      id: userId,
    });

    return sendGenericResponse(response, 204);
  }

  sendGenericResponse(response, 404);
};
