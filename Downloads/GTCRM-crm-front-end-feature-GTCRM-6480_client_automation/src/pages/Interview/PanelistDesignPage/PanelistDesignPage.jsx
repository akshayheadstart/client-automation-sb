/* eslint-disable jsx-a11y/img-redundant-alt */
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, Button, Card, Typography } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import SlickSlider from "react-slick";
import {
  useGetAllCourseListQuery,
  useGetAllModeratorListQuery,
} from "../../../Redux/Slices/filterDataSlice";

import CalendarMOD from "../../../components/CalendarMOD/CalendarMOD";
import PublishDialog from "../../../components/PublishDialog/PublishDialog";
import TakeSlotDialog from "../../../components/TakeSlotDialog/TakeSlotDialog";
import DeleteDialogue from "../../../components/shared/Dialogs/DeleteDialogue";
import Error500Animation from "../../../components/shared/ErrorAnimation/Error500Animation";
import ZoomPage from "../../../components/shared/ZoomPage/ZoomPage";
import { Container } from "../../../components/shared/ZoomPage/zoomPage.styled";
import { organizeCourseFilterInterViewOption } from "../../../helperFunctions/filterHelperFunction";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";
import useToasterHook from "../../../hooks/useToasterHook";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import "../../../styles/MODDesignPage.css";
import "../../../styles/PanellistDesignPage.css";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import {
  useDeleteSlotAndPanelMutation,
  useGetInterViewStudentsInfoDataMutation,
  usePublishSlotAndPanelMutation,
  useTakeSlotPanelistMutation,
} from "../../../Redux/Slices/applicationDataApiSlice";
import CalendarDrawer from "../../../components/CalendarDrawer/CalendarDrawer";
import PanelistStudentInfoCard from "../../../components/shared/PanelistStudentInfoCard/PanelistStudentInfoCard";
import LeefLottieAnimationLoader from "../../../components/shared/Loader/LeefLottieAnimationLoader";
import DateRangeIcon from "../../../icons/date-range-icon.svg";
import {
  dateCompare,
  formatDate,
} from "../../../helperFunctions/calendarHelperfunction";
import {
  interviewFilterSlot,
  interviewSlotPublish,
  interviewSlotStatus,
} from "../../../constants/LeadStageList";
import { useMemo } from "react";
import BaseNotFoundLottieLoader from "../../../components/shared/Loader/BaseNotFoundLottieLoader";
import InterViewNavbar from "../../../components/shared/InterViewNavbar/InterViewNavbar";
import { LayoutSettingContext } from "../../../store/contexts/LayoutSetting";

