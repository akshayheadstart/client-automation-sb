import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { ShowDate } from "./ShowDate";

const ListNameAndDate = ({ data }) => {
  return (
    <Box className="view-list-name-and-date-time-container">
      <Box>
        <Typography variant="h6">
          List Name :{" "}
          <Typography sx={{ display: "inline" }}>{data?.list_name}</Typography>
        </Typography>
      </Box>
      <Box className="view-student-list-date-time-container">
        <CalendarMonthOutlinedIcon />
        <Box>
          <ShowDate date={data?.created_at} />
        </Box>
      </Box>
    </Box>
  );
};

export default ListNameAndDate;
