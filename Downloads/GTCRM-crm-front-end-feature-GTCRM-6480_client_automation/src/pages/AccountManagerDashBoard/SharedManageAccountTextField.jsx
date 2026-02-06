import { TextField } from "@mui/material";
import React from "react";

const SharedManageAccountTextField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  multiline,
  error,
  helperText,
  rows,
  size,
  required,
  color,
  ...props
}) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      variant="outlined"
      fullWidth
      required={required}
      size={size ? size : "small"}
      color={color?color:"info"}
      {...props}
      multiline={multiline?true:false}
      rows={rows}
    />
  );
};

export default SharedManageAccountTextField;
