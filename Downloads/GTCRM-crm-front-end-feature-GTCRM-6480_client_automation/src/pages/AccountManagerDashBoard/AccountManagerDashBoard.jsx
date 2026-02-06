import React, { useContext, useEffect, useState } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Paper,
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
import { useSelector } from "react-redux";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import "../../styles/sharedStyles.css";
import "../../styles/managementDashboard.css";
import "../../styles/DataSegmentRecordsTable.css";
import Pagination from "../../components/shared/Pagination/Pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import { accountManagerTableHeadList } from "../../constants/LeadStageList";
import "../../styles/UserSession.css";
import { Popover, Whisper } from "rsuite";
import CustomTooltip from "../../components/shared/Popover/Tooltip";
import {
  useAssignClientMutation,
  useGetAccountManagerDashboardDataQuery,
  useGetAllClientsDataQuery,
  usePrefetch,
} from "../../Redux/Slices/clientOnboardingSlice";
import { handleChangePage } from "../../helperFunctions/pagination";

const AccountManagerDashBoard = () => {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  const [isMapDone, setIsMapDone] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState();
  const count = Math.ceil(rowCount / pageSize);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [skipCallClientsAPI, setSkipCallClientsAPI] = useState(true);
  const [clientsList, setClientsList] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
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
  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  //Get table api call here
  const { data, isSuccess, isError, error, isFetching } =
    useGetAccountManagerDashboardDataQuery({
      collegeId,
      pageNumber: pageNumber,
      rowsPerPage: pageSize,
    });
  React.useEffect(() => {
    try {
      if (isSuccess) {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data?.data) {
          try {
            if (Array.isArray(data?.data)) {
              setRowCount(data?.total);
              setApplications(data?.data);
            } else {
              throw new Error(
                "Get Account Manager Dashboard API response has changed"
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
  const prefetchAccountManager = usePrefetch("getAccountManagerDashboardData");
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      pageSize,
      pageNumber,
      collegeId,
      prefetchAccountManager
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, prefetchAccountManager, pageSize, collegeId]);
  //assign client api implementation here
  const [
    somethingWentWrongInAssignClient,
    setSomethingWentWrongInAssignClient,
  ] = useState(false);
  const [assignClientInternalServerError, setAssignClientInternalServerError] =
    useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignClientList] = useAssignClientMutation();
  const handleUserStatusUpdate = (e) => {
    e.preventDefault();
    const modifyData = selectedClients?.map((item) => item?.value);
    const payload = {
      client_ids: modifyData,
    };
    setAssignLoading(true);
    assignClientList({ accountManagerId: selectedApplication?._id, payload })
      .unwrap()
      .then((response) => {
        try {
          if (response.message) {
            pushNotification("success", response.message);
          } else {
            throw new Error("Assign Client API response has been changed.");
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInAssignClient,
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
            setAssignClientInternalServerError,
            "",
            10000
          );
        }
      })
      .finally(() => {
        setAssignLoading(false);
        setSelectedClients([]);
      });
  };

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
        value: item.client_id,
      }));
      if (modifyOptions?.length > 0) {
        setClientsList(modifyOptions);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCallClientsAPI, clientsApiCallInfo]);
  const speaker = (
    <Popover style={{ display: `${isMapDone ? "none" : "block"}` }}>
      <form onSubmit={handleUserStatusUpdate}>
        {assignLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <CircularProgress size={25} color="info" />
          </Box>
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Autocomplete
            multiple
            onOpen={() => setSkipCallClientsAPI(false)}
            loading={clientsApiCallInfo?.isFetching}
            disablePortal
            getOptionLabel={(option) => option?.label}
            options={clientsList}
            sx={{ width: 250 }}
            size="small"
            onChange={(_, value) => setSelectedClients(value)}
            renderInput={(params) => (
              <TextField
                required={selectedClients?.length === 0 ? true : false}
                size="small"
                color="info"
                {...params}
                label="Select Client"
              />
            )}
          />
          <Button size="small" variant="outlined" type="submit" color="info">
            Submit
          </Button>
        </Box>
      </form>
    </Popover>
  );
  //Account Manager dashboard Head Title add
  useEffect(() => {
    setHeadTitle("Account Manager Dashboard");
    document.title = "Account Manager Dashboard";
  }, [headTitle]);
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
      ></Box>
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
          somethingWentWrongInAllApplication ||
          somethingWentWrongInAssignClient ||
          assignClientInternalServerError ? (
            <Box>
              {(allApplicationInternalServerError ||
                assignClientInternalServerError) && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {(somethingWentWrongInAllApplication ||
                somethingWentWrongInAssignClient) && (
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
                          {accountManagerTableHeadList?.map((item, index) => {
                            return (
                              <TableCell
                                key={index}
                                align={item?.align}
                                width={item?.width}
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
                        {applications.map((dataRow, index) => {
                          return (
                            <TableRow key={dataRow?.student_id}>
                              <TableCell
                                className="table-row-sticky"
                                sx={{
                                  borderBottom: "1px solid #E6E8F0",
                                }}
                              >
                                {dataRow?.first_name
                                  ? `${dataRow?.first_name} ${dataRow?.middle_name} ${dataRow?.last_name}`
                                  : "– –"}
                              </TableCell>
                              <TableCell
                                align="left"
                                sx={{ borderBottom: "1px solid #E6E8F0" }}
                              >
                                {dataRow?.email ? dataRow?.email : "– –"}
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderBottom: "1px solid #E6E8F0" }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: "5px",
                                    alignItems: "center",
                                  }}
                                >
                                  {dataRow?.assigned_clients?.length > 0
                                    ? dataRow?.assigned_clients
                                        ?.slice(0, 2)
                                        .map((user, index) => (
                                          <span
                                            className="management-allocated-items"
                                            key={index}
                                          >
                                            {`${user?.client_name},`}
                                          </span>
                                        ))
                                    : `– –`}
                                  {dataRow?.assigned_clients?.length > 2 && (
                                    <CustomTooltip
                                      placement={"right"}
                                      color={true}
                                      description={
                                        <div>
                                          {" "}
                                          <ul style={{ padding: "10px" }}>
                                            {" "}
                                            {dataRow?.assigned_clients
                                              ?.slice(2)
                                              .map((user) => {
                                                return (
                                                  <li>{user?.client_name}</li>
                                                );
                                              })}
                                          </ul>
                                        </div>
                                      }
                                      component={
                                        <Box
                                          sx={{ borderRadius: 10 }}
                                          className="management-manager-course-length-box"
                                        >
                                          <Typography
                                            sx={{
                                              fontSize: "10px",
                                              color: "white",
                                            }}
                                          >{`+${
                                            dataRow?.assigned_clients?.slice(2)
                                              ?.length
                                          }`}</Typography>
                                        </Box>
                                      }
                                    />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderBottom: "1px solid #E6E8F0" }}
                              >
                                <div>
                                  <Whisper
                                    placement="bottom"
                                    controlId="control-id-click"
                                    trigger="click"
                                    speaker={speaker}
                                  >
                                    <div>
                                      <CustomTooltip
                                        description={
                                          <div>
                                            Click here and Assign Client
                                          </div>
                                        }
                                        component={
                                          <Button
                                            variant="outlined"
                                            color={"info"}
                                            className={
                                              "add-course-button-management"
                                            }
                                            size="small"
                                            onClick={() => {
                                              setSelectedApplication(dataRow);
                                            }}
                                          >
                                            {`Assign Client`}
                                          </Button>
                                        }
                                      />
                                    </div>
                                  </Whisper>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {applications?.length > 0 && (
                    <Box className="pagination-container-management-dashboard">
                      <Pagination
                        className="pagination-bar"
                        currentPage={pageNumber}
                        page={pageNumber}
                        totalCount={rowCount}
                        pageSize={pageSize}
                        onPageChange={(page) =>
                          handleChangePage(
                            page,
                            `accountManagerDashboardSavePageNo`,
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
                        localStorageChangeRowPerPage={`accountManagerDashboardRowPerPage`}
                        localStorageChangePage={`accountManagerDashboardSavePageNo`}
                        setRowsPerPage={setPageSize}
                      ></AutoCompletePagination>
                    </Box>
                  )}
                </>
              ) : (
                <BaseNotFoundLottieLoader
                  height={250}
                  width={250}
                ></BaseNotFoundLottieLoader>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default AccountManagerDashBoard;
