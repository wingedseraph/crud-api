import { isAllElementsAreStrings } from './isAllElementsAreStrings';

export const parseBody = (body: string) => {
  const missingFieldsArray: string[] = [];

  let parsed = null;
  try {
    parsed = JSON.parse(body);
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
    return { parsed: null, missingFieldsArray, error: true };
  }

  const { username, age, hobbies } = parsed;

  const validations = [
    {
      condition: !parsed || !username,
      field: 'username (string)',
    },
    {
      condition: age === undefined || age === null || typeof age !== 'number',
      field: 'age (number)',
    },
    {
      condition: !isAllElementsAreStrings(hobbies),
      field: 'hobbies (array of strings)',
    },
  ];

  validations.forEach((validation) => {
    if (validation.condition) {
      missingFieldsArray.push(validation.field);
    }
  });

  if (missingFieldsArray.length > 0) {
    return { parsed, missingFieldsArray };
  }

  return { parsed, missingFieldsArray: [] };
};
