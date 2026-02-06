import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";

const FormRadioField = ({ value, setValue, label, styles, preview, reset }) => {
  return (
    <FormControl sx={styles} required disabled={preview}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup
        row
        value={value}
        onChange={(event) => {
          setValue(event.target.value === "true");
          reset && reset();
        }}
      >
        <FormControlLabel value={true} control={<Radio />} label="Yes" />
        <FormControlLabel value={false} control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
  );
};

export default React.memo(FormRadioField);
