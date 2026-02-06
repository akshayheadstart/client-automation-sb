import {
  Box,
  Card,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import sortAscendingIcon from "../../icons/sort-ascending.png";
import sortDescendingIcon from "../../icons/sort-descending.png";
import AscendingDescendingImg from "../../components/shared/SelectedStudent/AsendingDesendingImg";
import IndividualCheckBox from "../../components/shared/SelectedStudent/IndividualCheckBox";
import SelectedStudentTableBody from "../../components/shared/SelectedStudent/SelectedStudentTableBody";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import Pagination from "../../components/shared/Pagination/Pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import SelectedStudentAction from "../../components/shared/SelectedStudent/SelectedStudentAction";
import { handleChangePage } from "../../helperFunctions/pagination";
import { useSelector } from "react-redux";
import { useDeleteStudentFromListMutation } from "../../Redux/Slices/filterDataSlice";
import useToasterHook from "../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import DeleteDialogue from "../../components/shared/Dialogs/DeleteDialogue";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import TableTopPagination from "../../components/ui/application-manager/TableTopPagination";

const SelectedStudentTable = (props) => {
  const {
    selectedStudentData,
    selectedStudent,
    setSelectedStudent,
    pageNumber,
    setPageNumber,
    rowsPerPage,
    setRowsPerPage,
    totalStudent,
    selectedStudentPayload,
    setSelectedStudentPayload,
    setSelectedStudentSomethingWentWrong,
    setSelectedStudentInternalServerError,
    setApiResponseChangeMessage,
    interviewListId,
    showSearchResult,
  } = props || {};

  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const [checkAll, setCheckAll] = useState(false);
  const [checkIntermediate, setCheckIntermediate] = useState(false);
  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);

  //delete student
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const allStudentIds = useMemo(() => {
    return selectedStudentData.map((data) => data?.application_id);
  }, [selectedStudentData]);
  const [paginationRef, { entry: paginationEntry }] = useIntersectionObserver();
  const isPaginationVisible =
    paginationEntry && paginationEntry?.isIntersecting;

  const pushNotification = useToasterHook();

  useEffect(() => {
    if (isPaginationVisible) {
      setIsScrolledToPagination(true);
    } else {
      setIsScrolledToPagination(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginationVisible]);

  useEffect(() => {
    if (
      selectedStudent.length === selectedStudentData.length &&
      selectedStudentData.length
    ) {
      setCheckAll(true);
      setCheckIntermediate(false);
    } else if (
      selectedStudent?.length &&
      selectedStudent.length !== selectedStudentData.length
    ) {
      setCheckAll(false);
      setCheckIntermediate(true);
    } else {
      setCheckAll(false);
      setCheckIntermediate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudent, selectedStudent]);

  const handleRemoveSelectedItems = (selectedData, deleteData, setData) => {
    const prevData = [...selectedData];
    prevData.splice(prevData.indexOf(deleteData), 1);
    setData(prevData);
  };
  const handleCheckBoxOnChange = (checked, data) => {
    if (checked) {
      setSelectedStudent((prev) => [...prev, data.application_id]);
    } else {
      handleRemoveSelectedItems(
        selectedStudent,
        data.application_id,
        setSelectedStudent
      );
    }
  };
  const count = Math.ceil(totalStudent / rowsPerPage);

  const [deleteStudentFromList] = useDeleteStudentFromListMutation();
  const handleDeleteStudentFromList = () => {
    setDeleteLoading(true);
    deleteStudentFromList({ interviewListId, collegeId, selectedStudent })
      .unwrap()
      .then((data) => {
        try {
          if (data.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data.message) {
            pushNotification("success", data.message);
          } else if (data.detail) {
            pushNotification("error", data.detail);
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSelectedStudentSomethingWentWrong,
            "",
            10000
          );
        }
      })
      .catch(() => {
        handleInternalServerError(
          setSelectedStudentInternalServerError,
          "",
          10000
        );
      })
      .finally(() => {
        setDeleteLoading(false);
        setSelectedStudent([]);
        setOpenDeleteModal(false);
      });
  };
  return (
    <Card sx={{ mt: 3 }}>
      <Box sx={{ p: 2 }} className="common-table-heading-container">
        <TableDataCount
          totalCount={
            showSearchResult ? selectedStudentData?.length : totalStudent
          }
          currentPageShowingCount={selectedStudentData?.length}
          pageNumber={pageNumber}
          rowsPerPage={rowsPerPage}
        />

        {showSearchResult || (
          <TableTopPagination
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            totalCount={
              showSearchResult ? selectedStudentData?.length : totalStudent
            }
            rowsPerPage={rowsPerPage}
          />
        )}
      </Box>
      {selectedStudentData?.length > 0 ? (
        <Box className="selection-student-list-container">
          <>
            <TableContainer component={Paper} className="custom-scrollbar">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Checkbox
                        checked={checkAll}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudent(allStudentIds);
                          } else {
                            setSelectedStudent([]);
                          }
                        }}
                        indeterminate={checkIntermediate}
                        color="info"
                      />
                    </TableCell>
                    <TableCell align="center">Applicant Name</TableCell>
                    <TableCell align="center">Application No</TableCell>
                    <TableCell align="center" className="">
                      12th Score
                      {!showSearchResult && (
                        <AscendingDescendingImg
                          style={{
                            opacity:
                              selectedStudentPayload?.twelve_marks_sort === null
                                ? 0.5
                                : 1,
                          }}
                          onClick={() =>
                            setSelectedStudentPayload((prev) => ({
                              ...prev,
                              twelve_marks_sort: !prev.twelve_marks_sort,
                              ug_marks_sort: null,
                              interview_marks_sort: null,
                            }))
                          }
                          icon={
                            selectedStudentPayload?.twelve_marks_sort
                              ? sortAscendingIcon
                              : sortDescendingIcon
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      UG Score
                      {!showSearchResult && (
                        <AscendingDescendingImg
                          style={{
                            opacity:
                              selectedStudentPayload?.ug_marks_sort === null
                                ? 0.5
                                : 1,
                          }}
                          onClick={() =>
                            setSelectedStudentPayload((prev) => ({
                              ...prev,
                              ug_marks_sort: !prev.ug_marks_sort,
                              twelve_marks_sort: null,
                              interview_marks_sort: null,
                            }))
                          }
                          icon={
                            selectedStudentPayload?.ug_marks_sort
                              ? sortAscendingIcon
                              : sortDescendingIcon
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      Interview Score
                      {!showSearchResult && (
                        <AscendingDescendingImg
                          style={{
                            opacity:
                              selectedStudentPayload?.interview_marks_sort ===
                              null
                                ? 0.5
                                : 1,
                          }}
                          onClick={() =>
                            setSelectedStudentPayload((prev) => ({
                              ...prev,
                              interview_marks_sort: !prev.interview_marks_sort,
                              twelve_marks_sort: null,
                              ug_marks_sort: null,
                            }))
                          }
                          icon={
                            selectedStudentPayload?.interview_marks_sort
                              ? sortAscendingIcon
                              : sortDescendingIcon
                          }
                        />
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedStudentData.map((data) => (
                    <TableRow
                      className={
                        selectedStudent.includes(data.application_id)
                          ? "selected-student"
                          : ""
                      }
                    >
                      <TableCell align="center">
                        <IndividualCheckBox
                          handleOnChange={(checked) =>
                            handleCheckBoxOnChange(checked, data)
                          }
                          id={data.application_id}
                          selectedStudent={selectedStudent}
                        />
                      </TableCell>
                      <SelectedStudentTableBody
                        data={data}
                        interviewListId={interviewListId}
                      />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {!showSearchResult && (
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
                  totalCount={totalStudent}
                  pageSize={rowsPerPage}
                  onPageChange={(page) => {
                    handleChangePage(page, "", setPageNumber);
                  }}
                  count={count}
                />
                <AutoCompletePagination
                  rowsPerPage={rowsPerPage}
                  rowPerPageOptions={rowPerPageOptions}
                  setRowsPerPageOptions={setRowsPerPageOptions}
                  rowCount={totalStudent}
                  page={pageNumber}
                  setPage={setPageNumber}
                  setRowsPerPage={setRowsPerPage}
                ></AutoCompletePagination>
              </Box>
            )}
            {selectedStudent?.length > 0 && (
              <SelectedStudentAction
                selectedStudent={selectedStudent.length}
                isScrolledToPagination={isScrolledToPagination}
                setOpenDeleteModal={setOpenDeleteModal}
              />
            )}
          </>
          <DeleteDialogue
            openDeleteModal={openDeleteModal}
            handleDeleteSingleTemplate={handleDeleteStudentFromList}
            loading={deleteLoading}
            handleCloseDeleteModal={() => setOpenDeleteModal(false)}
            title="Are you sure, you want to archive?"
          />
        </Box>
      ) : (
        <Card className="loading-animation-for-notification">
          {" "}
          <BaseNotFoundLottieLoader width={150} height={150} />{" "}
        </Card>
      )}
    </Card>
  );
};

export default React.memo(SelectedStudentTable);
