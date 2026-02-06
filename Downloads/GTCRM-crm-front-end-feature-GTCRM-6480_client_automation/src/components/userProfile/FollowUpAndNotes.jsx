import { Box, Grid, Typography } from "@mui/material";
import React, { useContext } from "react";
import "../../styles/timeLineTab.css";

import "../../styles/followUpAndNotes.css";
import BaseNotFoundLottieLoader from "../shared/Loader/BaseNotFoundLottieLoader";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { Divider, SelectPicker, Timeline, Toggle } from "rsuite";
import { timeLineAction } from "../../constants/LeadStageList";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import {
  useGetCounselorListQuery,
  useGetStudentTimelineFollowupAndNotesQuery,
  useUpdateFollowupStatusMutation,
} from "../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import DeleteDialogue from "../shared/Dialogs/DeleteDialogue";
import LeefLottieAnimationLoader from "../shared/Loader/LeefLottieAnimationLoader";
import "../../styles/sharedStyles.css";
import NoteFoldingSvg from "./NoteFoldingSvg";
import IconDateRangePicker from "../shared/filters/IconDateRangePicker";
import GetJsonDate from "../../hooks/GetJsonDate";
import FollowupDetails from "./FollowupDetails";
import AddNote from "./AddNote";
import FollowUpListUpdate from "./FollowUpListUpdate";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import DateRangeShowcase from "../shared/CalendarTimeData/DateRangeShowcase";
import { getDateMonthYear } from "../../hooks/getDayMonthYear";
import addFollowUpIcon from "../../images/addfollowupIcon.svg";
import addNoteIcon from "../../images/addNoteIcon.svg";

