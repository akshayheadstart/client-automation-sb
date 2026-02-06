import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import IndividualCheckBox from "../../components/shared/SelectedStudent/IndividualCheckBox";
import StudentContact from "../../components/ui/application-manager/StudentContact";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import { useNavigate } from "react-router-dom";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import TableTopPagination from "../../components/ui/application-manager/TableTopPagination";

const ViewStudentPageTableDetails = ({
  studentList,
  hideStudentList,
  totalStudentList,
  selectedStudent,
  setSelectedEmail,
  setSelectedMobileNumbers,
  setSelectedStudent,
  allIds,
  handleCheckBoxOnChange,
  removeAction,
  showSearchResult,
  interviewListId,
  rowsPerPage,
  setPageNumber,
  pageNumber,
}) => {
  const [checkAll, setCheckAll] = useState(false);
  const [checkIntermediate, setCheckIntermediate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedStudent.length === studentList.length && studentList.length) {
      setCheckAll(true);
      setCheckIntermediate(false);
    } else if (
      selectedStudent?.length &&
      selectedStudent.length !== studentList.length
    ) {
      setCheckAll(false);
      setCheckIntermediate(true);
    } else {
      setCheckAll(false);
      setCheckIntermediate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudent, selectedStudent]);

  return (
    <div>
      <Box className="common-table-heading-container" sx={{ my: 2 }}>
        <TableDataCount
          totalCount={showSearchResult ? studentList?.length : totalStudentList}
          currentPageShowingCount={studentList.length}
          pageNumber={pageNumber}
          rowsPerPage={rowsPerPage}
        />
        {!showSearchResult && (
          <TableTopPagination
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            totalCount={totalStudentList}
            rowsPerPage={rowsPerPage}
          />
        )}
      </Box>
      {studentList.length > 0 ? (
        <Box
          sx={{ display: hideStudentList ? "none" : "block" }}
          className="view-student-list-page-table-container"
        >
          <TableContainer className="custom-scrollbar">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    {!removeAction && (
                      <Checkbox
                        checked={checkAll}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudent(allIds.student);
                            setSelectedEmail(allIds.email);
                            setSelectedEmail(allIds.mobile);
                          } else {
                            setSelectedStudent([]);
                            setSelectedEmail([]);
                            setSelectedMobileNumbers([]);
                          }
                        }}
                        indeterminate={checkIntermediate}
                        color="info"
                      />
                    )}
                  </TableCell>

                  <TableCell>Registered Name</TableCell>
                  <TableCell>Application No</TableCell>
                  <TableCell>Contact Email</TableCell>
                  {studentList[0]?.hasOwnProperty("gd_status") && (
                    <TableCell>GD Status</TableCell>
                  )}
                  {studentList[0]?.hasOwnProperty("pi_status") && (
                    <TableCell>PI Status</TableCell>
                  )}

                  <TableCell>Interview Status</TableCell>
                  <TableCell>Selection Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentList.map((data) => (
                  <TableRow
                    className={
                      selectedStudent.includes(data.application_id)
                        ? "selected-student"
                        : ""
                    }
                    key={data._id}
                  >
                    <TableCell align="center">
                      {!removeAction && (
                        <IndividualCheckBox
                          handleOnChange={(checked) =>
                            handleCheckBoxOnChange(checked, data)
                          }
                          id={data.application_id}
                          selectedStudent={selectedStudent}
                        />
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        cursor: interviewListId ? "pointer" : "",
                        textDecoration: interviewListId ? "underline" : "none",
                        color: interviewListId && "#3498db",
                      }}
                      onClick={() => {
                        if (interviewListId) {
                          navigate("/student-profile", {
                            state: {
                              interviewListId: interviewListId,
                              application_id: data?.application_id,
                            },
                          });
                        }
                      }}
                    >
                      {data.student_name}
                    </TableCell>
                    <TableCell>
                      {data.custom_application_id || data?.application_number}
                    </TableCell>
                    <TableCell className="contact">
                      <StudentContact
                        dataRow={{
                          student_email_id:
                            data.email_id ||
                            data?.student_email_id ||
                            data?.email,
                          student_mobile_no:
                            data.mobile_number || data?.student_mobile_no,
                        }}
                      />
                    </TableCell>
                    {studentList[0]?.hasOwnProperty("gd_status") && (
                      <TableCell>
                        <Typography
                          className={`not-rejected ${data.gd_status?.toLowerCase()}`}
                        >
                          {data?.gd_status ? data?.gd_status : "NA"}
                        </Typography>
                      </TableCell>
                    )}

                    {studentList[0]?.hasOwnProperty("pi_status") && (
                      <TableCell>
                        <Typography
                          className={`not-rejected ${data.pi_status?.toLowerCase()}`}
                        >
                          {data?.pi_status ? data?.pi_status : "NA"}
                        </Typography>
                      </TableCell>
                    )}

                    <TableCell>
                      <Typography
                        className={`not-rejected ${data.interview_status?.toLowerCase()}`}
                      >
                        {data?.interview_status ? data?.interview_status : "NA"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        className={`not-rejected ${data.selection_status?.toLowerCase()}`}
                      >
                        {data.selection_status}{" "}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box className="loading-animation-for-notification">
          <BaseNotFoundLottieLoader
            height={200}
            width={180}
          ></BaseNotFoundLottieLoader>
        </Box>
      )}
    </div>
  );
};

export default ViewStudentPageTableDetails;
