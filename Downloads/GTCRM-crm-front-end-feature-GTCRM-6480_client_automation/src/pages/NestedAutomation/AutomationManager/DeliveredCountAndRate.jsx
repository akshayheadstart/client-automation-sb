import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const DeliveredCountAndRate = ({ data }) => {
  return (
    <Box className="automation-delivered-and-count-container">
      <Typography>{data?.count}</Typography>
      <Typography>{data?.rate}</Typography>
    </Box>
  );
};

export default DeliveredCountAndRate;
