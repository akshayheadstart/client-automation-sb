import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Pagination from "../shared/Pagination/Pagination";
import AutoCompletePagination from "../shared/forms/AutoCompletePagination";
import LeefLottieAnimationLoader from "../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { useContext } from "react";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import {
  allCheckboxHandlerFunction,
  handleLocalStorageForCheckbox,
  showCheckboxAndIndeterminate,
  singleCheckboxHandlerFunction,
} from "../../helperFunctions/checkboxHandleFunction";
import { handleChangePage } from "../../helperFunctions/pagination";
import BaseNotFoundLottieLoader from "../shared/Loader/BaseNotFoundLottieLoader";
import { convertDateAndTime } from "../../helperFunctions/formatDateAndTime";
import { defaultRowsPerPageOptions } from "../Calendar/utils";

const InterviewListTable = ({
  paginationRef,
  interviewListData,
  isFetching,
  interviewListInternalServerError,
  interviewListSomethingWentWrong,
  hideInterviewList,
  selectedInterviewList,
  setSelectedInterviewList,
  localStorageKeyName,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
  totalInterviewList,
  searchResultShow,
}) => {
  const tableHeader = [
    "Interview List Name",
    "Moderator Name",
    "Program",
    "Created on",
    "Count",
    "Status",
    "Selected",
    "Shortlisted",
    "Rejected",
    "Offered",
    "Seat Booked",
  ];

  const { apiResponseChangeMessage } = useContext(DashboradDataContext);

  //top checkbox and indeterminate state
  const [selectTopCheckbox, setSelectTopCheckbox] = useState(false);
  const [showIndeterminate, setShowIndeterminate] = useState(false);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const interviewListId = interviewListData?.map((list) => list?.interview_id);

  // set selected users in state from local storage after reload
  useEffect(() => {
    handleLocalStorageForCheckbox(
      localStorageKeyName,
      setSelectedInterviewList
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorageKeyName]);

  //show top checkbox and indeterminate
  useEffect(() => {
    showCheckboxAndIndeterminate(
      interviewListId,
      selectedInterviewList,
      setSelectTopCheckbox,
      setShowIndeterminate
    );
  }, [interviewListId, selectedInterviewList]);

  const count = Math.ceil(totalInterviewList / pageSize);

  return (
    <>
      {interviewListInternalServerError || interviewListSomethingWentWrong ? (
        <Box className=".loading-animation-for-notification">
          {interviewListInternalServerError && (
            <Error500Animation height={300} width={300}></Error500Animation>
          )}
          {interviewListSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box
          sx={{ mt: 2, visibility: hideInterviewList ? "hidden" : "visible" }}
        >
          {isFetching ? (
            <Box className="loading-animation-for-notification">
              <LeefLottieAnimationLoader
                height={100}
                width={100}
              ></LeefLottieAnimationLoader>
            </Box>
          ) : (
            <>
              {interviewListData?.length > 0 ? (
                <TableContainer className="custom-scrollbar">
                  <Table>
                    <TableHead className="interview-list-table-header">
                      <TableRow>
                        <TableCell align="center">
                          <Checkbox
                            checked={selectTopCheckbox}
                            onChange={(e) =>
                              allCheckboxHandlerFunction(
                                e,
                                localStorageKeyName,
                                interviewListId,
                                selectedInterviewList,
                                setSelectedInterviewList
                              )
                            }
                            indeterminate={showIndeterminate}
                            color="info"
                          />
                        </TableCell>

                        {tableHeader.map((name) => (
                          <TableCell key={name}>{name}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {interviewListData?.map((item) => (
                        <TableRow
                          key={item}
                          className="interview-list-table-row"
                        >
                          <TableCell align="center">
                            {selectedInterviewList?.includes(
                              item?.interview_id
                            ) ? (
                              <IconButton
                                sx={{ p: "9px" }}
                                onClick={() => {
                                  singleCheckboxHandlerFunction(
                                    {
                                      target: {
                                        checked: false,
                                      },
                                    },
                                    item?.interview_id,
                                    localStorageKeyName,
                                    selectedInterviewList,
                                    setSelectedInterviewList
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
                                  selectedInterviewList?.includes(
                                    item?.interview_id
                                  )
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  singleCheckboxHandlerFunction(
                                    e,
                                    item?.interview_id,
                                    localStorageKeyName,
                                    selectedInterviewList,
                                    setSelectedInterviewList
                                  );
                                }}
                              />
                            )}
                          </TableCell>

                          <TableCell>{item?.list_name || `– –`}</TableCell>
                          <TableCell>{item?.moderator_name || `– –`}</TableCell>
                          <TableCell>{item?.course_name || `– –`}</TableCell>
                          <TableCell>
                            {item?.created_at
                              ? convertDateAndTime(item?.created_at)
                              : `– –`}
                          </TableCell>
                          <TableCell>{item?.total_count || `– –`}</TableCell>
                          <TableCell>
                            <Typography
                              className={`${
                                item?.status?.toLowerCase() === "archived"
                                  ? "closed"
                                  : item?.status?.toLowerCase()
                              } interview-list-table-status`}
                            >
                              {item?.status || `– –`}
                            </Typography>
                          </TableCell>
                          <TableCell>{item?.selected || `– –`}</TableCell>
                          <TableCell>{item?.shortlisted || `– –`}</TableCell>
                          <TableCell>{item?.rejected || `– –`}</TableCell>
                          <TableCell>{item?.offered || `– –`}</TableCell>
                          <TableCell>{item?.seat_booked || `– –`}</TableCell>
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
                    height={200}
                    width={200}
                  ></BaseNotFoundLottieLoader>
                </Box>
              )}
              {!searchResultShow && interviewListData?.length > 0 && (
                <Box
                  ref={paginationRef}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Pagination
                    className="pagination-bar"
                    currentPage={pageNumber}
                    totalCount={totalInterviewList}
                    pageSize={pageSize}
                    onPageChange={(page) =>
                      handleChangePage(page, "", setPageNumber)
                    }
                    count={count}
                  />
                  <AutoCompletePagination
                    rowsPerPage={pageSize}
                    rowPerPageOptions={rowPerPageOptions}
                    setRowsPerPageOptions={setRowsPerPageOptions}
                    rowCount={totalInterviewList}
                    page={pageNumber}
                    setPage={setPageNumber}
                    setRowsPerPage={setPageSize}
                  ></AutoCompletePagination>
                </Box>
              )}
            </>
          )}
        </Box>
      )}
    </>
  );
};

export default InterviewListTable;
