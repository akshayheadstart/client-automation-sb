import React, { useContext, useEffect, useState } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "../../styles/UserSession.css";
import "../../styles/sharedStyles.css";
import "../../styles/managementDashboard.css";
import "../../styles/CampaignManager.css";
import "../../styles/UserManager.css";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { useGetUserManagerPermissionDataQuery } from "../../Redux/Slices/clientOnboardingSlice";
import { useSelector } from "react-redux";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import Pagination from "../../components/shared/Pagination/Pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { userPermissionTableHeadList } from "../../constants/LeadStageList";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import AddPerMissionDialog from "./AddPerMissionDialog";
import { handleChangePage } from "../../helperFunctions/pagination";
const UserManagerPermission = () => {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [selectedUser, setSelectedUser] = useState({});
  const [
    somethingWentWrongInAllUserManagerPermission,
    setSomethingWentWrongInAllUserManagerPermission,
  ] = useState(false);
  const [
    userManagerPermissionInternalServerError,
    setUserManagerPermissionInternalServerError,
  ] = useState(false);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();
  const [applications, setApplications] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState();
  const count = Math.ceil(rowCount / pageSize);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [openAddPermission, setOpenAddPermission] = useState(false);
  const handleClickOpenAddPermission = () => {
    setOpenAddPermission(true);
  };

  const handleAddPermissionClose = () => {
    setOpenAddPermission(false);
  };
  //Get table api call here
  const { data, isSuccess, isError, error, isFetching } =
    useGetUserManagerPermissionDataQuery({pageNumber,pageSize});
  React.useEffect(() => {
    try {
      if (isSuccess) {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (Array.isArray(data?.data)) {
          try {
            if (Array.isArray(data?.data)) {
              setRowCount(data?.total?data?.total:10);
              setApplications(data?.data);
            } else {
              throw new Error(
                "Get user Manager permission API response has changed"
              );
            }
          } catch (error) {}
        } else if (data?.detail) {
          pushNotification("error", data?.detail);
        }
      } else if (isError) {
        if (error?.status === 500) {
          handleInternalServerError(
            setUserManagerPermissionInternalServerError,
            "",
            10000
          );
        }
      }
    } catch (err) {
      setApiResponseChangeMessage(err);
      handleSomethingWentWrong(
        setSomethingWentWrongInAllUserManagerPermission,
        "",
        10000
      );
    }
  }, [data, isSuccess, isError, error, isFetching]);
  //User Manager permission Head Title add
  useEffect(() => {
    setHeadTitle("User Manager Permission");
    document.title = "User Manager Permission";
  }, [headTitle]);
  return (
    <Box
      className="user-permission-list-paper-box-container user-session-header-box-container"
      sx={{ mx: "25px" }}
    >
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
          {userManagerPermissionInternalServerError ||
          somethingWentWrongInAllUserManagerPermission ? (
            <Box>
              {userManagerPermissionInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrongInAllUserManagerPermission && (
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
                          {userPermissionTableHeadList?.map((item, index) => {
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
                              >
                                {dataRow?.name ? dataRow?.name : "– –"}
                              </TableCell>
                              <TableCell
                                align="center"
                                className="college-name-text-bottom"
                              >
                                {dataRow?.user_name ? dataRow?.user_name : "– –"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className="college-name-text-bottom"
                              >
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{ borderRadius: 50 }}
                                  className="user-manager-add-permission"
                                  color="info"
                                  onClick={() => {
                                    handleClickOpenAddPermission();
                                    setSelectedUser(dataRow)
                                  }}
                                >
                                  Add Permission
                                </Button>
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
                        `userManagerPermissionSavePageNo`,
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
                    localStorageChangeRowPerPage={`userManagerPermissionRowPerPage`}
                    localStorageChangePage={`userManagerPermissionSavePageNo`}
                    setRowsPerPage={setPageSize}
                  ></AutoCompletePagination>
                </Box>
              )}
            </>
          )}
        </>
      )}
      {openAddPermission && (
        <AddPerMissionDialog
          openAddPermission={openAddPermission}
          handleAddPermissionClose={handleAddPermissionClose}
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser}
        />
      )}
    </Box>
  );
};

export default UserManagerPermission;
