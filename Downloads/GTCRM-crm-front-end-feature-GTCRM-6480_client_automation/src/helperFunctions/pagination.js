import Cookies from "js-cookie";

export const handleChangePage = (
  newPage,
  localStorageKeyName,
  setPage,
  setCallAPI
) => {
  setPage(newPage);
  localStorageKeyName &&
    localStorage.setItem(
      `${Cookies.get("userId")}${localStorageKeyName}`,
      newPage
    );
  setCallAPI && setCallAPI(true);
};

export const handleChangeRowsPerPage = (
  newValue,
  rowCount,
  page,
  setPage,
  localStorageChangeRowPerPage,
  localStorageChangePage,
  setRowsPerPage,
  setCallAPI
) => {
  const checkPageAvailability = Math.ceil(rowCount / parseInt(newValue));
  if (page < checkPageAvailability) {
    setRowsPerPage(parseInt(newValue));
    localStorage.setItem(
      `${Cookies.get("userId")}${localStorageChangeRowPerPage}`,
      parseInt(newValue)
    );
  } else {
    setPage(checkPageAvailability);
    localStorage.setItem(
      `${Cookies.get("userId")}${localStorageChangePage}`,
      checkPageAvailability
    );
    setRowsPerPage(parseInt(newValue));
    localStorage.setItem(
      `${Cookies.get("userId")}${localStorageChangeRowPerPage}`,
      parseInt(newValue)
    );
  }
  setCallAPI && setCallAPI(true);
};
