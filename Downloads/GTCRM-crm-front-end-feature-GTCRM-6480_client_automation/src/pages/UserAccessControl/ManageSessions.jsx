import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useState,
} from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import Cookies from "js-cookie";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import {
  useGetManageSessionListQuery,
  usePrefetch,
  useRevokeSessionMutation,
} from "../../Redux/Slices/applicationDataApiSlice";
import { useEffect } from "react";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleChangePage } from "../../helperFunctions/pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import { useSelector } from "react-redux";
import {
  colorList,
  colorListBorder,
  colorListColor,
} from "../../constants/ColorsClassName";
import Pagination from "../../components/shared/Pagination/Pagination";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";

const ManageSessions = forwardRef((...props) => {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  // states for pagination
  const PageNo = localStorage.getItem(
    `${Cookies.get("userId")}adminSelectedUserSessionPageNo`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}adminSelectedUserSessionPageNo`
        )
      )
    : 1;

  const tableRowPerPage = localStorage.getItem(
    `${Cookies.get("userId")}adminSelectedUserSessionRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}adminSelectedUserSessionRowPerPage`
        )
      )
    : 25;
  const [pageNumber, setPageNumber] = useState(PageNo);
  const [rowCount, setRowCount] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(tableRowPerPage);
  const count = Math.ceil(rowCount / rowsPerPage);

  const [manageSessionsList, setManageSessionsList] = useState([]);
  const [totalManageSessionsCount, setTotalManageSessionsCount] = useState(0);

  const [
    manageSessionInternalServerError,
    setManageSessionInternalServerError,
  ] = useState(false);
  const [hideManageSession, setHideManageSession] = useState(false);
  const [
    somethingWentWrongInManageSession,
    setSomethingWentWrongInManageSession,
  ] = useState(false);

  const pushNotification = useToasterHook();

  const {
    data: manageSessionData,
    isSuccess,
    isFetching,
    refetch,
    error,
    isError,
  } = useGetManageSessionListQuery({
    pageNumber: pageNumber,
    rowsPerPage: rowsPerPage,
    collegeId: collegeId,
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(manageSessionData?.data)) {
          setManageSessionsList(manageSessionData?.data);
          setTotalManageSessionsCount(manageSessionData?.total);
          setRowCount(manageSessionData.total);
        } else {
          throw new Error("manage session API response has changed");
        }
      }
      if (isError) {
        setTotalManageSessionsCount(0);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setManageSessionInternalServerError,
            setHideManageSession,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInManageSession,
        setHideManageSession,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isError, isSuccess, manageSessionData]);

  const callTheRefetchFunction = () => {
    refetch();
  };

  useImperativeHandle(props[1], () => ({
    callChildFunction: callTheRefetchFunction,
  }));

  // use react hook for prefetch data
  const prefetchAllManageSessionData = usePrefetch("getManageSessionList");
  useEffect(() => {
    apiCallFrontAndBackPage(
      manageSessionData,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchAllManageSessionData
    );
  }, [
    manageSessionData,
    pageNumber,
    prefetchAllManageSessionData,
    rowsPerPage,
    collegeId,
  ]);

  const [revokeUserSession] = useRevokeSessionMutation();

  const revokeSession = (sessionId) => {
    revokeUserSession({
      sessionId: sessionId,
    })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              pushNotification("success", res?.message);
            } else {
              throw new Error("revoke session API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInManageSession,
              "",
              5000
            );
          }
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        }
      })
      .catch(() => {
        handleInternalServerError(
          setManageSessionInternalServerError,
          "",
          5000
        );
      });
  };

  return (
    <Box>
      <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
        <CardHeader
          data-testid="card-header"
          sx={{ pb: 1.5, pt: 0, pl: 0 }}
          title={
            <TableDataCount
              totalCount={totalManageSessionsCount}
              currentPageShowingCount={manageSessionsList.length}
              pageNumber={pageNumber}
              rowsPerPage={rowsPerPage}
            />
          }
        ></CardHeader>
        {manageSessionInternalServerError ||
        somethingWentWrongInManageSession ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              minHeight: "55vh",
              alignItems: "center",
            }}
            data-testid="error-animation-container"
          >
            {manageSessionInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {somethingWentWrongInManageSession && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </Box>
        ) : (
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{ visibility: hideManageSession ? "hidden" : "visible" }}
          >
            {isFetching ? (
              <Box className="loading-animation-for-session">
                <LeefLottieAnimationLoader
                  height={120}
                  width={120}
                ></LeefLottieAnimationLoader>
              </Box>
            ) : (
              <Card>
                {manageSessionsList?.length > 0 ? (
                  <TableContainer
                    component={Paper}
                    className="custom-scrollbar"
                  >
                    <Table
                      sx={{
                        minWidth: 650,
                      }}
                      aria-label="a dense table"
                    >
                      <TableHead sx={{ backgroundColor: "#F2F9FE" }}>
                        <TableRow>
                          <TableCell align="left">Session ID</TableCell>
                          <TableCell align="center">Role</TableCell>
                          <TableCell align="center">Device Info</TableCell>
                          <TableCell align="center">IP Address</TableCell>
                          <TableCell align="center">Issued At</TableCell>
                          <TableCell align="center">Expiry Time</TableCell>
                          <TableCell align="center">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {manageSessionsList?.map((user, index) => (
                          <TableRow hover key={index}>
                            <TableCell component="th" scope="row">
                              <Typography>
                                {user?.user_email ? user?.user_email : `– –`}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography
                                className="user-session-role"
                                sx={{
                                  backgroundColor: `${
                                    user?.user_type === "Admin"
                                      ? colorList[0]
                                      : user?.user_type === "Super Admin"
                                      ? colorList[1]
                                      : user?.user_type === "Head Counselor"
                                      ? colorList[2]
                                      : user?.user_type === "Publisher Console"
                                      ? colorList[3]
                                      : user?.user_type === "Counselor"
                                      ? colorList[4]
                                      : user?.user_type === "Client Manager"
                                      ? colorList[5]
                                      : "none"
                                  }`,
                                  fontSize: "12px",

                                  border: `${
                                    user?.user_type === "Admin"
                                      ? `1px solid ${colorListBorder[0]}`
                                      : user?.user_type === "Super Admin"
                                      ? `1px solid ${colorListBorder[1]}`
                                      : user?.user_type === "Head Counselor"
                                      ? `1px solid ${colorListBorder[2]}`
                                      : user?.user_type === "Publisher Console"
                                      ? `1px solid ${colorListBorder[3]}`
                                      : user?.user_type === "Counselor"
                                      ? `1px solid ${colorListBorder[4]}`
                                      : user?.user_type === "Client Manager"
                                      ? `1px solid ${colorListBorder[5]}`
                                      : "none"
                                  }`,

                                  color: `${
                                    user?.user_type === "Admin"
                                      ? `${colorListColor[0]}`
                                      : user?.user_type === "Super Admin"
                                      ? `${colorListColor[1]}`
                                      : user?.user_type === "Head Counselor"
                                      ? `${colorListColor[2]}`
                                      : user?.user_type === "Publisher Console"
                                      ? `${colorListColor[3]}`
                                      : user?.user_type === "Counselor"
                                      ? `${colorListColor[4]}`
                                      : user?.user_type === "Client Manager"
                                      ? `${colorListColor[5]}`
                                      : "none"
                                  }`,
                                }}
                              >
                                {user?.user_type ? user?.user_type : `– –`}
                              </Typography>
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ maxWidth: "320px", wordWrap: "break-word" }}
                            >
                              <Typography>
                                {user?.device_info ? user?.device_info : `– –`}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ color: "blue" }} align="center">
                              {user?.ip_address ? user?.ip_address : `– –`}
                            </TableCell>
                            <TableCell align="center">
                              {user?.issued_at
                                ? new Date(user?.issued_at).toLocaleString()
                                : `– –`}
                            </TableCell>
                            <TableCell align="center">
                              {user?.expiry_time
                                ? new Date(user?.expiry_time).toLocaleString()
                                : `– –`}
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                onClick={() => revokeSession(user?._id)}
                                color="error"
                                size="small"
                                className="manage-session-action-button"
                                variant="outlined"
                              >
                                Revoke
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <BaseNotFoundLottieLoader
                    height={250}
                    width={250}
                  ></BaseNotFoundLottieLoader>
                )}
                {manageSessionsList?.length > 0 && (
                  <Box className="pagination-container-user-session">
                    <Pagination
                      className="pagination-bar"
                      currentPage={pageNumber}
                      totalCount={rowCount}
                      pageSize={rowsPerPage}
                      onPageChange={(page) =>
                        handleChangePage(
                          page,
                          `adminSelectedUserSessionPageNo`,
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
                      localStorageChangeRowPerPage={`adminSelectedUserSessionRowPerPage`}
                      localStorageChangePage={`adminSelectedUserSessionPageNo`}
                      setRowsPerPage={setRowsPerPage}
                    ></AutoCompletePagination>
                  </Box>
                )}
              </Card>
            )}
          </Grid>
        )}
      </Paper>
    </Box>
  );
});

export default ManageSessions;
