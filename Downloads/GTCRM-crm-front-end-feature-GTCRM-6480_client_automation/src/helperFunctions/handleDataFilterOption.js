import Cookies from "js-cookie";
//handle localStorage data filter option function
export const handleDataFilterOption = (value, pathname) => {
  const previousFilterOptions = JSON.parse(
    localStorage.getItem(`${Cookies.get("userId")}${pathname}`)
  );

  if (previousFilterOptions) {
    const newFilterOptions = { ...previousFilterOptions, ...value };
    localStorage.setItem(
      `${Cookies.get("userId")}${pathname}`,
      JSON.stringify(newFilterOptions)
    );
  } else {
    localStorage.setItem(
      `${Cookies.get("userId")}${pathname}`,
      JSON.stringify(value)
    );
  }
};
