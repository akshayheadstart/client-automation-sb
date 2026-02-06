import { Typography } from "@mui/material";
import React from "react";

const PanelTypeAndModerator = ({ property, value }) => {
  return (
    <>
      <Typography variant="caption">
        {property} :{" "}
        <Typography className={`${property} ${value}`} variant="caption">
          {value}
        </Typography>
      </Typography>
    </>
  );
};

export default PanelTypeAndModerator;
