import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Button,
  Card,
  CardHeader,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Menu,
  MenuItem,
  Chip,
  TextField,
  Tooltip,
  Checkbox,
} from "@mui/material";
import { Drawer } from "rsuite";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/CommunicationPerformance.css";
// Icons
import {
  FilterAlt,
  Settings,
  EmailRounded,
  ForumRounded,
  WhatsApp,
  Close,
} from "@mui/icons-material";
import { Download as DownloadIcon } from "../../icons/Download";
import ConsumptionModal from "../../components/ui/communication-performance/ConsumptionModal";
import DeliveryReport from "../../components/ui/communication-performance/DeliveryReport";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Cookies from "js-cookie";
import useToasterHook from "../../hooks/useToasterHook";
import {
  useGetRuleDEliveryDetailsAPIQuery,
  useGetRuleDetailsAPIQuery,
} from "../../Redux/Slices/applicationDataApiSlice";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { useEffect } from "react";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import { handleChangePage } from "../../helperFunctions/pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import AutomationDownloadDialog from "./AutomationDownloadDialog";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import {
  allCheckboxHandlerFunction,
  handleLocalStorageForCheckbox,
  showCheckboxAndIndeterminate,
  singleCheckboxHandlerFunction,
} from "../../helperFunctions/checkboxHandleFunction";
import Pagination from "../../components/shared/Pagination/Pagination";
import TemplateDetailsDialog from "./TemplateDetailsDialog";
import { useSelector } from "react-redux";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import { handleDataFilterOption } from "../../helperFunctions/handleDataFilterOption";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import { customFetch } from "../StudentTotalQueries/helperFunction";

