export const saveObject = (key, obj) => {
  const value = JSON.stringify(obj);
  saveToStorage(key, value);
};

export const getSavedObject = key => {
  const obj = getFromStorage(key);
  if (obj) {
    return JSON.parse(obj);
  }
  return null;
};

const saveToStorage = (key, value) => {
  if (window.localStorage) {
    window.localStorage.setItem(key, value);
  }
};

const getFromStorage = key => {
  if (window.localStorage) {
    const intervals = localStorage.getItem(key);
    if (intervals) {
      return intervals;
    }
    return null;
  }
  return null;
};
