import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Typography } from "@mui/material";
import "../../styles/EventMapping.css";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import { useNavigate } from "react-router-dom";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import SortIndicatorWithTooltip from "../../components/shared/SortIndicatorWithTooltip/SortIndicatorWithTooltip";
import "../../styles/sharedStyles.css";
import "../../styles/EventMapping.css";
import Pagination from "../../components/shared/Pagination/Pagination";
import { handleChangePage } from "../../helperFunctions/pagination";
import { totalQueriesHead } from "../../constants/LeadStageList";

const StudentTotalQueriesDataTable = ({
  pageNumber,
  rowCount,
  count,
  rowsPerPage,
  setRowsPerPage,
  setPageNumber,
  tableData,
  isFetching,
  somethingWentWrongInStudentTable,
  studentTableInternalServerError,
  apiResponseChangeMessage,
  setStudentQuerySortObj,
}) => {
  const StyledTableCell = useTableCellDesign();
  const navigate = useNavigate();
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [sortColumn, setSortColumn] = useState("");
  const [sortType, setSortType] = useState(null); // asc or dsc or null
  return (
    <Box>
      <>
        {studentTableInternalServerError || somethingWentWrongInStudentTable ? (
          <>
            {studentTableInternalServerError && (
              <Error500Animation height={200} width={200}></Error500Animation>
            )}
            {somethingWentWrongInStudentTable && (
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
                    height={150}
                    width={180}
                  ></LeefLottieAnimationLoader>
                </Box>
              </>
            ) : (
              <>
                {tableData.length > 0 ? (
                  <>
                    <TableContainer
                      sx={{ boxShadow: 0 }}
                      component={Paper}
                      className="custom-scrollbar"
                    >
                      <Table
                        sx={{ minWidth: 700 }}
                        aria-label="customized table"
                      >
                        <TableHead>
                          <TableRow
                            sx={{
                              borderBottom: "1px solid rgba(238, 238, 238, 1)",
                            }}
                          >
                            {totalQueriesHead?.map((item, index) => {
                              return (
                                <StyledTableCell
                                  key={index}
                                  className={
                                    index === 0
                                      ? "table-cell-fixed student-queries-table-head-text"
                                      : "student-queries-table-head-text"
                                  }
                                  sx={{ whiteSpace: "nowrap" }}
                                >
                                  <Box className="sorting-option-with-header-content">
                                    {item?.label}{" "}
                                    {item?.sort && (
                                      <>
                                        {sortColumn === item.value ? (
                                          <SortIndicatorWithTooltip
                                            sortType={sortType}
                                            value={item?.value}
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
                                            value={item?.value}
                                          />
                                        )}
                                      </>
                                    )}
                                  </Box>
                                </StyledTableCell>
                              );
                            })}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tableData?.map((row, index) => (
                            <TableRow
                              sx={{
                                borderBottom:
                                  "1px solid rgba(238, 238, 238, 1)",
                              }}
                              key={row._id}
                            >
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                className="table-cell-fixed"
                                component="th"
                                scope="row"
                              >
                                {row.ticket_id}
                              </StyledTableCell>
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                component="th"
                                scope="row"
                              >
                                <Box>
                                  <Typography
                                    sx={{
                                      fontSize: "14px",
                                      color: "#092C4C",
                                      textDecoration: "underline",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      navigate("/userProfile", {
                                        state: {
                                          applicationId: row?.application_id,
                                          studentId: row?.student_id,
                                          courseName: row?.course_name,
                                          eventType: "total-queries",
                                          tabs: true,
                                        },
                                      });
                                    }}
                                  >
                                    {row.student_name}
                                  </Typography>
                                  <Typography
                                    sx={{ fontSize: "14px", color: "#092C4C" }}
                                  >
                                    {row.student_email_id
                                      ? row.student_email_id
                                      : "N/A"}
                                  </Typography>
                                </Box>
                              </StyledTableCell>

                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="left"
                              >
                                {row.category_name}
                              </StyledTableCell>
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="left"
                              >
                                {row.assigned_counselor_name
                                  ? row.assigned_counselor_name
                                  : "---"}
                              </StyledTableCell>
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="left"
                              >
                                {row.created_at}
                              </StyledTableCell>
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="left"
                              >
                                {row.updated_at}
                              </StyledTableCell>
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="left"
                              >
                                {row.resolution_time
                                  ? row.resolution_time
                                  : "---"}
                              </StyledTableCell>
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="left"
                              >
                                {row.assigned_counselor_name
                                  ? row.assigned_counselor_name
                                  : "---"}
                              </StyledTableCell>
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="left"
                              >
                                <Box
                                  className={
                                    row.status === "DONE"
                                      ? "student-total-queries-resolved-action"
                                      : row.status === "TO DO"
                                      ? "student-total-queries-open-action"
                                      : "student-total-queries-unResolved-action"
                                  }
                                >
                                  {row.status === "DONE"
                                    ? "Resolved"
                                    : row.status === "TO DO"
                                    ? "Open"
                                    : "Unresolved"}
                                </Box>
                              </StyledTableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box className="pagination-container-eventMapping">
                      <Pagination
                        className="pagination-bar"
                        currentPage={pageNumber}
                        page={pageNumber}
                        totalCount={rowCount}
                        pageSize={rowsPerPage}
                        onPageChange={(page) =>
                          handleChangePage(
                            page,
                            `adminApplicationSavePageNo`,
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
                        localStorageChangeRowPerPage={`adminTableRowPerPage`}
                        localStorageChangePage={`adminApplicationSavePageNo`}
                        setRowsPerPage={setRowsPerPage}
                      ></AutoCompletePagination>
                    </Box>
                  </>
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
              </>
            )}
          </>
        )}
      </>
    </Box>
  );
};

export default StudentTotalQueriesDataTable;