function CommunicationPerformance(props) {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  // Filter Drawer
  const [size] = useState("xs");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [placement, setPlacement] = useState();
  const { state } = useLocation();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const pushNotification = useToasterHook();
  const navigate = useNavigate();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  useEffect(() => {
    if (!state?.automationId) {
      navigate("/automation");
    }
  }, [navigate, state?.automationId]);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [ruleDetailsInternalServerError, setRuleDetailsInternalServerError] =
    useState(false);
  const [
    ruleDetailsDeliveryInternalServerError,
    setRuleDetailsDeliveryInternalServerError,
  ] = useState(false);
  const [hideRuleDetails, setHideRuleDetails] = useState(false);
  const [somethingWentWrongInRuleDetails, setSomethingWentWrongInRuleDetails] =
    useState(false);
  const [
    somethingWentWrongInRuleDetailsDelivery,
    setSomethingWentWrongInRuleDetailsDelivery,
  ] = useState(false);
  // states for pagination
  const ruleDetailsPageNo = localStorage.getItem(
    `${Cookies.get("userId")}allRuleDetailsPageNo`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}allRuleDetailsPageNo`)
      )
    : 1;

  const tableRowPerPage = localStorage.getItem(
    `${Cookies.get("userId")}allRuleDetailsRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}allRuleDetailsRowPerPage`)
      )
    : 25;
  const [pageNumber, setPageNumber] = useState(ruleDetailsPageNo);
  const [rowCount, setRowCount] = useState();
  const [totalRuleDetailsCount, setTotalRuleDetailsCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(tableRowPerPage);
  const [ruleDetails, setRuleDetails] = useState([]);
  const count = Math.ceil(rowCount / rowsPerPage);

  const [searchText, setSearchText] = useState("");
  const [showResetButton, setShowResetButton] = useState(false);
  const [moduleType, setModuleType] = useState([]);

  const [sendSearchItem, setSendSearchItem] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [skip, setSkip] = useState(true);

  const [skipRuleDetailsApiCall, setSkipRuleDetailsApiCall] = useState(true);

  const {
    data: ruleDetailsData,
    isSuccess,
    isFetching,
    error,
    isError,
    refetch: refetchGetRuleDetailsApi,
  } = useGetRuleDetailsAPIQuery(
    {
      pageNumber: pageNumber,
      rowsPerPage: rowsPerPage,
      collegeId: collegeId,
      automationId: encodeURIComponent(state?.automationId),
      moduleType: moduleType,
      searchItem: sendSearchItem,
    },
    { skip: skipRuleDetailsApiCall }
  );
  const {
    data: ruleDeliveryDetailsData,
    isSuccess: isSuccessDelivery,
    error: deliveryError,
    isError: isDeliveryError,
  } = useGetRuleDEliveryDetailsAPIQuery(
    {
      automationJobId: encodeURIComponent(selectedJobId),
      collegeId: collegeId,
    },
    { skip: skip }
  );

  const setCallSearchAPI = () => {
    setSendSearchItem(searchText);
  };

  useEffect(() => {
    try {
      if (isSuccessDelivery) {
        if (typeof ruleDeliveryDetailsData !== "object") {
          throw new Error("Rule delivery Report API response has changed");
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
            setRuleDetailsDeliveryInternalServerError,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInRuleDetailsDelivery,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    deliveryError,
    isDeliveryError,
    isSuccessDelivery,
    navigate,
    setApiResponseChangeMessage,
    ruleDeliveryDetailsData,
  ]);
  useEffect(() => {
    try {
      if (isSuccess) {
        searchText?.length > 0 && setShowResetButton(true);
        if (Array.isArray(ruleDetailsData?.data)) {
          setRuleDetails(ruleDetailsData?.data);
          setRowCount(ruleDetailsData?.total);
          setTotalRuleDetailsCount(ruleDetailsData?.total);
        } else {
          throw new Error("get_details API response has changed");
        }
      }
      if (isError) {
        setRuleDetails([]);
        setTotalRuleDetailsCount(0);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setRuleDetailsInternalServerError,
            setHideRuleDetails,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInRuleDetails,
        setHideRuleDetails,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    error,
    isError,
    isSuccess,
    navigate,
    setApiResponseChangeMessage,
    ruleDetailsData,
  ]);

  const handleOpen = (key) => {
    setOpenDrawer(true);
    setPlacement(key);
  };
  // Delivery Report
  const [deliveryReport, setDeliveryReport] = useState(false);
  // Add Campaign Details
  const [modalType, setModalType] = useState("");

  // modal
  const [openModal, setOpenModal] = useState(false);
  // Action button
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick1 = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //top checkbox and indeterminate state
  const [selectTopCheckbox, setSelectTopCheckbox] = useState(false);
  const [showIndeterminate, setShowIndeterminate] = useState(false);

  const [selectedAutomationJobs, setSelectedAutomationJobs] = useState([]);

  const automationJobsId = ruleDetails?.map((rule) => rule?.job_id);

  const [loading, setLoading] = useState(false);

  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);

  const handleClickOpenDownloadDialog = () => {
    if (ruleDetails?.length === 0) {
      pushNotification("warning", "No data found");
    } else {
      setOpenDownloadDialog(true);
    }
  };

  const handleCloseDownloadDialog = () => {
    setOpenDownloadDialog(false);
  };

  const [openTemplateDetailsDialog, setOpenTemplateDetailsDialog] =
    useState(false);
  const [templateDetails, setTemplateDetails] = useState(false);
  const [typeOfTemplate, setTypeOfTemplate] = useState("");

  const handleClickOpenTemplateDetailsDialog = (templateContent, type) => {
    setOpenTemplateDetailsDialog(true);
    setTemplateDetails(templateContent);
    setTypeOfTemplate(type);
  };

  const handleCloseTemplateDetailsDialog = () => {
    setOpenTemplateDetailsDialog(false);
  };

  const localStorageKeyName = `${Cookies.get("userId")}${
    state?.automationId
  }selectedAutomationJobs`;

  // set selected users in state from local storage after reload
  useEffect(() => {
    handleLocalStorageForCheckbox(
      localStorageKeyName,
      setSelectedAutomationJobs
    );
  }, [localStorageKeyName]);

  //show top checkbox and indeterminate
  useEffect(() => {
    showCheckboxAndIndeterminate(
      automationJobsId,
      selectedAutomationJobs,
      setSelectTopCheckbox,
      setShowIndeterminate
    );
  }, [automationJobsId, selectedAutomationJobs]);

  //single application download function
  const handleDownload = (payload) => {
    setLoading(true);
    customFetch(
      `${import.meta.env.VITE_API_BASE_URL}/automation/download_job_details/${
        collegeId ? "?college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(token, "POST", JSON.stringify(payload))
    )
      .then((res) =>
        res.json().then((result) => {
          if (result?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (result?.file_url) {
            const expectedData = result?.file_url;
            try {
              if (typeof expectedData === "string") {
                window.open(result?.file_url, "_self");
                setSelectedAutomationJobs([]);
                localStorage.removeItem(localStorageKeyName);
              } else {
                throw new Error(
                  "download job details API response has changed"
                );
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInRuleDetails,
                "",
                5000
              );
            }
          } else if (result?.detail) {
            pushNotification("error", result?.detail);
          }
        })
      )
      .catch((err) => {
        handleInternalServerError(setRuleDetailsInternalServerError, "", 5000);
      })
      .finally(() => setLoading(false));
  };

  const moduleTypeList = [
    { label: "Lead", value: "Lead" },
    { label: "Raw Data", value: "Raw Data" },
    { label: "Application", value: "Application" },
    { label: "Payment", value: "Payment" },
  ];

  const handleUpdatePageNumber = () => {
    setPageNumber(1);
    localStorage.setItem(`${Cookies.get("userId")}allRuleDetailsPageNo`, 1);
  };

  //getting filter from local storage
  useEffect(() => {
    const filterOptions = JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}ruleDetailsFilterData`)
    );
    if (filterOptions) {
      if (filterOptions?.module_type?.length) {
        setModuleType(filterOptions?.module_type);
        setSkipRuleDetailsApiCall(false);
      }
    } else {
      setSkipRuleDetailsApiCall(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSaveToLocalStorage = (value) => {
    handleDataFilterOption(value, "ruleDetailsFilterData");
  };

  return (
    <Box component="main" className="communication-performance" sx={{ py: 2 }}>
      <Container maxWidth={false}>
        <Grid container>
          <Grid item md={12} sm={12} xs={12}>
            {/* ------- Header Section----- */}
            <Box className="appCall_top">
              <Box className="appCalllog">
                {/* <Box onClick={() => navigate(-1)} component="h5"></Box> */}
                <Box sx={{ display: "flex", alignItems: "center", pt: 2 }}>
                  <IconButton onClick={() => navigate(-1)} aria-label="Example">
                    <ArrowBackIcon />
                  </IconButton>
                  <CardHeader
                    sx={{ flexWrap: "wrap", p: 0 }}
                    titleTypographyProps={{ fontSize: "22px" }}
                    title="Communication Performance"
                  />
                </Box>
              </Box>
              <Box className="applog_search">
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      size="small"
                      sx={{ width: 220 }}
                      label="Search by segment name"
                      variant="outlined"
                      value={searchText}
                      onChange={(event) => setSearchText(event.target.value)}
                      color="info"
                    />

                    <Button
                      size="small"
                      sx={{ ml: 0.5, mr: 1 }}
                      variant="contained"
                      disabled={searchText?.length > 0 ? false : true}
                      onClick={() => {
                        setCallSearchAPI();
                      }}
                    >
                      <SearchIcon />
                    </Button>

                    {showResetButton && (
                      <Tooltip arrow placement="top" title="Reset">
                        <RestartAltIcon
                          sx={{ mr: 1 }}
                          id="search-icon"
                          onClick={() => {
                            setSearchText("");
                            setSendSearchItem("");
                            refetchGetRuleDetailsApi();
                            setShowResetButton(false);
                          }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                </Box>
                <Box>
                  <Button
                    onClick={handleClickOpenDownloadDialog}
                    data-testid="communication-log-download-button"
                    variant="contained"
                    startIcon={<DownloadIcon fontSize="small" />}
                  >
                    Download
                  </Button>
                </Box>
                <Box
                  sx={{
                    marginLeft: "12px",
                  }}
                >
                  <Button
                    data-testid="communication-log-filter-button"
                    variant="contained"
                    onClick={() => handleOpen("right")}
                    startIcon={<FilterAlt fontSize="small" />}
                  >
                    Filter
                  </Button>
                </Box>
                {/* Filter Drawer */}
                <Drawer
                  size={size}
                  placement={placement}
                  open={openDrawer}
                  onClose={() => setOpenDrawer(false)}
                >
                  <Box className="flt_drawerHeader">
                    <Box className="filterTxt">
                      <Typography variant="h6">Filter By</Typography>
                      <IconButton>
                        <Close onClick={() => setOpenDrawer(false)} />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box className="flt_drawerBody">
                    <Box>
                      <MultipleFilterSelectPicker
                        handleFilterOption={(checkAll, allValue) =>
                          handleFilterSaveToLocalStorage({
                            module_type: checkAll ? allValue : [],
                          })
                        }
                        onChange={(value) => {
                          setModuleType(value);
                          handleFilterSaveToLocalStorage({
                            module_type: value,
                          });
                        }}
                        pickerData={moduleTypeList}
                        placeholder="Select Module"
                        pickerValue={moduleType}
                        setSelectedPicker={setModuleType}
                        setSkipApiCall={setSkipRuleDetailsApiCall}
                        style={{ width: "75%" }}
                      />

                      <Button
                        variant="contained"
                        size="small"
                        sx={{ ml: 2 }}
                        onClick={() => {
                          if (pageNumber !== 1) {
                            handleUpdatePageNumber();
                          }
                          setSkipRuleDetailsApiCall(false);
                          setOpenDrawer(false);
                        }}
                      >
                        Apply
                      </Button>
                    </Box>
                  </Box>
                </Drawer>
                {/* ----end of drawer------ */}
              </Box>
            </Box>
            {/* ---- end of header section----- */}
            <Box>
              {isFetching || loading ? (
                <Box className="loading-animation">
                  <LeefLottieAnimationLoader
                    height={200}
                    width={180}
                  ></LeefLottieAnimationLoader>
                </Box>
              ) : (
                <Card {...props}>
                  {/*--------- Email/SMS/whatsapp Consumption------- */}
                  <CardHeader
                    sx={{ flexWrap: "wrap" }}
                    title={
                      <TableDataCount
                        totalCount={totalRuleDetailsCount}
                        currentPageShowingCount={ruleDetails.length}
                        pageNumber={pageNumber}
                        rowsPerPage={rowsPerPage}
                      />
                    }
                    action={
                      <Box className="consumption_main">
                        <Box
                          className="consumption_box"
                          onClick={() => {
                            setOpenModal(true);
                            setModalType("Email");
                          }}
                        >
                          <IconButton>
                            <EmailRounded fontSize="small" color="warning" />
                          </IconButton>
                          <Typography
                            variant="body2"
                            color="warning.main"
                            className="e_consumption_txt"
                          >
                            Email Consumption
                          </Typography>
                        </Box>
                        <Box>
                          <ConsumptionModal
                            openModal={openModal}
                            setOpenModal={setOpenModal}
                            modalType={modalType}
                            token={token}
                            pushNotification={pushNotification}
                          />
                        </Box>
                        <Box
                          className="consumption_box"
                          onClick={() => {
                            setOpenModal(true);
                            setModalType("SMS");
                          }}
                        >
                          <IconButton>
                            <ForumRounded fontSize="small" color="primary" />
                          </IconButton>
                          <Typography
                            variant="body2"
                            color="primary"
                            className="s_consumption_txt"
                          >
                            SMS Consumption
                          </Typography>
                        </Box>
                        <Box
                          className="consumption_box"
                          onClick={() => {
                            setOpenModal(true);
                            setModalType("WhatsApp");
                          }}
                        >
                          <IconButton>
                            <WhatsApp fontSize="small" color="success" />
                          </IconButton>
                          <Typography
                            variant="body2"
                            color="success.main"
                            className="wh_consumption_txt"
                          >
                            Whatsapp Consumption
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  {moduleType?.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        mb: 1,
                        px: 2,
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <Typography fontWeight={"bold"}>
                        Added Filter:{" "}
                      </Typography>
                      <Chip
                        label={
                          moduleType?.length > 2
                            ? `${moduleType?.[0]}, ${moduleType?.[1]}...`
                            : moduleType?.join(", ")
                        }
                        color="warning"
                        sx={{ backgroundColor: "#263238" }}
                        size="small"
                        onDelete={() => {
                          setModuleType([]);
                          localStorage.removeItem(
                            `${Cookies.get("userId")}ruleDetailsFilterData`
                          );
                        }}
                      />
                    </Box>
                  )}
                  {ruleDetailsInternalServerError ||
                  somethingWentWrongInRuleDetails ? (
                    <>
                      {ruleDetailsInternalServerError && (
                        <Error500Animation
                          height={400}
                          width={400}
                        ></Error500Animation>
                      )}
                      {somethingWentWrongInRuleDetails && (
                        <ErrorFallback
                          error={apiResponseChangeMessage}
                          resetErrorBoundary={() => window.location.reload()}
                        />
                      )}
                    </>
                  ) : (
                    <Box
                      sx={{
                        px: 2,
                        visibility: hideRuleDetails ? "hidden" : "visible",
                      }}
                    >
                      {ruleDetails.length > 0 ? (
                        <TableContainer className="communicationLogTable custom-scrollbar">
                          <Table sx={{ minWidth: 700 }}>
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Checkbox
                                    color="info"
                                    checked={selectTopCheckbox}
                                    onChange={(e) =>
                                      allCheckboxHandlerFunction(
                                        e,
                                        localStorageKeyName,
                                        automationJobsId,
                                        selectedAutomationJobs,
                                        setSelectedAutomationJobs
                                      )
                                    }
                                    indeterminate={showIndeterminate}
                                  />
                                </TableCell>
                                <TableCell align="left">Job ID</TableCell>
                                <TableCell>Action Type</TableCell>
                                <TableCell>Module Type</TableCell>
                                <TableCell>Template Name</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Execution Date</TableCell>
                                <TableCell>Segment Name</TableCell>
                                <TableCell>Targeted Audience</TableCell>
                                <TableCell>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {ruleDetails?.map((cumData, index) => (
                                <TableRow
                                  sx={{
                                    backgroundColor:
                                      cumData.status.toLowerCase() !==
                                        "success" && "error.moreLight",
                                    borderLeft:
                                      selectedAutomationJobs?.includes(
                                        cumData?.job_id
                                      )
                                        ? "1px solid blue"
                                        : "none",
                                  }}
                                  key={index}
                                >
                                  <TableCell>
                                    {selectedAutomationJobs?.includes(
                                      cumData?.job_id
                                    ) ? (
                                      <IconButton
                                        sx={{ p: "9px" }}
                                        onClick={() => {
                                          singleCheckboxHandlerFunction(
                                            {
                                              target: {
                                                checked: false,
                                              },
                                            },
                                            cumData?.job_id,
                                            localStorageKeyName,
                                            selectedAutomationJobs,
                                            setSelectedAutomationJobs
                                          );
                                        }}
                                      >
                                        <CheckBoxOutlinedIcon
                                          sx={{ color: "#008be2" }}
                                        />
                                      </IconButton>
                                    ) : (
                                      <Checkbox
                                        checked={
                                          selectedAutomationJobs?.includes(
                                            cumData?.job_id
                                          )
                                            ? true
                                            : false
                                        }
                                        onChange={(e) => {
                                          singleCheckboxHandlerFunction(
                                            e,
                                            cumData?.job_id,
                                            localStorageKeyName,
                                            selectedAutomationJobs,
                                            setSelectedAutomationJobs
                                          );
                                        }}
                                      />
                                    )}
                                  </TableCell>
                                  <TableCell align="left">
                                    <Link
                                      to="/communication-logs-details-report"
                                      state={{
                                        jobID: cumData?.job_id,
                                      }}
                                      style={{
                                        textDecoration: "none",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {cumData?.job_id}
                                    </Link>
                                  </TableCell>
                                  <TableCell align="center">
                                    {cumData?.action_type?.map((action) => (
                                      <span
                                        className={`${
                                          action?.toLowerCase() === "email"
                                            ? "fifth-design"
                                            : action?.toLowerCase() === "sms"
                                            ? "sixth-design"
                                            : action?.toLowerCase() ===
                                                "whatsapp" && "third-design"
                                        } card`}
                                      >
                                        {action ? action : "--"}
                                      </span>
                                    ))}
                                  </TableCell>

                                  <TableCell align="center">
                                    <span
                                      className={`${
                                        cumData?.module_type?.toLowerCase() ===
                                        "lead"
                                          ? "first-design"
                                          : cumData?.module_type?.toLowerCase() ===
                                            "application"
                                          ? "second-design"
                                          : cumData?.module_type?.toLowerCase() ===
                                            "payment"
                                          ? "third-design"
                                          : "fourth-design"
                                      } card`}
                                    >
                                      {" "}
                                      {cumData?.module_type
                                        ? cumData.module_type
                                        : "--"}
                                    </span>
                                  </TableCell>
                                  <TableCell align="center">
                                    {cumData?.template_details ? (
                                      <>
                                        {cumData?.template_details?.email && (
                                          <Box className="template-name-style">
                                            <Typography>Email: </Typography>
                                            <Box
                                              onClick={() =>
                                                handleClickOpenTemplateDetailsDialog(
                                                  cumData?.template_details,
                                                  "email"
                                                )
                                              }
                                              sx={{
                                                color: "#2C75E1",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                              }}
                                            >
                                              {" "}
                                              {
                                                cumData?.template_details?.email
                                                  ?.template_name
                                              }
                                            </Box>
                                          </Box>
                                        )}

                                        {cumData?.template_details?.sms && (
                                          <Box className="template-name-style">
                                            <Typography>Sms: </Typography>
                                            <Box
                                              onClick={() =>
                                                handleClickOpenTemplateDetailsDialog(
                                                  cumData?.template_details,
                                                  "sms"
                                                )
                                              }
                                              sx={{
                                                color: "#2C75E1",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                              }}
                                            >
                                              {
                                                cumData?.template_details?.sms
                                                  ?.template_name
                                              }
                                            </Box>
                                          </Box>
                                        )}

                                        {cumData?.template_details
                                          ?.whatsapp && (
                                          <Box className="template-name-style">
                                            <Typography>Whatsapp: </Typography>
                                            <Box
                                              onClick={() =>
                                                handleClickOpenTemplateDetailsDialog(
                                                  cumData?.template_details,
                                                  "whatsapp"
                                                )
                                              }
                                              sx={{
                                                color: "#2C75E1",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                              }}
                                            >
                                              {
                                                cumData?.template_details
                                                  ?.whatsapp?.template_name
                                              }
                                            </Box>
                                          </Box>
                                        )}
                                      </>
                                    ) : (
                                      "--"
                                    )}
                                  </TableCell>
                                  <TableCell align="center">
                                    <Typography
                                      variant="subtitle2"
                                      color={
                                        cumData.status.toLowerCase() ===
                                        "success"
                                          ? "success.main"
                                          : "error.main"
                                      }
                                    >
                                      {cumData?.status ? cumData?.status : "--"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    {cumData?.execution_time
                                      ? cumData?.execution_time
                                      : "--"}
                                  </TableCell>
                                  <TableCell align="center">
                                    {cumData?.data_segment_name ? (
                                      <Link
                                        to="/createCampaign"
                                        state={{
                                          name_of_data_segment:
                                            cumData?.data_segment_name,
                                          type: "Preview",
                                        }}
                                        style={{
                                          textDecoration: "none",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {cumData?.data_segment_name}
                                      </Link>
                                    ) : (
                                      "--"
                                    )}
                                  </TableCell>
                                  <TableCell align="center">
                                    {cumData?.targeted_audience
                                      ? cumData?.targeted_audience
                                      : "--"}
                                  </TableCell>
                                  <TableCell align="center">
                                    <IconButton
                                      aria-label="more"
                                      id="long-button"
                                      aria-controls={
                                        open ? "long-menu" : undefined
                                      }
                                      aria-expanded={open ? "true" : undefined}
                                      aria-haspopup="true"
                                      onClick={(event) => {
                                        handleClick1(event);
                                        setSelectedJobId(cumData?.job_id);
                                      }}
                                    >
                                      <Settings fontSize="small" />
                                    </IconButton>
                                    <Menu
                                      id="long-menu"
                                      MenuListProps={{
                                        "aria-labelledby": "long-button",
                                      }}
                                      anchorEl={anchorEl}
                                      open={open}
                                      onClose={handleClose}
                                      PaperProps={{
                                        style: {
                                          width: "200px",
                                        },
                                      }}
                                    >
                                      <MenuItem
                                        onClick={() => {
                                          setDeliveryReport(true);
                                          handleClose();
                                          setSkip(false);
                                        }}
                                      >
                                        Delivery Report
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => {
                                          handleClose();
                                          handleDownload([selectedJobId]);
                                        }}
                                      >
                                        Download Report
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => {
                                          handleClose();
                                          navigate(
                                            "/communication-logs-details-report",
                                            {
                                              state: {
                                                jobID: cumData?.job_id,
                                              },
                                            }
                                          );
                                        }}
                                      >
                                        <Typography>
                                          View Detailed Report
                                        </Typography>
                                      </MenuItem>
                                    </Menu>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          {/*------- Delivery Report component----- */}
                          {deliveryReport && (
                            <DeliveryReport
                              ruleDeliveryDetailsData={ruleDeliveryDetailsData}
                              deliveryReport={deliveryReport}
                              setDeliveryReport={setDeliveryReport}
                              ruleDetailsDeliveryInternalServerError={
                                ruleDetailsDeliveryInternalServerError
                              }
                              somethingWentWrongInRuleDetailsDelivery={
                                somethingWentWrongInRuleDetailsDelivery
                              }
                              apiResponseChangeMessage={
                                apiResponseChangeMessage
                              }
                            />
                          )}
                          {/* -------End of delivery reports---------- */}
                        </TableContainer>
                      ) : (
                        <Box className="not-found-animation">
                          <BaseNotFoundLottieLoader
                            height={250}
                            width={250}
                          ></BaseNotFoundLottieLoader>
                        </Box>
                      )}
                      {ruleDetails.length > 0 && (
                        <Box className="pagination-container-rule-details">
                          <Pagination
                            className="pagination-bar"
                            currentPage={pageNumber}
                            totalCount={rowCount}
                            pageSize={rowsPerPage}
                            onPageChange={(page) =>
                              handleChangePage(
                                page,
                                `allRuleDetailsPageNo`,
                                setPageNumber
                              )
                            }
                            count={count}
                          />

                          <AutoCompletePagination
                            rowsPerPage={rowsPerPage}
                            rowPerPageOptions={rowPerPageOptions}
                            setRowsPerPageOptions={setRowsPerPageOptions}
                            rowCount={rowCount}
                            page={pageNumber}
                            setPage={setPageNumber}
                            localStorageChangeRowPerPage={`allRuleDetailsRowPerPage`}
                            localStorageChangePage={`allRuleDetailsPageNo`}
                            setRowsPerPage={setRowsPerPage}
                          ></AutoCompletePagination>
                        </Box>
                      )}
                    </Box>
                  )}
                </Card>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
      <AutomationDownloadDialog
        openDialog={openDownloadDialog}
        handleCloseDialog={handleCloseDownloadDialog}
        handleDownload={handleDownload}
        selectedItems={selectedAutomationJobs}
      />

      <TemplateDetailsDialog
        openDialog={openTemplateDetailsDialog}
        handleCloseDialog={handleCloseTemplateDetailsDialog}
        templateDetails={templateDetails}
        typeOfTemplate={typeOfTemplate}
      />
    </Box>
  );
}

export default CommunicationPerformance;
