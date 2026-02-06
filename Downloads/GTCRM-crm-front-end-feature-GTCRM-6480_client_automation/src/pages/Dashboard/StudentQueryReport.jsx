/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  ClickAwayListener,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import IconDateRangePicker from "../../components/shared/filters/IconDateRangePicker";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import SearchIcon from "@rsuite/icons/Search";
import SearchBox from "../../components/shared/SearchBox/SearchBox";
import Pagination from "../../components/shared/Pagination/Pagination";
import { handleChangePage } from "../../helperFunctions/pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import { startAndEndDateSelect } from "../../utils/adminDashboardDateRangeSelect";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import SortIndicatorWithTooltip from "../../components/shared/SortIndicatorWithTooltip/SortIndicatorWithTooltip";
import { StudentQueryReportColumns } from "../../utils/StudentQueryReportUtils";
import "../../styles/StudentQueryReport.css";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import "../../styles/sharedStyles.css";
import { useSelector } from "react-redux";
const StudentQueryReport = ({
  selectedCounsellor,
  setCounsellorID,
  counsellorList,
  hideCounsellorList,
  loadingCounselorList,
  setSkipCounselorApiCall,
  setCallAPI,
  studentQueryDate,
  setStudentQueryDate,

  hideCourseList,
  setSkipCourseApiCall,
  selectedCourseId,
  setSelectedCourseId,
  courseList,

  studentQuerySearch,
  setStudentQuerySearch,
  setStudentQueryPageNumber,
  setStudentQueryPageSize,

  pageNumber,
  pageSize,
  studentQueryData,
  selectedSeason,
  loading,
  setStudentQuerySortObj,
}) => {
  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  const [searchFieldToggle, setSearchFieldToggle] = useState(false);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [sortColumn, setSortColumn] = useState("");
  const [sortType, setSortType] = useState(null); // asc or dsc or null
  const [allDataFetched, setAllDataFetched] = useState(false);
  const navigate = useNavigate();
  const TableCell = useTableCellDesign();

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["e7d559dc"]?.features?.["216efaab"]
        ?.features
    );
  }, [permissions]);

  useEffect(() => {
    // three month back date calculation
    if (studentQueryDate?.length > 1) {
      const startDate = new Date(studentQueryDate[0]);
      const endDate = new Date(studentQueryDate[1]);
      setStartDateRange(startDate.toDateString());
      setEndDateRange(endDate.toDateString());
    } else {
      startAndEndDateSelect(selectedSeason, setStartDateRange, setEndDateRange);
    }
  }, [studentQueryDate, allDataFetched]);

  const handleAllQueries = () => {
    navigate("/student-queries");
  };

  return (
    <Box className="student-query-container">
      <Box className="header-container">
        <Box className="title-box-hover">
          <Typography className="top-section-title">Student Queries</Typography>
          <Typography className="top-section-date">
            {startDateRange} - {endDateRange}
          </Typography>
        </Box>

        <Box className="top-dashboard-section-filters-box">
          <Box>
            {features?.["228f3fdd"]?.visibility && (
              <ClickAwayListener
                onClickAway={() => setSearchFieldToggle(false)}
              >
                <Box className="active-panelist-button-box-search">
                  {!searchFieldToggle ? (
                    <Box
                      className="search-icon-btn-wrapper"
                      data-testid="search-toggle"
                      sx={{
                        paddingY: "4px",
                        borderRadius: "5px",
                        paddingX: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => setSearchFieldToggle(true)}
                    >
                      <SearchIcon className="search-icon" />
                    </Box>
                  ) : (
                    <SearchBox
                      setSearchText={setStudentQuerySearch}
                      searchText={studentQuerySearch}
                      setPageNumber={setStudentQueryPageNumber}
                      setAllDataFetched={setAllDataFetched}
                      maxWidth={130}
                      searchIconClassName="search-icon"
                      className="student-query-searchbox"
                    />
                  )}
                </Box>
              </ClickAwayListener>
            )}
          </Box>
          {features?.["e96dbf6e"]?.visibility && (
            <>
              {hideCounsellorList || (
                <MultipleFilterSelectPicker
                  style={{ width: "150px" }}
                  placement="bottomEnd"
                  placeholder="Select Counselor"
                  onChange={(value) => {
                    setCounsellorID(value);
                  }}
                  pickerData={counsellorList}
                  setSelectedPicker={setCounsellorID}
                  pickerValue={selectedCounsellor}
                  loading={loadingCounselorList}
                  onOpen={() => setSkipCounselorApiCall(false)}
                  className="key-select-picker"
                  callAPIAgain={() => setCallAPI((prev) => !prev)}
                  onClean={() => setCallAPI((prev) => !prev)}
                />
              )}
            </>
          )}
          {/* Program Name */}
          {features?.["9b97ee19"]?.visibility && (
            <>
              {hideCourseList || (
                <MultipleFilterSelectPicker
                  style={{ width: "150px" }}
                  placement="bottomEnd"
                  placeholder="Program Name"
                  onChange={(value) => {
                    setSelectedCourseId(value);
                  }}
                  pickerData={courseList}
                  setSelectedPicker={setSelectedCourseId}
                  pickerValue={selectedCourseId}
                  //   loading={loadingCounselorList}
                  onOpen={() => setSkipCourseApiCall(false)}
                  className="key-select-picker"
                  callAPIAgain={() => setCallAPI((prev) => !prev)}
                  onClean={() => setCallAPI((prev) => !prev)}
                />
              )}
            </>
          )}
          {features?.["b8d8f3b0"]?.visibility && (
            <IconDateRangePicker
              onChange={(value) => {
                setStudentQueryDate(value);
              }}
              dateRange={studentQueryDate}
            />
          )}
          {features?.["f80bda81"]?.visibility && (
            <Button onClick={handleAllQueries} className="view-all-query-btn">
              View All Queries
            </Button>
          )}
        </Box>
      </Box>
      {loading ? (
        <Box className="loader-wrapper">
          <LeefLottieAnimationLoader
            height={100}
            width={150}
          ></LeefLottieAnimationLoader>{" "}
        </Box>
      ) : (
        <>
          {studentQueryData?.data?.length ? (
            <>
              <Box className="table-container">
                <TableContainer className="custom-scrollbar">
                  <Table
                    size="small"
                    sx={{ minWidth: 650 }}
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        {StudentQueryReportColumns?.map((col) => (
                          <TableCell key={col.value} width={col.width}>
                            <Box className="sorting-option-with-header-content">
                              {col.label}{" "}
                              {sortColumn === col.value ? (
                                <SortIndicatorWithTooltip
                                  sortType={sortType}
                                  value={col.value}
                                  sortColumn={sortColumn}
                                  setSortType={setSortType}
                                  setSortColumn={setSortColumn}
                                  setSortObj={setStudentQuerySortObj}
                                />
                              ) : (
                                <SortIndicatorWithTooltip
                                  sortColumn={sortColumn}
                                  setSortType={setSortType}
                                  setSortColumn={setSortColumn}
                                  setSortObj={setStudentQuerySortObj}
                                  value={col.value}
                                />
                              )}
                            </Box>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentQueryData?.data?.map((item) => {
                        return (
                          <TableRow>
                            <TableCell>{item.name}</TableCell>
                            <TableCell> {item.open}</TableCell>
                            <TableCell> {item.resolved}</TableCell>
                            <TableCell
                              sx={{ cursor: "pointer" }}
                              onClick={() => {
                                navigate("/student-queries", {
                                  state: {
                                    eventType: true,
                                    item: item,
                                  },
                                });
                              }}
                            >
                              {" "}
                              {item.un_resolved}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Pagination
                  className=""
                  currentPage={pageNumber}
                  totalCount={studentQueryData?.total || 0}
                  pageSize={pageSize}
                  onPageChange={(page) =>
                    handleChangePage(
                      page,
                      `adminApplicationSavePageNo`,
                      setStudentQueryPageNumber
                    )
                  }
                  count={studentQueryData?.count || 0}
                />
                <AutoCompletePagination
                  rowsPerPage={pageSize}
                  rowPerPageOptions={rowPerPageOptions}
                  setRowsPerPageOptions={setRowsPerPageOptions}
                  rowCount={studentQueryData?.count || 0}
                  page={pageNumber}
                  setPage={setStudentQueryPageNumber}
                  localStorageChangeRowPerPage={`studentQueryTableRowPerPage`}
                  localStorageChangePage={`studentQuerySavePageNo`}
                  setRowsPerPage={setStudentQueryPageSize}
                ></AutoCompletePagination>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                minHeight: "25vh",
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
    </Box>
  );
};

export default StudentQueryReport;
