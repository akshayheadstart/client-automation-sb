import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import dayjs from "dayjs";
const CalendarHeaderContent = ({
  handleView,
  handleArrowLeft,
  handleArrowRight,
  value,
  disableArrow,
}) => {
  return (
    <Box>
      <IconButton disabled={disableArrow?.left} onClick={handleArrowLeft}>
        <KeyboardArrowLeftIcon />
      </IconButton>
      <Typography onClick={handleView}>
        {value} <ArrowDropDownIcon />
      </Typography>{" "}
      <IconButton disabled={disableArrow?.right} onClick={handleArrowRight}>
        <KeyboardArrowRightIcon />
      </IconButton>
    </Box>
  );
};

export default CalendarHeaderContent;
