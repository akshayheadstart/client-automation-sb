/* eslint-disable react-hooks/exhaustive-deps */
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/newtimeline.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../shared/Loader/LeefLottieAnimationLoader";
import { useSelector } from "react-redux";
import { customFetch } from "../../pages/StudentTotalQueries/helperFunction";
const EmailTemplateDialogUserProfile = ({
  handleEmailTemplateClose,
  openEmailTemplate,
  selectedEmailTemplateId,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [
    somethingWentWrongInEmailTemplate,
    setSomethingWentWrongInEmailTemplate,
  ] = useState(false);
  const [
    emailTemplateInternalServerError,
    setEmailTemplateInternalServerError,
  ] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [apiResponseData, setApiResponseData] = useState({});
  const [loading, setLoading] = useState(false);
  const pushNotification = useToasterHook();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  // Get Email Template
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  useEffect(() => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_API_BASE_URL
    }/templates/get_template_details?template_id=${
      selectedEmailTemplateId?.template_id
    }&template_type=${
      selectedEmailTemplateId?.template_type
    }&college_id=${collegeId}`;
    customFetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else if (result) {
          try {
            if (result) {
              setApiResponseData(result);
            } else {
              throw new Error("Get Email Template API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInEmailTemplate,
              "",
              10000
            );
          }
        }
      })
      .catch(() => {
        handleInternalServerError(
          setEmailTemplateInternalServerError,
          "",
          5000
        );
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedEmailTemplateId, selectedEmailTemplateId?.template_id]);
  return (
    <Dialog
      fullScreen={fullScreen}
      open={openEmailTemplate}
      onClose={handleEmailTemplateClose}
      aria-labelledby="responsive-dialog-title"
    >
      <Box className="comment-dialog-headline-box-container email-template-box-container-user">
        <Typography className="comment-dialog-headline-text">
          Email Template
        </Typography>
        <CloseIcon
          sx={{ cursor: "pointer" }}
          onClick={() => {
            handleEmailTemplateClose();
          }}
        />
      </Box>
      <DialogContent>
        {somethingWentWrongInEmailTemplate ||
        emailTemplateInternalServerError ? (
          <>
            {emailTemplateInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {somethingWentWrongInEmailTemplate && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </>
        ) : (
          <>
            {loading ? (
              <Box sx={{ display: "grid", placeItems: "center", my: 2 }}>
                <LeefLottieAnimationLoader
                  height={100}
                  width={100}
                ></LeefLottieAnimationLoader>
              </Box>
            ) : (
              <Box>
                <iframe
                  style={{ pointerEvents: "none" }}
                  srcDoc={apiResponseData?.content}
                  width="100%"
                  height={`${window.innerHeight * 0.6}px`}
                  title="new"
                ></iframe>
              </Box>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailTemplateDialogUserProfile;
