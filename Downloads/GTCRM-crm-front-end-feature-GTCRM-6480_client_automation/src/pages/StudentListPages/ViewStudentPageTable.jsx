import { Box } from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Pagination from "../../components/shared/Pagination/Pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import ViewStudentListActions from "../../components/shared/ViewStudentList/ViewStudentListActions";
import {
  useDeleteStudentFromListMutation,
  useGetParticularStudentListQuery,
  usePrefetch,
} from "../../Redux/Slices/filterDataSlice";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import Cookies from "js-cookie";
import DeleteDialogue from "../../components/shared/Dialogs/DeleteDialogue";
import { handleChangePage } from "../../helperFunctions/pagination";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import ViewStudentPageTableDetails from "./ViewStudentPageTableDetails";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import { customFetch } from "../StudentTotalQueries/helperFunction";

const ViewStudentListPageTable = ({
  removeAction,
  interviewListId,
  filterOfApiPayload,
  loadingSearchStudent,
  showSearchResult,
  searchedData,
  hideAction,
  setSelectedStudent,
  selectedStudent,
  setPageNumber,
  pageNumber,
}) => {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const [selectedMobileNumbers, setSelectedMobileNumbers] = useState([]);

  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);

  const [studentList, setStudentList] = useState([]);
  const [studentListInternalServerError, setStudentListInternalServerError] =
    useState(false);
  const [studentListSomethingWentWrong, setStudentListSomethingWentWrong] =
    useState(false);
  const [totalStudentList, setTotalStudentList] = useState(0);
  const [hideStudentList, setHideStudentList] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  //delete student
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [selectedEmail, setSelectedEmail] = useState([]);

  const pushNotification = useToasterHook();

  const [paginationRef, { entry: paginationEntry }] = useIntersectionObserver();
  const isPaginationVisible =
    paginationEntry && paginationEntry?.isIntersecting;

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const navigate = useNavigate();

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  // calling the particular student list api
  const {
    data: studentListData,
    isSuccess,
    isFetching,
    error: studentListError,
    isError,
  } = useGetParticularStudentListQuery({
    collegeId,
    interviewListId,
    pageNumber,
    rowsPerPage,
    filterOfApiPayload,
  });

  const prefetchParticularStudentList = usePrefetch("getParticularStudentList");
  useEffect(() => {
    apiCallFrontAndBackPage(
      studentListData,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchParticularStudentList,
      { interviewListId, filterOfApiPayload }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentListData, pageNumber, prefetchParticularStudentList, rowsPerPage]);

  useEffect(() => {
    if (!interviewListId) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewListId]);

  const allIds = useMemo(() => {
    const student = [];
    const email = [];
    const mobile = [];
    const dataList = showSearchResult ? searchedData : studentList;
    dataList.forEach((data) => {
      student.push(data?.application_id);
      email.push(data.email_id);
      mobile.push(data.mobile_number);
    });
    return { student, email, mobile };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentList, searchedData]);

  useEffect(() => {
    if (isPaginationVisible) {
      setIsScrolledToPagination(true);
    } else {
      setIsScrolledToPagination(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginationVisible]);

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(studentListData?.data)) {
          setStudentList(studentListData?.data);
          setTotalStudentList(studentListData?.total);
        } else {
          throw new Error(
            "Particular Interview's student list API response has changed"
          );
        }
      } else if (isError) {
        setStudentList([]);
        setTotalStudentList(0);
        if (
          studentListError?.data?.detail === "Could not validate credentials"
        ) {
          window.location.reload();
        } else if (studentListError?.data?.detail) {
          pushNotification("error", studentListError?.data?.detail);
        }
        if (studentListError?.status === 500) {
          handleInternalServerError(
            setStudentListInternalServerError,
            setHideStudentList,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setStudentListSomethingWentWrong,
        setHideStudentList,
        10000
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentListData, studentListError, isError, isSuccess]);

  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const handleDownloadStudentDetails = () => {
    setDownloadLoading(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/interview/download_view_interview_detail/?college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "POST", JSON.stringify(selectedStudent))
    )
      .then((res) => res.json())
      .then((data) => {
        try {
          if (data.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data.file_url) {
            window.open(data?.file_url);
          } else if (data.detail) {
            pushNotification("error", data.detail);
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setStudentListSomethingWentWrong, "", 10000);
        }
      })
      .catch(() => {
        handleInternalServerError(setStudentListInternalServerError, "", 10000);
      })
      .finally(() => {
        setDownloadLoading(false);
      });
  };
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
          handleSomethingWentWrong(setStudentListSomethingWentWrong, "", 10000);
        }
      })
      .catch(() => {
        handleInternalServerError(setStudentListInternalServerError, "", 10000);
      })
      .finally(() => {
        setDeleteLoading(false);
        setSelectedStudent([]);
        setOpenDeleteModal(false);
      });
  };

  const count = Math.ceil(totalStudentList / rowsPerPage);
  const handleRemoveSelectedItems = (selectedData, deleteData, setData) => {
    const prevData = [...selectedData];
    prevData.splice(prevData.indexOf(deleteData), 1);
    setData(prevData);
  };

  const handleCheckBoxOnChange = (checked, data) => {
    if (checked) {
      setSelectedStudent((prev) => [...prev, data.application_id]);
      setSelectedEmail((prev) => [...prev, data?.email_id]);
      setSelectedMobileNumbers((prev) => [...prev, data.mobile_number]);
    } else {
      handleRemoveSelectedItems(
        selectedStudent,
        data.application_id,
        setSelectedStudent
      );
      handleRemoveSelectedItems(selectedEmail, data.email_id, setSelectedEmail);
      handleRemoveSelectedItems(
        selectedMobileNumbers,
        data.mobile_number,
        setSelectedMobileNumbers
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
          {isFetching || loadingSearchStudent ? (
            <>
              <Box className="loading-animation-for-notification">
                <LeefLottieAnimationLoader
                  height={180}
                  width={150}
                ></LeefLottieAnimationLoader>
              </Box>
            </>
          ) : (
            <>
              <ViewStudentPageTableDetails
                removeAction={removeAction}
                showSearchResult={showSearchResult}
                studentList={showSearchResult ? searchedData : studentList}
                hideStudentList={hideStudentList}
                totalStudentList={totalStudentList}
                selectedStudent={selectedStudent}
                setSelectedEmail={setSelectedEmail}
                setSelectedMobileNumbers={setSelectedMobileNumbers}
                setSelectedStudent={setSelectedStudent}
                handleCheckBoxOnChange={handleCheckBoxOnChange}
                allIds={allIds}
                interviewListId={interviewListId}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                rowsPerPage={rowsPerPage}
              />
              {!showSearchResult &&
                (studentList?.length > 0 || searchedData?.length > 0) && (
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
                      totalCount={totalStudentList}
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
                      rowCount={totalStudentList}
                      page={pageNumber}
                      setPage={setPageNumber}
                      setRowsPerPage={setRowsPerPage}
                    ></AutoCompletePagination>
                  </Box>
                )}
              {selectedStudent.length > 0 && !hideAction && (
                <ViewStudentListActions
                  downloadLoading={downloadLoading}
                  isScrolledToPagination={isScrolledToPagination}
                  selectedStudent={selectedStudent.length}
                  handleDownloadStudentDetails={handleDownloadStudentDetails}
                  setOpenDeleteModal={setOpenDeleteModal}
                  selectedEmail={selectedEmail}
                  setSelectedEmail={setSelectedEmail}
                  selectedMobileNumbers={selectedMobileNumbers}
                />
              )}
            </>
          )}
        </>
      )}
      <DeleteDialogue
        openDeleteModal={openDeleteModal}
        handleDeleteSingleTemplate={handleDeleteStudentFromList}
        loading={deleteLoading}
        handleCloseDeleteModal={() => setOpenDeleteModal(false)}
        title="Are you sure, you want to delist?"
      />
    </Box>
  );
};

export default ViewStudentListPageTable;
