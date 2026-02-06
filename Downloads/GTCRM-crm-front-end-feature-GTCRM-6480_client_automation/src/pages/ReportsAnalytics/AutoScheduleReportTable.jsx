import {
  Box,
  ClickAwayListener,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetReportAutoScheduledDataQuery,
  usePrefetch,
} from "../../Redux/Slices/applicationDataApiSlice";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Pagination from "../../components/shared/Pagination/Pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import SearchInputBox from "../../components/shared/forms/SearchInputBox";
import { handleChangePage } from "../../helperFunctions/pagination";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import useToasterHook from "../../hooks/useToasterHook";
import counsellorSearchIcon from "../../images/searchIcon.png";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/pendingLeads.css";
import "../../styles/report.css";
import "../../styles/sharedStyles.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
const AutoScheduleReportTable = () => {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const StyledTableCell = useTableCellDesign();
  const [
    getAutoScheduledInternalServerError,
    setAutoScheduledInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInGetAutoScheduled,
    setSomethingWentWrongInGetAutoScheduled,
  ] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [searchFieldToggle, setSearchFieldToggle] = useState(false);
  const pushNotification = useToasterHook();
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [rowCount, setRowCount] = useState();
  const count = Math.ceil(rowCount / rowsPerPage);
  const [tableData, setTableData] = useState([]);
  const { data, isSuccess, isFetching, error, isError } =
    useGetReportAutoScheduledDataQuery({
      pageNumber: search?1:pageNumber,
      rowsPerPage: rowsPerPage,
      autoSchedule: true,
      search,
      collegeId: collegeId,
    });
  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setTableData(data?.data);
          setRowCount(data?.total);
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
          handleInternalServerError(setAutoScheduledInternalServerError, 10000);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrongInGetAutoScheduled, 10000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data?.data,
    error?.data?.detail,
    error?.status,
    isError,
    isSuccess,
    setApiResponseChangeMessage,
  ]);
  // use react hook for prefetch data
  const prefetchStudentQueriesData = usePrefetch("getReportAutoScheduledData");
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchStudentQueriesData,
      {
        autoSchedule: true,
        search,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, prefetchStudentQueriesData, rowsPerPage]);
  return (
    <Box sx={{ width: "100%" }}>
      <Box className="auto-scheduled-table-report-header-box">
        <Typography className="auto-scheduled-headline-text">
          Auto Scheduled Reports
        </Typography>
        <Box sx={{ display: "flex", gap: "5px" }}>
          <Box sx={{ mb: 1 }}>
            <ClickAwayListener onClickAway={() => setSearchFieldToggle(false)}>
              <Box>
                {!searchFieldToggle ? (
                  <img
                    onClick={() => setSearchFieldToggle(true)}
                    src={counsellorSearchIcon}
                    alt=""
                    srcset=""
                    height={"50px"}
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
      {getAutoScheduledInternalServerError ||
      somethingWentWrongInGetAutoScheduled ? (
        <>
          {getAutoScheduledInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInGetAutoScheduled && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </>
      ) : (
        <>
          {isFetching ? (
            <>
              <Box className="loading-animation">
                <LeefLottieAnimationLoader
                  height={200}
                  width={180}
                ></LeefLottieAnimationLoader>
              </Box>
            </>
          ) : (
            <>
              {data?.data.length > 0 ? (
                <>
                  <TableContainer className="custom-scrollbar">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Report Name</StyledTableCell>
                          <StyledTableCell align="left">Type</StyledTableCell>
                          <StyledTableCell align="left">
                            Requested on
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            Start Date
                          </StyledTableCell>
                          <StyledTableCell
                            align="left"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Last Trigged Date
                          </StyledTableCell>
                          <StyledTableCell
                            align="left"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Next Trigged Date
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tableData?.map((report) => {
                          return (
                            <TableRow>
                              <StyledTableCell
                                bodyCellPadding={"15px 18px !important"}
                                sx={{ whiteSpace: "nowrap" }}
                              >
                                <Box>
                                  <Typography className="auto-scheduled-report-name-text">
                                    {report?.report_name}
                                  </Typography>
                                  <Typography className="auto-scheduled-report-days-text">
                                    {report?.period ? report?.period : "---"}
                                  </Typography>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell
                                align="left"
                                sx={{ whiteSpace: "nowrap" }}
                              >
                                <Typography className="auto-scheduled-date-text-size">
                                  {report?.report_type
                                    ? report?.report_type
                                    : "---"}
                                </Typography>
                              </StyledTableCell>

                              <StyledTableCell align="left">
                                <Typography className="auto-scheduled-date-text-size">
                                  {report?.requested_on
                                    ? report?.requested_on
                                    : "---"}
                                </Typography>
                              </StyledTableCell>

                              <StyledTableCell align="left">
                                <Typography className="auto-scheduled-date-text-size">
                                  {report?.start_date
                                    ? report?.start_date
                                    : "---"}
                                </Typography>
                              </StyledTableCell>

                              <StyledTableCell
                                align="left"
                                sx={{ whiteSpace: "nowrap" }}
                              >
                                <Typography className="auto-scheduled-date-text-size">
                                  {report?.last_trigger_time
                                    ? report?.last_trigger_time
                                    : "---"}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <Typography className="auto-scheduled-date-text-size">
                                  {report?.next_trigger_time
                                    ? report?.next_trigger_time
                                    : "---"}
                                </Typography>
                              </StyledTableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {data?.data?.length > 0 && (
                    <Box className="pagination-container-pending-leads">
                      <Pagination
                        className="pagination-bar"
                        currentPage={pageNumber}
                        page={pageNumber}
                        totalCount={rowCount}
                        pageSize={rowsPerPage}
                        onPageChange={(page) =>
                          handleChangePage(
                            page,
                            `autoScheduledSavePageNo`,
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
                        localStorageChangeRowPerPage={`autoScheduledRowPerPage`}
                        localStorageChangePage={`autoScheduledSavePageNo`}
                        setRowsPerPage={setRowsPerPage}
                      ></AutoCompletePagination>
                    </Box>
                  )}
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
  );
};

export default AutoScheduleReportTable;
