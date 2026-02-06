import { Autocomplete, TextField } from "@mui/material";
import React from "react";

const SelectOption = ({
  required,
  size,
  label,
  width,
  options,
  onChange,
  value,
  getOptionLabel,
}) => {
  return (
    <Autocomplete
      getOptionLabel={getOptionLabel}
      onChange={onChange}
      options={options?.length ? options : []}
      size={size}
      sx={{ width: width }}
      value={value}
      renderInput={(params) => (
        <TextField required={required} {...params} label={label} 
        sx={{
          '& label': {
            color: 'white !important',
          },
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'white', 
            },
            '& fieldset': {
              borderColor: 'white !important',
              color: 'white !important',
            },
          },
        }} />
      )}
    />
  );
};

export default SelectOption;
