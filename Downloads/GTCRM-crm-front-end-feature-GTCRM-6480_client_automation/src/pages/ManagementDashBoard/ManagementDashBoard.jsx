import React, { useContext, useEffect, useState } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import "../../styles/sharedStyles.css";
import "../../styles/managementDashboard.css";
import "../../styles/DataSegmentRecordsTable.css";
import "../../styles/CampaignManager.css";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import {
  managementStatusList,
  managementTableHeadList,
} from "../../constants/LeadStageList";
import "../../styles/UserSession.css";
import CustomTooltip from "../../components/shared/Popover/Tooltip";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CreateCollegeDialog from "./CreateCollegeDialog";
import CollegeUrlDialog from "./CollegeUrlDialog";
import useFetchCommonApi from "../../hooks/useFetchCommonApi";
import { Popover, Whisper } from "rsuite";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Pagination from "../../components/shared/Pagination/Pagination";
import { handleChangePage } from "../../helperFunctions/pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import { useSelector } from "react-redux";
import {
  useGetAllClientsDataQuery,
  useGetAllCollegesListQuery,
  useGetAllRequestOfQuery,
  useGetListCollegeQuery,
  useGetManagementDashboardDataQuery,
  usePrefetch,
  useUpdateCollegeStatusMutation,
} from "../../Redux/Slices/clientOnboardingSlice";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import {
  formatInput,
  formatLabel,
} from "../StudentTotalQueries/helperFunction";

