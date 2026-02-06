import { Box, Typography } from "@mui/material";
import React from "react";

const RequiredFieldTypeHelpText = () => {
  return (
    <Box sx={{ p: 1 }}>
      <Typography sx={{ mb: 1 }} variant="body2">
        {" "}
        Is Mandatory indicates that whether the field is mandatory or not. If
        the value is "Required" then it's mandatory and if "Optional" then it's
        not mandatory{" "}
      </Typography>

      {/* Example:- <img src="https://devassestssb.s3.ap-south-1.amazonaws.com/0c97f4ddba0747f88fccaa4b53fea5b5.png" width="100%" alt="help-img" />

            <Typography sx={{ mt: 1 }} variant="body2">Here in the above image, the appearance of * sign indicates that it's mandatory.</Typography> */}
    </Box>
  );
};

export default RequiredFieldTypeHelpText;

export const DependentFieldHelperText = () => {
  return (
    <Box sx={{ p: 1 }}>
      <Typography sx={{ mb: 1 }} variant="body2">
        {" "}
        Dependent Field indicates that some fields are dependent on this field's
        value. For example, if you have a "Country" field and you want to
        display "State" and "City" fields based on the selected country, then
        "State" and "City" fields will be dependent "Country" field.{" "}
      </Typography>
      <Typography variant="body2">
        The dependent fields are applicable for Radio and Select option field
      </Typography>
    </Box>
  );
};

export const ValidationHelperText = () => {
  return (
    <Box sx={{ p: 1 }}>
      <Typography sx={{ mb: 1 }} variant="body2">
        Validations indicates that you can customize and configure the the
        acceptance criteria of the form field's value. For example: you can set
        the min, max character length of a text field and an meaningful error
        message in case the user's input doesn't match the acceptance criteria.
      </Typography>
      <Typography variant="body2">
        Along with the validation configurations, you can view and edit the
        previously added validations of a particular form field.
      </Typography>
    </Box>
  );
};
