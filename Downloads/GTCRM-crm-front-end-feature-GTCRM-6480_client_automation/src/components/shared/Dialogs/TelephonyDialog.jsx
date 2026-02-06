/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Card, CircularProgress, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import "../../../styles/telephony.css";
import RemoveIcon from "@mui/icons-material/Remove";
import OutboundIcon from "../../../icons/OutboundIcon";
import InboundIcon from "../../../icons/InboundIcon";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import SearchApplicationInputField from "../../ui/communication-performance/CommunicationSummary/SearchApplicationInputField";
import DraggableDialog from "./DraggableDialog";
import AddLeadDialog from "../../ui/application-manager/AddLeadDialog";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import useToasterHook from "../../../hooks/useToasterHook";
import { useSaveAndDisposeCalMutation } from "../../../Redux/Slices/telephonySlice";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { useNavigate } from "react-router-dom";
import Error500Animation from "../ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import {
  enableOrDisableViewProfile,
  handleUpdateOngoingCallDuration,
  secondsToMMSS,
  shouldCallSave,
} from "../../../helperFunctions/telephonyHelperFunction";
import Draggable from "react-draggable";
const TelephonyDialog = () => {
  const [openAddLeadDialog, setOpenLeadDialog] = useState(false);
  const [loadingSaveCall, setLoadingSaveCall] = useState(false);
  // state of telephony
  const [minimizedCalls, setMinimizedCalls] = useState([]);
  const [activeCallDetails, setActiveCallDetails] = useState({});
  const [selectedApplication, setSelectedApplication] = useState({});
  const [searchedApplication, setSearchedApplication] = useState([]);

  const [prevSavedCallIDs, setPrevSavedCallIds] = useState([]);

  const [showTelephonyDialog, setShowTelephonyDialog] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const authAccessToken = Cookies.get("jwtTokenCredentialsAccessToken");
  const pushNotification = useToasterHook();

  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (activeCallDetails?.application_list?.length) {
      const selectedApplicationOption =
        activeCallDetails?.application_list?.map((list) => {
          return {
            program_name: `${list?.course} ${
              list?.specialization?.length ? `in ${list?.specialization}` : ""
            }`,
            custom_application_id: list?.custom_application_id,
            application_id: list?.application_id,
            student_id: activeCallDetails?.student_id,
          };
        });

      setSearchedApplication(selectedApplicationOption);
    }
  }, [activeCallDetails, showTelephonyDialog]);

  useEffect(() => {
    try {
      const socket = new WebSocket(
        `${import.meta.env.VITE_API_WEBSOCKET_URL}/call_initiation_popup?college_id=${collegeId}`
      );
      socket.onopen = () => {
        socket.send(JSON.stringify({ access_token: authAccessToken }));
      };
      socket.onmessage = (data) => {
        if (data?.data) {
          const callDetails = JSON.parse(data?.data)?.data;
          if (Array.isArray(callDetails)) {
            const disconnectedCalls = [];
            const activeCall = [];
            callDetails?.forEach((details) => {
              if (details?.is_call_end) {
                disconnectedCalls.push(details);
              } else {
                if (activeCall?.length === 0) {
                  activeCall.push(details);
                } else {
                  disconnectedCalls.push(details);
                }
              }
            });
            if (activeCall.length) {
              setActiveCallDetails(activeCall[0]);
              setShowTelephonyDialog(true);
            } else {
              setActiveCallDetails({});
              setShowTelephonyDialog(false);
            }
            setMinimizedCalls(disconnectedCalls);
          }
        }
      };

      return () => {
        socket.close();
      };
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMinimizeCall = () => {
    setShowTelephonyDialog(false);
    setMinimizedCalls([...minimizedCalls, activeCallDetails]);
    setSearchedApplication([]);
    setSelectedApplication({});
  };

  const [saveAndDisposeCal] = useSaveAndDisposeCalMutation();

  const handleCommonSaveCall = (payload, setLoadingSaveCall) => {
    setLoadingSaveCall && setLoadingSaveCall(true);

    saveAndDisposeCal({
      collegeId,
      payload,
    })
      .unwrap()
      .then((response) => {
        try {
          if (response?.message) {
            pushNotification("success", response?.message);
            setShowTelephonyDialog(false);
            setActiveCallDetails({});
            setPrevSavedCallIds((prev) => [...prev, payload?.call_id]);
          } else {
            throw new Error("Call save API response has been changed.");
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
        setLoadingSaveCall && setLoadingSaveCall(false);
      });
  };

  const handleSaveAndDisposeCall = () => {
    const payload = {
      call_id: activeCallDetails?.call_id,
    };
    if (selectedApplication?.application_id) {
      payload.application_id = selectedApplication?.application_id;
    }
    handleCommonSaveCall(payload, setLoadingSaveCall);
  };

  const handleApplyAction = () => {
    if (selectedApplication?.application_id) {
      if (activeCallDetails?.is_call_end) {
        handleSaveAndDisposeCall();
      } else {
        navigate("/userProfile", {
          state: {
            applicationId: selectedApplication?.application_id,
            studentId: selectedApplication?.student_id,
          },
        });
      }
    } else {
      if (
        !activeCallDetails?.is_student_exist &&
        activeCallDetails?.is_call_end
      ) {
        handleSaveAndDisposeCall();
      } else if (
        !activeCallDetails?.is_student_exist &&
        !activeCallDetails?.is_call_end
      ) {
        setOpenLeadDialog(true);
      }
    }
  };

  useEffect(() => {
    const updateCallDurations = () => {
      const now = new Date();
      const updatedDetails = minimizedCalls.map((call) => {
        if (shouldCallSave(call, now, prevSavedCallIDs)) {
          handleCommonSaveCall({ call_id: call?.call_id });
        }
        return handleUpdateOngoingCallDuration(call, now);
      });

      setMinimizedCalls(updatedDetails);

      const updatedActiveCallDetails = activeCallDetails?.call_id
        ? handleUpdateOngoingCallDuration(activeCallDetails, now)
        : activeCallDetails;
      setActiveCallDetails(updatedActiveCallDetails);

      if (shouldCallSave(activeCallDetails, now, prevSavedCallIDs)) {
        handleCommonSaveCall({ call_id: activeCallDetails?.call_id });
      }
    };
    if (minimizedCalls?.length || activeCallDetails?.call_id) {
      const intervalId = setInterval(updateCallDurations, 1000);

      return () => clearInterval(intervalId);
    }
  }, [minimizedCalls, activeCallDetails]);

  return (
    <>
      <Box
        sx={{ display: showTelephonyDialog ? "block" : "none" }}
        className="telephony-dialog-container"
      >
        <Draggable positionOffset={{ x: "-50%", y: "-50%" }}>
          <Card elevation={12}>
            {isInternalServerError || isSomethingWentWrong ? (
              <Box
                sx={{ minHeight: "20vh" }}
                className="common-not-found-container"
              >
                {isInternalServerError && (
                  <Error500Animation
                    height={200}
                    width={200}
                  ></Error500Animation>
                )}
                {isSomethingWentWrong && (
                  <ErrorFallback
                    error={apiResponseChangeMessage}
                    resetErrorBoundary={() => window.location.reload()}
                  />
                )}
              </Box>
            ) : (
              <Box sx={{ width: fullScreen ? "100%" : 330 }}>
                <Box className="telephony-dialog-header">
                  <Box className="telephony-minimize-icon">
                    <RemoveIcon onClick={handleMinimizeCall} />
                  </Box>
                  <Box className="telephony-dialog-heder-content">
                    <Typography>{activeCallDetails?.student_name}</Typography>
                    <Typography>
                      +91-{activeCallDetails?.student_phone}
                    </Typography>
                    <Box
                      sx={{
                        background: activeCallDetails?.is_call_end
                          ? "#E06259"
                          : "#00ac4f",
                      }}
                      className="telephony-call-status-with-second"
                    >
                      <Typography>
                        {activeCallDetails?.is_call_end
                          ? "Disconnected"
                          : "Ongoing"}
                      </Typography>
                      <Typography>|</Typography>
                      <Typography>
                        {secondsToMMSS(activeCallDetails?.duration)}
                      </Typography>
                    </Box>
                    <Box className="telephony-call-type-container">
                      {activeCallDetails?.call_type?.toLowerCase() ===
                      "outbound" ? (
                        <OutboundIcon />
                      ) : (
                        <InboundIcon />
                      )}
                      <Typography>{activeCallDetails?.call_type}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className="telephony-search-applicant-container">
                  <SearchApplicationInputField
                    searchedApplication={searchedApplication}
                    setSearchedApplication={setSearchedApplication}
                    selectedApplication={selectedApplication}
                    setSelectedApplication={setSelectedApplication}
                  />
                </Box>
                <Box className="telephony-action-container">
                  {loadingSaveCall ? (
                    <CircularProgress color="info" size={30} />
                  ) : (
                    <Button
                      onClick={handleApplyAction}
                      className="telephony-create-lead-btn"
                      disabled={enableOrDisableViewProfile(
                        activeCallDetails,
                        selectedApplication?.application_id
                      )}
                    >
                      {selectedApplication?.application_id
                        ? activeCallDetails?.is_call_end
                          ? "Save"
                          : "View Profile"
                        : !activeCallDetails?.is_student_exist &&
                          activeCallDetails?.is_call_end
                        ? "Save"
                        : !activeCallDetails?.is_student_exist &&
                          !activeCallDetails?.is_call_end
                        ? "Create Lead"
                        : "View Profile"}
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Card>
        </Draggable>
      </Box>
      <DraggableDialog
        setShowTelephonyDialog={setShowTelephonyDialog}
        setActiveCallDetails={setActiveCallDetails}
        minimizedCalls={minimizedCalls}
        setMinimizedCalls={setMinimizedCalls}
      />
      <AddLeadDialog
        setOpenLeadDialog={setOpenLeadDialog}
        openAddLeadDialog={openAddLeadDialog}
        callSource="Inbound Call"
        utmMedium="LANDING NUMBER"
        phoneNumber={activeCallDetails?.student_phone}
      />
    </>
  );
};

export default React.memo(TelephonyDialog);
