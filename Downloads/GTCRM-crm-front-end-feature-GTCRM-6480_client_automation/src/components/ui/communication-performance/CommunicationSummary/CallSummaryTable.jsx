import { Box } from "@mui/material";
import React, { useState } from "react";
import OutboundCallSummaryTable from "./OutboundCallSummaryTable";
import InboundCallSummaryTable from "./InboundCallSummaryTable";
import CallRecordingDialog from "./CallRecordingDialog";
import LeefLottieAnimationLoader from "../../../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../../hooks/ErrorFallback";
import BaseNotFoundLottieLoader from "../../../shared/Loader/BaseNotFoundLottieLoader";

const CallSummaryTable = ({
  tabValue,
  tableData,
  isLoading,
  isInternalServerError,
  isSomethingWentWrong,
  apiResponseChangeMessage,
  sortingColumn,
  setSortingColumn,
  sortingType,
  setSortingType,
  callLogDashboard,
}) => {
  const [openCallRecording, setOpenCallRecording] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callRecordingFile, setCallRecordingFile] = useState("");
  return (
    <>
      {isLoading ? (
        <Box sx={{ minHeight: "40vh" }} className="common-not-found-container">
          <LeefLottieAnimationLoader
            height={100}
            width={100}
          ></LeefLottieAnimationLoader>
        </Box>
      ) : (
        <>
          {isInternalServerError || isSomethingWentWrong ? (
            <Box
              sx={{ minHeight: "35vh" }}
              className="common-not-found-container"
            >
              {isInternalServerError && (
                <Error500Animation height={300} width={300}></Error500Animation>
              )}
              {isSomethingWentWrong && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </Box>
          ) : (
            <>
              {tableData?.length === 0 ? (
                <Box className="loading-animation-for-notification">
                  <BaseNotFoundLottieLoader
                    noContainer={true}
                    width={250}
                    height={250}
                  />
                </Box>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {tabValue === 0 ? (
                    <OutboundCallSummaryTable
                      setOpenCallRecording={setOpenCallRecording}
                      setPhoneNumber={setPhoneNumber}
                      setCallRecordingFile={setCallRecordingFile}
                      tableData={tableData}
                      sortingColumn={sortingColumn}
                      setSortingColumn={setSortingColumn}
                      sortingType={sortingType}
                      setSortingType={setSortingType}
                      callLogDashboard={callLogDashboard}
                    />
                  ) : (
                    <InboundCallSummaryTable
                      setOpenCallRecording={setOpenCallRecording}
                      setPhoneNumber={setPhoneNumber}
                      setCallRecordingFile={setCallRecordingFile}
                      tableData={tableData}
                      sortingColumn={sortingColumn}
                      setSortingColumn={setSortingColumn}
                      sortingType={sortingType}
                      setSortingType={setSortingType}
                      callLogDashboard={callLogDashboard}
                    />
                  )}
                  <CallRecordingDialog
                    openDialog={openCallRecording}
                    setOpenDialog={setOpenCallRecording}
                    phoneNumber={phoneNumber}
                    callRecordingFile={callRecordingFile}
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default CallSummaryTable;
