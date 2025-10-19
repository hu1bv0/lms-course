export const getConfig = () => {
  return {
    apiUrl: import.meta.env.VITE_API_URL,
    webName: import.meta.env.VITE_WEB_NAME,
  };
};
