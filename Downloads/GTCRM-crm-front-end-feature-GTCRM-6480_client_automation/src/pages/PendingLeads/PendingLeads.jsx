/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Card,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetPendingChatLeadsDataQuery,
  usePrefetch,
} from "../../Redux/Slices/filterDataSlice";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Pagination from "../../components/shared/Pagination/Pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../helperFunctions/pagination";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import "../../styles/pendingLeads.css";
import "../../styles/sharedStyles.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";

const PendingLeads = () => {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Pending Leads Head Title add
  useEffect(() => {
    setHeadTitle("Pending leads");
    document.title = "Pending leads";
  }, [headTitle]);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const StyledTableCell = useTableCellDesign();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [
    getPendingLeadsInternalServerError,
    setGetPendingLeadsInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInGetPendingLeads,
    setSomethingWentWrongInGetPendingLeads,
  ] = useState(false);
  const pushNotification = useToasterHook();
  const [pendingLeadsData, setPendingLeadsData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowCount, setRowCount] = useState();
  const count = Math.ceil(rowCount / rowsPerPage);
  const { data, isSuccess, isFetching, error, isError } =
    useGetPendingChatLeadsDataQuery({
      pageNumber: pageNumber,
      rowsPerPage: rowsPerPage,
      collegeId: collegeId,
    });
  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setPendingLeadsData(data?.data);
          setRowCount(data?.total);
        } else {
          throw new Error("get_details API response has changed");
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setGetPendingLeadsInternalServerError,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrongInGetPendingLeads, 10000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data?.data,
    error?.data?.detail,
    error?.status,
    isError,
    isSuccess,
    setApiResponseChangeMessage,
  ]);
  // use react hook for prefetch data
  const prefetchStudentQueriesData = usePrefetch("getPendingChatLeadsData");
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchStudentQueriesData
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, prefetchStudentQueriesData, rowsPerPage]);
  return (
    <Card
      sx={{ mx: "28px" }}
      className="pending-leads-card pending-leads-header-box-container"
    >
      {getPendingLeadsInternalServerError ||
      somethingWentWrongInGetPendingLeads ? (
        <>
          {getPendingLeadsInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInGetPendingLeads && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </>
      ) : (
        <>
          {isFetching ? (
            <>
              <Box className="loading-animation">
                <LeefLottieAnimationLoader
                  height={200}
                  width={180}
                ></LeefLottieAnimationLoader>
              </Box>
            </>
          ) : (
            <>
              {data?.data.length > 0 ? (
                <TableContainer className="custom-scrollbar">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">Name</StyledTableCell>
                        <StyledTableCell align="center">Email</StyledTableCell>
                        <StyledTableCell align="center">Mobile Number</StyledTableCell>
                        
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingLeadsData?.map((lead) => {
                        return (
                          <TableRow>
                            <StyledTableCell sx={{ whiteSpace: "nowrap" }} align="center">
                              {lead?.student_name?lead?.student_name:"--"}
                            </StyledTableCell>
                            <StyledTableCell
                              align="center"
                              sx={{ whiteSpace: "nowrap" }}
                            >
                              {lead?.user_name?lead?.user_name:"--"}
                            </StyledTableCell>

                            <StyledTableCell align="center">
                              {lead?.mobile_number?lead?.mobile_number:"--"}
                            </StyledTableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "30vh",
                    alignItems: "center",
                  }}
                  data-testid="not-found-animation-container"
                >
                  <BaseNotFoundLottieLoader
                    height={250}
                    width={250}
                  ></BaseNotFoundLottieLoader>
                </Box>
              )}
            </>
          )}
        </>
      )}

      {data?.data.length > 0 && (
        <Box className="pagination-container-pending-leads">
          <Pagination
            className="pagination-bar"
            currentPage={pageNumber}
            page={pageNumber}
            totalCount={rowCount}
            pageSize={rowsPerPage}
            onPageChange={(page) =>
              handleChangePage(page, `pendingLeadsSavePageNo`, setPageNumber)
            }
            count={count}
          />
          <AutoCompletePagination
            rowsPerPage={rowsPerPage}
            rowPerPageOptions={rowPerPageOptions}
            setRowsPerPageOptions={setRowsPerPageOptions}
            rowCount={rowCount}
            page={pageNumber}
            setPage={setPageNumber}
            localStorageChangeRowPerPage={`pendingLeadsRowPerPage`}
            localStorageChangePage={`pendingLeadsSavePageNo`}
            setRowsPerPage={setRowsPerPage}
          ></AutoCompletePagination>
        </Box>
      )}
    </Card>
  );
};

export default PendingLeads;
