import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import React from "react";

const FieldMapping = ({
  options,
  loading,
  setCallFormFieldsApi,
  mappedField,
  setMappedField,
}) => {
  return (
    <Autocomplete
      id="asynchronous-demo"
      sx={{ width: "100%" }}
      onOpen={() => {
        setCallFormFieldsApi(true);
      }}
      onChange={(_, newValue) => {
        setMappedField(newValue);
      }}
      getOptionLabel={(option) => option.field_name}
      options={options}
      loading={loading}
      value={mappedField}
      renderInput={(params) => (
        <TextField
          color="info"
          {...params}
          label="Map with"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="info" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default FieldMapping;
