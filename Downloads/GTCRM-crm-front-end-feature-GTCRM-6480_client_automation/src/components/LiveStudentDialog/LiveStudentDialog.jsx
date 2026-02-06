import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
   Drawer,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleChangePage } from "../../helperFunctions/pagination";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import "../../styles/liveStudentDialog.css";
import "../../styles/sharedStyles.css";
import { defaultRowsPerPageOptions } from "../Calendar/utils";
import Pagination from "../shared/Pagination/Pagination";
import AutoCompletePagination from "../shared/forms/AutoCompletePagination";
import CustomTooltip from "../shared/Popover/Tooltip";
const LiveStudentDialog = ({
  openLiveStudent,
  handleLiveStudentClose,
  liveApplicantsCount,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const StyledTableCell = useTableCellDesign();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const navigate = useNavigate();
  const count = Math.ceil(
    liveApplicantsCount?.live_student_list?.length / pageSize
  );
  const lastIndex = pageNumber * pageSize;
  const firstIndex = lastIndex - pageSize;
  const liveRecordsData = liveApplicantsCount?.live_student_list?.slice(
    firstIndex,
    lastIndex
  );

  return (
    <Drawer
    anchor={"right"}
      fullScreen={fullScreen}
      open={openLiveStudent}
      onClose={handleLiveStudentClose}
      disableEnforceFocus={true}
    >
      <Box className="live-student-headline-text">
        <Typography className="live-student-text-to-create">
          Live Student
        </Typography>
        <IconButton>
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => handleLiveStudentClose()}
          />
        </IconButton>
      </Box>
      <Box className="user-profile-control-drawer-box-container">
        <TableContainer
          sx={{ boxShadow: 0,minHeight:450}}
          component={Paper}
          className="custom-scrollbar vertical-scrollbar"
        >
          <Table sx={{ minWidth: 400 }} aria-label="customized table">
            <TableHead>
              <TableRow
                sx={{ borderBottom: "1px solid rgba(238, 238, 238, 1)" }}
              >
                <StyledTableCell align={"left"}>Student Name</StyledTableCell>
                <StyledTableCell align={"left"}>Course Name</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {liveRecordsData?.map((row, index) => (
                <TableRow
                  sx={{ borderBottom: "1px solid rgba(238, 238, 238, 1)" }}
                  key={index}
                >
                  <StyledTableCell
                    bodyCellPadding={"16px 18px !important"}
                    sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                    align="left"
                  >
                    <Typography className="live-student-name-text">
                      {row?.name ? row?.name : "---"}
                    </Typography>

                    <Typography className="live-student-email-text">
                      {row?.email ? row?.email : "---"}
                    </Typography>
                  </StyledTableCell>

                  <StyledTableCell
                    bodyCellPadding={"16px 18px !important"}
                    sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                    align="left"
                  >
                    {row?.applications.length > 0 ? (
                      <>
                        {row?.applications?.map((course) => {
                          return (
                            <>
                              {course?.application_name?.length > 36 ? (
                                <CustomTooltip
                                  description={
                                    <ul className="items-data-align-design-tooltip">
                                        <li>{`${course?.application_name}
                                            `}</li>
                                    </ul>
                                  }
                                  component={
                                    <Typography
                                      className="live-student-course-text"
                                      onClick={() => {
                                        navigate("/userProfile", {
                                          state: {
                                            applicationId:
                                              course?.application_id,
                                            studentId: row?.student_id,
                                            eventType: "live-student",
                                          },
                                        });
                                      }}
                                    >
                                      {`${course?.application_name.slice(
                                        0,
                                        36
                                      )}....`}
                                    </Typography>
                                  }
                                  color={true}
                                  placement={"left"}
                                />
                              ) : (
                                <Typography
                                  className="live-student-course-text"
                                  onClick={() => {
                                    navigate("/userProfile", {
                                      state: {
                                        applicationId: course?.application_id,
                                        studentId: row?.student_id,
                                        eventType: "live-student",
                                      },
                                    });
                                  }}
                                >
                                  {`${course?.application_name}`}
                                </Typography>
                              )}
                            </>
                          );
                        })}
                      </>
                    ) : (
                      <Typography className="">{`---`}</Typography>
                    )}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box className="pagination-container-live-student">
          <Pagination
            className="pagination-bar"
            currentPage={pageNumber}
            page={pageNumber}
            totalCount={liveApplicantsCount?.live_student_list?.length}
            pageSize={pageSize}
            onPageChange={(page) =>
              handleChangePage(page, `SavePageNo`, setPageNumber)
            }
            count={count}
          />
          <AutoCompletePagination
            rowsPerPage={pageSize}
            rowPerPageOptions={rowPerPageOptions}
            setRowsPerPageOptions={setRowsPerPageOptions}
            rowCount={liveApplicantsCount?.live_student_list?.length}
            page={pageNumber}
            setPage={setPageNumber}
            localStorageChangeRowPerPage={`RowPerPage`}
            localStorageChangePage={`SavePageNo`}
            setRowsPerPage={setPageSize}
          ></AutoCompletePagination>
        </Box>
      </Box>
    </Drawer>
  );
};

export default LiveStudentDialog;
