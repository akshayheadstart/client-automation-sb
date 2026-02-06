import { Box, Typography } from "@mui/material";
import React from "react";

function FieldTypeHelpText() {
  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Here Field Type indicates that which type of field it is. There can be
        several types of fields like:-
      </Typography>
      <ul>
        <li>text (to get text input)</li>
        <li>number (to get number input)</li>
        <li>email (to get email input)</li>
        <li>select (to get one item from multiple options)</li>
        <li>radio (to get yes or no option)</li>
      </ul>
      {/* Example:-  <img src="https://devassestssb.s3.ap-south-1.amazonaws.com/44d0f58023924de49a0a73f0f137a20a.png" width="100%" alt="help-img" />

            <Typography variant="body2" sx={{ mt: 1 }}>Here in the image, the field is a number field. It will accept only number.</Typography> */}
    </Box>
  );
}

export default FieldTypeHelpText;
