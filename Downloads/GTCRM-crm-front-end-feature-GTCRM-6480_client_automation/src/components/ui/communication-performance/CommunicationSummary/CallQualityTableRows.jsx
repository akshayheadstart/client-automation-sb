import { TableCell, TableRow } from "@mui/material";
import React from "react";
import CallQualityTableData from "./CallQualityTableData";
import { secondsToMMSS } from "../../../../helperFunctions/telephonyHelperFunction";

const CallQualityTableRows = ({ details, indicator }) => {
  return (
    <TableRow>
      <TableCell>{details.counsellor_name}</TableCell>
      <TableCell align="center" sx={{ fontWeight: 700 }}>
        {details?.call_quality}%
      </TableCell>
      <TableCell align="center">
        <CallQualityTableData
          details={{
            value: details.avg_call_per_day,
            percentage:
              details.average_call_per_day_change_indicator
                ?.average_call_per_day_perc_indicator,
            performance:
              details.average_call_per_day_change_indicator
                ?.average_call_per_day_pos_indicator,
            indicator,
            tooltipText: "Average Call/Day",
          }}
        />
      </TableCell>
      <TableCell align="center">
        <CallQualityTableData
          details={{
            value: `${secondsToMMSS(details.average_duration)}s`,
            percentage:
              details.avg_duration_change_indicator
                ?.avg_duration_perc_indicator,
            performance:
              details.avg_duration_change_indicator?.avg_duration_pos_indicator,
            indicator,
            tooltipText: "Average Call Duration",
          }}
        />
      </TableCell>
      <TableCell align="center">
        <CallQualityTableData
          details={{
            value: details?.missed_call_count,
            percentage:
              details.missed_call_change_indicator?.missed_call_perc_indicator,
            performance:
              details.missed_call_change_indicator?.missed_call_pos_indicator,
            indicator,
            tooltipText: "Missed Call",
          }}
        />
      </TableCell>
    </TableRow>
  );
};

export default CallQualityTableRows;
