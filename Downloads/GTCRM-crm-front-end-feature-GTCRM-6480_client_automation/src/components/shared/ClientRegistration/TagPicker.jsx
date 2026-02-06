import {
  Autocomplete,
  Chip,
  FormHelperText,
  Grid,
  TextField,
} from "@mui/material";
import React from "react";

const TagPicker = ({
  options,
  setOptions,
  helpText,
  label,
  preventLimit = 20,
  preview,
}) => {
  return (
    <Grid item xs={12} sm={12} md={12}>
      <Autocomplete
        multiple
        options={options}
        value={options}
        getOptionLabel={(option) => option}
        getOptionSelected={(option, value) => option === value}
        freeSolo
        readOnly={preview ? true : false}
        renderTags={(_, getTagProps) =>
          options.map((option, index) => (
            <Chip
              key={index}
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
            />
          ))
        }
        onChange={(_, newValue) => setOptions(newValue)}
        renderInput={(params) => (
          <TextField
            multiline
            onKeyDown={(e) =>
              options.length === preventLimit && e.preventDefault()
            }
            {...params}
            label={label}
            color="info"
          />
        )}
      />
      <FormHelperText sx={{ color: "#ffcc00" }}> {helpText}</FormHelperText>
    </Grid>
  );
};

export default TagPicker;
