import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  Drawer,
  Typography,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  CounsellorCallListReviewColumn,
  formateDate,
} from "../../utils/QAManagerUtils";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import { handleChangePage } from "../../helperFunctions/pagination";
import Pagination from "../../components/shared/Pagination/Pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import CallListActions from "./CallListActions";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import CallReview from "./CallReview";
import CallListFilters from "./CallListFilters";
import useToasterHook from "../../hooks/useToasterHook";
// import {
//   useGetCallListReviewDataQuery,
//   usePrefetch,
// } from "../../Redux/Slices/applicationDataApiSlice";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";

import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import dayjs from "dayjs";
import ShowCallRecording from "../../components/ui/communication-performance/CommunicationSummary/ShowCallRecording";
import CallRecordingDialog from "../../components/ui/communication-performance/CommunicationSummary/CallRecordingDialog";
import {
  useGetCallListReviewDataQuery,
  usePrefetch,
} from "../../Redux/Slices/telephonySlice";

const CallListReviewTable = ({
  isActionDisable,
  user,
  collegeId,
  setHideComponent = () => {},
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callRecordingFile, setCallRecordingFile] = useState("");

  const [openCallRecording, setOpenCallRecording] = useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(25);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [selectTopCheckbox, setSelectTopCheckbox] = React.useState(false);
  const [selectedCallIds, setSelectedCallIds] = React.useState([]);
  const [isScrolledToPagination, setIsScrolledToPagination] =
    React.useState(false);
  const [openReviewDrawer, setOpenReviewDrawer] = React.useState(false);
  const [callListData, setCallListData] = React.useState(null);

  const [reviewData, setReviewData] = React.useState(null);
  const [filters, setFilters] = React.useState(null);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    React.useContext(DashboradDataContext);

  const [internalServerError, setInternalServerError] = React.useState("");
  const [somethingWentWrong, setSomethingWentWrong] = React.useState("");

  const [paginationRef, { entry: paginationEntry }] = useIntersectionObserver();

  const pushNotification = useToasterHook();

  const isHeadCounsellor = user === "college_head_counselor";
  const isPaginationVisible =
    paginationEntry && paginationEntry?.isIntersecting;
  const successStaus = ["pass", "not_qced", "accepted"];

  React.useEffect(() => {
    if (isPaginationVisible) {
      setIsScrolledToPagination(true);
    } else {
      setIsScrolledToPagination(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginationVisible]);

  const handleAllCheckbox = (e) => {
    setSelectTopCheckbox(e.target.checked);
    if (e.target.checked) {
      setSelectedCallIds(callListData?.data?.map((item) => item._id));
    } else {
      setSelectedCallIds([]);
    }
  };

  const handleCallListCheckBox = (e, item) => {
    if (e.target.checked) {
      setSelectedCallIds([...selectedCallIds, item._id]);
    } else {
      const filtered = selectedCallIds?.filter((id) => item._id !== id);
      setSelectedCallIds(filtered);
    }
  };

  const handleChangeQA = () => {};

  const getPayload = () => {
    return {
      qc_date_range: {
        start_date: formateDate(filters?.qcDate?.[0] || null),
        end_date: formateDate(filters?.qcDate?.[1] || null),
      },
      call_date_range: {
        start_date: formateDate(filters?.qcCallDate?.[0] || null),
        end_date: formateDate(filters?.qcCallDate?.[1] || null),
      },
      qa: {
        qa: filters?.qa || null,
      },
      counsellor: {
        counsellor: filters?.counsellor || null,
      },
      qc_status: {
        qc_status: filters?.qcStatus || null,
      },
    };
  };

  const { data, error, isSuccess, isError, isFetching } =
    useGetCallListReviewDataQuery(
      {
        collegeId,
        pageNumber,
        rowsPerPage: pageSize,
        call_type: filters?.callType || null,
        payload: getPayload(),
      },
      {
        skip: !collegeId,
      }
    );

  React.useEffect(() => {
    try {
      if (isSuccess) {
        if (data.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data.detail) {
          pushNotification("error", data.detail);
        } else if (data?.data) {
          setCallListData(data);
        }
      } else if (isError) {
        if (error?.status === 500) {
          handleInternalServerError(
            setInternalServerError,
            setHideComponent,
            10000
          );
          setCallListData(null);
        }
      }
    } catch (err) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrong, setHideComponent, 10000);
      setCallListData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isSuccess, isError]);

  const prefetchCallList = usePrefetch("getCallListReviewData");

  React.useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      pageSize,
      pageNumber,
      collegeId,
      prefetchCallList,
      { payload: getPayload(), call_type: filters?.callType || null }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, prefetchCallList, pageSize, collegeId, filters]);

  const handleFilterChange = React.useCallback((fltrs, resetToFirstPage) => {
    setFilters(fltrs);
    resetToFirstPage && setPageNumber(1);
  }, []);

  const handleReviewClick = (data) => {
    setOpenReviewDrawer(true);
    setReviewData(data);
  };

  const closeDrawer = () => {
    setOpenReviewDrawer(false);
    setReviewData(null);
  };

  return (
    <Box className="full-width">
      {internalServerError || somethingWentWrong ? (
        <Box className="loading-animation-for-notification">
          {internalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box>
          <CallListFilters
            collegeId={collegeId}
            isCallList
            filterChange={handleFilterChange}
            user={user}
            isError={internalServerError || somethingWentWrong}
          />
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
          ) : callListData?.data?.length ? (
            <Box>
              <TableContainer className="custom-scrollbar">
                <Table
                  className="call-list-table"
                  size="small"
                  sx={{ minWidth: 900 }}
                >
                  <TableHead>
                    <TableRow>
                      {!isActionDisable && (
                        <TableCell className="header-text">
                          <Checkbox
                            checked={selectTopCheckbox}
                            onChange={(e) => handleAllCheckbox(e)}
                            color="info"
                          />
                        </TableCell>
                      )}
                      {CounsellorCallListReviewColumn?.map((col) =>
                        col?.value === "call_remarks" &&
                        isHeadCounsellor ? null : (
                          <TableCell
                            sx={{ minWidth: col.width, mr: 3 }}
                            className="header-text"
                            key={col.value}
                          >
                            {col.label}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {callListData?.data?.map((item) => {
                      return (
                        <TableRow key={item?._id} className="call-list-row">
                          {!isActionDisable && (
                            <TableCell>
                              {selectedCallIds?.includes(item?._id) ? (
                                <IconButton
                                  sx={{ p: "9px" }}
                                  onClick={() => {
                                    handleCallListCheckBox(
                                      {
                                        target: {
                                          checked: false,
                                        },
                                      },
                                      item
                                    );
                                  }}
                                >
                                  <CheckBoxOutlinedIcon
                                    sx={{ color: "#008be2" }}
                                  />
                                </IconButton>
                              ) : (
                                <Checkbox
                                  checked={
                                    selectedCallIds?.includes(item?._id)
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    handleCallListCheckBox(e, item);
                                  }}
                                />
                              )}
                            </TableCell>
                          )}
                          <TableCell>
                            <Box
                              className={`${
                                isHeadCounsellor ? "" : "clickable-text"
                              }`}
                              onClick={() =>
                                !isHeadCounsellor && handleReviewClick(item)
                              }
                            >
                              <Typography className="call-list-cell-value single-line-text">
                                {item?.call_date_time}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              className={`capsule 
                            ${
                              item?.call_type === "Outbound"
                                ? "outbound"
                                : "inbound"
                            }`}
                            >
                              {item?.call_type}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <ShowCallRecording
                              duration={item?.call_duration}
                              setOpenCallRecording={setOpenCallRecording}
                              callDetails={{
                                callId: item?._id,
                                recording: item?.recording,
                                phone: item?.dialed_number,
                                duration: item?.call_duration,
                              }}
                              setPhoneNumber={setPhoneNumber}
                              setCallRecordingFile={setCallRecordingFile}
                            />
                          </TableCell>
                          <TableCell>
                            <Box
                              className={`capsule ${
                                successStaus.includes(
                                  item.qc_status?.toLowerCase()
                                )
                                  ? "success-status"
                                  : "error-status"
                              }`}
                            >
                              {item?.qc_status}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography className="call-list-cell-value single-line-text">
                              {item?.qa_score !== null
                                ? `${item?.qa_score?.toFixed(2)}%`
                                : "--"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {item?.qa_name ? (
                              item?.qa_name?.length > 15 ? (
                                <Tooltip title={item?.qa_name}>
                                  <Typography className="call-list-cell-value single-line-text">
                                    {item?.qa_name?.substring(0, 14)}...
                                  </Typography>
                                </Tooltip>
                              ) : (
                                <Typography className="call-list-cell-value">
                                  {item?.qa_name}
                                </Typography>
                              )
                            ) : (
                              "--"
                            )}
                          </TableCell>
                          <TableCell>
                            {item?.qc_date ? (
                              <Typography className="call-list-cell-value single-line-text">
                                {item?.qc_date
                                  ? dayjs(item?.qc_date).format("DD MMM YYYY")
                                  : null}
                              </Typography>
                            ) : (
                              "--"
                            )}
                          </TableCell>
                          <TableCell>
                            {item?.counsellor_name ? (
                              item?.counsellor_name?.length > 15 ? (
                                <Tooltip title={item?.counsellor_name}>
                                  <Typography className="call-list-cell-value single-line-text">
                                    {item?.counsellor_name?.substring(0, 14)}...
                                  </Typography>
                                </Tooltip>
                              ) : (
                                <Typography className="call-list-cell-value">
                                  {item?.counsellor_name}
                                </Typography>
                              )
                            ) : (
                              "--"
                            )}
                          </TableCell>
                          <TableCell>
                            {item?.lead_name ? (
                              item?.lead_name?.length > 15 ? (
                                <Tooltip title={item?.lead_name}>
                                  <Typography className="call-list-cell-value single-line-text">
                                    {item?.lead_name?.substring(0, 14)}...
                                  </Typography>
                                </Tooltip>
                              ) : (
                                <Typography className="call-list-cell-value">
                                  {" "}
                                  {item?.lead_name}{" "}
                                </Typography>
                              )
                            ) : (
                              "--"
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography className="call-list-cell-value single-line-text">
                              {item?.call_starting !== null
                                ? item?.call_starting
                                : "--"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography className="call-list-cell-value single-line-text">
                              {item?.call_closing !== null
                                ? item?.call_closing
                                : "--"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography className="call-list-cell-value single-line-text">
                              {item?.call_engagement !== null
                                ? item?.call_engagement
                                : "--"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography className="call-list-cell-value single-line-text">
                              {item?.call_issue_handling !== null
                                ? item?.call_issue_handling
                                : "--"}
                            </Typography>
                          </TableCell>
                          {isHeadCounsellor ? null : (
                            <TableCell>
                              <Button
                                className="review-btn"
                                variant="outlined"
                                onClick={() => handleReviewClick(item)}
                              >
                                Review this call
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                ref={paginationRef}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Pagination
                  className=""
                  currentPage={pageNumber}
                  totalCount={callListData?.total || 0}
                  pageSize={pageSize}
                  onPageChange={(page) =>
                    handleChangePage(
                      page,
                      `callListReviewTablePageNo`,
                      setPageNumber
                    )
                  }
                  count={callListData?.count || 0}
                />
                <AutoCompletePagination
                  rowsPerPage={pageSize}
                  rowPerPageOptions={rowPerPageOptions}
                  setRowsPerPageOptions={setRowsPerPageOptions}
                  rowCount={callListData?.total || 0}
                  page={pageNumber}
                  setPage={setPageNumber}
                  localStorageChangeRowPerPage={`counsellorCallListTableRowPerPage`}
                  localStorageChangePage={`counsellorCallListSavePageNo`}
                  setRowsPerPage={setPageSize}
                ></AutoCompletePagination>
              </Box>
            </Box>
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
        </Box>
      )}
      {selectedCallIds?.length ? (
        <CallListActions
          selectedCallIds={selectedCallIds?.length}
          isScrolledToPagination={isScrolledToPagination}
          onChangeQA={handleChangeQA}
        />
      ) : null}
      <Drawer anchor="right" open={openReviewDrawer} onClose={closeDrawer}>
        <CallReview
          collegeId={collegeId}
          data={reviewData}
          onClose={closeDrawer}
          open={openReviewDrawer}
        />
      </Drawer>
      <CallRecordingDialog
        openDialog={openCallRecording}
        setOpenDialog={setOpenCallRecording}
        phoneNumber={phoneNumber}
        callRecordingFile={callRecordingFile}
      />
    </Box>
  );
};

export default CallListReviewTable;
