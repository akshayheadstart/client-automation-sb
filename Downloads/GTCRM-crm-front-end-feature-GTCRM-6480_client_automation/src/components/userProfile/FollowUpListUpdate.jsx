import {
  Box,
  Button,
  CircularProgress,
  DialogContent,
  Tooltip,
} from "@mui/material";
import React, { useContext } from "react";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import TimeLine from "./TimeLine";
import BootstrapDialogTitle from "../shared/Dialogs/BootsrapDialogsTitle";
import { useSelector } from "react-redux";
import formatDateAndTime from "../../hooks/useDateAndTimeFormat";
import BaseNotFoundLottieLoader from "../shared/Loader/BaseNotFoundLottieLoader";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import SelectCounsellor from "../shared/SelectCounsellor/SelectCounsellor";
import SelectFollowupDate from "../shared/SelectFollowupDate/SelectFollowupDate";
import NoteTextField from "../shared/NoteTextField/NoteTextField";
import useToasterHook from "../../hooks/useToasterHook";
import { useUpdateFollowupMutation } from "../../Redux/Slices/applicationDataApiSlice";
import { followupUpdateApiInner } from "../../utils/followupUpdateApiInner";
import "../../styles/sharedStyles.css";

const FollowUpListUpdate = (props) => {
  const pushNotification = useToasterHook();
  const [isLoading, setIsLoading] = useState(false);
  const [followupDate, setFollowUpDate] = useState(new Date());
  const [assignedCounselorId, setAssignedCounselorId] = useState("");
  const [followupNote, setFollowupNote] = useState("");
  const [showDateError, setShowDateError] = useState(false);
  const [
    followUpListUpdateInternalServerError,
    setFollowUpListUpdateInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInFollowUpListUpdate,
    setSomethingWentWrongInFollowUpListUpdate,
  ] = useState(false);

  const tokenState = useSelector((state) => state.authentication.token);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [updateFollowupList] = useUpdateFollowupMutation();

  const handlePostFollowupData = (e) => {
    e.preventDefault();
    const formattedFollowupDateAndTime = formatDateAndTime(followupDate);
    const addFollowupData = {
      followup: {
        assigned_counselor_id:
          tokenState?.scopes?.[0] === "college_counselor"
            ? props?.counsellorList?.[0].id
            : assignedCounselorId,
        followup_date: formattedFollowupDateAndTime,
        followup_note: followupNote,
      },
    };

    setIsLoading(true);
    updateFollowupList({
      applicationId: props?.applicationId,
      followupData: addFollowupData,
      collegeId: collegeId,
      checkedValue: false,
    })
      .unwrap()
      .then((res) => {
        followupUpdateApiInner(
          res,
          pushNotification,
          props,
          setFollowupNote,
          setApiResponseChangeMessage,
          handleSomethingWentWrong,
          setSomethingWentWrongInFollowUpListUpdate
        );
      }
    )
      .catch(() => {
        handleInternalServerError(
          setFollowUpListUpdateInternalServerError,
          props?.handleCloseDialogs,
          5000
        );
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div>
      <Box className="Mobile-Date-Time-Picker-box">
        <Dialog
          onClose={() => {
            props?.handleCloseDialogs();
            setFollowupNote("");
            setFollowUpDate(new Date());
            setShowDateError(false);
          }}
          aria-labelledby="customized-dialog-title"
          open={props?.openDialogs}
          className="change-dialog-box-container"
        >
          <DialogContent
            className="vertical-scrollbar"
            sx={{
              backgroundColor: "background.paper",
              minHeight: "100%",
              p: "10px",
            }}
          >
            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <CircularProgress size={35} color="info" />
              </Box>
            )}

            <BootstrapDialogTitle
              color={"black"}
              id="customized-dialog-title"
              onClose={() => {
                props?.handleCloseDialogs();
                setFollowupNote("");
                setFollowUpDate(new Date());
                setShowDateError(false);
              }}
            >
              Add Followup
            </BootstrapDialogTitle>
            {followUpListUpdateInternalServerError ||
            props?.counsellorListInternalServerError ||
            props?.somethingWentWrongInCounsellorList ||
            somethingWentWrongInFollowUpListUpdate ? (
              <Box>
                {(followUpListUpdateInternalServerError ||
                  props?.counsellorListInternalServerError) && (
                  <Error500Animation
                    height={400}
                    width={400}
                  ></Error500Animation>
                )}
                {(props?.somethingWentWrongInCounsellorList ||
                  somethingWentWrongInFollowUpListUpdate) && (
                  <ErrorFallback
                    error={apiResponseChangeMessage}
                    resetErrorBoundary={() => window.location.reload()}
                  />
                )}
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    pb: 3,
                    px: 2,
                    display: props?.hideCounsellorList ? "none" : "block",
                  }}
                >
                  <form onSubmit={handlePostFollowupData}>
                    {(tokenState?.scopes?.[0] === "super_admin" ||
                      tokenState?.scopes?.[0] === "client_manager" ||
                      tokenState?.scopes?.[0] === "college_super_admin" ||
                      tokenState?.scopes?.[0] === "college_admin" ||
                      tokenState?.scopes?.[0] === "college_head_counselor") && (
                      <SelectCounsellor
                        loading={props?.loading}
                        setSkipCounselorApiCall={props?.setSkipCounselorApiCall}
                        counsellorList={props?.counsellorList}
                        setSelectedCounsellorId={setAssignedCounselorId}
                        style={{ mb: 2 }}
                      />
                    )}

                    <Box>
                      <SelectFollowupDate
                        setDateTimeError={setShowDateError}
                        setFollowUpDate={setFollowUpDate}
                        followupDate={followupDate}
                        dateTimeError={showDateError}
                      />
                    </Box>
                    <NoteTextField setNoteFieldValue={setFollowupNote} />
                    <Tooltip
                      title={
                        isNaN(new Date(followupDate).getTime()) || showDateError
                          ? "Enter valid followup date."
                          : ""
                      }
                      arrow
                      placement="top"
                    >
                      <Box
                        sx={{
                          cursor:
                            isNaN(new Date(followupDate).getTime()) ||
                            showDateError
                              ? "not-allowed"
                              : "pointer",
                          mt: 2,
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Button
                          sx={{
                            pointerEvents:
                              isNaN(new Date(followupDate).getTime()) ||
                              showDateError
                                ? "none"
                                : "auto",
                            borderRadius: 50,
                          }}
                          type="submit"
                          variant="contained"
                          size="small"
                          color="info"
                          className="save-button-design"
                        >
                          Save
                        </Button>
                      </Box>
                    </Tooltip>
                  </form>
                </Box>
              </>
            )}
            {props?.timelineInternalServerError ||
            props?.somethingWentWrongInTimeline ? (
              <Box>
                {props?.timelineInternalServerError && (
                  <Error500Animation
                    height={400}
                    width={400}
                  ></Error500Animation>
                )}
                {props?.somethingWentWrongInTimeline && (
                  <ErrorFallback
                    error={apiResponseChangeMessage}
                    resetErrorBoundary={() => window.location.reload()}
                  />
                )}
              </Box>
            ) : (
              <Box sx={{ display: props?.hideTimeline ? "none" : "block" }}>
                {props?.followUpData?.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      pb: 2,
                    }}
                  >
                    <BaseNotFoundLottieLoader
                      height={150}
                      width={150}
                    ></BaseNotFoundLottieLoader>
                  </Box>
                ) : (
                  <TimeLine
                    toggle={false}
                    timeLineData={props?.followUpData}
                  ></TimeLine>
                )}
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </div>
  );
};

export default FollowUpListUpdate;
