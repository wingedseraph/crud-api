export const parseBody = (body: string) => {
  const parsed = JSON.parse(body);
  const missingFieldsArray: string[] | null = [];

  if (!parsed.username) {
    missingFieldsArray.push('username (string)');
  }

  if (parsed.age === undefined || parsed.age === null) {
    missingFieldsArray.push('age (number)');
  }

  if (!parsed.hobbies) {
    missingFieldsArray.push('hobbies (array of strings)');
  }

  if (missingFieldsArray.length > 0) {
    return { parsed, missingFieldsArray };
  }
  return { parsed, missingFieldsArray: [] };
};
