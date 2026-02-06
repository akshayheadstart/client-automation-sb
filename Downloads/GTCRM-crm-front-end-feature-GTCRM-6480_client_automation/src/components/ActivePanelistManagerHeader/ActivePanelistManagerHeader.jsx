/* eslint-disable jsx-a11y/img-redundant-alt */
import { Box, Typography } from "@mui/material";
import React from "react";

function TextTypes({ name }) {
  return (
    <Typography className="active-panelist-manager-text">{name}</Typography>
  );
}
const ActivePanelistManagerHeader = ({ photoURL, nameOne, nameTwo, value }) => {
  return (
    <Box>
      <img src={photoURL} alt="Image description" width="25px" height="25px" />
      <TextTypes name={nameOne} />
      <TextTypes name={nameTwo} />
      <Typography
        sx={{ fontWeight: 700 }}
        className="active-panelist-manager-value"
      >
        {value}
      </Typography>
    </Box>
  );
};

export default ActivePanelistManagerHeader;
