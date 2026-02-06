import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import ListNameAndDate from "../../components/shared/ViewStudentList/ListNameAndDate";
import ListHeaderActions from "../../components/shared/ViewStudentList/ListHeaderActions";
import { Typography } from "@mui/material";
import { useGetViewStudentDetailsHeaderDetailsQuery } from "../../Redux/Slices/filterDataSlice";
import { useSelector } from "react-redux";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";

const ViewStudentListHeader = ({
  setShowFilter,
  showFilter,
  setClickedAddStudentButton,
  interviewListId,
  searchText,
  handleSearchApiCall,
  setSearchText,
  headerData,
  setHeaderData,
}) => {
  const [hideStudentList, setHideStudentList] = useState(false);
  const [studentListInternalServerError, setStudentListInternalServerError] =
    useState(false);
  const [studentListSomethingWentWrong, setStudentListSomethingWentWrong] =
    useState(false);

  const pushNotification = useToasterHook();

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  // calling the particular student list header api
  const {
    data: studentListHeaderData,
    isSuccess,
    isFetching,
    error: studentListHeaderError,
    isError,
  } = useGetViewStudentDetailsHeaderDetailsQuery({
    collegeId,
    interviewListId,
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(studentListHeaderData)) {
          setHeaderData(studentListHeaderData[0]);
        } else {
          throw new Error(
            "Particular Interview's student list header API response has changed"
          );
        }
      } else if (isError) {
        if (
          studentListHeaderError?.data?.detail ===
          "Could not validate credentials"
        ) {
          window.location.reload();
        } else if (studentListHeaderError?.data?.detail) {
          pushNotification("error", studentListHeaderError?.data?.detail);
        }
        if (studentListHeaderError?.status === 500) {
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
  }, [studentListHeaderData, studentListHeaderError, isError, isSuccess]);

  return (
    <>
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
          {isFetching ? (
            <>
              <Box className="loading-animation-for-notification">
                <LeefLottieAnimationLoader
                  height={180}
                  width={150}
                ></LeefLottieAnimationLoader>
              </Box>
            </>
          ) : (
            <Box
              sx={{ display: hideStudentList ? "none" : "block" }}
              className="view-student-list-header-container"
            >
              <Box className="view-student-list-wrapper">
                <ListNameAndDate data={headerData} />
                <Box className="view-student-list-header-vertical-line"></Box>
                <Box>
                  <Typography variant="h6">Program Name</Typography>
                  <Typography variant="h4">
                    {headerData?.course_name}
                  </Typography>
                  <Typography
                    sx={{ textWrap: "wrap", fontWeight: "400" }}
                    variant="h6"
                  >
                    {headerData?.specialization_name}
                  </Typography>
                </Box>
                <Box className="view-student-list-header-vertical-line"></Box>
                <Box className="view-list-header-container">
                  <Typography variant="h6">Eligibility</Typography>
                  <Typography variant="h6">Criteria</Typography>
                  <Typography variant="h4">
                    {headerData?.total_eligible_ids}/
                    <span style={{ color: "#00465f" }}>
                      {headerData?.total_application_ids}
                    </span>
                  </Typography>
                </Box>
                <Box className="view-student-list-header-vertical-line"></Box>
                {(headerData?.is_gd_eligible ||
                  (!headerData?.is_pi_eligible &&
                    !headerData?.is_gd_eligible)) && (
                  <>
                    <Box className="view-list-header-container">
                      <Typography variant="h6">Group</Typography>
                      <Typography variant="h6">Discussion</Typography>
                      <Typography variant="h4">
                        {headerData?.completed_gd}/
                        <span style={{ color: "#00465f" }}>
                          {headerData?.total_gd_count}
                        </span>
                      </Typography>
                    </Box>
                    <Box className="view-student-list-header-vertical-line"></Box>
                  </>
                )}
                {(headerData?.is_pi_eligible ||
                  (!headerData?.is_pi_eligible &&
                    !headerData?.is_gd_eligible)) && (
                  <Box className="view-list-header-container">
                    <Typography variant="h6">Personal</Typography>
                    <Typography variant="h6">Interview</Typography>
                    <Typography variant="h4">
                      {headerData?.completed_pi}/
                      <span style={{ color: "#00465f" }}>
                        {headerData?.total_pi_count}
                      </span>
                    </Typography>
                  </Box>
                )}

                <ListHeaderActions
                  searchText={searchText}
                  handleSearchApiCall={handleSearchApiCall}
                  setSearchText={setSearchText}
                  showFilter={showFilter}
                  setShowFilter={setShowFilter}
                  setClickedAddStudentButton={setClickedAddStudentButton}
                />
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default ViewStudentListHeader;
