import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const HeadingText = ({ text, title }) => {
  return (
    <Box className="heading-texts">
      <Typography sx={{ textWrap: "wrap" }} variant="body2">
        <Typography variant="subtitle2"> {title} :</Typography> {text}
      </Typography>
    </Box>
  );
};

export default HeadingText;
