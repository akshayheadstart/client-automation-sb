import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Card,
  Box,
  Typography,
  Backdrop,
  CircularProgress,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  CardHeader,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { DateRangePicker, CheckPicker } from "rsuite";
import { PostAddOutlined, FilterAlt } from "@mui/icons-material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Cookies from "js-cookie";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import GetJsonDate from "../../../hooks/GetJsonDate";
import "../../../styles/CounsellorProductivity.css";
import { TopContext } from "../../../store/contexts/TopContext";
import CounsellorProductivityTableRow from "./CounsellorProductivityTableRow";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { counselorProductivityTableAddColumn } from "../../../constants/LeadStageList";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import useToasterHook from "../../../hooks/useToasterHook";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import { startAndEndDateSelect } from "../../../utils/adminDashboardDateRangeSelect";
import { handleChangePage } from "../../../helperFunctions/pagination";
import Pagination from "../../shared/Pagination/Pagination";
import { useSelector } from "react-redux";
import { customFetch } from "../../../pages/StudentTotalQueries/helperFunction";

const CounsellorProductivity = ({
  loadInAdminDashboard,
  isScrolledCounsellorProductivityReport,
  isCounsellorProductivityReportLoading,
  setIsCounsellorProductivityReportLoading,
  selectedSeason,
}) => {
  const [productivityData, setProductivityData] = useState([]);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showFilterOption, setShowFilterOption] = useState(false);
  const [addColumnOptions, setAddColumnOptions] = useState([]);
  const [shouldCallApi, setShouldCallApi] = useState(false);

  const [checkOverallActivities, setCheckOverallActivities] = useState(false);
  const [checkLeadEngagedOverall, setCheckLeadEngagedOverall] = useState(false);
  const [checkLeadNotEngaged, setCheckLeadNotEngaged] = useState(false);
  const [checkLeadEngagedPercentage, setCheckLeadEngagedPercentage] =
    useState(false);
  const [checkUntouchedStage, setCheckUntouchedStage] = useState(false);
  const [checkEmailSent, setCheckEmailSent] = useState(false);

  //getting data form context
  const {
    counsellorProductivityDateRange,
    setCounsellorProductivityDateRange,
  } = useContext(TopContext);

  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  //calculate total of counsellor productivty report
  let totalLeadAssigned = useMemo(
    () =>
      productivityData?.reduce((accum, item) => accum + item.lead_assigned, 0),
    [productivityData]
  );

  let totalPaymentApproved = useMemo(
    () =>
      productivityData?.reduce(
        (accum, item) => accum + item.payment_approved,
        0
      ),
    [productivityData]
  );

  let totalApplicationSubmited = useMemo(
    () =>
      productivityData?.reduce(
        (accum, item) => accum + item.application_submitted,
        0
      ),
    [productivityData]
  );

  let totalQueries = useMemo(
    () => productivityData?.reduce((accum, item) => accum + item.queries, 0),
    [productivityData]
  );

  let totalOverallActivities = useMemo(
    () =>
      productivityData?.reduce(
        (accum, item) => accum + item?.overall_activities,
        0
      ),
    [productivityData]
  );

  let totalLeadEngagedOverall = useMemo(
    () =>
      productivityData?.reduce(
        (accum, item) => accum + item?.lead_engaged_overall,
        0
      ),
    [productivityData]
  );

  let totalLeadsNotEngaged = useMemo(
    () =>
      productivityData?.reduce(
        (accum, item) => accum + item?.leads_not_engaged,
        0
      ),
    [productivityData]
  );

  let totalPercentageOfLeadsEngagement = useMemo(
    () =>
      productivityData?.reduce(
        (accum, item) =>
          accum + parseFloat(item?.percentage_of_leads_engagement),
        0
      ),
    [productivityData]
  );

  let totalUntouchedStage = useMemo(
    () =>
      productivityData?.reduce(
        (accum, item) => accum + item?.untouched_stage,
        0
      ),
    [productivityData]
  );

  let totalEmailSent = useMemo(
    () =>
      productivityData?.reduce((accum, item) => accum + item?.email_sent, 0),
    [productivityData]
  );

  //date range state
  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");

  //backdrop state
  const [openBackDrop, setOpenBackDrop] = useState(false);

  //counsellor chart internal server error and hide states
  const [
    counsellorProductivityInternalServerError,
    setCounsellorProductivityInternalServerError,
  ] = useState(false);
  const [hideCounsellorProductivity, setHideCounsellorProductivity] =
    useState(false);
  const [
    counsellorProductivityReportDownloadInternalServerError,
    setCounsellorProductivityReportDownloadInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInCounsellorProductivity,
    setSomethingWentWrongInCounsellorProductivity,
  ] = useState(false);
  const [
    somethingWentWrongInProductivityReportDownload,
    setSomethingWentWrongInProductivityReportDownload,
  ] = useState(false);

  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const pushNotification = useToasterHook();
  // states for pagination
  const applicationPageNo = localStorage.getItem(
    `${Cookies.get("userId")}allCounselorPageNo`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}allCounselorPageNo`)
      )
    : 1;

  const tableRowPerPage = localStorage.getItem(
    `${Cookies.get("userId")}allCounselorRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}allCounselorRowPerPage`)
      )
    : 25;

  const [page, setPage] = useState(applicationPageNo);
  const [rowsPerPage, setRowsPerPage] = useState(tableRowPerPage);
  const [pageNumber, setPageNumber] = useState(applicationPageNo);
  const [pageSize, setPageSize] = useState(tableRowPerPage);
  const [rowCount, setRowCount] = useState();
  const [totalCounselorCount, setTotalCounselorCount] = useState(0);
  const count = Math.ceil(rowCount / rowsPerPage);

  const handleChangeRowsPerPage = (event) => {
    const checkPageAvailability = Math.ceil(
      rowCount / parseInt(event.target.value)
    );

    if (page < checkPageAvailability) {
      setRowsPerPage(parseInt(event.target.value));
      setPageSize(parseInt(event.target.value));

      localStorage.setItem(
        `${Cookies.get("userId")}allCounselorRowPerPage`,
        parseInt(event.target.value)
      );
    } else {
      setPageNumber(checkPageAvailability);
      setPage(checkPageAvailability);
      localStorage.setItem(
        `${Cookies.get("userId")}allCounselorPageNo`,
        checkPageAvailability
      );

      setRowsPerPage(parseInt(event.target.value));
      setPageSize(parseInt(event.target.value));

      localStorage.setItem(
        `${Cookies.get("userId")}allCounselorRowPerPage`,
        parseInt(event.target.value)
      );
    }
  };

  //onemonth before date
  let now = new Date();
  const oneMonthBeforeDate = new Date(now.setDate(now.getDate() - 30));

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const gettingCounselorProductivityData = () => {
    if (shouldCallApi) {
      let payload;

      if (counsellorProductivityDateRange?.length >= 1) {
        payload = GetJsonDate(counsellorProductivityDateRange);
      } else if (selectedSeason?.length) {
        payload = selectedSeason;
      } else {
        payload = GetJsonDate([oneMonthBeforeDate, new Date()]);
      }
      setIsCounsellorProductivityReportLoading(true);
      customFetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/counselor/counselor_productivity_report/?${
          addColumnOptions.length
            ? "column_names=" + addColumnOptions.join("&column_names=")
            : ""
        }&page_num=${pageNumber}&page_size=${pageSize}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,

        ApiCallHeaderAndBody(token, "POST", payload)
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data?.message) {
            try {
              if (Array.isArray(data?.data)) {
                setProductivityData(data?.data);
                setRowCount(data?.total);
                setTotalCounselorCount(data.total);
              } else {
                throw new Error(
                  "counselor_productivity_report API response has changed"
                );
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInCounsellorProductivity,
                setHideCounsellorProductivity,
                10000
              );
            }
          } else if (data?.detail) {
            pushNotification("error", data?.detail);
          }
        })
        .catch((err) => {
          handleInternalServerError(
            setCounsellorProductivityInternalServerError,
            setHideCounsellorProductivity,
            10000
          );
        })
        .finally(() => {
          setIsCounsellorProductivityReportLoading(false);
        });
    }
  };
  // get counsellor productivity data
  useEffect(() => {
    if (loadInAdminDashboard) {
      if (isScrolledCounsellorProductivityReport) {
        gettingCounselorProductivityData();
      }
    } else {
      gettingCounselorProductivityData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    counsellorProductivityDateRange,
    page,
    rowsPerPage,
    addColumnOptions,
    shouldCallApi,
    isScrolledCounsellorProductivityReport,
    selectedSeason,
  ]);

  //download counsellor productiviy
  const downloadCounsellorProductivity = () => {
    let payload;

    if (counsellorProductivityDateRange?.length >= 1) {
      payload = GetJsonDate(counsellorProductivityDateRange);
    } else if (selectedSeason?.length) {
      payload = selectedSeason;
    } else {
      payload = GetJsonDate([oneMonthBeforeDate, new Date()]);
    }

    setOpenBackDrop(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/counselor/download_counselors_productivity_report/${
        collegeId ? "?college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(token, "POST", payload)
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data?.message) {
          setOpenBackDrop(false);
          const expectedData = data?.file_url;
          try {
            if (typeof expectedData === "string") {
              window.open(data?.file_url);
            } else {
              throw new Error(
                "download_counselors_productivity_report API response has changed"
              );
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInProductivityReportDownload,
              "",
              5000
            );
          }
        } else if (data?.detail) {
          setOpenBackDrop(false);
          pushNotification("error", data?.detail);
        }
      })
      .catch((err) => {
        handleInternalServerError(
          setCounsellorProductivityReportDownloadInternalServerError,
          "",
          5000
        );
      })
      .finally(() => setOpenBackDrop(false));
  };

  useEffect(() => {
    if (counsellorProductivityDateRange?.length > 1) {
      const startDate = new Date(counsellorProductivityDateRange[0]);
      const endDate = new Date(counsellorProductivityDateRange[1]);
      setStartDateRange(startDate.toDateString());
      setEndDateRange(endDate.toDateString());
    } else if (selectedSeason?.length) {
      startAndEndDateSelect(
        selectedSeason,
        setStartDateRange,
        setEndDateRange,
        28
      );
    } else {
      setStartDateRange(oneMonthBeforeDate.toDateString());
      setEndDateRange(new Date().toDateString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counsellorProductivityDateRange, selectedSeason]);

  const handleCustomizeColumn = (values) => {
    if (values.length) {
      if (values.includes("Overall Activities")) {
        setCheckOverallActivities(true);
      } else {
        setCheckOverallActivities(false);
      }
      if (values.includes("Lead Engaged Overall")) {
        setCheckLeadEngagedOverall(true);
      } else {
        setCheckLeadEngagedOverall(false);
      }
      if (values.includes("Leads Not Engaged")) {
        setCheckLeadNotEngaged(true);
      } else {
        setCheckLeadNotEngaged(false);
      }
      if (values.includes("Leads Engagement Percentage")) {
        setCheckLeadEngagedPercentage(true);
      } else {
        setCheckLeadEngagedPercentage(false);
      }
      if (values.includes("Untouched Stage")) {
        setCheckUntouchedStage(true);
      } else {
        setCheckUntouchedStage(false);
      }
      if (values.includes("Email Sent")) {
        setCheckEmailSent(true);
      } else {
        setCheckEmailSent(false);
      }
    } else {
      setCheckOverallActivities(false);
      setCheckLeadEngagedOverall(false);
      setCheckLeadNotEngaged(false);
      setCheckLeadEngagedPercentage(false);
      setCheckUntouchedStage(false);
      setCheckEmailSent(false);
    }
  };

  // get localeStorage add column and date range filter data
  useEffect(() => {
    const filterOptions = JSON.parse(
      localStorage.getItem(
        `${Cookies.get("userId")}columnAndDateOptionsOfProductivityReport`
      )
    );
    if (filterOptions) {
      if (filterOptions.dateRange) {
        const date = filterOptions.dateRange.map((range) => new Date(range));
        setCounsellorProductivityDateRange(date);
      }
      if (filterOptions?.addColumn?.length) {
        setAddColumnOptions(filterOptions?.addColumn);
        handleCustomizeColumn(filterOptions?.addColumn);
        setShowAddColumn(true);
      }
      if (filterOptions?.dateRange?.length) {
        setShowFilterOption(true);
      }
    }
    setShouldCallApi(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addColumnAndDateToLocalStorage = (value) => {
    const previousOptions = JSON.parse(
      localStorage.getItem(
        `${Cookies.get("userId")}columnAndDateOptionsOfProductivityReport`
      )
    );

    if (previousOptions) {
      const newFilterOptions = { ...previousOptions, ...value };
      localStorage.setItem(
        `${Cookies.get("userId")}columnAndDateOptionsOfProductivityReport`,
        JSON.stringify(newFilterOptions)
      );
    } else {
      localStorage.setItem(
        `${Cookies.get("userId")}columnAndDateOptionsOfProductivityReport`,
        JSON.stringify(value)
      );
    }
  };

  const handleUpdatePageNumber = () => {
    setPageNumber(1);
    setPage(1);
    localStorage.setItem(`${Cookies.get("userId")}allCounselorPageNo`, 1);
  };

  const filterAndColumnOption = () => {
    return (
      <>
        {showFilterOption && (
          <>
            <DateRangePicker
              appearance="subtle"
              placeholder="Date Range"
              value={
                counsellorProductivityDateRange?.length
                  ? counsellorProductivityDateRange
                  : null
              }
              onChange={(value) => {
                addColumnAndDateToLocalStorage({ dateRange: value });
                if (value && pageNumber !== 1) {
                  handleUpdatePageNumber();
                }
                setCounsellorProductivityDateRange(value);
              }}
              placement="bottomEnd"
              style={{ background: "#f7f7f8" }}
            />
          </>
        )}
        {showAddColumn && (
          <CheckPicker
            data={counselorProductivityTableAddColumn}
            defaultValue={addColumnOptions}
            appearance="subtle"
            className="border-select-picker"
            data-testid="select-column-field"
            placement="bottomEnd"
            placeholder="Select Column"
            onChange={(values) => {
              handleCustomizeColumn(values);
              addColumnAndDateToLocalStorage({ addColumn: values });
              setAddColumnOptions(values);
            }}
          />
        )}
      </>
    );
  };

  return (
    <Card>
      <Box
        className={
          hideCounsellorProductivity === false && "counsellor-productivity-box"
        }
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackDrop}
        >
          <Typography fontWeight={"bold"}>Downloading</Typography>
          <CircularProgress sx={{ ml: 2 }} color="info" />
        </Backdrop>

        {counsellorProductivityInternalServerError ||
        counsellorProductivityReportDownloadInternalServerError ||
        somethingWentWrongInCounsellorProductivity ||
        somethingWentWrongInProductivityReportDownload ? (
          <Box>
            <Typography
              align="left"
              variant="h6"
              sx={{ fontWeight: "bold", pb: 1 }}
            >
              Counsellor Productivity Report
            </Typography>
            {(counsellorProductivityInternalServerError ||
              counsellorProductivityReportDownloadInternalServerError) && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {(somethingWentWrongInCounsellorProductivity ||
              somethingWentWrongInProductivityReportDownload) && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </Box>
        ) : (
          <Box sx={{ display: hideCounsellorProductivity ? "none" : "block" }}>
            <Box className="productivity-report-heading">
              <Box>
                <Box>
                  <Typography sx={{ fontWeight: "bold" }} variant="h6">
                    Counsellor Productivity Report
                    <Tooltip
                      title="The Counsellor Productivity Report represents all the information of counsellors productivity."
                      arrow
                      placement="top"
                    >
                      <IconButton
                        data-testid="info-icon"
                        sx={{ p: 0.6, mt: -0.5 }}
                      >
                        <InfoOutlinedIcon sx={{ fontSize: 17 }} />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                  <Typography color="textSecondary" variant="caption">
                    Date Range ( {startDateRange} to {endDateRange})
                  </Typography>
                </Box>
                {/* <Box sx={{ ml: 2 }}>
            {filterAndColumnOption()}
          </Box> */}
              </Box>
              <Box>
                <IconButton
                  onClick={() => {
                    localStorage.removeItem(
                      `${Cookies.get(
                        "userId"
                      )}columnAndDateOptionsOfProductivityReport`
                    );
                    setAddColumnOptions([]);
                    setCounsellorProductivityDateRange([]);
                  }}
                >
                  <RestartAltIcon />
                </IconButton>
                <IconButton
                  data-testid="btn_select-column"
                  onClick={() => setShowAddColumn((prev) => !prev)}
                >
                  <PostAddOutlined
                    className={`${showAddColumn ? "selected-icon-button" : ""}`}
                  />
                </IconButton>
                <IconButton
                  data-testid="btn_filter-by-date"
                  onClick={() => setShowFilterOption((prev) => !prev)}
                >
                  <FilterAlt
                    className={`${
                      showFilterOption ? "selected-icon-button" : ""
                    }`}
                  />
                </IconButton>
                <IconButton
                  disabled={
                    selectedSeason
                      ? selectedSeason?.includes(new Date().getFullYear())
                        ? false
                        : true
                      : false
                  }
                  aria-label="Download"
                >
                  <FileDownloadOutlinedIcon
                    onClick={downloadCounsellorProductivity}
                  />
                </IconButton>
              </Box>
            </Box>
            <Box>
              {isCounsellorProductivityReportLoading ? (
                <Box
                  sx={{
                    width: "100%",
                    minHeight: "50vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <LeefLottieAnimationLoader
                    height={80}
                    width={80}
                  ></LeefLottieAnimationLoader>
                </Box>
              ) : (
                <>
                  {productivityData?.length === 0 ? (
                    <Box
                      sx={{
                        width: "100%",
                        minHeight: "40vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <BaseNotFoundLottieLoader
                        height={250}
                        width={250}
                      ></BaseNotFoundLottieLoader>
                    </Box>
                  ) : (
                    <Card>
                      <TableContainer
                        sx={{ whiteSpace: "nowrap" }}
                        className="custom-scrollbar"
                      >
                        <Box className="productivity-heading-container">
                          <CardHeader
                            sx={{ py: 1, px: 0 }}
                            title={`Total ${totalCounselorCount} Records`}
                          ></CardHeader>
                          <Box className="productivity-filter-option">
                            {filterAndColumnOption()}
                          </Box>
                        </Box>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell className="common-table-head">
                                Counsellor Name
                              </TableCell>
                              <TableCell
                                align="center"
                                className="common-table-head"
                              >
                                Lead Assigned
                                <Tooltip
                                  title="Total Number of leads assigned to a respective counselor for the selected date range. By default, it represents all the leads assigned to a counselor for the last 30 days."
                                  arrow
                                  placement="bottom"
                                >
                                  <IconButton sx={{ p: 0.6, mt: -0.5 }}>
                                    <InfoOutlinedIcon
                                      sx={{ fontSize: 17, color: "white" }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                              <TableCell
                                align="center"
                                className="common-table-head"
                              >
                                payment Approved
                                <Tooltip
                                  title="Total Number of successful payments made applications for the selected date range"
                                  arrow
                                  placement="bottom"
                                >
                                  <IconButton sx={{ p: 0.6, mt: -0.5 }}>
                                    <InfoOutlinedIcon
                                      sx={{ fontSize: 17, color: "white" }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                              <TableCell
                                align="center"
                                className="common-table-head"
                              >
                                Application Submitted
                                <Tooltip
                                  title="Total number of submitted applications with payment made successfully and declaration is submitted "
                                  arrow
                                  placement="bottom"
                                >
                                  <IconButton sx={{ p: 0.6, mt: -0.5 }}>
                                    <InfoOutlinedIcon
                                      sx={{ fontSize: 17, color: "white" }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                              <TableCell
                                align="center"
                                className="common-table-head"
                              >
                                Queries Activities
                                <Tooltip
                                  title="Total number of Queries done by counselor which includes email sent, SMS sent, WhatsApp sent, Follow up added, notes added, lead stage changed "
                                  arrow
                                  placement="bottom"
                                >
                                  <IconButton sx={{ p: 0.6, mt: -0.5 }}>
                                    <InfoOutlinedIcon
                                      sx={{ fontSize: 17, color: "white" }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>

                              {checkOverallActivities ? (
                                <TableCell className="common-table-head">
                                  Overall Activities
                                </TableCell>
                              ) : null}
                              {checkLeadEngagedOverall ? (
                                <TableCell className="common-table-head">
                                  Leads Engaged (Overall)
                                </TableCell>
                              ) : null}

                              {checkLeadNotEngaged ? (
                                <TableCell
                                  align="center"
                                  className="common-table-head"
                                >
                                  Leads Not Engaged
                                  <Tooltip
                                    title="A total number of unique leads not engaged by a counselor for the selected date range."
                                    arrow
                                    placement="bottom"
                                  >
                                    <IconButton sx={{ p: 0.6, mt: -0.5 }}>
                                      <InfoOutlinedIcon
                                        sx={{ fontSize: 17, color: "white" }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              ) : null}
                              {checkLeadEngagedPercentage ? (
                                <TableCell className="common-table-head">
                                  Leads Engaged Percentage
                                </TableCell>
                              ) : null}
                              {checkUntouchedStage ? (
                                <TableCell
                                  align="center"
                                  className="common-table-head"
                                >
                                  Untouched Stage
                                  <Tooltip
                                    title="Total count of Leads assigned to a counselor within a specific time frame whose lead stage has not been changed"
                                    arrow
                                    placement="bottom"
                                  >
                                    <IconButton sx={{ p: 0.6, mt: -0.5 }}>
                                      <InfoOutlinedIcon
                                        sx={{ fontSize: 17, color: "white" }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              ) : null}
                              {checkEmailSent ? (
                                <TableCell className="common-table-head">
                                  Email Sent (Lead)
                                </TableCell>
                              ) : null}
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            <CounsellorProductivityTableRow
                              counsellorProductivityReportData={
                                productivityData
                              }
                              checkOverallActivities={checkOverallActivities}
                              checkLeadEngagedOverall={checkLeadEngagedOverall}
                              checkEmailSent={checkEmailSent}
                              checkLeadNotEngaged={checkLeadNotEngaged}
                              checkLeadEngagedPercentage={
                                checkLeadEngagedPercentage
                              }
                              checkUntouchedStage={checkUntouchedStage}
                            />
                            <TableRow className="common-table-total-row">
                              <TableCell sx={{ fontWeight: "500" }}>
                                Total
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" fontWeight="500">
                                  {totalLeadAssigned ? totalLeadAssigned : 0}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" fontWeight="500">
                                  {totalPaymentApproved
                                    ? totalPaymentApproved
                                    : 0}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" fontWeight="500">
                                  {totalApplicationSubmited
                                    ? totalApplicationSubmited
                                    : 0}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2" fontWeight="500">
                                  {totalQueries ? totalQueries : 0}
                                </Typography>
                              </TableCell>
                              {checkOverallActivities && (
                                <TableCell align="center">
                                  <Typography variant="body2" fontWeight="500">
                                    {totalOverallActivities
                                      ? totalOverallActivities
                                      : 0}
                                  </Typography>
                                </TableCell>
                              )}
                              {checkLeadEngagedOverall && (
                                <TableCell align="center">
                                  <Typography variant="body2" fontWeight="500">
                                    {totalLeadEngagedOverall
                                      ? totalLeadEngagedOverall
                                      : 0}
                                  </Typography>
                                </TableCell>
                              )}
                              {checkLeadNotEngaged && (
                                <TableCell align="center">
                                  <Typography variant="body2" fontWeight="500">
                                    {totalLeadsNotEngaged
                                      ? totalLeadsNotEngaged
                                      : 0}
                                  </Typography>
                                </TableCell>
                              )}
                              {checkLeadEngagedPercentage && (
                                <TableCell align="center">
                                  <Typography variant="body2" fontWeight="500">
                                    {totalPercentageOfLeadsEngagement
                                      ? totalPercentageOfLeadsEngagement.toFixed(
                                          2
                                        )
                                      : 0}{" "}
                                    %
                                  </Typography>
                                </TableCell>
                              )}
                              {checkUntouchedStage && (
                                <TableCell align="center">
                                  <Typography variant="body2" fontWeight="500">
                                    {totalUntouchedStage
                                      ? totalUntouchedStage
                                      : 0}
                                  </Typography>
                                </TableCell>
                              )}
                              {checkEmailSent && (
                                <TableCell align="center">
                                  <Typography variant="body2" fontWeight="500">
                                    {totalEmailSent ? totalEmailSent : 0}
                                  </Typography>
                                </TableCell>
                              )}
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Card>
                  )}
                </>
              )}

              {!isCounsellorProductivityReportLoading && (
                <Box className="pagination-container">
                  <Pagination
                    className="pagination-bar"
                    currentPage={page}
                    totalCount={rowCount}
                    pageSize={rowsPerPage}
                    onPageChange={(page) =>
                      handleChangePage(page, `allCounselorPageNo`, setPage)
                    }
                    count={count}
                  />

                  <FormControl sx={{ m: 1, ml: 2 }} size="small">
                    <InputLabel id="demo-select-small">Row</InputLabel>
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      value={rowsPerPage}
                      label="Row"
                      onChange={handleChangeRowsPerPage}
                    >
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={75}>75</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default React.memo(CounsellorProductivity);
