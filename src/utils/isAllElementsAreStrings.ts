export const isAllElementsAreStrings = (arr: string[]) => {
  if (!arr || !Array.isArray(arr)) return false;

  return arr.every((element) => typeof element === 'string');
};
