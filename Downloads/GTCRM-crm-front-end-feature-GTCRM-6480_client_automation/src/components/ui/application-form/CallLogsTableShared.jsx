import {
  Avatar,
  Box,
  Button,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { handleChangePage } from "../../../helperFunctions/pagination";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { stringAvatar } from "../../../utils/stringToColorCode";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import AutoCompletePagination from "../../shared/forms/AutoCompletePagination";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import Pagination from "../../shared/Pagination/Pagination";
import "../../../styles/sharedStyles.css";
import { SeverityPillTicket } from "../../userProfile/severityPill/SeverityPIllTicket";
import DateRange from "../../shared/filters/DateRange";
import FilterSelectPicker from "../../shared/filters/FilterSelectPicker";
import {
  ApplicationVerificationStatus,
  callStatusList,
} from "../../../constants/LeadStageList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect } from "react";
import { Input, InputGroup } from "rsuite";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";
import { defaultRowsPerPageOptions } from "../../Calendar/utils";
const CallLogsTableShared = ({
  isFetching,
  logsData,
  pageNumber,
  rowCount,
  rowsPerPage,
  count,
  localStoragePageName,
  setPageNumber,
  localStorageRowPerPageName,
  setRowsPerPage,
  tableInternalServerError,
  somethingWentWrongTable,
  apiResponseChangeMessage,
  dateRange,
  setDateRange,
  counselorId,
  setCounselorId,
  counsellorList,
  applicationStatus,
  setApplicationStatus,
  callStatus,
  setCallStatus,
  setSendSearchItem,
  searchText,
  setSearchText,
  showResetButton,
  setShowResetButton,
  setCallSearchAPI,
  refetch,
  isSuccess,
  loadingCounselorList,
  setSkipCounselorApiCall,
  hideCounsellorList,
  setSkipCallActivitiesApiCall,
}) => {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  useEffect(() => {
    if (isSuccess) {
      searchText?.length > 0 && setShowResetButton(true);
    }
  }, [searchText, isSuccess, setShowResetButton]);
  return (
    <>
      {tableInternalServerError || somethingWentWrongTable ? (
        <Box
          className="error-animation-box"
          data-testid="error-animation-container"
        >
          {tableInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongTable && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          {isFetching ? (
            <TableBody
              sx={{
                width: "100%",
                minHeight: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              data-testid="loading-animation-container"
            >
              <LeefLottieAnimationLoader
                height={120}
                width={120}
              ></LeefLottieAnimationLoader>
            </TableBody>
          ) : (
            <Box sx={{ px: 3 }}>
              <CardHeader
                sx={{ mt: -1.5, pb: 1, px: 0, pt: 0 }}
                id="filter-item-call"
                action={
                  <Box className="call-dashboard-application-filter">
                    {hideCounsellorList || (
                      <MultipleFilterSelectPicker
                        onChange={(value) => {
                          setCounselorId(value);
                          setSkipCallActivitiesApiCall(true);
                        }}
                        pickerData={counsellorList}
                        placeholder="Select Counselor"
                        pickerValue={counselorId}
                        className="in-app-call-logs-filter"
                        setSelectedPicker={setCounselorId}
                        loading={loadingCounselorList}
                        onOpen={() => setSkipCounselorApiCall(false)}
                        setSkipApiCall={setSkipCallActivitiesApiCall}
                        style={{ width: "180px" }}
                      />
                    )}
                    <FilterSelectPicker
                      setSelectedPicker={setApplicationStatus}
                      pickerData={ApplicationVerificationStatus}
                      placeholder="Lead Status"
                      pickerValue={applicationStatus}
                      setPageNumber={setPageNumber}
                      className="in-app-call-logs-filter"
                      setSkipApiCall={setSkipCallActivitiesApiCall}
                    />
                    <FilterSelectPicker
                      setSelectedPicker={setCallStatus}
                      pickerData={callStatusList}
                      placeholder="Call Status"
                      pickerValue={callStatus}
                      setPageNumber={setPageNumber}
                      className="in-app-call-logs-filter"
                      setSkipApiCall={setSkipCallActivitiesApiCall}
                    />
                    <DateRange
                      dateRange={dateRange}
                      setDateRange={setDateRange}
                      setPageNumber={setPageNumber}
                      setSkipApiCall={setSkipCallActivitiesApiCall}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ ml: -1 }}
                      onClick={() => {
                        setSkipCallActivitiesApiCall(false);
                      }}
                    >
                      Apply
                    </Button>
                  </Box>
                }
                title={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <InputGroup
                      style={{
                        width: 300,
                        fontWeight: "normal",
                      }}
                    >
                      <Input
                        value={searchText}
                        placeholder="Search "
                        onChange={(value) => setSearchText(value)}
                        onPressEnter={() => {
                          setPageNumber(1);
                          setCallSearchAPI(setSendSearchItem, searchText);
                        }}
                      />
                      <InputGroup.Button
                        disabled={searchText?.length > 0 ? false : true}
                        onClick={() => {
                          setPageNumber(1);
                          setCallSearchAPI(setSendSearchItem, searchText);
                        }}
                      >
                        <SearchIcon />
                      </InputGroup.Button>
                    </InputGroup>

                    {showResetButton && (
                      <Tooltip arrow placement="top" title="Reset">
                        <RestartAltIcon
                          sx={{ ml: 1, cursor: "pointer" }}
                          id="search-icon"
                          onClick={() => {
                            setSearchText("");
                            setSendSearchItem("");
                            refetch();
                            setShowResetButton(false);
                          }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                }
              />
              {logsData?.length > 0 ? (
                <TableContainer className="custom-scrollbar">
                  <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Box sx={{ ml: 3 }}>Student Name</Box>
                        </TableCell>
                        <TableCell align="center">Student Mobile No</TableCell>
                        <TableCell align="center">Counsellor Name</TableCell>
                        <TableCell align="center">Call Status</TableCell>
                        <TableCell align="center">Lead Status</TableCell>
                        <TableCell align="center">Date Time</TableCell>
                        <TableCell align="center">Duration</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {logsData.map((logData, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box
                              sx={{
                                alignItems: "center",
                                display: "flex",
                                ml: 3,
                              }}
                            >
                              {logData?.student_photo ? (
                                <Avatar
                                  src={logData?.student_photo}
                                  sx={{
                                    height: 42,
                                    width: 42,
                                  }}
                                />
                              ) : (
                                <Avatar
                                  {...stringAvatar(logData?.student_name?logData?.student_name:"NA")}
                                />
                              )}
                              <Box sx={{ ml: 1 }}>
                                <Typography
                                  color="textSecondary"
                                  variant="body2"
                                  fontWeight={"bold"}
                                >
                                  {logData.student_name}
                                </Typography>
                                <Typography
                                  color="textSecondary"
                                  variant="body2"
                                >
                                  {logData?.student_email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            {logData?.student_mobile}
                          </TableCell>
                          <TableCell align="center">
                            {logData?.counselor_name}
                          </TableCell>
                          <TableCell align="center">
                            <span
                              className={
                                logData?.call_status?.toLowerCase() ===
                                "answered"
                                  ? "severityPill-success"
                                  : "severityPill-failed"
                              }
                            >
                              {logData?.call_status}
                            </span>
                          </TableCell>
                          <TableCell align="center">
                            <SeverityPillTicket
                              color={
                                logData?.lead_status?.toLowerCase() ===
                                "verified"
                                  ? "success"
                                  : "error"
                              }
                            >
                              {logData?.lead_status}
                            </SeverityPillTicket>
                          </TableCell>
                          <TableCell align="center">
                            {logData.date_time}
                          </TableCell>
                          <TableCell align="center">
                            {logData.duration}s
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "55vh",
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

              {!isFetching && logsData?.length > 0 && (
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
                        localStoragePageName,
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
                    localStorageChangeRowPerPage={localStorageRowPerPageName}
                    localStorageChangePage={localStoragePageName}
                    setRowsPerPage={setRowsPerPage}
                  ></AutoCompletePagination>
                </Box>
              )}
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default React.memo(CallLogsTableShared);
