/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ShareIcon from "@mui/icons-material/Share";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Box,
  Button,
  Card,
  Drawer,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useDeleteTagMutation,
  useGetCounselorListQuery,
  useGetKeyCategoriesQuery,
  useGetQuestionsDataQuery,
  useGetUserProfileLeadHeaderQuery,
  useGetUserProfileTimelineFollowupNoteQuery,
  useGetUserProfileTimelineInfoQuery,
} from "../../Redux/Slices/applicationDataApiSlice";
import { useGetCounselorDataListQuery } from "../../Redux/Slices/filterDataSlice";
import { whatsappURL } from "../../constants/CommonApiUrls";
import { colorCode } from "../../constants/LeadStageList";
import { organizeCounselorFilterOption } from "../../helperFunctions/filterHelperFunction";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import useDebounce from "../../hooks/useDebounce";
import useToasterHook from "../../hooks/useToasterHook";
import SendWhatsappIcon from "../../icons/send-whatsapp-icon.svg";
import userProfilePhoto from "../../images/UserProfileIcon.png";
import counselorNameChangeIcon from "../../images/counsellorChangeIcon.png";
import followUpIcon from "../../images/followIcon.svg";
import incomingCallIcon from "../../images/incomming.png";
import mailIcon from "../../images/mailVerificationIcon.png";
import missedCallIcon from "../../images/missed.png";
import outgoingCallIcon from "../../images/outgoniing.png";
import lockIcon from "../../images/phoneOTPIcon.png";
import { secondsToMinutesAndSeconds } from "../../pages/StudentTotalQueries/helperFunction";
import SelectTemplateDialog from "../../pages/TemplateManager/SelectTemplateDialog";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/ApplicationManagerTable.css";
import "../../styles/sharedStyles.css";
import "../../styles/userProfileinfoCard.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import FaqDialog from "../FAQDialog/FaqDialog";
import DeleteDialogue from "../shared/Dialogs/DeleteDialogue";
import OutboundCallDialog from "../shared/Dialogs/OutboundCallDialog";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../shared/Loader/LeefLottieAnimationLoader";
import UserProfileAPICallDialog from "../shared/UserProfileAPICallDialog/UserProfileAPICallDialog";
import CustomTabs from "../shared/tab-panel/CustomTabs";
import AddTagDialog from "../ui/application-manager/AddTagDialog";
import AssignCounsellorDialog from "../ui/application-manager/AssignCounsellorDialog";
import AddNote from "./AddNote";
import ChangeLeadStage from "./ChangeLeadStage";
import FollowUpListUpdate from "./FollowUpListUpdate";
import Mail from "./Mail";
import ShowLeadSubStage from "./ShowLeadSubStage";
import SmsAndWhatsapp from "./SmsAndWhatsapp";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import CustomTooltip from "../shared/Popover/Tooltip";
const ApplicationHeader = ({
  faqMiniToggle,
  handleFaqMiniDialog,
  setFaqSelectedCourseName,
  leadProfileAction,
  userDetailsStateData,
  viewProfileButton,
  setUserProfileTagToggle,
  leadStepControl,
  setUserProfileOpen,
  setLeadDetailsAPICall,
  viewProfileButtonDisabled,
}) => {
  const [openCallDialog, setOpenCallDialog] = useState(false);
  const [openAddTagDialog, setOpenAddTagDialog] = useState(false);
  const [shouldCallLeadHeaderApiAgain, setShouldCallLeadHeaderApiAgain] =
    useState(false);
  const navigate = useNavigate();
  const pushNotification = useToasterHook();
  let infoData = [
    userDetailsStateData?.studentId,
    userDetailsStateData?.applicationId,
  ];
  const secretKey = `LfFENUfAAAAAH4Dh_lx49xi6IqCA1QytPCpkrT5`;
  var encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(infoData),
    secretKey
  ).toString();
  const profileUrl = `${
    window.location.origin
  }/userProfile/${encodeURIComponent(encryptedData)}`;
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      pushNotification("success", "Profile link copied!");
    } catch (error) {
      pushNotification("error", "Failed to copy");
    }
  };
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const {
    setApiResponseChangeMessage,
    setFaqDialogOpen,
    faqDialogOpen,
    apiResponseChangeMessage,
  } = useContext(DashboradDataContext);
  const handleFAQClickOpen = () => {
    setFaqDialogOpen(true);
  };

  const handleFAQDiaLogClose = () => {
    setFaqDialogOpen(false);
  };

  const [tabNo, setTabNo] = useState(1);

  const renderTags = (tags) => {
    return tags?.map((tag, index) => (
      <Box
        key={index}
        className="user-profile-dnd-tag"
        sx={{
          borderRadius: 50,
          backgroundColor: colorCode[index % colorCode?.length],
        }}
      >
        <Typography className="user_Profile-dnd-tag-text-container">
          <Typography className="user_Profile-dnd-tag-text">{tag}</Typography>
          {tag !== "live" && (
            <CloseIcon
              className="delete-tag-icon"
              onClick={() => {
                if (!leadProfileAction) {
                  setClickTag(tag);
                  setOpenDeleteDialog(true);
                }
              }}
              sx={{ fontSize: "12px" }}
            ></CloseIcon>
          )}
        </Typography>
      </Box>
    ));
  };
  const [getKeyCategoriesAPICall, setGetKeyCategoriesAPICall] = useState(false);
  const [
    getKeyCategoriesInternalServerError,
    setGetKeyCategoriesInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInGetKeyCategories,
    setSomethingWentWrongInGetKeyCategories,
  ] = useState(false);
  const [getKeyCategoriesData, setGetKeyCategoriesData] = useState([]);
  const { data, isSuccess, isFetching, error, isError } =
    useGetKeyCategoriesQuery(
      {
        collegeId: collegeId,
      },
      { skip: getKeyCategoriesAPICall ? false : true }
    );
  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setGetKeyCategoriesData(data?.data);
        } else {
          throw new Error("get all key Categories API response has changed");
        }
      }
      if (isError) {
        setGetKeyCategoriesData([]);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setGetKeyCategoriesInternalServerError,
            "",
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInGetKeyCategories,
        "",
        10000
      );
    } finally {
      setGetKeyCategoriesAPICall(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data, error, isError]);
  //FAQ section code here
  const [questionsList, setQuestionsList] = React.useState([]);

  const [getQuestionsInternalServerError, setGetQuestionsInternalServerError] =
    useState(false);
  const [
    somethingWentWrongInGetQuestions,
    setSomethingWentWrongInGetQuestions,
  ] = useState(false);
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const [selectedTags, setSelectedTags] = useState([]);

  const [selectedProgram, setSelectedProgram] = useState([]);
  //faq add Tag
  const handleAddTag = (data) => {
    if (selectedTags?.length > 0) {
      const isTagSelected = selectedTags.includes(data);
      if (isTagSelected) {
        return setSelectedTags([]);
      } else {
        setSelectedTags([data]);
      }
    } else {
      setSelectedTags([data]);
    }
  };
  const {
    data: getQuestionData,
    isSuccess: isSuccessGetQuestion,
    isFetching: isFetchingGetQuestion,
    error: errorGetQuestion,
    isError: isErrorGetQuestion,
  } = useGetQuestionsDataQuery(
    {
      collegeId,
      payload: {
        tags: selectedTags,
        search_pattern: debouncedSearchText,
        program_list: selectedProgram?.length > 0 ? selectedProgram : [],
      },
      applicationId: userDetailsStateData?.applicationId,
    },
    { skip: faqDialogOpen ? false : true }
  );
  useEffect(() => {
    try {
      if (isSuccessGetQuestion) {
        if (Array.isArray(getQuestionData?.data)) {
          setQuestionsList(getQuestionData?.data);
        } else {
          throw new Error("get_details API response has changed");
        }
      }
      if (isErrorGetQuestion) {
        if (
          errorGetQuestion?.data?.detail === "Could not validate credentials"
        ) {
          window.location.reload();
          setQuestionsList([]);
        } else if (errorGetQuestion?.data?.detail) {
          pushNotification("error", errorGetQuestion?.data?.detail);
          setQuestionsList([]);
        }
        if (errorGetQuestion?.status === 500) {
          handleInternalServerError(setGetQuestionsInternalServerError, 10000);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrongInGetQuestions, 10000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getQuestionData?.data,
    errorGetQuestion?.data?.detail,
    errorGetQuestion?.status,
    isErrorGetQuestion,
    isSuccessGetQuestion,
    setApiResponseChangeMessage,
  ]);
  const tokenState = useSelector((state) => state.authentication.token);
  const token = Cookies.get("jwtTokenCredentialsAccessToken");

  //Update new code
  const [openSelectTemplateForUserDialog, setOpenSelectTemplateForUserDialog] =
    React.useState(false);
  const [templateTypeForUser, setTemplateTypeUser] = React.useState("");
  const handleClickOpenSelectTemplateForUser = (type) => {
    setOpenSelectTemplateForUserDialog(true);
    setTemplateTypeUser(type);
  };
  //sms
  const [openDialogsSmsForUser, setOpenDialogsSmsForUser] =
    React.useState(false);
  const handleClickOpenDialogsSmsForUser = useCallback(() => {
    setOpenDialogsSmsForUser(true);
  }, []);
  const handleCloseDialogsSmsForUser = useCallback(() => {
    setOpenDialogsSmsForUser(false);
  }, []);
  const handleCloseSelectTemplateForUser = () => {
    setOpenSelectTemplateForUserDialog(false);
    setOpenDialogsSmsForUser(false);
  };
  const [templateBody, setTemplateBody] = React.useState("");
  const [templateId, setTemplateId] = useState("");
  const [smsDltContentId, setSmsDltContentId] = React.useState("");
  const [smsType, setSmsType] = React.useState("");
  const [smsSenderName, setSenderName] = React.useState("");

  //mail
  const [isSingleComposeOpen, setIsSingleComposeOpen] = useState(false);
  const handleSingleComposerClose = () => {
    setIsSingleComposeOpen(false);
  };
  const handleSingleComposerOpen = () => {
    setIsSingleComposeOpen(true);
  };
  const collegeID = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [shouldCallLeadProfileHeader, setShouldCallLeadProfileHeader] =
    useState(false);
  const [userProfileHeader, setUserProfileHeader] = useState({});
  const [
    somethingWentWrongInUserProfileHeader,
    setSomethingWentWrongInUserProfileHeader,
  ] = useState(false);
  const [
    userProfileHeaderInternalServerError,
    setUserProfileHeaderInternalServerError,
  ] = useState(false);

  //fetch student Header details
  const {
    data: dataLeadHeader,
    isSuccess: isSuccessLeadHeader,
    isFetching: isFetchingLeadHeader,
    error: errorLeadHeader,
    isError: isErrorLeadHeader,
  } = useGetUserProfileLeadHeaderQuery(
    {
      collegeId: collegeId,
      applicationId: userDetailsStateData?.applicationId,
    },
    { skip: userDetailsStateData?.applicationId ? false : true }
  );

  const [userRecentState, setUserRecentStage] = useState();
  useEffect(() => {
    try {
      if (isSuccessLeadHeader) {
        if (Array.isArray(dataLeadHeader?.data)) {
          setUserProfileHeader(dataLeadHeader?.data[0]);
          setUserRecentStage(dataLeadHeader?.data[0]?.basic_info?.lead_stage);
        } else {
          throw new Error("get lead Header API response has changed");
        }
      }
      if (isErrorLeadHeader) {
        setUserProfileHeader({});
        if (
          errorLeadHeader?.data?.detail === "Could not validate credentials"
        ) {
          window.location.reload();
        } else if (errorLeadHeader?.data?.detail) {
          pushNotification("error", errorLeadHeader?.data?.detail);
        }
        if (errorLeadHeader?.status === 500) {
          handleInternalServerError(
            setUserProfileHeaderInternalServerError,
            "",
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInUserProfileHeader,
        "",
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataLeadHeader,
    dataLeadHeader?.data,
    errorLeadHeader,
    isErrorLeadHeader,
    errorLeadHeader?.data?.detail,
    errorLeadHeader?.status,
  ]);

  //lead Steps Control
  useEffect(() => {
    if (leadStepControl) {
      if (userProfileHeader?.tags?.length > 0) {
        setUserProfileTagToggle(true);
      }
    }
  }, [leadStepControl, userProfileHeader]);
  //dialogs to assign multiple lead to counellor
  const [openDialogsAssignCounsellor, setOpenDialogsAssignCounsellor] =
    useState(false);

  const handleClickOpenDialogsAssignCounsellor = () => {
    setOpenDialogsAssignCounsellor(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
  const handleCloseDialogsAssignCounsellor = () => {
    setOpenDialogsAssignCounsellor(false);
  };
  //user profile time line api url
  const [userProfileTimelineData, setUserProfileTimelineData] = useState([]);
  const [somethingWentWrongInTimeline, setSomethingWentWrongInTimeline] =
    useState(false);
  const [hideTimeline, setHideTimeline] = useState(false);
  const [timelineInternalServerError, setTimelineInternalServerError] =
    useState(false);
  const [shouldCallFollowupAndNote, setShouldCallFollowupAndNote] =
    useState(false);

  const [openDialogsLeadStage, setOpenDialogsLeadStage] = React.useState(false);
  const handleClickOpenDialogsLeadStage = () => {
    setOpenDialogsLeadStage(true);
  };

  const handleCloseDialogsLeadStage = () => {
    setOpenDialogsLeadStage(false);
  };
  const [openDialogsFollowup, setOpenDialogsFollowup] = React.useState(false);
  const handleClickOpenDialogsFollowup = () => {
    setOpenDialogsFollowup(true);
  };
  const handleCloseDialogsFollowup = () => {
    setOpenDialogsFollowup(false);
  };
  const [openDialogsNote, setOpenDialogsNote] = React.useState(false);
  const handleClickOpenDialogsNote = () => {
    setOpenDialogsNote(true);
  };
  const handleCloseDialogsNote = () => {
    setOpenDialogsNote(false);
  };
  const [openDialogsWhatsapp, setOpenDialogsWhatsapp] = React.useState(false);
  const handleClickOpenDialogsWhatsapp = () => {
    setOpenDialogsWhatsapp(true);
  };
  const handleCloseDialogsWhatsapp = () => {
    setOpenDialogsWhatsapp(false);
  };
  const [openConfirmAPImessage, setOpenConfirmAPImessage] =
    React.useState(false);
  const handleOpenConfirmAPImessageClick = () => {
    setOpenConfirmAPImessage(true);
  };

  const handleOpenConfirmAPImessageClose = () => {
    setOpenConfirmAPImessage(false);
  };
  const [selectText, setSelectText] = useState("");
  //user profile time line api call
  const {
    data: dataTimeLine,
    isSuccess: isSuccessTimeLine,
    isFetching: isFetchingTimeLine,
    error: errorTimeLine,
    isError: isErrorTimeLine,
  } = useGetUserProfileTimelineInfoQuery(
    {
      collegeId: collegeId,
      applicationId: userDetailsStateData?.applicationId,
      payload: {},
    },
    { skip: openDialogsLeadStage ? false : true }
  );

  useEffect(() => {
    try {
      if (isSuccessTimeLine) {
        if (Array.isArray(dataTimeLine?.data[0]?.student_timeline)) {
          setUserProfileTimelineData(dataTimeLine?.data[0]?.student_timeline);
        } else {
          throw new Error("getTime line API response has changed");
        }
      }
      if (isErrorTimeLine) {
        setUserProfileTimelineData([]);
        if (errorTimeLine?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (errorTimeLine?.data?.detail) {
          pushNotification("error", errorTimeLine?.data?.detail);
        }
        if (errorTimeLine?.status === 500) {
          handleInternalServerError(
            setTimelineInternalServerError,
            setHideTimeline,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInTimeline,
        setHideTimeline,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataTimeLine,
    dataTimeLine?.data,
    errorTimeLine,
    isErrorTimeLine,
    errorTimeLine?.data?.detail,
    errorTimeLine?.status,
  ]);

  const [followupAndNoteData, setFollowupAndNoteData] = useState({});
  const [
    somethingWentWrongInFollowupAndNotes,
    setSomethingWentWrongInFollowupAndNotes,
  ] = useState(false);
  const [
    followupAndNotesInternalServerError,
    setFollowupAndNotesInternalServerError,
  ] = useState(false);
  const [hideFollowupAndNotes, setHideFollowupAndNotes] = useState(false);
  // get followup and note timeline
  const {
    data: dataFollowupNote,
    isSuccess: isSuccessFollowupNote,
    isFetching: isFetchingFollowupNote,
    error: errorFollowupNote,
    isError: isErrorFollowupNote,
  } = useGetUserProfileTimelineFollowupNoteQuery(
    {
      collegeId: collegeId,
      applicationId: userDetailsStateData?.applicationId,
    },
    { skip: openDialogsNote || openDialogsFollowup ? false : true }
  );

  useEffect(() => {
    try {
      if (isSuccessFollowupNote) {
        if (typeof dataFollowupNote === "object" && dataFollowupNote !== null) {
          setFollowupAndNoteData(dataFollowupNote);
        } else {
          throw new Error("get follow up and note API response has changed");
        }
      }
      if (isErrorFollowupNote) {
        setFollowupAndNoteData({});
        if (
          errorFollowupNote?.data?.detail === "Could not validate credentials"
        ) {
          window.location.reload();
        } else if (errorFollowupNote?.data?.detail) {
          pushNotification("error", errorFollowupNote?.data?.detail);
        }
        if (errorFollowupNote?.status === 500) {
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
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataFollowupNote,
    errorFollowupNote,
    isErrorFollowupNote,
    errorFollowupNote?.data?.detail,
    errorFollowupNote?.status,
  ]);
  const [timelineToggle, setTimelineToggle] = useState(false);
  const [skipCounselorDataApiCall, setSkipCounselorDataApiCall] = useState(
    tokenState?.scopes?.[0] === "college_counselor" ? false : true
  );
  //counsellor state
  const [hideCounsellorList, setHideCounsellorList] = useState(false);
  const [
    counsellorListInternalServerError,
    setCounsellorListInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInCounsellorList,
    setSomethingWentWrongInCounsellorList,
  ] = useState(false);
  const [counsellorDataList, setCounsellorDataList] = useState([]);
  // list option api calling state
  const counselorDataListApiCallInfo = useGetCounselorDataListQuery(
    { isHoliday: false, collegeId: collegeID },
    {
      skip: skipCounselorDataApiCall,
    }
  );
  const { handleFilterListApiCall } = useCommonApiCalls();
  //get counsellor list
  useEffect(() => {
    if (!skipCounselorDataApiCall) {
      const counselorValueList = counselorDataListApiCallInfo?.data?.data[0];
      handleFilterListApiCall(
        counselorValueList,
        counselorDataListApiCallInfo,
        setCounsellorDataList,
        setHideCounsellorList,
        null,
        null,
        setCounsellorListInternalServerError,
        setSomethingWentWrongInCounsellorList
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCounselorDataApiCall, counselorDataListApiCallInfo]);

  const [somethingWentWrongInDeleteTag, setSomethingWentWrongInDeleteTag] =
    useState(false);
  const [deleteTagInternalServerError, setDeleteTagInternalServerError] =
    useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [clickedTag, setClickTag] = useState("");
  // Delete Slot and panel API Setup done
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteTag] = useDeleteTagMutation();
  const handleDeleteTag = () => {
    const payload = {
      student_id: userDetailsStateData?.studentId,
      tag: clickedTag,
    };
    setDeleteLoading(true);
    deleteTag({ collegeId: collegeID, payload })
      .unwrap()
      .then((response) => {
        try {
          if (response.message) {
            pushNotification("success", response.message);
          } else {
            throw new Error("Delete tag API response has been changed.");
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setSomethingWentWrongInDeleteTag, "", 5000);
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else {
          handleInternalServerError(setDeleteTagInternalServerError, "", 10000);
        }
      })
      .finally(() => {
        setDeleteLoading(false);
        setClickTag("");
        setOpenDeleteDialog(false);
        // setClickedStudentId([]);
      });
  };
  // filter option api calling state
  const [callFilterOptionApi, setCallFilterOptionApi] = useState({
    skipCounselorApiCall: true,
  });
  const [counsellorList, setCounsellorList] = useState([]);
  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId: collegeID },
    {
      skip: callFilterOptionApi.skipCounselorApiCall,
    }
  );

  //get counsellor list
  useEffect(() => {
    if (!callFilterOptionApi.skipCounselorApiCall) {
      const counselorList = counselorListApiCallInfo.data?.data[0];
      handleFilterListApiCall(
        counselorList,
        counselorListApiCallInfo,
        setCounsellorList,
        () => {},
        organizeCounselorFilterOption
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callFilterOptionApi.skipCounselorApiCall, counselorListApiCallInfo]);

  //faq filter data
  // useEffect(() => {
  //   if (getKeyCategoriesData?.length > 0 && selectedTags?.length > 0) {
  //     const filterKeys = getKeyCategoriesData.filter(
  //       (item) => item.category_name !== selectedTags[0]
  //     );
  //     if (filterKeys.length !== getKeyCategoriesData.length) {
  //       setGetKeyCategoriesData(filterKeys);
  //     }
  //   }
  // }, [getKeyCategoriesData, selectedTags]);
  const { setScriptPayload, setStudentInfoDetails } =
    useContext(LayoutSettingContext);
  useEffect(() => {
    if (userProfileHeader) {
      setScriptPayload({
        tags:
          userProfileHeader?.tags?.length > 0 ? userProfileHeader?.tags : [],
        application_stage:
          userProfileHeader?.basic_info?.application_stage?.length > 0
            ? userProfileHeader?.basic_info?.application_stage
            : "",
        lead_stage:
          userProfileHeader?.basic_info?.lead_stage?.length > 0
            ? userProfileHeader?.basic_info?.lead_stage
            : "",
        source:
          userProfileHeader?.lead_source?.length > 0
            ? userProfileHeader?.lead_source
            : "",
      });
      const amountOfCourse = userProfileHeader?.basic_info?.amount
        ?.split(".")[1]
        ?.split("/")[0];
      setStudentInfoDetails({
        student_name: userProfileHeader?.basic_info?.name,
        amount: amountOfCourse,
        courseName: userProfileHeader?.basic_info?.course_name,
        specName: userProfileHeader?.basic_info?.spec_name
          ? userProfileHeader?.basic_info?.spec_name
          : null,
        customApplicationId: userProfileHeader?.basic_info
          ?.custom_application_id
          ? userProfileHeader?.basic_info?.custom_application_id
          : "N/A",
        paymentStatus: userProfileHeader?.basic_info?.payment_status
          ? userProfileHeader?.basic_info?.payment_status
          : "",
        applicationId: userProfileHeader?.basic_info?.application_id,
        email: userProfileHeader?.basic_info?.email
          ? userProfileHeader?.basic_info?.email
          : null,
        mobile: userProfileHeader?.basic_info?.mobile
          ? userProfileHeader?.basic_info?.mobile
          : null,
      });
    }
  }, [userProfileHeader]);
  return (
    <>
      {userProfileHeaderInternalServerError ||
      somethingWentWrongInUserProfileHeader ||
      followupAndNotesInternalServerError ||
      somethingWentWrongInFollowupAndNotes ||
      deleteTagInternalServerError ||
      somethingWentWrongInDeleteTag ? (
        <>
          {(userProfileHeaderInternalServerError ||
            followupAndNotesInternalServerError ||
            deleteTagInternalServerError) && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {(somethingWentWrongInUserProfileHeader ||
            somethingWentWrongInFollowupAndNotes ||
            somethingWentWrongInDeleteTag) && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </>
      ) : (
        <>
          {isFetchingLeadHeader ? (
            <Box className="loading-lottie-file-container">
              <LeefLottieAnimationLoader
                height={200}
                width={180}
              ></LeefLottieAnimationLoader>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ mb: "5px" }} className="user-profile-tag-container">
                  {userProfileHeader?.tags?.length > 0 && (
                    <>{renderTags(userProfileHeader?.tags)}</>
                  )}
                  <button
                    className="add-tag-button"
                    onClick={() => setOpenAddTagDialog(true)}
                  >
                    <Typography>Add Tag</Typography>
                    <AddIcon />
                  </button>
                </Box>
                {viewProfileButton && (
                  <IconButton sx={{ mb: "5px" }}>
                    <CloseIcon
                      sx={{ cursor: "pointer" }}
                      onClick={() => setUserProfileOpen(false)}
                    />
                  </IconButton>
                )}
              </Box>
              <Card className="User-profile-card-container">
                <Box className="User-Info-head-box-container">
                  <img
                    src={
                      userProfileHeader?.basic_info?.recent_photo === "NA"
                        ? userProfilePhoto
                        : userProfileHeader?.basic_info?.recent_photo
                    }
                    className="profile-photo-size"
                  />
                  <Box>
                    <Typography className="user-name-text">
                      {userProfileHeader?.basic_info?.name
                        ? userProfileHeader?.basic_info?.name
                        : "N/A"}
                    </Typography>
                    <Typography className="user-profile-program-container">
                      <Typography className="program-name-text">
                        {userProfileHeader?.basic_info?.course_name ? (
                          <>
                            {userProfileHeader?.basic_info?.course_name &&
                              userProfileHeader?.basic_info?.spec_name &&
                              `${userProfileHeader?.basic_info?.course_name} In ${userProfileHeader?.basic_info?.spec_name}`}
                            {!userProfileHeader?.basic_info?.spec_name &&
                              `${userProfileHeader?.basic_info?.course_name}`}
                          </>
                        ) : (
                          "N/A"
                        )}
                        {userProfileHeader?.basic_info?.course_name ? (
                          <Tooltip
                            title={
                              !leadProfileAction ? "FAQs" : "Restricted Action"
                            }
                            placement="right-start"
                          >
                            <OpenInNewIcon
                              onClick={() => {
                                if (!leadProfileAction) {
                                  if (
                                    userProfileHeader?.basic_info?.course_name
                                  ) {
                                    setGetKeyCategoriesAPICall(true);
                                    handleFAQClickOpen();
                                    setSelectedProgram([
                                      {
                                        course_name:
                                          userProfileHeader?.basic_info
                                            ?.course_name,
                                        course_id: userProfileHeader?.basic_info
                                          ?.course_id
                                          ? userProfileHeader?.basic_info
                                              ?.course_id
                                          : "",
                                        course_specialization: userProfileHeader
                                          ?.basic_info?.spec_name
                                          ? userProfileHeader?.basic_info
                                              ?.spec_name
                                          : null,
                                      },
                                    ]);
                                    if (faqMiniToggle) {
                                      setFaqSelectedCourseName(
                                        userProfileHeader?.basic_info
                                          ?.course_name &&
                                          userProfileHeader?.basic_info
                                            ?.spec_name
                                          ? `${userProfileHeader?.basic_info?.course_name} in ${userProfileHeader?.basic_info?.spec_name}`
                                          : !userProfileHeader?.basic_info
                                              ?.spec_name &&
                                              `${userProfileHeader?.basic_info?.course_name}`
                                      );
                                    }
                                  }
                                }
                              }}
                              className="user_openInNew_icon"
                            ></OpenInNewIcon>
                          </Tooltip>
                        ) : (
                          ""
                        )}
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
                <Typography className="user-Profile-application-No-container">
                  <Typography className="user-profile-application-text">
                    Application No:
                  </Typography>
                  <Typography className="user-profile-application-text-data">
                    {userProfileHeader?.basic_info?.custom_application_id
                      ? userProfileHeader?.basic_info?.custom_application_id
                      : "N/A"}
                  </Typography>
                </Typography>
                <Typography className="user-Profile-assign-counselor-container">
                  <Typography className="user-profile-application-text">
                    Assigned to:
                  </Typography>
                  <Typography
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      if (!leadProfileAction) {
                        if (tokenState?.scopes?.[0] !== "college_counselor") {
                          handleClickOpenDialogsAssignCounsellor();
                        }
                      }
                    }}
                    className="user-profile-application-text-data"
                  >
                    {userProfileHeader?.assigned_counselor
                      ? userProfileHeader?.assigned_counselor
                      : "N/A"}
                    {tokenState?.scopes?.[0] === "college_counselor" ? (
                      ""
                    ) : (
                      <Tooltip
                        title={
                          !leadProfileAction
                            ? "Change Counsellor"
                            : "Restricted Action"
                        }
                        placement="top"
                      >
                        <img
                          className="user-profile-counselor-photo-icon"
                          src={counselorNameChangeIcon}
                        />
                      </Tooltip>
                    )}
                  </Typography>
                </Typography>
                <hr style={{ marginTop: "10px", marginBottom: "10px" }} />
                <Typography className="user-Profile-lead-stage-container">
                  <Typography className="user-profile-lead-stage-text">
                    Lead stage:
                  </Typography>

                  <Typography
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      if (!leadProfileAction) {
                        handleClickOpenDialogsLeadStage();
                        setTimelineToggle(true);
                      }
                    }}
                    className="user-profile-lead-stage-text-data"
                  >
                    <Tooltip
                      title={
                        !leadProfileAction
                          ? "Change Lead stage"
                          : "Restricted Action"
                      }
                      placement="top"
                      arrow
                    >
                      <span>
                        {userProfileHeader?.basic_info?.lead_stage
                          ? userProfileHeader?.basic_info?.lead_stage
                          : "N/A"}
                      </span>
                    </Tooltip>
                    {userProfileHeader?.basic_info?.lead_sub_stage?.length &&
                    userProfileHeader?.basic_info?.lead_sub_stage !== "NA" ? (
                      <>
                        |
                        <ShowLeadSubStage
                          userProfileHeader={userProfileHeader}
                        />
                      </>
                    ) : (
                      ""
                    )}
                  </Typography>
                </Typography>
                <Typography className="user-number-box-container">
                  <Tooltip
                    title={
                      !leadProfileAction ? "Phone call" : "Restricted Action"
                    }
                    placement="top"
                  >
                    <Typography
                      onClick={() => {
                        if (!leadProfileAction) {
                          setOpenCallDialog(true);
                          /*
                          For now this functionality is not needed because we are introducing telephony. If required in future we will uncomment it.

                        window.open(
                          `tel:${
                            userProfileHeader?.basic_info?.mobile
                              ? userProfileHeader?.basic_info?.mobile
                              : "NA"
                          }`,
                          "_self"
                        );
                        */
                        }
                      }}
                      className="user-profile-mobile-text"
                    >
                      {userProfileHeader?.basic_info?.mobile
                        ? userProfileHeader?.basic_info?.mobile
                        : "N/A"}
                    </Typography>
                  </Tooltip>
                  <Tooltip
                    title={
                      !leadProfileAction
                        ? "Send verification OTP"
                        : "Restricted Action"
                    }
                    placement="right-start"
                  >
                    <img
                      onClick={() => {
                        if (!leadProfileAction) {
                          handleOpenConfirmAPImessageClick();
                          setSelectText("mobile");
                        }
                      }}
                      src={lockIcon}
                      className="lock-photo-size"
                    />
                  </Tooltip>
                  <Box
                    className={
                      userProfileHeader?.basic_info?.verify_mobile
                        ? "user-verified-icon-design-active"
                        : "user-verified-icon-design"
                    }
                  ></Box>
                </Typography>
                <Typography
                  onClick={() => {
                    if (!leadProfileAction) {
                      handleOpenConfirmAPImessageClick();
                      setSelectText("mail");
                    }
                  }}
                  className="user-number-box-container"
                >
                  <Typography className="user-profile-email-text">
                    {userProfileHeader?.basic_info?.email
                      ? userProfileHeader?.basic_info?.email
                      : "N/A"}
                  </Typography>
                  {userProfileHeader?.basic_info?.email ? (
                    <>
                      <Tooltip
                        title={
                          !leadProfileAction
                            ? "Send verification email"
                            : "Restricted Action"
                        }
                        placement="right-start"
                      >
                        <img src={mailIcon} className="lock-photo-size" />
                      </Tooltip>
                      <Box
                        className={
                          userProfileHeader?.basic_info?.verify_email
                            ? "user-verified-icon-design-active"
                            : "user-verified-icon-design"
                        }
                      ></Box>
                    </>
                  ) : (
                    ""
                  )}
                </Typography>
                <Typography
                  sx={{ mt: "7px" }}
                  className="user-Profile-lead-stage-container"
                >
                  <Typography className="user-profile-Application-stage">
                    Application stage:
                  </Typography>
                  <Typography className="user-profile-Application-stage-data">
                    {userProfileHeader?.basic_info?.application_stage
                      ? userProfileHeader?.basic_info?.application_stage
                      : "N/A"}
                  </Typography>
                </Typography>
              </Card>
              <Card className="user_middle-card-container">
                {tabNo === 1 && (
                  <Box sx={{ marginBottom: "20px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={5} sm={6} md={6}>
                        <Typography className="user-lead-age-text">
                          Lead Age
                        </Typography>
                      </Grid>
                      <Grid item xs={7} sm={6} md={6}>
                        <Typography className="user-lead-age-text">
                          {`${
                            userProfileHeader?.lead_age
                              ? userProfileHeader?.lead_age
                              : "0"
                          } Days`}{" "}
                          {userProfileHeader?.lead_age_date
                            ? `(${userProfileHeader?.lead_age_date})`
                            : ""}
                        </Typography>
                      </Grid>
                    </Grid>
                    <hr className="hr-tag-color" />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={5} md={5}>
                        <Typography className="user-lead-age-text">
                          Communications
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={7} md={7}>
                        <Typography className="user-lead-age-container">
                          <Box sx={{ textAlign: "center" }}>
                            <MailOutlineIcon
                              sx={{
                                color: "rgba(0, 140, 224, 1)",
                                fontSize: "20px",
                              }}
                            />
                            <Typography
                              sx={{ fontSize: "17px", fontWeight: 500 }}
                            >
                              {userProfileHeader?.communication_status
                                ?.email_sent
                                ? userProfileHeader?.communication_status
                                    ?.email_sent
                                : "0"}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "center" }}>
                            <TextsmsOutlinedIcon
                              sx={{
                                color: "rgba(0, 140, 224, 1)",
                                fontSize: "20px",
                              }}
                            />
                            <Typography
                              sx={{ fontSize: "17px", fontWeight: 500 }}
                            >
                              {userProfileHeader?.communication_status?.sms_sent
                                ? userProfileHeader?.communication_status
                                    ?.sms_sent
                                : "0"}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "center" }}>
                            <WhatsAppIcon
                              sx={{
                                color: "rgba(0, 140, 224, 1)",
                                fontSize: "20px",
                              }}
                            />
                            <Typography
                              sx={{ fontSize: "17px", fontWeight: 500 }}
                            >
                              {userProfileHeader?.communication_status
                                ?.whatsapp_sent
                                ? userProfileHeader?.communication_status
                                    ?.whatsapp_sent
                                : "0"}
                            </Typography>
                          </Box>
                        </Typography>
                      </Grid>
                    </Grid>

                    <hr className="hr-tag-color" />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={5} md={5}>
                        <Typography className="user-lead-age-text">
                          Calling
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={7} md={7}>
                        <Typography className="user-lead-age-container">
                          <Box sx={{ textAlign: "center" }}>
                            <img
                              className="call-photo-size"
                              src={incomingCallIcon}
                            />
                            <Typography
                              sx={{ fontSize: "17px", fontWeight: 500 }}
                            >
                              {userProfileHeader?.telephony_status?.inbound_call
                                ? userProfileHeader?.telephony_status
                                    ?.inbound_call
                                : "0"}
                            </Typography>
                            <Typography sx={{ fontSize: "11px" }}>{`${
                              userProfileHeader?.telephony_status
                                ?.inbound_call_duration
                                ? secondsToMinutesAndSeconds(
                                    userProfileHeader?.telephony_status
                                      ?.inbound_call_duration
                                  )
                                : "0s"
                            }`}</Typography>
                          </Box>
                          <Box sx={{ textAlign: "center" }}>
                            <img
                              className="call-photo-size"
                              src={outgoingCallIcon}
                            />
                            <Typography
                              sx={{ fontSize: "17px", fontWeight: 500 }}
                            >
                              {userProfileHeader?.telephony_status
                                ?.outbound_call
                                ? userProfileHeader?.telephony_status
                                    ?.outbound_call
                                : "0"}
                            </Typography>
                            <Typography sx={{ fontSize: "11px" }}>{`${
                              userProfileHeader?.telephony_status
                                ?.outbound_call_duration
                                ? secondsToMinutesAndSeconds(
                                    userProfileHeader?.telephony_status
                                      ?.outbound_call_duration
                                  )
                                : "0s"
                            }`}</Typography>
                          </Box>
                          <Box sx={{ textAlign: "center" }}>
                            <img
                              className="call-photo-size"
                              src={missedCallIcon}
                            />
                            <Typography
                              sx={{ fontSize: "17px", fontWeight: 500 }}
                            >
                              {userProfileHeader?.telephony_status?.missed_call
                                ? userProfileHeader?.telephony_status
                                    ?.missed_call
                                : "0"}
                            </Typography>
                          </Box>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {tabNo === 2 && (
                  <Box sx={{ marginBottom: "20px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={5} md={5}>
                        <Typography className="user-lead-age-text">
                          Primary source
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={7} md={7}>
                        <Typography className="user-primary-container">
                          <Box>
                            <Typography className="user-source-text-container">
                              <Typography sx={{ fontSize: "14px" }}>
                                Source:{" "}
                              </Typography>
                              {userProfileHeader.lead_source.length > 20 ? (
                                <CustomTooltip
                                  description={
                                    <Typography
                                      sx={{
                                        fontWeight: 700,
                                        fontSize: "14px",
                                        whiteSpace: "wrap",
                                      }}
                                      noWrap={false}
                                    >
                                      {userProfileHeader.lead_source}
                                    </Typography>
                                  }
                                  component={
                                    <Typography
                                      className="user-lead-source-content"
                                      sx={{
                                        whiteSpace: "nowrap",
                                        cursor: "pointer",
                                      }}
                                      noWrap={false}
                                    >
                                      {userProfileHeader.lead_source}
                                    </Typography>
                                  }
                                />
                              ) : (
                                <Typography
                                  className="user-lead-source-content"
                                  sx={{
                                    whiteSpace: "nowrap",
                                    cursor: "auto",
                                  }}
                                  noWrap={false}
                                >
                                  {userProfileHeader?.lead_source}
                                </Typography>
                              )}
                            </Typography>
                            <Typography className="user-source-text-container">
                              <Typography sx={{ fontSize: "14px" }}>
                                Medium:{" "}
                              </Typography>
                              <Typography
                                sx={{ fontWeight: 700, fontSize: "14px" }}
                              >
                                {userProfileHeader?.utm_medium
                                  ? userProfileHeader?.utm_medium
                                  : "N/A"}
                              </Typography>
                            </Typography>
                            <Typography className="user-source-text-container">
                              <Typography sx={{ fontSize: "14px" }}>
                                Campaign:{" "}
                              </Typography>
                              <Typography
                                sx={{ fontWeight: 700, fontSize: "14px" }}
                              >
                                {userProfileHeader?.utm_campaign_name
                                  ? userProfileHeader?.utm_campaign_name
                                  : "N/A"}
                              </Typography>
                            </Typography>
                          </Box>
                        </Typography>
                      </Grid>
                    </Grid>
                    <hr className="hr-tag-color" />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={5} md={5}>
                        <Typography className="user-lead-age-text">
                          Lead overlap
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={7} md={7}>
                        <Typography className="user-lead-age-container">
                          <Box>
                            <Typography className="user-source-text-container">
                              <Typography sx={{ fontSize: "14px" }}>
                                Primary:{" "}
                              </Typography>

                              {userProfileHeader.lead_source.length > 20 ? (
                                <CustomTooltip
                                  description={
                                    <Typography
                                      sx={{
                                        fontWeight: 700,
                                        fontSize: "14px",
                                        whiteSpace: "wrap",
                                      }}
                                      noWrap={false}
                                    >
                                      {userProfileHeader.lead_source}
                                    </Typography>
                                  }
                                  component={
                                    <Typography
                                      className="user-lead-source-content"
                                      sx={{
                                        whiteSpace: "nowrap",
                                        cursor: "pointer",
                                      }}
                                      noWrap={false}
                                    >
                                      {userProfileHeader.lead_source}
                                    </Typography>
                                  }
                                />
                              ) : (
                                <Typography
                                  className="user-lead-source-content"
                                  sx={{
                                    whiteSpace: "nowrap",
                                    cursor: "auto",
                                  }}
                                  noWrap={false}
                                >
                                  {userProfileHeader?.lead_source}
                                </Typography>
                              )}
                            </Typography>
                            <Typography className="user-source-text-container">
                              <Typography sx={{ fontSize: "14px" }}>
                                Secondary:{" "}
                              </Typography>
                              <Typography
                                sx={{ fontWeight: 700, fontSize: "14px" }}
                              >
                                {userProfileHeader?.sec_ter_source
                                  ? userProfileHeader?.sec_ter_source[0]
                                  : "N/A"}
                              </Typography>
                            </Typography>
                            <Typography className="user-source-text-container">
                              <Typography sx={{ fontSize: "14px" }}>
                                Tertlary:{" "}
                              </Typography>
                              <Typography
                                sx={{ fontWeight: 700, fontSize: "14px" }}
                              >
                                {userProfileHeader?.sec_ter_source
                                  ? userProfileHeader?.sec_ter_source[1]
                                  : "N/A"}
                              </Typography>
                            </Typography>
                          </Box>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                <CustomTabs setTabNo={setTabNo} tabNo={tabNo} />
              </Card>
              <Card className="user_bottom-card-container">
                <Box className="all_social_media_icon">
                  <Tooltip
                    title={!leadProfileAction ? "Mail" : "Restricted Action"}
                    placement="top"
                  >
                    <MailOutlineIcon
                      sx={{ fontSize: "20px" }}
                      onClick={() => {
                        if (!leadProfileAction) {
                          handleSingleComposerOpen();
                        }
                      }}
                    />
                  </Tooltip>
                  <Tooltip
                    title={
                      !leadProfileAction ? "Whatsapp" : "Restricted Action"
                    }
                    placement="top"
                  >
                    <img
                      style={{ width: "20px", height: "20px" }}
                      src={SendWhatsappIcon}
                      onClick={() => {
                        if (!leadProfileAction) {
                          handleClickOpenDialogsWhatsapp();
                          handleClickOpenSelectTemplateForUser("whatsapp");
                        }
                      }}
                    />
                  </Tooltip>
                  <Tooltip
                    title={!leadProfileAction ? "SMS" : "Restricted Action"}
                    placement="top"
                  >
                    <TextsmsOutlinedIcon
                      sx={{ fontSize: "20px" }}
                      onClick={() => {
                        if (!leadProfileAction) {
                          handleClickOpenDialogsSmsForUser();
                          handleClickOpenSelectTemplateForUser("sms");
                        }
                      }}
                    />
                  </Tooltip>
                  <Tooltip
                    title={
                      !leadProfileAction ? "Open Whatsapp" : "Restricted Action"
                    }
                    placement="top"
                  >
                    <WhatsAppIcon
                      sx={{ fontSize: "20px" }}
                      onClick={() => {
                        if (!leadProfileAction) {
                          window.open(
                            `${whatsappURL}${userProfileHeader?.basic_info?.mobile}`
                          );
                        }
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Add Note" placement="top">
                    <NoteAddOutlinedIcon
                      sx={{ fontSize: "20px" }}
                      onClick={() => {
                        handleClickOpenDialogsNote();
                      }}
                    />
                  </Tooltip>
                  <Tooltip
                    title={
                      !leadProfileAction ? "Add Follow up" : "Restricted Action"
                    }
                    placement="top"
                  >
                    <img
                      src={followUpIcon}
                      onClick={() => {
                        if (!leadProfileAction) {
                          handleClickOpenDialogsFollowup();
                        }
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Profile share" placement="top">
                    <ShareIcon
                      sx={{ fontSize: "20px" }}
                      onClick={() => copyToClipboard()}
                    />
                  </Tooltip>
                </Box>
              </Card>
              {viewProfileButton && (
                <Box sx={{ my: "10px", display: "grid", placeItems: "center" }}>
                  <Button
                    onClick={() => {
                      navigate("/userProfile", {
                        state: userDetailsStateData,
                      });
                    }}
                    sx={{ borderRadius: 50 }}
                    variant="contained"
                    size="medium"
                    color="info"
                    className={
                      userDetailsStateData?.viewProfileButtonDisabled
                        ? "view-profile-button-disabled"
                        : "view-profile-button"
                    }
                    disabled={userDetailsStateData?.viewProfileButtonDisabled}
                  >
                    View Profile
                  </Button>
                </Box>
              )}
            </>
          )}
        </>
      )}
      <Drawer
        anchor={"right"}
        open={faqDialogOpen}
        disableEnforceFocus={false}
        onClose={() => {
          handleFAQDiaLogClose();
        }}
        className="vertical-scrollbar-drawer"
        sx={{ zIndex: 1300 }}
      >
        <Box className="faq-question-drawer-box-container">
          <FaqDialog
            handleFAQClose={handleFAQDiaLogClose}
            isFetching={isFetching}
            getKeyCategoriesData={getKeyCategoriesData}
            somethingWentWrongInGetKeyCategories={
              somethingWentWrongInGetKeyCategories
            }
            getKeyCategoriesInternalServerError={
              getKeyCategoriesInternalServerError
            }
            apiResponseChangeMessage={apiResponseChangeMessage}
            setSearchText={setSearchText}
            searchText={searchText}
            setSelectedTags={setSelectedTags}
            getQuestionsInternalServerError={getQuestionsInternalServerError}
            somethingWentWrongInGetQuestions={somethingWentWrongInGetQuestions}
            questionsList={questionsList}
            isFetchingGetQuestion={isFetchingGetQuestion}
            faqMiniToggle={faqMiniToggle}
            handleFaqMiniDialog={handleFaqMiniDialog}
            handleAddTag={handleAddTag}
          ></FaqDialog>
        </Box>
      </Drawer>
      {/* Add New code */}
      {openDialogsAssignCounsellor && (
        <Box>
          <AssignCounsellorDialog
            color={"application"}
            handleClickOpenDialogs={handleClickOpenDialogsAssignCounsellor}
            handleCloseDialogs={handleCloseDialogsAssignCounsellor}
            openDialogs={openDialogsAssignCounsellor}
            selectedApplicationIds={[userDetailsStateData?.applicationId]}
            counsellorList={counsellorList}
            setShouldCallLeadProfileHeader={setShouldCallLeadProfileHeader}
            setCallFilterOptionApi={setCallFilterOptionApi}
            loading={counselorListApiCallInfo?.isFetching}
          ></AssignCounsellorDialog>
        </Box>
      )}
      {/* select sms template component  */}
      {openSelectTemplateForUserDialog && (
        <SelectTemplateDialog
          setTemplateId={setTemplateId}
          handleClickOpenDialogsSms={handleClickOpenDialogsSmsForUser}
          openDialoge={openSelectTemplateForUserDialog}
          handleClose={handleCloseSelectTemplateForUser}
          setTemplateBody={setTemplateBody}
          setSmsDltContentId={setSmsDltContentId}
          setSmsType={setSmsType}
          setSenderName={setSenderName}
          from={templateTypeForUser}
        ></SelectTemplateDialog>
      )}
      {/*TO DO: Change application Stages */}
      {/* <Box>
        <ChangeApplicationStages
                  counsellorList={counsellorList}
                  applicationStage={
                    userProfileHeader?.basic_info?.application_stage
                  }
                  applicationId={
                    state?.eventType ? state?.applicationId : application_id
                  }
                  data-testid="change-application-stage-component"
                  color={"application"}
                  timeLineData={userProfileTimelineData}
                  handleClickOpenDialogs={handleClickOpenDialogsApplication}
                  handleCloseDialogs={handleCloseDialogsApplication}
                  openDialogs={openDialogsApplication}
                  setOpenDialogs={setOpenDialogsApplication}
                  setShouldCallLeadProfileHeader={
                    setShouldCallLeadProfileHeader
                  }
                  setShouldCallFollowupAndNote={setShouldCallFollowupAndNote}
                  counsellorListInternalServerError={
                    counsellorListInternalServerError
                  }
                  hideCounsellorList={hideCounsellorList}
                  somethingWentWrongInCounsellorList={
                    somethingWentWrongInCounsellorList
                  }
                  timelineInternalServerError={timelineInternalServerError}
                  hideTimeline={hideTimeline}
                  somethingWentWrongInTimeline={somethingWentWrongInTimeline}
                  setSkipCounselorApiCall={setSkipCounselorApiCall}
                  loading={counselorListApiCallInfo.isFetching}
                ></ChangeApplicationStages>
      </Box> */}
      {/* Change Lead Stages */}
      <Box>
        <ChangeLeadStage
          applicationId={
            userDetailsStateData?.applicationId
              ? userDetailsStateData?.applicationId
              : ""
          }
          // application_id
          color={"application"}
          userRecentState={userRecentState}
          timeLineData={userProfileTimelineData}
          handleClickOpenDialogs={handleClickOpenDialogsLeadStage}
          handleCloseDialogs={handleCloseDialogsLeadStage}
          openDialogs={openDialogsLeadStage}
          setOpenDialogs={setOpenDialogsLeadStage}
          setShouldCallLeadProfileHeader={setShouldCallLeadProfileHeader}
          setShouldCallFollowupAndNote={setShouldCallFollowupAndNote}
          counsellorListInternalServerError={counsellorListInternalServerError}
          hideCounsellorList={hideCounsellorList}
          somethingWentWrongInCounsellorList={
            somethingWentWrongInCounsellorList
          }
          timelineInternalServerError={timelineInternalServerError}
          hideTimeline={hideTimeline}
          somethingWentWrongInTimeline={somethingWentWrongInTimeline}
          timelineToggle={timelineToggle}
        ></ChangeLeadStage>
      </Box>
      {/* Add Follow Up */}
      <Box>
        <FollowUpListUpdate
          data-testid="follow-up-list-component"
          color={"followup"}
          followUpData={followupAndNoteData?.followups}
          handleClickOpenDialogs={handleClickOpenDialogsFollowup}
          handleCloseDialogs={handleCloseDialogsFollowup}
          openDialogs={openDialogsFollowup}
          setOpenDialogs={setOpenDialogsFollowup}
          applicationId={
            userDetailsStateData?.applicationId
              ? userDetailsStateData?.applicationId
              : ""
          }
          counsellorList={counsellorDataList}
          setShouldCallLeadProfileHeader={setShouldCallLeadProfileHeader}
          counsellorListInternalServerError={counsellorListInternalServerError}
          hideCounsellorList={hideCounsellorList}
          somethingWentWrongInCounsellorList={
            somethingWentWrongInCounsellorList
          }
          timelineInternalServerError={timelineInternalServerError}
          hideTimeline={hideTimeline}
          somethingWentWrongInTimeline={somethingWentWrongInTimeline}
          setSkipCounselorApiCall={setSkipCounselorDataApiCall}
          loading={counselorDataListApiCallInfo.isFetching}
        ></FollowUpListUpdate>
      </Box>
      {/* Add Note */}
      <Box>
        <AddNote
          color={"note"}
          followUpData={followupAndNoteData?.notes}
          handleClickOpenDialogs={handleClickOpenDialogsNote}
          handleCloseDialogs={handleCloseDialogsNote}
          openDialogs={openDialogsNote}
          setOpenDialogs={setOpenDialogsNote}
          applicationId={
            userDetailsStateData?.applicationId
              ? userDetailsStateData?.applicationId
              : ""
          }
          timelineInternalServerError={timelineInternalServerError}
          hideTimeline={hideTimeline}
          somethingWentWrongInTimeline={somethingWentWrongInTimeline}
        ></AddNote>
      </Box>

      {/* Send Sms  */}
      <Box>
        <SmsAndWhatsapp
          color="#DD34B8"
          name={"SMS"}
          handleClickOpenDialogs={handleClickOpenDialogsSmsForUser}
          handleCloseDialogs={handleCloseDialogsSmsForUser}
          openDialogs={openDialogsSmsForUser}
          setOpenDialogs={setOpenDialogsSmsForUser}
          smsType={smsType}
          smsSenderName={smsSenderName}
          selecteMobileNumber={userProfileHeader?.basic_info?.mobile}
          templateBody={templateBody}
          setTemplateBody={setTemplateBody}
          smsDltContentId={smsDltContentId}
          timelineTagInvalidate={true}
        ></SmsAndWhatsapp>
      </Box>
      <Box>
        <SmsAndWhatsapp
          templateId={templateId}
          color="#25D366"
          name={"WhatsApp"}
          handleClickOpenSelectTemplate={handleClickOpenSelectTemplateForUser}
          selecteMobileNumber={userProfileHeader?.basic_info?.mobile}
          templateBody={templateBody}
          setTemplateBody={setTemplateBody}
          handleClickOpenDialogs={handleClickOpenDialogsWhatsapp}
          handleCloseDialogs={handleCloseDialogsWhatsapp}
          openDialogs={openDialogsWhatsapp}
          setOpenDialogs={setOpenDialogsWhatsapp}
          timelineTagInvalidate={true}
        ></SmsAndWhatsapp>
      </Box>
      <Box>
        <Mail
          email={userProfileHeader?.basic_info?.email}
          open={isSingleComposeOpen}
          onClose={handleSingleComposerClose}
          timelineTagInvalidate={true}
        ></Mail>
      </Box>
      {openConfirmAPImessage && (
        <UserProfileAPICallDialog
          openConfirmAPImessage={openConfirmAPImessage}
          handleOpenConfirmAPImessageClose={handleOpenConfirmAPImessageClose}
          handleOpenConfirmAPImessageClick={handleOpenConfirmAPImessageClick}
          userProfileHeader={userProfileHeader}
          selectText={selectText}
          setSelectText={setSelectText}
        ></UserProfileAPICallDialog>
      )}
      <DeleteDialogue
        openDeleteModal={openDeleteDialog}
        handleDeleteSingleTemplate={() => handleDeleteTag()}
        handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
        loading={deleteLoading}
      />
      <OutboundCallDialog
        phoneNumber={userProfileHeader?.basic_info?.mobile}
        openDialog={openCallDialog}
        setOpenDialog={setOpenCallDialog}
        applicationId={userProfileHeader?.basic_info?.application_id}
      />
      <AddTagDialog
        openDialog={openAddTagDialog}
        setOpenDialog={setOpenAddTagDialog}
        studentId={[userDetailsStateData?.studentId]}
        setShouldCallLeadHeaderApiAgain={setShouldCallLeadHeaderApiAgain}
      />
    </>
  );
};

export default ApplicationHeader;
