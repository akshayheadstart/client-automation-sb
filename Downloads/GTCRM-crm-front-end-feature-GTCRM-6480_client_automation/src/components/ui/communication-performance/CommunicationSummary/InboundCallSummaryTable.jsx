import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import LeadNameAndApplicationId from "./LeadNameAndApplicationId";
import ShowCallRecording from "./ShowCallRecording";
import AssignApplicationButton from "./AssignApplicationButton";
import { inboundCalDetailsTableHead } from "../../../../constants/LeadStageList";
import SortIndicatorWithTooltip from "../../../shared/SortIndicatorWithTooltip/SortIndicatorWithTooltip";
import QcStatus from "./QcStatus";
import QcScore from "./QcScore";

const InboundCallSummaryTable = ({
  tableData,
  setOpenCallRecording,
  sortingColumn,
  setSortingColumn,
  sortingType,
  setSortingType,
  setPhoneNumber,
  setCallRecordingFile,
  callLogDashboard,
}) => {
  return (
    <TableContainer className="custom-scrollbar">
      <Table className="call-summary-details-table">
        <TableHead>
          <TableRow>
            {inboundCalDetailsTableHead?.map((head) => (
              <>
                {callLogDashboard && head.hiddenInCallLog ? null : (
                  <TableCell key={head.name} width={head?.width}>
                    <Box
                      sx={{
                        justifyContent: head?.align ? "flex-start" : "center",
                      }}
                      className="sorting-option-with-header-content"
                    >
                      {head?.name}
                      {head?.sort && (
                        <>
                          <SortIndicatorWithTooltip
                            sortType={
                              sortingColumn === head?.name ? sortingType : ""
                            }
                            value={head?.name}
                            sortColumn={sortingColumn}
                            setSortType={setSortingType}
                            setSortColumn={setSortingColumn}
                          />
                        </>
                      )}
                    </Box>
                  </TableCell>
                )}
              </>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((callDetails) => (
            <TableRow
              key={callDetails?._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{callDetails?.call_instance}</TableCell>
              <TableCell align="center">
                {callDetails?.incoming_number}
              </TableCell>
              {!callLogDashboard && (
                <TableCell align="center">
                  {callDetails?.call_to_name}
                </TableCell>
              )}
              <TableCell align="center">
                {callDetails?.landing_number || "--"}
              </TableCell>
              <TableCell align="center">
                <span
                  className={`${callDetails?.call_status
                    ?.toLowerCase()
                    ?.split(" ")
                    ?.join("-")} common-status`}
                >
                  {" "}
                  {callDetails?.call_status}
                </span>
              </TableCell>
              <TableCell align="center">
                <ShowCallRecording
                  setOpenCallRecording={setOpenCallRecording}
                  callDetails={{
                    callId: callDetails?._id,
                    recording: callDetails?.recording,
                    phone: callDetails?.incoming_number,
                    duration: callDetails?.duration,
                  }}
                  setPhoneNumber={setPhoneNumber}
                  setCallRecordingFile={setCallRecordingFile}
                />
              </TableCell>
              {/* <TableCell align="center">      It will be implemented later stage
                <QcScore callDetails={callDetails} />
              </TableCell>
              <TableCell align="center">
                <QcStatus status={callDetails?.qc_status} />
              </TableCell> */}
              <TableCell>
                {callDetails?.application_id && callDetails?.student_id ? (
                  <LeadNameAndApplicationId
                    callDetails={{
                      custom_application_id: callDetails?.custom_application_id,
                      applicant_name: callDetails?.dialed_by,
                      application_id: callDetails?.application_id,
                      student_id: callDetails?.student_id,
                    }}
                  />
                ) : (
                  <AssignApplicationButton callDetails={callDetails} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InboundCallSummaryTable;
