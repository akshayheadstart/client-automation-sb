import { Box, TableCell, TableRow } from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const CounsellorProductivityTableRow = ({
  counsellorProductivityReportData,
  checkOverallActivities,
  checkLeadEngagedOverall,
  checkEmailSent,
  checkLeadNotEngaged,
  checkLeadEngagedPercentage,
  checkUntouchedStage,
}) => {
  const navigate = useNavigate()
  return (
    <>
      {counsellorProductivityReportData?.map((row) => (
        <TableRow
          key={row?.counselor_id}
          sx={{
            "&:last-child td, &:last-child th": { border: 0 },
          }}
          className="common-table-row"
        >
          <TableCell component="th" scope="row" className="common-table-first-column">
            <Box

              onClick={() => {
                navigate("/application-manager", {
                  state: {
                    counselorId: row?.counselor_id
                  }
                })
              }

              }
              style={{ textTransform: "capitalize" }}
            >
              <Link to=""> {row?.counselor_name ? row?.counselor_name : `– –`}</Link>
            </Box>
          </TableCell>
          <TableCell align="center">{row?.lead_assigned ? row?.lead_assigned : 0}</TableCell>
          <TableCell align="center">{row?.payment_approved ? row?.payment_approved : 0}</TableCell>
          <TableCell align="center">{row?.application_submitted ? row?.application_submitted : 0}</TableCell>
          <TableCell align="center">{row?.queries ? row?.queries : 0}</TableCell>
          {checkOverallActivities && <TableCell align="center">{row?.overall_activities ? row?.overall_activities : 0}</TableCell>}
          {checkLeadEngagedOverall && <TableCell align="center">{row?.lead_engaged_overall ? row?.lead_engaged_overall : 0}</TableCell>}
          {checkLeadNotEngaged && <TableCell align="center">{row?.leads_not_engaged ? row?.leads_not_engaged : 0}</TableCell>}
          {checkLeadEngagedPercentage && <TableCell align="center">{row?.percentage_of_leads_engagement ? row?.percentage_of_leads_engagement : 0} %</TableCell>}
          {checkUntouchedStage && <TableCell align="center">{row?.untouched_stage ? row?.untouched_stage : 0}</TableCell>}
          {checkEmailSent && <TableCell align="center">{row?.email_sent ? row?.email_sent : 0}</TableCell>}
        </TableRow>
      ))}
    </>
  );
};

export default CounsellorProductivityTableRow;
