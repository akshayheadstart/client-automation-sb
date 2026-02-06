/* eslint-disable react-hooks/exhaustive-deps */
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  ClickAwayListener,
  Drawer,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetAllCourseListQuery,
  useGetAppliedUserPromoCodeQuery,
  usePrefetch,
} from "../../Redux/Slices/filterDataSlice";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import Pagination from "../../components/shared/Pagination/Pagination";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import SearchInputBox from "../../components/shared/forms/SearchInputBox";
import ApplicationHeader from "../../components/userProfile/ApplicationHeader";
import { organizeCourseFilterCourseSpecializationOption } from "../../helperFunctions/filterHelperFunction";
import { handleChangePage } from "../../helperFunctions/pagination";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import useDebounce from "../../hooks/useDebounce";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import useToasterHook from "../../hooks/useToasterHook";
import counsellorSearchIcon from "../../images/searchIcon.png";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/sharedStyles.css";
import "../../styles/voucherPromocodeManager.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
const AppliedPromoCodeDrawer = ({
  setSelectAppliedDrawerOpen,
  selectedPromoCodeInfo,
}) => {
  const StyledTableCell = useTableCellDesign();
  const [searchFieldToggle, setSearchFieldToggle] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearchText = useDebounce(search, 500);
  const [courseDetails, setCourseDetails] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState([]);
  const [skipCourseApiCall, setSkipCourseApiCall] = useState(true);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  // common api call functions
  const { handleFilterListApiCall } = useCommonApiCalls();
  const [hideCourseList, setHideCourseList] = useState(false);
  //get course list
  const courseListInfo = useGetAllCourseListQuery(
    { collegeId: collegeId },
    { skip: skipCourseApiCall }
  );
  useEffect(() => {
    if (!skipCourseApiCall) {
      const courseList = courseListInfo?.data?.data[0];
      handleFilterListApiCall(
        courseList,
        courseListInfo,
        setCourseDetails,
        setHideCourseList,
        organizeCourseFilterCourseSpecializationOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseListInfo, skipCourseApiCall]);
  const appliedDrawerRowsPerPage = localStorage.getItem(
    `${Cookies.get("userId")}appliedDrawerRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}appliedDrawerRowPerPage`)
      )
    : 5;
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(appliedDrawerRowsPerPage);
  const [rowCount, setRowCount] = useState(4);
  const count = Math.ceil(rowCount / pageSize);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  //new Code
  const [userProfileOpen, setUserProfileOpen] = React.useState(false);
  const handleOpenUserProfileDrawer = (key) => {
    setUserProfileOpen(true);
  };
  const [userDetailsStateData, setUserDetailsStateData] = useState({});
  // Applied lead API implementation
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const pushNotification = useToasterHook();
  const [appliedInternalServerError, setAppliedInternalServerError] =
    useState(false);
  const [somethingWentWrongInApplied, setSomethingWentWrongInApplied] =
    useState(false);
  const [isSkipCallApi, setIsSkipCallApi] = useState(false);
  const [appliedLeadData, setAppliedLeadData] = useState([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const appliedPayload = {
    program_name: selectedCourseIds,
    search: debouncedSearchText,
  };
  useEffect(() => {
    if (isSkipCallApi) {
      setSelectedCourseIds(selectedCourseId);
    }
  }, [isSkipCallApi]);
  const {
    data: appliedData,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetAppliedUserPromoCodeQuery({
    pageNumber: pageNumber,
    rowsPerPage: pageSize,
    collegeId: collegeId,
    promoCodeId: selectedPromoCodeInfo?._id,
    payload: appliedPayload,
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(appliedData?.data)) {
          setAppliedLeadData(appliedData?.data);
          setRowCount(appliedData?.total);
        } else {
          throw new Error("get all Applied Data API response has changed");
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setAppliedInternalServerError, "", 10000);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrongInApplied, "", 10000);
    } finally {
      setIsSkipCallApi(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isError, isSuccess, appliedData]);

  const prefetchAllAppliedData = usePrefetch("getAppliedUserPromoCode");
  useEffect(() => {
    apiCallFrontAndBackPage(
      appliedData,
      pageSize,
      pageNumber,
      collegeId,
      prefetchAllAppliedData,
      {
        promoCodeId: selectedPromoCodeInfo?._id,
        payload: appliedPayload,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedData, pageNumber, prefetchAllAppliedData, pageSize, collegeId]);
  return (
    <>
      <Box className="voucher-drawer-box-top">
        <Typography className="voucher-drawer-headline-text">
          PromoCode Details | {selectedPromoCodeInfo?.name}
        </Typography>
        <IconButton>
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setSelectAppliedDrawerOpen(false)}
          />
        </IconButton>
      </Box>
      <Box className="voucher-drawer-content-box">
        {somethingWentWrongInApplied || appliedInternalServerError ? (
          <Box>
            {appliedInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {somethingWentWrongInApplied && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </Box>
        ) : (
          <>
            {isFetching ? (
              <Box className="voucher-promoCode-loader-container">
                <LeefLottieAnimationLoader width={100} height={100} />
              </Box>
            ) : (
              <>
                <Box className="data-segment-select-box-search">
                  <Box sx={{ display: "flex", gap: "5px" }}>
                    <Box sx={{ mb: 1 }}>
                      <ClickAwayListener
                        onClickAway={() => setSearchFieldToggle(false)}
                      >
                        <Box>
                          {!searchFieldToggle ? (
                            <img
                              onClick={() => setSearchFieldToggle(true)}
                              src={counsellorSearchIcon}
                              alt=""
                              srcset=""
                              height={"38px"}
                            />
                          ) : (
                            <SearchInputBox
                              setSearchText={setSearch}
                              searchText={search}
                              className={"button-design-counsellor-search"}
                              maxWidth={200}
                            />
                          )}
                        </Box>
                      </ClickAwayListener>
                    </Box>
                  </Box>
                </Box>
                {appliedLeadData?.length > 0 ? (
                  <>
                    <TableContainer
                      sx={{ boxShadow: 0 }}
                      component={Paper}
                      className="custom-scrollbar"
                    >
                      <Table
                        sx={{ minWidth: 400 }}
                        aria-label="customized table"
                      >
                        <TableHead>
                          <TableRow
                            sx={{
                              borderBottom: "1px solid rgba(238, 238, 238, 1)",
                            }}
                          >
                            <TableCell className="applied-promoCode-table-border-box">
                              {" "}
                              Lead Name
                            </TableCell>
                            <TableCell className="applied-promoCode-table-border-box">
                              {" "}
                              {hideCourseList || (
                                <MultipleFilterSelectPicker
                                  style={{ width: "155px" }}
                                  placement="bottomEnd"
                                  placeholder="Program Name"
                                  className="applied-promoCode-filter-program-name"
                                  onChange={(value) => {
                                    setSelectedCourseId(value);
                                  }}
                                  pickerData={courseDetails}
                                  setSelectedPicker={setSelectedCourseId}
                                  pickerValue={selectedCourseId}
                                  loading={courseListInfo.isFetching}
                                  onOpen={() => setSkipCourseApiCall(false)}
                                  callAPIAgain={() =>
                                    setIsSkipCallApi((prev) => !prev)
                                  }
                                  onClean={() =>
                                    setIsSkipCallApi((prev) => !prev)
                                  }
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {appliedLeadData?.map((row, index) => (
                            <TableRow
                              sx={{
                                borderBottom:
                                  "1px solid rgba(238, 238, 238, 1)",
                              }}
                              key={index}
                            >
                              <StyledTableCell
                                bodyCellPadding={"16px 11px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="left"
                              >
                                <Typography
                                  className="promoCode-value-text-size promoCode-value-hover"
                                  onClick={() => {
                                    handleOpenUserProfileDrawer();
                                    setUserDetailsStateData({
                                      applicationId: row?.application_id,
                                      studentId: row?.student_id,
                                      eventType: "applied-promoCode",
                                    });
                                  }}
                                >{`${
                                  row.student_name ? row.student_name : "---"
                                }`}</Typography>
                                <Typography className="voucher-value-text-size-applicant">{`${
                                  row.custom_application_id
                                    ? row.custom_application_id
                                    : "---"
                                }`}</Typography>
                              </StyledTableCell>
                              <StyledTableCell
                                bodyCellPadding={"16px 11px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="left"
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: "5px",
                                    alignItems: "center",
                                  }}
                                >
                                  {row.course_name && row.spec_name
                                    ? `${row.course_name} in ${row.spec_name}`
                                    : row.course_name && !row.spec_name
                                    ? `${row.course_name} (No specialization)`
                                    : "---"}
                                </Box>
                              </StyledTableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box className="pagination-container-promoCode">
                      <Pagination
                        className="pagination-bar"
                        currentPage={pageNumber}
                        page={pageNumber}
                        totalCount={rowCount}
                        pageSize={pageSize}
                        onPageChange={(page) =>
                          handleChangePage(
                            page,
                            `appliedDrawerSavePageNo`,
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
                        localStorageChangeRowPerPage={`appliedDrawerRowPerPage`}
                        localStorageChangePage={`appliedDrawerSavePageNo`}
                        setRowsPerPage={setPageSize}
                      ></AutoCompletePagination>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      minHeight: "30vh",
                      alignItems: "center",
                    }}
                    data-testid="not-found-animation-container"
                  >
                    <BaseNotFoundLottieLoader
                      height={250}
                      width={250}
                    ></BaseNotFoundLottieLoader>
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Box>
      <Box className="select-data-segment-button-box">
        <Button
          sx={{ borderRadius: 50 }}
          variant="contained"
          size="medium"
          color="info"
          className={"view-profile-button"}
          onClick={() => {
            setSelectAppliedDrawerOpen(false);
          }}
        >
          Close
        </Button>
      </Box>
      {/* dreawer user profile */}
      <Drawer
        anchor={"right"}
        open={userProfileOpen}
        disableEnforceFocus={true}
        onClose={() => {
          setUserProfileOpen(false);
        }}
        className="vertical-scrollbar-drawer"
        sx={{ zIndex: 1300 }}
      >
        <Box className="user-profile-control-drawer-box-container">
          <ApplicationHeader
            userDetailsStateData={userDetailsStateData}
            viewProfileButton={true}
            setUserProfileOpen={setUserProfileOpen}
          ></ApplicationHeader>
        </Box>
      </Drawer>
    </>
  );
};

export default AppliedPromoCodeDrawer;
