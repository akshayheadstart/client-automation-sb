import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import IconDateRangePicker from "../../../components/shared/filters/IconDateRangePicker";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
const LeadProcessHeaderAndFilter = ({ setDateRange, dateRange }) => {
  return (
    <Box className="lead-process-details-header-container">
      <Box>
        <KeyboardArrowLeftIcon onClick={() => window.history.back()} />
        <Box sx={{ cursor: dateRange?.length ? "pointer" : "default" }}>
          <Typography variant="h6">Lead Processed</Typography>
          {dateRange?.length > 0 && (
            <Typography>
              {getDateMonthYear(dateRange[0])} -{" "}
              {getDateMonthYear(dateRange[1])}
            </Typography>
          )}
        </Box>
      </Box>
      <Box>
        <IconDateRangePicker
          dateRange={dateRange}
          onChange={(value) => setDateRange(value)}
        />
      </Box>
    </Box>
  );
};

export default LeadProcessHeaderAndFilter;
