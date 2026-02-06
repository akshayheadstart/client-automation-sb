/* eslint-disable react-hooks/exhaustive-deps */
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Grid, Typography } from "@mui/material";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useGetUserProfileLeadDetailsInfoQuery,
  useGetUserProfileLeadDocumentQuery,
  useGetUserProfileLeadStepInfoQuery,
  useGetUserProfileStudentCommunicationLogQuery,
  useGetUserProfileTimelineInfoQuery,
} from "../../Redux/Slices/applicationDataApiSlice";
import { removeCookies } from "../../Redux/Slices/authSlice";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import ApplicationHeader from "../../components/userProfile/ApplicationHeader";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import GetJsonDate, { GetFormatDate } from "../../hooks/GetJsonDate";
import useToasterHook from "../../hooks/useToasterHook";
import VerticalTabs from "../../layout/UserProfileTableLayout";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import "../../styles/userProfile.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import LeadStageSteps from "./LeadStageSteps";
import { customFetch } from "../StudentTotalQueries/helperFunction";
const UserProfile = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { optionalEncrypted } = useParams();
  const secretKey = `LfFENUfAAAAAH4Dh_lx49xi6IqCA1QytPCpkrT5`;
  const bytes = optionalEncrypted
    ? CryptoJS.AES.decrypt(optionalEncrypted, secretKey)
    : "";
  const [optionalEncryptedData, setOptionalEncryptedData] = useState([]);

  useEffect(() => {
    try {
      if (state) {
        setOptionalEncryptedData([]);
      } else if (bytes) {
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setOptionalEncryptedData(decryptedData);
      } else {
        setOptionalEncryptedData([]);
      }
    } catch (error) {
      navigate("/page401");
    }
  }, [optionalEncrypted]);
  const pushNotification = useToasterHook();
  //vertical tabs value state
  const [tabsValue, setTabsValue] = React.useState(state?.tabs ? 5 : 0);
  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  //user profile student timeline and call logs data state
  const [userProfileTimelineData, setUserProfileTimelineData] = useState([]);
  const [userProfileCalllogsData, setUserProfileCalllogsData] = useState([]);

  //user profile student uploaded documents states
  const [studentUploadedDocuments, setStudentUploadedDocuments] = useState({});

  const [followupAndNoteData, setFollowupAndNoteData] = useState({});
  //counsellor state
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  //localStorage filters
  const [localFilter, setLocalFilter] = useState({});
  //user profile steps data state
  const [userProfileStepsData, setUserProfileStepsData] = useState({});

  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const states = useSelector((state) => state.authentication.token);
  const dispatch = useDispatch();

  if (states.detail) {
    dispatch(removeCookies());
    navigate("/page401");
  }

  const [userProfileTagToggle, setUserProfileTagToggle] = useState(false);
  const [userProfileLeadsDetails, setUserProfileLeadsDetails] = useState({});
  const [communicationLogsData, setCommunicationsLogsData] = useState({});

  //internal server error and hide component states
  const [leadDetailsInternalServerError, setLeadDetailsInternalServerError] =
    useState(false);
  const [hideLeadDetails, setHideLeadDetails] = useState(false);
  const [timelineInternalServerError, setTimelineInternalServerError] =
    useState(false);
  const [hideTimeline, setHideTimeline] = useState(false);
  const [callLogsInternalServerError, setCallLogsInternalServerError] =
    useState(false);
  const [hideCallLogs, setHideCallLogs] = useState(false);
  const [
    followupAndNotesInternalServerError,
    setFollowupAndNotesInternalServerError,
  ] = useState(false);
  const [hideFollowupAndNotes, setHideFollowupAndNotes] = useState(false);
  const [
    userProfileStepsInternalServerError,
    setUserProfileStepsInternalServerError,
  ] = useState(false);
  const [hideUserProfileSteps, setHideUserProfileSteps] = useState(false);
  const [
    communicationsLogsInternalServerError,
    setCommunicationsLogsInternalServerError,
  ] = useState(false);
  const [hideCommunicationsLogs, setHideCommunicationsLogs] = useState(false);
  const [
    documentLockerInternalServerError,
    setDocumentLockerInternalServerError,
  ] = useState(false);
  const [hideDocumentLocker, setHideDocumentLocker] = useState(false);

  //something went wrong states
  const [
    somethingWentWrongInUserProfileSteps,
    setSomethingWentWrongInUserProfileSteps,
  ] = useState(false);
  const [somethingWentWrongInLeadDetails, setSomethingWentWrongInLeadDetails] =
    useState(false);
  const [somethingWentWrongInTimeline, setSomethingWentWrongInTimeline] =
    useState(false);
  const [
    somethingWentWrongInFollowupAndNotes,
    setSomethingWentWrongInFollowupAndNotes,
  ] = useState(false);
  const [
    somethingWentWrongInCommunicationLogs,
    setSomethingWentWrongInCommunicationLogs,
  ] = useState(false);
  const [
    somethingWentWrongInDocuentLocker,
    setSomethingWentWrongInDocuentLocker,
  ] = useState(false);
  const [somethingWentWrongInCallLogs, setSomethingWentWrongInCallLogs] =
    useState(false);
  const [applicationIdToggle, setApplicationIdToggle] = useState(false);
  const [singleApplication, setSingleApplication] = useState({});
  const [applicationsOfLocalStorage, setApplicationsOfLocalStorage] = useState(
    []
  );

  useEffect(() => {
    if (state?.eventType === "searched-lead") {
      setApplicationIdToggle(false);
    }
  }, [state?.eventType]);
  // const [collegeCounsellor, setCollegeCounsellor] = useState(false);
  const [allApplicationApiLoading, setAllApplicationApiLoading] =
    useState(false);

  const { application_id, student_id } = singleApplication || {};

  const totalApplicationsTotalCount = JSON.parse(
    localStorage.getItem(`${Cookies.get("userId")}applicationsTotalCount`)
  );
  // states for pagination
  const pageNumber = localStorage.getItem(
    state?.from === "paid-applications-table"
      ? `${Cookies.get("userId")}paidApplicationSavePageNo`
      : `${Cookies.get("userId")}adminApplicationSavePageNo`
  )
    ? parseInt(
        localStorage.getItem(
          state?.from === "paid-applications-table"
            ? `${Cookies.get("userId")}paidApplicationSavePageNo`
            : `${Cookies.get("userId")}adminApplicationSavePageNo`
        )
      )
    : 1;

  const rowsPerPage = localStorage.getItem(
    state?.from === "paid-applications-table"
      ? `${Cookies.get("userId")}paidApplicationTableRowPerPage`
      : `${Cookies.get("userId")}adminTableRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}adminTableRowPerPage`)
      )
    : 25;
  let applicationIndex = JSON.parse(
    localStorage.getItem(`${Cookies.get("userId")}applicationIndex`)
  );

  //setting the applications from localstorage in state
  useEffect(() => {
    const applicationsFromLocalStorage = JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}applications`)
    );

    setApplicationsOfLocalStorage(applicationsFromLocalStorage);
  }, []);

  //setting the application when call api for applications
  useEffect(() => {
    setSingleApplication(applicationsOfLocalStorage?.[applicationIndex]);

    if (applicationIndex === -1) {
      if (
        rowsPerPage === 25 ||
        followUpRowsPerPage === 25 ||
        pendingFollowUpRowsPerPage === 25
      ) {
        setSingleApplication(
          applicationsOfLocalStorage[(applicationIndex += 25)]
        );
      } else if (
        rowsPerPage === 50 ||
        followUpRowsPerPage === 50 ||
        pendingFollowUpRowsPerPage === 50
      ) {
        setSingleApplication(
          applicationsOfLocalStorage[(applicationIndex += 50)]
        );
      } else if (
        rowsPerPage === 100 ||
        followUpRowsPerPage === 100 ||
        pendingFollowUpRowsPerPage === 100
      ) {
        setSingleApplication(
          applicationsOfLocalStorage[(applicationIndex += 100)]
        );
      } else if (
        rowsPerPage === 200 ||
        followUpRowsPerPage === 200 ||
        pendingFollowUpRowsPerPage === 200
      ) {
        setSingleApplication(
          applicationsOfLocalStorage[(applicationIndex += 200)]
        );
      }
      localStorage.setItem(
        `${Cookies.get("userId")}applicationIndex`,
        JSON.stringify(applicationIndex)
      );
    }
  }, [applicationsOfLocalStorage]);

  useEffect(() => {
    if (!state?.eventType) {
      localStorage.setItem(
        state?.from === "paid-applications-table"
          ? `${Cookies.get("userId")}paidApplicationSavePageNo`
          : `${Cookies.get("userId")}adminApplicationSavePageNo`,
        JSON.stringify(singleApplication?.pageNo)
      );
    }
  }, [state?.eventType, singleApplication?.pageNo]);

  const applicationId = applicationIdToggle
    ? Array.isArray(application_id)
      ? application_id[0]
      : application_id
    : state?.eventType
    ? state?.applicationId
    : optionalEncryptedData
    ? optionalEncryptedData[1]
    : "";
  const studentId = applicationIdToggle
    ? student_id
    : state?.eventType
    ? state?.studentId
    : optionalEncryptedData
    ? optionalEncryptedData[0]
    : "";

  // get user profile steps info
  const {
    data: dataLeadSteps,
    isSuccess: isSuccessLeadSteps,
    error: errorLeadSteps,
    isError: isErrorLeadSteps,
  } = useGetUserProfileLeadStepInfoQuery(
    {
      collegeId: collegeId,
      applicationId: applicationId,
    },
    { skip: applicationId ? false : true }
  );

  useEffect(() => {
    try {
      if (isSuccessLeadSteps) {
        const expectedData = dataLeadSteps?.data[0];
        if (
          typeof expectedData === "object" &&
          expectedData !== null &&
          !Array.isArray(expectedData)
        ) {
          setUserProfileStepsData(dataLeadSteps?.data[0]);
        } else {
          throw new Error("get Lead Step API response has changed");
        }
      }
      if (isErrorLeadSteps) {
        setUserProfileStepsData({});
        if (errorLeadSteps?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (errorLeadSteps?.data?.detail) {
          pushNotification("error", errorLeadSteps?.data?.detail);
        }
        if (errorLeadSteps?.status === 500) {
          handleInternalServerError(
            setUserProfileStepsInternalServerError,
            setHideUserProfileSteps,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInUserProfileSteps,
        setHideUserProfileSteps,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataLeadSteps,
    dataLeadSteps?.data,
    errorLeadSteps,
    isErrorLeadSteps,
    errorLeadSteps?.data?.detail,
    isSuccessLeadSteps,
  ]);

  const [callApiAgainLeadDetails, setCallApiAgainLeadDetails] = useState(false);
  const [leadDetailsAPICall, setLeadDetailsAPICall] = useState(false);
  //fetch Lead details API
  const {
    data: dataLeadDetails,
    isSuccess: isSuccessLeadDetails,
    isFetching: isFetchingLeadDetails,
    error: errorLeadDetails,
    isError: isErrorLeadDetails,
  } = useGetUserProfileLeadDetailsInfoQuery(
    {
      collegeId: collegeId,
      applicationId: applicationId,
    },
    { skip: applicationId ? false : true }
  );

  useEffect(() => {
    try {
      if (isSuccessLeadDetails) {
        const expectedData = dataLeadDetails?.data[0];
        if (
          typeof expectedData === "object" &&
          expectedData !== null &&
          !Array.isArray(expectedData)
        ) {
          setUserProfileLeadsDetails(dataLeadDetails?.data[0]);
        } else {
          throw new Error("get Lead Step API response has changed");
        }
      }
      if (isErrorLeadDetails) {
        setUserProfileLeadsDetails({});
        if (
          errorLeadDetails?.data?.detail === "Could not validate credentials"
        ) {
          window.location.reload();
        } else if (errorLeadDetails?.data?.detail) {
          pushNotification("error", errorLeadDetails?.data?.detail);
        }
        if (errorLeadDetails?.status === 500) {
          handleInternalServerError(
            setLeadDetailsInternalServerError,
            setHideLeadDetails,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInLeadDetails,
        setHideLeadDetails,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataLeadDetails,
    dataLeadDetails?.data,
    errorLeadDetails,
    isErrorLeadDetails,
    errorLeadDetails?.data?.detail,
    errorLeadDetails?.status,
  ]);

  useEffect(() => {
    if (state?.localStorage) {
      let filters = {};

      if (
        localStorage.getItem(`${Cookies.get("userId")}${state?.localStorage}`)
      ) {
        filters = JSON.parse(
          localStorage.getItem(`${Cookies.get("userId")}${state?.localStorage}`)
        );
      }

      if (filters?.date_range?.start_date) {
        filters.season = {};
        filters.date_range = JSON.parse(GetJsonDate(filters?.date_range));
      } else {
        filters.season = Cookies.get("season")
          ? JSON.parse(Cookies.get("season"))
          : {};
      }
    }
  }, []);

  // states for pagination

  const followUpRowsPerPage = localStorage.getItem(
    `${Cookies.get("userId")}followupTaskRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}followupTaskRowPerPage`)
      )
    : 25;

  const pendingFollowUpRowsPerPage = localStorage.getItem(
    `${Cookies.get("userId")}pendingFollowupTaskRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}pendingFollowupTaskRowPerPage`
        )
      )
    : 25;

  const [filterAction, setFilterAction] = useState("");
  const [timelineDateRange, setTimelineDateRange] = useState([]);
  const timelinePayload = {
    action_user: filterAction ? [filterAction] : [],
    date_range:
      timelineDateRange?.length > 0 ? GetFormatDate(timelineDateRange) : {},
  };
  //user profile time line api url
  const {
    data: dataTimeLine,
    isSuccess: isSuccessTimeLine,
    isFetching: isFetchingTimeLine,
    error: errorTimeLine,
    isError: isErrorTimeLine,
  } = useGetUserProfileTimelineInfoQuery(
    {
      collegeId: collegeId,
      applicationId: applicationId,
      payload: timelinePayload,
    },
    { skip: applicationId && tabsValue == 2 ? false : true }
  );

  useEffect(() => {
    try {
      if (isSuccessTimeLine) {
        if (dataTimeLine?.code === 200) {
          if (Array.isArray(dataTimeLine?.data[0]?.student_timeline)) {
            setUserProfileTimelineData(dataTimeLine?.data[0]?.student_timeline);
          } else {
            throw new Error("student_timeline API response has changed");
          }
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
    timelineDateRange,
    filterAction,
  ]);
  //now we are not use this code if we needed in future we use it
  //user profile call logs api url
  // const userProfileCalllogsApiUrl = `${
  //   import.meta.env.VITE_API_BASE_URL
  // }/student_call_log/${
  //   applicationIdToggle
  //     ? Array.isArray(application_id)
  //       ? application_id[0]
  //       : application_id
  //     : state?.eventType
  //     ? state?.applicationId
  //     : optionalEncryptedData
  //     ? optionalEncryptedData[1]
  //     : ""
  // }${collegeId ? "/?college_id=" + collegeId : ""}`;

  //user profile call logs api call
  //now we are not use this code if we needed in future we use it
  // useEffect(() => {
  //   if (
  //     applicationIdToggle
  //       ? Array.isArray(application_id)
  //         ? application_id[0]
  //         : application_id
  //       : state?.eventType
  //       ? state?.applicationId
  //       : optionalEncryptedData
  //       ? optionalEncryptedData[1]
  //       : ""
  //   ) {
  //     fetch(userProfileCalllogsApiUrl, ApiCallHeaderAndBody(token, "GET"))
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data?.code === 200) {
  //           const expectedData = data?.data[0];
  //           try {
  //             if (
  //               typeof expectedData === "object" &&
  //               expectedData !== null &&
  //               !Array.isArray(expectedData)
  //             ) {
  //               setUserProfileCalllogsData(data?.data[0]);
  //             } else {
  //               throw new Error("student_call_log API response has changed");
  //             }
  //           } catch (error) {
  //             setApiResponseChangeMessage(error);
  //             handleSomethingWentWrong(
  //               setSomethingWentWrongInCallLogs,
  //               setHideCallLogs,
  //               10000
  //             );
  //           }
  //         } else if (data?.detail === "Could not validate credentials") {
  //           window.location.reload();
  //         } else if (data?.detail) {
  //           pushNotification("error", data?.detail);
  //           setUserProfileCalllogsData({});
  //         }
  //       })
  //       .catch((error) => {
  //         handleInternalServerError(
  //           setCallLogsInternalServerError,
  //           setHideCallLogs,
  //           10000
  //         );
  //       })
  //       .finally(() => {});
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   application_id,
  //   state?.applicationId,
  //   state?.eventType,
  //   optionalEncryptedData,
  //   applicationIdToggle,
  // ]);

  const [communicationTabValue, setCommunicationTabValue] = useState(0);
  const [communicationLogsDate, setCommunicationLogsDate] = useState([]);

  //fetch communication log data
  const {
    data: dataCommunicationLog,
    isSuccess: isSuccessCommunicationLog,
    isFetching: isFetchingCommunicationLog,
    error: errorCommunicationLog,
    isError: isErrorCommunicationLog,
  } = useGetUserProfileStudentCommunicationLogQuery(
    {
      collegeId: collegeId,
      applicationId: applicationId,
      communicationTabValue: communicationTabValue,
      payload:
        communicationLogsDate?.length >= 1
          ? JSON.stringify(JSON.parse(GetJsonDate(communicationLogsDate)))
          : null,
    },
    { skip: applicationId && tabsValue == 3 ? false : true }
  );

  useEffect(() => {
    try {
      if (isSuccessCommunicationLog) {
        const expectedData = dataCommunicationLog?.data;
        if (
          typeof expectedData === "object" &&
          expectedData !== null &&
          !Array.isArray(expectedData)
        ) {
          setCommunicationsLogsData(dataCommunicationLog?.data);
        } else {
          throw new Error("student communication log API response has changed");
        }
      }
      if (isErrorCommunicationLog) {
        setCommunicationsLogsData({});
        if (
          errorCommunicationLog?.data?.detail ===
          "Could not validate credentials"
        ) {
          window.location.reload();
        } else if (errorCommunicationLog?.data?.detail) {
          pushNotification("error", errorCommunicationLog?.data?.detail);
        }
        if (errorCommunicationLog?.status === 500) {
          handleInternalServerError(
            setCommunicationsLogsInternalServerError,
            setHideCommunicationsLogs,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInCommunicationLogs,
        setHideCommunicationsLogs,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataCommunicationLog,
    dataCommunicationLog?.data,
    errorCommunicationLog,
    isErrorCommunicationLog,
    errorCommunicationLog?.status,
    communicationLogsDate,
  ]);

  const [shouldCallStudentDocumentAPI, setShouldCallStudentDocumentAPI] =
    useState(false);
  //student uploaded document api call
  const {
    data: dataLeadDocument,
    isSuccess: isSuccessLeadDocument,
    isFetching: isFetchingLeadDocument,
    error: errorLeadDocument,
    isError: isErrorLeadDocument,
  } = useGetUserProfileLeadDocumentQuery(
    {
      collegeId: collegeId,
      studentId: studentId,
    },
    { skip: studentId && tabsValue == 4 ? false : true }
  );

  useEffect(() => {
    try {
      if (isSuccessLeadDocument) {
        if (dataLeadDocument?.code === 200) {
          const expectedData = dataLeadDocument?.data[0];
          if (
            typeof expectedData === "object" &&
            expectedData !== null &&
            !Array.isArray(expectedData)
          ) {
            setStudentUploadedDocuments(dataLeadDocument?.data[0]);
          } else {
            throw new Error("student_timeline API response has changed");
          }
        }
      }
      if (isErrorLeadDocument) {
        setStudentUploadedDocuments({});
        if (
          errorLeadDocument?.data?.detail === "Could not validate credentials"
        ) {
          window.location.reload();
        } else if (errorLeadDocument?.data?.detail !== "Document not found.") {
          pushNotification("error", errorLeadDocument?.data?.detail);
        }
        if (errorLeadDocument?.status === 500) {
          handleInternalServerError(
            setDocumentLockerInternalServerError,
            setHideDocumentLocker,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInDocuentLocker,
        setHideDocumentLocker,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataLeadDocument,
    dataLeadDocument?.data,
    errorLeadDocument,
    isErrorLeadDocument,
    errorLeadDocument?.data?.detail,
    errorLeadDocument?.status,
  ]);
  //student uploaded document data
  const studentUploadedDocumentData = {
    studentUploadedDocuments,
    courseName: userProfileLeadsDetails?.lead_details?.course_name,
  };

  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Lead Manager Head Title add
  useEffect(() => {
    setHeadTitle("Lead Manager");
    document.title = "Lead Manager";
  }, [headTitle]);
  useEffect(() => {
    if (state?.localStorage) {
      let filters = {};

      if (
        localStorage.getItem(`${Cookies.get("userId")}${state?.localStorage}`)
      ) {
        filters = JSON.parse(
          localStorage.getItem(`${Cookies.get("userId")}${state?.localStorage}`)
        );
      }

      if (filters?.date_range?.start_date) {
        filters.season = {};
        filters.date_range = JSON.parse(GetJsonDate(filters?.date_range));
      } else {
        filters.season = Cookies.get("season")
          ? JSON.parse(Cookies.get("season"))
          : {};
      }
      setLocalFilter({ state: filters });
    }
  }, []);

  const selectedSeason = useSelector(
    (state) => state.authentication.selectedSeason
  );
  const seasonId = selectedSeason?.length
    ? JSON.parse(selectedSeason)?.season_id
    : "";

  const callAllApplicationAPi = (pageNo, buttonName) => {
    const allApplicationsUrl = `${
      import.meta.env.VITE_API_BASE_URL
    }/admin/all_applications/?page_num=${pageNo}&page_size=${rowsPerPage}${
      collegeId ? "&college_id=" + collegeId : ""
    }`;

    const paidApplicationsUrl = `${
      import.meta.env.VITE_API_BASE_URL
    }/admin/all_paid_applications/?page_num=${pageNo}&page_size=${rowsPerPage}${
      collegeId ? "&college_id=" + collegeId : ""
    }`;
    const leadApplicationsUrl = `${
      import.meta.env.VITE_API_BASE_URL
    }/admin/all_leads/?page_num=${pageNo}&page_size=${rowsPerPage}${
      collegeId ? "&college_id=" + collegeId : ""
    }`;
    const leadExtendDataUrl = `${
      import.meta.env.VITE_API_BASE_URL
    }/lead/lead_data_count?data_type=${
      state?.title
    }&page_num=${pageNo}&page_size=${rowsPerPage}&season=${seasonId}${
      collegeId ? "&college_id=" + collegeId : ""
    }`;
    const totalStudentQueriesUrl = `${
      import.meta.env.VITE_API_BASE_URL
    }/query/list/?page_num=${pageNo}&page_size=${rowsPerPage}&college_id=${collegeId}`;

    const APPLICATION_STAGE_DETAILS_URL = `${
      import.meta.env.VITE_API_BASE_URL
    }/application_wrapper/application_data_count?data_type=${
      state?.title
    }&page_num=${pageNo}&page_size=${rowsPerPage}&college_id=${collegeId}`;
    setAllApplicationApiLoading(true);
    customFetch(
      state?.eventType === "total-queries"
        ? totalStudentQueriesUrl
        : state?.eventType === "from_initiated" ||
          state?.eventType === "interview_done" ||
          state?.eventType === "offer_letter" ||
          state?.eventType === "gd_done" ||
          state?.eventType === "upcoming_interview" ||
          state?.eventType === "upcoming_gd" ||
          state?.eventType === "untouched_lead"
        ? APPLICATION_STAGE_DETAILS_URL
        : state?.eventType === "fresh_lead" ||
          state?.eventType === "follow_up" ||
          state?.eventType === "interested" ||
          state?.eventType === "admission_confirm" ||
          state?.eventType === "today_assigned"
        ? leadExtendDataUrl
        : state?.eventType === "lead-manager"
        ? leadApplicationsUrl
        : state?.from === "paid-applications-table"
        ? paidApplicationsUrl
        : allApplicationsUrl,
      ApiCallHeaderAndBody(token, "POST", JSON.stringify(localFilter))
    )
      .then((res1) => res1.json())
      .then((res) => {
        if (res.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.data) {
          try {
            if (Array.isArray(res?.data)) {
              const applications = res?.data;
              applications.forEach((application) => {
                application.pageNo = pageNo;
              });
              if (buttonName === "previousButton") {
                localStorage.setItem(
                  `${Cookies.get("userId")}applications`,
                  JSON.stringify([
                    ...applications,
                    ...applicationsOfLocalStorage,
                  ])
                );
                setApplicationsOfLocalStorage([
                  ...applications,
                  ...applicationsOfLocalStorage,
                ]);
              } else {
                localStorage.setItem(
                  `${Cookies.get("userId")}applications`,
                  JSON.stringify([
                    ...applicationsOfLocalStorage,
                    ...applications,
                  ])
                );
                setApplicationsOfLocalStorage([
                  ...applicationsOfLocalStorage,
                  ...applications,
                ]);
              }
              localStorage.setItem(
                state?.from === "paid-applications-table"
                  ? `${Cookies.get("userId")}paidApplicationSavePageNo`
                  : `${Cookies.get("userId")}adminApplicationSavePageNo`,
                JSON.stringify(pageNo)
              );
            } else {
              throw new Error("All Applications API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInLeadDetails,
              setHideLeadDetails,
              10000
            );
            handleSomethingWentWrong(
              setSomethingWentWrongInUserProfileSteps,
              setHideUserProfileSteps,
              10000
            );
          }
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        }
      })
      .catch((err) => {
        navigate("/page500");
      })
      .finally(() => {
        setAllApplicationApiLoading(false);
      });
  };
  //function for next lead button
  const handleNextLeadButton = () => {
    setSingleApplication(applicationsOfLocalStorage[(applicationIndex += 1)]);
    localStorage.setItem(
      `${Cookies.get("userId")}applicationIndex`,
      JSON.stringify(applicationIndex)
    );
    setApplicationIdToggle(true);

    if (applicationsOfLocalStorage?.length === applicationIndex) {
      const pageNo = pageNumber + 1;
      callAllApplicationAPi(pageNo, "nextButton");
    }
  };

  //function for previous lead button
  const handlePreviousLeadButton = () => {
    setApplicationIdToggle(true);
    if (pageNumber > 1 && applicationIndex === 0) {
      const pageNo = pageNumber - 1;
      callAllApplicationAPi(pageNo, "previousButton");
    }

    setSingleApplication(applicationsOfLocalStorage[(applicationIndex -= 1)]);
    localStorage.setItem(
      `${Cookies.get("userId")}applicationIndex`,
      JSON.stringify(applicationIndex)
    );
  };
  const [faqMiniDialog, setFaqMiniDialog] = useState(false);
  const handleFaqMiniDialog = () => {
    setFaqMiniDialog(true);
  };
  const handleFaqMiniDialogClose = () => {
    setFaqMiniDialog(false);
  };
  const [faqSelectedCourseName, setFaqSelectedCourseName] = useState("");
  const { setFaqDialogOpen } = useContext(DashboradDataContext);
  useEffect(() => {
    if (optionalEncryptedData || state?.eventType === "searched-lead") {
      setFaqMiniDialog(false);
    }
  }, [state?.eventType]);
  return (
    <>
      {faqMiniDialog && (
        <Box className="faq-mini-dialog-box">
          <Box
            sx={{
              display: "flex",
              minWidth: "350px",
              alignItems: "flex-start",
              justifyContent: "space-between",
              pr: "10px",
            }}
          >
            <Box>
              <Typography
                onClick={() => {
                  setFaqDialogOpen(true);
                  handleFaqMiniDialogClose();
                }}
                sx={{
                  maxWidth: "300px",
                  overflowWrap: "break-word",
                  cursor: "pointer",
                }}
                className="faq-mini-text-headline"
              >
                FAQ for {faqSelectedCourseName}
              </Typography>
            </Box>
            <CloseIcon
              onClick={() => handleFaqMiniDialogClose()}
              sx={{ cursor: "pointer" }}
            />
          </Box>
        </Box>
      )}
      {allApplicationApiLoading ? (
        <Box
          sx={{
            width: "100%",
            minHeight: "85vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          data-testid="loading-animation-container"
        >
          {" "}
          <LeefLottieAnimationLoader
            height={200}
            width={250}
          ></LeefLottieAnimationLoader>{" "}
        </Box>
      ) : (
        <>
          <Box
            className="lead-manager-box-container-margin user-Profile-box-container"
            sx={{ px: 2, pb: 2 }}
          >
            <Box className="user-profile-back-next-button-box">
              {state?.showArrowIcon && (
                <Box sx={{ display: "flex", gap: "10px", mt: "15px" }}>
                  <Button
                    data-testid="button-back-items"
                    sx={{ minWidth: "38px" }}
                    className="user-profile-back-button"
                    onClick={() => {
                      handlePreviousLeadButton();
                      handleFaqMiniDialogClose();
                    }}
                    size="small"
                    color="info"
                    variant="outlined"
                    disabled={applicationIndex === 0 && pageNumber === 1}
                  >
                    <ArrowBackIosNewOutlinedIcon
                      sx={{ height: 15, mb: "1px", fontSize: "11px" }}
                    />
                  </Button>
                  <Button
                    sx={{ minWidth: "38px" }}
                    className="user-profile-back-button"
                    onClick={() => {
                      handleNextLeadButton();
                      handleFaqMiniDialogClose();
                    }}
                    size="small"
                    color="info"
                    variant="outlined"
                    disabled={
                      totalApplicationsTotalCount === applicationIndex - 1
                    }
                  >
                    <ArrowForwardIosOutlinedIcon
                      sx={{ height: 15, mb: "1px", fontSize: "11px" }}
                    />
                  </Button>
                </Box>
              )}
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={4}>
                <ApplicationHeader
                  userDetailsStateData={{
                    applicationId: applicationId,
                    studentId: studentId,
                  }}
                  faqMiniToggle={true}
                  handleFaqMiniDialog={handleFaqMiniDialog}
                  setFaqSelectedCourseName={setFaqSelectedCourseName}
                  leadProfileAction={state?.leadProfileAction ? true : false}
                  setUserProfileTagToggle={setUserProfileTagToggle}
                  leadStepControl={true}
                  setLeadDetailsAPICall={setLeadDetailsAPICall}
                ></ApplicationHeader>
              </Grid>
              <Grid item xs={12} sm={12} md={8}>
                <>
                  {isFetchingLeadDetails ? (
                    <Box
                      sx={{
                        width: "100%",
                        minHeight: "85vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      data-testid="loading-animation-container"
                    >
                      {" "}
                      <LeefLottieAnimationLoader
                        height={200}
                        width={250}
                      ></LeefLottieAnimationLoader>{" "}
                    </Box>
                  ) : (
                    <Box sx={{ mt: userProfileTagToggle ? "30px" : "8px" }}>
                      <LeadStageSteps
                        userProfileStepsInternalServerError={
                          userProfileStepsInternalServerError
                        }
                        somethingWentWrongInUserProfileSteps={
                          somethingWentWrongInUserProfileSteps
                        }
                        hideUserProfileSteps={hideUserProfileSteps}
                        apiResponseChangeMessage={apiResponseChangeMessage}
                        userProfileStepsData={userProfileStepsData}
                      />
                      <VerticalTabs
                        eventType={state?.eventType}
                        applicationId={applicationId}
                        userProfileLeadsDetails={userProfileLeadsDetails}
                        callLogs={userProfileCalllogsData}
                        timeLineData={userProfileTimelineData}
                        followUpData={followupAndNoteData}
                        communicationData={communicationLogsData}
                        communicationTabValue={communicationTabValue}
                        setCommunicationTabValue={setCommunicationTabValue}
                        loadingCommunicationsLogs={isFetchingCommunicationLog}
                        communicationLogsDate={communicationLogsDate}
                        setCommunicationLogsDate={setCommunicationLogsDate}
                        studentUploadedDocumentData={
                          studentUploadedDocumentData
                        }
                        leadDetailsInternalServerError={
                          leadDetailsInternalServerError
                        }
                        hideLeadDetails={hideLeadDetails}
                        timelineInternalServerError={
                          timelineInternalServerError
                        }
                        hideTimeline={hideTimeline}
                        callLogsInternalServerError={
                          callLogsInternalServerError
                        }
                        hideCallLogs={hideCallLogs}
                        followupAndNotesInternalServerError={
                          followupAndNotesInternalServerError
                        }
                        hideFollowupAndNotes={hideFollowupAndNotes}
                        communicationsLogsInternalServerError={
                          communicationsLogsInternalServerError
                        }
                        hideCommunicationsLogs={hideCommunicationsLogs}
                        documentLockerInternalServerError={
                          documentLockerInternalServerError
                        }
                        hideDocumentLocker={hideDocumentLocker}
                        somethingWentWrongInLeadDetails={
                          somethingWentWrongInLeadDetails
                        }
                        somethingWentWrongInTimeline={
                          somethingWentWrongInTimeline
                        }
                        somethingWentWrongInFollowupAndNotes={
                          somethingWentWrongInFollowupAndNotes
                        }
                        somethingWentWrongInCommunicationLogs={
                          somethingWentWrongInCommunicationLogs
                        }
                        somethingWentWrongInDocuentLocker={
                          somethingWentWrongInDocuentLocker
                        }
                        somethingWentWrongInCallLogs={
                          somethingWentWrongInCallLogs
                        }
                        studentId={studentId}
                        filterAction={filterAction}
                        setFilterAction={setFilterAction}
                        timelineDateRange={timelineDateRange}
                        setTimelineDateRange={setTimelineDateRange}
                        setShouldCallStudentDocumentAPI={
                          setShouldCallStudentDocumentAPI
                        }
                        setUserProfileTimelineData={setUserProfileTimelineData}
                        setCallApiAgainLeadDetails={setCallApiAgainLeadDetails}
                        state={state}
                        leadProfileAction={
                          state?.leadProfileAction ? true : false
                        }
                        value={tabsValue}
                        setValue={setTabsValue}
                        isFetchingTimeLine={isFetchingTimeLine}
                        isFetchingLeadDocument={isFetchingLeadDocument}
                      ></VerticalTabs>
                    </Box>
                  )}
                </>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </>
  );
};

export default UserProfile;
