import { TextField } from "@mui/material";
import React, { useState } from "react";

const ClientRegTextField = ({
  value,
  setValue,
  label,
  type,
  keyDown,
  required,
  preview,
  sx,
  multiline,
  rows,
  size,
  InputProps,
  InputLabelProps,
  reset,
}) => {
  const [isError, setIsError] = useState(false);

  return (
    <TextField
      size={size}
      color="info"
      rows={rows}
      multiline={multiline}
      InputProps={{
        readOnly: preview,
        ...InputProps,
      }}
      required={required === false ? required : true}
      sx={sx ? sx : { mt: 3 }}
      fullWidth
      label={label}
      error={isError}
      type={type}
      value={value}
      helperText={
        isError &&
        (label === "How many preference You want"
          ? "Preference Should be greater than 1"
          : "Mobile Number Should be 10 Digit.")
      }
      onKeyDown={keyDown && keyDown}
      onChange={(event) => {
        setValue(event.target.value);

        if (
          label === "POC Mobile Number" &&
          event.target.value?.length !== 10
        ) {
          setIsError(true);
        } else {
          setIsError(false);
        }
        if (
          label === "How many preference You want" &&
          event.target.value <= 1
        ) {
          setIsError(true);
        } else {
          setIsError(false);
        }

        reset && reset();
      }}
      InputLabelProps={InputLabelProps}
    />
  );
};

export default React.memo(ClientRegTextField);
