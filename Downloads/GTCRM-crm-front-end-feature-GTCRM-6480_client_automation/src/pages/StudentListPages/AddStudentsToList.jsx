import { Box } from "@mui/system";
import React, { useContext, useEffect } from "react";
import AddStudentToListHeader from "./AddStudentToListHeader";
import { useState } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { useSelector } from "react-redux";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import {
  useGetAllApplicantsWhoAreNotInListQuery,
  useHandleAddStudentToListMutation,
  usePrefetch,
} from "../../Redux/Slices/filterDataSlice";
import Pagination from "../../components/shared/Pagination/Pagination";
import { handleChangePage } from "../../helperFunctions/pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import ViewStudentPageTableDetails from "./ViewStudentPageTableDetails";
import { useMemo } from "react";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";

const AddStudentsToList = ({
  setClickedAddStudentButton,
  interviewListId,
  course,
  specialization,
}) => {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedText, setSearchedText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalApplicantsCount, setTotalApplicantsCount] = useState(0);
  const [allTheApplicants, setAllTheApplicants] = useState([]);
  const [hideApplicants, setHideApplicants] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [loadingAddStudent, setLoadingAddStudent] = useState(false);
  const [studentListInternalServerError, setStudentListInternalServerError] =
    useState(false);
  const [studentListSomethingWentWrong, setStudentListSomethingWentWrong] =
    useState(false);

  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const { data, isError, error, isFetching, isSuccess } =
    useGetAllApplicantsWhoAreNotInListQuery({
      collegeId,
      pageNumber,
      rowsPerPage,
      searchedText,
      course,
      specialization,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setTotalApplicantsCount(data?.count);
          setAllTheApplicants(data?.data);
        } else {
          throw new Error(
            "All applicants who are not in the list API response has been changed."
          );
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          if (error?.status === 500) {
            handleInternalServerError(
              setStudentListInternalServerError,
              setHideApplicants,
              10000
            );
          }
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setStudentListSomethingWentWrong,
        hideApplicants,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error, data]);

  // use react hook for prefetch data
  const prefetchApplicantData = usePrefetch("getAllApplicantsWhoAreNotInList");
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchApplicantData,
      {
        searchedText,
        course: course,
        specialization: specialization,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, prefetchApplicantData, rowsPerPage, collegeId]);

  const handleSearchApiCall = () => {
    setPageNumber(1);
    setSearchedText(searchText);
    setSelectedStudent([]);
    setShowSearchResult(true);
  };

  useEffect(() => {
    if (!searchText?.length) {
      setSearchedText("");
      setShowSearchResult(false);
    }
  }, [searchText]);
  const [handleAddStudentToList] = useHandleAddStudentToListMutation();
  const handleAddStudentToListApiCall = () => {
    setLoadingAddStudent(true);
    handleAddStudentToList({ collegeId, interviewListId, selectedStudent })
      .unwrap()
      .then((result) => {
        try {
          if (result?.message) {
            if (typeof result?.message === "string") {
              pushNotification("success", result?.message);
              setClickedAddStudentButton(false);
            } else {
              throw new Error(
                "Add student to list API response has been changed."
              );
            }
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setStudentListSomethingWentWrong, "", 10000);
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data.detail) {
          pushNotification("error", error?.data.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setStudentListInternalServerError,
            "",
            10000
          );
        }
      })
      .finally(() => {
        setLoadingAddStudent(false);
      });
  };
  const count = Math.ceil(totalApplicantsCount / rowsPerPage);

  const allIds = useMemo(() => {
    const student = [];
    allTheApplicants.forEach((data) => {
      student.push(data?.application_id);
    });
    return { student };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTheApplicants]);

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

  return (
    <Box>
      {studentListInternalServerError || studentListSomethingWentWrong ? (
        <Box className=".loading-animation-for-notification">
          {studentListInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {studentListSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          <AddStudentToListHeader
            searchText={searchText}
            setSearchText={setSearchText}
            handleSearchApiCall={handleSearchApiCall}
            handleAddStudentToList={handleAddStudentToListApiCall}
            loadingAddStudent={loadingAddStudent}
            hasSelectedStudent={selectedStudent.length}
            setClickedAddStudentButton={setClickedAddStudentButton}
          />

          {isFetching ? (
            <Box className="loading-animation-for-notification">
              <LeefLottieAnimationLoader width={150} height={150} />
            </Box>
          ) : (
            <Box>
              <Box>
                <ViewStudentPageTableDetails
                  studentList={allTheApplicants}
                  hideStudentList={hideApplicants}
                  totalStudentList={totalApplicantsCount}
                  selectedStudent={selectedStudent}
                  setSelectedEmail={() => {}}
                  setSelectedMobileNumbers={() => {}}
                  setSelectedStudent={setSelectedStudent}
                  handleCheckBoxOnChange={handleCheckBoxOnChange}
                  allIds={allIds}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  rowsPerPage={rowsPerPage}
                  showSearchResult={showSearchResult}
                />
              </Box>
              <Box></Box>
              {!showSearchResult && allTheApplicants.length > 0 && (
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
                    totalCount={totalApplicantsCount}
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
                    rowCount={totalApplicantsCount}
                    page={pageNumber}
                    setPage={setPageNumber}
                    setRowsPerPage={setRowsPerPage}
                  ></AutoCompletePagination>
                </Box>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default AddStudentsToList;
