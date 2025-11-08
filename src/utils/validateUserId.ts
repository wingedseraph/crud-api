import { validate } from 'uuid';

export const validateUserId = (
  id: string,
): { isValid: boolean; error?: string } => {
  if (!validate(id)) {
    return { isValid: false, error: `${id} is not a valid uuid` };
  }
  return { isValid: true };
};
