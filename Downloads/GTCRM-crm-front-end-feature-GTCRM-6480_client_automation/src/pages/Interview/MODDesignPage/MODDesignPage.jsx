/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import SlickSlider from "react-slick";
import { CheckPicker, Checkbox, SelectPicker } from "rsuite";
import {
  useDeleteSlotAndPanelMutation,
  useGetDateWiseSlotPanelStatusQuery,
  useGetInterViewStudentsInfoDataMutation,
  usePublishSlotAndPanelMutation,
  useUnAssigneeStudentMutation,
} from "../../../Redux/Slices/applicationDataApiSlice";
import {
  useGetAllCourseListQuery,
  useGetAllModeratorListQuery,
  useGetInterviewListDataQuery,
} from "../../../Redux/Slices/filterDataSlice";
import CalendarDrawer from "../../../components/CalendarDrawer/CalendarDrawer";
import CalendarMOD from "../../../components/CalendarMOD/CalendarMOD";
import PublishDialog from "../../../components/PublishDialog/PublishDialog";
import UnAssigneeDialog from "../../../components/UnAssigneeDialog/UnAssigneeDialog";
import DeleteDialogue from "../../../components/shared/Dialogs/DeleteDialogue";
import Error500Animation from "../../../components/shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../../../components/shared/Loader/LeefLottieAnimationLoader";
import MODStudentInfoCard from "../../../components/shared/MODStudentInfoCard/MODStudentInfoCard";
import ZoomPage from "../../../components/shared/ZoomPage/ZoomPage";
import { Container } from "../../../components/shared/ZoomPage/zoomPage.styled";
import { organizeCourseFilterInterViewOption } from "../../../helperFunctions/filterHelperFunction";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";
import useToasterHook from "../../../hooks/useToasterHook";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import "../../../styles/MODDesignPage.css";
import "../../../styles/PanellistDesignPage.css";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import CreateSlotDrawer from "./CreateSlotDrawer";
import {
  dateCompare,
  formatDate,
} from "../../../helperFunctions/calendarHelperfunction";
import CreatePanelDrawer from "./CreatePanelDrawer";
import {
  interviewFilterSlot,
  interviewSlotPublish,
  interviewSlotStatus,
} from "../../../constants/LeadStageList";
import { useMemo } from "react";
import { fetchCities, fetchStates } from "../../../Redux/Slices/countrySlice";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  dateInStringFormat,
  formattedCurrentDate,
} from "../../../hooks/GetJsonDate";
import PanelAndStudentLIstDetailsDrawer from "../../PanelAndStudentListDetails/PanelAndStudentLIstDetailsDrawer";
import InterViewNavbar from "../../../components/shared/InterViewNavbar/InterViewNavbar";
import { LayoutSettingContext } from "../../../store/contexts/LayoutSetting";
import calendarIconDrawerPhoto from "../../../images/calendarPlanner.png";
import { customFetch } from "../../StudentTotalQueries/helperFunction";
const MODDesignPage = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [openCreatePanelDrawer, setOpenCreatePanelDrawer] = useState(false);
  const [openCreateSlotDrawer, setOpenCreateSlotDrawer] = useState(false);
  const [checkBoxSlotIndex, setCheckBoxSlotIndex] = useState({});
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
  const [panelOrSlot, setPanelOrSlot] = useState(false);
  let allTrueCount = countTrueValues();
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();

  const handleOpen = (key) => {
    setOpen(true);
    setPlacement(key);
  };
  const formattedDate = today.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const [openInviteLink, setOpenInviteLink] = React.useState(false);
  const [placementInviteLink, setPlacementInviteLink] = React.useState();

  const handleOpenInviteLink = (key) => {
    setOpenInviteLink(true);
    setPlacementInviteLink(key);
  };
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  const checkboxShow = true;
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
  const [studentLength, setStudentLength] = useState(false);
  const [reschedule, setReschedule] = useState(false);
  const [joinNow, setJoinNow] = useState(false);
  const role = "Moderator";
  const [openPublish, setOpenPublish] = React.useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const handlePublishClickOpen = () => {
    setOpenPublish(true);
  };

  // panel details states
  const [openPanelDetailsDrawer, setOpenPanelDetailsDrawer] = useState(false);
  const [createdPanelDetails, setCreatedPanelDetails] = useState({});
  // view panel states
  const [openViewPanelDialog, setOpenViewPanelDialog] = useState(false);

  const handlePublishClose = () => {
    setOpenPublish(false);
  };
  const programRef = useRef();
  const programRef2 = useRef();
  const [selectedProgram, setSelectedProgram] = useState([]);
  const [filterSlot, setFilterSlot] = useState([]);
  const [filterSlotStatus, setFilterSlotStatus] = useState([]);
  const [filterState, setFilterState] = useState("");
  const [slotId, setSlotId] = useState("");
  const [selectedModerator, setSelectedModerator] = useState([]);
  const [compareDate, setCompareDate] = useState();
  const filterDataPayload = {
    filter_slot: filterSlot,
    slot_status: filterSlotStatus,
    moderator: selectedModerator,
    slot_state: filterState,
    program_name: selectedProgram,
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
  // common api call functions
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
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const pushNotification = useToasterHook();
  const {
    setApiResponseChangeMessage,
    apiResponseChangeMessage,
    setSelectedApplicant,
  } = useContext(DashboradDataContext);
  const [
    somethingWentWrongInPublishedData,
    setSomethingWentWrongInPublishedData,
  ] = useState(false);
  const [
    publishedDataInternalServerError,
    setPublishedDataInternalServerError,
  ] = useState(false);

  const [somethingWentWrongInDeleteData, setSomethingWentWrongInDeleteData] =
    useState(false);
  const [deleteDataInternalServerError, setDeleteDataInternalServerError] =
    useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // Delete Slot and panel API Setup done
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
  const currentDateData = currentDate?.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const publishParticularDate = formatDate(currentDateData);
  const [selectedDateWisePublish, setSelectedDateWisePublish] = useState(false);
  //Published Slot and panel API Setup done
  const [publishSlotAndPanel] = usePublishSlotAndPanelMutation();
  const [publishLoading, setPublishLoading] = useState(false);
  //published Function
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

  const [somethingWentWrongInInviteLink, setSomethingWentWrongInInviteLink] =
    useState(false);
  const [inviteLinkInternalServerError, setInviteLinkInternalServerError] =
    useState(false);
  const [studentApplicationId, setStudentApplicationId] = useState("");
  // Invite Link API setup
  const handleInviteLink = () => {
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/planner/invite_student_to_meeting/?slot_id=${slotId}&application_id=${studentApplicationId}&college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "POST")
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else {
          try {
            pushNotification("success", "Successfully Send Invite Link");
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInInviteLink,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(setInviteLinkInternalServerError, "", 5000);
      });
  };
  //get interview student info State
  const [dataSet, setDataSet] = useState({});

  const [
    getStudentInfoAPIInternalServerError,
    setGetStudentInfoAPIInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInGetStudentInfoAPI,
    setSomethingWentWrongInGetStudentInfoAPI,
  ] = useState(false);

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

  const [somethingWentWrongInUnAssignee, setSomethingWentWrongInUnAssignee] =
    useState(false);
  const [unAssigneeInternalServerError, setUnAssigneeInternalServerError] =
    useState(false);
  const [unAssigneeStudentId, setUnAssigneeStudentId] = useState("");
  const [unAssigneeStudentInfo, setUnAssigneeStudentInfo] = useState({});
  //UnAssignee API Setup done
  const [unAssigneeLoading, setUnAssigneeLoading] = useState(false);
  const [unAssignee] = useUnAssigneeStudentMutation();
  const handleUnAssignee = () => {
    setUnAssigneeLoading(true);
    unAssignee({
      slot_id: slotId,
      studentApplicationId: unAssigneeStudentId,
      collegeId: collegeId,
    })
      .unwrap()
      .then((res) => {
        try {
          if (res?.message) {
            if (typeof res?.message === "string") {
              pushNotification("success", "UnAssignee Successful");
            } else {
              throw new Error("update Status API response changed");
            }
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setSomethingWentWrongInUnAssignee, "", 5000);
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
            setUnAssigneeInternalServerError,
            "",
            10000
          );
        }
      })
      .finally(() => {
        handleClose();
        setUnAssigneeLoading(false);
      });
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
  useEffect(
    () => {
      if (!callModeratorOptionApi.skipModeratorApiCall) {
        const moderatorList = allModeratorList?.data
          ? allModeratorList?.data?.data[0]
          : [];
        if (moderatorList?.length > 0) {
          setModeratorList(moderatorList);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      allModeratorList,
      callModeratorOptionApi.skipModeratorApiCall,
      callModeratorOptionApi,
    ]
  );
  const dataModerator = useMemo(() => {
    return moderatorList?.map((item) => ({
      label: item.first_name,
      value: item.id,
    }));
  }, [moderatorList]);
  const [calendarFilterPayload, setCalendarFilterPayload] =
    useState(filterDataPayload);
  const handleFilterCalendar = () => {
    setCalendarFilterPayload(filterDataPayload);
    setCheckBoxSlotIndex({});
  };

  //slot and panel drawer
  const dispatch = useDispatch();
  const [stateList, setStateList] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [citiesList, setCitiesList] = useState([]);

  const [panelSlotSomethingWentWrong, setPanelSlotSomethingWentWrong] =
    useState(false);
  const [panelSlotInternalServerError, setPanelSlotInternalServerError] =
    useState(false);

  const [skipSelectListApiCall, setSkipSelectListApiCall] = useState(true);
  const [callStateListApi, setCallStateListApi] = useState(false);

  //  Fetch states
  useEffect(() => {
    if (callStateListApi) {
      dispatch(fetchStates("IN"));
    }
  }, [callStateListApi, dispatch]);
  const states = useSelector((state) => state?.country?.states);
  useEffect(() => {
    setStateList(
      states.map((state) => ({ label: state.name, value: state.iso2 }))
    );
  }, [states]);
  // cities
  useEffect(() => {
    if (selectedState) {
      dispatch(
        fetchCities({
          countryIso: "IN",
          stateIso: selectedState,
        })
      );
    } else {
      setCitiesList([]);
    }
  }, [selectedState, dispatch]);
  const cities = useSelector((state) => state?.country?.cities);
  useEffect(() => {
    setCitiesList(cities);
  }, [cities]);

  const [interviewLists, setInterviewLists] = useState([]);
  const [selectedSlotType, setSelectedSlotType] = useState("");

  const {
    data: interviewList,
    isSuccess: isInterviewListSuccess,
    isFetching: isInterviewListFetching,
    error: interviewListError,
    isError: isInterviewListError,
  } = useGetInterviewListDataQuery(
    {
      collegeId,
      slotType: selectedSlotType,
    },
    { skip: skipSelectListApiCall }
  );

  useEffect(() => {
    try {
      if (isInterviewListSuccess) {
        if (Array.isArray(interviewList)) {
          const modifiedInterviewList = interviewList?.map((item) => ({
            label: item?.list_name,
            value: item?.interview_id,
          }));

          setInterviewLists(modifiedInterviewList);
        } else {
          throw new Error("gd pi interview list API response has changed");
        }
      } else if (isInterviewListError) {
        if (
          interviewListError?.data?.detail === "Could not validate credentials"
        ) {
          window.location.reload();
        } else if (interviewListError?.data?.detail) {
          pushNotification("error", interviewListError?.data?.detail);
        }
        if (interviewListError?.status === 500) {
          handleInternalServerError(setPanelSlotInternalServerError, "", 5000);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setPanelSlotSomethingWentWrong, "", 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    interviewList,
    interviewListError,
    isInterviewListError,
    isInterviewListSuccess,
  ]);

  const [dateWiseSlotPanelCount, setDateWiseSlotPanelCount] = useState([]);
  const [skipDateWiseSlotPanelStatusApi, setSkipDateWiseSlotPanelStatusApi] =
    useState(true);

  //converted date like 10 August 2023
  const convertedDate = dateInStringFormat(currentDate);

  const {
    data: slotPanelStatus,
    isSuccess: isSlotPanelStatusSuccess,
    isFetching: isSlotPanelStatusFetching,
    error: slotPanelStatusError,
    isError: isSlotPanelStatusError,
  } = useGetDateWiseSlotPanelStatusQuery(
    {
      isSlot: openCreateSlotDrawer ? true : false,
      currentDate: formattedCurrentDate(convertedDate),
      collegeId,
    },
    { skip: skipDateWiseSlotPanelStatusApi }
  );

  useEffect(() => {
    try {
      if (isSlotPanelStatusSuccess) {
        if (Array.isArray(slotPanelStatus)) {
          setDateWiseSlotPanelCount(slotPanelStatus);
        } else {
          throw new Error(
            "date wise slot panel count API response has changed"
          );
        }
      } else if (isSlotPanelStatusError) {
        if (
          slotPanelStatusError?.data?.detail ===
          "Could not validate credentials"
        ) {
          window.location.reload();
        } else if (slotPanelStatusError?.data?.detail) {
          pushNotification("error", slotPanelStatusError?.data?.detail);
        }
        if (slotPanelStatusError?.status === 500) {
          handleInternalServerError(setPanelSlotInternalServerError, "", 5000);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setPanelSlotSomethingWentWrong, "", 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    slotPanelStatus,
    slotPanelStatusError,
    isSlotPanelStatusError,
    isSlotPanelStatusSuccess,
  ]);
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Planner Head Title add
  useEffect(() => {
    setHeadTitle(joinNow ? "Interview" : reschedule ? "Reschedule" : "Planner");
  }, [headTitle, joinNow]);
  return (
    <Card
      sx={{ mx: "28px" }}
      className="MOD-card-margin-container planner-box-container"
    >
      <InterViewNavbar
        headline={""}
        setCurrentDate={setCurrentDate}
        formatDateToFilter={formatDateToFilter}
        setReschedule={setReschedule}
        reschedule={reschedule}
        formattedDate={formattedDate}
        setCalendarFilterPayload={setCalendarFilterPayload}
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
          <Box className="mod-create-slot-container">
            {!reschedule && (
              <Box className="mod-button-box">
                <Button
                  sx={{
                    borderRadius: 50,
                    paddingX: 2,
                  }}
                  className="mod-create-panel-button"
                  variant="contained"
                  size="small"
                  color="info"
                  onClick={() => {
                    setOpenCreatePanelDrawer(true);
                    setSkipDateWiseSlotPanelStatusApi(false);
                  }}
                  disabled={!dateCompare(today, currentDate)}
                >
                  Create Panel
                </Button>
                <Button
                  sx={{ borderRadius: 50, paddingX: 2, whiteSpace: "nowrap" }}
                  color="info"
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setOpenCreateSlotDrawer(true);
                    setSkipDateWiseSlotPanelStatusApi(false);
                  }}
                  disabled={!dateCompare(today, currentDate)}
                  className="create-slot-button"
                >
                  Create Slot
                </Button>
                <CheckPicker
                  data={interviewFilterSlot}
                  searchable={false}
                  style={{ width: 105 }}
                  placeholder="Filter Slots"
                  onChange={(event) => setFilterSlot(event)}
                />
                <CheckPicker
                  data={interviewSlotStatus}
                  searchable={false}
                  style={{ width: 117 }}
                  placeholder="Slot Status"
                  onChange={(event) => setFilterSlotStatus(event)}
                />
                <CheckPicker
                  style={{ width: 120 }}
                  ref={programRef2}
                  loading={
                    allModeratorList.isFetching
                      ? allModeratorList.isFetching
                      : false
                  }
                  placeholder="Moderator"
                  className="select-picker"
                  data={dataModerator}
                  value={selectedModerator}
                  onChange={(value) => {
                    setSelectedModerator(value);
                  }}
                  placement="bottomStart"
                  onOpen={() => {
                    setCallModeratorOptionApi &&
                      setCallModeratorOptionApi((prev) => ({
                        ...prev,
                        skipModeratorApiCall: false,
                      }));
                  }}
                  renderExtraFooter={() => (
                    <div style={footerStyles}>
                      <Checkbox
                        indeterminate={
                          selectedModerator?.length > 0 &&
                          selectedModerator?.length < allModeratorValue?.length
                        }
                        checked={
                          selectedModerator?.length ===
                          allModeratorValue?.length
                        }
                        onChange={handleModeratorCheckAll}
                      >
                        Check all
                      </Checkbox>
                      {selectedModerator?.length > 0 ? (
                        <Button
                          style={footerButtonStyle}
                          appearance="primary"
                          size="sm"
                          onClick={() => {
                            programRef2.current.close();
                          }}
                        >
                          Close
                        </Button>
                      ) : (
                        <Button
                          style={footerButtonStyle}
                          appearance="primary"
                          size="sm"
                          onClick={() => {
                            programRef2.current.close();
                          }}
                        >
                          Ok
                        </Button>
                      )}
                    </div>
                  )}
                />
                <CheckPicker
                  style={{ width: 140 }}
                  ref={programRef}
                  loading={
                    courseListInfo.isFetching
                      ? courseListInfo.isFetching
                      : false
                  }
                  placeholder="Select Program"
                  className="select-picker"
                  data={dataCourse}
                  value={selectedProgram}
                  onChange={(value) => {
                    setSelectedProgram(value);
                  }}
                  placement="bottomStart"
                  onOpen={() => {
                    setCallFilterOptionApi &&
                      setCallFilterOptionApi((prev) => ({
                        ...prev,
                        skipCourseApiCall: false,
                      }));
                  }}
                  renderExtraFooter={() => (
                    <div style={footerStyles}>
                      <Checkbox
                        indeterminate={
                          selectedProgram?.length > 0 &&
                          selectedProgram?.length < allValue?.length
                        }
                        checked={selectedProgram?.length === allValue?.length}
                        onChange={handleCheckAll}
                      >
                        Check all
                      </Checkbox>
                      {selectedProgram?.length > 0 ? (
                        <Button
                          style={footerButtonStyle}
                          appearance="primary"
                          size="sm"
                          onClick={() => {
                            programRef.current.close();
                          }}
                        >
                          Close
                        </Button>
                      ) : (
                        <Button
                          style={footerButtonStyle}
                          appearance="primary"
                          size="sm"
                          onClick={() => {
                            programRef.current.close();
                          }}
                        >
                          Ok
                        </Button>
                      )}
                    </div>
                  )}
                />
                <SelectPicker
                  data={interviewSlotPublish}
                  searchable={false}
                  style={{ width: 110 }}
                  placeholder="Slot State"
                  onChange={(event) => setFilterState(event)}
                />
                <Button
                  sx={{ borderRadius: 50, paddingX: 4, whiteSpace: "nowrap" }}
                  color="info"
                  variant="contained"
                  size="small"
                  onClick={() => handleFilterCalendar()}
                  className="apply-button"
                >
                  Apply
                </Button>
              </Box>
            )}
            <Box>
              <img
                onClick={() => handleOpen("right")}
                style={{ cursor: "pointer", width: "40px" }}
                src={calendarIconDrawerPhoto}
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
            filterSlot={filterSlot}
            applyFilterPayload={applyFilterPayload}
            allModeratorList={allModeratorList}
            selectedModerator={selectedModerator}
            setSelectedModerator={setSelectedModerator}
            setCallModeratorOptionApi={setCallModeratorOptionApi}
            allModeratorValue={allModeratorValue}
            handleModeratorCheckAll={handleModeratorCheckAll}
            filterDataPayload={filterDataPayload}
            setPanelOrSlot={setPanelOrSlot}
            setReschedule={setReschedule}
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
                      onClick={() => setOpenDeleteDialog(true)}
                      className="MOD-action-content"
                    >
                      <DeleteOutlineIcon sx={{ color: "#008BE2" }} />
                      <Typography variant="subtitle1">Delete</Typography>
                    </Box>
                    {/* <Box
                      onClick={() => handlePublishData()}
                      className="MOD-action-content"
                    >
                      {!dateCompare(today, currentDate) ? (
                        ""
                      ) : (
                        <>
                          {publishLoading ? (
                            <CircularProgress color="info" size={30} />
                          ) : (
                            <>
                              <img src={publishIconPhoto} alt="Image Publish" />
                              <Typography variant="subtitle1">
                                Publish
                              </Typography>
                            </>
                          )}
                        </>
                      )}
                    </Box> */}
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
                  somethingWentWrongInDeleteData ? (
                    <>
                      {deleteDataInternalServerError && (
                        <Error500Animation
                          height={400}
                          width={400}
                        ></Error500Animation>
                      )}
                      {somethingWentWrongInDeleteData && (
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
                        setStudentLength={setStudentLength}
                        reschedule={reschedule}
                        handlePublishClickOpen={handlePublishClickOpen}
                        setSelectedDate={setSelectedDate}
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        formatDateToFilter={formatDateToFilter}
                        date={date}
                        setReschedule={setReschedule}
                        handleGetViewStudentInfoData={
                          handleGetViewStudentInfoData
                        }
                        setSelectedDateWisePublish={setSelectedDateWisePublish}
                        setSlotId={setSlotId}
                        filterDataPayload={filterDataPayload}
                        setCompareDate={setCompareDate}
                        calendarFilterPayload={calendarFilterPayload}
                        setCalendarFilterPayload={setCalendarFilterPayload}
                      />
                    </Box>
                  )}
                </Box>
              </Grid>
              {!reschedule ? (
                <>
                  {panelOrSlot && (
                    <>
                      {unAssigneeInternalServerError ||
                      inviteLinkInternalServerError ||
                      somethingWentWrongInInviteLink ||
                      somethingWentWrongInUnAssignee ||
                      somethingWentWrongInGetStudentInfoAPI ||
                      getStudentInfoAPIInternalServerError ? (
                        <>
                          {(unAssigneeInternalServerError ||
                            inviteLinkInternalServerError ||
                            getStudentInfoAPIInternalServerError) && (
                            <Error500Animation
                              height={400}
                              width={400}
                            ></Error500Animation>
                          )}
                          {(somethingWentWrongInUnAssignee ||
                            somethingWentWrongInInviteLink ||
                            somethingWentWrongInGetStudentInfoAPI) && (
                            <ErrorFallback
                              error={apiResponseChangeMessage}
                              resetErrorBoundary={() =>
                                window.location.reload()
                              }
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
                                      height={150}
                                      width={150}
                                    ></LeefLottieAnimationLoader>
                                  </Box>
                                </>
                              ) : (
                                <>
                                  <Container>
                                    <SlickSlider {...settings}>
                                      {dataSet?.student_profile?.map((info) => {
                                        return (
                                          <>
                                            <MODStudentInfoCard
                                              setSelectedApplicant={
                                                setSelectedApplicant
                                              }
                                              handleOpenInviteLink={
                                                handleOpenInviteLink
                                              }
                                              setStudentApplicationId={
                                                setStudentApplicationId
                                              }
                                              placementInviteLink={
                                                placementInviteLink
                                              }
                                              openInviteLink={openInviteLink}
                                              setOpenInviteLink={
                                                setOpenInviteLink
                                              }
                                              handleInviteLink={
                                                handleInviteLink
                                              }
                                              setReschedule={setReschedule}
                                              setPanelOrSlot={setPanelOrSlot}
                                              handleClickOpen={handleClickOpen}
                                              setUnAssigneeStudentId={
                                                setUnAssigneeStudentId
                                              }
                                              applicationId={info.applicationId}
                                              info={info}
                                              dataSet={dataSet}
                                              setUnAssigneeStudentInfo={
                                                setUnAssigneeStudentInfo
                                              }
                                              setCalendarFilterPayload={
                                                setCalendarFilterPayload
                                              }
                                            ></MODStudentInfoCard>
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
                              )}
                            </>
                          </Card>
                        </Grid>
                      )}
                    </>
                  )}
                </>
              ) : (
                ""
              )}
            </Grid>
            {openDialog && (
              <UnAssigneeDialog
                openDialog={openDialog}
                handleClose={handleClose}
                handleUnAssignee={() => handleUnAssignee()}
                unAssigneeStudentInfo={unAssigneeStudentInfo}
                dataSet={dataSet}
                loading={unAssigneeLoading}
              ></UnAssigneeDialog>
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
            <DeleteDialogue
              openDeleteModal={openDeleteDialog}
              handleDeleteSingleTemplate={() => handleDeleteSlotAndPanel()}
              handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
              loading={deleteLoading}
            />
          </Box>
        </>
      )}
      {openCreateSlotDrawer && (
        <CreateSlotDrawer
          openCreateSlotDrawer={openCreateSlotDrawer}
          setOpenCreateSlotDrawer={setOpenCreateSlotDrawer}
          currentDate={currentDate}
          stateList={stateList}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          citiesList={citiesList}
          setCitiesList={setCitiesList}
          interviewLists={interviewLists}
          isInterviewListFetching={isInterviewListFetching}
          somethingWentWrong={panelSlotSomethingWentWrong}
          setSomethingWentWrong={setPanelSlotSomethingWentWrong}
          internalServerError={panelSlotInternalServerError}
          setInternalServerError={setPanelSlotInternalServerError}
          dateWiseSlotPanelCount={dateWiseSlotPanelCount}
          isSlotPanelStatusFetching={isSlotPanelStatusFetching}
          setSkipSelectListApiCall={setSkipSelectListApiCall}
          setCallStateListApi={setCallStateListApi}
          setSlotType={setSelectedSlotType}
        />
      )}
      {openCreatePanelDrawer && (
        <CreatePanelDrawer
          openDrawer={openCreatePanelDrawer}
          setOpenDrawer={setOpenCreatePanelDrawer}
          currentDate={currentDate}
          stateList={stateList}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          citiesList={citiesList}
          setCitiesList={setCitiesList}
          interviewLists={interviewLists}
          isInterviewListFetching={isInterviewListFetching}
          somethingWentWrong={panelSlotSomethingWentWrong}
          setSomethingWentWrong={setPanelSlotSomethingWentWrong}
          internalServerError={panelSlotInternalServerError}
          setInternalServerError={setPanelSlotInternalServerError}
          dateWiseSlotPanelCount={dateWiseSlotPanelCount}
          isSlotPanelStatusFetching={isSlotPanelStatusFetching}
          setSkipSelectListApiCall={setSkipSelectListApiCall}
          setCallStateListApi={setCallStateListApi}
          setSlotType={setSelectedSlotType}
          setCreatedPanelDetails={setCreatedPanelDetails}
          setOpenViewPanelDialog={setOpenViewPanelDialog}
        />
      )}
      {openPanelDetailsDrawer && (
        <PanelAndStudentLIstDetailsDrawer
          openDrawer={openPanelDetailsDrawer}
          setOpenDrawer={setOpenPanelDetailsDrawer}
          size="lg"
          slotOrPanelId={createdPanelDetails?.panel_id}
          preview={true}
        />
      )}
      {openViewPanelDialog && (
        <Dialog
          fullScreen={fullScreen}
          open={openViewPanelDialog}
          onClose={() => setOpenViewPanelDialog(false)}
        >
          <DialogContent sx={{ p: 7, textAlign: "center", minWidth: 400 }}>
            <Typography sx={{ fontSize: "22px", fontWeight: 400, mb: 3 }}>
              Panel for {createdPanelDetails?.slot_type} for{" "}
              {new Date(createdPanelDetails?.date)?.toDateString()} has been
              created.
            </Typography>
            <button
              onClick={() => {
                setOpenViewPanelDialog(false);
                setOpenPanelDetailsDrawer(true);
              }}
              className="create-slot-drawer-button"
            >
              View Panel
            </button>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default MODDesignPage;
