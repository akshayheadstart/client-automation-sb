import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import AudioPlayIcon from "../../../../icons/audio-play-icon.svg";
import { useGetCallRecordingMutation } from "../../../../Redux/Slices/telephonySlice";
import { useSelector } from "react-redux";
import { DashboradDataContext } from "../../../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../../../utils/handleSomethingWentWrong";
import useToasterHook from "../../../../hooks/useToasterHook";
import { ErrorFallback } from "../../../../hooks/ErrorFallback";
const ShowCallRecording = ({
  setOpenCallRecording,
  callDetails,
  setCallRecordingFile,
  setPhoneNumber,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

  const [getCallRecording] = useGetCallRecordingMutation();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const handleGetCallRecording = () => {
    if (callDetails?.recording?.length) {
      setCallRecordingFile(callDetails?.recording);
      setPhoneNumber(callDetails?.phone);
      setOpenCallRecording(true);
    } else {
      setIsLoading(true);
      getCallRecording({
        callId: callDetails?.callId,
        collegeId,
      })
        .unwrap()
        .then((response) => {
          try {
            if (response?.recording) {
              setCallRecordingFile(response?.recording);
              setPhoneNumber(response?.dialed_number);
              setOpenCallRecording(true);
            } else {
              throw new Error(
                "Assign call to application API response has been changed."
              );
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
          }
        })
        .catch((error) => {
          if (error?.data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (error?.data?.detail) {
            pushNotification("error", error?.data?.detail);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  return (
    <Box className="call-audio-recording-container">
      <Typography>{callDetails?.duration || "--"}</Typography>
      <>
        {isSomethingWentWrong ? (
          <Box
            sx={{ minHeight: "20vh" }}
            className="common-not-found-container"
          >
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          </Box>
        ) : (
          <>
            {" "}
            {callDetails?.duration > 0 && (
              <>
                {" "}
                {isLoading ? (
                  <CircularProgress color="info" size={15} />
                ) : (
                  <img
                    onClick={handleGetCallRecording}
                    alt="audio-play-icon"
                    src={AudioPlayIcon}
                  />
                )}{" "}
              </>
            )}
          </>
        )}
      </>
    </Box>
  );
};

export default ShowCallRecording;
