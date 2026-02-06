import { Autocomplete, TextField } from "@mui/material";
import React, { useRef } from "react";
import { handleChangeRowsPerPage } from "../../../helperFunctions/pagination";
import { phoneNumberValidation } from "../../../utils/validation";
import useToasterHook from "../../../hooks/useToasterHook";

const AutoCompletePagination = ({
  rowsPerPage,
  rowPerPageOptions,
  setRowsPerPageOptions,
  rowCount,
  page,
  setPage,
  localStorageChangeRowPerPage,
  localStorageChangePage,
  setRowsPerPage,
  setCallAPI,
}) => {
  const inputFieldRef = useRef(null);
  const pushNotification = useToasterHook();

  const maxRowsPerPageWarning = (value) => {
    pushNotification(
      "warning",
      `Maximum rows per page should be ${
        value > 200 ? "200 or less than 200" : rowCount
      }`
    );
  };
  const callChangeRowsPerPage = (newValue) => {
    if (newValue < 1) {
      return;
    }
    if (newValue > rowCount) {
      maxRowsPerPageWarning();
      return;
    }
    handleChangeRowsPerPage(
      newValue,
      rowCount,
      page,
      setPage,
      localStorageChangeRowPerPage,
      localStorageChangePage,
      setRowsPerPage,
      setCallAPI
    );
  };

  const handleKeyUp = (event) => {
    if (inputFieldRef.current) {
      const { value } = inputFieldRef.current.querySelector("input");
      if (value < 1) {
        event.preventDefault();
        return;
      }
      if (value > rowCount || value > 200) {
        event.preventDefault();
        maxRowsPerPageWarning(value);
        return;
      }
      if (event?.key === "Enter") {
        setRowsPerPageOptions((prev) => [...prev, value]);
        callChangeRowsPerPage(value);
      }
    }
  };

  return (
    <Autocomplete
      freeSolo
      disablePortal
      value={rowsPerPage}
      size="small"
      id="combo-box-demo"
      onChange={(event, newValue) => {
        if (event?.key !== "Enter") {
          callChangeRowsPerPage(newValue);
        }
      }}
      options={rowPerPageOptions}
      sx={{
        m: 1,
        ml: 1,
        mr: 2,
        p: 0,
        width: 70,
        "& .MuiAutocomplete-clearIndicator": {
          display: "none",
          pr: 0,
        },
        "& .MuiAutocomplete-popupIndicator": {
          fontSize: "5px",
          width: "15px",
          pr: 0,
        },
        "& .MuiOutlinedInput-root": {
          paddingRight: "0px !important",
        },
      }}
      renderInput={(params) => (
        <TextField
          ref={inputFieldRef}
          size="small"
          onKeyUp={(e) => handleKeyUp(e)}
          {...params}
          label="Row"
          type="number"
          onKeyDown={(e) => {
            phoneNumberValidation(e);
          }}
          color="info"
        />
      )}
    />
  );
};

export default AutoCompletePagination;
