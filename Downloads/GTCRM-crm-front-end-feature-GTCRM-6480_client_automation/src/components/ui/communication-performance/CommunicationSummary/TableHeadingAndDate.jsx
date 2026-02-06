import { Typography } from "@mui/material";
import React from "react";
import { getDateMonthYear } from "../../../../hooks/getDayMonthYear";

function TableHeadingAndDate({ title, dateRange }) {
  return (
    <>
      <Typography variant="h6">{title}</Typography>
      {dateRange?.length > 0 && (
        <Typography>
          {getDateMonthYear(dateRange[0])} - {getDateMonthYear(dateRange[1])}
        </Typography>
      )}
    </>
  );
}

export default TableHeadingAndDate;
