import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import "./../../../styles/report.css";
import {
  SelectPicker,
  DateRangePicker,
  DatePicker,
  Checkbox,
  Input,
} from "rsuite";
import {
  Button,
  Fab,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Box } from "@mui/system";
import Cookies from "js-cookie";
import {
  reportFormatOptions,
  reportPeriodOptions,
  reportTypeOptions,
} from "../../../constants/LeadStageList";
import ReportFilter from "./ReportFilter";
import FilterSelectPicker from "../../shared/filters/FilterSelectPicker";
import GetJsonDate from "../../../hooks/GetJsonDate";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeCookies } from "../../../Redux/Slices/authSlice";
import useToasterHook from "../../../hooks/useToasterHook";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { useContext } from "react";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { handleReportGenerate } from "../../../hooks/useReportGenerateApi";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  useGenerateReportMutation,
  useGetCurrentUserReportsQuery,
} from "../../../Redux/Slices/applicationDataApiSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReportDetailsDialog from "./ReportDetailsDialog";
import { useMemo } from "react";
import ReportTemplates from "./ReportTemplates";
const Report = () => {
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const tokenState = useSelector((state) => state.authentication.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (tokenState.detail) {
    dispatch(removeCookies());
    navigate("/page401");
  }
  const pushNotification = useToasterHook();

  const [openDetailsDialog, setOpenReportDialog] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reportName, setReportName] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [viewReportDetails, setViewReportDetails] = useState({});
  const [reportPeriod, setReportPeriod] = useState();
  const [reportFormat, setReportFormat] = useState();
  const [dailyDate, setDailyDate] = useState();
  const [startAndEndDate, setStartAndEndDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  // const [userEmail, setUserEmail] = useState("");
  const [
    internalServerErrorInReportFilter,
    setInternalServerErrorInReportFilter,
  ] = useState(false);
  const [
    somethingWentWrongInReportFilter,
    setSomethingWentWrongInReportFilter,
  ] = useState(false);

  const [recentReportInternalServerError, setRecentReportInternalServerError] =
    useState(false);
  const [
    somethingWentWrongInRecentReport,
    setSomethingWentWrongInRecentReport,
  ] = useState(false);
  const [hideRecentReport, setHideRecentReport] = useState(false);
  const [
    somethingWentWrongInGenerateReport,
    setSomethingWentWrongInGenerateReport,
  ] = useState(false);
  const [
    generateReportInternalServerError,
    setGenerateReportInternalServerError,
  ] = useState(false);

  const [selectedVerificationStatus, setSelectedVerificationStatus] =
    useState("");
  const [selectedState, setSelectedState] = useState([]);
  const [selectedSource, setSelectedSource] = useState([]);
  const [selectedLeadType, setSelectedLeadType] = useState("");
  const [selectedLeadStage, setSelectedLeadStage] = useState([]);
  const [selectedLeadStageLabel, setSelectedLeadStageLabel] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState([]);
  const [selectedApplicationStage, setSelectedApplicationStage] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState([]);
  const [selectedFormStage, setSelectedFormStage] = useState([]);
  const [emailToChecked, setEmailToChecked] = useState(false);

  const [scheduleReportChecked, setScheduleReportChecked] = useState(false);
  const [reportScheduleType, setReportScheduleType] = useState("");

  // const [collegeId, setCollegeId] = useState("");
  const [dateRange, setDateRange] = useState([]);

  const [pageNumber, setPageNumber] = useState(1);
  const [rowPerPage] = useState(5);
  const [totalReportCount, setTotalReportCount] = useState(0);
  const [reportsOfCurrentUser, setReportsOfCurrentUser] = useState([]);
  const [reportFormatWarning, setReportFormatWarning] = useState(true);
  const [customDateWarning, setCustomDateWarning] = useState(true);
  const [dailyDateWarning, setDailyDateWarning] = useState(true);
  const [generateReportLoading, setGenerateReportLoading] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const userEmail = useSelector(
    (state) => state.authentication.userEmail?.userId
  );

  const [reportScheduleTypeWarning, setReportScheduleTypeWarning] =
    useState(true);

  const [clickedOnExpandLess, setClickedOnExpandLess] = useState(false);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const reportScheduleTypeOptions = [
    {
      label: "Day",
      value: "Day",
    },
    {
      label: "Hour",
      value: "Hour",
    },
    {
      label: "Week",
      value: "Week",
    },
    {
      label: "Month",
      value: "Month",
    },
  ];

  // const permissions = useSelector((state) => state.authentication.permissions);

  const selectedFilters = useMemo(() => {
    return {
      internalServerErrorInReportFilter,
      setInternalServerErrorInReportFilter,
      somethingWentWrongInReportFilter,
      setSomethingWentWrongInReportFilter,
      selectedVerificationStatus,
      setSelectedVerificationStatus,
      selectedState,
      setSelectedState,
      selectedSource,
      setSelectedSource,
      selectedLeadType,
      setSelectedLeadType,
      selectedLeadStage,
      setSelectedLeadStage,
      selectedLeadStageLabel,
      setSelectedLeadStageLabel,
      selectedCounselor,
      setSelectedCounselor,
      selectedApplicationStage,
      setSelectedApplicationStage,
      selectedPaymentStatus,
      setSelectedPaymentStatus,
      selectedFormStage,
      setSelectedFormStage,
    };
  }, [
    internalServerErrorInReportFilter,
    setInternalServerErrorInReportFilter,
    somethingWentWrongInReportFilter,
    setSomethingWentWrongInReportFilter,
    selectedVerificationStatus,
    setSelectedVerificationStatus,
    selectedState,
    setSelectedState,
    selectedSource,
    setSelectedSource,
    selectedLeadType,
    setSelectedLeadType,
    selectedLeadStage,
    setSelectedLeadStage,
    selectedLeadStageLabel,
    setSelectedLeadStageLabel,
    selectedCounselor,
    setSelectedCounselor,
    selectedApplicationStage,
    setSelectedApplicationStage,
    selectedPaymentStatus,
    setSelectedPaymentStatus,
    selectedFormStage,
    setSelectedFormStage,
  ]);

  const handleReportPeriod = (value) => {
    setDailyDate();
    setStartAndEndDate("");
    setReportPeriod(value);
    setSelectedDate("");
    setDateRange("");
    let today = new Date();
    if (value?.toLowerCase() === "yesterday") {
      const yesterday = new Date(new Date().setDate(today.getDate() - 1));
      setSelectedDate(yesterday.toDateString());
      setDateRange([yesterday, yesterday]);
    } else if (value?.toLowerCase() === "today") {
      setSelectedDate(today.toDateString());
      setDateRange([today, today]);
    } else if (value?.toLowerCase() === "last 7 days") {
      const startDate = new Date(new Date().setDate(today.getDate() - 6));
      const endDate = new Date(new Date().setDate(today.getDate()));
      setSelectedDate(
        `${startDate.toDateString()} to ${endDate.toDateString()}`
      );
      setDateRange([startDate, endDate]);
    } else if (value?.toLowerCase() === "last month") {
      const now = new Date();
      const prevMonthLastDate = new Date(now.getFullYear(), now.getMonth(), 0);
      const prevMonthFirstDate = new Date(
        now.getFullYear() - (now.getMonth() > 0 ? 0 : 1),
        (now.getMonth() - 1 + 12) % 12,
        1
      );
      setDateRange([prevMonthFirstDate, prevMonthLastDate]);
      setSelectedDate(
        `${prevMonthFirstDate.toDateString()} to ${prevMonthLastDate.toDateString()}`
      );
    }
  };

  const payloadForReportGeneration = {
    request_data: {
      report_name: reportName,
      report_details: reportDetails,
      date_range: JSON.parse(GetJsonDate(dateRange)),
      report_type: reportType,
      format: reportFormat,
      schedule_type: reportScheduleType,
      reschedule_report: scheduleReportChecked,
    },
    payload: {
      state_code: selectedState,
      city_name: [],
      source_name: selectedSource,
      lead_name: selectedLeadStage?.length
        ? [{ name: selectedLeadStage, label: selectedLeadStageLabel }]
        : [],
      lead_type_name: selectedLeadType,
      counselor_id: selectedCounselor,
      application_stage_name: selectedApplicationStage,
      is_verify: selectedVerificationStatus,
      payment_status: selectedPaymentStatus,
      application_filling_stage: selectedFormStage,
    },
  };
  if (emailToChecked) {
    payloadForReportGeneration.request_data.report_send_to = userEmail;
  }
  const callReportGenerationApi = (
    collegeId,
    payloadForReportGeneration,
    generateReport
  ) => {
    handleReportGenerate(
      generateReport,
      collegeId,
      token,
      payloadForReportGeneration,
      pushNotification,
      setApiResponseChangeMessage,
      setSomethingWentWrongInGenerateReport,
      setGenerateReportInternalServerError,
      resetAllReportGenerateFields,
      setGenerateReportLoading
    );
  };

  const handleGenerateReportRequest = (e) => {
    e.preventDefault();

    if (
      (scheduleReportChecked
        ? !reportScheduleTypeWarning
        : reportScheduleTypeWarning) &&
      !reportFormatWarning &&
      reportPeriod !== "Daily" &&
      reportPeriod !== "Custom"
    ) {
      callReportGenerationApi(
        collegeId,
        payloadForReportGeneration,
        generateReport
      );
    } else if (
      (scheduleReportChecked
        ? !reportScheduleTypeWarning
        : reportScheduleTypeWarning) &&
      !reportFormatWarning &&
      ((reportPeriod === "Daily" && !dailyDateWarning) ||
        (reportPeriod === "Custom" && !customDateWarning))
    ) {
      callReportGenerationApi(
        collegeId,
        payloadForReportGeneration,
        generateReport
      );
    }
  };

  const [generateReport] = useGenerateReportMutation();

  const handleRegenerateReport = (report) => {
    const payloadForReportRegeneration = {
      request_data: {
        report_name: report.report_name ? report.report_name : "N/A",
        report_details: report.report_details ? report.report_details : "N/A",
        date_range: JSON.parse(
          GetJsonDate([
            new Date(report?.statement?.split("to")[0]),
            report.status.toLowerCase() === "failed"
              ? new Date(report?.statement?.split("to")[1])
              : new Date(),
          ])
        ),
        report_type: report?.report_type,
        format: report?.format,
        schedule_type: report?.schedule_type,
        reschedule_report: report?.reschedule_report,
      },
      payload: {
        state_code: report?.payload?.state_code,
        city_name: report?.payload?.city_name,
        source_name: report?.payload?.source_name,
        lead_name: report?.payload?.lead_name,
        lead_type_name: report?.payload?.lead_type_name,
        counselor_id: report?.payload?.counselor_id,
        application_stage_name: report?.payload?.application_stage_name,
        is_verify: report?.payload?.is_verify,
        payment_status: report?.payload?.payment_status,
        application_filling_stage: report?.payload?.application_filling_stage,
      },
    };
    callReportGenerationApi(
      collegeId,
      payloadForReportRegeneration,
      generateReport
    );
  };

  const {
    data: reportData,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetCurrentUserReportsQuery({
    pageNumber: pageNumber,
    rowPerPage: rowPerPage,
    collegeId: collegeId,
  });

  useEffect(() => {
    try {
      if (!isFetching) {
        if (Array.isArray(reportData?.data)) {
          if (clickedOnExpandLess || pageNumber === 1) {
            setReportsOfCurrentUser(reportData?.data);
          } else {
            setReportsOfCurrentUser((prevData) => [
              ...prevData,
              ...reportData?.data,
            ]);
          }
          setTotalReportCount(reportData?.total);
        } else {
          throw new Error("current user reports API response has changed");
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
            setRecentReportInternalServerError,
            setHideRecentReport,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInRecentReport,
        setHideRecentReport,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    error,
    isError,
    isSuccess,
    navigate,
    setApiResponseChangeMessage,
    reportData,
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPageNumber(1);
    }, 300000);
    return () => clearInterval(timer);
  }, []);

  const resetSelectedFilters = () => {
    setSelectedState([]);
    setSelectedSource([]);
    setSelectedLeadStage([]);
    setSelectedLeadStageLabel([]);
    setSelectedLeadType("");
    setSelectedApplicationStage("");
    setSelectedCounselor([]);
    setSelectedVerificationStatus("");
    setSelectedPaymentStatus([]);
    setScheduleReportChecked(false);
    setReportScheduleType("");
    setSelectedFormStage([]);
  };
  const resetAllReportGenerateFields = () => {
    resetSelectedFilters();
    setDateRange([]);
    setReportType("");
    setReportPeriod("");
    setReportFormat("");
    setEmailToChecked(false);
    setDailyDate();
    setCustomDateWarning(true);
    setDailyDateWarning(true);
    setReportFormatWarning(true);
    setReportScheduleTypeWarning(true);
    setSelectedDate("");
    setStartAndEndDate("");
    setReportName("");
    setReportDetails("");
  };

  const headingLists = [
    "Requested id",
    "Type",
    "Format",
    "Requested on",
    "View details",
  ];

  return (
    <Box>
      <Box className="reportContainer">
        {somethingWentWrongInGenerateReport ||
        generateReportInternalServerError ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              minHeight: "55vh",
              alignItems: "center",
            }}
            data-testid="error-animation-container"
          >
            {generateReportInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {somethingWentWrongInGenerateReport && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </Box>
        ) : (
          <Box>
            {generateReportLoading ? (
              <Box className="loading-lottie-file-container">
                <LeefLottieAnimationLoader
                  height={100}
                  width={100}
                ></LeefLottieAnimationLoader>
              </Box>
            ) : (
              <form onSubmit={(e) => handleGenerateReportRequest(e)}>
                <Typography sx={{ mb: 2 }} variant="body2">
                  You can generate new reports or download from the list of
                  recently generated reports
                </Typography>
                <Box sx={{ backgroundColor: "#fcf8e3", my: 1, p: 2 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    <Box sx={{ m: 1 }}>
                      <Typography variant="subtitle1">
                        Select Report Type
                      </Typography>
                      <FilterSelectPicker
                        setSelectedPicker={setReportType}
                        pickerData={reportTypeOptions}
                        placeholder="Select report type"
                        pickerValue={reportType}
                        resetSelectedFilters={resetSelectedFilters}
                        style={{ width: "250px", marginTop: "10px" }}
                      />
                    </Box>
                    {reportType && (
                      <Box sx={{ m: 1 }}>
                        <Typography variant="subtitle1">Report Name</Typography>
                        <Input
                          required
                          style={{ marginTop: "10px", minWidth: "240px" }}
                          placeholder="Report name"
                          value={reportName}
                          onChange={(value) => setReportName(value)}
                        />
                      </Box>
                    )}
                  </Box>
                  {reportType && (
                    <Box sx={{ m: 1 }}>
                      <Typography variant="subtitle1">
                        Report Description
                      </Typography>
                      <Input
                        style={{ marginTop: "10px" }}
                        as="textarea"
                        placeholder="Report description"
                        rows={4}
                        cols={50}
                        value={reportDetails}
                        onChange={(value) => setReportDetails(value)}
                      />
                    </Box>
                  )}
                </Box>
                <Box
                  sx={{
                    pointerEvents: `${reportType ? "auto" : "none"}`,
                    opacity: `${reportType ? "1" : "0.4"} `,
                  }}
                >
                  {reportType && (
                    <Box>
                      <Typography variant="subtitle1">
                        Select Filters
                      </Typography>
                      <ReportFilter
                        reportType={reportType}
                        selectedFilters={selectedFilters}
                      />
                    </Box>
                  )}
                  <Grid container spacing={3}>
                    <Grid sx={{ mb: 3 }} item md={4} sm={12} xs={12}>
                      <Typography variant="subtitle1">Select Period</Typography>
                      <SelectPicker
                        data={reportPeriodOptions}
                        placeholder="Select report period"
                        onChange={(value) => handleReportPeriod(value)}
                        value={reportPeriod}
                        style={{ width: "250px" }}
                      />
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body">{selectedDate}</Typography>
                      </Box>
                    </Grid>
                    {reportPeriod === "Daily" && (
                      <Grid sx={{ mb: 3 }} item md={4} sm={12} xs={12}>
                        <Typography variant="subtitle1">Select Date</Typography>
                        <DatePicker
                          style={{ width: "250px" }}
                          placeholder="Select date"
                          value={dailyDate}
                          onChange={(value) => {
                            setDailyDate(value);
                            setDateRange([new Date(value), new Date(value)]);
                            if (!value) {
                              setDailyDateWarning(true);
                            } else {
                              setDailyDateWarning(false);
                            }
                          }}
                        />
                        {dailyDateWarning && (
                          <FormHelperText
                            sx={{ mt: 1, color: "#ffa117" }}
                            variant="subtitle1"
                          >
                            Please select date
                          </FormHelperText>
                        )}
                      </Grid>
                    )}
                    {reportPeriod === "Custom" && (
                      <Grid sx={{ mb: 3 }} item md={4} sm={12} xs={12}>
                        <Typography variant="subtitle1">
                          Select Date Range
                        </Typography>
                        <DateRangePicker
                          style={{ width: "250px" }}
                          placeholder="Select custom date range"
                          value={
                            startAndEndDate?.length ? startAndEndDate : null
                          }
                          onChange={(value) => {
                            setStartAndEndDate(value);
                            setDateRange(value);
                            if (!value) {
                              setCustomDateWarning(true);
                            } else {
                              setCustomDateWarning(false);
                            }
                          }}
                        />
                        {customDateWarning && (
                          <FormHelperText
                            sx={{ mt: 1, color: "#ffa117" }}
                            variant="subtitle1"
                          >
                            Please select date
                          </FormHelperText>
                        )}
                      </Grid>
                    )}
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid sx={{ mb: 3 }} item md={3} sm={12} xs={12}>
                      <Typography variant="subtitle1">Select Format</Typography>
                      <SelectPicker
                        data={reportFormatOptions}
                        placeholder="Select report format"
                        onChange={(value) => {
                          setReportFormat(value);
                          if (!value) {
                            setReportFormatWarning(true);
                          } else {
                            setReportFormatWarning(false);
                          }
                        }}
                        value={reportFormat}
                        style={{ width: "250px" }}
                      />
                      {reportFormatWarning && (
                        <FormHelperText
                          sx={{ mt: 1, color: "#ffa117" }}
                          variant="h6"
                        >
                          Please select report type
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid sx={{ mb: 3 }} item md={3} sm={12} xs={12}>
                      <Typography variant="h6">Email Report To</Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={emailToChecked}
                            onChange={() => {
                              setEmailToChecked((prev) => !prev);
                            }}
                          />
                        }
                        label={userEmail}
                      />
                    </Grid>

                    {/* {permissions?.menus?.report_and_analytics?.reports?.features
                      ?.report_scheduling && ( */}
                    <Grid sx={{ mb: 3 }} item md={3} sm={12} xs={12}>
                      <Typography variant="h6">Scheduling Report</Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={scheduleReportChecked}
                            onChange={() => {
                              setScheduleReportChecked((prev) => !prev);
                              setReportScheduleType("");
                            }}
                          />
                        }
                        label="Schedule"
                      />
                    </Grid>
                    {/* )} */}
                    {scheduleReportChecked && (
                      <Grid sx={{ mb: 3 }} item md={3} sm={12} xs={12}>
                        <Typography variant="h6">
                          Report Schedule Type
                        </Typography>

                        <SelectPicker
                          data={reportScheduleTypeOptions}
                          placeholder="Select report schedule type"
                          onChange={(value) => {
                            setReportScheduleType(value);
                            if (!value) {
                              setReportScheduleTypeWarning(true);
                            } else {
                              setReportScheduleTypeWarning(false);
                            }
                          }}
                          value={reportScheduleType}
                        />
                        {reportScheduleTypeWarning && (
                          <FormHelperText
                            sx={{ mt: 1, color: "#ffa117" }}
                            variant="h6"
                          >
                            Please select report schedule type
                          </FormHelperText>
                        )}
                      </Grid>
                    )}
                  </Grid>
                  <Button type="submit" variant="contained">
                    Generate Report
                  </Button>
                </Box>
              </form>
            )}
          </Box>
        )}

        <Box sx={{ mt: 4 }}>
          <Box>
            <Typography variant="h6">RECENT REPORT</Typography>
          </Box>

          {recentReportInternalServerError ||
          somethingWentWrongInRecentReport ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                minHeight: "55vh",
                alignItems: "center",
              }}
            >
              {recentReportInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrongInRecentReport && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </Box>
          ) : (
            <Box sx={{ visibility: hideRecentReport ? "hidden" : "visible" }}>
              <>
                {isFetching ? (
                  <Box className="loading-lottie-file-container">
                    <LeefLottieAnimationLoader
                      height={100}
                      width={100}
                    ></LeefLottieAnimationLoader>
                  </Box>
                ) : reportsOfCurrentUser?.length > 0 ? (
                  <>
                    {reportsOfCurrentUser.map((report) => (
                      <Box
                        key={report?.report_id}
                        sx={{
                          backgroundColor: "#f8f8f8",
                          mt: 1,
                          mb: 2,
                          borderRadius: 1,
                        }}
                      >
                        <Box className="report-header">
                          <Box>
                            <Typography variant="subtitle1">
                              {report.report_name ? report.report_name : "N/A"}
                            </Typography>
                            <FormHelperText>
                              Date Range : {report?.statement}
                            </FormHelperText>
                          </Box>
                          <Box>
                            {report?.payload && (
                              <Tooltip
                                placement="top"
                                arrow
                                title={
                                  report?.status?.toLowerCase() === "failed"
                                    ? "Try again"
                                    : "Regenerate"
                                }
                              >
                                <IconButton
                                  className="report-icon-button"
                                  onClick={() => handleRegenerateReport(report)}
                                >
                                  <ReplayIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip placement="top" arrow title="Download">
                              <IconButton
                                className="report-icon-button"
                                onClick={() => {
                                  window.open(report?.download_url);
                                }}
                                disabled={report?.download_url ? false : true}
                              >
                                <FileDownloadOutlinedIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        <TableContainer
                          sx={{ whiteSpace: "nowrap" }}
                          className="custom-scrollbar"
                        >
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Statements</TableCell>
                                {headingLists.map((item) => (
                                  <TableCell align="center">{item}</TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>{report?.statement}</TableCell>
                                <TableCell align="center">
                                  {report?.request_id}
                                </TableCell>
                                <TableCell align="center">
                                  {report?.report_type}
                                </TableCell>
                                <TableCell align="center">
                                  {report?.format}
                                </TableCell>
                                <TableCell align="center">
                                  {report?.requested_on}
                                </TableCell>
                                <TableCell align="center">
                                  <Tooltip
                                    arrow
                                    placement="left"
                                    title="Click to see details"
                                  >
                                    <IconButton
                                      className="report-icon-button"
                                      onClick={() => {
                                        setViewReportDetails(report);
                                        setOpenReportDialog(true);
                                      }}
                                    >
                                      <VisibilityIcon />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>

                        {report?.status === "Done" && (
                          <Box
                            sx={{
                              px: 2,
                              py: 1,
                              backgroundColor: "#d1f9d7",
                              borderRadius: 1,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box sx={{ mr: 1, pt: 1 }}>
                                <DoneIcon />
                              </Box>
                              <Typography variant="body2">
                                Report has been successfully generated.
                              </Typography>
                            </Box>
                          </Box>
                        )}

                        {report?.status === "Failed" && (
                          <Box
                            sx={{
                              px: 2,
                              py: 1,
                              backgroundColor: "#f9d1d1",
                              borderRadius: 1,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box sx={{ mr: 1, pt: 1 }}>
                                <ErrorOutlineIcon />
                              </Box>
                              <Typography variant="body2">
                                Report generation failed.
                              </Typography>
                            </Box>
                          </Box>
                        )}

                        {report?.status === "In progress" && (
                          <Box
                            sx={{
                              px: 2,
                              py: 1,
                              backgroundColor: "#ebf0f8",
                              borderRadius: 1,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box sx={{ mr: 1, pt: 1 }}>
                                <RotateLeftIcon />
                              </Box>
                              <Typography variant="body2">
                                Report generation in progress.
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    ))}
                    {totalReportCount !== reportsOfCurrentUser?.length ? (
                      <Box sx={{ textAlign: "center" }}>
                        <Button
                          onClick={() => {
                            setPageNumber((prev) => prev + 1);
                            setClickedOnExpandLess(false);
                          }}
                        >
                          Load More
                        </Button>
                      </Box>
                    ) : (
                      <Box>
                        <FormHelperText
                          sx={{ my: 1, color: "#ffa117", textAlign: "center" }}
                          variant="h6"
                        >
                          Nothing to load more
                        </FormHelperText>
                      </Box>
                    )}
                    {reportsOfCurrentUser?.length > 5 && (
                      <Box sx={{ textAlign: "center" }}>
                        <Fab
                          size="small"
                          sx={{
                            zIndex: "0",
                            mx: "5px",
                            backgroundColor: "#f8f8f8",
                          }}
                          onClick={() => {
                            setPageNumber(1);
                            setClickedOnExpandLess(true);
                          }}
                        >
                          <ExpandLessIcon sx={{ fontSize: "30px" }} />
                        </Fab>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      minHeight: "35vh",
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
              </>
            </Box>
          )}
        </Box>
        <ReportDetailsDialog
          open={openDetailsDialog}
          setOpen={setOpenReportDialog}
          details={viewReportDetails}
        />
      </Box>
    </Box>
  );
};

export default Report;
