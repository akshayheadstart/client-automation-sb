/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Card, Container, Grid, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetCounselorListQuery,
  useGetCounselorPerformanceReportDataQuery,
  useGetStudentQueryDataMutation,
} from "../../Redux/Slices/applicationDataApiSlice";
import {
  useGetAllCourseListQuery,
  useGetAllSourceListQuery,
  useGetListOfSchoolsQuery,
} from "../../Redux/Slices/filterDataSlice";
import BackDrop from "../../components/shared/Backdrop/Backdrop";
import DateRangeShowcase from "../../components/shared/CalendarTimeData/DateRangeShowcase";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import MultipleTabs from "../../components/shared/tab-panel/MultipleTabs";
import {
  AdminHeader,
  ApplicationFunnel,
  FormWiseApplications,
  LeadsApplications,
  ScoreBoard,
  TopPerformingChannels,
} from "../../components/ui/admin-dashboard";
import ApplicationSteps from "../../components/ui/admin-dashboard/ApplicationSteps";
import CounsellorPerformanceReport from "../../components/ui/admin-dashboard/CounsellorPerformanceReport";
import KeyIndicator from "../../components/ui/admin-dashboard/KeyIndicator";
import SourceWiseLeadDetail from "../../components/ui/admin-dashboard/SourceWiseLeadDetail";
import paidVsLeadFormat from "../../constants/PaidVsLeadApplicationDataFormat";
import {
  organizeCounselorFilterOption,
  organizeCourseFilterOption,
  organizeSourceFilterOption,
} from "../../helperFunctions/filterHelperFunction";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import GetJsonDate, { GetFormatDate } from "../../hooks/GetJsonDate";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import { getDateMonthYear } from "../../hooks/getDayMonthYear";
import useDebounce from "../../hooks/useDebounce";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import "../../styles/AdminDashboard.css";
import { adminDashboardApiPayload } from "../../utils/AdminDashboardApiPayload";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import HeadCounselorPendingFollowup from "./HeadCounselorPendingFollowup";
import StudentQueryReport from "./StudentQueryReport";
import StateWisePerformance from "../../components/ui/admin-dashboard/StateWisePerformance";
import leadVsApplicationPayload from "../../constants/LeadVsApplicationPayload";
import PreferenceWiseApplication from "../../components/ui/admin-dashboard/PreferenceWiseApplication";
import { customFetch } from "../StudentTotalQueries/helperFunction";

