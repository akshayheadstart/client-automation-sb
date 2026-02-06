import { TextField } from "@mui/material";
import React from "react";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

function SharedTextField({
  field,
  value,
  onChange,
  size,
  setFieldValue,
  handleBlur,
  isFieldError,
  isFieldTouched,
}) {
  return (
    <TextField
      type={field?.type}
      size={size}
      name={field.name}
      value={value}
      onChange={onChange}
      color="info"
      fullWidth={true}
      multiline={field?.multiline}
      rows={field?.rows}
      variant={field?.variant}
      label={field?.label}
      required={field?.required}
      readonly={field?.readonly}
      onKeyDown={(e) => field?.readonly && e.preventDefault()}
      onBlur={handleBlur}
      error={isFieldTouched && Boolean(isFieldError)}
      helperText={isFieldTouched && isFieldError}
      InputProps={{
        endAdornment: field?.type === "file" && (
          <label htmlFor={field.name}>
            <input
              onBlur={handleBlur}
              onChange={(event) => {
                setFieldValue(field.name, event.currentTarget.files[0]);
              }}
              id={field.name}
              style={{ width: 0 }}
              type="file"
            />
            <CloudUploadOutlinedIcon sx={{ cursor: "pointer" }} color="info" />
          </label>
        ),
      }}
      InputLabelProps={{
        shrink: field?.type === "file" && value ? true : undefined,
      }}
    />
  );
}

export default SharedTextField;
