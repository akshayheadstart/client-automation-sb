/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  IconButton,
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
import ReportCreateDrawer from "../../components/ui/Report/ReportCreateDrawer";
import { handleChangePage } from "../../helperFunctions/pagination";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import useToasterHook from "../../hooks/useToasterHook";
import counsellorSearchIcon from "../../images/searchIcon.png";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/MODDesignPage.css";
import "../../styles/pendingLeads.css";
import "../../styles/report.css";
import "../../styles/sharedStyles.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import Cookies from "js-cookie";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
const PreviousGeneratedReport = ({
  setSelectedData,
  setSelectedDataIds,
  setTitleText,
  setSelectedSingleData,
  reportTemplateCount,
  setReportId,
  setViewButton,
  selectedReportList,
  setSelectedReportList,
}) => {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [openGenerateReportDrawerIn, setOpenGenerateReportDrawerIn] =
    useState(false);
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
      autoSchedule: false,
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
  const prefetchGenerateData = usePrefetch("getReportAutoScheduledData");
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchGenerateData,
      {
        autoSchedule: false,
        search,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, prefetchGenerateData, rowsPerPage]);
  const [selectedReportId, setSelectedReportId] = useState([]);
  const localStorageKeyName = `${Cookies.get("userId")}selectedReportList`;
  //top checkbox handler function
  const handleAllCheckbox = (e) => {
    if (e.target.checked === true) {
      const adminSelectedApplications = JSON.parse(
        localStorage.getItem(localStorageKeyName)
      );

      if (adminSelectedApplications?.length > 0) {
        //applications
        const filteredApplications = tableData.filter(
          (report) =>
            !selectedReportList.some(
              (element) => element.report_id === report.report_id
            )
        );

        setSelectedReportList((currentArray) => [
          ...currentArray,
          ...filteredApplications,
        ]);
        localStorage.setItem(
          localStorageKeyName,
          JSON.stringify([...selectedReportList, ...filteredApplications])
        );
      } else {
        setSelectedReportList(tableData);
        localStorage.setItem(localStorageKeyName, JSON.stringify(tableData));
      }
    } else {
      //set selected applications
      const filteredApplications = selectedReportList.filter(
        (report) =>
          !tableData.some((element) => element.report_id === report.report_id)
      );
      setSelectedReportList(filteredApplications);
      localStorage.setItem(
        localStorageKeyName,
        JSON.stringify(filteredApplications)
      );
    }
  };
  //top checkbox and indeterminate state
  const [selectTopCheckbox, setSelectTopCheckbox] = useState(false);
  const [showIndeterminate, setShowIndeterminate] = useState(false);
  //show top checkbox and indeterminate
  useEffect(() => {
    let applicationCount = 0;
    const applicationIds = tableData?.map((report) => report.report_id);
    applicationIds?.forEach((item) => {
      if (selectedReportId?.indexOf(item) !== -1) applicationCount++;
    });

    if (applicationCount === tableData?.length && applicationCount > 0) {
      setSelectTopCheckbox(true);
    } else {
      setSelectTopCheckbox(false);
    }

    if (applicationCount < tableData?.length && applicationCount > 0) {
      setShowIndeterminate(true);
    } else {
      setShowIndeterminate(false);
    }
  }, [tableData, selectedReportId]);
  const handleApplicationCheckBox = (e, dataRow) => {
    const selectedApplicationIds = selectedReportList.map(
      (report) => report.report_id
    );
    if (e.target.checked === true) {
      if (selectedReportList.length < 1) {
        //applications
        setSelectedReportList([dataRow]);
        localStorage.setItem(localStorageKeyName, JSON.stringify([dataRow]));
      } else if (!selectedApplicationIds.includes(dataRow.data_segment_id)) {
        //applications
        setSelectedReportList((currentArray) => [...currentArray, dataRow]);

        localStorage.setItem(
          localStorageKeyName,
          JSON.stringify([...selectedReportList, dataRow])
        );
      }
    } else {
      const filteredApplications = selectedReportList.filter((object) => {
        return object.report_id !== dataRow.report_id;
      });

      setSelectedReportList(filteredApplications);
      localStorage.setItem(
        localStorageKeyName,
        JSON.stringify(filteredApplications)
      );
    }
  };
  useEffect(() => {
    const selectedDataSegmentIds = selectedReportList?.map(
      (object) => object.report_id
    );
    setSelectedReportId(selectedDataSegmentIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReportList]);

  useEffect(() => {
    if (selectedReportList) {
      const selectedReportIds = selectedReportList?.map(
        (report) => report.report_id
      );
      setSelectedDataIds(selectedReportIds);
      setSelectedData(selectedReportList);
    }
  }, [selectedReportList]);
  return (
    <Box sx={{ width: "100%" }}>
      <Box className="auto-scheduled-table-report-header-box">
        <Typography className="auto-scheduled-headline-text">
          Previous generated Reports
        </Typography>
        <Box className="generate-new-report-button-box">
          <Box>
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
          <Button
            sx={{ borderRadius: 50 }}
            variant="contained"
            color="info"
            size="small"
            className="generate-new-report-button"
            onClick={() => {
              setOpenGenerateReportDrawerIn(true);
              setTitleText("Generate New Report");
            }}
          >
            Generate New Report
          </Button>
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
                          <StyledTableCell>
                            <Checkbox
                              sx={{
                                "&.Mui-checked": {
                                  color: "#008be2",
                                },
                                "&.MuiCheckbox-indeterminate": {
                                  color: "#008be2",
                                },
                              }}
                              checked={selectTopCheckbox}
                              onChange={(e) => {
                                handleAllCheckbox(e);
                              }}
                              indeterminate={showIndeterminate}
                            />
                          </StyledTableCell>
                          <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                            Report Name
                          </StyledTableCell>
                          <StyledTableCell
                            align="left"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Requested Id
                          </StyledTableCell>
                          <StyledTableCell align="left">Type</StyledTableCell>
                          <StyledTableCell align="left">Format</StyledTableCell>
                          <StyledTableCell
                            align="left"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            Requested on
                          </StyledTableCell>
                          <StyledTableCell
                            align="left"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            status
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tableData?.map((report, index) => {
                          return (
                            <TableRow key={index}>
                              <StyledTableCell>
                                {selectedReportId?.includes(
                                  report?.report_id
                                ) ? (
                                  <IconButton
                                    sx={{ p: "9px" }}
                                    onClick={() => {
                                      handleApplicationCheckBox(
                                        {
                                          target: {
                                            checked: false,
                                          },
                                        },
                                        report
                                      );
                                    }}
                                  >
                                    <CheckBoxOutlinedIcon
                                      sx={{ color: "#008be2" }}
                                    />
                                  </IconButton>
                                ) : (
                                  <Checkbox
                                    sx={{
                                      "&.Mui-checked": {
                                        color: "#008be2",
                                      },
                                    }}
                                    checked={
                                      selectedReportId?.includes(
                                        report?.report_id
                                      )
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => {
                                      handleApplicationCheckBox(e, report);
                                    }}
                                  />
                                )}
                              </StyledTableCell>
                              <StyledTableCell
                                bodyCellPadding={"15px 18px !important"}
                                sx={{ whiteSpace: "nowrap" }}
                              >
                                <Box>
                                  <Typography className="auto-scheduled-report-name-text">
                                    {report?.report_name}
                                  </Typography>
                                  <Typography className="auto-scheduled-report-days-text">
                                    {report?.statement
                                      ? `Date Range: ${report?.statement}`
                                      : "---"}
                                  </Typography>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell
                                align="left"
                                sx={{ whiteSpace: "nowrap" }}
                              >
                                <Typography className="auto-scheduled-date-text-size">
                                  {report?.request_id
                                    ? report?.request_id
                                    : "---"}
                                </Typography>
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
                              <StyledTableCell
                                align="left"
                                sx={{ whiteSpace: "nowrap" }}
                              >
                                <Typography className="auto-scheduled-date-text-size">
                                  {report?.format ? report?.format : "---"}
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
                                <Box
                                  className={
                                    report?.status
                                      ? "previous-report-unResolved-action"
                                      : "previous-report-resolved-action"
                                  }
                                >
                                  {report?.status ? report?.status : "N/A"}
                                </Box>
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
      {openGenerateReportDrawerIn && (
        <ReportCreateDrawer
          openDrawer={openGenerateReportDrawerIn}
          setOpenDrawer={setOpenGenerateReportDrawerIn}
          title={"Generate New Report"}
          reportTemplateCount={reportTemplateCount}
          setSelectedData={setSelectedData}
          setReportId={setReportId}
          setViewButton={setViewButton}
        />
      )}
    </Box>
  );
};

export default PreviousGeneratedReport;
