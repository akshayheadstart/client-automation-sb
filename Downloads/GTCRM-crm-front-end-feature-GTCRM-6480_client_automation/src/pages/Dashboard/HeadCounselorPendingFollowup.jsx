import {
  Box,
  Card,
  IconButton,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import "../../styles/HeadCounselorPendingFollowup.css";
import { useState } from "react";
import Cookies from "js-cookie";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import useToasterHook from "../../hooks/useToasterHook";
import GetJsonDate from "../../hooks/GetJsonDate";
import { useGetAdminPendingFollowupCountQuery } from "../../Redux/Slices/applicationDataApiSlice";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import Pagination from "../../components/shared/Pagination/Pagination";
import { handleChangePage } from "../../helperFunctions/pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import HeadCounselorTableBody from "./HeadCounselorTableBody";
import { useSelector } from "react-redux";
import { startAndEndDateSelect } from "../../utils/adminDashboardDateRangeSelect";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import IconDateRangePicker from "../../components/shared/filters/IconDateRangePicker";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import "../../styles/sharedStyles.css";
const HeadCounselorPendingFollowup = ({
  headCounselorDate,
  setHeadCounselorDate,
  selectedSeason,
  hideCounsellorList,
  counsellorList,
  loadingCounselorList,
  setSkipCounselorApiCall,
}) => {
  const StyledTableCell = useTableCellDesign();
  const [selectedCounsellor, setCounsellorID] = useState([]);

  const headCounselorPageNo = localStorage.getItem(
    `${Cookies.get("userId")}headCounselorListSavePageNo`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}headCounselorListSavePageNo`
        )
      )
    : 1;

  const headCounselorRowPerPage = localStorage.getItem(
    `${Cookies.get("userId")}headCounselorListRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}headCounselorListRowPerPage`
        )
      )
    : 25;
  const [hideFollowUpTask, setHideFollowUpTask] = useState(false);
  const [pageNumber, setPageNumber] = useState(headCounselorPageNo);
  const [rowsPerPage, setRowsPerPage] = useState(headCounselorRowPerPage);
  const [rowCount, setRowCount] = useState();
  const [allHeadCounselorList, setAllHeadCounselorList] = useState([]);
  const [followUpTaskInternalServerError, setFollowUpTaskInternalServerError] =
    useState(false);
  const [
    somethingWentWrongInFollowUpTask,
    setSomethingWentWrongInFollowUpTask,
  ] = useState(false);
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["e7d559dc"]?.features?.["9398042e"]
        ?.features
    );
  }, [permissions]);

  const payloadOfPendingFollowup = {
    pageNumber,
    rowsPerPage,
    collegeId,
    payload: {
      season: selectedSeason ? JSON?.parse(selectedSeason)?.season_id : "",
    },
  };
  if (headCounselorDate?.length) {
    payloadOfPendingFollowup.payload.date_range = JSON?.parse(
      GetJsonDate(headCounselorDate)
    );
  } else {
    payloadOfPendingFollowup.payload.date_range = {
      start_date: selectedSeason ? JSON?.parse(selectedSeason)?.start_date : "",
      end_date: selectedSeason ? JSON?.parse(selectedSeason)?.end_date : "",
    };
  }

  if (selectedCounsellor.length > 0) {
    payloadOfPendingFollowup.payload.counselor_Id = selectedCounsellor;
  }
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const count = Math.ceil(rowCount / rowsPerPage);

  const [pendingFollowupQueries, setPendingFollowUpQueries] = useState(
    payloadOfPendingFollowup
  );
  const [callApi, setCallApi] = useState(false);
  useEffect(() => {
    setPendingFollowUpQueries(payloadOfPendingFollowup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callApi, headCounselorDate]);

  const {
    data: headCounselorList,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetAdminPendingFollowupCountQuery(pendingFollowupQueries);

  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  useEffect(() => {
    // three month back date calculation
    if (headCounselorDate?.length > 1) {
      const startDate = new Date(headCounselorDate[0]);
      const endDate = new Date(headCounselorDate[1]);
      setStartDateRange(startDate.toDateString());
      setEndDateRange(endDate.toDateString());
    } else {
      startAndEndDateSelect(selectedSeason, setStartDateRange, setEndDateRange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headCounselorDate, selectedSeason]);

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(headCounselorList?.data)) {
          setAllHeadCounselorList(headCounselorList?.data);
          setRowCount(headCounselorList?.total);
        } else {
          throw new Error("pending Followup report API response has changed");
        }
      } else if (isError) {
        setAllHeadCounselorList([]);
        setRowCount(0);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data.detail) {
          pushNotification("error", error?.data.detail);
        }
        if (error?.status === "500") {
          handleInternalServerError(
            setFollowUpTaskInternalServerError,
            setHideFollowUpTask,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInFollowUpTask,
        setHideFollowUpTask,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headCounselorList, isSuccess, error, isError]);

  if (hideFollowUpTask) {
    return null;
  }

  return (
    <>
      {followUpTaskInternalServerError || somethingWentWrongInFollowUpTask ? (
        <Box>
          {followUpTaskInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInFollowUpTask && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box>
          <Box>
            {isFetching ? (
              <Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography color="textPrimary" variant="h6">
                    Pending Followup Details
                  </Typography>
                  <Tooltip
                    title="The Counsellor Performance Report represents all the information of counsellors performance."
                    arrow
                    placement="top"
                  >
                    <IconButton sx={{ p: 0.6, mt: -0.5 }}>
                      <InfoOutlinedIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Card className="loader-wrapper">
                  {" "}
                  <LeefLottieAnimationLoader
                    height={100}
                    width={120}
                  ></LeefLottieAnimationLoader>{" "}
                </Card>
              </Box>
            ) : (
              <Box>
                <Box className="top-dashboard-header-and-filter-section">
                  <Box className="title-box-hover">
                    <Typography className="top-section-title">
                      Pending Followup Details
                    </Typography>
                    <Typography className="top-section-date">
                      {startDateRange} - {endDateRange}
                    </Typography>
                  </Box>
                  <Box className="top-dashboard-section-filters-box">
                    {features?.["80ddba97"]?.visibility && (
                      <>
                        {hideCounsellorList || (
                          <MultipleFilterSelectPicker
                            onChange={(value) => {
                              setCounsellorID(value);
                            }}
                            pickerData={counsellorList}
                            placeholder="Select Counselor"
                            pickerValue={selectedCounsellor}
                            className="dashboard-select-picker"
                            setSelectedPicker={setCounsellorID}
                            loading={loadingCounselorList}
                            onOpen={() => setSkipCounselorApiCall(false)}
                            style={{ width: "180px" }}
                            callAPIAgain={() => setCallApi((preV) => !preV)}
                            onClean={() => {
                              setCallApi((preV) => !preV);
                            }}
                          />
                        )}
                      </>
                    )}

                    {features?.["960c84cd"]?.visibility && (
                      <IconDateRangePicker
                        onChange={(value) => {
                          setHeadCounselorDate(value);
                        }}
                        dateRange={headCounselorDate}
                      />
                    )}
                  </Box>
                </Box>

                {allHeadCounselorList?.length ? (
                  <Box sx={{ mt: 2 }}>
                    <TableContainer className="custom-scrollbar">
                      <Table size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Counselor name</StyledTableCell>
                            <StyledTableCell align="left">
                              Todays
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Upcoming
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Overdue
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Completed
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Send Reminder
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <HeadCounselorTableBody
                          allHeadCounselorList={allHeadCounselorList}
                          currentSeason={
                            selectedSeason
                              ? JSON?.parse(selectedSeason)?.current_season
                              : ""
                          }
                        />
                      </Table>
                    </TableContainer>
                  </Box>
                ) : (
                  <Card className="followup-task-not-found-container">
                    <BaseNotFoundLottieLoader
                      height={250}
                      width={250}
                    ></BaseNotFoundLottieLoader>
                  </Card>
                )}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Pagination
                    className="pagination-bar"
                    currentPage={pageNumber}
                    totalCount={rowCount}
                    pageSize={rowsPerPage}
                    onPageChange={(page) =>
                      handleChangePage(
                        page,
                        `headCounselorListSavePageNo`,
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
                    localStorageChangeRowPerPage={"headCounselorListRowPerPage"}
                    localStorageChangePage={"headCounselorListSavePageNo"}
                    setRowsPerPage={setRowsPerPage}
                  ></AutoCompletePagination>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default React.memo(HeadCounselorPendingFollowup);
