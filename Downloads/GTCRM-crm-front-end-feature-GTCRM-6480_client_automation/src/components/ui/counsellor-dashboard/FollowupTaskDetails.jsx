import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useToasterHook from "../../../hooks/useToasterHook";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import useDebounce from "../../../hooks/useDebounce";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  useGetApplicationFollowupQuery,
  useGetCounselorListQuery,
  usePrefetch,
} from "../../../Redux/Slices/applicationDataApiSlice";
import { Box, ClickAwayListener, Grid, Typography } from "@mui/material";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import SearchInputBox from "../../shared/forms/SearchInputBox";
import DatePicker from "react-multi-date-picker";
import FollowUpTaskTable from "./FollowUpTaskTable";
import Toolbar from "react-multi-date-picker/plugins/toolbar";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import DateRangeIcon from "../../../icons/date-range-icon.svg";
import { apiCallFrontAndBackPage } from "../../../helperFunctions/apiCallFrontAndBackPage";
import "../../../styles/FollowupTaskTable.css";
import "../../../styles/CounsellorPerformanceReport.css";
import MultipleTabs from "../../shared/tab-panel/MultipleTabs";
import { followupDetailsTab } from "../../../constants/LeadStageList";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import GetJsonDate from "../../../hooks/GetJsonDate";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";
import { organizeCounselorFilterOption } from "../../../helperFunctions/filterHelperFunction";

