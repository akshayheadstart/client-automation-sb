/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  Typography,
  Container,
  Box,
  Card,
  CardHeader,
  Button,
  Tooltip,
} from "@mui/material";
import { RestartAltRounded, FilterAlt } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import "../../styles/DownloadRequestList.css";
import { userTypes } from "../../constants/LeadStageList";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeCookies } from "../../Redux/Slices/authSlice";
import { handleChangePage } from "../../helperFunctions/pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import TableCellComponent from "../../components/shared/TableCellComponent";
import { handleSortingAScDes } from "../../helperFunctions/handleSortAscDes";
import {
  useGetDownloadRequestListDataQuery,
  usePrefetch,
} from "../../Redux/Slices/applicationDataApiSlice";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import useToasterHook from "../../hooks/useToasterHook";
import Pagination from "../../components/shared/Pagination/Pagination";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import { handleDataFilterOption } from "../../helperFunctions/handleDataFilterOption";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";

const DownloadRequestList = () => {
  const columns = [
    { columnName: "Request Id", id: "request_id" },
    { columnName: "Request By", id: "requested_by_name" },
    { columnName: "Report Type", id: "report_type" },
    { columnName: "Requested on", id: "requested_on" },
    { columnName: "Status", id: "status" },
    { columnName: "Records Counts", id: "record_count" },
    { columnName: "User Type", id: "user_type" },
  ];

  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const tokenState = useSelector((state) => state.authentication.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (tokenState.detail) {
    dispatch(removeCookies());
    navigate("/page401");
  }
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [
    downloadRequestTableInternalServerError,
    setDownloadRequestTableInternalServerError,
  ] = useState(false);
  const [hideDownloadRequestTable, setHideDownloadRequestTable] =
    useState(false);
  const [
    somethingWentWrongInDownloadRequestTable,
    setSomethingWentWrongInDownloadRequestTable,
  ] = useState(false);

  const [showFilterOptions, setShowFilterOptions] = useState(false);
  // const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedUserType, setSelectedUserType] = useState([]);
  const [downloadRequestLists, setDownloadRequestLists] = useState([]);
  const [holdDownloadRequestLists, setHoldDownloadRequestLists] = useState([]);
  const [totalRecordsCount, setTotalRecordsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [payloadForDownloadRequestList, setPayloadForDownloadRequestList] =
    useState({});

  const [rowCount, setRowCount] = useState(0);
  // states for pagination
  const tablePageNumber = localStorage.getItem(
    `${Cookies.get("userId")}downloadRequestTableSavePageNo`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}downloadRequestTableSavePageNo`
        )
      )
    : 1;

  const tableRowsPerPage = localStorage.getItem(
    `${Cookies.get("userId")}downloadRequestTableRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}downloadRequestTableRowPerPage`
        )
      )
    : 25;

  const [rowsPerPage, setRowsPerPage] = useState(tableRowsPerPage);
  const [pageNumber, setPageNumber] = useState(tablePageNumber);

  const count = Math.ceil(rowCount / rowsPerPage);

  const updatedPayloadForDownloadRequestList = {
    user_name: "",
    report_type: "",
    user_type: selectedUserType,
    user_id: "",
  };

  const {
    data: downloadRequestListData,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetDownloadRequestListDataQuery({
    pageNumber: pageNumber,
    rowsPerPage: rowsPerPage,
    collegeId: collegeId,
    payloadForDownloadRequestList,
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(downloadRequestListData?.data)) {
          setTotalRecordsCount(downloadRequestListData?.total);
          setDownloadRequestLists(downloadRequestListData?.data);
          setRowCount(downloadRequestListData?.total);
          setHoldDownloadRequestLists(downloadRequestListData?.data);
          if (
            localStorage.getItem(
              `${Cookies.get("userId")}CurrentDownloadRequestSortedItemAndIndex`
            )
          ) {
            const sortingData = JSON.parse(
              localStorage.getItem(
                `${Cookies.get(
                  "userId"
                )}CurrentDownloadRequestSortedItemAndIndex`
              )
            );
            if (sortingData.sort !== "default") {
              handleSortingAScDes(
                sortingData?.columnID,
                sortingData.sort,
                downloadRequestListData?.data,
                setLoading,
                setDownloadRequestLists
              );
              localStorage.setItem(
                `${Cookies.get("userId")}downloadRequestSort${
                  sortingData?.index
                }`,
                sortingData.sort
              );
            }
          }
        } else {
          throw new Error("download request list API response has changed");
        }
      }
      if (isError) {
        setTotalRecordsCount(0);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setDownloadRequestTableInternalServerError,
            setHideDownloadRequestTable,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInDownloadRequestTable,
        setHideDownloadRequestTable,
        10000
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, error, isError, isSuccess, navigate, downloadRequestListData]);

  // use react hook for prefetch data
  const prefetchDownloadRequestListData = usePrefetch(
    "getDownloadRequestListData"
  );
  useEffect(() => {
    apiCallFrontAndBackPage(
      downloadRequestListData,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchDownloadRequestListData,
      { payloadForDownloadRequestList }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    downloadRequestListData,
    pageNumber,
    prefetchDownloadRequestListData,
    rowsPerPage,
  ]);

  const handleUpdatePageNumber = () => {
    setPageNumber(1);
    localStorage.setItem(
      `${Cookies.get("userId")}downloadRequestTableSavePageNo`,
      1
    );
  };

  //getting filter from local storage
  useEffect(() => {
    const filterOptions = JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}downloadRequestFilter`)
    );
    if (filterOptions) {
      if (filterOptions.user_type?.length) {
        setSelectedUserType(filterOptions.user_type);
      }
      if (filterOptions.user_type?.length) {
        setShowFilterOptions(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSaveToLocalStorage = (value) => {
    handleDataFilterOption(value, "downloadRequestFilter");
  };

  const filterOptions = () => {
    return (
      <>
        <MultipleFilterSelectPicker
          handleFilterOption={(checkAll, allValue) =>
            handleFilterSaveToLocalStorage({
              user_type: checkAll ? allValue : [],
            })
          }
          style={{ width: "150px", marginRight: 10 }}
          placement="bottomEnd"
          placeholder="User Type"
          onChange={(value) => {
            handleFilterSaveToLocalStorage({ user_type: value });
            setSelectedUserType(value);
          }}
          pickerData={userTypes}
          setSelectedPicker={setSelectedUserType}
          pickerValue={selectedUserType}
        />
        <Button
          color="info"
          size="small"
          disabled={
            localStorage.getItem(
              `${Cookies.get("userId")}downloadRequestFilter`
            )
              ? false
              : true
          }
          variant="contained"
          onClick={() => {
            if (pageNumber !== 1) {
              handleUpdatePageNumber();
            }
            setPayloadForDownloadRequestList(
              updatedPayloadForDownloadRequestList
            );
          }}
        >
          Apply
        </Button>
      </>
    );
  };
  const {
    setHeadTitle,
    headTitle
  } = useContext(LayoutSettingContext);
  //Admin dashboard Head Title add
  useEffect(()=>{
    setHeadTitle('Download Request of Report')
    document.title = 'Download Request of Report';
  },[headTitle])
  return (
    <div className="download-request-header-box-container">
      <Container maxWidth={false}>
        <Grid container>
          <Grid item md={12} sm={12} xs={12}>
            <Box className="download-request-report-heading">
              <Typography color="textPrimary" gutterBottom variant="h5">
              </Typography>
              <Box>
                <Tooltip placement="top" arrow title="Reset all">
                  <IconButton
                    onClick={() => {
                      localStorage.removeItem(
                        `${Cookies.get("userId")}downloadRequestFilter`
                      );
                      setSelectedUserType([]);
                      setPayloadForDownloadRequestList({});
                    }}
                  >
                    <RestartAltRounded />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="top" title="Add filter">
                  <IconButton
                    onClick={() => setShowFilterOptions((prev) => !prev)}
                  >
                    <FilterAlt
                      className={`${showFilterOptions ? "selected-icon" : ""}`}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* table */}

            <Card sx={{ my: 2 }}>
              <Box className="filter-container-of-download-report-req">
                <CardHeader
                  sx={{ py: 2, px: 0 }}
                  title={
                    <TableDataCount
                      totalCount={totalRecordsCount}
                      currentPageShowingCount={downloadRequestLists.length}
                      pageNumber={pageNumber}
                      rowsPerPage={rowsPerPage}
                    />
                  }
                ></CardHeader>
                {showFilterOptions && <Box>{filterOptions()}</Box>}
              </Box>
              <Divider />
              {/* <Scrollbar> */}

              {downloadRequestTableInternalServerError ||
              somethingWentWrongInDownloadRequestTable ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "55vh",
                    alignItems: "center",
                  }}
                  data-testid="error-animation-container"
                >
                  {downloadRequestTableInternalServerError && (
                    <Error500Animation
                      height={400}
                      width={400}
                    ></Error500Animation>
                  )}
                  {somethingWentWrongInDownloadRequestTable && (
                    <ErrorFallback
                      error={apiResponseChangeMessage}
                      resetErrorBoundary={() => window.location.reload()}
                    />
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    visibility: hideDownloadRequestTable ? "hidden" : "visible",
                  }}
                >
                  {isFetching || loading ? (
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
                  ) : downloadRequestLists?.length > 0 ? (
                    <Table sx={{ minWidth: 800 }}>
                      <TableHead
                        sx={{
                          backgroundColor: "#F2F9FE",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <TableRow>
                          {columns.map((column, index) => (
                            <TableCellComponent
                              key={index}
                              index={index}
                              column={column}
                              setLoading={setLoading}
                              setList={setDownloadRequestLists}
                              hold={holdDownloadRequestLists}
                              list={downloadRequestLists}
                              sortingIndexName={"downloadRequestSort"}
                              CurrentDataLocalStorageKeyName={
                                "CurrentDownloadRequestSortedItemAndIndex"
                              }
                            ></TableCellComponent>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {downloadRequestLists.map((list) => (
                          <TableRow hover key={list?.report_id}>
                            <TableCell>
                              <Typography
                                color="textPrimary"
                                variant="subtitle2"
                              >
                                {list?.request_id ? list?.request_id : `– –`}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {list?.requested_by_name
                                ? list?.requested_by_name
                                : `– –`}
                            </TableCell>
                            <TableCell>
                              {list?.report_type ? list?.report_type : `– –`}
                            </TableCell>
                            <TableCell>
                              {list?.requested_on ? list?.requested_on : `– –`}
                            </TableCell>
                            <TableCell>
                              {list?.status ? list?.status : `– –`}
                            </TableCell>
                            <TableCell>
                              {list?.record_count ? list?.record_count : "0"}
                            </TableCell>
                            <TableCell>
                              {list?.user_type ? list?.user_type : `– –`}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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

                  {!loading &&
                    !isFetching &&
                    downloadRequestLists?.length > 0 && (
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
                              `downloadRequestTableSavePageNo`,
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
                          localStorageChangeRowPerPage={`downloadRequestTableRowPerPage`}
                          localStorageChangePage={`downloadRequestTableSavePageNo`}
                          setRowsPerPage={setRowsPerPage}
                        ></AutoCompletePagination>
                      </Box>
                    )}
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default DownloadRequestList;
