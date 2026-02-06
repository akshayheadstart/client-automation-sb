/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
  Container,
  Box,
  Card,
  Tooltip,
  IconButton,
} from "@mui/material";

import "../../styles/UserManager.css";
import Dialog from "@mui/material/Dialog";
import CreateUser from "./CreateUser";
import Cookies from "js-cookie";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../helperFunctions/pagination";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import useToasterHook from "../../hooks/useToasterHook";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import { handleSortingAScDes } from "../../helperFunctions/handleSortAscDes";
import {
  useGetUserManagerChartDataQuery,
  useGetUserManagerDataQuery,
  usePrefetch,
  useUpdateUserStatusMutation,
} from "../../Redux/Slices/applicationDataApiSlice";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import Pagination from "../../components/shared/Pagination/Pagination";
import { useSelector } from "react-redux";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import "../../styles/sharedStyles.css";
import UserManagerGraph from "./UserManagerGraph";
import UserManagerEditInfoDialog from "./UserManagerEditInfoDialog";
import CounsellorManager from "./CounsellorManager";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import editIcon from "../../images/editActionIcon.png";
import phoneIcon from "../../images/phone.png";
import emailIcon from "../../images/email1.png";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import SortIndicatorWithTooltip from "../../components/shared/SortIndicatorWithTooltip/SortIndicatorWithTooltip";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import {
  customFetch,
  formatLabel,
  handleSetSectionVisibility,
} from "../StudentTotalQueries/helperFunction";
import { useGetEmailTemplateUserRoleQuery } from "../../Redux/Slices/filterDataSlice";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import { organizeRolesOptions } from "../../helperFunctions/filterHelperFunction";
import { useGetAssociatedPermissionsRoleQuery } from "../../Redux/Slices/clientOnboardingSlice";
// column data
const columns = [
  { columnName: "Name", id: "name" },
  { columnName: "Contact Details", id: "email" },
  { columnName: "User Role", id: "role" },
  { columnName: "Institute Allocated", id: "college_name" },
  { columnName: "Created On", id: "created_on" },
  { columnName: "Last Active On", id: "last_accessed" },
  { columnName: "Status", id: "is_activated" },
];
const AddRemoveColumns = () => {
  const [openDialogue, setOpenDialogue] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [listOfUsers, setListOfUsers] = useState([]);
  const pushNotification = useToasterHook();
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const { handleFilterListApiCall } = useCommonApiCalls();
  const [skipUserRoleListApi, setSkipUserRoleListApi] = useState(true);
  const [userRoleList, setUserRoleList] = useState([]);
  const [selectedRoleType, setSelectedRoleType] = useState([]);
  //internal server error state
  const [userManagerInternalServerError, setUserManagerInternalServerError] =
    useState(false);
  const [hideUserManager, setHideUserManager] = useState(false);
  const [somethingWentWrongInUserManager, setSomethingWentWrongInUserManager] =
    useState(false);
  const [somethingWentWrongInDownload, setSomethingWentWrongInDownload] =
    useState(false);
  const [downloadInternalServerError, setDownloadInternalServerError] =
    useState(false);
  const [userStatusInternalServerError, setUserStatusInternalServerError] =
    useState(false);
  const [
    somethingWentWrongInUserStatusUpdate,
    setSomethingWentWrongInUserStatusUpdate,
  ] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  // states for pagination
  const applicationPageNo = localStorage.getItem(
    `${Cookies.get("userId")}allUserSavePageNo`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}allUserSavePageNo`)
      )
    : 1;

  const tableRowPerPage = localStorage.getItem(
    `${Cookies.get("userId")}allUserRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}allUserRowPerPage`)
      )
    : 25;
  const [pageNumber, setPageNumber] = useState(applicationPageNo);
  const [rowCount, setRowCount] = useState();
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(tableRowPerPage);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const count = Math.ceil(rowCount / rowsPerPage);

  const [isScrolledToCounselorManager, setIsScrolledToCounselorManager] =
    useState(false);
  const [counselorManagerRef, { entry: counselorManagerEntry }] =
    useIntersectionObserver();
  const isCounselorManagerVisible =
    counselorManagerEntry && counselorManagerEntry?.isIntersecting;
  //download all applications function
  const handleAllApplicationsDownload = () => {
    setLoading(true);
    customFetch(
      `${import.meta.env.VITE_API_BASE_URL}/user/download_data/${
        collegeId ? "?college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(token, "POST", JSON.stringify(selectedUsers))
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data?.file_url) {
          const expectedData = data?.file_url;
          try {
            if (typeof expectedData === "string") {
              window.open(data?.file_url);
              pushNotification("success", data?.message);
              setSelectedUsers([]);
              localStorage.removeItem(
                `${Cookies.get("userId")}adminSelectedUsers`
              );
            } else {
              throw new Error("download_data API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setSomethingWentWrongInDownload, "", 5000);
          }
        } else if (data?.detail) {
          pushNotification("error", data?.detail);
        }
      })
      .catch((error) => {
        handleInternalServerError(setDownloadInternalServerError, "", 5000);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleSetSectionVisibility(
      isCounselorManagerVisible,
      isScrolledToCounselorManager,
      setIsScrolledToCounselorManager
    );
  }, [isCounselorManagerVisible]);
  // set selected users in state from localstorage after reload
  useEffect(() => {
    const adminSelectedUsers = JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}adminSelectedUsers`)
    );
    if (adminSelectedUsers?.length > 0) {
      setSelectedUsers(adminSelectedUsers);
    }
  }, []);

  const [userMangerSortObj, setUserMangerSortObj] = useState({});
  const [isSkipCallAPi, setIsSkipCallApi] = useState(false);
  const [filterDataPayload, setFilterDataPayload] = useState([]);
  const {
    data: userManagerData,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetUserManagerDataQuery({
    pageNumber: pageNumber,
    rowsPerPage: rowsPerPage,
    collegeId: collegeId,
    userMangerSortObj: userMangerSortObj,
    payload: filterDataPayload,
  });
  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(userManagerData?.data)) {
          setListOfUsers(userManagerData?.data);
          setRowCount(userManagerData?.total);
          setTotalUserCount(userManagerData?.total);
          if (
            localStorage.getItem(
              `${Cookies.get("userId")}CurrentUserManagerSortedItemAndIndex`
            )
          ) {
            const sortingData = JSON.parse(
              localStorage.getItem(
                `${Cookies.get("userId")}CurrentUserManagerSortedItemAndIndex`
              )
            );
            if (sortingData.sort !== "default") {
              handleSortingAScDes(
                sortingData?.columnID,
                sortingData.sort,
                userManagerData.data,
                setLoading,
                setListOfUsers
              );
              localStorage.setItem(
                `${Cookies.get("userId")}userManagerSort${sortingData?.index}`,
                sortingData.sort
              );
            }
          }
        } else {
          throw new Error("get_details API response has changed");
        }
      }
      if (isError) {
        setListOfUsers([]);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setUserManagerInternalServerError,
            setHideUserManager,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInUserManager,
        setHideUserManager,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    error,
    isError,
    isSuccess,
    setApiResponseChangeMessage,
    userManagerData,
    filterDataPayload,
  ]);
  useEffect(() => {
    if (isSkipCallAPi) {
      setFilterDataPayload(selectedRoleType);
      setPageNumber(1);
    } else {
      setFilterDataPayload([]);
    }
  }, [isSkipCallAPi]);
  // use react hook for prefetch data
  const prefetchUserManagerDetails = usePrefetch("getUserManagerData");
  useEffect(() => {
    apiCallFrontAndBackPage(
      userManagerData,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchUserManagerDetails,
      { userMangerSortObj }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userManagerData, pageNumber, rowsPerPage]);

  const [updateUserStatus] = useUpdateUserStatusMutation();
  const handleActiveOrInactiveUser = (userId, isActive) => {
    updateUserStatus({ userId, isActive, collegeId })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              pushNotification("success", res?.message);
            } else {
              throw new Error("enable_or_disable API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInUserStatusUpdate,
              "",
              5000
            );
          }
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        }
      })
      .catch((error) => {
        handleInternalServerError(setUserStatusInternalServerError, "", 5000);
      });
  };

  const handleClickDialogueOpen = () => {
    setOpenDialogue(true);
  };
  const handleDialogueClose = () => {
    setOpenDialogue(false);
  };
  const [tabState, setTabState] = useState(1);
  const [openEditInfoDialog, setOpenEditInfoDialog] = React.useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = React.useState({});
  const handleClickEditInfoDialogOpen = () => {
    setOpenEditInfoDialog(true);
  };

  const handleEditInfoDialogClose = () => {
    setOpenEditInfoDialog(false);
  };
  const StyledTableCell = useTableCellDesign();
  const [classToggleCounsellorManager, setClassToggleCounsellorManager] =
    useState(false);
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //User Manager Head Title add
  useEffect(() => {
    setHeadTitle("User Manager");
    document.title = "User Manager";
    setClassToggleCounsellorManager(true);
  }, [headTitle]);
  const [sortColumn, setSortColumn] = useState("");

  const [sortType, setSortType] = useState(null); // asc or dsc or null
  //get user manager chart Data
  const [userChart, setUserChart] = useState({});
  const {
    data: userManagerChartData,
    isSuccess: chartIsSuccess,
    isFetching: chartIsFetching,
    error: chartError,
    isError: chartIsError,
  } = useGetUserManagerChartDataQuery(
    {
      collegeId: collegeId,
    },
    { skip: tabState === 2 ? false : true }
  );
  useEffect(() => {
    try {
      if (chartIsSuccess) {
        if (
          typeof userManagerChartData?.data === "object" &&
          userManagerChartData?.data !== null
        ) {
          setUserChart(userManagerChartData?.data);
        } else {
          throw new Error("get_chart Data API response has changed");
        }
      }
      if (chartIsError) {
        setListOfUsers([]);
        if (chartError?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (chartError?.data?.detail) {
          pushNotification("error", chartError?.data?.detail);
        }
        if (chartError?.status === 500) {
          handleInternalServerError(
            setUserManagerInternalServerError,
            setHideUserManager,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInUserManager,
        setHideUserManager,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    chartError,
    chartIsError,
    chartIsSuccess,
    setApiResponseChangeMessage,
    userManagerChartData,
  ]);
  //download all applications function
  const handleChartDownload = () => {
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/user/chart_info/?download_data=true&college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "POST")
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data?.file_url) {
          const expectedData = data?.file_url;
          try {
            if (typeof expectedData === "string") {
              window.open(data?.file_url);
              pushNotification("success", data?.message);
            } else {
              throw new Error("download_data API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setSomethingWentWrongInDownload, "", 5000);
          }
        } else if (data?.detail) {
          pushNotification("error", data?.detail);
        }
      })
      .catch((error) => {
        handleInternalServerError(setDownloadInternalServerError, "", 5000);
      });
  };

  //User Role List API implementation here
  const getEmailTemplateUserRole = useGetAssociatedPermissionsRoleQuery(
    { featureKey: "f8c83200" },
    { skip: skipUserRoleListApi }
  );
  useEffect(() => {
    if (!skipUserRoleListApi) {
      const roles = getEmailTemplateUserRole?.data?.data;
      if (roles?.length > 0) {
        const updatedUserList = roles?.map((user) => {
          return {
            label: formatLabel(user?.name),
            value: user?.name,
          };
        });
        setUserRoleList(updatedUserList);
      }
    }
  }, [getEmailTemplateUserRole, skipUserRoleListApi]);
  return (
    <>
      <Box sx={{ pl: "33px" }}></Box>
      <Card className="manager user-manager-header-box-container">
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item md={12} sm={12} xs={12}>
              <Box sx={{ backgrounColor: "#FFFFFF" }} className="header">
                <Box>
                  <Typography className="user-manager-headline-text">
                    User Manager
                  </Typography>
                  {tabState === 1 && (
                    <Typography sx={{ fontSize: "14px", color: "#9E9E9E" }}>
                      Total <span>{totalUserCount}</span> Records
                    </Typography>
                  )}
                </Box>
                <Box className="buttons_alignment">
                  <div>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      {tabState === 1 && (
                        <MultipleFilterSelectPicker
                          style={{ width: 150 }}
                          className="dashboard-select-picker"
                          setSelectedPicker={setSelectedRoleType}
                          pickerData={userRoleList}
                          placeholder="Select Role"
                          pickerValue={selectedRoleType}
                          maxHeight={150}
                          placement={"bottom"}
                          loading={getEmailTemplateUserRole.isFetching}
                          onOpen={() => {
                            setSkipUserRoleListApi(false);
                          }}
                          callAPIAgain={() => setIsSkipCallApi((prev) => !prev)}
                          onClean={() => setIsSkipCallApi((prev) => !prev)}
                        />
                      )}

                      <Box>
                        <Button
                          variant="contained"
                          color="info"
                          sx={{ borderRadius: 50, whiteSpace: "nowrap" }}
                          size="small"
                          onClick={handleClickDialogueOpen}
                          startIcon={
                            <AddOutlinedIcon sx={{ fontSize: "14px" }} />
                          }
                        >
                          Create User
                        </Button>
                      </Box>
                      <Box className="user-manager-table-tab-design-right-side-right-item">
                        <>
                          <Box
                            onClick={() => setTabState(1)}
                            className={
                              tabState === 1
                                ? "user-manager-left-Tab-design-active "
                                : "user-manager-left-Tab-design-inactive"
                            }
                          >
                            <Typography
                              sx={{
                                fontSize: "15px",
                                fontWeight: 500,
                                color: tabState === 1 ? "white" : "#bcbec0",
                              }}
                            >
                              <Typography
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "3px",
                                }}
                              >
                                <TableChartOutlinedIcon
                                  sx={{ fontSize: "20px" }}
                                />
                                <Typography>Tables</Typography>
                              </Typography>
                            </Typography>
                          </Box>
                          <Box
                            onClick={() => setTabState(2)}
                            className={
                              tabState === 2
                                ? "user-manager-right-Tab-design-active"
                                : "user-manager-right-Tab-design-inactive"
                            }
                          >
                            <Typography
                              sx={{
                                fontSize: "15px",
                                fontWeight: 500,
                                color: tabState === 2 ? "white" : "#bcbec0",
                              }}
                            >
                              <Typography
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "3px",
                                }}
                              >
                                <TimelineOutlinedIcon
                                  sx={{ fontSize: "20px" }}
                                />
                                <Typography>Charts</Typography>
                              </Typography>
                            </Typography>
                          </Box>
                        </>
                      </Box>
                      <IconButton
                        className="download-button-dashboard"
                        onClick={() => {
                          if (tabState === 2) {
                            handleChartDownload();
                          } else if (tabState === 1) {
                            handleAllApplicationsDownload();
                          }
                        }}
                        aria-label="Download"
                      >
                        <FileDownloadOutlinedIcon sx={{ color: "#39A1D1" }} />
                      </IconButton>
                    </Box>
                    <Dialog
                      onClose={handleDialogueClose}
                      aria-labelledby="customized-dialog-title"
                      open={openDialogue}
                      className="useMangerDialog"
                    >
                      <Box className="useManger">
                        <CreateUser
                          handleDialogClose={handleDialogueClose}
                          mid={12}
                        />
                      </Box>
                    </Dialog>
                  </div>
                </Box>
              </Box>
              {/* button */}
            </Grid>
          </Grid>
        </Container>
        {userManagerInternalServerError ||
        somethingWentWrongInUserManager ||
        somethingWentWrongInDownload ||
        downloadInternalServerError ||
        userStatusInternalServerError ||
        somethingWentWrongInUserStatusUpdate ? (
          <>
            {(userManagerInternalServerError ||
              downloadInternalServerError ||
              userStatusInternalServerError) && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {(somethingWentWrongInUserManager ||
              somethingWentWrongInDownload ||
              somethingWentWrongInUserStatusUpdate) && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </>
        ) : (
          <Box
            sx={{
              py: 2,
              px: 1,
              visibility: hideUserManager ? "hidden" : "visible",
            }}
          >
            <Grid item md={12} sm={12} xs={12}>
              {isFetching || loading || chartIsFetching ? (
                <Box className="loading-animation">
                  <LeefLottieAnimationLoader
                    height={200}
                    width={180}
                  ></LeefLottieAnimationLoader>
                </Box>
              ) : (
                <>
                  {tabState === 1 && (
                    <Card sx={{ boxShadow: 0 }}>
                      {listOfUsers?.length > 0 ? (
                        <TableContainer
                          component={Paper}
                          sx={{ width: "100%", boxShadow: 0 }}
                          className="custom-scrollbar"
                        >
                          <Table
                            sx={{ width: "100%", boxShadow: 0 }}
                            aria-label="a dense table"
                          >
                            <TableHead sx={{ backgroundColor: "#FFF" }}>
                              <TableRow sx={{ borderBottom: "1px solid #EEE" }}>
                                {columns?.map((col) => (
                                  <StyledTableCell key={col.id}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: "5px",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {col.columnName}{" "}
                                      {sortColumn === col.id ? (
                                        <SortIndicatorWithTooltip
                                          sortType={sortType}
                                          value={col.id}
                                          sortColumn={sortColumn}
                                          setSortType={setSortType}
                                          setSortColumn={setSortColumn}
                                          setSortObj={setUserMangerSortObj}
                                        />
                                      ) : (
                                        <SortIndicatorWithTooltip
                                          sortColumn={sortColumn}
                                          setSortType={setSortType}
                                          setSortColumn={setSortColumn}
                                          setSortObj={setUserMangerSortObj}
                                          value={col.id}
                                        />
                                      )}
                                    </Box>
                                  </StyledTableCell>
                                ))}

                                <StyledTableCell className="user-manager-head-text">
                                  Action
                                </StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {/* second row */}
                              {listOfUsers?.map((data) => (
                                <TableRow
                                  sx={{ borderBottom: "1px solid #EEE" }}
                                  key={data.user_id}
                                >
                                  <StyledTableCell
                                    component="th"
                                    scope="row"
                                    color="textPrimary"
                                  >
                                    <Box sx={{ width: "150px" }}>
                                      <Typography
                                        sx={{
                                          fontSize: "14px",
                                          maxWidth: "250px",
                                          overflowWrap: "break-word",
                                        }}
                                      >
                                        {data.user_name
                                          ? data.user_name
                                          : `– –`}
                                      </Typography>
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell
                                    className="data1"
                                    align="left"
                                  >
                                    <Box sx={{ display: "flex", gap: "5px" }}>
                                      <Box>
                                        <img
                                          src={emailIcon}
                                          alt=""
                                          width={"15px"}
                                        />
                                      </Box>
                                      <Typography
                                        sx={{
                                          fontSize: "14px",
                                          maxWidth: "250px",
                                          overflowWrap: "break-word",
                                        }}
                                      >
                                        {data.user_email
                                          ? data.user_email
                                          : `– –`}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", gap: "5px" }}>
                                      <img
                                        src={phoneIcon}
                                        alt=""
                                        width={"18px"}
                                      />
                                      <Typography sx={{ fontSize: "14px" }}>
                                        {data.mobile_number
                                          ? data.mobile_number
                                          : `– –`}
                                      </Typography>
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell
                                    sx={{ whiteSpace: "nowrap" }}
                                    className="data1"
                                    align="left"
                                  >
                                    {data.user_role ? data.user_role : `– –`}
                                  </StyledTableCell>
                                  <StyledTableCell
                                    className="data1"
                                    align="left"
                                  >
                                    {data.institute_allocated
                                      ? data.institute_allocated
                                      : `– –`}
                                  </StyledTableCell>
                                  <StyledTableCell
                                    sx={{ whiteSpace: "nowrap" }}
                                    className="data1"
                                    align="left"
                                  >
                                    {data.created_on
                                      ? new Date(
                                          data.created_on
                                        ).toLocaleString()
                                      : "---"}
                                  </StyledTableCell>
                                  <StyledTableCell
                                    align="left"
                                    sx={{ whiteSpace: "nowrap" }}
                                  >
                                    {data.last_active_on
                                      ? new Date(
                                          data.last_active_on
                                        ).toLocaleString()
                                      : "---"}
                                  </StyledTableCell>
                                  <StyledTableCell
                                    className="data1"
                                    align="left"
                                  >
                                    {data.status === "Active" ? (
                                      <Tooltip
                                        placement="left"
                                        title="Click here to Inactivate"
                                        arrow
                                      >
                                        <Button
                                          variant="outlined"
                                          size="small"
                                          className="add-status-course-button"
                                          color="info"
                                          onClick={() =>
                                            handleActiveOrInactiveUser(
                                              data.user_id,
                                              false
                                            )
                                          }
                                          sx={{ borderRadius: 50 }}
                                        >
                                          {data.status}
                                        </Button>
                                      </Tooltip>
                                    ) : (
                                      <Tooltip
                                        placement="left"
                                        title="Click here to Activate"
                                        arrow
                                      >
                                        <Button
                                          variant="outlined"
                                          size="small"
                                          className="add-status-course-button-inActive"
                                          onClick={() =>
                                            handleActiveOrInactiveUser(
                                              data.user_id,
                                              true
                                            )
                                          }
                                          sx={{ borderRadius: 50 }}
                                        >
                                          {data.status}
                                        </Button>
                                      </Tooltip>
                                    )}
                                  </StyledTableCell>
                                  <StyledTableCell
                                    sx={{ cursor: "pointer" }}
                                    align="left"
                                  >
                                    <img
                                      onClick={() => {
                                        handleClickEditInfoDialogOpen();
                                        setSelectedUserInfo(data);
                                      }}
                                      src={editIcon}
                                      alt=""
                                      srcset=""
                                    />
                                  </StyledTableCell>
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

                      {listOfUsers.length > 0 && (
                        <Box className="pagination-container-user-manager">
                          <Pagination
                            className="pagination-bar"
                            currentPage={pageNumber}
                            totalCount={rowCount}
                            pageSize={rowsPerPage}
                            onPageChange={(page) =>
                              handleChangePage(
                                page,
                                `allUserSavePageNo`,
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
                            localStorageChangeRowPerPage={`allUserRowPerPage`}
                            localStorageChangePage={`allUserSavePageNo`}
                            setRowsPerPage={setRowsPerPage}
                          ></AutoCompletePagination>
                        </Box>
                      )}
                      {openEditInfoDialog && (
                        <UserManagerEditInfoDialog
                          openEditInfoDialog={openEditInfoDialog}
                          handleEditInfoDialogClose={handleEditInfoDialogClose}
                          selectedUserInfo={selectedUserInfo}
                        ></UserManagerEditInfoDialog>
                      )}
                    </Card>
                  )}
                  {tabState === 2 && (
                    <>
                      <UserManagerGraph
                        userChart={userChart}
                      ></UserManagerGraph>
                    </>
                  )}
                </>
              )}
            </Grid>
          </Box>
        )}
      </Card>
      <Box
        sx={{ py: isScrolledToCounselorManager ? 0 : 0.5 }}
        ref={counselorManagerRef}
      >
        {isScrolledToCounselorManager && (
          <CounsellorManager
            classToggleCounsellorManager={classToggleCounsellorManager}
            headerShow={true}
          ></CounsellorManager>
        )}
      </Box>
    </>
  );
};

export default AddRemoveColumns;
