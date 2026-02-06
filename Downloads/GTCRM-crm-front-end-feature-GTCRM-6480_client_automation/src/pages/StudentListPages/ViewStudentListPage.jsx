/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/system";
import React, { useContext, useEffect } from "react";
import ViewStudentListHeader from "./ViewStudentListHeader";
import ViewStudentListPageFilter from "./ViewStudentListPageFilter";
import "../../styles/ViewStudentListPage.css";
import "../../styles/inteviewList.css";
import "../../styles/createInterviewRoomList.css";
import { Card } from "@mui/material";
import { useState } from "react";
import AddStudentsToList from "./AddStudentsToList";
import ViewStudentListPageTable from "./ViewStudentPageTable";
import { useLocation } from "react-router";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";

const ViewStudentListPage = () => {
  const { state } = useLocation();
  const [pageNumber, setPageNumber] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [clickedAddStudentButton, setClickedAddStudentButton] = useState(false);
  const [filterOfApiPayload, setFilterOfApiPayload] = useState({});
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    gd_status: null,
    interview_status: null,
    selection_status: null,
  });

  const [searchText, setSearchText] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [loadingSearchStudent, setLoadingSearchStudent] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [studentListInternalServerError, setStudentListInternalServerError] =
    useState(false);
  const [studentListSomethingWentWrong, setStudentListSomethingWentWrong] =
    useState(false);
  const [headerData, setHeaderData] = useState({});
  const { apiResponseChangeMessage } = useContext(DashboradDataContext);

  const { handleSearchStudentApiCall } = useCommonApiCalls();
  const handleSearchApiCall = () => {
    handleSearchStudentApiCall({
      setSearchedData,
      searchText,
      interviewStatus: "",
      interviewListId: state?.id,
      setLoadingSearchStudent,
      setInternalServerError: setStudentListInternalServerError,
      setSomethingWentWrong: setStudentListSomethingWentWrong,
    });
    setShowSearchResult(true);
    setSelectedStudent([]);
    setPageNumber(1);
  };

  useEffect(() => {
    if (searchText?.length) {
      setShowFilter(false);
      setFilterOptions({
        gd_status: null,
        interview_status: null,
        selection_status: null,
      });
      setFilterOfApiPayload({
        gd_status: null,
        interview_status: null,
        selection_status: null,
      });
    } else {
      setShowSearchResult(false);
    }
  }, [searchText]);
  const {
    setHeadTitle,
    headTitle
  } = useContext(LayoutSettingContext);
  //InterView list Head Title add
  useEffect(()=>{
    setHeadTitle('GD/PI list')
    document.title='GD/PI list';
  },[headTitle])
  return (
    <Card className='interview-List-box-container' sx={{mx:3,mb:3}}>
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
        <Box sx={{ m: { md: 4, xs: 3 } }} >
          {clickedAddStudentButton ? (
            <AddStudentsToList
              setClickedAddStudentButton={setClickedAddStudentButton}
              interviewListId={state?.id}
              course={headerData?.course_name}
              specialization={headerData?.specialization_name}
            />
          ) : (
            <>
              <ViewStudentListHeader
                setShowFilter={setShowFilter}
                showFilter={showFilter}
                setClickedAddStudentButton={setClickedAddStudentButton}
                interviewListId={state?.id}
                handleSearchApiCall={handleSearchApiCall}
                searchText={searchText}
                setSearchText={setSearchText}
                setHeaderData={setHeaderData}
                headerData={headerData}
              />
              {showFilter && (
                <ViewStudentListPageFilter
                  setFilterOptions={setFilterOptions}
                  filterOptions={filterOptions}
                  setFilterOfApiPayload={setFilterOfApiPayload}
                  setShowSearchResult={setShowSearchResult}
                />
              )}
              <ViewStudentListPageTable
                filterOfApiPayload={filterOfApiPayload}
                interviewListId={state?.id}
                selectedStudent={selectedStudent}
                setSelectedStudent={setSelectedStudent}
                loadingSearchStudent={loadingSearchStudent}
                searchedData={searchedData}
                showSearchResult={showSearchResult}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
              />
            </>
          )}
        </Box>
      )}
    </Card>
  );
};

export default ViewStudentListPage;
