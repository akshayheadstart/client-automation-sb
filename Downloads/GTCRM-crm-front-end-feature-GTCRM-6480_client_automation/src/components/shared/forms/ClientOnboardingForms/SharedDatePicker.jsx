import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { TextField } from "@mui/material";

function SharedDatePicker({
  field,
  setFieldValue,
  value,
  handleBlur,
  isFieldError,
  isFieldTouched,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        disablePast={field.disablePast}
        name={field.name}
        value={value ? dayjs(value) : value}
        onChange={(value) =>
          setFieldValue(field.name, dayjs(value).format("YYYY-MM-DD"))
        }
        variant={field?.variant}
        label={field?.label}
        slots={{ textField: TextField }}
        slotProps={{
          textField: {
            required: field?.required,
            color: "info",
            fullWidth: true,
            error: Boolean(isFieldError) && isFieldTouched,
            helperText: isFieldTouched ? isFieldError : "",
            onBlur: handleBlur,
          },
        }}
      />
    </LocalizationProvider>
  );
}

export default SharedDatePicker;
