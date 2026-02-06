import {
  Box,
  Card,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import StudentContact from "../../components/ui/application-manager/StudentContact";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { useState } from "react";
import useToasterHook from "../../hooks/useToasterHook";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import {
  useGetReviewedApplicantsQuery,
  usePrefetch,
} from "../../Redux/Slices/filterDataSlice";
import { useEffect } from "react";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import { handleChangePage } from "../../helperFunctions/pagination";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";

const ReviewedCandidateTable = () => {
  const tableHeader = [
    "Registered Name",
    "Application No",
    "Contact Details",
    "Action Date",
    "Seat Blocked",
    "Selection Status",
  ];

  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [reviewedApplicantsDetails, setReviewedApplicantsDetails] = useState(
    []
  );
  const [totalReviewedApplicants, setTotalReviewedApplicants] = useState(0);
  const [hideReviewedApplicants, setHideReviewedApplicants] = useState(false);
  const [
    reviewedApplicantsSomethingWentWrong,
    setReviewedApplicantsSomethingWentWrong,
  ] = useState(false);
  const [
    reviewedApplicantsInternalServerError,
    setReviewedApplicantsInternalServerError,
  ] = useState(false);

  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const { data, isFetching, error, isError, isSuccess } =
    useGetReviewedApplicantsQuery({
      collegeId,
      pageNumber,
      rowsPerPage,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setReviewedApplicantsDetails(data?.data);
          setTotalReviewedApplicants(data?.total);
        } else {
          throw new Error("reviewed applicants API response has been changed.");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setReviewedApplicantsInternalServerError,
            setHideReviewedApplicants,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setReviewedApplicantsSomethingWentWrong,
        setHideReviewedApplicants,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess, isError, error]);

  const prefetchApplicants = usePrefetch("getReviewedApplicants");

  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchApplicants
    );
  }, [collegeId, data, pageNumber, prefetchApplicants, rowsPerPage]);

  const count = Math.ceil(totalReviewedApplicants / rowsPerPage);

  return (
    <Box>
      {reviewedApplicantsInternalServerError ||
      reviewedApplicantsSomethingWentWrong ? (
        <Box className="loading-animation-for-notification">
          {reviewedApplicantsInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {reviewedApplicantsSomethingWentWrong && (
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
              <LeefLottieAnimationLoader width={150} height={150} />
            </Box>
          ) : (
            <Card sx={{ display: hideReviewedApplicants ? "none" : "block" }}>
              <>
                {reviewedApplicantsDetails?.length > 0 ? (
                  <>
                    <TableContainer
                      component={Paper}
                      className="custom-scrollbar"
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            {tableHeader.map((header) => (
                              <TableCell>{header}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reviewedApplicantsDetails.map((details) => (
                            <TableRow key={details?.student_id}>
                              <TableCell
                              //interview_list_id not here
                              // onClick={()=>navigate('/view-application',{state:details})} sx={{cursor:'pointer',textDecoration:'underline',color:'#3498db'}}
                              >
                                {details.student_name}
                              </TableCell>
                              <TableCell>
                                {details.custom_application_id}
                              </TableCell>
                              <TableCell>
                                <StudentContact dataRow={details} />
                              </TableCell>
                              <TableCell>{details.action_date}</TableCell>
                              <TableCell>{details.seat_blocked}</TableCell>
                              <TableCell>
                                <Typography
                                  className={`selection-status ${details.approval_status}`}
                                >
                                  {details.approval_status}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
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
                        totalCount={totalReviewedApplicants}
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
                        rowCount={totalReviewedApplicants}
                        page={pageNumber}
                        setPage={setPageNumber}
                        setRowsPerPage={setRowsPerPage}
                      ></AutoCompletePagination>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box className="common-not-found-container">
                      <BaseNotFoundLottieLoader width={200} height={200} />
                    </Box>
                  </>
                )}
              </>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ReviewedCandidateTable;
