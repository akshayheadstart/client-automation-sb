export const getDateMonthYear = (date) => {
  return `${new Date(date).getDate()} ${new Date(date).toLocaleString(
    "default",
    { month: "short" }
  )} ${new Date(date).getFullYear()}`;
};
