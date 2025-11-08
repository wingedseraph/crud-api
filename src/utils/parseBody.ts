export const parseBody = (body: string) => {
  const parsed = JSON.parse(body);
  const missingFieldsArray: string[] = [];

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
      condition: !hobbies || !Array.isArray(hobbies),
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