const FollowupTaskDetails = ({
  skipApiCall,
  counsellorDashboard,
  showCounsellorFilter,
}) => {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();

  const [clickedSearchIcon, setClickedSearchIcon] = useState(false);
  const [selectedCounsellor, setSelectedCounsellor] = useState([]);
  const [appliedCounsellor, setAppliedCounsellor] = useState([]);

  const [allFollowUpReportData, setAllFollowUpReportData] = useState([]);
  const [highlightedDays, setHighlightedDays] = useState([]);

  const [sortingType, setSortingType] = useState("");
  const [sortingColumn, setSortingColumn] = useState("");

  const [dateRange, setDateRange] = useState([]);
  const [appliedDateRange, setAppliedDateRange] = useState([]);

  useEffect(() => {
    localStorage.setItem(
      `${Cookies.get("userId")}adminApplicationSavePageNo`,
      JSON.stringify(1)
    );
  }, []);
  // states for pagination
  const applicationPageNo = localStorage.getItem(
    `${Cookies.get("userId")}adminApplicationSavePageNo`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}adminApplicationSavePageNo`
        )
      )
    : 1;

  const tableRowPerPage = localStorage.getItem(
    `${Cookies.get("userId")}adminTableRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}adminTableRowPerPage`)
      )
    : 25;
  const [pageNumber, setPageNumber] = useState(applicationPageNo);
  const [rowsPerPage, setRowsPerPage] = useState(
    counsellorDashboard ? 3 : tableRowPerPage
  );
  const [rowCount, setRowCount] = useState();

  useEffect(() => {
    localStorage.setItem(
      `${Cookies.get("userId")}followupTaskTabValue`,
      JSON.stringify(0)
    );
    localStorage.setItem(`${Cookies.get("userId")}followupTaskSavePageNo`, 1);
    localStorage.setItem(
      `${Cookies.get("userId")}followUpTaskFilterOptions`,
      JSON.stringify({})
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //counsellor chart internal server error and hide states
  const [followUpTaskInternalServerError, setFollowUpTaskInternalServerError] =
    useState(false);
  const [hideFollowUpTask, setHideFollowUpTask] = useState(false);
  const [
    somethingWentWrongInFollowUpTask,
    setSomethingWentWrongInFollowUpTask,
  ] = useState(false);
  const [totalFollowupReports, setTotalFollowupReports] = useState(0);

  const [isOpenCalender, setIsOpenCalendar] = useState(false);
  const [skipCallCounsellorAPI, setSkipCallCounsellorAPI] = useState(true);
  const [counsellors, setCounsellors] = useState([]);

  const [searchText, setSearchText] = useState("");
  const { state } = useLocation();
  const [selectedTab, setSelectedTab] = useState(state?.tab ? state?.tab : 0);
  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const searchTextOfPayload = useDebounce(searchText, 500);

  const { handleFilterListApiCall } = useCommonApiCalls();

  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId },
    {
      skip: skipCallCounsellorAPI,
    }
  );

  //get counsellor list
  useEffect(() => {
    if (!skipCallCounsellorAPI) {
      const counselorList = counselorListApiCallInfo.data?.data[0];
      handleFilterListApiCall(
        counselorList,
        counselorListApiCallInfo,
        setCounsellors,
        null,
        organizeCounselorFilterOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCallCounsellorAPI, counselorListApiCallInfo]);

  const payload = {
    counselor_filter: {
      counselor_id: appliedCounsellor,
    },
    date_range: appliedDateRange?.length
      ? JSON.parse(GetJsonDate(appliedDateRange))
      : null,
    sort: sortingColumn?.length ? true : false,
    sort_type: sortingType,
    sort_name: sortingColumn,
  };
  const {
    data: followupData,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetApplicationFollowupQuery(
    {
      pageNumber,
      rowsPerPage,
      collegeId,
      tabValue: counsellorDashboard ? 4 : selectedTab,
      payload: payload,
      searchTextOfPayload,
    },
    { skip: skipApiCall }
  );
  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(followupData?.data)) {
          const applications = [...followupData?.data];
          const applicationsWithPageNumber = applications.map((application) => {
            const updatedApplication = { ...application };
            updatedApplication.pageNo = pageNumber;
            return updatedApplication;
          });
          localStorage.setItem(
            `${Cookies.get("userId")}applications`,
            JSON.stringify(applicationsWithPageNumber)
          );
          localStorage.setItem(
            `${Cookies.get("userId")}applicationsTotalCount`,
            JSON.stringify(followupData?.total)
          );

          setAllFollowUpReportData(followupData?.data);

          setRowCount(followupData?.total);
          setTotalFollowupReports(followupData?.total);
          const highlightDays = followupData?.data.map((item) => {
            const date = new Date(item.followup_date);
            if (item?.status?.toLowerCase() === "overdue") {
              return `${date.getFullYear()}-${
                date.getMonth() + 1
              }-${date.getDate()} overdue`;
            } else if (item?.status?.toLowerCase() === "upcoming") {
              return `${date.getFullYear()}-${
                date.getMonth() + 1
              }-${date.getDate()} upcoming`;
            } else {
              return undefined;
            }
          });

          setHighlightedDays(highlightDays);

          localStorage.setItem(
            `${Cookies.get("userId")}followupTaskSavePageNo`,
            JSON.stringify(pageNumber)
          );
          localStorage.setItem(
            `${Cookies.get("userId")}followupTaskRowPerPage`,
            JSON.stringify(rowsPerPage)
          );
        } else {
          throw new Error("Followup report API response has changed");
        }
      } else if (isError) {
        setAllFollowUpReportData([]);
        setTotalFollowupReports(0);
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
  }, [followupData, isSuccess, error, isError]);

  const prefetchFollowupData = usePrefetch("getApplicationFollowup");
  useEffect(() => {
    if (!counsellorDashboard) {
      apiCallFrontAndBackPage(
        followupData,
        rowsPerPage,
        pageNumber,
        collegeId,
        prefetchFollowupData,
        {
          tabValue: counsellorDashboard ? 4 : selectedTab,
          payload: payload,
          searchTextOfPayload,
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    followupData,
    pageNumber,
    prefetchFollowupData,
    rowsPerPage,
    counsellorDashboard,
  ]);

  const datePickerRef = useRef(null);

  useEffect(() => {
    setPageNumber(1);
  }, [searchTextOfPayload]);

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["c2a62998"]?.features?.["a5168b10"]
        ?.features
    );
  }, [permissions]);

  return (
    <Box className="counsellor-performance-report-box">
      {appliedDateRange?.length > 0 && (
        <DateRangeShowcase
          startDateRange={getDateMonthYear(appliedDateRange[0])}
          endDateRange={getDateMonthYear(appliedDateRange[1])}
          triggeredFunction={() => {
            setDateRange([]);
            setAppliedDateRange([]);
          }}
        ></DateRangeShowcase>
      )}

      <Box>
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
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              visibility: hideFollowUpTask ? "hidden" : "visible",
            }}
          >
            <Grid container spacing={1}>
              <Grid item lg={12} sm={12} xs={12}>
                <Box sx={{ width: "100%" }}>
                  <Grid
                    sx={{ gap: 2, justifyContent: "space-between" }}
                    container
                  >
                    {counsellorDashboard ? (
                      <Box className="followup-date-range-container">
                        <Typography variant="h6">Follow up</Typography>
                        {appliedDateRange?.length > 0 && (
                          <Typography className="followup-date-range">
                            {getDateMonthYear(appliedDateRange[0])} -{" "}
                            {getDateMonthYear(appliedDateRange[1])}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Box>
                        <Box
                          className="followup-task-tab-container"
                          sx={{ display: "flex", flexWrap: "wrap" }}
                        >
                          <MultipleTabs
                            tabArray={followupDetailsTab}
                            setMapTabValue={setSelectedTab}
                            mapTabValue={selectedTab}
                            boxWidth="500px !important"
                          />
                        </Box>
                      </Box>
                    )}

                    <Box>
                      <Box
                        sx={{
                          alignItems: "center",
                        }}
                        className="followup-task-filter-container"
                      >
                        {features?.["b93af491"]?.visibility && (
                          <ClickAwayListener
                            onClickAway={() => setClickedSearchIcon(false)}
                          >
                            {clickedSearchIcon ? (
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleSetSearchPayload();
                                }}
                              >
                                <SearchInputBox
                                  clickedTextField={clickedSearchIcon}
                                  setSearchText={setSearchText}
                                  searchText={searchText}
                                  className="followup-search-input-field"
                                  color="info"
                                />
                              </form>
                            ) : (
                              <SearchOutlinedIcon
                                color="info"
                                sx={{ cursor: "pointer" }}
                                onClick={() => setClickedSearchIcon(true)}
                              />
                            )}
                          </ClickAwayListener>
                        )}
                        {showCounsellorFilter && (
                          <MultipleFilterSelectPicker
                            onChange={(value) => {
                              setSelectedCounsellor(value);
                            }}
                            setSelectedPicker={setSelectedCounsellor}
                            pickerData={counsellors}
                            placeholder="Counsellor Filter"
                            placement="bottomEnd"
                            pickerValue={selectedCounsellor}
                            style={{ width: "140px" }}
                            className="select-picker"
                            onOpen={() => setSkipCallCounsellorAPI(false)}
                            onClean={() => {
                              setAppliedCounsellor([]);
                              setPageNumber(1);
                            }}
                            callAPIAgain={() => {
                              setAppliedCounsellor(selectedCounsellor);
                              setPageNumber(1);
                            }}
                            loading={counselorListApiCallInfo?.isFetching}
                          />
                        )}

                        {features?.["9f43d241"]?.visibility && (
                          <DatePicker
                            arrow={false}
                            ref={datePickerRef}
                            style={{ width: "0px" }}
                            range
                            rangeHover
                            calendarPosition="bottom-end"
                            fixMainPosition
                            value={dateRange}
                            onOpen={() => setIsOpenCalendar(true)}
                            onClose={() => {
                              setIsOpenCalendar(false);
                              if (dateRange?.length) {
                                setAppliedDateRange([
                                  new Date(dateRange[0].format()),
                                  new Date(
                                    dateRange[dateRange.length - 1].format()
                                  ),
                                ]);
                              } else {
                                setAppliedDateRange([]);
                              }
                            }}
                            onChange={(value) => {
                              setDateRange(value);
                            }}
                            plugins={[
                              <Toolbar
                                position="bottom"
                                names={{
                                  today: "Select Today",
                                  deselect: "Reset",
                                  close: "Apply",
                                }}
                              />,
                            ]}
                            mapDays={({ date }) => {
                              let colorClass;
                              if (
                                highlightedDays.includes(
                                  `${date.year}-${date.month.number}-${date.day} overdue`
                                )
                              ) {
                                colorClass = "overdue-date";
                              } else if (
                                highlightedDays.includes(
                                  `${date.year}-${date.month.number}-${date.day} upcoming`
                                )
                              ) {
                                colorClass = "upcoming-date";
                              }

                              if (colorClass)
                                return {
                                  className:
                                    "highlight highlight-" + colorClass,
                                };
                            }}
                          />
                        )}

                        <img
                          onClick={() => {
                            if (isOpenCalender) {
                              datePickerRef.current.closeCalendar();
                            } else {
                              datePickerRef.current.openCalendar();
                            }
                          }}
                          style={{ cursor: "pointer", height: "auto" }}
                          src={DateRangeIcon}
                          alt="date-range-icon"
                        />
                      </Box>
                    </Box>
                  </Grid>

                  <Box>
                    {isFetching ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: "30vh",
                        }}
                      >
                        {" "}
                        <LeefLottieAnimationLoader
                          height={100}
                          width={100}
                        ></LeefLottieAnimationLoader>{" "}
                      </Box>
                    ) : (
                      <Box>
                        <FollowUpTaskTable
                          sortingColumn={sortingColumn}
                          setSortingColumn={setSortingColumn}
                          sortingType={sortingType}
                          setSortingType={setSortingType}
                          counsellorDashboard={counsellorDashboard}
                          followUpReportData={allFollowUpReportData}
                          leadLastActivity={"leadLastActivity"}
                          markasComplete={"markasComplete"}
                          rowCount={rowCount}
                          rowsPerPage={rowsPerPage}
                          setRowsPerPage={setRowsPerPage}
                          page={pageNumber}
                          setPage={setPageNumber}
                          totalFollowupReports={totalFollowupReports}
                          setFollowUpTaskInternalServerError={
                            setFollowUpTaskInternalServerError
                          }
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FollowupTaskDetails;
