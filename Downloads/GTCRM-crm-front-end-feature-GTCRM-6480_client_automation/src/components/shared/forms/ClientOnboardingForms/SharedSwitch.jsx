import { FormControlLabel, Switch } from "@mui/material";
import React from "react";

const SharedSwitch = ({ field, value, setFieldValue }) => {
  return (
    <FormControlLabel
      labelPlacement="start"
      label={field.label}
      control={
        <Switch
          color="info"
          checked={value}
          onChange={(e) => {
            setFieldValue(field.name, e.target?.checked);
          }}
          name={field.name}
        />
      }
    />
  );
};

export default SharedSwitch;
