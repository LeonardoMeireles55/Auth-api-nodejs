export const tokenCache = () => {
  const hashMap = new Map();

  setInterval(() => {
    hashMap.clear();
    console.log("Cache cleared");
  }, 300000);

  return hashMap;
};