const FollowUpAndNotes = ({ applicationId, leadProfileAction }) => {
  const [actionType, setActionType] = useState("");
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [openFollowupDialog, setOpenFollowupDialog] = useState(false);

  const theme = useTheme();
  const smallDevices = useMediaQuery(theme.breakpoints.down("md"));
  const [notesData, setNotesData] = useState([]);
  const [followupData, setFollowupData] = useState([]);
  const [hideFollowupAndNotes, setHideFollowupAndNotes] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [
    followupAndNotesInternalServerError,
    setFollowupAndNotesInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInFollowupAndNotes,
    setSomethingWentWrongInFollowupAndNotes,
  ] = useState(false);
  const [
    followupStatusUpdateInternalServerError,
    setFollowupStatusUpdateInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInFollowupStatusUpdate,
    setSomethingWentWrongInFollowupStatusUpdate,
  ] = useState(false);
  const [followupStatusUpdateLoading, setFollowupStatusUpdateLoading] =
    useState(false);

  const [followupIndex, setFollowupIndex] = useState(null);
  const [followupCheckedStatus, setFollowupCheckedStatus] = useState(null);
  const [
    openFollowupStatusUpdateConfirmationModal,
    setOpenFollowupStatusUpdateConfirmationModal,
  ] = useState(false);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const pushNotification = useToasterHook();

  const { isError, isFetching, data, isSuccess, error } =
    useGetStudentTimelineFollowupAndNotesQuery({
      payload: {
        action_user: actionType ? [actionType] : [],
        date_range: JSON.parse(GetJsonDate(dateRange)),
      },
      collegeId,
      applicationId,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof data === "object") {
          setNotesData(data?.notes);
          setFollowupData(data?.followups);
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setFollowupAndNotesInternalServerError,
            setHideFollowupAndNotes,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInFollowupAndNotes,
        setHideFollowupAndNotes,
        5000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error, data, isFetching]);
  const tokenState = useSelector((state) => state.authentication.token);
  // list option api calling state
  const [skipCounselorApiCall, setSkipCounselorApiCall] = useState(
    tokenState?.scopes?.[0] === "college_counselor" ? false : true
  );
  const [counsellorList, setCounsellorList] = useState([]);
  const [hideCounsellorList, setHideCounsellorList] = useState(false);

  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId: collegeId },
    {
      skip: skipCounselorApiCall,
    }
  );
  //get counsellor list
  const { handleFilterListApiCall } = useCommonApiCalls();

  //get counsellor list
  useEffect(() => {
    if (!skipCounselorApiCall) {
      const counselorList = counselorListApiCallInfo.data?.data[0];
      handleFilterListApiCall(
        counselorList,
        counselorListApiCallInfo,
        setCounsellorList,
        setHideCounsellorList
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCounselorApiCall, counselorListApiCallInfo]);

  const [handleUpdateFollowupStatus] = useUpdateFollowupStatusMutation();

  const handleCompleteAndIncompleteFollowup = () => {
    setFollowupStatusUpdateLoading(true);
    handleUpdateFollowupStatus({
      checkedValue: followupCheckedStatus,
      applicationId,
      indexNumber: followupIndex,
      collegeId,
    })
      .unwrap()
      .then((res) => {
        if (res.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res.code === 200) {
          try {
            if (typeof res.message === "string") {
              pushNotification("success", res?.message);
            } else {
              throw new Error("Followup status update api response is changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInFollowupStatusUpdate,
              "",
              5000
            );
          }
        } else if (res.detail) {
          pushNotification("error", res?.detail);
        }
      })
      .catch(() => {
        handleInternalServerError(
          setFollowupStatusUpdateInternalServerError,
          "",
          5000
        );
      })
      .finally(() => {
        setFollowupStatusUpdateLoading(false);
        setOpenFollowupStatusUpdateConfirmationModal(false);
      });
  };
  return (
    <Box sx={{ position: "relative", p: 3, mt: dateRange.length ? 2.5 : 0 }}>
      {dateRange.length > 1 && (
        <Box sx={{ mt: 1 }}>
          <DateRangeShowcase
            startDateRange={getDateMonthYear(dateRange[0])}
            endDateRange={getDateMonthYear(dateRange[1])}
            triggeredFunction={() => {
              setDateRange([]);
            }}
          ></DateRangeShowcase>
        </Box>
      )}
      <Box
        sx={{ flexWrap: "wrap", flexDirection: "row-reverse", px: "30px" }}
        id="time-line-tab-top-section"
      >
        <Box className="make-item-flex">
          <SelectPicker
            data={timeLineAction}
            searchable={false}
            style={{ width: 120 }}
            placeholder="Action"
            onChange={(value) => setActionType(value)}
          />
          <IconDateRangePicker
            dateRange={dateRange}
            onChange={(value) => setDateRange(value)}
          />
          <Box
            sx={{ cursor: "pointer" }}
            onClick={() => {
              if (!leadProfileAction) {
                setOpenNoteDialog(true);
              }
            }}
          >
            <img src={addNoteIcon} height={"35px"} alt="Add Note Icon" />
          </Box>
          <Box
            sx={{ cursor: "pointer" }}
            onClick={() => {
              if (!leadProfileAction) {
                setOpenFollowupDialog(true);
              }
            }}
          >
            <img
              src={addFollowUpIcon}
              height={"35px"}
              alt="Add Follow up Icon"
            />
          </Box>
        </Box>
        <Box id="time-line-tab-action-and-filter">
          <Typography className="show-timeline-merge-text">
            Show Merged Details
          </Typography>
          <Toggle />
        </Box>
      </Box>

      {followupAndNotesInternalServerError ||
      somethingWentWrongInFollowupAndNotes ? (
        <Box>
          {followupAndNotesInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInFollowupAndNotes && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box
          sx={{ display: hideFollowupAndNotes ? "none" : "block", px: "30px" }}
        >
          {isFetching ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                minHeight: "350px",
                alignItems: "center",
              }}
            >
              <LeefLottieAnimationLoader width={200} height={200} />
            </Box>
          ) : (
            <Box
              className="vertical-scrollbar"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 1)",
                mt: 4,
                height: "440px",
                overflowY:
                  followupData?.length > 2 || notesData?.length > 2
                    ? "scroll"
                    : "",
              }}
            >
              <Grid sx={{ mt: 1.4 }} container spacing={2}>
                <Grid item md={5} sm={12} xs={12}>
                  <Box className="make-item-flex" sx={{ mb: 2 }}>
                    <Typography className="followup-and-note-title">
                      Follow-ups
                    </Typography>
                  </Box>
                  {followupData?.length > 0 ? (
                    <Box className="followup-details-container">
                      <Timeline isItemActive={() => true} endless>
                        {followupData.map((details) => (
                          <FollowupDetails
                            details={details}
                            setOpenFollowupStatusUpdateConfirmationModal={
                              setOpenFollowupStatusUpdateConfirmationModal
                            }
                            setFollowupCheckedStatus={setFollowupCheckedStatus}
                            setFollowupIndex={setFollowupIndex}
                            leadProfileAction={leadProfileAction}
                          />
                        ))}
                      </Timeline>
                    </Box>
                  ) : (
                    <BaseNotFoundLottieLoader
                      height={150}
                      width={150}
                    ></BaseNotFoundLottieLoader>
                  )}
                </Grid>
                {!smallDevices && (
                  <Grid item md={1}>
                    <Divider style={{ height: "100%" }} vertical></Divider>
                  </Grid>
                )}
                <Grid item md={6} sm={12} xs={12}>
                  <Box className="make-item-flex" sx={{ mb: 2 }}>
                    <Typography className="followup-and-note-title">
                      Notes
                    </Typography>
                  </Box>
                  {notesData?.length > 0 ? (
                    <Box
                      sx={{
                        pr:
                          followupData?.length > 2 || notesData?.length > 2
                            ? 1
                            : 0,
                      }}
                      className="note-section-container"
                    >
                      {notesData.map((note, index) => (
                        <Box
                          key={index}
                          className={`note-card ${note.action_type}`}
                        >
                          <Typography>{note.timestamp}</Typography>
                          <Typography>
                            {" "}
                            <span>Note :</span> {note.note || "N/A"}
                          </Typography>
                          <Typography>
                            {" "}
                            <span>Added By : </span> {note.added_by || "N/A"}
                          </Typography>
                          <NoteFoldingSvg type={note?.action_type} />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <BaseNotFoundLottieLoader
                      height={150}
                      width={150}
                    ></BaseNotFoundLottieLoader>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      )}
      <DeleteDialogue
        openDeleteModal={openFollowupStatusUpdateConfirmationModal}
        handleCloseDeleteModal={() =>
          setOpenFollowupStatusUpdateConfirmationModal(false)
        }
        handleDeleteSingleTemplate={handleCompleteAndIncompleteFollowup}
        internalServerError={followupStatusUpdateInternalServerError}
        somethingWentWrong={somethingWentWrongInFollowupStatusUpdate}
        apiResponseChangeMessage={apiResponseChangeMessage}
        loading={followupStatusUpdateLoading}
        title="Do you want to update the status?"
      />
      <FollowUpListUpdate
        data-testid="follow-up-list-component"
        color={"followup"}
        followUpData={followupData}
        handleCloseDialogs={() => setOpenFollowupDialog(false)}
        openDialogs={openFollowupDialog}
        applicationId={applicationId}
        counsellorList={counsellorList}
        hideCounsellorList={hideCounsellorList}
        setSkipCounselorApiCall={setSkipCounselorApiCall}
        loading={counselorListApiCallInfo.isFetching}
      ></FollowUpListUpdate>

      <AddNote
        color={"note"}
        followUpData={notesData}
        handleCloseDialogs={() => setOpenNoteDialog(false)}
        openDialogs={openNoteDialog}
        applicationId={applicationId}
      ></AddNote>
    </Box>
  );
};

export default FollowUpAndNotes;
