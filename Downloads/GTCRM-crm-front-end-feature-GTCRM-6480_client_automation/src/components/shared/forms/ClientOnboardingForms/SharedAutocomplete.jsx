import {
  Autocomplete,
  CircularProgress,
  TextField,
  Tooltip,
} from "@mui/material";
import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function SharedAutocomplete({
  field,
  setFieldValue,
  value,
  handleBlur,
  isFieldError,
  isFieldTouched,
  handleApiCall,
}) {
  return (
    <Autocomplete
      onOpen={handleApiCall}
      name={field.name}
      value={value}
      onChange={(_, newValue) => {
        setFieldValue(field.name, newValue);
      }}
      multiple={field?.multiple}
      limitTags={field?.limitTags}
      freeSolo={field?.freeSolo}
      options={field?.options}
      getOptionLabel={field.getOptionLabel}
      sx={{
        "& .MuiOutlinedInput-root": {
          paddingRight: "9px !important",
        },
      }}
      onBlur={handleBlur}
      loading={field.loading}
      renderInput={(params) => (
        <TextField
          error={isFieldTouched && Boolean(isFieldError)}
          helperText={isFieldTouched && isFieldError}
          sx={{ position: "relative" }}
          color="info"
          {...params}
          label={field?.label}
          required={field?.required}
          InputProps={{
            ...params.InputProps,
            endAdornment: field?.loading ? (
              <CircularProgress size={20} color="info" />
            ) : field?.info ? (
              <Tooltip title={field?.info} arrow placement="top">
                <InfoOutlinedIcon className="info-icon-position" color="info" />
              </Tooltip>
            ) : (
              params.InputProps.endAdornment
            ),
          }}
        />
      )}
    />
  );
}

export default React.memo(SharedAutocomplete);
