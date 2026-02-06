/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CardHeader,
  Card,
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import "../../styles/UserSession.css";
import Cookies from "js-cookie";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../helperFunctions/pagination";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import {
  useGetUserSessionDataQuery,
  usePrefetch,
} from "../../Redux/Slices/applicationDataApiSlice";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import useToasterHook from "../../hooks/useToasterHook";
import ManageSessionTypo from "../../components/ui/User-Access-Conreoll/ManageSessionTypo";
import Pagination from "../../components/shared/Pagination/Pagination";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tooltip from "@mui/material/Tooltip";
import ManageSessions from "./ManageSessions";
import SyncIcon from "@mui/icons-material/Sync";
import IconButton from "@mui/material/IconButton";
import { useSelector } from "react-redux";
import {
  colorList,
  colorListBorder,
  colorListColor,
} from "../../constants/ColorsClassName";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";

const UserSessions = () => {
  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  // states for pagination
  const applicationPageNo = localStorage.getItem(
    `${Cookies.get("userId")}adminSelectedManageSessionPageNo`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}adminSelectedManageSessionPageNo`
        )
      )
    : 1;

  const tableRowPerPage = localStorage.getItem(
    `${Cookies.get("userId")}adminSelectedManageSessionRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}adminSelectedManageSessionRowPerPage`
        )
      )
    : 25;
  const [pageNumber, setPageNumber] = useState(applicationPageNo);
  const [rowCount, setRowCount] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(tableRowPerPage);
  const count = Math.ceil(rowCount / rowsPerPage);

  const [userSessionsList, setUserSessionsList] = useState([]);
  const [totalUserSessionsCount, setTotalUserSessionsCount] = useState(0);
  const manageSessionRef = useRef();

  const [
    manageSessionInternalServerError,
    setManageSessionInternalServerError,
  ] = useState(false);
  const [hideManageSession, setHideManageSession] = useState(false);
  const [
    somethingWentWrongInManageSession,
    setSomethingWentWrongInManageSession,
  ] = useState(false);
  const [tabValue, setTabValue] = useState("1");

  const {
    data: userSessionData,
    isSuccess,
    isFetching,
    refetch,
    error,
    isError,
  } = useGetUserSessionDataQuery({
    pageNumber: pageNumber,
    rowsPerPage: rowsPerPage,
    collegeId: collegeId,
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(userSessionData?.data)) {
          setUserSessionsList(userSessionData?.data);
          setTotalUserSessionsCount(userSessionData?.total);
          setRowCount(userSessionData.total);
        } else {
          throw new Error("user_activity API response has changed");
        }
      }
      if (isError) {
        setTotalUserSessionsCount(0);
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
  }, [error, isError, isSuccess, userSessionData]);

  // use react hook for prefetch data
  const prefetchAllUserSessionData = usePrefetch("getUserSessionData");
  useEffect(() => {
    apiCallFrontAndBackPage(
      userSessionData,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchAllUserSessionData
    );
  }, [
    userSessionData,
    pageNumber,
    prefetchAllUserSessionData,
    rowsPerPage,
    collegeId,
  ]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //InterView list Head Title add
  useEffect(() => {
    setHeadTitle("User Session");
    document.title = "User Session";
  }, [headTitle]);
  return (
    <Box sx={{ px: 3, pb: 3 }} className="user-session-header-box-container">
      <TabContext value={tabValue}>
        <Box className="manage-session-heading">
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Sessions" value="1" />
            <Tab label="Manage Sessions" value="2" />
          </TabList>

          <Tooltip title="Refresh" placement="left" arrow>
            <IconButton>
              <SyncIcon
                sx={{ color: "#4A7ADC" }}
                onClick={() => {
                  tabValue === "1"
                    ? refetch()
                    : manageSessionRef?.current?.callChildFunction();
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
        <TabPanel sx={{ paddingTop: "3px", paddingX: 1 }} value="1">
          <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
            <CardHeader
              data-testid="card-header"
              sx={{ pb: 1.5, pt: 0, pl: 0 }}
              title={
                <TableDataCount
                  totalCount={totalUserSessionsCount}
                  currentPageShowingCount={userSessionsList.length}
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
                  <Error500Animation
                    height={400}
                    width={400}
                  ></Error500Animation>
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
                      height={200}
                      width={180}
                    ></LeefLottieAnimationLoader>
                  </Box>
                ) : (
                  <Card>
                    {userSessionsList.length > 0 ? (
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
                              <TableCell
                                data-testid="username"
                                align="left"
                                width={"15%"}
                              >
                                Username
                              </TableCell>
                              <TableCell align="center" width={"15%"}>
                                Role
                              </TableCell>
                              <TableCell align="center" width={"10%"}>
                                Email Id
                              </TableCell>
                              <TableCell align="center" width={"10%"}>
                                Source IP
                              </TableCell>
                              <TableCell align="left" width={"30%"}>
                                Last Activity
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {userSessionsList?.map((user, index) => (
                              <TableRow hover key={index}>
                                <TableCell component="th" scope="row">
                                  <Typography
                                    className="session-user-name"
                                    variant="subtitle1"
                                  >
                                    {user?.name ? user?.name : `– –`}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography
                                    className="user-session-role"
                                    sx={{
                                      backgroundColor: `${
                                        user?.role === "Admin"
                                          ? colorList[0]
                                          : user?.role === "Super Admin"
                                          ? colorList[1]
                                          : user?.role === "Head Counselor"
                                          ? colorList[2]
                                          : user?.role === "Publisher Console"
                                          ? colorList[3]
                                          : user?.role === "Counselor"
                                          ? colorList[4]
                                          : user?.role === "Client Manager"
                                          ? colorList[5]
                                          : "none"
                                      }`,
                                      fontSize: "12px",

                                      border: `${
                                        user?.role === "Admin"
                                          ? `1px solid ${colorListBorder[0]}`
                                          : user?.role === "Super Admin"
                                          ? `1px solid ${colorListBorder[1]}`
                                          : user?.role === "Head Counselor"
                                          ? `1px solid ${colorListBorder[2]}`
                                          : user?.role === "Publisher Console"
                                          ? `1px solid ${colorListBorder[3]}`
                                          : user?.role === "Counselor"
                                          ? `1px solid ${colorListBorder[4]}`
                                          : user?.role === "Client Manager"
                                          ? `1px solid ${colorListBorder[5]}`
                                          : "none"
                                      }`,

                                      color: `${
                                        user?.role === "Admin"
                                          ? `${colorListColor[0]}`
                                          : user?.role === "Super Admin"
                                          ? `${colorListColor[1]}`
                                          : user?.role === "Head Counselor"
                                          ? `${colorListColor[2]}`
                                          : user?.role === "Publisher Console"
                                          ? `${colorListColor[3]}`
                                          : user?.role === "Counselor"
                                          ? `${colorListColor[4]}`
                                          : user?.role === "Client Manager"
                                          ? `${colorListColor[5]}`
                                          : "none"
                                      }`,
                                    }}
                                  >
                                    {user?.role ? user?.role : `– –`}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  {user?.email_id ? user?.email_id : `– –`}
                                </TableCell>
                                <TableCell
                                  sx={{ color: "#F55A5A" }}
                                  align="center"
                                >
                                  {user?.ip_address ? user?.ip_address : `– –`}
                                </TableCell>
                                <TableCell align="left">
                                  {user?.last_activity ? (
                                    <Box>
                                      {user?.last_activity.split("[")[0]}
                                      <ManageSessionTypo
                                        typo={
                                          user?.last_activity
                                            .split("[")[1]
                                            .split("]")[0]
                                        }
                                      />
                                      {
                                        user?.last_activity
                                          .split("at")[0]
                                          .split("]")[1]
                                      }{" "}
                                      at &nbsp;
                                      <ManageSessionTypo
                                        typo={
                                          user?.last_activity
                                            .split("at")[1]
                                            .split("from source")[0]
                                        }
                                      />
                                      &nbsp; from source &nbsp;
                                      <ManageSessionTypo
                                        typo={
                                          user?.last_activity
                                            .split("at")[1]
                                            .split("from source")[1]
                                        }
                                      />
                                    </Box>
                                  ) : (
                                    `– –`
                                  )}
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
                    {userSessionsList.length > 0 && (
                      <Box className="pagination-container-user-session">
                        <Pagination
                          className="pagination-bar"
                          currentPage={pageNumber}
                          totalCount={rowCount}
                          pageSize={rowsPerPage}
                          onPageChange={(page) =>
                            handleChangePage(
                              page,
                              `adminSelectedManageSessionPageNo`,
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
                          localStorageChangeRowPerPage={`adminSelectedManageSessionRowPerPage`}
                          localStorageChangePage={`adminSelectedManageSessionPageNo`}
                          setRowsPerPage={setRowsPerPage}
                        ></AutoCompletePagination>
                      </Box>
                    )}
                  </Card>
                )}
              </Grid>
            )}
          </Paper>
        </TabPanel>
        <TabPanel sx={{ paddingTop: "3px", paddingX: 1 }} value="2">
          <ManageSessions ref={manageSessionRef} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default UserSessions;
