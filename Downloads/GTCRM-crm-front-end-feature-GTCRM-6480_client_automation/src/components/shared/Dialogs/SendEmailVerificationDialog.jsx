import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import React from "react";
import { Modal, Button as ButtonRsuite } from "rsuite";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import Error500Animation from "../ErrorAnimation/Error500Animation";
import useToasterHook from "../../../hooks/useToasterHook";
import { useState } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useContext } from "react";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { customFetch } from "../../../pages/StudentTotalQueries/helperFunction";

const SendEmailVerificationDialog = ({
  open,
  handleClose,
  selectedEmails,
  setSelectedApplications,
  localStorageKey,
}) => {
  const currentUserCollegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const tokenState = useSelector((state) => state.authentication.token);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const pushNotification = useToasterHook();
  const [
    sendVerificationEmailInternalServerError,
    setSendVerificationEmailInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInSendVerificationEmail,
    setSomethingWentWrongInSendVerificationEmail,
  ] = useState(false);
  const [sendVerificationEmailLoading, setSendVerificationEmailLoading] =
    useState(false);
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const sendVerificationEmail = () => {
    setSendVerificationEmailLoading(true);
    if (import.meta.env.VITE_ACCOUNT_TYPE === "demo") {
      pushNotification("success", "Successfully sent Verification mail !");
      setSendVerificationEmailLoading(false);
      handleClose();
    } else {
      customFetch(
        `${import.meta.env.VITE_API_BASE_URL}/student/email/verification/?${
          tokenState?.user_id ? `user_id=${tokenState?.user_id}` : ""
        }${tokenState?.user_id ? `&` : ""}college_id=${
          currentUserCollegeId ? currentUserCollegeId : ""
        }`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedEmails),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data?.message) {
            try {
              if (typeof data?.message === "string") {
                pushNotification("success", data?.message);
                setSelectedApplications([]);
                localStorage.removeItem(
                  `${Cookies.get("userId")}${localStorageKey}`
                );
              } else {
                throw new Error(
                  "send verification email api response has been changed."
                );
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInSendVerificationEmail,
                "",
                5000
              );
            }
          } else if (data?.detail) {
            pushNotification("error", data.detail);
          }
        })
        .catch(() => {
          handleInternalServerError(
            setSendVerificationEmailInternalServerError,
            "",
            5000
          );
        })
        .finally(() => {
          handleClose();
          setSendVerificationEmailLoading(false);
        });
    }
  };

  return (
    <Dialog
      sx={{
        zIndex: 2001,
      }}
      maxWidth={"md"}
      open={open}
    >
      {sendVerificationEmailInternalServerError ||
      somethingWentWrongInSendVerificationEmail ? (
        <Box>
          {sendVerificationEmailInternalServerError && (
            <Error500Animation height={400} width={400} />
          )}
          {somethingWentWrongInSendVerificationEmail && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          <DialogContent>
            {sendVerificationEmailLoading && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress value={30} color="info" />
              </Box>
            )}
            <DialogContentText id="alert-dialog-description">
              Are you sure , you want to send verification link?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Modal.Footer>
              <ButtonRsuite
                onClick={sendVerificationEmail}
                appearance="primary"
              >
                Send
              </ButtonRsuite>
              <ButtonRsuite onClick={handleClose} appearance="subtle">
                Cancel
              </ButtonRsuite>
            </Modal.Footer>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default SendEmailVerificationDialog;
