import React, { useContext, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { useSelector } from "react-redux";
import useToasterHook from "../../../hooks/useToasterHook";
import { useInitializeTelephonyCallMutation } from "../../../Redux/Slices/telephonySlice";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import Error500Animation from "../ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
const OutboundCallDialog = ({
  phoneNumber,
  openDialog,
  setOpenDialog,
  applicationId,
}) => {
  const [loadingCallInitialization, setLoadingCallInitialization] =
    useState(false);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const pushNotification = useToasterHook();

  const [initializeTelephonyCall] = useInitializeTelephonyCallMutation();

  const handleTelephonyCallInitiate = () => {
    setLoadingCallInitialization(true);
    initializeTelephonyCall({
      collegeId,
      payload: {
        student_phone: `+91${phoneNumber}`,
        application_id: applicationId || "",
      },
    })
      .unwrap()
      .then((response) => {
        try {
          if (response.message) {
            pushNotification("success", response.message);
            setOpenDialog(false);
          } else {
            throw new Error(
              "Outbound Call initialize API response has been changed."
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
        } else {
          handleInternalServerError(setIsInternalServerError, "", 10000);
        }
      })
      .finally(() => {
        setLoadingCallInitialization(false);
      });
  };

  return (
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      {isInternalServerError || isSomethingWentWrong ? (
        <Box sx={{ minHeight: "25vh" }} className="common-not-found-container">
          {isInternalServerError && (
            <Error500Animation height={200} width={200}></Error500Animation>
          )}
          {isSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <DialogContent sx={{ maxWidth: 250 }}>
          <DialogContentText>
            <Box className="call-initialize-confirmation-message">
              <InfoOutlinedIcon />
              <Typography>
                Do you want to initiate call on {phoneNumber}?
              </Typography>
            </Box>
          </DialogContentText>
          <Box className="outbound-call-initialize-action">
            <Button
              onClick={() => setOpenDialog(false)}
              className="common-outlined-button"
            >
              Cancel
            </Button>
            {loadingCallInitialization ? (
              <CircularProgress color="info" size={25} />
            ) : (
              <Button
                onClick={handleTelephonyCallInitiate}
                className="common-contained-button"
              >
                Call
              </Button>
            )}
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default OutboundCallDialog;