function AdminDashboard() {
  const systemPreference = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.system_preference
  );
  const [
    payloadOfLeadApplicationFilterData,
    setPayloadOfLeadApplicationFilterData,
  ] = useState({});
  // common api call functions
  const { handleFilterListApiCall } = useCommonApiCalls();

  const [callPerformanceAPI, setCallPerformanceAPI] = useState(false);
  const [selectedCounselorPerformanceID, setSelectedCounselorPerformanceID] =
    useState([]);

  const pushNotification = useToasterHook();
  const [studentQueryDate, setStudentQueryDate] = useState({});
  const [leadApplicationGraphData, setLeadApplicationGraphData] = useState({});
  const [chartsState, setChartState] = useState(paidVsLeadFormat);

  const [counsellorPerformanceIndicator, setCounsellorPerformanceIndicator] =
    useState(null);

  const [leadApplicationGraphDateRange, setLeadApplicationGraphDateRange] =
    useState([]);

  const [
    counsellorPeroformanceReportDateRange,
    setCounsellorPeroformanceReportDateRange,
  ] = useState([]);
  const [headCounselorDateRange, setHeadCounselorDateRange] = useState([]);

  // check if the data is loading or not

  const [isLeadVsApplicationDataLoading, setIsLeadVsApplicationDataLoading] =
    useState(false);

  const [isSourceWiseLeadDetailLoading, setIsSourceWiseLeadDetailLoading] =
    useState(false);

  // state for checking if user scrolled to the element or not
  const [isScrolledToApplicationFunnel, setIsScrolledToApplicationFunnel] =
    useState(false);
  const [isScrolledToApplicationSteps, setIsScrolledToApplicationSteps] =
    useState(false);
  const [isScrolledToKeyIndicator, setIsScrolledToKeyIndicator] =
    useState(false);
  const [isScrolledToScoreBoard, setIsScrolledToScoreBoard] = useState(false);
  const [isScrolledTopPerformingChannel, setIsScrolledTopPerformingChannel] =
    useState(false);
  const [isScrolledToMapData, setIsScrolledToMapData] = useState(false);
  const [isScrolledLeadVsApplication, setIsScrolledLeadVsApplication] =
    useState(false);

  const [isScrolledFormWiseApplication, setIsScrolledFormWiseApplication] =
    useState(false);
  const [
    isScrolledPreferenceWiseApplication,
    setIsScrolledPreferenceWiseApplication,
  ] = useState(false);

  const [isScrolledSourceWiseLeadDetail, setIsScrolledSourceWiseLeadDetail] =
    useState(false);

  const [
    isScrolledCounsellorPerformanceReport,
    setIsScrolledCounsellorPerformanceReport,
  ] = useState(false);
  const [
    isScrolledToPendingFollowupDetails,
    setIsScrolledToPendingFollowupDetails,
  ] = useState(false);

  //counsellor performance report data state
  const [counsellorPerformanceData, setCounsellorPerformanceData] = useState(
    {}
  );

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [counsellorList, setCounsellorList] = useState([]);
  const [skipCounselorApiCall, setSkipCounselorApiCall] = useState(true);
  const [skipSourceApiCall, setSkipSourceApiCall] = useState(true);
  const [leadVsApplicationCounselorId, setLeadVsApplicationCounselorId] =
    useState("");
  // reference of the elements

  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const navigate = useNavigate();

  //getting data form context
  const {
    apiResponseChangeMessage,
    setApiResponseChangeMessage,
    setScoreBoardInternalServerError,
    setSomethingWentWrongInScoreBoard,
    setTopPerformingInternalServerError,
    setSomethingWentWrongInTopPerformingChannel,
    setApplicationFunnelInternalServerError,
    setSomethingWentWrongInApplicationFunnel,
    setSomethingWentWrongInFormWiseApplication,
    setFormWiseApplicationsInternalServerError,
    setSomethingWentWrongInSourceWiseLeadDetail,
    setSourceWiseLeadDetailInternalServerError,
  } = useContext(DashboradDataContext);
  // API call
  const [leadsVsApplicationApiCall, setLeadsVsApplicationApiCall] =
    useState(false);
  const {
    showScoreBoard,
    showMap,
    showApplicationSteps,
    showApplicationFunnel,
    showKeyIndicatorIndicator,
    showPerformingFunnel,
    showLeadVsApplications,
    showFormWiseApplication,
    showSourceWiseLeadDetail,
    showCounsellorPerformanceReport,
    showHeadCounselorList,
    selectedCollegeId,
    setSelectedCollegeId,
    setHeadTitle,
    headTitle,
    showPreferenceWiseApplication,
  } = useContext(LayoutSettingContext);

  const selectedSeason = useSelector(
    (state) => state.authentication.selectedSeason
  );

  //Admin dashboard Head Title add
  useEffect(() => {
    setHeadTitle("Admin Dashboard");
    document.title = "Admin Dashboard";
  }, [headTitle]);

  const [performanceQueriesTabsValue, setPerformanceQueriesTabValue] =
    useState(0);

  const [
    leadVsApplicationIternalServerError,
    setLeadVsApplicationInternalServerError,
  ] = useState(false);
  const [hideLeadVsApplication, setHideLeadVsApplication] = useState(false);

  const [
    counsellorPerformanceReportInternalServerError,
    setCounsellorPerformanceReportInternalServerError,
  ] = useState(false);
  const [hideCounsellorPerformanceReport, setHideCounsellorPerformanceReport] =
    useState(false);
  const [hideCounsellorList, setHideCounsellorList] = useState(false);

  //component wise something went wrong state

  const [
    somethingWentWrongInLeadVsApplication,
    setSomethingWentWrongInLeadVsApplication,
  ] = useState(false);

  const [
    somethingWentWrongInCounsellorPerformanceReport,
    setSomethingWentWrongInCounsellorPerformanceReport,
  ] = useState(false);
  const [somethingWentWrongInColleges, setSomethingWentWrongInColleges] =
    useState(false);

  // elements observer
  const [applicationFunnelRef, { entry: applicationFunnelEntry }] =
    useIntersectionObserver();
  const [applicationStepsRef, { entry: applicationStepsEntry }] =
    useIntersectionObserver();
  const [keyIndicatorRef, { entry: keyIndicatorEntry }] =
    useIntersectionObserver();
  const [scoreBoardRef, { entry: scoreBoardEntry }] = useIntersectionObserver();
  const [topPerformingChannelRef, { entry: topPerformingEntry }] =
    useIntersectionObserver();
  const [mapDataRef, { entry: mapDataEntry }] = useIntersectionObserver();
  const [leadVsApplicationRef, { entry: leadVsApplicationEntry }] =
    useIntersectionObserver();

  const [formWiseApplicationRef, { entry: formWiseApplicationEntry }] =
    useIntersectionObserver();
  //preference wise performance
  const [
    preferenceWiseApplicationRef,
    { entry: preferenceWiseApplicationEntry },
  ] = useIntersectionObserver();
  const [hidePreferenceWise, setHidePreferenceWise] = useState(false);
  const [sourceWiseLeadDetailRef, { entry: sourceWiseLeadDetailEntry }] =
    useIntersectionObserver();

  const [
    counsellorPerformanceReportRef,
    { entry: counsellorPerformanceReportEntry },
  ] = useIntersectionObserver();
  const [headCounselorListRef, { entry: headCounselorListEntry }] =
    useIntersectionObserver();

  // checking if user reached to the element or not
  const isApplicationFunnelVisible =
    applicationFunnelEntry && applicationFunnelEntry?.isIntersecting;
  const isApplicationStepsVisible =
    applicationStepsEntry && applicationStepsEntry?.isIntersecting;
  const isKeyIndicatorVisible =
    keyIndicatorEntry && keyIndicatorEntry?.isIntersecting;
  const isScoreBoardVisible =
    scoreBoardEntry && scoreBoardEntry?.isIntersecting;
  const isTopPerformingVisible =
    topPerformingEntry && topPerformingEntry?.isIntersecting;
  const ismapDataVisible = mapDataEntry && mapDataEntry?.isIntersecting;
  const isLeadVsApplicationVisible =
    leadVsApplicationEntry && leadVsApplicationEntry?.isIntersecting;

  const isFormWiseApplicationVisible =
    formWiseApplicationEntry && formWiseApplicationEntry?.isIntersecting;

  const isPreferenceWiseApplicationVisible =
    preferenceWiseApplicationEntry &&
    preferenceWiseApplicationEntry?.isIntersecting;

  const isSourceWiseLeadDetailVisible =
    sourceWiseLeadDetailEntry && sourceWiseLeadDetailEntry?.isIntersecting;

  const isCounsellorPerformanceReportVisible =
    counsellorPerformanceReportEntry &&
    counsellorPerformanceReportEntry?.isIntersecting;

  const isHeadCounselorListVisible =
    headCounselorListEntry && headCounselorListEntry.isIntersecting;

  const apiCallingConditions =
    selectedCollegeId?.length > 0 && selectedSeason?.length > 0;

  // setting true if application funnel is visible
  useEffect(() => {
    if (isApplicationFunnelVisible) {
      if (!isScrolledToApplicationFunnel) {
        setIsScrolledToApplicationFunnel(true);
      }
    }
  }, [isApplicationFunnelVisible]);
  useEffect(() => {
    if (isApplicationStepsVisible) {
      if (!isScrolledToApplicationSteps) {
        setIsScrolledToApplicationSteps(true);
      }
    }
  }, [isApplicationStepsVisible]);
  // setting true if Key Indicator is visible
  useEffect(() => {
    if (isKeyIndicatorVisible) {
      if (!isScrolledToKeyIndicator) {
        setIsScrolledToKeyIndicator(true);
      }
    }
  }, [isKeyIndicatorVisible]);

  // setting true if top scoreboard is visible
  useEffect(() => {
    if (isScoreBoardVisible) {
      if (!isScrolledToScoreBoard) {
        setIsScrolledToScoreBoard(true);
      }
    }
  }, [isScoreBoardVisible]);

  // setting true if top performing channel is visible
  useEffect(() => {
    if (isTopPerformingVisible) {
      if (!isScrolledTopPerformingChannel) {
        setIsScrolledTopPerformingChannel(true);
      }
    }
  }, [isTopPerformingVisible]);

  // setting true if Map is visible
  useEffect(() => {
    if (ismapDataVisible) {
      if (!isScrolledToMapData) {
        setIsScrolledToMapData(true);
      }
    }
  }, [ismapDataVisible]);

  // setting true if top lead vs application is visible
  useEffect(() => {
    if (isLeadVsApplicationVisible) {
      if (!isScrolledLeadVsApplication) {
        setIsScrolledLeadVsApplication(true);
      }
    }
  }, [isLeadVsApplicationVisible]);

  // setting true if form wise application is visible
  useEffect(() => {
    if (isFormWiseApplicationVisible) {
      if (!isScrolledFormWiseApplication) {
        setIsScrolledFormWiseApplication(true);
      }
    }
  }, [isFormWiseApplicationVisible]);
  // setting true if preference wise application is visible
  useEffect(() => {
    if (isPreferenceWiseApplicationVisible) {
      if (!isScrolledPreferenceWiseApplication) {
        setIsScrolledPreferenceWiseApplication(true);
      }
    }
  }, [isPreferenceWiseApplicationVisible]);

  // setting true if source wise lead detail is visible
  useEffect(() => {
    if (isSourceWiseLeadDetailVisible) {
      if (!isScrolledSourceWiseLeadDetail) {
        setIsScrolledSourceWiseLeadDetail(true);
      }
    }
  }, [isSourceWiseLeadDetailVisible]);

  // setting true if counsellor performance report graph is visible
  useEffect(() => {
    if (isCounsellorPerformanceReportVisible) {
      if (!isScrolledCounsellorPerformanceReport) {
        setIsScrolledCounsellorPerformanceReport(true);
      }
    }
  }, [isCounsellorPerformanceReportVisible]);

  useEffect(() => {
    if (isHeadCounselorListVisible) {
      if (!isScrolledToPendingFollowupDetails) {
        setIsScrolledToPendingFollowupDetails(true);
      }
    }
  }, [isHeadCounselorListVisible]);

  const sourceListInfo = useGetAllSourceListQuery(
    { collegeId: selectedCollegeId },
    { skip: skipSourceApiCall }
  );

  const [sourceList, setSourceList] = useState([]);
  const [hideSourceList, setHideSourceList] = useState(false);
  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId: selectedCollegeId },
    {
      skip: skipCounselorApiCall,
    }
  );

  //get source list
  useEffect(() => {
    if (!skipSourceApiCall) {
      const sourceList = sourceListInfo?.data?.data[0];

      handleFilterListApiCall(
        sourceList,
        sourceListInfo,
        setSourceList,
        setHideSourceList,
        organizeSourceFilterOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceListInfo, skipSourceApiCall]);

  //get counsellor list
  useEffect(() => {
    if (!skipCounselorApiCall) {
      const counselorList = counselorListApiCallInfo.data?.data[0];
      handleFilterListApiCall(
        counselorList,
        counselorListApiCallInfo,
        setCounsellorList,
        setHideCounsellorList,
        organizeCounselorFilterOption
      );
    }
  }, [skipCounselorApiCall, counselorListApiCallInfo]);

  const [hideCourseList, setHideCourseList] = useState(false);
  const [skipCourseApiCall, setSkipCourseApiCall] = useState(true);
  const [courseDetails, setCourseDetails] = useState([]);

  //Student Query Report
  const [studentQuerySelectedCourse, setStudentQuerySelectedCourse] = useState(
    []
  );
  const [selectedCounselorStudentQueryID, setSelectedCounselorStudentQueryID] =
    useState([]);
  const [studentQuerySearch, setStudentQuerySearch] = useState("");
  const [studentQueryPageNumber, setStudentQueryPageNumber] = useState(1);
  const [studentQueryPageSize, setStudentQueryPageSize] = useState(25);
  const [callStudentQueriesApi, setCallStudentQueriesApi] = useState(false);
  const [studentQueryData, setStudentQueryData] = useState({});
  const [studentQueryDataLoading, setStudentQueryDataLoading] = useState(false);
  const [
    somethingWentWrongInStudentQuery,
    setSomethingWentWrongInStudentQuery,
  ] = useState(false);
  const [studentQueryInternalServerError, setStudentQueryInternalServerError] =
    useState(false);
  const [hideStudentQueryReport, setHideStudentQueryReport] = useState(false);
  const debouncedStudentQuerySearchText = useDebounce(studentQuerySearch, 500);
  const [studentQuerySortObj, setStudentQuerySortObj] = useState({
    sort: "",
    sort_type: "",
  });
  //get course list
  const courseListInfo = useGetAllCourseListQuery(
    { collegeId: selectedCollegeId },
    { skip: skipCourseApiCall }
  );
  useEffect(() => {
    if (!skipCourseApiCall) {
      const courseList = courseListInfo?.data?.data[0];
      handleFilterListApiCall(
        courseList,
        courseListInfo,
        setCourseDetails,
        setHideCourseList,
        organizeCourseFilterOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseListInfo, skipCourseApiCall]);

  const [getStudentQueryData] = useGetStudentQueryDataMutation();
  // Student query data
  useEffect(() => {
    if (selectedCollegeId?.length > 0 && selectedSeason?.length > 0) {
      setStudentQueryDataLoading(true);
      getStudentQueryData({
        collegeId: selectedCollegeId,
        pageNumber: studentQueryPageNumber,
        pageSize: studentQueryPageSize,
        payload: adminDashboardApiPayload({
          dateRange: studentQueryDate,
          selectedSeason,
          search: debouncedStudentQuerySearchText,
          counselorId: selectedCounselorStudentQueryID,
          program_name: studentQuerySelectedCourse,
          sort: studentQuerySortObj.sort,
          sort_type: studentQuerySortObj.sort_type,
        }),
      })
        .unwrap()
        .then((data) => {
          try {
            if (data.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (data.detail) {
              setStudentQueryData([]);
              pushNotification("error", data.detail);
            } else if (data?.data) {
              setStudentQueryData(data);
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInStudentQuery,
              setHideStudentQueryReport,
              10000
            );
          }
        })
        .catch(() => {
          handleInternalServerError(
            setStudentQueryInternalServerError,
            setHideStudentQueryReport,
            10000
          );
        })
        .finally(() => {
          setStudentQueryDataLoading(false);
        });
    }
  }, [
    selectedCollegeId,
    selectedSeason,
    studentQueryPageNumber,
    studentQueryPageSize,
    studentQueryDate,
    debouncedStudentQuerySearchText,
    callStudentQueriesApi,
    studentQuerySortObj,
  ]);

  const [selectedCounselor, setSelectedCounselor] = useState([]);
  const [counselorDateRange, setCounselorDateRange] = useState([]);
  const [selectedSource, setSelectedSource] = useState([]);
  const [callAPIleadsVsApplication, setCallAPIleadsVsApplication] =
    useState(false);
  const filterPayloadLeadsVsApplication = {
    counselor_id: selectedCounselor.length > 0 ? selectedCounselor : null,
    date_range:
      counselorDateRange?.length > 0 ? GetFormatDate(counselorDateRange) : {},
    season: selectedSeason && JSON.parse(selectedSeason)?.season_id,
    source: selectedSource.length > 0 ? selectedSource : [],
  };
  useEffect(() => {
    if (
      selectedCounselor.length > 0 ||
      counselorDateRange?.length > 0 ||
      selectedSource.length > 0
    ) {
      setPayloadOfLeadApplicationFilterData(filterPayloadLeadsVsApplication);
      setCallAPIleadsVsApplication(false);
    } else {
      setCallAPIleadsVsApplication(false);
      setPayloadOfLeadApplicationFilterData({});
    }
  }, [callAPIleadsVsApplication]);
  // getting lead application graph data
  useEffect(() => {
    if (
      selectedCollegeId?.length > 0 &&
      isScrolledLeadVsApplication &&
      selectedSeason?.length > 0
    ) {
      setIsLeadVsApplicationDataLoading(true);
      customFetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/admin/lead_application/${selectedCollegeId}`,
        ApiCallHeaderAndBody(
          token,
          "PUT",
          JSON.stringify(payloadOfLeadApplicationFilterData)
        ),
        true
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data.detail) {
            setLeadApplicationGraphData({});
            pushNotification("error", data.detail);
          } else if (data.code === 200) {
            const expectedData = data.data[0];
            try {
              if (
                typeof expectedData === "object" &&
                expectedData !== null &&
                !Array.isArray(expectedData)
              ) {
                setLeadApplicationGraphData(data.data[0]);

                leadVsApplicationPayload(data, setChartState);
              } else {
                throw new Error("lead_application API response has changed");
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInLeadVsApplication,
                setHideLeadVsApplication,
                10000
              );
            }
          }
        })
        .catch(() => {
          handleInternalServerError(
            setLeadVsApplicationInternalServerError,
            setHideLeadVsApplication,
            10000
          );
        })
        .finally(() => setIsLeadVsApplicationDataLoading(false));
    }
  }, [
    leadApplicationGraphDateRange,
    selectedCollegeId,
    isScrolledLeadVsApplication,
    leadVsApplicationCounselorId,
    selectedSeason,
    leadsVsApplicationApiCall,
    payloadOfLeadApplicationFilterData,
  ]);

  const [skipSchoolApiCall, setSkipSchoolApiCall] = useState(true);
  const [schoolList, setSchoolList] = useState([]);
  const [hideSchoolList, setHideSchoolList] = useState(false);
  const schoolListInfo = useGetListOfSchoolsQuery(
    { collegeId: selectedCollegeId },
    { skip: skipSchoolApiCall }
  );

  useEffect(() => {
    try {
      if (schoolListInfo?.isSuccess) {
        if (schoolListInfo?.data?.data) {
          const formatedSchoolList = organizeSourceFilterOption(
            Object.keys(schoolListInfo?.data?.data)
          );
          setSchoolList(formatedSchoolList);
        } else {
          throw new Error("List of school API's response has been changed.");
        }
      } else if (schoolListInfo?.isError) {
        setHideSchoolList(true);
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      setHideSchoolList(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    schoolListInfo?.data,
    schoolListInfo?.error,
    schoolListInfo?.isError,
    schoolListInfo?.isSuccess,
    skipSchoolApiCall,
  ]);

  //set component wise download internal server error
  const checkDownloadInternalServerError = (componentName) => {
    if (componentName === "score-board") {
      handleInternalServerError(setScoreBoardInternalServerError, "", 5000);
    } else if (componentName === "application-funnel") {
      handleInternalServerError(
        setApplicationFunnelInternalServerError,
        "",
        5000
      );
    } else if (componentName === "top-performing-channel") {
      handleInternalServerError(setTopPerformingInternalServerError, "", 5000);
    } else if (componentName === "leads-applications") {
      handleInternalServerError(
        setLeadVsApplicationInternalServerError,
        "",
        5000
      );
    } else if (componentName === "form-wise-applications") {
      handleInternalServerError(
        setFormWiseApplicationsInternalServerError,
        "",
        5000
      );
    } else if (componentName === "source-wise-applications") {
      handleInternalServerError(
        setSourceWiseLeadDetailInternalServerError,
        "",
        5000
      );
    }
  };

  //set component wise download internal server error
  const checkSomethingWentWrongInDownload = (componentName) => {
    if (componentName === "score-board") {
      handleSomethingWentWrong(setSomethingWentWrongInScoreBoard, "", 5000);
    } else if (componentName === "application-funnel") {
      handleSomethingWentWrong(
        setSomethingWentWrongInApplicationFunnel,
        "",
        5000
      );
    } else if (componentName === "top-performing-channel") {
      handleSomethingWentWrong(
        setSomethingWentWrongInTopPerformingChannel,
        "",
        5000
      );
    } else if (componentName === "leads-applications") {
      handleSomethingWentWrong(
        setSomethingWentWrongInLeadVsApplication,
        "",
        5000
      );
    } else if (componentName === "form-wise-applications") {
      handleSomethingWentWrong(
        setSomethingWentWrongInFormWiseApplication,
        "",
        5000
      );
    } else if (componentName === "source-wise-applications") {
      handleSomethingWentWrong(
        setSomethingWentWrongInSourceWiseLeadDetail,
        "",
        5000
      );
    }
  };

  // function for downloading file
  const handleDownloadFile = React.useMemo(() => {
    return (fileDownloadUrl, payload, componentName, method = "POST") => {
      setOpenBackdrop(true);
      customFetch(
        fileDownloadUrl,
        ApiCallHeaderAndBody(token, method, payload),
        fileDownloadUrl?.includes("?") ? false : true
      )
        .then((res) =>
          res.json().then((data) => {
            if (data?.file_url) {
              const expectedData = data?.file_url;
              try {
                if (typeof expectedData === "string") {
                  window.open(data?.file_url);
                } else {
                  throw new Error(
                    `${componentName} download API response has changed`
                  );
                }
              } catch (error) {
                setApiResponseChangeMessage(error);
                checkSomethingWentWrongInDownload(componentName);
              }
            } else if (data.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (data.detail) {
              pushNotification("error", data.detail);
            }
          })
        )
        .catch(() => {
          checkDownloadInternalServerError(componentName);
        })
        .finally(() => setOpenBackdrop(false));
    };
  }, []);

  //getting counsellor performane report data
  const [counselorReportAPICall, setCounselorReportAPICall] = useState(false);
  const [selectedFilterPayload, setSelectedFilterPayload] = useState({});
  const counselorPerformanceReportPayload = {
    season: selectedSeason ? JSON.parse(selectedSeason)?.season_id : "",
    counselor_Id:
      selectedCounselorPerformanceID?.length > 0
        ? selectedCounselorPerformanceID
        : [],
    date_range:
      counsellorPeroformanceReportDateRange?.length > 0
        ? JSON.parse(GetJsonDate(counsellorPeroformanceReportDateRange))
        : {},
  };
  useEffect(() => {
    if (
      selectedCounselorPerformanceID?.length > 0 ||
      selectedSeason ||
      counsellorPeroformanceReportDateRange?.length > 0
    ) {
      setSelectedFilterPayload(counselorPerformanceReportPayload);
      setCounselorReportAPICall(false);
    } else {
      setSelectedFilterPayload({});
      setCounselorReportAPICall(false);
    }
  }, [counsellorPeroformanceReportDateRange, counselorReportAPICall]);
  const { data, isSuccess, isFetching, error, isError } =
    useGetCounselorPerformanceReportDataQuery(
      {
        selectedCollegeId: selectedCollegeId,
        counsellorPerformanceIndicator: counsellorPerformanceIndicator,
        payload: selectedFilterPayload,
      },
      {
        skip:
          isScrolledCounsellorPerformanceReport &&
          selectedSeason?.length > 0 &&
          selectedCollegeId?.length > 0
            ? false
            : true,
      }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setCounsellorPerformanceData(data);
        } else {
          throw new Error(
            "get counselor Performance report API response has changed"
          );
        }
      }
      if (isError) {
        setCounsellorPerformanceData({});
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setCounsellorPerformanceReportInternalServerError,
            setHideCounsellorPerformanceReport,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInCounsellorPerformanceReport,
        setHideCounsellorPerformanceReport,
        10000
      );
    } finally {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSuccess,
    data?.data,
    error,
    isError,
    error?.data?.detail,
    error?.status,
    callPerformanceAPI,
  ]);

  const permissions = useSelector((state) => state.authentication.permissions);
  const [dashboardFeatures, setDashboardFeatures] = useState({});

  useEffect(() => {
    setDashboardFeatures(
      permissions?.["aefd607c"]?.features?.["e7d559dc"]?.features
    );
  }, [permissions]);

  return (
    <>
      {somethingWentWrongInColleges ? (
        <>
          <Box sx={{ mt: 18 }}>
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          </Box>
        </>
      ) : (
        <Box
          className="admin-dashboard-box-container"
          component="main"
          sx={{ flexGrow: 1, px: "8px !important" }}
        >
          <BackDrop openBackdrop={openBackdrop} />
          <Container maxWidth={false}>
            <Grid container spacing={3}>
              <Grid item md={12} sm={12} xs={12}>
                <AdminHeader
                  dashboardFeatures={dashboardFeatures}
                  collegeId={selectedCollegeId}
                  setCollegeId={setSelectedCollegeId}
                  setSomethingWentWrongInColleges={
                    setSomethingWentWrongInColleges
                  }
                  selectedSeason={selectedSeason}
                />
              </Grid>
            </Grid>
          </Container>

          <Container sx={{ px: "20px !important" }} maxWidth={false}>
            <Grid container spacing={2}>
              {dashboardFeatures?.["e7cb13a0"]?.visibility && (
                <>
                  {showScoreBoard && (
                    <Grid
                      item
                      md={12}
                      sm={12}
                      xs={12}
                      sx={{ pt: "0px !important" }}
                      ref={scoreBoardRef}
                    >
                      <ScoreBoard
                        apiCallingConditions={apiCallingConditions}
                        collegeId={selectedCollegeId}
                        isScrolledToScoreBoard={isScrolledToScoreBoard}
                      />
                    </Grid>
                  )}
                </>
              )}
              {dashboardFeatures?.["b45a67ff"]?.visibility && (
                <>
                  {showPerformingFunnel && (
                    <>
                      <Grid
                        ref={topPerformingChannelRef}
                        item
                        md={8}
                        sm={12}
                        xs={12}
                      >
                        <TopPerformingChannels
                          handleDownloadFile={handleDownloadFile}
                          collegeId={selectedCollegeId}
                          hideCourseList={hideCourseList}
                          setSkipCourseApiCall={setSkipCourseApiCall}
                          courseDetails={courseDetails}
                          courseListInfo={courseListInfo}
                          apiCallingConditions={apiCallingConditions}
                          isScrolledTopPerformingChannel={
                            isScrolledTopPerformingChannel
                          }
                        />
                      </Grid>
                    </>
                  )}
                </>
              )}

              {dashboardFeatures?.["31b2f5ba"]?.visibility && (
                <>
                  {showApplicationFunnel && (
                    <>
                      <Grid
                        ref={applicationFunnelRef}
                        item
                        md={4}
                        sm={12}
                        xs={12}
                      >
                        <ApplicationFunnel
                          featureKey="31b2f5ba"
                          sourceFilterFeature={
                            dashboardFeatures?.["31b2f5ba"]?.features?.[
                              "cd1b889e"
                            ]?.visibility
                          }
                          dateRangeFilterFeature={
                            dashboardFeatures?.["31b2f5ba"]?.features?.[
                              "8de7b641"
                            ]?.visibility
                          }
                          collegeId={selectedCollegeId}
                          hideSourceList={hideSourceList}
                          sourceList={sourceList}
                          sourceListInfo={sourceListInfo}
                          setSkipSourceApiCall={setSkipSourceApiCall}
                          apiCallingConditions={apiCallingConditions}
                          isScrolledToApplicationFunnel={
                            isScrolledToApplicationFunnel
                          }
                        />
                      </Grid>
                    </>
                  )}
                </>
              )}
              {dashboardFeatures?.["52db5592"]?.visibility && (
                <>
                  {showMap && (
                    <>
                      <Grid ref={mapDataRef} item md={12} sm={12} xs={12}>
                        <StateWisePerformance
                          sourceFilterFeature={
                            dashboardFeatures?.["52db5592"]?.features?.[
                              "0d3c1a22"
                            ]?.visibility
                          }
                          dateRangeFilterFeature={
                            dashboardFeatures?.["52db5592"]?.features?.[
                              "5ae11080"
                            ]?.visibility
                          }
                          changeIndicatorFilterFeature={
                            dashboardFeatures?.["52db5592"]?.features?.[
                              "b1ecf451"
                            ]?.visibility
                          }
                          hideSourceList={hideSourceList}
                          sourceList={sourceList}
                          sourceListInfo={sourceListInfo}
                          setSkipSourceApiCall={setSkipSourceApiCall}
                          apiCallingConditions={apiCallingConditions}
                          isScrolledToMapData={isScrolledToMapData}
                          collegeId={selectedCollegeId}
                          featureKey="52db5592"
                        />
                      </Grid>
                    </>
                  )}
                </>
              )}

              {/* Key indicator  */}
              {dashboardFeatures?.["acdbd75a"]?.visibility && (
                <>
                  {showKeyIndicatorIndicator && (
                    <>
                      <Grid ref={keyIndicatorRef} item md={5} sm={12} xs={12}>
                        <KeyIndicator
                          hideCourseList={hideCourseList}
                          setSkipCourseApiCall={setSkipCourseApiCall}
                          courseDetails={courseDetails}
                          courseListInfo={courseListInfo}
                          collegeId={selectedCollegeId}
                          apiCallingConditions={apiCallingConditions}
                          isScrolledToKeyIndicator={isScrolledToKeyIndicator}
                        />
                      </Grid>
                    </>
                  )}
                </>
              )}

              {/* Application Steps */}
              {dashboardFeatures?.["cff4944d"]?.visibility && (
                <>
                  {showApplicationSteps && (
                    <>
                      <Grid
                        ref={applicationStepsRef}
                        item
                        md={7}
                        sm={12}
                        xs={12}
                      >
                        <ApplicationSteps
                          apiCallingCondition={apiCallingConditions}
                          isScrolledToApplicationSteps={
                            isScrolledToApplicationSteps
                          }
                          collegeId={selectedCollegeId}
                          selectedSeason={selectedSeason}
                          counsellorList={counsellorList}
                          hideCounsellorList={hideCounsellorList}
                          loadingCounselorList={
                            counselorListApiCallInfo.isFetching
                          }
                          setSkipCounselorApiCall={setSkipCounselorApiCall}
                          hideCourseList={hideCourseList}
                          setSkipCourseApiCall={setSkipCourseApiCall}
                          courseDetails={courseDetails}
                          courseListInfo={courseListInfo}
                          hideSourceList={hideSourceList}
                          sourceList={sourceList}
                          sourceListInfo={sourceListInfo}
                          setSkipSourceApiCall={setSkipSourceApiCall}
                        />
                      </Grid>
                    </>
                  )}
                </>
              )}

              {dashboardFeatures?.["d92a32d8"]?.visibility && (
                <>
                  {showLeadVsApplications && (
                    <>
                      {(leadVsApplicationIternalServerError ||
                        somethingWentWrongInLeadVsApplication) &&
                      !isLeadVsApplicationDataLoading &&
                      !isSourceWiseLeadDetailLoading &&
                      !isFetching ? (
                        <Grid item md={12} sm={12} xs={12}>
                          <Card>
                            <Typography
                              align="left"
                              variant="h6"
                              sx={{ fontWeight: "bold", pt: 2, px: 2 }}
                            >
                              Lead Vs Application
                            </Typography>
                            {leadVsApplicationIternalServerError && (
                              <Error500Animation
                                height={400}
                                width={400}
                              ></Error500Animation>
                            )}
                            {somethingWentWrongInLeadVsApplication && (
                              <ErrorFallback
                                error={apiResponseChangeMessage}
                                resetErrorBoundary={() =>
                                  window.location.reload()
                                }
                              />
                            )}
                          </Card>
                        </Grid>
                      ) : (
                        <Grid
                          sx={{
                            display: hideLeadVsApplication ? "none" : "block",
                          }}
                          item
                          md={12}
                          sm={12}
                          xs={12}
                          ref={leadVsApplicationRef}
                        >
                          <LeadsApplications
                            counsellorList={counsellorList}
                            hideCounsellorList={hideCounsellorList}
                            handleDownloadFile={handleDownloadFile}
                            leadGraphData={leadApplicationGraphData}
                            leadGraphDate={leadApplicationGraphDateRange}
                            setLeadGraphDate={setLeadApplicationGraphDateRange}
                            collegeId={selectedCollegeId}
                            setLeadVsApplicationCounselorId={
                              setLeadVsApplicationCounselorId
                            }
                            leadVsApplicationCounselorId={
                              leadVsApplicationCounselorId
                            }
                            selectedSeason={selectedSeason}
                            chartsState={chartsState}
                            setLeadsVsApplicationApiCall={
                              setLeadsVsApplicationApiCall
                            }
                            leadsVsApplicationApiCall={
                              leadsVsApplicationApiCall
                            }
                            loadingCounselorList={
                              counselorListApiCallInfo.isFetching
                            }
                            setSkipCounselorApiCall={setSkipCounselorApiCall}
                            isScrolledLeadVsApplication={
                              isScrolledLeadVsApplication
                            }
                            payloadOfLeadApplicationFilterData={
                              payloadOfLeadApplicationFilterData
                            }
                            setPayloadOfLeadApplicationFilterData={
                              setPayloadOfLeadApplicationFilterData
                            }
                            isLeadVsApplicationDataLoading={
                              isLeadVsApplicationDataLoading
                            }
                            selectedSource={selectedSource}
                            setSelectedSource={setSelectedSource}
                            selectedCounselor={selectedCounselor}
                            setSelectedCounselor={setSelectedCounselor}
                            counselorDateRange={counselorDateRange}
                            setCounselorDateRange={setCounselorDateRange}
                            setIsLeadVsApplicationDataLoading={
                              setIsLeadVsApplicationDataLoading
                            }
                            setCallAPIleadsVsApplication={
                              setCallAPIleadsVsApplication
                            }
                            dashboardFeatures={dashboardFeatures}
                          />
                        </Grid>
                      )}
                    </>
                  )}
                </>
              )}

              {dashboardFeatures?.["f89aaf25"]?.visibility && (
                <>
                  {showFormWiseApplication && (
                    <>
                      <Grid
                        ref={formWiseApplicationRef}
                        item
                        md={12}
                        sm={12}
                        xs={12}
                      >
                        <FormWiseApplications
                          featureKey="f89aaf25"
                          sourceFilterFeature={
                            dashboardFeatures?.["f89aaf25"]?.features?.[
                              "4e13438e"
                            ]?.visibility
                          }
                          dateRangeFilterFeature={
                            dashboardFeatures?.["f89aaf25"]?.features?.[
                              "a663bd70"
                            ]?.visibility
                          }
                          changeIndicatorFilterFeature={
                            dashboardFeatures?.["f89aaf25"]?.features?.[
                              "9a73b195"
                            ]?.visibility
                          }
                          schoolFilterFeature={
                            dashboardFeatures?.["f89aaf25"]?.features?.[
                              "b8247069"
                            ]?.visibility
                          }
                          counselorFilterFeature={
                            dashboardFeatures?.["f89aaf25"]?.features?.[
                              "c103ea4c"
                            ]?.visibility
                          }
                          downloadFeature={
                            dashboardFeatures?.["f89aaf25"]?.features?.[
                              "ee5132b2"
                            ]?.visibility
                          }
                          apiCallingConditions={apiCallingConditions}
                          isScrolledFormWiseApplication={
                            isScrolledFormWiseApplication
                          }
                          handleDownloadFile={handleDownloadFile}
                          collegeId={selectedCollegeId}
                          counsellorList={counsellorList}
                          hideCounsellorList={hideCounsellorList}
                          selectedSeason={selectedSeason}
                          loadingCounselorList={
                            counselorListApiCallInfo.isFetching
                          }
                          setSkipCounselorApiCall={setSkipCounselorApiCall}
                          schoolList={schoolList}
                          hideSchoolList={hideSchoolList}
                          loadingSchoolList={schoolListInfo.isFetching}
                          setSkipSchoolApiCall={setSkipSchoolApiCall}
                          hideSourceList={hideSourceList}
                          sourceList={sourceList}
                          sourceListInfo={sourceListInfo}
                          setSkipSourceApiCall={setSkipSourceApiCall}
                        />
                      </Grid>
                    </>
                  )}
                </>
              )}
              {showPreferenceWiseApplication &&
                systemPreference &&
                systemPreference?.preference && (
                  <>
                    <Grid
                      sx={{ display: hidePreferenceWise ? "none" : "block" }}
                      ref={preferenceWiseApplicationRef}
                      item
                      md={12}
                      sm={12}
                      xs={12}
                    >
                      <PreferenceWiseApplication
                        apiCallingConditions={apiCallingConditions}
                        isScrolledPreferenceWiseApplication={
                          isScrolledPreferenceWiseApplication
                        }
                        collegeId={selectedCollegeId}
                        counsellorList={counsellorList}
                        hideCounsellorList={hideCounsellorList}
                        selectedSeason={selectedSeason}
                        hideCourseList={hideCourseList}
                        setSkipCourseApiCall={setSkipCourseApiCall}
                        courseDetails={courseDetails}
                        courseListInfo={courseListInfo}
                        hidePreferenceWise={hidePreferenceWise}
                        setHidePreferenceWise={setHidePreferenceWise}
                      />
                    </Grid>
                  </>
                )}

              {dashboardFeatures?.["20c9aaa4"]?.visibility && (
                <>
                  {showSourceWiseLeadDetail && (
                    <>
                      <Grid
                        ref={sourceWiseLeadDetailRef}
                        item
                        md={12}
                        sm={12}
                        xs={12}
                      >
                        <SourceWiseLeadDetail
                          apiCallingCondition={apiCallingConditions}
                          isScrolledSourceWiseLeadDetail={
                            isScrolledSourceWiseLeadDetail
                          }
                          selectedSeason={selectedSeason}
                          handleDownloadFile={handleDownloadFile}
                          collegeId={selectedCollegeId}
                        ></SourceWiseLeadDetail>
                      </Grid>
                    </>
                  )}
                </>
              )}

              <Grid item md={12} sm={12} xs={12}>
                <Box className={"top-dashboard-box-table"}>
                  {counsellorPeroformanceReportDateRange?.length > 1 &&
                    performanceQueriesTabsValue === 0 && (
                      <DateRangeShowcase
                        startDateRange={getDateMonthYear(
                          counsellorPeroformanceReportDateRange[0]
                        )}
                        endDateRange={getDateMonthYear(
                          counsellorPeroformanceReportDateRange[1]
                        )}
                        triggeredFunction={() =>
                          setCounsellorPeroformanceReportDateRange([])
                        }
                      ></DateRangeShowcase>
                    )}
                  {headCounselorDateRange?.length > 1 &&
                    performanceQueriesTabsValue === 1 && (
                      <DateRangeShowcase
                        startDateRange={getDateMonthYear(
                          headCounselorDateRange[0]
                        )}
                        endDateRange={getDateMonthYear(
                          headCounselorDateRange[1]
                        )}
                        triggeredFunction={() => setHeadCounselorDateRange([])}
                      ></DateRangeShowcase>
                    )}
                  {studentQueryDate?.length > 1 &&
                    performanceQueriesTabsValue === 1 && (
                      <DateRangeShowcase
                        startDateRange={getDateMonthYear(studentQueryDate[0])}
                        endDateRange={getDateMonthYear(studentQueryDate[1])}
                        triggeredFunction={() => setStudentQueryDate([])}
                      ></DateRangeShowcase>
                    )}
                  <Box sx={{ mb: 4, pl: { md: 2 } }}>
                    <MultipleTabs
                      tabArray={[
                        { tabName: "Counsellor Performance Report" },
                        { tabName: "Pending Follow Up Details" },
                        {
                          tabName: "Student Queries Report",
                        },
                      ]}
                      setMapTabValue={setPerformanceQueriesTabValue}
                      mapTabValue={performanceQueriesTabsValue}
                    ></MultipleTabs>
                  </Box>

                  {performanceQueriesTabsValue === 0 && (
                    <>
                      {dashboardFeatures?.["5b6387aa"]?.visibility && (
                        <Box>
                          {" "}
                          {showCounsellorPerformanceReport && (
                            <>
                              {counsellorPerformanceReportInternalServerError ||
                              somethingWentWrongInCounsellorPerformanceReport ? (
                                <Grid item md={12} sm={12} xs={12}>
                                  <Card>
                                    <Typography
                                      align="left"
                                      variant="h6"
                                      sx={{ fontWeight: "bold", pt: 2, px: 2 }}
                                    >
                                      Counsellor Performance Report
                                    </Typography>
                                    {counsellorPerformanceReportInternalServerError && (
                                      <Error500Animation
                                        height={400}
                                        width={400}
                                      ></Error500Animation>
                                    )}
                                    {somethingWentWrongInCounsellorPerformanceReport && (
                                      <ErrorFallback
                                        error={apiResponseChangeMessage}
                                        resetErrorBoundary={() =>
                                          window.location.reload()
                                        }
                                      />
                                    )}
                                  </Card>
                                </Grid>
                              ) : (
                                <Grid
                                  sx={{
                                    display: hideCounsellorPerformanceReport
                                      ? "none"
                                      : "block",
                                  }}
                                  ref={counsellorPerformanceReportRef}
                                  item
                                  md={12}
                                  sm={12}
                                  xs={12}
                                >
                                  {isFetching ? (
                                    <Card className="loader-wrapper">
                                      <LeefLottieAnimationLoader
                                        height={100}
                                        width={150}
                                      ></LeefLottieAnimationLoader>{" "}
                                    </Card>
                                  ) : (
                                    <CounsellorPerformanceReport
                                      counsellorPerformanceData={
                                        counsellorPerformanceData
                                      }
                                      counsellorPeroformanceReportDateRange={
                                        counsellorPeroformanceReportDateRange
                                      }
                                      setCounsellorPeroformanceReportDateRange={
                                        setCounsellorPeroformanceReportDateRange
                                      }
                                      selectedSeason={selectedSeason}
                                      counsellorPerformanceIndicator={
                                        counsellorPerformanceIndicator
                                      }
                                      setCounsellorPerformanceIndicator={
                                        setCounsellorPerformanceIndicator
                                      }
                                      selectedCounsellor={
                                        selectedCounselorPerformanceID
                                      }
                                      setCounsellorID={
                                        setSelectedCounselorPerformanceID
                                      }
                                      counsellorList={counsellorList}
                                      hideCounsellorList={hideCounsellorList}
                                      loadingCounselorList={
                                        counselorListApiCallInfo.isFetching
                                      }
                                      setSkipCounselorApiCall={
                                        setSkipCounselorApiCall
                                      }
                                      setCallAPI={setCallPerformanceAPI}
                                      handleDownloadFile={handleDownloadFile}
                                      collegeId={selectedCollegeId}
                                      setCounselorReportAPICall={
                                        setCounselorReportAPICall
                                      }
                                    ></CounsellorPerformanceReport>
                                  )}
                                </Grid>
                              )}
                            </>
                          )}
                        </Box>
                      )}
                    </>
                  )}
                  {performanceQueriesTabsValue === 1 && (
                    <Box>
                      {dashboardFeatures?.["9398042e"]?.visibility && (
                        <Grid
                          ref={headCounselorListRef}
                          item
                          md={12}
                          sm={12}
                          xs={12}
                          sx={{
                            display: `${
                              showHeadCounselorList ? "block" : "none"
                            }`,
                          }}
                        >
                          {isScrolledToPendingFollowupDetails && (
                            <Box>
                              <Box>
                                <HeadCounselorPendingFollowup
                                  headCounselorDate={headCounselorDateRange}
                                  setHeadCounselorDate={
                                    setHeadCounselorDateRange
                                  }
                                  selectedSeason={selectedSeason}
                                  counsellorList={counsellorList}
                                  hideCounsellorList={hideCounsellorList}
                                  loadingCounselorList={
                                    counselorListApiCallInfo.isFetching
                                  }
                                  setSkipCounselorApiCall={
                                    setSkipCounselorApiCall
                                  }
                                />
                              </Box>
                            </Box>
                          )}
                        </Grid>
                      )}
                    </Box>
                  )}
                  {performanceQueriesTabsValue === 2 && (
                    <>
                      {dashboardFeatures?.["216efaab"]?.visibility && (
                        <>
                          {studentQueryInternalServerError ||
                          somethingWentWrongInStudentQuery ? (
                            <Box>
                              {studentQueryInternalServerError && (
                                <Error500Animation
                                  height={400}
                                  width={400}
                                ></Error500Animation>
                              )}
                              {somethingWentWrongInStudentQuery && (
                                <ErrorFallback
                                  error={apiResponseChangeMessage}
                                  resetErrorBoundary={() =>
                                    window.location.reload()
                                  }
                                />
                              )}
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                display: hideStudentQueryReport
                                  ? "none"
                                  : "block",
                              }}
                              className=""
                            >
                              <StudentQueryReport
                                // Counselor props
                                selectedCounsellor={
                                  selectedCounselorStudentQueryID
                                }
                                setCounsellorID={
                                  setSelectedCounselorStudentQueryID
                                }
                                counsellorList={counsellorList}
                                hideCounsellorList={hideCounsellorList}
                                loadingCounselorList={
                                  counselorListApiCallInfo.isFetching
                                }
                                setSkipCounselorApiCall={
                                  setSkipCounselorApiCall
                                }
                                setCallAPI={setCallStudentQueriesApi}
                                // date range props
                                studentQueryDate={studentQueryDate}
                                setStudentQueryDate={setStudentQueryDate}
                                //course props
                                hideCourseList={hideCourseList}
                                setSkipCourseApiCall={setSkipCourseApiCall}
                                selectedCourseId={studentQuerySelectedCourse}
                                setSelectedCourseId={
                                  setStudentQuerySelectedCourse
                                }
                                courseList={courseDetails}
                                // search props
                                studentQuerySearch={studentQuerySearch}
                                pageNumber={studentQueryPageNumber}
                                pageSize={studentQueryPageSize}
                                setStudentQuerySearch={setStudentQuerySearch}
                                setStudentQueryPageNumber={
                                  setStudentQueryPageNumber
                                }
                                setStudentQueryPageSize={
                                  setStudentQueryPageSize
                                }
                                //table data
                                studentQueryData={studentQueryData}
                                selectedSeason={selectedSeason}
                                loading={studentQueryDataLoading}
                                setStudentQuerySortObj={setStudentQuerySortObj}
                              />
                            </Box>
                          )}
                        </>
                      )}
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}
    </>
  );
}

export default AdminDashboard;
