/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  IconButton,
  Tabs,
  Tab,
  CardHeader,
  TableCell,
  TableHead,
  TableContainer,
  Table,
  TableBody,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../styles/InAppCallLogs.css";
import QuickStatsCard from "../../components/ui/application-form/QuickStatsCard";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import Cookies from "js-cookie";
import useToasterHook from "../../hooks/useToasterHook";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { secondsToHms } from "../../utils/timeConvertion";
import {
  a11yProps,
  TabPanel,
} from "../../components/shared/tab-panel/TabFunctions";
import CallLogsTableShared from "../../components/ui/application-form/CallLogsTableShared";
import {
  useGetCounselorListQuery,
  useGetInBoundActivitiesDetailsAPIQuery,
  useGetOutBoundActivitiesDetailsAPIQuery,
  usePrefetch,
} from "../../Redux/Slices/applicationDataApiSlice";
import GetJsonDate from "../../hooks/GetJsonDate";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import Pagination from "../../components/shared/Pagination/Pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../helperFunctions/pagination";
import DateRange from "../../components/shared/filters/DateRange";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import { organizeCounselorFilterOption } from "../../helperFunctions/filterHelperFunction";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { customFetch } from "../StudentTotalQueries/helperFunction";

function InAppCallLogs(props) {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const navigate = useNavigate();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [viewData, setViewData] = useState({});
  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [
    consumptionInfoInternalServerError,
    setConsumptionInfoInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInConsumptionInfo,
    setSomethingWentWrongInConsumptionInfo,
  ] = useState(false);
  const [inboundTableInternalServerError, setInboundTableInternalServerError] =
    useState(false);
  const [
    somethingWentWrongInInboundTable,
    setSomethingWentWrongInInboundTable,
  ] = useState(false);
  const [
    outboundTableInternalServerError,
    setOutboundTableInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInOutboundTable,
    setSomethingWentWrongOutboundTable,
  ] = useState(false);
  const [
    counsellorActivitiesInternalServerError,
    setCounsellorActivitiesInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongCounsellorActivities,
    setSomethingWentWrongCounsellorActivities,
  ] = useState(false);

  const [hideCounsellorList, setHideCounsellorList] = useState(false);

  let [totalCallAttemptedOutbound, setTotalCallAttemptedOutbound] = useState(0);
  let [totalCallDurationOutbound, setTotalCallDurationOutbound] = useState(0);
  let [totalConnectedCallsOutbound, setTotalConnectedCallsOutbound] =
    useState(0);
  let [totalCallReceivedInbound, setTotalCallReceivedInbound] = useState(0);
  let [totalCallMissedInbound, setTotalCallMissedInbound] = useState(0);
  let [totalCallDurationInbound, setTotalCallDurationInbound] = useState(0);

  const [counsellorList, setCounsellorList] = useState([]);

  const [tabValue, setTabValue] = useState(0);
  const [showAtAGlance, setShowAtAGlance] = useState(false);
  const [logsDataInbound, setLogsDataInbound] = useState([]);
  const [logsDataOutbound, setLogsDataOutbound] = useState([]);
  const [counsellorActivities, setCounsellorActivities] = useState([]);
  const [loadingCounsellorActivities, setLoadingCounsellorActivities] =
    useState(false);

  const [inboundRowCount, setInboundRowCount] = useState(0);
  const [outboundRowCount, setOutboundRowCount] = useState(0);
  const [counsellorActivitiesRowCount, setCounsellorActivitiesCount] =
    useState(0);
  // states for pagination
  const inboundPageNumberDefault = localStorage.getItem(
    `${Cookies.get("userId")}InboundLocalStoragePageNo`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}InboundLocalStoragePageNo`
        )
      )
    : 1;

  const inboundRowsPerPageDefault = localStorage.getItem(
    `${Cookies.get("userId")}inboundTableRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}inboundTableRowPerPage`)
      )
    : 25;
  const outboundPageNumberDefault = localStorage.getItem(
    `${Cookies.get("userId")}OutboundLocalStoragePageNo`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}OutboundLocalStoragePageNo`
        )
      )
    : 1;

  const outboundRowsPerPageDefault = localStorage.getItem(
    `${Cookies.get("userId")}outboundTableRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}outboundTableRowPerPage`)
      )
    : 25;
  const counsellorActivitiesPageNumberDefault = localStorage.getItem(
    `${Cookies.get("userId")}CounsellorActivitiesLocalStoragePageNo`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}CounsellorActivitiesLocalStoragePageNo`
        )
      )
    : 1;

  const counsellorActivitiesRowsPerPageDefault = localStorage.getItem(
    `${Cookies.get("userId")}CounsellorActivitiesTableRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}CounsellorActivitiesTableRowPerPage`
        )
      )
    : 25;

  const [inboundRowsPerPage, setInboundRowsPerPage] = useState(
    inboundRowsPerPageDefault
  );
  const [inboundPageNumber, setInboundPageNumber] = useState(
    inboundPageNumberDefault
  );

  const inboundCount = Math.ceil(inboundRowCount / inboundRowsPerPage);

  const [outboundRowsPerPage, setOutboundRowsPerPage] = useState(
    outboundRowsPerPageDefault
  );
  const [outboundPageNumber, setOutboundPageNumber] = useState(
    outboundPageNumberDefault
  );

  const outboundCount = Math.ceil(outboundRowCount / outboundRowsPerPage);
  const [counsellorActivitiesRowsPerPage, setCounsellorActivitiesRowsPerPage] =
    useState(counsellorActivitiesRowsPerPageDefault);
  const [counsellorActivitiesPageNumber, setCounsellorActivitiesPageNumber] =
    useState(counsellorActivitiesPageNumberDefault);

  const counsellorActivitiesCount = Math.ceil(
    counsellorActivitiesRowCount / counsellorActivitiesRowsPerPage
  );

  //counsellor call activities date range
  const [
    counsellorCallActivitiesDateRange,
    setCounsellorCallActivitiesDateRange,
  ] = useState([]);

  // Detailed Report Email Status
  const [outboundStats, setOutboundStats] = useState(true);
  const [inboundStats, setInboundStats] = useState(false);
  //filter state
  const [outboundDateRange, setOutboundDateRange] = useState([]);
  const [outboundCounselorId, setOutboundCounselorId] = useState([]);
  const [inboundDateRange, setInboundDateRange] = useState([]);
  const [inboundCounselorId, setInboundCounselorId] = useState([]);
  const [inboundApplicationStatus, setInboundApplicationStatus] = useState("");
  const [outboundApplicationStatus, setOutboundApplicationStatus] =
    useState("");
  const [inboundCallStatus, setInboundCallStatus] = useState("");
  const [outboundCallStatus, setOutboundCallStatus] = useState("");
  const [searchTextInbound, setSearchTextInbound] = useState("");
  const [searchTextOutbound, setSearchTextOutbound] = useState("");
  const [sendSearchItemInbound, setSendSearchItemInbound] = useState("");
  const [sendSearchItemOutbound, setSendSearchItemOutbound] = useState("");
  const [showResetButtonInbound, setShowResetButtonInbound] = useState(false);
  const [showResetButtonOutbound, setShowResetButtonOutbound] = useState(false);

  /// state for calling counselor list
  const [skipCounselorApiCall, setSkipCounselorApiCall] = useState(true);

  const [skipOutboundApiCall, setSkipOutboundApiCall] = useState(false);
  const [skipInboundApiCall, setSkipInboundApiCall] = useState(true);

  const setCallSearchAPI = useCallback((setSendSearchItem, searchText) => {
    setSendSearchItem(searchText);
  }, []);

  const payloadForInbound = {
    pageNumber: inboundPageNumber,
    rowsPerPage: inboundRowsPerPage,
    collegeId: collegeId,
    dateRange:
      inboundDateRange?.length > 0
        ? JSON.parse(GetJsonDate(inboundDateRange))
        : null,
    counselorId: inboundCounselorId,
    applicationStatus: inboundApplicationStatus,
    callStatus: inboundCallStatus,
    search: sendSearchItemInbound,
  };

  const payloadForOutbound = {
    pageNumber: outboundPageNumber,
    rowsPerPage: outboundRowsPerPage,
    collegeId: collegeId,
    dateRange:
      outboundDateRange?.length > 0
        ? JSON.parse(GetJsonDate(outboundDateRange))
        : null,
    counselorId: outboundCounselorId,
    applicationStatus: outboundApplicationStatus,
    callStatus: outboundCallStatus,
    search: sendSearchItemOutbound,
  };

  const {
    data: inboundDetails,
    isSuccess: isSuccessInbound,
    isFetching: isFetchingInbound,
    error: errorInbound,
    isError: isErrorInbound,
    refetch: reFetchInboundAPI,
  } = useGetInBoundActivitiesDetailsAPIQuery(payloadForInbound, {
    skip: skipInboundApiCall,
  });

  const {
    data: outboundDetails,
    isSuccess: isSuccessOutbound,
    isFetching: isFetchingOutbound,
    error: errorOutbound,
    isError: isErrorOutbound,
    refetch: reFetchOutboundAPI,
  } = useGetOutBoundActivitiesDetailsAPIQuery(payloadForOutbound, {
    skip: skipOutboundApiCall,
  });

  // use react hook for prefetch data
  const prefetchInboundData = usePrefetch("getInBoundActivitiesDetailsAPI");
  useEffect(() => {
    apiCallFrontAndBackPage(
      inboundDetails,
      inboundRowsPerPage,
      inboundPageNumber,
      collegeId,
      prefetchInboundData,
      {
        dateRange:
          inboundDateRange?.length > 0
            ? JSON.parse(GetJsonDate(inboundDateRange))
            : null,
        counselorId: inboundCounselorId,
        applicationStatus: inboundApplicationStatus,
        callStatus: inboundCallStatus,
        search: sendSearchItemInbound,
      }
    );
  }, [
    inboundDetails,
    inboundPageNumber,
    prefetchInboundData,
    inboundRowsPerPage,
    payloadForInbound,
  ]);

  // use react hook for prefetch data
  const prefetchOutboundData = usePrefetch("getOutBoundActivitiesDetailsAPI");
  useEffect(() => {
    apiCallFrontAndBackPage(
      outboundDetails,
      outboundRowsPerPage,
      outboundPageNumber,
      collegeId,
      prefetchOutboundData,
      {
        dateRange:
          outboundDateRange?.length > 0
            ? JSON.parse(GetJsonDate(outboundDateRange))
            : null,
        counselorId: outboundCounselorId,
        applicationStatus: outboundApplicationStatus,
        callStatus: outboundCallStatus,
        search: sendSearchItemOutbound,
      }
    );
  }, [
    outboundDetails,
    outboundPageNumber,
    prefetchOutboundData,
    outboundRowsPerPage,
    payloadForOutbound,
  ]);

  useEffect(() => {
    try {
      if (isSuccessInbound) {
        if (Array.isArray(inboundDetails?.data)) {
          setLogsDataInbound(inboundDetails?.data);
          setInboundRowCount(inboundDetails?.total);
        } else {
          throw new Error("Inbound API response has changed");
        }
      }
      if (isErrorInbound) {
        if (errorInbound?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (errorInbound?.data?.detail) {
          pushNotification("error", errorInbound?.data?.detail);
        }
        if (errorInbound?.status === 500) {
          handleInternalServerError(setInboundTableInternalServerError, 10000);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrongInInboundTable, 10000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorInbound, isSuccessInbound, inboundDetails]);

  useEffect(() => {
    try {
      if (isSuccessOutbound) {
        if (Array.isArray(outboundDetails?.data)) {
          setLogsDataOutbound(outboundDetails?.data);
          setOutboundRowCount(outboundDetails?.total);
        } else {
          throw new Error("Outbound API response has changed");
        }
      }
      if (isErrorOutbound) {
        if (errorOutbound?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (errorOutbound?.data?.detail) {
          pushNotification("error", errorOutbound?.data?.detail);
        }
        if (errorOutbound?.status === 500) {
          handleInternalServerError(setOutboundTableInternalServerError, 10000);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrongOutboundTable, 10000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorOutbound, isSuccessOutbound, outboundDetails]);

  useEffect(() => {
    setLoadingCounsellorActivities(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/call_activities/counselor_wise_data/?page_num=${counsellorActivitiesPageNumber}&page_size=${counsellorActivitiesRowsPerPage}${
        collegeId ? "&college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(
        token,
        "POST",
        GetJsonDate(counsellorCallActivitiesDateRange)
      )
    )
      .then((res) => res.json())
      .then((result) => {
        setLoadingCounsellorActivities(false);
        if (result?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result?.detail) {
          result?.detail === "Not enough permissions" ||
            pushNotification("error", result?.detail);
        } else if (result) {
          try {
            if (Array.isArray(result?.data)) {
              setCounsellorActivities(result?.data);
              setCounsellorActivitiesCount(result?.total);

              //  Multiple loops are converted into a single loop to get less time complexity.

              let totalOutboundConnectedCalls = 0,
                totalOutboundCallDuration = 0,
                totalInboundCallDuration = 0,
                totalInboundMissedCalls = 0,
                totalInboundCallReceived = 0,
                totalInboundCallAttempt = 0;

              result?.data.forEach((call) => {
                totalOutboundConnectedCalls += parseFloat(
                  call.outbound_call.total_connected_calls
                );
                totalOutboundCallDuration += parseFloat(
                  call.outbound_call.total_call_duration
                );
                totalInboundCallDuration += parseFloat(
                  call.inbound_call.total_call_duration
                );
                totalInboundMissedCalls += parseInt(
                  call.inbound_call.total_missed_Call
                );
                totalInboundCallReceived += parseInt(
                  call.inbound_call.total_call_received
                );
                totalInboundCallAttempt += parseInt(
                  call.outbound_call.total_call_attempted
                );
              });
              setTotalCallAttemptedOutbound(totalInboundCallAttempt);
              setTotalCallReceivedInbound(totalInboundCallReceived);
              setTotalCallMissedInbound(totalInboundMissedCalls);
              setTotalCallDurationInbound(totalInboundCallDuration?.toFixed(2));
              setTotalCallDurationOutbound(
                totalOutboundCallDuration?.toFixed(2)
              );
              setTotalConnectedCallsOutbound(totalOutboundConnectedCalls);
            } else {
              throw new Error("Counsellor Activities API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongCounsellorActivities,
              "",
              5000
            );
          }
        }
      })
      .catch(() => {
        setLoadingCounsellorActivities(false);
        handleInternalServerError(
          setCounsellorActivitiesInternalServerError,
          "",
          5000
        );
      });
  }, [
    counsellorActivitiesPageNumber,
    counsellorActivitiesRowsPerPage,
    counsellorCallActivitiesDateRange,
  ]);
  useEffect(() => {
    customFetch(
      `${import.meta.env.VITE_API_BASE_URL}/call_activities/one_glance_view${
        collegeId ? "?college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(token, "GET")
    )
      .then((res) => res.json())
      .then((result) => {
        if (result?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result?.detail) {
          result?.detail === "Not enough permissions" ||
            pushNotification("error", result?.detail);
        } else if (result) {
          setShowAtAGlance(true);
          try {
            if (
              typeof result === "object" &&
              result !== null &&
              !Array.isArray(result)
            ) {
              setViewData(result);
            } else {
              throw new Error("Consumption Info API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInConsumptionInfo,
              "",
              5000
            );
          }
        }
      })
      .catch(() => {
        handleInternalServerError(
          setConsumptionInfoInternalServerError,
          "",
          5000
        );
      });
  }, []);

  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId: collegeId },
    {
      skip: skipCounselorApiCall,
    }
  );

  const { handleFilterListApiCall } = useCommonApiCalls();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCounselorApiCall, counselorListApiCallInfo]);

  const quickStats = [
    {
      outbound: [
        {
          toolTipInfoText: "count of total calls attempted by the counselor",
          title: "Total Dialed Calls",
          callsVAlue: viewData?.outbound_call_details?.total_call_attempt
            ? viewData?.outbound_call_details?.total_call_attempt
            : 0,
          icon: "dialed",
          backgroundColor: "#fef3f2",
        },
        {
          toolTipInfoText:
            "count of calls that were not picked up by the student",
          title: "Total Missed Calls",
          callsVAlue: viewData?.outbound_call_details?.total_missed_call
            ? viewData?.outbound_call_details?.total_missed_call
            : 0,
          icon: "missed",
          backgroundColor: "#fffaeb",
        },
        {
          toolTipInfoText: "Total TalkTime on Outbound Calls",
          title: "Total TalkTime",
          callsVAlue: secondsToHms(
            viewData?.outbound_call_details?.total_talk_time
              ? viewData?.outbound_call_details?.total_talk_time
              : 0
          ),
          icon: "talkTime",
          backgroundColor: "#f0fdf9",
        },
      ],
    },
    {
      inbound: [
        {
          toolTipInfoText:
            "Count of total calls landed on our system from the student",
          title: "Total Received Calls",
          callsVAlue: viewData?.inbound_call_details?.total_call_attempt
            ? viewData?.inbound_call_details?.total_call_attempt
            : 0,
          icon: "incoming",
          backgroundColor: "#fef3f2",
        },
        {
          toolTipInfoText:
            "Count of total calls dialed by students but not picked by the counselors",
          title: "Total Missed Calls",
          callsVAlue: viewData?.inbound_call_details?.total_missed_call
            ? viewData?.inbound_call_details?.total_missed_call
            : 0,
          icon: "missed",
          backgroundColor: "#fffaeb",
        },
        {
          toolTipInfoText: "Total TalkTime on Inbound Calls",
          title: "Total TalkTime",
          callsVAlue: secondsToHms(
            viewData?.inbound_call_details?.total_talk_time
              ? viewData?.inbound_call_details?.total_talk_time
              : 0
          ),
          icon: "talkTime",
          backgroundColor: "#f0fdf9",
        },
      ],
    },
  ];
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Admin dashboard Head Title add
  useEffect(() => {
    setHeadTitle("In-App Call Logs");
    document.title = "In-App Call Logs";
  }, [headTitle]);
  return (
    <Box
      component="main"
      className="in-app-call-logs in-app-call-logs-header-box-container"
      sx={{ pb: 2 }}
    >
      <Container maxWidth={false}>
        <Grid container>
          <Grid item md={12} sm={12} xs={12}>
            <Box sx={{ mt: 2, mb: 5 }} className="appCall_top">
              <Box className="appCalllog">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={() => navigate(-1)} aria-label="Example">
                    <ArrowBackIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            <Box>
              {showAtAGlance && (
                <Card sx={{ mb: 2, pb: 2 }} {...props}>
                  {consumptionInfoInternalServerError ||
                  somethingWentWrongInConsumptionInfo ? (
                    <Box
                      className="error-animation-box"
                      data-testid="error-animation-container"
                    >
                      {consumptionInfoInternalServerError && (
                        <Error500Animation
                          height={400}
                          width={400}
                        ></Error500Animation>
                      )}
                      {somethingWentWrongInConsumptionInfo && (
                        <ErrorFallback
                          error={apiResponseChangeMessage}
                          resetErrorBoundary={() => window.location.reload()}
                        />
                      )}
                    </Box>
                  ) : (
                    <>
                      {outboundStats && (
                        <Box
                          sx={{
                            px: 3,
                            py: 4,

                            backgroundColor: "#fefff4",
                          }}
                        >
                          <Grid
                            container
                            spacing={3}
                            sx={{ justifyContent: "center" }}
                          >
                            {quickStats[0]?.outbound?.map((stats, index) => (
                              <Grid item xs={12} md={6} lg={3} key={index}>
                                <QuickStatsCard
                                  toolTipInfoText={stats?.toolTipInfoText}
                                  title={stats?.title}
                                  callsVAlue={stats?.callsVAlue}
                                  icon={stats?.icon}
                                  backgroundColor={stats?.backgroundColor}
                                ></QuickStatsCard>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      )}

                      {inboundStats && (
                        <Box
                          sx={{
                            px: 3,
                            py: 4,
                            backgroundColor: "#f3f8fc",
                          }}
                        >
                          <Grid
                            container
                            spacing={3}
                            sx={{ justifyContent: "center" }}
                          >
                            {quickStats[1].inbound.map((stats, index) => (
                              <Grid item xs={12} md={6} lg={3} key={index}>
                                <QuickStatsCard
                                  toolTipInfoText={stats?.toolTipInfoText}
                                  title={stats?.title}
                                  callsVAlue={stats?.callsVAlue}
                                  icon={stats?.icon}
                                  backgroundColor={stats?.backgroundColor}
                                ></QuickStatsCard>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      )}
                      <Box className="consumption_main">
                        <Box
                          style={{
                            backgroundColor: `${
                              outboundStats ? "#607d8b" : "white"
                            }`,
                          }}
                          className="consumption_box callStatus_main"
                          onClick={() => {
                            setOutboundStats(true);
                            setInboundStats(false);
                          }}
                        >
                          <IconButton data-testid="communication-log-Email-button">
                            <CallMadeIcon fontSize="small" color="warning" />
                          </IconButton>
                          <Typography
                            variant="body2"
                            color={outboundStats ? "white" : "warning.main"}
                            sx={{ fontWeight: `${outboundStats && "bold"}` }}
                            className="e_consumption_txt"
                          >
                            Outbound Call Stats
                          </Typography>
                        </Box>
                        <Box
                          className="consumption_box callStatus_main"
                          style={{
                            backgroundColor: `${
                              inboundStats ? "#607d8b" : "white"
                            }`,
                          }}
                          onClick={() => {
                            setInboundStats(true);
                            setOutboundStats(false);
                          }}
                        >
                          <IconButton>
                            <CallReceivedIcon
                              fontSize="small"
                              color="primary"
                            />
                          </IconButton>
                          <Typography
                            variant="body2"
                            color={inboundStats ? "white" : "primary"}
                            className="e_consumption_txt"
                            sx={{ fontWeight: `${inboundStats && "bold"}` }}
                          >
                            Inbound Call Stats
                          </Typography>
                        </Box>
                      </Box>
                    </>
                  )}
                </Card>
              )}
              <Card {...props} sx={{ mb: 2, pb: 2 }}>
                <Tabs
                  value={tabValue}
                  onChange={(event, tabCurrentValue) => {
                    setTabValue(tabCurrentValue);
                    if (tabCurrentValue === 1) {
                      setSkipInboundApiCall(false);
                    }
                  }}
                  aria-label="basic tabs example"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Outbound Call Activities" {...a11yProps(0)} />
                  <Tab label="Inbound Call Activities" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                  <CallLogsTableShared
                    logsData={logsDataOutbound}
                    isFetching={isFetchingOutbound}
                    pageNumber={outboundPageNumber}
                    rowCount={outboundRowCount}
                    rowsPerPage={outboundRowsPerPage}
                    count={outboundCount}
                    localStoragePageName="OutboundLocalStoragePageNo"
                    setPageNumber={setOutboundPageNumber}
                    localStorageRowPerPageName="outboundTableRowPerPage"
                    setRowsPerPage={setOutboundRowsPerPage}
                    tableInternalServerError={outboundTableInternalServerError}
                    somethingWentWrongTable={somethingWentWrongInOutboundTable}
                    apiResponseChangeMessage={apiResponseChangeMessage}
                    dateRange={outboundDateRange}
                    setDateRange={setOutboundDateRange}
                    counselorId={outboundCounselorId}
                    setCounselorId={setOutboundCounselorId}
                    counsellorList={counsellorList}
                    applicationStatus={outboundApplicationStatus}
                    setApplicationStatus={setOutboundApplicationStatus}
                    callStatus={outboundCallStatus}
                    setCallStatus={setOutboundCallStatus}
                    setSendSearchItem={setSendSearchItemOutbound}
                    searchText={searchTextOutbound}
                    setSearchText={setSearchTextOutbound}
                    showResetButton={showResetButtonOutbound}
                    setShowResetButton={setShowResetButtonOutbound}
                    setCallSearchAPI={setCallSearchAPI}
                    refetch={reFetchOutboundAPI}
                    isSuccess={isSuccessOutbound}
                    loadingCounselorList={counselorListApiCallInfo.isFetching}
                    setSkipCounselorApiCall={setSkipCounselorApiCall}
                    setSkipCallActivitiesApiCall={setSkipOutboundApiCall}
                  ></CallLogsTableShared>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <CallLogsTableShared
                    logsData={logsDataInbound}
                    isFetching={isFetchingInbound}
                    pageNumber={inboundPageNumber}
                    rowCount={inboundRowCount}
                    rowsPerPage={inboundRowsPerPage}
                    count={inboundCount}
                    localStoragePageName="InboundLocalStoragePageNo"
                    setPageNumber={setInboundPageNumber}
                    localStorageRowPerPageName="inboundTableRowPerPage"
                    setRowsPerPage={setInboundRowsPerPage}
                    tableInternalServerError={inboundTableInternalServerError}
                    somethingWentWrongTable={somethingWentWrongInInboundTable}
                    apiResponseChangeMessage={apiResponseChangeMessage}
                    dateRange={inboundDateRange}
                    setDateRange={setInboundDateRange}
                    counselorId={inboundCounselorId}
                    setCounselorId={setInboundCounselorId}
                    counsellorList={counsellorList}
                    applicationStatus={inboundApplicationStatus}
                    setApplicationStatus={setInboundApplicationStatus}
                    callStatus={inboundCallStatus}
                    setCallStatus={setInboundCallStatus}
                    setSendSearchItem={setSendSearchItemInbound}
                    searchText={searchTextInbound}
                    setSearchText={setSearchTextInbound}
                    showResetButton={showResetButtonInbound}
                    setShowResetButton={setShowResetButtonInbound}
                    setCallSearchAPI={setCallSearchAPI}
                    refetch={reFetchInboundAPI}
                    isSuccess={isSuccessInbound}
                    loadingCounselorList={counselorListApiCallInfo.isFetching}
                    setSkipCounselorApiCall={setSkipCounselorApiCall}
                    hideCounsellorList={hideCounsellorList}
                    setSkipCallActivitiesApiCall={setSkipInboundApiCall}
                  ></CallLogsTableShared>
                </TabPanel>
              </Card>
              <Card {...props}>
                <CardHeader
                  titleTypographyProps={{ fontSize: "20px" }}
                  title="Counsellor Call Activities"
                  action={
                    <DateRange
                      dateRange={counsellorCallActivitiesDateRange}
                      setDateRange={setCounsellorCallActivitiesDateRange}
                      setPageNumber={setCounsellorActivitiesPageNumber}
                    />
                  }
                />
                {counsellorActivitiesInternalServerError ||
                somethingWentWrongCounsellorActivities ? (
                  <Box
                    className="error-animation-box"
                    data-testid="error-animation-container"
                  >
                    {counsellorActivitiesInternalServerError && (
                      <Error500Animation
                        height={400}
                        width={400}
                      ></Error500Animation>
                    )}
                    {somethingWentWrongCounsellorActivities && (
                      <ErrorFallback
                        error={apiResponseChangeMessage}
                        resetErrorBoundary={() => window.location.reload()}
                      />
                    )}
                  </Box>
                ) : (
                  <>
                    {loadingCounsellorActivities ? (
                      <TableBody
                        sx={{
                          width: "100%",
                          minHeight: "50vh",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        data-testid="loading-animation-container"
                      >
                        <LeefLottieAnimationLoader
                          height={120}
                          width={120}
                        ></LeefLottieAnimationLoader>
                      </TableBody>
                    ) : (
                      <>
                        {counsellorActivities.length > 0 ? (
                          <TableContainer
                            sx={{ px: 2 }}
                            className="custom-scrollbar"
                          >
                            <Table
                              sx={{
                                minWidth: 700,
                                border: "1px solid #e0e0e0",
                              }}
                              size="small"
                            >
                              <TableHead>
                                <TableRow sx={{ border: "1px solid #e0e0e0" }}>
                                  <TableCell
                                    sx={{ border: "1px solid #e0e0e0" }}
                                    rowSpan={2}
                                  >
                                    <Box sx={{ ml: 3 }}>Counsellor Name</Box>
                                  </TableCell>
                                  <TableCell
                                    sx={{ border: "1px solid #e0e0e0" }}
                                    colSpan={3}
                                    align="center"
                                  >
                                    Outbound Call
                                  </TableCell>
                                  <TableCell
                                    sx={{ border: "1px solid #e0e0e0" }}
                                    colSpan={3}
                                    align="center"
                                  >
                                    Inbound Call
                                  </TableCell>
                                </TableRow>
                                <TableRow sx={{ border: "1px solid #e0e0e0" }}>
                                  <TableCell
                                    sx={{ border: "1px solid #e0e0e0" }}
                                  >
                                    Total Call Attempted
                                  </TableCell>
                                  <TableCell
                                    sx={{ border: "1px solid #e0e0e0" }}
                                  >
                                    Total Connected Calls
                                  </TableCell>
                                  <TableCell
                                    sx={{ border: "1px solid #e0e0e0" }}
                                    align="center"
                                  >
                                    Total Call Duration <br />
                                    (in mins)
                                  </TableCell>
                                  <TableCell
                                    sx={{ border: "1px solid #e0e0e0" }}
                                    align="center"
                                  >
                                    Total Call Received
                                  </TableCell>
                                  <TableCell
                                    sx={{ border: "1px solid #e0e0e0" }}
                                    align="center"
                                  >
                                    Total Call Missed
                                  </TableCell>
                                  <TableCell
                                    sx={{ border: "1px solid #e0e0e0" }}
                                    align="center"
                                  >
                                    Total Call Duration
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {counsellorActivities.map(
                                  (activities, index) => (
                                    <TableRow key={index}>
                                      <TableCell
                                        sx={{
                                          textTransform: "capitalize",
                                          backgroundColor: "#aeaaaa",
                                          fontWeight: "400",
                                        }}
                                      >
                                        {activities?.counselor_name}
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        sx={{
                                          backgroundColor:
                                            index % 2 === 0 || "#d9d9d9",
                                        }}
                                      >
                                        {
                                          activities?.outbound_call
                                            ?.total_call_attempted
                                        }
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        sx={{
                                          backgroundColor:
                                            index % 2 === 0 || "#d9d9d9",
                                        }}
                                      >
                                        {
                                          activities?.outbound_call
                                            ?.total_connected_calls
                                        }
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        sx={{
                                          backgroundColor:
                                            index % 2 === 0 || "#d9d9d9",
                                        }}
                                      >
                                        {
                                          activities?.outbound_call
                                            ?.total_call_duration
                                        }
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        sx={{
                                          backgroundColor:
                                            index % 2 === 0 || "#d9d9d9",
                                        }}
                                      >
                                        {
                                          activities?.inbound_call
                                            ?.total_call_received
                                        }
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        sx={{
                                          backgroundColor:
                                            index % 2 === 0 || "#d9d9d9",
                                        }}
                                      >
                                        {
                                          activities?.inbound_call
                                            ?.total_missed_Call
                                        }
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        sx={{
                                          backgroundColor:
                                            index % 2 === 0 || "#d9d9d9",
                                        }}
                                      >
                                        {
                                          activities?.inbound_call
                                            ?.total_call_duration
                                        }
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                                <TableRow
                                  sx={{
                                    textTransform: "capitalize",
                                    backgroundColor: "#e5edf1",
                                    fontWeight: "400",
                                  }}
                                >
                                  <TableCell>Total</TableCell>
                                  <TableCell align="center">
                                    {totalCallAttemptedOutbound}
                                  </TableCell>
                                  <TableCell align="center">
                                    {totalConnectedCallsOutbound}
                                  </TableCell>
                                  <TableCell align="center">
                                    {totalCallDurationOutbound}
                                  </TableCell>
                                  <TableCell align="center">
                                    {totalCallReceivedInbound}
                                  </TableCell>
                                  <TableCell align="center">
                                    {totalCallMissedInbound}
                                  </TableCell>
                                  <TableCell align="center">
                                    {totalCallDurationInbound}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              minHeight: "55vh",
                              alignItems: "center",
                            }}
                            data-testid="not-found-animation-container"
                          >
                            <BaseNotFoundLottieLoader
                              height={250}
                              width={250}
                            ></BaseNotFoundLottieLoader>
                          </Box>
                        )}

                        {!loadingCounsellorActivities &&
                          counsellorActivities?.length > 0 && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Pagination
                                className="pagination-bar"
                                currentPage={counsellorActivitiesPageNumber}
                                totalCount={counsellorActivitiesRowCount}
                                pageSize={counsellorActivitiesRowsPerPage}
                                onPageChange={(page) =>
                                  handleChangePage(
                                    page,
                                    "CounsellorActivitiesLocalStoragePageNo",
                                    setCounsellorActivitiesPageNumber
                                  )
                                }
                                count={counsellorActivitiesCount}
                              />
                              <AutoCompletePagination
                                rowsPerPage={counsellorActivitiesRowsPerPage}
                                rowPerPageOptions={rowPerPageOptions}
                                setRowsPerPageOptions={setRowsPerPageOptions}
                                rowCount={counsellorActivitiesRowCount}
                                page={counsellorActivitiesPageNumber}
                                setPage={setCounsellorActivitiesPageNumber}
                                localStorageChangeRowPerPage={
                                  "CounsellorActivitiesTableRowPerPage"
                                }
                                localStorageChangePage={
                                  "CounsellorActivitiesLocalStoragePageNo"
                                }
                                setRowsPerPage={
                                  setCounsellorActivitiesRowsPerPage
                                }
                              ></AutoCompletePagination>
                            </Box>
                          )}
                      </>
                    )}
                  </>
                )}
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default InAppCallLogs;
