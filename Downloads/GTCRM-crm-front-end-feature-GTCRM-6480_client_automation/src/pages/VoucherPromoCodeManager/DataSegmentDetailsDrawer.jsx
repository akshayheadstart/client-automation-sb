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
  useGetDataSegmentDetailsTableDataQuery,
  usePrefetch,
} from "../../Redux/Slices/applicationDataApiSlice";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Pagination from "../../components/shared/Pagination/Pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import SearchInputBox from "../../components/shared/forms/SearchInputBox";
import ApplicationHeader from "../../components/userProfile/ApplicationHeader";
import { handleChangePage } from "../../helperFunctions/pagination";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useDebounce from "../../hooks/useDebounce";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import useToasterHook from "../../hooks/useToasterHook";
import counsellorSearchIcon from "../../images/searchIcon.png";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/sharedStyles.css";
import "../../styles/voucherPromocodeManager.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
const DataSegmentDetailsDrawer = ({
  setDataSegmentDetailsDrawerOpen,
  selectedDataSegmentInfo,
}) => {
  const [userProfileOpen, setUserProfileOpen] = React.useState(false);
  const handleOpenUserProfileDrawer = (key) => {
    setUserProfileOpen(true);
  };
  const StyledTableCell = useTableCellDesign();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [searchFieldToggle, setSearchFieldToggle] = useState(false);
  const dataSegmentDrawerPageNumber = localStorage.getItem(
    `${Cookies.get("userId")}dataSegmentDetailsPromoCodeSavePageNo`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}dataSegmentDetailsPromoCodeSavePageNo`
        )
      )
    : 1;
  const dataSegmentDrawerRowsPerPage = localStorage.getItem(
    `${Cookies.get("userId")}dataSegmentDetailsPromoCodeRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}dataSegmentDetailsPromoCodeRowPerPage`
        )
      )
    : 5;
  const [pageNumber, setPageNumber] = useState(dataSegmentDrawerPageNumber);
  const [pageSize, setPageSize] = useState(dataSegmentDrawerRowsPerPage);
  const [rowCount, setRowCount] = useState();
  const count = Math.ceil(rowCount / pageSize);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [search, setSearch] = useState("");
  const debouncedSearchText = useDebounce(search, 500);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const pushNotification = useToasterHook();
  const [userDetailsStateData, setUserDetailsStateData] = useState({});
  const [dataSegmentLeadData, setDataSegmentLeadData] = useState([]);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const { data, isError, error, isFetching, isSuccess } =
    useGetDataSegmentDetailsTableDataQuery({
      collegeId,
      dataSegmentId: selectedDataSegmentInfo?.data_segment_id,
      pageNumber,
      rowsPerPage: pageSize,
      searchText: debouncedSearchText,
      token: "",
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setDataSegmentLeadData(data?.data);
          setRowCount(data?.total);
        } else {
          throw new Error("Data segment details API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error.status === 500) {
          handleInternalServerError(setIsInternalServerError, "", 5000);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error, data, pageNumber, debouncedSearchText]);
  const prefetchAllApplications = usePrefetch("getDataSegmentDetailsTableData");
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      pageSize,
      pageNumber,
      collegeId,
      prefetchAllApplications,
      {
        searchText: debouncedSearchText,
        token: "",
        dataSegmentId: selectedDataSegmentInfo?.data_segment_id,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    pageNumber,
    prefetchAllApplications,
    pageSize,
    debouncedSearchText,
    collegeId,
  ]);
  return (
    <>
      <Box className="voucher-drawer-box-top">
        <Typography className="voucher-drawer-headline-text">
          Data Segment Details | {selectedDataSegmentInfo?.data_segment_name}
        </Typography>
        <IconButton>
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setDataSegmentDetailsDrawerOpen(false)}
          />
        </IconButton>
      </Box>
      <Box className="voucher-drawer-content-box">
        {isSomethingWentWrong || isInternalServerError ? (
          <Box>
            {isInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {isSomethingWentWrong && (
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
                {dataSegmentLeadData?.length > 0 ? (
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
                              Program Name
                              {/* {hideCourseList || (
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
                          callAPIAgain={() => setIsSkipCallApi((prev) => !prev)}
                          onClean={() => setIsSkipCallApi((prev) => !prev)}
                        />
                      )} */}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dataSegmentLeadData?.map((row, index) => (
                            <TableRow
                              sx={{
                                borderBottom:
                                  "1px solid rgba(238, 238, 238, 1)",
                              }}
                              key={index}
                            >
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
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
                                bodyCellPadding={"16px 18px !important"}
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
                                  {row.course_name ? (
                                    <>
                                      {
                                        <span className="counsellor-allocated-items">
                                          {`${row?.course_name}`}
                                        </span>
                                      }
                                    </>
                                  ) : (
                                    "---"
                                  )}
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
                            `dataSegmentDetailsPromoCodeSavePageNo`,
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
                        localStorageChangeRowPerPage={`dataSegmentDetailsPromoCodeRowPerPage`}
                        localStorageChangePage={`dataSegmentDetailsPromoCodeSavePageNo`}
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
            setDataSegmentDetailsDrawerOpen(false);
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

export default DataSegmentDetailsDrawer;
