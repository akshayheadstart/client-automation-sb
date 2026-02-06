import {
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { useSelector } from "react-redux";
import TimeLine from "./TimeLine";
import BootstrapDialogTitle from "../shared/Dialogs/BootsrapDialogsTitle";
import formatDateAndTime from "../../hooks/useDateAndTimeFormat";
import BaseNotFoundLottieLoader from "../shared/Loader/BaseNotFoundLottieLoader";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import SelectCounsellor from "../shared/SelectCounsellor/SelectCounsellor";
import SelectFollowupDate from "../shared/SelectFollowupDate/SelectFollowupDate";
import NoteTextField from "../shared/NoteTextField/NoteTextField";
import useToasterHook from "../../hooks/useToasterHook";
import { useUpdateFollowupMutation } from "../../Redux/Slices/applicationDataApiSlice";
import { followupUpdateApiInner } from "../../utils/followupUpdateApiInner";

const ChangeApplicationStages = (props) => {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const tokenState = useSelector((state) => state.authentication.token);
  const pushNotification = useToasterHook();
  const [followupDate, setFollowUpDate] = useState(new Date());
  const [selectedCounsellorId, setSelectedCounsellorId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dateTimeError, setDateTimeError] = useState(false);
  const [noteFieldValue, setNoteFieldValue] = useState("");
  const [
    changeApplicationStageInternalServerError,
    setChangeApplicationStageInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInChangeApplicationStage,
    setSomethingWentWrongInChangeApplicationStage,
  ] = useState(false);

  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [updateApplicationStage] = useUpdateFollowupMutation();

  //application stage change handler function
  const handleApplicationStageChange = (e) => {
    e.preventDefault();
    const formattedFollowupDateDateAndTime = formatDateAndTime(followupDate);
    const changeApplicationStageData = {
      followup: {
        assigned_counselor_id:
          tokenState?.scopes?.[0] === "college_counselor"
            ? props?.counsellorList?.[0].id
            : selectedCounsellorId,
        followup_date: formattedFollowupDateDateAndTime,
        followup_note: noteFieldValue,
      },
    };

    setIsLoading(true);
    updateApplicationStage({
      applicationId: props?.applicationId,
      followupData: changeApplicationStageData,
      collegeId: collegeId,
    })
      .unwrap()
      .then((res) => {
        followupUpdateApiInner(
          res,
          pushNotification,
          props,
          setNoteFieldValue,
          setApiResponseChangeMessage,
          handleSomethingWentWrong,
          setSomethingWentWrongInChangeApplicationStage
        );
      })
      .catch(() => {
        handleInternalServerError(
          setChangeApplicationStageInternalServerError,
          props?.handleCloseDialogs,
          5000
        );
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Box>
      <Dialog
        onClose={() => {
          props?.handleCloseDialogs();
          setFollowUpDate(new Date());
          setDateTimeError(false);
          setNoteFieldValue("");
        }}
        aria-labelledby="customized-dialog-title"
        open={props?.openDialogs}
        maxWidth={false}
      >
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={35} color="info" />
          </Box>
        )}

        <Box
          sx={{
            backgroundColor: "background.paper",
            minHeight: "100%",
          }}
        >
          <BootstrapDialogTitle
            color={props?.color}
            id="customized-dialog-title"
            onClose={() => {
              props?.handleCloseDialogs();
              setFollowUpDate(new Date());
              setDateTimeError(false);
              setNoteFieldValue("");
            }}
          >
            Change Application Stage
          </BootstrapDialogTitle>

          {changeApplicationStageInternalServerError ||
          props?.counsellorListInternalServerError ||
          props?.somethingWentWrongInCounsellorList ||
          somethingWentWrongInChangeApplicationStage ? (
            <Box>
              {(changeApplicationStageInternalServerError ||
                props?.counsellorListInternalServerError) && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {(props?.somethingWentWrongInCounsellorList ||
                somethingWentWrongInChangeApplicationStage) && (
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
                  pt: 1,
                  px: 2,
                  display: props?.hideCounsellorList ? "none" : "block",
                }}
              >
                <form onSubmit={handleApplicationStageChange}>
                  <TextField
                    value={props?.applicationStage}
                    fullWidth
                    id="outlined-basic"
                    label="Application Stage"
                    variant="outlined"
                    color="info"
                  />

                  {(tokenState?.scopes?.[0] === "super_admin" ||
                    tokenState?.scopes?.[0] === "client_manager" ||
                    tokenState?.scopes?.[0] === "college_super_admin" ||
                    tokenState?.scopes?.[0] === "college_admin" ||
                    tokenState?.scopes?.[0] === "college_head_counselor") && (
                    <SelectCounsellor
                      loading={props?.loading}
                      setSkipCounselorApiCall={props?.setSkipCounselorApiCall}
                      counsellorList={props?.counsellorList}
                      setSelectedCounsellorId={setSelectedCounsellorId}
                      style={{ mt: 2 }}
                    />
                  )}

                  <Box sx={{ mt: 2 }}>
                    <SelectFollowupDate
                      setDateTimeError={setDateTimeError}
                      setFollowUpDate={setFollowUpDate}
                      followupDate={followupDate}
                      dateTimeError={dateTimeError}
                    />
                  </Box>
                  <NoteTextField setNoteFieldValue={setNoteFieldValue} />
                  <br />
                  <Tooltip
                    title={
                      isNaN(new Date(followupDate).getTime()) || dateTimeError
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
                          dateTimeError
                            ? "not-allowed"
                            : "pointer",
                        display: "inline-block",
                        mt: 2,
                      }}
                    >
                      <Button
                        sx={{
                          pointerEvents:
                            isNaN(new Date(followupDate).getTime()) ||
                            dateTimeError
                              ? "none"
                              : "auto",
                        }}
                        type="submit"
                        variant="contained"
                        size="small"
                      >
                        Save
                      </Button>
                    </Box>
                  </Tooltip>
                </form>
              </Box>
              <Divider />
            </>
          )}

          {props?.timelineInternalServerError ||
          props?.somethingWentWrongInTimeline ? (
            <Box>
              {props?.timelineInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
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
              <Typography
                sx={{
                  mt: 2,
                  mb: 1,
                }}
                variant="h6"
                align="center"
              >
                Time Line
              </Typography>
              {props?.timeLineData?.length === 0 ? (
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
                  timeLineData={props?.timeLineData}
                ></TimeLine>
              )}
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default ChangeApplicationStages;
