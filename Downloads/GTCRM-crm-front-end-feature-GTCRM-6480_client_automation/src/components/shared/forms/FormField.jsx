import React from "react";
import { FormControl, TextField } from "@mui/material";

import "../../../styles/FormField.css";

const FormField = ({
  value = "",
  placeholder = "",
  onChange = () => {},
  required = false,
  rows = 0,
  multiline = false,
  disabled,
  type = "text",
  helperText = "",
  error,
  label,
}) => {
  return (
    <FormControl fullWidth>
      <TextField
        label={label}
        helperText={helperText}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        multiline={multiline}
        type={type}
        size="small"
        className="form-field"
        disabled={disabled}
        InputProps={{
          classes: {
            notchedOutline: error
              ? "notched-outlined-error"
              : "notched-outlined",
            formControl: "text-field-control",
          },
        }}
        error={error}
        color="info"
      />
    </FormControl>
  );
};

export default FormField;
