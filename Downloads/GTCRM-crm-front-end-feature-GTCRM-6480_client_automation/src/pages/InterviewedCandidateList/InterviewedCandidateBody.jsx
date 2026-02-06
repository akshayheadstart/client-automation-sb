import { Box, Grid, Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import BodyDetails from "../../components/shared/InterviewedCandidate/BodyDetails";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import {
  useGetPendingApprovalApplicantsQuery,
  usePrefetch,
} from "../../Redux/Slices/filterDataSlice";
import useToasterHook from "../../hooks/useToasterHook";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleChangePage } from "../../helperFunctions/pagination";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import StudentProfileDialog from "../../components/StudentProfileDialog/StudentProfileDialog";
import "../../styles/StudentProfilePageDesign.css";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import TableTopPagination from "../../components/ui/application-manager/TableTopPagination";

function InterviewedCandidateBody() {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [pendingApplicantsDetails, setPendingApplicantsDetails] = useState([]);
  const [totalPendingApplicants, setTotalPendingApplicants] = useState(0);
  const [hidePendingApplicants, setHidePendingApplicants] = useState(false);
  const [
    pendingApplicantsSomethingWentWrong,
    setPendingApplicantsSomethingWentWrong,
  ] = useState(false);
  const [
    pendingApplicantsInternalServerError,
    setPendingApplicantsInternalServerError,
  ] = useState(false);

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [loadingChangeStatus, setLoadingChangeStatus] = useState(false);

  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const { data, isFetching, error, isError, isSuccess } =
    useGetPendingApprovalApplicantsQuery({
      collegeId,
      pageNumber,
      rowsPerPage,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setPendingApplicantsDetails(data?.data);
          setTotalPendingApplicants(data?.total);
        } else {
          throw new Error("Pending applicants API response has been changed.");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setPendingApplicantsInternalServerError,
            setHidePendingApplicants,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setPendingApplicantsSomethingWentWrong,
        setHidePendingApplicants,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess, isError, error]);

  const prefetchApplicants = usePrefetch("getPendingApprovalApplicants");

  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchApplicants
    );
  }, [collegeId, data, pageNumber, prefetchApplicants, rowsPerPage]);

  const count = Math.ceil(totalPendingApplicants / rowsPerPage);
  const { handleChangeStatusApiCall } = useCommonApiCalls();
  const handleChangeStatus = (status) => {
    const params = {
      approvalStatus: true,
      payload: {
        interview_list_id: selectedStudent?.interview_list_id,
        application_ids: [selectedStudent?.application_id],
        status: status,
      },
      collegeId,
      setLoadingChangeStatus,
      setApplicantSomethingWentWrong: setPendingApplicantsSomethingWentWrong,
      setStudentListInternalServerError:
        setPendingApplicantsInternalServerError,
      setOpenConfirmationDialog,
    };
    handleChangeStatusApiCall(params);
  };

  return (
    <Box>
      {pendingApplicantsInternalServerError ||
      pendingApplicantsSomethingWentWrong ? (
        <Box className="loading-animation-for-notification">
          {pendingApplicantsInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {pendingApplicantsSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          {isFetching ? (
            <Box className="loading-animation-for-notification">
              <LeefLottieAnimationLoader height={150} width={150} />
            </Box>
          ) : (
            <Box sx={{ display: hidePendingApplicants ? "none" : "block" }}>
              <Box className="common-table-heading-container">
                <TableDataCount
                  totalCount={totalPendingApplicants}
                  currentPageShowingCount={pendingApplicantsDetails?.length}
                  pageNumber={pageNumber}
                  rowsPerPage={rowsPerPage}
                />

                <TableTopPagination
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  totalCount={totalPendingApplicants}
                  rowsPerPage={rowsPerPage}
                />
              </Box>
              {pendingApplicantsDetails?.length > 0 ? (
                <>
                  <Grid container spacing={3}>
                    {pendingApplicantsDetails.map((student) => (
                      <Grid
                        key={student?.application_id}
                        item
                        md={3}
                        sm={6}
                        xs={12}
                      >
                        <BodyDetails
                          setOpenConfirmationDialog={setOpenConfirmationDialog}
                          setSelectedStudent={setSelectedStudent}
                          data={student}
                        />
                      </Grid>
                    ))}
                  </Grid>
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
                      totalCount={totalPendingApplicants}
                      pageSize={rowsPerPage}
                      onPageChange={(page) =>
                        handleChangePage(page, "", setPageNumber)
                      }
                      count={count}
                    />
                    <AutoCompletePagination
                      rowsPerPage={rowsPerPage}
                      rowPerPageOptions={rowPerPageOptions}
                      setRowsPerPageOptions={setRowsPerPageOptions}
                      rowCount={totalPendingApplicants}
                      page={pageNumber}
                      setPage={setPageNumber}
                      setRowsPerPage={setRowsPerPage}
                    ></AutoCompletePagination>
                  </Box>
                </>
              ) : (
                <Box className="loading-animation-for-notification">
                  <BaseNotFoundLottieLoader width={200} height={200} />
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}
      {openConfirmationDialog && (
        <StudentProfileDialog
          handleClose={() => setOpenConfirmationDialog(false)}
          open={openConfirmationDialog}
          selectedStudentName={selectedStudent?.student_name}
          status={{ title: "Selected", name: "Selected" }}
          handleChangeStatus={handleChangeStatus}
          loadingChangeStatus={loadingChangeStatus}
        ></StudentProfileDialog>
      )}
    </Box>
  );
}

export default InterviewedCandidateBody;
