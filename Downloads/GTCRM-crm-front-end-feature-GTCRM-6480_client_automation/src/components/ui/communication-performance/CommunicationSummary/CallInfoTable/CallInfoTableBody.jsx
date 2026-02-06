import { TableBody, TableCell, TableRow } from "@mui/material";
import React from "react";
import { secondsToMMSS } from "../../../../../helperFunctions/telephonyHelperFunction";

export const CallInfoTableBody = ({ callInfoDetails, tabValue }) => {
  return (
    <TableBody>
      {callInfoDetails.map((details) => (
        <TableRow
          sx={{
            "&:last-child td": {
              border: 0,
            },
          }}
        >
          <TableCell>{details.counsellor_name}</TableCell>
          {tabValue === 0 && (
            <>
              <TableCell align="center">{details?.attempted_call}</TableCell>
              <TableCell align="center">{details?.connected_call}</TableCell>
            </>
          )}

          {tabValue === 1 && (
            <>
              <TableCell align="center">{details?.received_call}</TableCell>
              <TableCell align="center">{details?.missed_call}</TableCell>
            </>
          )}

          <TableCell align="center">
            {secondsToMMSS(details.duration)}
          </TableCell>
          <TableCell align="center">
            {secondsToMMSS(details?.average_duration)}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
