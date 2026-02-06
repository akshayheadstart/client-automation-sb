/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/alt-text */
import { Box, Card, ClickAwayListener, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import "../../styles/studentTotalQueries.css";
import { Input } from "rsuite";
import { useSelector } from "react-redux";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import { useGetAllCourseListQuery } from "../../Redux/Slices/filterDataSlice";
import {
  organizeCounselorFilterOption,
  organizeCourseFilterCourseNameOption,
} from "../../helperFunctions/filterHelperFunction";
import StudentTotalQueriesDataTable from "./StudentTotalQueriesDataTable";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import IconDateRangePicker from "../../components/shared/filters/IconDateRangePicker";
import { queryTypes } from "../../constants/LeadStageList";
import { getDateMonthYear } from "../../hooks/getDayMonthYear";
import DateRangeShowcase from "../../components/shared/CalendarTimeData/DateRangeShowcase";
import {
  useGetCounselorListQuery,
  useGetStudentTotalQueriesTableDataQuery,
  usePrefetch,
} from "../../Redux/Slices/applicationDataApiSlice";
import Cookies from "js-cookie";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import useToasterHook from "../../hooks/useToasterHook";
import { GetFormatDate } from "../../hooks/GetJsonDate";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { startAndEndDateSelect } from "../../utils/adminDashboardDateRangeSelect";
import "../../styles/sharedStyles.css";
import studentQueriesSearchIcon from "../../images/searchStudentIcon.png";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";

const StudentTotalQueriesTable = ({
  filterDateValue,
  setFilterDateValue,
  state,
}) => {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  // common api call functions
  const { handleFilterListApiCall } = useCommonApiCalls();
  const [hideCourseList, setHideCourseList] = useState(false);
  const [skipCourseApiCall, setSkipCourseApiCall] = useState(true);
  const [courseDetails, setCourseDetails] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState([]);
  const [selectedQueryId, setSelectedQueryId] = useState([]);
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
        organizeCourseFilterCourseNameOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseListInfo, skipCourseApiCall]);

  const { selectedSeason } = useContext(LayoutSettingContext);
  const [search, setSearch] = useState("");
  const [searchFieldToggle, setSearchFieldToggle] = useState(false);
  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  useEffect(() => {
    if (filterDateValue?.length > 1) {
      setStartDateRange(getDateMonthYear(filterDateValue[0]));
      setEndDateRange(getDateMonthYear(filterDateValue[1]));
    } else {
      startAndEndDateSelect(selectedSeason, setStartDateRange, setEndDateRange);
    }
  }, [filterDateValue]);
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
  const [tableData, setTableData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(tableRowPerPage);
  const count = Math.ceil(rowCount / rowsPerPage);
  const [selectedCounselor, setSelectedCounselor] = useState(
    state?.eventType ? [state?.item?._id] : []
  );
  const [
    somethingWentWrongInStudentTable,
    setSomethingWentWrongInStudentTable,
  ] = useState(false);
  const [studentTableInternalServerError, setStudentTableInternalServerError] =
    useState(false);
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const pushNotification = useToasterHook();
  const [nameSortingString, setNameSortingString] = useState("default");
  const [emailIDSortingString, setEmailIDSortingString] = useState("default");
  const [createOnSortingString, setCreateOnSortingString] = useState("default");
  const [updateOnSortingString, setUpdateOnSortingString] = useState("default");
  const [name, setName] = useState(null);
  const [emailID, setEmailID] = useState(null);
  const [createOn, setCreateOn] = useState(null);
  const [updateOn, setUpdateOn] = useState(null);
  const [isSkipCallAPi, setIsSkipCallApi] = useState(true);
  const [filterDataPayload, setFilterDataPayload] = useState({});
  const [studentQuerySortObj, setStudentQuerySortObj] = useState({});
  const payloadTable = {
    program_names: selectedCourseId.length > 0 ? selectedCourseId : [],
    date_range:
      filterDateValue?.length > 0 ? GetFormatDate(filterDateValue) : {},
    search: search ? search : "",
    query_type: selectedQueryId.length > 0 ? selectedQueryId : [],
    season: selectedSeason ? JSON.parse(selectedSeason)?.season_id : "",
    counselor_ids: selectedCounselor.length > 0 ? selectedCounselor : [],
    sort: studentQuerySortObj ? studentQuerySortObj.sort : "",
    sort_type: studentQuerySortObj ? studentQuerySortObj.sort_type : "",
  };

  useEffect(() => {
    if (
      selectedCourseId.length > 0 ||
      selectedQueryId.length > 0 ||
      filterDateValue?.length > 0 ||
      search ||
      selectedCounselor.length > 0 ||
      studentQuerySortObj.sort?.length > 0 ||
      studentQuerySortObj?.sort_type?.length > 0
    ) {
      setFilterDataPayload(payloadTable);
      setTableData([]);
    } else {
      setFilterDataPayload({});
    }
  }, [
    isSkipCallAPi,
    filterDateValue,
    search,
    studentQuerySortObj,
    studentQuerySortObj?.sort,
    studentQuerySortObj?.sort_type,
    state?.eventType,
  ]);
  const { data, isSuccess, isFetching, error, isError } =
    useGetStudentTotalQueriesTableDataQuery({
      pageNumber: pageNumber,
      rowsPerPage: rowsPerPage,
      filterDataPayload: filterDataPayload,
      collegeId: collegeId,
    });
  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setRowCount(data?.total);
          setTableData(data?.data);
          const applications = [...data?.data];
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
            JSON.stringify(data?.total)
          );
        } else {
          throw new Error("get_details API response has changed");
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setStudentTableInternalServerError, 10000);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrongInStudentTable, 10000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data?.data,
    error?.data?.detail,
    isError,
    isSuccess,
    setApiResponseChangeMessage,
    selectedCourseId,
    filterDateValue,
    selectedQueryId,
    search,
    name,
    emailID,
    createOn,
    updateOn,
  ]);
  // use react hook for prefetch data
  const prefetchStudentQueriesData = usePrefetch(
    "getStudentTotalQueriesTableData"
  );
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchStudentQueriesData,
      {
        filterDataPayload,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    pageNumber,
    prefetchStudentQueriesData,
    rowsPerPage,
    filterDataPayload,
  ]);
  const [counsellorList, setCounsellorList] = useState([]);
  const [skipCounselorApiCall, setSkipCounselorApiCall] = useState(
    state?.eventType ? false : true
  );

  const [hideCounsellorList, setHideCounsellorList] = useState(false);
  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId: collegeId },
    {
      skip: skipCounselorApiCall,
    }
  );
  //get counsellor list
  useEffect(() => {
    if (!skipCounselorApiCall) {
      const counselorList = counselorListApiCallInfo.data?.data[0];
      handleFilterListApiCall(
        counselorList,
        counselorListApiCallInfo,
        setCounsellorList,
        setHideCounsellorList,
        organizeCounselorFilterOption
      );
    }
  }, [skipCounselorApiCall, counselorListApiCallInfo]);
  return (
    <Box sx={{ position: "relative" }}>
      {filterDateValue?.length > 0 && (
        <DateRangeShowcase
          startDateRange={startDateRange}
          endDateRange={endDateRange}
          triggeredFunction={() => {
            setFilterDateValue([]);
            setIsSkipCallApi(true);
          }}
        ></DateRangeShowcase>
      )}
      <Card className="student-queries-table-card-container">
        <Box className="student-queries-table-text-and-all-search-container">
          <Box className="title-box-hover">
            <Typography className="student-queries-table-headline">
              Total Queries
            </Typography>
            {filterDateValue?.length === 0 && (
              <Typography className="student-queries-table-show-date-range top-section-date">{`${startDateRange} - ${endDateRange}`}</Typography>
            )}
          </Box>
          <Box className="student-queries-all-input-field-container">
            {hideCounsellorList || (
              <MultipleFilterSelectPicker
                // handleFilterOption={handleFilterOption}
                filterOptionParams={["value", "counselor_id", { value: {} }]}
                style={{ width: "150px" }}
                className="dashboard-select-picker"
                setSelectedPicker={setSelectedCounselor}
                pickerData={counsellorList}
                placeholder="Select Counselor"
                pickerValue={selectedCounselor}
                loading={counselorListApiCallInfo.isFetching}
                onOpen={() => setSkipCounselorApiCall(false)}
                callAPIAgain={() => setIsSkipCallApi((prev) => !prev)}
                onClean={() => setIsSkipCallApi((prev) => !prev)}
              />
            )}
            <MultipleFilterSelectPicker
              style={{ width: "150px" }}
              placement="bottomEnd"
              placeholder="Query Type"
              className="dashboard-select-picker"
              onChange={(value) => {
                setSelectedQueryId(value);
              }}
              pickerData={queryTypes}
              setSelectedPicker={setSelectedQueryId}
              pickerValue={selectedQueryId}
              // loading={courseListInfo.isFetching}
              callAPIAgain={() => setIsSkipCallApi((prev) => !prev)}
              onClean={() => setIsSkipCallApi((prev) => !prev)}
            />
            {hideCourseList || (
              <MultipleFilterSelectPicker
                style={{ width: "150px" }}
                placement="bottomEnd"
                placeholder="Program Name"
                className="dashboard-select-picker"
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
            )}

            <Box>
              <ClickAwayListener
                onClickAway={() => setSearchFieldToggle(false)}
              >
                <Box>
                  {!searchFieldToggle ? (
                    <Box
                      data-testid="search-toggle"
                      onClick={() => setSearchFieldToggle(true)}
                    >
                      <img src={studentQueriesSearchIcon} width="45px" />
                    </Box>
                  ) : (
                    <Input
                      style={{ width: "150px" }}
                      placeholder="Search"
                      onChange={(value, event) => {
                        setSearch(value);
                        setIsSkipCallApi(true);
                      }}
                    />
                  )}
                </Box>
              </ClickAwayListener>
            </Box>
            <Box>
              <IconDateRangePicker
                onChange={(value) => {
                  setFilterDateValue(value);
                  setIsSkipCallApi(true);
                }}
                dateRange={filterDateValue}
              ></IconDateRangePicker>
            </Box>
          </Box>
        </Box>
        <Box className="student-queries-table-data-box">
          <StudentTotalQueriesDataTable
            pageNumber={pageNumber}
            rowCount={rowCount}
            count={count}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            setPageNumber={setPageNumber}
            tableData={tableData}
            isFetching={isFetching}
            somethingWentWrongInStudentTable={somethingWentWrongInStudentTable}
            studentTableInternalServerError={studentTableInternalServerError}
            apiResponseChangeMessage={apiResponseChangeMessage}
            nameSortingString={nameSortingString}
            setNameSortingString={setNameSortingString}
            emailIDSortingString={emailIDSortingString}
            setEmailIDSortingString={setEmailIDSortingString}
            createOnSortingString={createOnSortingString}
            setCreateOnSortingString={setCreateOnSortingString}
            updateOnSortingString={updateOnSortingString}
            setUpdateOnSortingString={setUpdateOnSortingString}
            setName={setName}
            setEmailID={setEmailID}
            setCreateOn={setCreateOn}
            setUpdateOn={setUpdateOn}
            setIsSkipCallApi={setIsSkipCallApi}
            setStudentQuerySortObj={setStudentQuerySortObj}
          ></StudentTotalQueriesDataTable>
        </Box>
      </Card>
    </Box>
  );
};

export default StudentTotalQueriesTable;
