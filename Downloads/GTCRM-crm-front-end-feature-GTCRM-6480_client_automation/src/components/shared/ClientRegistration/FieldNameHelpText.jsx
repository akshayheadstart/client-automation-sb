import { Box, Typography } from "@mui/material";
import React from "react";

function FieldNameHelpText() {
  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Field Name indicates the placeholder of the form fields
      </Typography>
      {/* Example: <img src="https://devassestssb.s3.ap-south-1.amazonaws.com/e34c38acd00742d79f14e352513c5545.png" width="100%" alt="help-text-img" />
            <Typography variant="body2" sx={{ mt: 1 }}>Here in the image, "Your full Name" is the placeholder of this field.</Typography> */}
    </Box>
  );
}

export default FieldNameHelpText;
