import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import AscendingIcon from "../../../icons/sort-ascending.png";
import DescendingIcon from "../../../icons/sort-descending.png";
import AscendingDescendingImg from "../SelectedStudent/AsendingDesendingImg";
import Pagination from "../Pagination/Pagination";
import AutoCompletePagination from "../forms/AutoCompletePagination";
import { handleChangePage } from "../../../helperFunctions/pagination";
import BaseNotFoundLottieLoader from "../Loader/BaseNotFoundLottieLoader";
import IndividualCheckBox from "../SelectedStudent/IndividualCheckBox";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import CreateListAction from "./CreateListAction";
import { defaultRowsPerPageOptions } from "../../Calendar/utils";
const StudentTableOfCreatedList = ({
  applicationsListBasedOnProgram,
  totalApplications,
  pageNumber,
  setPageNumber,
  rowsPerPage,
  setRowsPerPage,
  sortingStates,
  setPayloadOfPrograms,
  pickTop,
  setSelectedStudent,
  selectedStudent,
  setOpenDeleteModal,
  setRemoveStudentIds,
  removeStudentIds,
  allStudentIds,
}) => {
  const count = Math.ceil(totalApplications / rowsPerPage);
  const countWhenPickTop = Math.ceil(pickTop / rowsPerPage);
  const [checkIntermediate, setCheckIntermediate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  useEffect(() => {
    if (
      selectedStudent.length === applicationsListBasedOnProgram.length &&
      applicationsListBasedOnProgram.length
    ) {
      setCheckAll(true);
      setCheckIntermediate(false);
    } else if (
      selectedStudent?.length &&
      selectedStudent.length !== applicationsListBasedOnProgram.length
    ) {
      setCheckAll(false);
      setCheckIntermediate(true);
    } else {
      setCheckAll(false);
      setCheckIntermediate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudent, selectedStudent]);

  const [paginationRef, { entry: paginationEntry }] = useIntersectionObserver();
  const isPaginationVisible =
    paginationEntry && paginationEntry?.isIntersecting;

  useEffect(() => {
    if (isPaginationVisible) {
      setIsScrolledToPagination(true);
    } else {
      setIsScrolledToPagination(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginationVisible]);

  const handleRemoveSelectedItems = (selectedData, deleteData, setData) => {
    const prevData = [...selectedData];
    prevData.splice(prevData.indexOf(deleteData), 1);
    setData(prevData);
  };

  const handleCheckBoxOnChange = (checked, data) => {
    if (checked) {
      setSelectedStudent((prev) => [...prev, data.application_id]);
      setRemoveStudentIds((prev) => [...prev, data.application_id]);
    } else {
      handleRemoveSelectedItems(
        selectedStudent,
        data.application_id,
        setSelectedStudent
      );
      handleRemoveSelectedItems(
        removeStudentIds,
        data.application_id,
        setRemoveStudentIds
      );
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      {applicationsListBasedOnProgram.length > 0 ? (
        <>
          <TableContainer component={Paper} className="custom-scrollbar">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      color="info"
                      checked={checkAll}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudent(allStudentIds);
                          setRemoveStudentIds((prev) => [
                            ...prev,
                            ...allStudentIds,
                          ]);
                        } else {
                          setSelectedStudent([]);

                          setRemoveStudentIds((prev) =>
                            prev.filter(
                              (student) =>
                                allStudentIds.includes(student) === false
                            )
                          );
                        }
                      }}
                      indeterminate={checkIntermediate}
                    ></Checkbox>
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Application No</TableCell>
                  <TableCell>
                    PG Marks
                    <AscendingDescendingImg
                      style={{
                        opacity: sortingStates.pgMarksSort === null ? 0.5 : 1,
                      }}
                      onClick={() => {
                        sortingStates.setPgMarksSort((prev) => !prev);
                        sortingStates.setUgMarksSort(null);
                        sortingStates.setExamScoreSort(null);
                        sortingStates.setExamNameSort(null);
                        setPayloadOfPrograms((prev) => ({
                          ...prev,
                          filters: {
                            ...prev.filters,
                            pg_marks_sort: sortingStates.pgMarksSort
                              ? false
                              : true,
                            ug_marks_sort: null,
                            exam_name_sort: null,
                            exam_score_sort: null,
                          },
                        }));
                      }}
                      icon={
                        sortingStates.pgMarksSort
                          ? AscendingIcon
                          : DescendingIcon
                      }
                    />
                  </TableCell>
                  <TableCell>
                    UG Marks
                    <AscendingDescendingImg
                      style={{
                        opacity: sortingStates.ugMarksSort === null ? 0.5 : 1,
                      }}
                      onClick={() => {
                        sortingStates.setUgMarksSort((prev) => !prev);
                        sortingStates.setPgMarksSort(null);
                        sortingStates.setExamScoreSort(null);
                        sortingStates.setExamNameSort(null);
                        setPayloadOfPrograms((prev) => ({
                          ...prev,
                          filters: {
                            ...prev.filters,
                            ug_marks_sort: sortingStates.ugMarksSort
                              ? false
                              : true,
                            pg_marks_sort: null,
                            exam_name_sort: null,
                            exam_score_sort: null,
                          },
                        }));
                      }}
                      icon={
                        sortingStates.ugMarksSort
                          ? AscendingIcon
                          : DescendingIcon
                      }
                    />
                  </TableCell>
                  <TableCell>
                    Entrance Exam
                    <AscendingDescendingImg
                      style={{
                        opacity: sortingStates.examNameSort === null ? 0.5 : 1,
                      }}
                      onClick={() => {
                        sortingStates.setExamNameSort((prev) => !prev);
                        sortingStates.setPgMarksSort(null);
                        sortingStates.setUgMarksSort(null);
                        sortingStates.setExamScoreSort(null);
                        setPayloadOfPrograms((prev) => ({
                          ...prev,
                          filters: {
                            ...prev.filters,
                            exam_name_sort: sortingStates.examNameSort
                              ? false
                              : true,
                            pg_marks_sort: null,
                            ug_marks_sort: null,
                            exam_score_sort: null,
                          },
                        }));
                      }}
                      icon={
                        sortingStates.examNameSort
                          ? AscendingIcon
                          : DescendingIcon
                      }
                    />
                  </TableCell>
                  <TableCell>
                    Entrance Exam Marks
                    <AscendingDescendingImg
                      style={{
                        opacity: sortingStates.examScoreSort === null ? 0.5 : 1,
                      }}
                      onClick={() => {
                        sortingStates.setExamScoreSort((prev) => !prev);
                        sortingStates.setPgMarksSort(null);
                        sortingStates.setUgMarksSort(null);
                        sortingStates.setExamNameSort(null);
                        setPayloadOfPrograms((prev) => ({
                          ...prev,
                          filters: {
                            ...prev.filters,
                            exam_score_sort: sortingStates.examScoreSort
                              ? false
                              : true,
                            pg_marks_sort: null,
                            ug_marks_sort: null,
                            exam_name_sort: null,
                          },
                        }));
                      }}
                      icon={
                        sortingStates.examScoreSort
                          ? AscendingIcon
                          : DescendingIcon
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applicationsListBasedOnProgram.map((data) => (
                  <TableRow key={data?.application_id}>
                    <TableCell>
                      <IndividualCheckBox
                        handleOnChange={(checked) =>
                          handleCheckBoxOnChange(checked, data)
                        }
                        id={data.application_id}
                        selectedStudent={selectedStudent}
                      />
                    </TableCell>
                    <TableCell>{data.student_name}</TableCell>
                    <TableCell>{data.custom_application_id}</TableCell>
                    <TableCell>
                      {data?.pg_marks ? data?.pg_marks : `– –`}
                    </TableCell>
                    <TableCell>
                      {data?.ug_marks ? data?.ug_marks : `– –`}
                    </TableCell>
                    <TableCell>
                      {data?.entrance_exam ? data?.entrance_exam : `– –`}
                    </TableCell>
                    <TableCell>
                      {data?.entrance_exam_marks
                        ? data?.entrance_exam_marks
                        : `– –`}
                    </TableCell>
                  </TableRow>
                ))}
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
              className="pagination-bar"
              currentPage={pageNumber}
              totalCount={pickTop ? pickTop : totalApplications}
              pageSize={rowsPerPage}
              onPageChange={(page) => {
                handleChangePage(page, ``, setPageNumber);
              }}
              count={pickTop ? countWhenPickTop : count}
            />
            <AutoCompletePagination
              rowsPerPage={rowsPerPage}
              rowPerPageOptions={rowPerPageOptions}
              setRowsPerPageOptions={setRowsPerPageOptions}
              rowCount={totalApplications}
              page={pageNumber}
              setPage={setPageNumber}
              setRowsPerPage={setRowsPerPage}
            ></AutoCompletePagination>
          </Box>
        </>
      ) : (
        <Box className="loading-animation-for-notification">
          <BaseNotFoundLottieLoader
            noContainer={true}
            width={200}
            height={150}
          />
        </Box>
      )}
      {selectedStudent?.length > 0 && (
        <CreateListAction
          selectedStudent={selectedStudent.length}
          isScrolledToPagination={isScrolledToPagination}
          setOpenDeleteModal={setOpenDeleteModal}
        />
      )}
    </Box>
  );
};

export default StudentTableOfCreatedList;
