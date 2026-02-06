import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import React from "react";

const SelectCounsellor = ({
  counsellorList,
  setSelectedCounsellorId,
  style,
  setSkipCounselorApiCall,
  loading,
}) => {
  return (
    <Autocomplete
      onOpen={() => {
        setSkipCounselorApiCall(false);
      }}
      sx={style}
      getOptionLabel={(option) => option?.name}
      options={counsellorList}
      onChange={(event, newValue) => {
        setSelectedCounsellorId(newValue?.id);
      }}
      loading={loading}
      id="combo-box-demo"
      renderInput={(params) => (
        <TextField
          fullWidth
          required
          {...params}
          label="Select Counselor"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="info" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
          color="info"
        />
      )}
    />
  );
};

export default SelectCounsellor;
