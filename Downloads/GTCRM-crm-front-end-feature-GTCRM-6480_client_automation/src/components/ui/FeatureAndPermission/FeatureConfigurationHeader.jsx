import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

const FeatureConfigurationHeader = ({
  title,
  autoCompleteLabel,
  autoCompleteValue,
  setAutoCompleteValue,
  autoCompleteOptions,
  collegeLists,
  setSelectedCollege,
  selectedCollege,
  from,
  handleApply,
}) => {
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Autocomplete
          getOptionLabel={(option) => option?.label || "N/A"}
          value={autoCompleteValue?.value}
          onChange={(_, value) => {
            setAutoCompleteValue(value);
          }}
          disablePortal
          options={autoCompleteOptions}
          sx={{ width: 300, mt: 3, mb: 2 }}
          renderInput={(params) => (
            <TextField color="info" {...params} label={autoCompleteLabel} />
          )}
        />

        {from === "admin-dashboard" && (
          <>
            <Autocomplete
              getOptionLabel={(option) => option?.label || "N/A"}
              value={selectedCollege?.value}
              onChange={(_, value) => {
                setSelectedCollege(value);
              }}
              disablePortal
              options={collegeLists}
              sx={{ width: 300, mt: 3, mb: 2 }}
              renderInput={(params) => (
                <TextField color="info" {...params} label="Select College" />
              )}
            />
            <Button
              variant="contained"
              color="info"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                handleApply();
              }}
              disabled={autoCompleteValue?.value ? false : true}
            >
              Apply
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default FeatureConfigurationHeader;
