/**
 * Helper for getting selected filters in different parts of code base,
 * improves readability
 * @param {*} dict
 * @returns
 */
export const getTrueKeys = (dict) => {
  return Object.keys(dict).filter((key) => dict[key]);
};

/**
 * Basically clears a filter to be all false
 * @param {*} dict
 * @returns
 */
export const setDictFalse = (dict) => {
  let dictCopy = { ...dict };

  for (const key in dictCopy) {
    dictCopy[key] = false;
  }
  return dictCopy;
};

export const setDictTrue = (dict) => {
  let dictCopy = { ...dict };

  for (const key in dictCopy) {
    dictCopy[key] = true;
  }
  return dictCopy;
};
