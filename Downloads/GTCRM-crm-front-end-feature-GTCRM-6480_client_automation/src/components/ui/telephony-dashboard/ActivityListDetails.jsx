import { Checkbox, TableCell, TableRow } from "@mui/material";
import React from "react";
import { singleCheckboxHandlerFunction } from "../../../helperFunctions/checkboxHandleFunction";
import { statusWithColor } from "../../../constants/LeadStageList";
import { secondsToMMSS } from "../../../helperFunctions/telephonyHelperFunction";
import CounsellorNameAndCheckoutTime from "./CounsellorNameAndCheckoutTime";
function ActivityListDetails({
  details,
  selectedCounsellorID,
  setSelectedCounsellorID,
  callActivityDateRange,
}) {
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      {callActivityDateRange?.length === 0 && (
        <TableCell className="table-row-sticky" align="center">
          <Checkbox
            sx={{
              color: statusWithColor[details?.counsellor_status],
              "&.Mui-checked": {
                color: statusWithColor[details?.counsellor_status],
              },
            }}
            checked={selectedCounsellorID?.includes(details?.id) ? true : false}
            onChange={(e) => {
              singleCheckboxHandlerFunction(
                e,
                details?.id,
                "",
                selectedCounsellorID,
                setSelectedCounsellorID
              );
            }}
          />
        </TableCell>
      )}

      <TableCell>
        <CounsellorNameAndCheckoutTime
          callActivityDateRange={callActivityDateRange}
          details={details}
        />
      </TableCell>
      <TableCell align="center">
        {secondsToMMSS(details?.check_in_duration_sec || 0)}
      </TableCell>
      <TableCell align="center">
        {secondsToMMSS(details?.talk_time || 0)}
      </TableCell>
      <TableCell align="center">{secondsToMMSS(details?.aht || 0)}</TableCell>
      <TableCell align="center">
        {secondsToMMSS(details?.ideal_duration || 0)}
      </TableCell>
      <TableCell align="center">
        {secondsToMMSS(details?.check_out_duration_sec || 0)}
      </TableCell>
      {callActivityDateRange?.length === 0 && (
        <>
          <TableCell align="center">
            {details?.last_call_time || "--"}
          </TableCell>
          <TableCell align="center">
            {details?.first_check_in || "--"}
          </TableCell>
          <TableCell align="center">
            {details?.last_check_out || "--"}
          </TableCell>
        </>
      )}
    </TableRow>
  );
}

export default ActivityListDetails;
