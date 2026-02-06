import { Box } from "@mui/material";
import React from "react";
import "../../styles/selectedStudent.css";
import SelectedStudentHeader from "./SelectedStudentHeader";
import SelectedStudentTable from "./SelectedStudentTable";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import useToasterHook from "../../hooks/useToasterHook";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { useEffect } from "react";
import {
  useGetSelectedStudentApplicationsQuery,
  useHandleSendForApprovalMutation,
  usePrefetch,
} from "../../Redux/Slices/filterDataSlice";
import { useSelector } from "react-redux";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import '../../styles/sharedStyles.css'
const SelectedStudent = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state?.id) {
    navigate("/");
  }
  const [selectedStudentData, setSelectedStudentData] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  const [loadingSearchStudent, setLoadingSearchStudent] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [
    selectedStudentSomethingWentWrong,
    setSelectedStudentSomethingWentWrong,
  ] = useState(false);
  const [
    selectedStudentInternalServerError,
    setSelectedStudentInternalServerError,
  ] = useState(false);
  const [hideSelectedStudent, setHideSelectedStudent] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalStudent, setTotalStudent] = useState(0);
  const [selectedStudentPayload, setSelectedStudentPayload] = useState({
    interview_list_id: state?.id,
    twelve_marks: [],
    ug_marks: [],
    interview_marks: [],
    twelve_marks_sort: null,
    ug_marks_sort: null,
    interview_marks_sort: null,
  });
  const [loadingSendForApproval, setLoadingSendForApproval] = useState(false);

  // filter states
  const [selectedTwelveScore, setSelectedTwelveScore] = useState([]);
  const [selectedUgScore, setSelectedUgScore] = useState([]);
  const [selectedInterviewScore, setSelectedInterviewScore] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [clickedTextField, setClickedTextField] = useState(false);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  useEffect(() => {
    if (!searchText.length) {
      setShowSearchResult(false);
    }
  }, [searchText]);

  const { data, isError, error, isFetching, isSuccess } =
    useGetSelectedStudentApplicationsQuery({
      pageNumber,
      rowsPerPage,
      collegeId,
      payload: selectedStudentPayload,
    });

  const prefetchSelectedStudent = usePrefetch("getSelectedStudentApplications");
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchSelectedStudent,
      { payload: selectedStudentPayload }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, prefetchSelectedStudent, rowsPerPage]);

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setSelectedStudentData(data?.data);
          setTotalStudent(data?.total);
        } else {
          throw new Error("Selected student API response has been changed.");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data.detail) {
          pushNotification("error", error?.data.detail);
        }
        if (error?.status === "500") {
          handleInternalServerError(
            setSelectedStudentInternalServerError,
            setHideSelectedStudent,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSelectedStudentSomethingWentWrong,
        setHideSelectedStudent,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, isSuccess]);

  const filterOptions = [
    {
      value: selectedTwelveScore,
      setValue: setSelectedTwelveScore,
      placeholder: "12 Score",
    },
    {
      value: selectedUgScore,
      setValue: setSelectedUgScore,
      placeholder: "UG Score",
    },
    {
      value: selectedInterviewScore,
      setValue: setSelectedInterviewScore,
      placeholder: "Interview Score",
    },
  ];

  const handleApplyFilters = () => {
    setSelectedStudentPayload((prev) => ({
      ...prev,
      twelve_marks: selectedTwelveScore,
      ug_marks: selectedUgScore,
      interview_marks: selectedInterviewScore,
    }));
  };
  const [handleSendForApproval] = useHandleSendForApprovalMutation();
  const handleSendForApprovalApiCall = () => {
    setLoadingSendForApproval(true);
    handleSendForApproval({
      collegeId,
      payload: {
        payload: selectedStudentPayload,
      },
    })
      .unwrap()
      .then((result) => {
        if (result.message) {
          pushNotification("success", result.message);
        } else {
          throw new Error("Send for approval API response has been changed.");
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else {
          handleInternalServerError(
            selectedStudentInternalServerError,
            "",
            10000
          );
        }
      })
      .finally(() => setLoadingSendForApproval(false));
  };
  const { handleSearchStudentApiCall } = useCommonApiCalls();
  const handleSearchApiCall = () => {
    handleSearchStudentApiCall({
      setSearchedData,
      searchText,
      interviewStatus: "Selected",
      interviewListId: state?.id,
      setLoadingSearchStudent,
      setInternalServerError: setSelectedStudentInternalServerError,
      setSomethingWentWrong: setSelectedStudentSomethingWentWrong,
    });
    setShowSearchResult(true);
  };

  return (
    <Box>
      {selectedStudentInternalServerError ||
      selectedStudentSomethingWentWrong ? (
        <Box className=".loading-animation-for-notification">
          {selectedStudentInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {selectedStudentSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box className='custom-component-container-box' sx={{mx:3}}>
          <SelectedStudentHeader
            filterOptions={filterOptions}
            data={state}
            handleApplyFilters={handleApplyFilters}
            handleSendForApprovalApiCall={handleSendForApprovalApiCall}
            loadingSendForApproval={loadingSendForApproval}
            searchText={searchText}
            setSearchText={setSearchText}
            clickedTextField={clickedTextField}
            setClickedTextField={setClickedTextField}
            handleSearchApiCall={handleSearchApiCall}
          />
          {isFetching || loadingSearchStudent ? (
            <Box className="loading-animation-for-notification">
              <LeefLottieAnimationLoader width={150} height={150} />
            </Box>
          ) : (
            <Box sx={{ display: hideSelectedStudent ? "none" : "block" }}>
              <SelectedStudentTable
                showSearchResult={showSearchResult}
                interviewListId={state?.id}
                selectedStudentData={
                  showSearchResult ? searchedData : selectedStudentData
                }
                selectedStudent={selectedStudent}
                setSelectedStudent={setSelectedStudent}
                totalStudent={totalStudent}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                selectedStudentPayload={selectedStudentPayload}
                setSelectedStudentPayload={setSelectedStudentPayload}
                setSelectedStudentInternalServerError={
                  setSelectedStudentInternalServerError
                }
                setSelectedStudentSomethingWentWrong={
                  setSelectedStudentSomethingWentWrong
                }
                setApiResponseChangeMessage={setApiResponseChangeMessage}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SelectedStudent;