const PanelistDesignPage = () => {
  const [checkBoxSlotIndex, setCheckBoxSlotIndex] = useState({});
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);

  const [panelOrSlot, setPanelOrSlot] = useState(false);
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);

  //panelist dashboard Head Title add
  useEffect(() => {
    setHeadTitle("Panelist Dashboard");
    document.title = "Panelist Dashboard";
  }, [headTitle]);

  const countTrueValues = () => {
    const trueValuesCount = Object.values(checkBoxSlotIndex).filter(
      (value) => value === true
    ).length;
    return trueValuesCount;
  };
  const getTrueValueIds = () => {
    const trueValueIds = Object.keys(checkBoxSlotIndex).filter(
      (key) => checkBoxSlotIndex[key] === true
    );
    return trueValueIds;
  };
  const updateSelectedIds = getTrueValueIds();
  let allTrueCount = countTrueValues();

  const checkboxShow = true;
  const role = "panelist";
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();
  const handleOpen = (key) => {
    setOpen(true);
    setPlacement(key);
  };
  const footerButtonStyle = {
    float: "right",
    marginRight: 10,
    marginTop: 2,
  };
  const footerStyles = {
    padding: "10px 2px",
    borderTop: "1px solid #e5e5e5",
  };
  const programRef = useRef();
  const [selectedProgram, setSelectedProgram] = useState([]);
  const [filterSlot, setFilterSlot] = useState([]);
  const [filterSlotStatus, setFilterSlotStatus] = useState([]);
  const [filterState, setFilterState] = useState("");
  const [selectedModerator, setSelectedModerator] = useState([]);
  const [slotDetails, setSlotDetails] = useState({});
  const [compareDate, setCompareDate] = useState();
  const filterDataPayload = {
    filter_slot: filterSlot,
    slot_status: filterSlotStatus,
    moderator: selectedModerator,
    slot_state: filterState,
    program_name: selectedProgram,
  };
  const formattedDate = today.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const [openTakeSlotDialog, setOpenTakeSlotDialog] = React.useState(false);
  const handleClickOpen = () => {
    setOpenTakeSlotDialog(true);
  };
  const handleClose = () => {
    setOpenTakeSlotDialog(false);
  };
  const [studentLength, setStudentLength] = useState(false);
  const settings = {
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 1,
    speed: 500,
    arrows: false,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };
  const [joinNow, setJoinNow] = useState(false);
  const [openPublish, setOpenPublish] = React.useState(false);
  const handlePublishClickOpen = () => {
    setOpenPublish(true);
  };

  const handlePublishClose = () => {
    setOpenPublish(false);
  };
  const [date, setDate] = useState("");
  const formatDateToFilter = (inputDate) => {
    const dateObject = new Date(inputDate);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // Adding 1 since getMonth
    const day = dateObject.getDate();
    const formattedMonth = month.toString().padStart(2, "0");
    const formattedDay = day.toString().padStart(2, "0");
    return setDate(`${year}-${formattedMonth}-${formattedDay}`);
  };
  const [listOfCourses, setListOfCourses] = React.useState([]);
  const allValue = useMemo(() => {
    return listOfCourses?.map((item) => ({
      course_name: item.value.course_name,
      specialization_name: item.value.course_specialization,
    }));
  }, [listOfCourses]);
  const handleCheckAll = (value, checked) => {
    setSelectedProgram(checked ? allValue : []);
  };
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { handleFilterListApiCall } = useCommonApiCalls();
  const [hideCourseList, setHideCourseList] = useState(false);

  const [callFilterOptionApi, setCallFilterOptionApi] = useState({
    skipStateApiCall: true,
    skipSourceApiCall: true,
    skipCounselorApiCall: true,
    skipCourseApiCall: true,
    callBoard: false,
  });

  const courseListInfo = useGetAllCourseListQuery(
    { collegeId: collegeId },
    { skip: callFilterOptionApi.skipCourseApiCall }
  );
  useEffect(() => {
    if (!callFilterOptionApi.skipCourseApiCall) {
      const courseList = courseListInfo?.data?.data[0];
      handleFilterListApiCall(
        courseList,
        courseListInfo,
        setListOfCourses,
        setHideCourseList,
        organizeCourseFilterInterViewOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    courseListInfo,
    callFilterOptionApi.skipCourseApiCall,
    hideCourseList,
    callFilterOptionApi,
  ]);
  const dataCourse = useMemo(() => {
    return listOfCourses?.map((item) => ({
      label: item.label,
      value: {
        course_name: item.value.course_name,
        specialization_name: item.value.course_specialization,
      },
    }));
  }, [listOfCourses]);

  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [somethingWentWrongInTakeSlot, setSomethingWentWrongInTakeSlot] =
    useState(false);
  const [takeSlotInternalServerError, setTakeSlotInternalServerError] =
    useState(false);

  const [takeSlotId, setTakeSlotId] = useState("");
  const [takeSlotLoading, setTakeSlotLoading] = useState(false);
  const [takeSlot] = useTakeSlotPanelistMutation();
  const handleTakeSlot = () => {
    setTakeSlotLoading(true);
    takeSlot({
      slotId: takeSlotId,
      collegeId: collegeId,
    })
      .unwrap()
      .then((res) => {
        try {
          if (res?.message) {
            if (typeof res?.message === "string") {
              pushNotification("success", "Take Slot Successful");
            } else {
              throw new Error("Take Slot API response changed");
            }
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setSomethingWentWrongInTakeSlot, "", 5000);
        }
        // }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setTakeSlotInternalServerError, "", 10000);
        }
      })
      .finally(() => {
        handleClose();
        setTakeSlotLoading(false);
      });
  };
  const [selectedDate, setSelectedDate] = useState("");
  const [
    somethingWentWrongInPublishedData,
    setSomethingWentWrongInPublishedData,
  ] = useState(false);
  const [
    publishedDataInternalServerError,
    setPublishedDataInternalServerError,
  ] = useState(false);
  const currentDateData = currentDate?.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const publishParticularDate = formatDate(currentDateData);
  const [selectedDateWisePublish, setSelectedDateWisePublish] = useState(false);
  //Published Slot and panel API Setup
  const [publishLoading, setPublishLoading] = useState(false);
  const [publishSlotAndPanel] = usePublishSlotAndPanelMutation();
  const handlePublishData = () => {
    setPublishLoading(true);
    publishSlotAndPanel({
      selectedId: {
        slots_panels_ids: updateSelectedIds,
      },
      collegeId: collegeId,
      date: selectedDateWisePublish ? publishParticularDate : "",
    })
      .unwrap()
      .then((res) => {
        try {
          if (res?.message) {
            if (typeof res?.message === "string") {
              pushNotification("success", "Published Successful");
              handlePublishClose();
            } else {
              throw new Error("Publish Status API response changed");
            }
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInPublishedData,
            "",
            5000
          );
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setPublishedDataInternalServerError,
            "",
            10000
          );
        }
      })
      .finally(() => {
        setCheckBoxSlotIndex({});
        setPublishLoading(false);
      });
  };
  const [somethingWentWrongInDeleteData, setSomethingWentWrongInDeleteData] =
    useState(false);
  const [deleteDataInternalServerError, setDeleteDataInternalServerError] =
    useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  //handle Delete Slot and Panel API
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSlotAndPanel] = useDeleteSlotAndPanelMutation();
  const handleDeleteSlotAndPanel = () => {
    setDeleteLoading(true);
    deleteSlotAndPanel({
      selectedId: {
        slots_panels_ids: updateSelectedIds,
      },
      collegeId: collegeId,
    })
      .unwrap()
      .then((res) => {
        try {
          if (res?.message) {
            if (typeof res?.message === "string") {
              pushNotification("success", "Delete Successful");
              // window.location.reload();
            } else {
              throw new Error("update Status API response changed");
            }
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setSomethingWentWrongInDeleteData, "", 5000);
        }
        // }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setDeleteDataInternalServerError,
            "",
            10000
          );
        }
      })
      .finally(() => {
        setOpenDeleteDialog(false);
        setCheckBoxSlotIndex({});
        setDeleteLoading(false);
      });
  };

  //get interview student info State
  const [
    getStudentInfoAPIInternalServerError,
    setGetStudentInfoAPIInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInGetStudentInfoAPI,
    setSomethingWentWrongInGetStudentInfoAPI,
  ] = useState(false);
  const [slotId, setSlotId] = useState("");
  const [dataSet, setDataSet] = useState({});
  //get interview student info API setup

  const [isViewStudentLoading, setIsViewStudentLoading] = useState(false);
  const [getInterViewStudentsInfoData] =
    useGetInterViewStudentsInfoDataMutation();
  const handleGetViewStudentInfoData = (slotId) => {
    setIsViewStudentLoading(true);
    getInterViewStudentsInfoData({ slot_id: slotId, collegeId: collegeId })
      .unwrap()
      .then((result) => {
        try {
          if (result?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (result?.student_profile) {
            setDataSet(result);
          } else if (result?.message) {
            pushNotification("warning", result?.message);
            setDataSet({});
          } else if (result?.detail) {
            pushNotification("error", result?.detail);
            setDataSet({});
          } else {
            throw new Error(
              "Profile marking details API response has been changed."
            );
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInGetStudentInfoAPI,
            "",
            5000
          );
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
          setDataSet({});
        } else if (error?.status === 500) {
          handleInternalServerError(
            setGetStudentInfoAPIInternalServerError,
            "",
            5000
          );
        }
      })
      .finally(() => setIsViewStudentLoading(false));
  };

  const [applyFilterPayload, setApplyFilterPayload] = useState({});
  const handleApplyFilter = () => {
    setApplyFilterPayload(filterDataPayload);
  };
  const [callModeratorOptionApi, setCallModeratorOptionApi] = useState({
    skipModeratorApiCall: true,
  });

  const [moderatorList, setModeratorList] = useState([]);
  const allModeratorValue = moderatorList?.map((item) => item.id);
  const handleModeratorCheckAll = (value, checked) => {
    setSelectedModerator(checked ? allModeratorValue : []);
  };
  const allModeratorList = useGetAllModeratorListQuery(
    { user: "moderator", collegeId },
    { skip: callModeratorOptionApi.skipModeratorApiCall }
  );
  useEffect(() => {
    if (!callModeratorOptionApi.skipModeratorApiCall) {
      const moderatorList = allModeratorList?.data
        ? allModeratorList?.data?.data[0]
        : [];
      if (moderatorList?.length > 0) {
        setModeratorList(moderatorList);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    allModeratorList,
    callModeratorOptionApi.skipModeratorApiCall,
    callModeratorOptionApi,
  ]);
  const dataModerator = useMemo(() => {
    return moderatorList?.map((item) => ({
      label: item.first_name,
      value: item.id,
    }));
  }, [moderatorList]);
  const filter1DataPayload = {
    filter_slot: [],
    slot_status: [],
    moderator: [],
    slot_state: "",
    program_name: [],
  };

  return (
    <Card sx={{ m: 5 }}>
      <InterViewNavbar
        headline={joinNow ? "Interview" : "Slot Planner"}
        setCurrentDate={setCurrentDate}
        formatDateToFilter={formatDateToFilter}
        formattedDate={formattedDate}
      ></InterViewNavbar>
      {joinNow ? (
        <ZoomPage
          dataToStudentLength={studentLength}
          role={role}
          dataSet={dataSet}
          slotId={slotId}
        ></ZoomPage>
      ) : (
        <>
          <Box className="create-panel-slot-button">
            <Box sx={{ cursor: "pointer" }}>
              <img
                onClick={() => handleOpen("right")}
                src={DateRangeIcon}
                alt="Image description"
              />
            </Box>
          </Box>
          <CalendarDrawer
            open={open}
            placement={placement}
            setOpen={setOpen}
            formattedDate={formattedDate}
            dataInfo={interviewFilterSlot}
            programRef={programRef}
            courseListInfo={courseListInfo}
            dataCourse={dataCourse}
            selectedProgram={selectedProgram}
            setSelectedProgram={setSelectedProgram}
            setCallFilterOptionApi={setCallFilterOptionApi}
            footerStyles={footerStyles}
            allValue={allValue}
            handleCheckAll={handleCheckAll}
            footerButtonStyle={footerButtonStyle}
            slotStatus={interviewSlotStatus}
            dataModerator={dataModerator}
            dataPublish={interviewSlotPublish}
            setCurrentDate={setCurrentDate}
            setDate={setDate}
            setFilterSlot={setFilterSlot}
            setFilterSlotStatus={setFilterSlotStatus}
            setFilterState={setFilterState}
            handleApplyFilter={handleApplyFilter}
            applyFilterPayload={applyFilterPayload}
            allModeratorList={allModeratorList}
            selectedModerator={selectedModerator}
            setSelectedModerator={setSelectedModerator}
            setCallModeratorOptionApi={setCallModeratorOptionApi}
            allModeratorValue={allModeratorValue}
            handleModeratorCheckAll={handleModeratorCheckAll}
            setPanelOrSlot={setPanelOrSlot}
            setCheckBoxSlotIndex={setCheckBoxSlotIndex}
          ></CalendarDrawer>

          {allTrueCount > 0 ? (
            <Box className="MOD-action-container">
              <Box className="MOD-action-wrapper">
                <Card className="MOD-action-card">
                  <Box className="MOD-action-content-container">
                    <Box className="MOD-action-content">
                      <Typography variant="subtitle1">
                        {" "}
                        {allTrueCount} items selected
                      </Typography>
                    </Box>
                    <Box
                      className="MOD-action-content"
                      onClick={() => setOpenDeleteDialog(true)}
                    >
                      <DeleteOutlineIcon sx={{ color: "#008BE2" }} />
                      <Typography variant="subtitle1">Delete</Typography>
                    </Box>
                  </Box>
                </Card>
              </Box>
            </Box>
          ) : (
            ""
          )}
          <Box sx={{ p: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={panelOrSlot ? 8 : 12}>
                <Box sx={{ textAlign: "center" }}>
                  {deleteDataInternalServerError ||
                  somethingWentWrongInDeleteData ||
                  somethingWentWrongInTakeSlot ||
                  takeSlotInternalServerError ? (
                    <>
                      {(deleteDataInternalServerError ||
                        takeSlotInternalServerError) && (
                        <Error500Animation
                          height={400}
                          width={400}
                        ></Error500Animation>
                      )}
                      {(somethingWentWrongInDeleteData ||
                        somethingWentWrongInTakeSlot) && (
                        <ErrorFallback
                          error={apiResponseChangeMessage}
                          resetErrorBoundary={() => window.location.reload()}
                        />
                      )}
                    </>
                  ) : (
                    <Box className="calendar-box-container">
                      <CalendarMOD
                        setCheckBoxSlotIndex={setCheckBoxSlotIndex}
                        checkBoxSlotIndex={checkBoxSlotIndex}
                        setPanelOrSlot={setPanelOrSlot}
                        panelOrSlot={panelOrSlot}
                        checkboxShow={checkboxShow}
                        role={role}
                        handleClickOpen={handleClickOpen}
                        setStudentLength={setStudentLength}
                        reschedule={false}
                        handlePublishClickOpen={handlePublishClickOpen}
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        formatDateToFilter={formatDateToFilter}
                        date={date}
                        setSelectedDate={setSelectedDate}
                        setTakeSlotId={setTakeSlotId}
                        setSelectedDateWisePublish={setSelectedDateWisePublish}
                        setSlotId={setSlotId}
                        calendarFilterPayload={filter1DataPayload}
                        setSlotDetails={setSlotDetails}
                        setCompareDate={setCompareDate}
                        handleGetViewStudentInfoData={
                          handleGetViewStudentInfoData
                        }
                      />
                    </Box>
                  )}
                </Box>
              </Grid>
              {panelOrSlot && (
                <>
                  {somethingWentWrongInGetStudentInfoAPI ||
                  getStudentInfoAPIInternalServerError ? (
                    <>
                      {getStudentInfoAPIInternalServerError && (
                        <Error500Animation
                          height={400}
                          width={400}
                        ></Error500Animation>
                      )}
                      {somethingWentWrongInGetStudentInfoAPI && (
                        <ErrorFallback
                          error={apiResponseChangeMessage}
                          resetErrorBoundary={() => window.location.reload()}
                        />
                      )}
                    </>
                  ) : (
                    <Grid item xs={12} sm={12} md={4}>
                      <Card
                        className="card-container"
                        sx={{ maxWidth: 650, mt: "32px" }}
                      >
                        <>
                          {isViewStudentLoading ? (
                            <>
                              <Box className="loading-animation">
                                <LeefLottieAnimationLoader
                                  height={200}
                                  width={180}
                                ></LeefLottieAnimationLoader>
                              </Box>
                            </>
                          ) : (
                            <>
                              {dataSet?.student_profile?.length ? (
                                <>
                                  <Container>
                                    <SlickSlider {...settings}>
                                      {dataSet?.student_profile?.map((info) => {
                                        return (
                                          <>
                                            <PanelistStudentInfoCard
                                              info={info}
                                              dataSet={dataSet}
                                            ></PanelistStudentInfoCard>
                                          </>
                                        );
                                      })}
                                    </SlickSlider>
                                  </Container>
                                  <Box
                                    sx={{
                                      p: 2,
                                      display: "grid",
                                      placeItems: "center",
                                      mt: "15px",
                                    }}
                                  >
                                    <Button
                                      onClick={() => setJoinNow(true)}
                                      variant="contained"
                                      size="small"
                                      color="info"
                                      sx={{
                                        borderRadius: 50,
                                        paddingX: 3,
                                        color: "white",
                                      }}
                                      disabled={
                                        !dateCompare(today, compareDate)
                                      }
                                    >
                                      Join Now
                                    </Button>
                                  </Box>
                                </>
                              ) : (
                                <Box className="loading-animation-for-notification">
                                  <BaseNotFoundLottieLoader
                                    width={200}
                                    height={200}
                                  />
                                </Box>
                              )}
                            </>
                          )}
                        </>
                      </Card>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
            <DeleteDialogue
              openDeleteModal={openDeleteDialog}
              handleDeleteSingleTemplate={() => handleDeleteSlotAndPanel()}
              handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
              loading={deleteLoading}
            />
            {openTakeSlotDialog && (
              <TakeSlotDialog
                openTakeSlotDialog={openTakeSlotDialog}
                handleClose={handleClose}
                handleTakeSlot={() => handleTakeSlot()}
                selectedDate={selectedDate}
                slotDetails={slotDetails}
                loading={takeSlotLoading}
              ></TakeSlotDialog>
            )}
            {openPublish && (
              <PublishDialog
                openPublish={openPublish}
                handlePublishClose={handlePublishClose}
                apiResponseChangeMessage={apiResponseChangeMessage}
                somethingWentWrongInPublishedData={
                  somethingWentWrongInPublishedData
                }
                publishedDataInternalServerError={
                  publishedDataInternalServerError
                }
                handlePublishData={handlePublishData}
                selectedDate={selectedDate}
                loading={publishLoading}
              ></PublishDialog>
            )}
          </Box>
        </>
      )}
    </Card>
  );
};

export default PanelistDesignPage;