const ManagementDashBoard = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const permissions = useSelector((state) => state.authentication.permissions);
  const [apiCallAgain, setAPICallAgain] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [isMapDone, setIsMapDone] = useState(false);
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  const [createCollageToggle, setCreateCollageToggle] = useState(false);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState({});
  const [
    somethingWentWrongInAllApplication,
    setSomethingWentWrongInAllApplication,
  ] = useState(false);
  const [
    allApplicationInternalServerError,
    setAllApplicationInternalServerError,
  ] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [selectedCollegeInfo, setSelectedCollegeInfo] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedFilterStatus, setSelectedFilterStatus] = useState([]);
  const [selectedFilterRequestOf, setSelectedFilterRequestOf] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState();
  const count = Math.ceil(rowCount / pageSize);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState([]);
  const [listOfCollege, setListOfCollege] = useState([]);
  const [skipCallClientsAPI, setSkipCallClientsAPI] = useState(true);
  const [skipCallCollegeAPI, setSkipCallCollegeAPI] = useState(true);
  const [clientsList, setClientsList] = useState([]);
  const [payloadOfData, setPayloadOfData] = useState({});
  //create college dialog state
  const [viewCollegeDialogOpen, setViewCollegeDialogOpen] =
    React.useState(false);
  const { currentUserDetails } = useFetchCommonApi();
  const handleViewCollegeDialogOpen = () => {
    setViewCollegeDialogOpen(true);
  };
  const handleViewCollegeDialogClose = () => {
    setViewCollegeDialogOpen(false);
  };
  //url dialog state
  const [urlCollegeDialogOpen, setUrlCollegeDialogOpen] = React.useState(false);

  const handleUrlCollegeDialogOpen = () => {
    setUrlCollegeDialogOpen(true);
  };

  const handleUrlCollegeDialogClose = () => {
    setUrlCollegeDialogOpen(false);
  };
  const [skipAPICall, setSkipAPICall] = useState(true);
  const [requestOfListData, setRequestOfListData] = useState([]);
  const [managementStatusInfo, setManagementStatusInfo] = useState([]);
  const requestOfListInfo = useGetAllRequestOfQuery(
    { collegeId: collegeId },
    {
      skip: skipAPICall,
    }
  );
  //get request type list
  useEffect(() => {
    if (!skipAPICall) {
      const requestOfList = requestOfListInfo?.data;
      if (requestOfList?.approval_status?.length > 0) {
        const approvedStatus = requestOfList?.approval_status?.map((item) => ({
          label: formatInput(item),
          value: item,
        }));
        setManagementStatusInfo(approvedStatus);
      }
      if (requestOfList?.approval_types?.length > 0) {
        const requestOfType = requestOfList?.approval_types?.map((item) => ({
          label: formatInput(item),
          value: item,
        }));
        setRequestOfListData(requestOfType);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipAPICall, requestOfListInfo]);
  //Management dashboard Head Title add
  useEffect(() => {
    setHeadTitle("Request Management Dashboard");
    document.title = "Request Management Dashboard";
  }, [headTitle]);
  const pushNotification = useToasterHook();
  const payloadForFilter = {
    approval_status: selectedFilterStatus,
    approval_type: selectedFilterRequestOf,
    client_ids: selectedClients,
    college_ids: selectedCollege,
  };
  useEffect(() => {
    if (
      selectedFilterRequestOf?.length > 0 ||
      selectedFilterStatus?.length > 0 ||
      selectedClients?.length > 0 ||
      selectedCollege?.length > 0
    ) {
      setPageNumber(1);
      setPayloadOfData(payloadForFilter);
    } else {
      setPayloadOfData({});
    }
  }, [apiCallAgain]);
  //Get table api call here
  const { data, isSuccess, isError, error, isFetching } =
    useGetManagementDashboardDataQuery({
      pageNumber: pageNumber,
      rowsPerPage: pageSize,
      payload: payloadOfData,
      collegeId: collegeId,
    });
  React.useEffect(() => {
    try {
      if (isSuccess) {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (Array.isArray(data?.data)) {
          try {
            if (Array.isArray(data?.data)) {
              setRowCount(data?.total);
              setApplications(data?.data);
            } else {
              throw new Error(
                "Get Management Dashboard API response has changed"
              );
            }
          } catch (error) {}
        } else if (data?.detail) {
          pushNotification("error", data?.detail);
        }
      } else if (isError) {
        if (error?.status === 500) {
          handleInternalServerError(
            setAllApplicationInternalServerError,
            "",
            10000
          );
        }
      }
    } catch (err) {
      setApiResponseChangeMessage(err);
      handleSomethingWentWrong(
        setSomethingWentWrongInAllApplication,
        "",
        10000
      );
    }
  }, [data, isSuccess, isError, error, isFetching]);
  // use react hook for prefetch data
  const prefetchManageMentData = usePrefetch("getManagementDashboardData");
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      pageSize,
      pageNumber,
      collegeId,
      prefetchManageMentData,
      { payload: payloadOfData }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, prefetchManageMentData, pageSize]);
  //Particular college status Update APi implementation here
  const [updateCollegeStatus] = useUpdateCollegeStatusMutation();
  const handleUserStatusUpdate = (e) => {
    e.preventDefault();
    setUpdateStatusLoading(true);
    updateCollegeStatus({
      approverId: selectedApplication?._id,
      status: selectedStatus?.toLowerCase(),
      payload: { remarks: remarks },
    })
      .unwrap()
      .then((response) => {
        try {
          if (response.message) {
            pushNotification("success", response.message);
          } else {
            throw new Error("Update College API response has been changed.");
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInAllApplication,
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
            setAllApplicationInternalServerError,
            "",
            10000
          );
        }
      })
      .finally(() => {
        setUpdateStatusLoading(false);
        setSelectedApplication({});
      });
  };
  const speaker = (
    <Popover style={{ display: `${isMapDone ? "none" : "block"}` }}>
      <form onSubmit={handleUserStatusUpdate}>
        {updateStatusLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <CircularProgress size={25} color="info" />
          </Box>
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Autocomplete
            disablePortal
            getOptionLabel={(option) => option.label}
            options={managementStatusList}
            sx={{ width: 200 }}
            size="small"
            onChange={(_, value) => setSelectedStatus(value.value)}
            renderInput={(params) => (
              <TextField
                required
                size="small"
                color="info"
                {...params}
                label="Status"
              />
            )}
          />
          <TextField
            required={selectedStatus === "reject" ? true : false}
            size="small"
            color="info"
            label="Type Remark"
            onChange={(e) => {
              setRemarks(e.target.value);
            }}
          />
          <Button size="small" variant="outlined" type="submit" color="info">
            Submit
          </Button>
        </Box>
      </form>
    </Popover>
  );

  const clientsApiCallInfo = useGetAllClientsDataQuery(
    {},
    {
      skip: skipCallClientsAPI,
    }
  );
  //get client list
  useEffect(() => {
    if (!skipCallClientsAPI) {
      const apiResponseList = clientsApiCallInfo?.data?.data;
      const modifyOptions = apiResponseList?.map((item) => ({
        label: item.client_name,
        value: item._id,
      }));
      if (modifyOptions?.length > 0) {
        setClientsList(modifyOptions);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCallClientsAPI, clientsApiCallInfo]);
  //get list of college
  const collegeApiCallInfo = useGetAllCollegesListQuery(
    {},
    {
      skip: skipCallCollegeAPI,
    }
  );

  useEffect(() => {
    if (!skipCallCollegeAPI) {
      const apiResponseList = collegeApiCallInfo?.data?.data;
      if (apiResponseList?.length > 0) {
        const modifyOptions = apiResponseList?.map((item) => ({
          label: item.name,
          value: item.college_id,
        }));
        setListOfCollege(modifyOptions);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCallCollegeAPI, collegeApiCallInfo]);
  return (
    <Box
      className="management-list-paper-box-container user-session-header-box-container"
      sx={{ mx: "25px" }}
    >
      <Box
        sx={{
          display: "grid",
          gap: "10px",
          placeItems: "end",
        }}
        className="user-manager-toggle-button-box"
      >
        <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {permissions?.["aefd607c"]?.features?.["86942672"]?.features?.[
            "a0a4942c"
          ]?.visibility && (
            <MultipleFilterSelectPicker
              className="select-picker"
              style={{ width: 200 }}
              placement={"bottomEnd"}
              onChange={(value) => {
                setSelectedClients(value);
              }}
              setSelectedPicker={setSelectedClients}
              pickerData={clientsList}
              loading={clientsApiCallInfo.isFetching}
              placeholder="Client"
              pickerValue={selectedClients}
              from="leadManager"
              onOpen={() => setSkipCallClientsAPI(false)}
              onClean={() => setAPICallAgain((prev) => !prev)}
              callAPIAgain={() => setAPICallAgain((prev) => !prev)}
            />
          )}
          <MultipleFilterSelectPicker
            className="select-picker"
            style={{ width: 200 }}
            placement={"bottomEnd"}
            onChange={(value) => {
              setSelectedCollege(value);
            }}
            setSelectedPicker={setSelectedCollege}
            pickerData={listOfCollege}
            loading={collegeApiCallInfo?.isFetching}
            placeholder="College"
            pickerValue={selectedCollege}
            from="leadManager"
            onOpen={() => {
              setSkipCallCollegeAPI(false);
            }}
            onClean={() => setAPICallAgain((prev) => !prev)}
            callAPIAgain={() => setAPICallAgain((prev) => !prev)}
          />
          <MultipleFilterSelectPicker
            className="select-picker"
            style={{ width: 200 }}
            onChange={(value) => {
              setSelectedFilterStatus(value);
            }}
            setSelectedPicker={setSelectedFilterStatus}
            pickerData={managementStatusInfo}
            placeholder="Status"
            pickerValue={selectedFilterStatus}
            loading={requestOfListInfo.isFetching}
            from="leadManager"
            callAPIAgain={() => setAPICallAgain((prev) => !prev)}
            onClean={() => setAPICallAgain((prev) => !prev)}
            onOpen={() => setSkipAPICall(false)}
          />
          <MultipleFilterSelectPicker
            className="select-picker"
            style={{ width: 200 }}
            onChange={(value) => {
              setSelectedFilterRequestOf(value);
            }}
            setSelectedPicker={setSelectedFilterRequestOf}
            pickerData={requestOfListData}
            placeholder="Request Of"
            pickerValue={selectedFilterRequestOf}
            loading={requestOfListInfo.isFetching}
            callAPIAgain={() => setAPICallAgain((prev) => !prev)}
            onClean={() => setAPICallAgain((prev) => !prev)}
            onOpen={() => setSkipAPICall(false)}
            from="leadManager"
          />
          {permissions?.["aefd607c"]?.features?.["86942672"]?.features?.[
            "5b1d8855"
          ]?.visibility && (
            <Button
              variant="contained"
              color="info"
              sx={{ borderRadius: 50 }}
              size="small"
              onClick={() => {
                handleViewCollegeDialogOpen();
                setCreateCollageToggle(true);
              }}
              disabled={currentUserDetails?.can_create_college ? false : true}
            >
              Create College
            </Button>
          )}
        </Box>
      </Box>
      {isFetching ? (
        <Box
          className="loading-animation-box"
          data-testid="loading-animation-container"
        >
          <LeefLottieAnimationLoader
            height={120}
            width={120}
          ></LeefLottieAnimationLoader>
        </Box>
      ) : (
        <>
          {allApplicationInternalServerError ||
          somethingWentWrongInAllApplication ? (
            <Box>
              {allApplicationInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrongInAllApplication && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </Box>
          ) : (
            <>
              {applications?.length > 0 ? (
                <>
                  <TableContainer
                    component={Paper}
                    className="custom-scrollbar"
                    sx={{ boxShadow: 0 }}
                  >
                    <Table sx={{ minWidth: 700 }}>
                      <TableHead sx={{ bgcolor: "#FFF" }}>
                        <TableRow sx={{ borderBottom: "1px solid #EEE" }}>
                          {managementTableHeadList?.map((item, index) => {
                            return (
                              <TableCell
                                key={index}
                                align={item?.align}
                                className={
                                  index === 0
                                    ? "table-cell-fixed management-list-table-head-item"
                                    : "management-list-table-head-item"
                                }
                              >
                                {item.name}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {applications?.map((dataRow, index) => {
                          return (
                            <TableRow key={dataRow?.student_id}>
                              <TableCell
                                className={`table-row-sticky college-name-text-design`}
                                onClick={() => {
                                  if (
                                    dataRow?.approval_type ===
                                    "college_onboarding"
                                  ) {
                                    handleUrlCollegeDialogOpen();
                                    setSelectedCollegeInfo(dataRow);
                                  }
                                }}
                                sx={{
                                  textDecoration:
                                    dataRow?.approval_type ===
                                    "college_onboarding"
                                      ? "underline"
                                      : "",
                                  cursor:
                                    dataRow?.approval_type ===
                                    "college_onboarding"
                                      ? "pointer"
                                      : "default",
                                }}
                              >
                                {dataRow?.submitted_by_name
                                  ? dataRow?.submitted_by_name
                                  : "– –"}
                              </TableCell>
                              <TableCell
                                align="left"
                                className="college-name-text-bottom"
                              >
                                {dataRow?.submitted_by_org_name
                                  ? dataRow?.submitted_by_org_name
                                  : "– –"}
                              </TableCell>
                              <TableCell
                                align="left"
                                className="college-name-text-bottom"
                              >
                                {dataRow?.submitted_by_email
                                  ? dataRow?.submitted_by_email
                                  : "– –"}
                              </TableCell>
                              <TableCell
                                align="center"
                                className="college-name-text-bottom"
                              >
                                {dataRow?.submitted_by_mobile
                                  ? dataRow?.submitted_by_mobile
                                  : "– –"}
                              </TableCell>
                              <TableCell
                                align="center"
                                className="college-name-text-bottom"
                              >
                                <div>
                                  <Whisper
                                    placement="bottom"
                                    controlId="control-id-click"
                                    trigger={
                                      dataRow?.can_approve_or_reject
                                        ? "click"
                                        : "none"
                                    }
                                    speaker={speaker}
                                  >
                                    <div>
                                      <CustomTooltip
                                        description={
                                          <div>
                                            {dataRow?.can_approve_or_reject
                                              ? "Click here and update Status"
                                              : "Status update permission not granted."}
                                          </div>
                                        }
                                        component={
                                          <Button
                                            variant="outlined"
                                            endIcon={<ArrowDropDownIcon />}
                                            color={
                                              dataRow?.status === "rejected"
                                                ? "error"
                                                : "info"
                                            }
                                            className={
                                              dataRow?.status === "rejected"
                                                ? "management-closed-status-box"
                                                : "add-course-button-management"
                                            }
                                            size="small"
                                            onClick={() => {
                                              setSelectedApplication(dataRow);
                                            }}
                                          >
                                            {dataRow?.status
                                              ? formatLabel(dataRow?.status)
                                              : `– –`}
                                          </Button>
                                        }
                                      />
                                    </div>
                                  </Whisper>
                                </div>
                              </TableCell>
                              <TableCell
                                align="center"
                                className="college-name-text-bottom"
                              >
                                {dataRow?.approval_type ? (
                                  <Typography className="management-request-of-text">
                                    {dataRow?.approval_type
                                      ? formatLabel(dataRow?.approval_type)
                                      : "--"}
                                  </Typography>
                                ) : (
                                  "– –"
                                )}
                              </TableCell>
                              <TableCell
                                align="center"
                                className="college-name-text-bottom"
                              >
                                <VisibilityOutlinedIcon
                                  onClick={() => {
                                    setSelectedApplication(dataRow);
                                    handleViewCollegeDialogOpen();
                                  }}
                                  sx={{ color: "#39A1D1", cursor: "pointer" }}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <BaseNotFoundLottieLoader
                  height={250}
                  width={250}
                ></BaseNotFoundLottieLoader>
              )}
              {applications?.length > 0 && (
                <Box className="pagination-container-campaign-manager">
                  <Pagination
                    className="pagination-bar"
                    currentPage={pageNumber}
                    page={pageNumber}
                    totalCount={rowCount}
                    pageSize={pageSize}
                    onPageChange={(page) =>
                      handleChangePage(
                        page,
                        `managementSavePageNo`,
                        setPageNumber
                      )
                    }
                    count={count}
                  />
                  <AutoCompletePagination
                    rowsPerPage={pageSize}
                    rowPerPageOptions={rowPerPageOptions}
                    setRowsPerPageOptions={setRowsPerPageOptions}
                    rowCount={rowCount}
                    page={pageNumber}
                    setPage={setPageNumber}
                    localStorageChangeRowPerPage={`managementRowPerPage`}
                    localStorageChangePage={`managementSavePageNo`}
                    setRowsPerPage={setPageSize}
                  ></AutoCompletePagination>
                </Box>
              )}
            </>
          )}
        </>
      )}
      {viewCollegeDialogOpen && (
        <CreateCollegeDialog
          viewCollegeDialogOpen={viewCollegeDialogOpen}
          handleViewCollegeDialogClose={handleViewCollegeDialogClose}
          selectedApplication={selectedApplication}
          createCollageToggle={createCollageToggle}
          setCreateCollageToggle={setCreateCollageToggle}
        />
      )}
      {urlCollegeDialogOpen && (
        <CollegeUrlDialog
          viewCollegeDialogOpen={urlCollegeDialogOpen}
          handleViewCollegeDialogClose={handleUrlCollegeDialogClose}
          selectedCollegeInfo={selectedCollegeInfo}
        />
      )}
    </Box>
  );
};

export default ManagementDashBoard;
