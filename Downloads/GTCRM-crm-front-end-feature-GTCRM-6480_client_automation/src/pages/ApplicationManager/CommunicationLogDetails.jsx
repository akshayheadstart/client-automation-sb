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
  Tooltip,
  TextField,
  Checkbox,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/CommunicationPerformance.css";
// Icons
import { EmailRounded, ForumRounded, WhatsApp } from "@mui/icons-material";
import { Download as DownloadIcon } from "../../icons/Download";
import CommunicationStatusStats from "../../components/ui/communication-performance/CommunicationStatusStats";
import Cookies from "js-cookie";
import useToasterHook from "../../hooks/useToasterHook";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { useGetRuleJobDetailsAPIQuery } from "../../Redux/Slices/applicationDataApiSlice";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { useEffect } from "react";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../helperFunctions/pagination";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import AutomationDownloadDialog from "./AutomationDownloadDialog";
import Pagination from "../../components/shared/Pagination/Pagination";
import { useSelector } from "react-redux";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import { customFetch } from "../StudentTotalQueries/helperFunction";
function CommunicationLogDetails(props) {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const { state } = useLocation();
  const pushNotification = useToasterHook();
  const navigate = useNavigate();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  useEffect(() => {
    if (!state?.jobID) {
      navigate("/communication-performance");
    }
  }, [navigate, state?.jobID]);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [
    ruleJobDetailsInternalServerError,
    setRuleJobDetailsInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInRuleJobDetails,
    setSomethingWentWrongInRuleJobDetails,
  ] = useState(false);

  const ruleJobDetailsPageNo = localStorage.getItem(
    `${Cookies.get("userId")}allRuleJobDetailsPageNo`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}allRuleJobDetailsPageNo`)
      )
    : 1;

  const tableRowPerPage = localStorage.getItem(
    `${Cookies.get("userId")}allRuleJobDetailsRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}allRuleJobDetailsRowPerPage`
        )
      )
    : 25;
  const [pageNumber, setPageNumber] = useState(ruleJobDetailsPageNo);
  const [rowCount, setRowCount] = useState();
  const [totalRuleJobDetailsCount, setTotalRuleJobDetailsCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(tableRowPerPage);
  const [ruleJobDetails, setRuleJobDetails] = useState([]);
  const count = Math.ceil(rowCount / rowsPerPage);
  const [searchText, setSearchText] = useState("");
  const [showResetButton, setShowResetButton] = useState(false);
  const [sendSearchItem, setSendSearchItem] = useState("");
  const {
    data: ruleJobDetailsData,
    isSuccess,
    isFetching,
    error,
    isError,
    refetch: refetchGetRuleJobDetailsApi,
  } = useGetRuleJobDetailsAPIQuery({
    pageNumber: pageNumber,
    rowsPerPage: rowsPerPage,
    collegeId: collegeId,
    automationJobId: encodeURIComponent(state?.jobID),
    searchItem: sendSearchItem,
  });

  const setCallSearchAPI = () => {
    setSendSearchItem(searchText);
  };
  // Detailed Report Email Status
  const [emailStatus, setEmailStatus] = useState(false);
  const [smsStatus, setSmsStatus] = useState(false);
  const [whatsAppStatus, setWhatsAppStatus] = useState(false);

  useEffect(() => {
    try {
      if (isSuccess) {
        searchText?.length > 0 && setShowResetButton(true);
        if (Array.isArray(ruleJobDetailsData?.data)) {
          setRuleJobDetails(ruleJobDetailsData?.data);
          setRowCount(ruleJobDetailsData?.total);
          setTotalRuleJobDetailsCount(ruleJobDetailsData?.total);
        } else {
          throw new Error("Job details API response has changed");
        }
      }
      if (isError) {
        setRuleJobDetails([]);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setRuleJobDetailsInternalServerError,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrongInRuleJobDetails, 10000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    error,
    isError,
    isSuccess,
    navigate,
    setApiResponseChangeMessage,
    ruleJobDetailsData,
  ]);

  //top checkbox and indeterminate state
  const [selectTopCheckbox, setSelectTopCheckbox] = useState(false);
  const [showIndeterminate, setShowIndeterminate] = useState(false);
  const [
    selectedAutomationCommunicationLogs,
    setSelectedAutomationCommunicationLogs,
  ] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const [loading, setLoading] = useState(false);

  const automationJobId = ruleJobDetails?.map((rule) => rule?.job_id);

  const localStorageKeyName = `${Cookies.get("userId")}${
    state?.jobID
  }selectedAutomationCommunicationLogs`;

  //top checkbox handler function
  const handleAllCheckbox = (e) => {
    if (e.target.checked === true) {
      const selectedCommunicationLogs = JSON.parse(
        localStorage.getItem(localStorageKeyName)
      );

      if (selectedCommunicationLogs?.length > 0) {
        //applications
        const filteredApplications = ruleJobDetails.filter(
          (application) =>
            !selectedAutomationCommunicationLogs.some(
              (element) => element.index_number === application.index_number
            )
        );

        setSelectedAutomationCommunicationLogs((currentArray) => [
          ...currentArray,
          ...filteredApplications,
        ]);
        localStorage.setItem(
          localStorageKeyName,
          JSON.stringify([...ruleJobDetails, ...filteredApplications])
        );
      } else {
        setSelectedAutomationCommunicationLogs(ruleJobDetails);
        localStorage.setItem(
          localStorageKeyName,
          JSON.stringify(ruleJobDetails)
        );
      }
    } else {
      //set selected applications
      const filteredApplications = ruleJobDetails.filter(
        (application) =>
          !ruleJobDetails.some(
            (element) => element.index_number === application.index_number
          )
      );
      setSelectedAutomationCommunicationLogs(filteredApplications);
      localStorage.setItem(
        localStorageKeyName,
        JSON.stringify(filteredApplications)
      );
    }
  };

  //show top checkbox and indeterminate
  useEffect(() => {
    let applicationCount = 0;
    const applicationIds = ruleJobDetails?.map(
      (application) => application.index_number
    );
    applicationIds?.forEach((item) => {
      if (selectedItems?.indexOf(item) !== -1) applicationCount++;
    });

    if (applicationCount === ruleJobDetails?.length && applicationCount > 0) {
      setSelectTopCheckbox(true);
    } else {
      setSelectTopCheckbox(false);
    }

    if (applicationCount < ruleJobDetails?.length && applicationCount > 0) {
      setShowIndeterminate(true);
    } else {
      setShowIndeterminate(false);
    }
  }, [ruleJobDetails, selectedItems]);

  //according to checkbox select set the application id in selectApplications state
  const handleApplicationCheckBox = (e, dataRow) => {
    const selectedItems = selectedAutomationCommunicationLogs?.map(
      (element) => element.index_number
    );
    if (e.target.checked === true) {
      if (selectedAutomationCommunicationLogs.length < 1) {
        //applications
        setSelectedAutomationCommunicationLogs([dataRow]);
        localStorage.setItem(localStorageKeyName, JSON.stringify([dataRow]));
      } else if (!selectedItems.includes(dataRow.index_number)) {
        //applications
        setSelectedAutomationCommunicationLogs((currentArray) => [
          ...currentArray,
          dataRow,
        ]);

        localStorage.setItem(
          localStorageKeyName,
          JSON.stringify([...selectedAutomationCommunicationLogs, dataRow])
        );
      }
    } else {
      const filteredApplications = selectedAutomationCommunicationLogs.filter(
        (object) => {
          return object.index_number !== dataRow.index_number;
        }
      );

      setSelectedAutomationCommunicationLogs(filteredApplications);
      localStorage.setItem(
        localStorageKeyName,
        JSON.stringify(filteredApplications)
      );
    }
  };

  // set selected applications in state from localstorage after reload
  useEffect(() => {
    //applications
    const selectedCommunicationLogs = JSON.parse(
      localStorage.getItem(localStorageKeyName)
    );
    if (selectedCommunicationLogs?.length > 0) {
      setSelectedAutomationCommunicationLogs(selectedCommunicationLogs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //set state of selected communication logs
  useEffect(() => {
    const selectedItems = selectedAutomationCommunicationLogs?.map(
      (object) => object.index_number
    );
    setSelectedItems(selectedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAutomationCommunicationLogs]);

  const [openDownloadDialog, setOpenDownloadDialog] = useState(true);

  const handleClickOpenDownloadDialog = () => {
    if (ruleJobDetails?.length === 0) {
      pushNotification("warning", "No data found");
    } else {
      setOpenDownloadDialog(true);
    }
  };

  const handleCloseDownloadDialog = () => {
    setOpenDownloadDialog(false);
  };

  //single application download function
  const handleDownload = (payload) => {
    setLoading(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/automation/download_job_data/?automation_job_id=${encodeURIComponent(
        automationJobId?.[0]
      )}${collegeId ? "&college_id=" + collegeId : ""}`,
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
                setSelectedAutomationCommunicationLogs([]);
                localStorage.removeItem(localStorageKeyName);
              } else {
                throw new Error("download job data API response has changed");
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInRuleJobDetails,
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
        handleInternalServerError(
          setRuleJobDetailsInternalServerError,
          "",
          5000
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box component="main" className="communication-performance" sx={{ py: 2 }}>
      <Container maxWidth={false}>
        <Grid container>
          <Grid item md={12} sm={12} xs={12}>
            <Box className="appCall_top">
              <Box className="appCalllog">
                <Box component="h5"></Box>
                <Box sx={{ display: "flex", alignItems: "center", pt: 2 }}>
                  <IconButton onClick={() => navigate(-1)} aria-label="Example">
                    <ArrowBackIcon />
                  </IconButton>
                  <CardHeader
                    sx={{ flexWrap: "wrap", p: 0 }}
                    titleTypographyProps={{ fontSize: "22px" }}
                    title="Communication Logs Detailed Report"
                  />
                </Box>
              </Box>
              <Box className="applog_search">
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      size="small"
                      sx={{ width: 200 }}
                      label="Search by Email"
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
                            refetchGetRuleJobDetailsApi();
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
                    variant="contained"
                    startIcon={<DownloadIcon fontSize="small" />}
                    data-testid="communication-Log-details-button"
                  >
                    Download
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box>
              {isFetching || loading ? (
                <Box className="loading-animation">
                  <LeefLottieAnimationLoader
                    height={200}
                    width={180}
                  ></LeefLottieAnimationLoader>
                </Box>
              ) : ruleJobDetailsInternalServerError ||
                somethingWentWrongInRuleJobDetails ? (
                <>
                  {ruleJobDetailsInternalServerError && (
                    <Error500Animation
                      height={400}
                      width={400}
                    ></Error500Animation>
                  )}
                  {somethingWentWrongInRuleJobDetails && (
                    <ErrorFallback
                      error={apiResponseChangeMessage}
                      resetErrorBoundary={() => window.location.reload()}
                    />
                  )}
                </>
              ) : (
                <Card {...props}>
                  {emailStatus && (
                    <CommunicationStatusStats
                      status={ruleJobDetailsData?.email_status}
                      item={"email"}
                    ></CommunicationStatusStats>
                  )}
                  {smsStatus && (
                    <CommunicationStatusStats
                      status={ruleJobDetailsData?.sms_status}
                      item={"sms"}
                    ></CommunicationStatusStats>
                  )}
                  {whatsAppStatus && (
                    <CommunicationStatusStats
                      status={ruleJobDetailsData?.whatsapp_status}
                      item={"whatsapp"}
                    ></CommunicationStatusStats>
                  )}
                  <CardHeader
                    sx={{ flexWrap: "wrap", padding: "18px 16px" }}
                    title={
                      <TableDataCount
                        totalCount={totalRuleJobDetailsCount}
                        currentPageShowingCount={ruleJobDetails.length}
                        pageNumber={pageNumber}
                        rowsPerPage={rowsPerPage}
                      />
                    }
                    action={
                      <Box className="consumption_main">
                        {ruleJobDetailsData?.email_status && (
                          <Box
                            style={{
                              backgroundColor: `${
                                emailStatus ? "#607d8b" : "white"
                              }`,
                            }}
                            className="consumption_box emailStatus_main"
                            onClick={() => {
                              setEmailStatus(!emailStatus);
                              setSmsStatus(false);
                              setWhatsAppStatus(false);
                            }}
                          >
                            <IconButton data-testid="communication-log-Email-button">
                              <EmailRounded fontSize="small" color="warning" />
                            </IconButton>
                            <Typography
                              variant="body2"
                              color={emailStatus ? "white" : "warning.main"}
                              sx={{ fontWeight: `${emailStatus && "bold"}` }}
                              className="e_consumption_txt"
                            >
                              Email Status
                            </Typography>
                          </Box>
                        )}

                        {ruleJobDetailsData?.sms_status && (
                          <Box
                            className="consumption_box emailStatus_main"
                            style={{
                              backgroundColor: `${
                                smsStatus ? "#607d8b" : "white"
                              }`,
                            }}
                            onClick={() => {
                              setSmsStatus(!smsStatus);
                              setEmailStatus(false);
                              setWhatsAppStatus(false);
                            }}
                          >
                            <IconButton>
                              <ForumRounded fontSize="small" color="primary" />
                            </IconButton>
                            <Typography
                              variant="body2"
                              color={smsStatus ? "white" : "primary"}
                              className="e_consumption_txt"
                              sx={{ fontWeight: `${smsStatus && "bold"}` }}
                            >
                              SMS Status
                            </Typography>
                          </Box>
                        )}

                        {ruleJobDetailsData?.whatsapp_status && (
                          <Box
                            className="consumption_box emailStatus_main"
                            style={{
                              backgroundColor: `${
                                whatsAppStatus ? "#607d8b" : "white"
                              }`,
                            }}
                            onClick={() => {
                              setWhatsAppStatus(!whatsAppStatus);
                              setSmsStatus(false);
                              setEmailStatus(false);
                            }}
                          >
                            <IconButton>
                              <WhatsApp fontSize="small" color="success" />
                            </IconButton>
                            <Typography
                              variant="body2"
                              color={whatsAppStatus ? "white" : "success.main"}
                              className="e_consumption_txt"
                              sx={{ fontWeight: `${whatsAppStatus && "bold"}` }}
                            >
                              Whatsapp Status
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                  {ruleJobDetails.length > 0 ? (
                    <TableContainer className="custom-scrollbar">
                      <Table sx={{ minWidth: 700 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <Checkbox
                                color="info"
                                checked={selectTopCheckbox}
                                onChange={(e) => handleAllCheckbox(e)}
                                indeterminate={showIndeterminate}
                              />
                            </TableCell>
                            <TableCell align="center">Automation ID</TableCell>
                            <TableCell align="center">Job ID</TableCell>
                            <TableCell align="center">Type</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">To</TableCell>
                            <TableCell align="center">Execution Date</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {ruleJobDetails?.map((cumData, i) => (
                            <TableRow
                              key={i}
                              sx={{
                                backgroundColor:
                                  cumData.status.toLowerCase() !== "success" &&
                                  "error.moreLight",
                                borderLeft: selectedItems?.includes(
                                  cumData?.index_number
                                )
                                  ? "1px solid blue"
                                  : "none",
                              }}
                            >
                              <TableCell>
                                {selectedItems?.includes(
                                  cumData?.index_number
                                ) ? (
                                  <IconButton
                                    sx={{ p: "9px" }}
                                    onClick={() => {
                                      handleApplicationCheckBox(
                                        {
                                          target: {
                                            checked: false,
                                          },
                                        },
                                        cumData
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
                                      selectedItems?.includes(
                                        cumData?.index_number
                                      )
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => {
                                      handleApplicationCheckBox(e, cumData);
                                    }}
                                  />
                                )}
                              </TableCell>
                              <TableCell align="center">
                                {cumData?.rule_id}
                              </TableCell>
                              <TableCell align="center">
                                {cumData?.job_id}
                              </TableCell>
                              <TableCell align="center">
                                <Typography
                                  variant="body2"
                                  className={`${
                                    cumData?.action_type?.toLowerCase() ===
                                    "email"
                                      ? "fifth-design"
                                      : cumData?.action_type?.toLowerCase() ===
                                        "sms"
                                      ? "sixth-design"
                                      : cumData?.action_type?.toLowerCase() ===
                                          "whatsapp" && "third-design"
                                  } card`}
                                >
                                  {cumData?.action_type
                                    ? cumData?.action_type
                                    : `– –`}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                {cumData.name ? cumData.name : "--"}
                              </TableCell>
                              <TableCell align="center">
                                <Typography>
                                  {cumData?.email_id ? cumData?.email_id : "--"}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                {cumData.communication_date
                                  ? cumData.communication_date
                                  : "--"}
                              </TableCell>
                              <TableCell align="center">
                                <Typography
                                  variant="subtitle2"
                                  color={
                                    cumData.status.toLowerCase() === "success"
                                      ? "success.main"
                                      : "error.main"
                                  }
                                >
                                  {cumData.status ? cumData.status : "--"}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  onClick={() =>
                                    handleDownload({
                                      email_id: [cumData?.email_id],
                                      action_type: [cumData?.action_type],
                                    })
                                  }
                                  aria-label="more"
                                  id="long-button"
                                >
                                  <DownloadIcon fontWeight="bold" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box className="not-found-animation">
                      <BaseNotFoundLottieLoader
                        height={250}
                        width={250}
                      ></BaseNotFoundLottieLoader>
                    </Box>
                  )}
                  {ruleJobDetails.length > 0 && (
                    <Box className="pagination-container-rule-details">
                      <Pagination
                        className="pagination-bar"
                        currentPage={pageNumber}
                        totalCount={rowCount}
                        pageSize={rowsPerPage}
                        onPageChange={(page) =>
                          handleChangePage(
                            page,
                            `allRuleJobDetailsPageNo`,
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
                        localStorageChangeRowPerPage={`allRuleJobDetailsRowPerPage`}
                        localStorageChangePage={`allRuleJobDetailsPageNo`}
                        setRowsPerPage={setRowsPerPage}
                      ></AutoCompletePagination>
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
        selectedItems={selectedAutomationCommunicationLogs}
        from="communication-log-details"
      />
    </Box>
  );
}

export default CommunicationLogDetails;
