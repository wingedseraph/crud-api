import { type IncomingMessage, type ServerResponse } from 'node:http';
import { validate } from 'uuid';
import { users } from '../db';
import { sendGenericResponse } from '../handler/send-response';
import { parseId } from '../utils/parseId';

const validateUserId = (id: string): { isValid: boolean; error?: string } => {
  if (!validate(id)) {
    return { isValid: false, error: `${id} is not a valid uuid` };
  }
  return { isValid: true };
};


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

    const userExist = users.find((user) => user.id === userId);
    if (!userExist) {
      return sendGenericResponse(response, 404, `${userId} doesn't exist`);
    }

    return sendGenericResponse(response, 200, [userExist]);
  }

  sendGenericResponse(response, 200, users);
};
