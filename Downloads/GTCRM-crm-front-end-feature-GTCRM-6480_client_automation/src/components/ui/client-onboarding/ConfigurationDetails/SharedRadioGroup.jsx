import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";

const SharedRadioGroup = ({
  label,
  name,
  options,
  setJunoOption,
  junoOption,
  formik,
}) => {
  const handleRadioChange = (event) => {
    const resetFields = [
      "juno_erp.first_url.authorization",
      "juno_erp.first_url.juno_url",
      "juno_erp.prog_ref",
      "juno_erp.second_url.authorization",
      "juno_erp.second_url.juno_url"
    ];
  
    resetFields.forEach((field) => {
      formik.setFieldValue(field, "");  
      formik.setFieldTouched(field, false);
      formik.setFieldError(field, undefined);
    });
    setJunoOption(event.target.value);
  };
  return (
    <Grid item md={12}>
      <FormControl>
        <FormLabel id={`${name}-label`} color="info">
          {label}
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby={`${name}-label`}
          name={name}
          value={junoOption}
          onChange={handleRadioChange}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio color="info" />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Grid>
  );
};

export default SharedRadioGroup;
