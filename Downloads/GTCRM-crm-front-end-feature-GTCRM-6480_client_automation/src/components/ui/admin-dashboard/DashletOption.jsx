import { Box, Switch, Typography } from "@mui/material";
import React from "react";

const DashletOption = ({ value, setValue, title }) => {
  return (
    <Box className="drawer-item">
      <Box className="drawer-item-left">
        <Typography color="textPrimary" variant="subtitle2">
          {title}
        </Typography>
        <Typography color="textPrimary" variant="body2">
          Please click on switch to view {title} Details.
        </Typography>
      </Box>
      <Box className="drawer-item-right">
        <Switch checked={value} onChange={() => setValue(!value)} />
      </Box>
    </Box>
  );
};

export default DashletOption;
