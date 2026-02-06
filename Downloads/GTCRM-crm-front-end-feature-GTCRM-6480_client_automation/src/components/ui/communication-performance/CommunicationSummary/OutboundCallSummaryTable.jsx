import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import LeadNameAndApplicationId from "./LeadNameAndApplicationId";
import ShowCallRecording from "./ShowCallRecording";
import { outboundCalDetailsTableHead } from "../../../../constants/LeadStageList";
import SortIndicatorWithTooltip from "../../../shared/SortIndicatorWithTooltip/SortIndicatorWithTooltip";
import QcStatus from "./QcStatus";
import QcScore from "./QcScore";

const OutboundCallSummaryTable = ({
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
            {outboundCalDetailsTableHead?.map((head) => (
              <>
                {callLogDashboard && head.hiddenInCallLog ? null : (
                  <TableCell
                    sx={{ minWidth: `${head?.width} !important` }}
                    key={head?.name}
                  >
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
              <TableCell align="center">{callDetails?.dialed_number}</TableCell>
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
                    phone: callDetails?.dialed_number,
                    duration: callDetails?.duration,
                  }}
                  setPhoneNumber={setPhoneNumber}
                  setCallRecordingFile={setCallRecordingFile}
                />
              </TableCell>
              {!callLogDashboard && (
                <TableCell align="center">{callDetails?.dialed_by}</TableCell>
              )}
              {/* <TableCell align="center">    It will be implemented later stage
                <QcScore callDetails={callDetails} />
              </TableCell>
              <TableCell align="center">
                <QcStatus status={callDetails?.qc_status} />
              </TableCell> */}
              <TableCell>
                <LeadNameAndApplicationId
                  callDetails={{
                    custom_application_id: callDetails?.custom_application_id,
                    applicant_name: callDetails?.call_to_name,
                    application_id: callDetails?.application_id,
                    student_id: callDetails?.student_id,
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OutboundCallSummaryTable;
