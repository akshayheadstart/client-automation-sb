/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  IconButton,
  CardHeader,
  Button,
} from "@mui/material";
// Icons
import { Error } from "@mui/icons-material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import "../../styles/ApplicationManagerTable.css";
import "../../styles/ViewRawData.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { removeCookies } from "../../Redux/Slices/authSlice";
import { SelectPicker } from "rsuite";
import GetJsonDate from "../../hooks/GetJsonDate";
import { rawDataImportStatusList } from "../../constants/LeadStageList";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import useToasterHook from "../../hooks/useToasterHook";
import RawDataUploadHistoryTable from "./RawDataUploadHistoryTable";
import {
  useDownloadRawDataMutation,
  useGetRawDataUploadHitoryQuery,
  usePrefetch,
} from "../../Redux/Slices/applicationDataApiSlice";
import LeadActions from "../../components/ui/application-manager/LeadActions";
import Mail from "../../components/userProfile/Mail";
import SelectTemplateDialog from "../TemplateManager/SelectTemplateDialog";
import SmsAndWhatsapp from "../../components/userProfile/SmsAndWhatsapp";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import { handleDataFilterOption } from "../../helperFunctions/handleDataFilterOption";
import { dateFormatInDayMonthYear } from "../../components/Calendar/utils";
import DateRangePickerWithIcon from "../../components/shared/filters/IconDateRangePicker";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import { customFetch } from "../StudentTotalQueries/helperFunction";
const RawDataUploadHistory = ({
  state,
  setOpenDeleteModal,
  setSelectedHistoryId,
  setOpenAssignCounsellorDialog,
  px,
}) => {
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const authState = useSelector((state) => state.authentication.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (authState.detail) {
    dispatch(removeCookies());
    navigate("/page401");
  }
  const RAW_DATA_API_URL = "/manage/display_offline/";
  const LEAD_UPLOAD_API = "/manage/lead_upload_display_offline/";

  const [rawDataUploadHistory, setRawDataUploadHistory] = useState([]);
  const [openCol, setOpenCol] = useState(false);

  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);
  // states for pagination
  const applicationPageNo = localStorage.getItem(
    `${Cookies.get("userId")}${
      state?.from === "leadUpload"
        ? "leadDataUploadHistorySavePageNo"
        : "rawDataUploadHistorySavePageNo"
    }`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}${
            state?.from === "leadUpload"
              ? "leadDataUploadHistorySavePageNo"
              : "rawDataUploadHistorySavePageNo"
          }`
        )
      )
    : 1;

  const tableRowPerPage = localStorage.getItem(
    `${Cookies.get("userId")}${
      state?.from === "leadUpload"
        ? "leadDataUploadHistoryTableRowPerPage"
        : "rawDataUploadHistoryTableRowPerPage"
    }`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}${
            state?.from === "leadUpload"
              ? "leadDataUploadHistoryTableRowPerPage"
              : "rawDataUploadHistoryTableRowPerPage"
          }`
        )
      )
    : 25;
  const [pageNumber, setPageNumber] = useState(applicationPageNo);
  const [rowsPerPage, setRowsPerPage] = useState(tableRowPerPage);
  const [rowCount, setRowCount] = useState();

  const [totalRawDataUploadHistoryCount, setTotalRawDataUploadHistoryCount] =
    useState(0);

  // states for application filter
  const [rawDataUploadDateRange, setRawDataUploadDateRange] = useState([]);
  const [rawDataImportStatus, setRawDataImportStatus] = useState("");
  const [userList, setUserList] = useState([]);
  const [selectedImportById, setSelectedImportById] = useState([]);

  //state for internal server error
  const [
    somethingWentWrongInRawDataUploadHistory,
    setSomethingWentWrongInRawDataUploadHistory,
  ] = useState(false);
  const [hideRawDataUploadHistory, setHideRawDataUploadHistory] =
    useState(false);
  const [
    rawDataUploadHistoryInternalServerError,
    setRawDataUploadHistoryInternalServerError,
  ] = useState(false);
  const [hideUserList, setHideUserList] = useState(false);

  const [selectedRawDataUploadHistoryRow, setSelectedRawDataUploadHistoryRow] =
    useState([]);
  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);

  // filter loading and call state
  const [importedByLoading, setImportedByLoading] = useState(false);
  const [callImportedByApi, setCallImportedByApi] = useState(false);

  //mail component states
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const handleComposeClick = () => {
    setIsComposeOpen(true);
  };

  const handleComposerClose = () => {
    setIsComposeOpen(false);
  };

  //select sms template component
  const [openSelectTemplateDialog, setOpenSelectTemplateDialog] =
    useState(false);
  const [templateBody, setTemplateBody] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [smsDltContentId, setSmsDltContentId] = useState("");
  const [smsType, setSmsType] = useState("");
  const [smsSenderName, setSenderName] = useState("");
  const [templateType, setTemplateType] = useState("");
  const handleClickOpenSelectTemplate = (type) => {
    if (selectedRawDataUploadHistoryRow?.length === 0) {
      pushNotification("warning", "Please select applications");
    } else {
      setOpenSelectTemplateDialog(true);
      setTemplateType(type);
    }
  };

  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");

  const handleCloseSelectTemplate = () => {
    setOpenSelectTemplateDialog(false);
  };

  //sms
  const [openDialogsSms, setOpenDialogsSms] = React.useState(false);
  const handleClickOpenDialogsSms = () => {
    setOpenDialogsSms(true);
  };
  const handleCloseDialogsSms = () => {
    setOpenDialogsSms(false);
  };

  //whatsapp
  const [openDialogsWhatsApp, setOpenDialogsWhatsApp] = React.useState(false);
  const handleClickOpenDialogsWhatsApp = () => {
    if (selectedRawDataUploadHistoryRow?.length === 0) {
      pushNotification("warning", "Please select applications");
    } else {
      setOpenDialogsWhatsApp(true);
    }
  };
  const handleCloseDialogsWhatsApp = () => {
    setOpenDialogsWhatsApp(false);
  };

  useEffect(() => {
    if (setSelectedHistoryId) {
      setSelectedHistoryId(selectedRawDataUploadHistoryRow);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRawDataUploadHistoryRow]);

  useEffect(() => {
    if (callImportedByApi) {
      setImportedByLoading(true);
      customFetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/get_details/${
          collegeId ? "?college_id=" + collegeId : ""
        }`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) =>
          res.json().then((data) => {
            if (data?.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (data.code === 200) {
              try {
                if (Array.isArray(data?.data[0])) {
                  const listOfUsers = data?.data[0].map((item) => {
                    return { label: item.user_name, value: item.user_id };
                  });
                  setUserList(listOfUsers);
                } else {
                  throw new Error("user/get_details API response has changed");
                }
              } catch (error) {
                setApiResponseChangeMessage(error);
                setHideUserList(true);
                handleSomethingWentWrong(
                  setSomethingWentWrongInRawDataUploadHistory,
                  "",
                  5000
                );
              }
            } else if (data?.detail) {
              pushNotification("error", data?.detail);
            }
          })
        )
        .catch(() => {
          setHideUserList(true);
          handleInternalServerError(
            setRawDataUploadHistoryInternalServerError,
            "",
            5000
          );
        })
        .finally(() => setImportedByLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callImportedByApi]);

  let payloadForRawDataUploadHistory;

  if (rawDataImportStatus?.length > 0) {
    payloadForRawDataUploadHistory = {
      ...payloadForRawDataUploadHistory,
      import_status: rawDataImportStatus,
    };
  }
  if (selectedImportById?.length > 0) {
    payloadForRawDataUploadHistory = {
      ...payloadForRawDataUploadHistory,
      imported_by: selectedImportById,
    };
  }
  if (rawDataUploadDateRange?.length > 0) {
    payloadForRawDataUploadHistory = {
      ...payloadForRawDataUploadHistory,
      date_range: JSON.parse(GetJsonDate(rawDataUploadDateRange)),
    };
  }

  const [payloadOfUploadfRawData, setPayloadOfUploadfRawData] = useState(
    payloadForRawDataUploadHistory
  );

  const {
    data: rawDataUploadHistoryData,
    isSuccess,
    isFetching,
    refetch,
    error,
    isError,
  } = useGetRawDataUploadHitoryQuery({
    pageNumber: pageNumber,
    rowsPerPage: rowsPerPage,
    collegeId: collegeId,
    payloadOfUploadfRawData,
    apiUrl: state?.from === "leadUpload" ? LEAD_UPLOAD_API : RAW_DATA_API_URL,
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(rawDataUploadHistoryData?.data)) {
          setRawDataUploadHistory(rawDataUploadHistoryData?.data);
          setTotalRawDataUploadHistoryCount(rawDataUploadHistoryData?.total);
          setRowCount(rawDataUploadHistoryData?.total);
        } else {
          throw new Error(
            state?.from === "leadUpload"
              ? "display_offline API response has changed"
              : "Lead History API response has changed"
          );
        }
      }
      if (isError) {
        setTotalRawDataUploadHistoryCount(0);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setRawDataUploadHistoryInternalServerError,
            setHideRawDataUploadHistory,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInRawDataUploadHistory,
        setHideRawDataUploadHistory,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, error, isError, isSuccess, navigate, rawDataUploadHistoryData]);

  // use react hook for prefetch data
  const prefetchAllRawDataUploadHistory = usePrefetch("getRawDataUploadHitory");
  useEffect(() => {
    apiCallFrontAndBackPage(
      rawDataUploadHistoryData,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchAllRawDataUploadHistory,
      {
        payloadOfUploadfRawData,
        apiUrl:
          state?.from === "leadUpload" ? LEAD_UPLOAD_API : RAW_DATA_API_URL,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    rawDataUploadHistoryData,
    pageNumber,
    prefetchAllRawDataUploadHistory,
    rowsPerPage,
    payloadOfUploadfRawData,
    state,
  ]);
  // setting filter options from localStorage
  useEffect(() => {
    const filterOptions = JSON.parse(
      localStorage.getItem(
        `${Cookies.get("userId")}${
          state?.from === "leadUpload"
            ? "filterOptionsOfLeadDataUploadHistory"
            : "filterOptionsOfRawDataUploadHistory"
        }`
      )
    );

    if (filterOptions) {
      if (filterOptions?.rawDataImportStatus) {
        setRawDataImportStatus(filterOptions?.rawDataImportStatus);
      }
      if (filterOptions.selectedImportById) {
        filterOptions.selectedImportById && setCallImportedByApi(true);
        setSelectedImportById(filterOptions?.selectedImportById);
      }
      if (filterOptions?.dateRange) {
        const date = filterOptions?.dateRange?.map((range) => new Date(range));
        setRawDataUploadDateRange(date);
      }
    }
  }, [state?.from]);

  const setStartAndEndDate = (dates) => {
    const startDate = dateFormatInDayMonthYear(dates[0]);
    const endDate = dateFormatInDayMonthYear(dates[1]);
    setStartDateRange(startDate);
    setEndDateRange(endDate);
  };
  const { selectedSeason } = useContext(LayoutSettingContext);
  useEffect(() => {
    if (!rawDataUploadDateRange?.length && selectedSeason) {
      setStartAndEndDate([
        JSON.parse(selectedSeason)?.start_date,
        JSON.parse(selectedSeason)?.end_date,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawDataUploadDateRange, selectedSeason]);

  const handleUpdatePageNumber = () => {
    setPageNumber(1);
    localStorage.setItem(
      `${Cookies.get("userId")}${
        state?.from === "leadUpload"
          ? "leadDataUploadHistorySavePageNo"
          : "rawDataUploadHistorySavePageNo"
      }`,
      1
    );
  };
  const handleFilterOption = (value) => {
    const localStorageKayName =
      state?.from === "leadUpload"
        ? "filterOptionsOfLeadDataUploadHistory"
        : "filterOptionsOfRawDataUploadHistory";

    handleDataFilterOption(value, localStorageKayName);
  };

  const filterAndColumnOption = () => {
    return (
      <>
        <>
          {hideUserList || (
            <MultipleFilterSelectPicker
              handleFilterOption={(checkAll, allValue) =>
                handleFilterOption({
                  selectedImportById: checkAll ? allValue : [],
                })
              }
              onChange={(value) => {
                setSelectedImportById(value);
                handleFilterOption({ selectedImportById: value });
              }}
              pickerData={userList}
              placeholder="Imported by"
              pickerValue={selectedImportById}
              setSelectedPicker={setSelectedImportById}
              loading={importedByLoading}
              onOpen={() => setCallImportedByApi(true)}
            />
          )}
          <SelectPicker
            onChange={(value) => {
              handleFilterOption({ rawDataImportStatus: value });
              setRawDataImportStatus(value);
            }}
            data={rawDataImportStatusList}
            placeholder="Import status"
            value={rawDataImportStatus}
          />
          <IconButton className="filter-actions-button">
            <RestartAltIcon
              sx={{ transform: "rotate(90deg)" }}
              color="info"
              data-testid="reset-button"
              onClick={() => {
                localStorage.removeItem(
                  `${Cookies.get("userId")}${
                    state?.from === "leadUpload"
                      ? "filterOptionsOfLeadDataUploadHistory"
                      : "filterOptionsOfRawDataUploadHistory"
                  }`
                );
                setSelectedImportById([]);
                setRawDataImportStatus("");
                if (rawDataUploadDateRange?.length) {
                  setRawDataUploadDateRange([]);
                }
                setPayloadOfUploadfRawData({});
                refetch();
              }}
            />
          </IconButton>
          <DateRangePickerWithIcon
            onChange={(value) => {
              handleFilterOption({ dateRange: value });
              setRawDataUploadDateRange(value);
            }}
            dateRange={rawDataUploadDateRange}
          />

          <Button
            sx={{ borderRadius: "20px", px: 3 }}
            disabled={
              !localStorage.getItem(
                `${Cookies.get("userId")}${
                  state?.from === "leadUpload"
                    ? "filterOptionsOfLeadDataUploadHistory"
                    : "filterOptionsOfRawDataUploadHistory"
                }`
              ) &&
              (!selectedImportById?.length ||
                !rawDataImportStatus?.length ||
                !rawDataUploadDateRange?.length)
                ? true
                : false
            }
            onClick={() => {
              setSelectedRawDataUploadHistoryRow([]);
              if (pageNumber !== 1) {
                handleUpdatePageNumber();
              }
              setPayloadOfUploadfRawData(payloadForRawDataUploadHistory);
              if (rawDataUploadDateRange.length) {
                setStartAndEndDate(rawDataUploadDateRange);
              }
            }}
            variant="contained"
            size="small"
            color="info"
          >
            Apply
          </Button>
        </>
      </>
    );
  };
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Admin dashboard Head Title add
  useEffect(() => {
    setHeadTitle("Raw Data Upload History");
    document.title = "Raw Data Upload History";
  }, [headTitle]);

  const [downloadRawData] = useDownloadRawDataMutation();

  const handleDownloadRawData = () => {
    setIsDownloadLoading(true);
    downloadRawData({ collegeId, payload: selectedRawDataUploadHistoryRow })
      .unwrap()
      .then((response) => {
        try {
          if (response?.file_url) {
            window.open(response?.file_url);
            setSelectedRawDataUploadHistoryRow([]);
          } else if (response?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (response?.detail) {
            pushNotification("error", response?.detail);
          } else {
            throw new Error("Raw data download Api response has been changed");
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInRawDataUploadHistory,
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
        } else {
          handleInternalServerError(
            setRawDataUploadHistoryInternalServerError,
            "",
            10000
          );
        }
      })
      .finally(() => {
        setIsDownloadLoading(false);
      });
  };
  return (
    <Box
      component="main"
      className={`mainTable ${px && "view-raw-data-header-box-container"}`}
      sx={{ flexGrow: 1, py: 2, px: px }}
    >
      <Grid container>
        <Grid item md={12} sm={12} xs={12}>
          {/* {!state?.from && px && (
            <Box className="application-main">
              <Box className="application-content">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={() => navigate(-1)} aria-label="Example">
                    <ArrowBackIcon />
                  </IconButton>

                </Box>
              </Box>
            </Box>
          )} */}

          <Card sx={{ my: 1, p: 3 }} className="common-box-shadow">
            {somethingWentWrongInRawDataUploadHistory ||
            rawDataUploadHistoryInternalServerError ? (
              <>
                {somethingWentWrongInRawDataUploadHistory && (
                  <ErrorFallback
                    error={apiResponseChangeMessage}
                    resetErrorBoundary={() => window.location.reload()}
                  />
                )}
                {rawDataUploadHistoryInternalServerError && (
                  <Error500Animation
                    height={400}
                    width={400}
                  ></Error500Animation>
                )}
              </>
            ) : (
              <Box
                sx={{
                  visibility: hideRawDataUploadHistory ? "hidden" : "visible",
                }}
              >
                <Box className="filter-options-container">
                  <CardHeader
                    sx={{ py: 0, px: 0 }}
                    title={
                      <Box>
                        <Box className="lead-upload-history-title">
                          <Typography variant="h6">
                            {state?.from ? "Lead" : ""} Upload History
                          </Typography>
                          <Typography>
                            {startDateRange} - {endDateRange}
                          </Typography>
                        </Box>

                        <TableDataCount
                          totalCount={totalRawDataUploadHistoryCount}
                          currentPageShowingCount={rawDataUploadHistory.length}
                          pageNumber={pageNumber}
                          rowsPerPage={rowsPerPage}
                        />
                      </Box>
                    }
                  ></CardHeader>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {filterAndColumnOption()}
                  </Box>
                </Box>
                <Box>
                  <RawDataUploadHistoryTable
                    state={state}
                    loading={isFetching}
                    rowCount={rowCount}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    rawDataUploadHistory={rawDataUploadHistory}
                    openCol={openCol}
                    setOpenCol={setOpenCol}
                    page={pageNumber}
                    setPage={setPageNumber}
                    selectedRawDataUploadHistoryRow={
                      selectedRawDataUploadHistoryRow
                    }
                    setSelectedRawDataUploadHistoryRow={
                      setSelectedRawDataUploadHistoryRow
                    }
                    setIsScrolledToPagination={setIsScrolledToPagination}
                    localeStorageKey={
                      state?.from
                        ? "selectedLeadUploadHistoryRow"
                        : "selectedRawDataUploadHistoryRow"
                    }
                  />
                </Box>
              </Box>
            )}
          </Card>
        </Grid>
        <Grid item md={12} sm={12} xs={12}></Grid>
      </Grid>

      {selectedRawDataUploadHistoryRow?.length > 0 && (
        <LeadActions
          isDownloadLoading={isDownloadLoading}
          handleDownload={handleDownloadRawData}
          setOpenAssignCounsellorDialog={setOpenAssignCounsellorDialog}
          isScrolledToPagination={isScrolledToPagination}
          selectedApplications={selectedRawDataUploadHistoryRow?.length}
          setSelectedApplications={setSelectedRawDataUploadHistoryRow}
          localStorageKey={
            state?.from
              ? "selectedLeadUploadHistoryRow"
              : "selectedRawDataUploadHistoryRow"
          }
          isLeadUpload={state?.from ? true : false}
          setOpenDeleteModal={setOpenDeleteModal}
          handleClickOpenSelectTemplate={handleClickOpenSelectTemplate}
          handleSentWhatsapp={handleClickOpenDialogsWhatsApp}
          handleSendSms={() => handleClickOpenSelectTemplate("sms")}
          handleSentEmail={() => handleComposeClick()}
          smsEmailWhatsappPermission={state?.from ? false : true}
        />
      )}

      {/* send email */}
      <Box>
        <Mail
          open={isComposeOpen}
          hideToInputField={true}
          sendBulkEmail={true}
          onClose={handleComposerClose}
          selectedRawDataUploadHistoryRow={selectedRawDataUploadHistoryRow}
          setSelectedRawDataUploadHistoryRow={
            setSelectedRawDataUploadHistoryRow
          }
          localStorageKey={
            state?.from
              ? "selectedLeadUploadHistoryRow"
              : "selectedRawDataUploadHistoryRow"
          }
          from="raw-data"
        ></Mail>
      </Box>
      {/* select sms template component  */}
      {openSelectTemplateDialog && (
        <SelectTemplateDialog
          setTemplateId={setTemplateId}
          handleClickOpenDialogsSms={handleClickOpenDialogsSms}
          openDialoge={openSelectTemplateDialog}
          handleClose={handleCloseSelectTemplate}
          setTemplateBody={setTemplateBody}
          setSenderName={setSenderName}
          setSmsType={setSmsType}
          setSmsDltContentId={setSmsDltContentId}
          from={templateType}
        ></SelectTemplateDialog>
      )}
      {/* Send Sms  */}
      <Box>
        <SmsAndWhatsapp
          color="#DD34B8"
          name={"SMS"}
          handleClickOpenDialogs={handleClickOpenDialogsSms}
          handleCloseDialogs={handleCloseDialogsSms}
          openDialogs={openDialogsSms}
          setOpenDialogs={setOpenDialogsSms}
          templateBody={templateBody}
          setTemplateBody={setTemplateBody}
          smsDltContentId={smsDltContentId}
          smsType={smsType}
          smsSenderName={smsSenderName}
          from={"raw-data"}
          localStorageKey={
            state?.from
              ? "selectedLeadUploadHistoryRow"
              : "selectedRawDataUploadHistoryRow"
          }
          selectedRawDataUploadHistoryRow={selectedRawDataUploadHistoryRow}
          setSelectedRawDataUploadHistoryRow={
            setSelectedRawDataUploadHistoryRow
          }
        ></SmsAndWhatsapp>
      </Box>
      <Box>
        <SmsAndWhatsapp
          templateId={templateId}
          color="#25D366"
          name={"WhatsApp"}
          handleClickOpenDialogs={handleClickOpenDialogsWhatsApp}
          handleCloseDialogs={handleCloseDialogsWhatsApp}
          openDialogs={openDialogsWhatsApp}
          setOpenDialogs={setOpenDialogsWhatsApp}
          templateBody={templateBody}
          setTemplateBody={setTemplateBody}
          handleClickOpenSelectTemplate={handleClickOpenSelectTemplate}
          from={"raw-data"}
          localStorageKey={
            state?.from
              ? "selectedLeadUploadHistoryRow"
              : "selectedRawDataUploadHistoryRow"
          }
          selectedRawDataUploadHistoryRow={selectedRawDataUploadHistoryRow}
          setSelectedRawDataUploadHistoryRow={
            setSelectedRawDataUploadHistoryRow
          }
        ></SmsAndWhatsapp>
      </Box>
    </Box>
  );
};

export default RawDataUploadHistory;
