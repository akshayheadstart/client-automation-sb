export const checkEnvironment = () => {
  if (import.meta.env.VITE_API_ENVIRONMENT === "development") {
    if (import.meta.env.VITE_ACCOUNT_TYPE === "demo") {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};
