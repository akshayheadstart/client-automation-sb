import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { callQualityTableHeader } from "../../../../constants/LeadStageList";
import CallQualityTableRows from "./CallQualityTableRows";
import { secondsToMMSS } from "../../../../helperFunctions/telephonyHelperFunction";

const CallQualityTableDetails = ({
  callQualityDetails,
  indicator,
  sumOfCallQualityDetails,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer className="custom-scrollbar">
        <Table>
          <TableHead>
            <TableRow>
              {callQualityTableHeader.map((header, index) => (
                <TableCell align={index ? "center" : "left"} key={header}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {callQualityDetails.map((details) => (
              <CallQualityTableRows
                key={details}
                details={details}
                indicator={indicator}
              />
            ))}
            <TableRow sx={{ "&:last-child td": { border: 0 } }}>
              <TableCell sx={{ fontWeight: 700 }} colSpan={2}>
                Total
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                {sumOfCallQualityDetails?.total_call_count}
                <span className="empty-element"></span>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                {secondsToMMSS(sumOfCallQualityDetails?.total_call_duration)}s
                <span className="empty-element"></span>
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                {sumOfCallQualityDetails?.missed_call_count}
                <span className="empty-element"></span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CallQualityTableDetails;
