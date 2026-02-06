import { Button, Card } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import AutomationDetailsTab from "./AutomationDetailsTab";
import EmailDetailsTable from "./EmailDetailsTable";
import SmsDetailsTable from "./SmsDetailsTable";
import WhatsappDetailsTable from "./WhatsappDetailsTable";
// import Pagination from "../../../components/shared/Pagination/Pagination";
// import { handleChangePage } from "../../../helperFunctions/pagination";
// import AutoCompletePagination from "../../../components/shared/forms/AutoCompletePagination";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { useSelector } from "react-redux";
import useToasterHook from "../../../hooks/useToasterHook";
// import { defaultRowsPerPageOptions } from "../../../components/Calendar/utils";
// import TableDataCount from "../../../components/ui/application-manager/TableDataCount";
// import TableTopPagination from "../../../components/ui/application-manager/TableTopPagination";
import LeefLottieAnimationLoader from "../../../components/shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import BaseNotFoundLottieLoader from "../../../components/shared/Loader/BaseNotFoundLottieLoader";
import { useGetAutomationManagerDetailsTableDataQuery } from "../../../Redux/Slices/applicationDataApiSlice";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";

function AutomationManagerDetailsTable({ detailsId }) {
  const [tabValue, setTabValue] = useState(0);
  // const [pageNumber, setPageNumber] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(25);
  // const [totalAutomationCount, setTotalAutomationCount] = useState(0);
  const [automationList, setAutomationList] = useState([]);

  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [hideTable, setHideTable] = useState(false);
  // const [rowPerPageOptions, setRowsPerPageOptions] = useState(
  //   defaultRowsPerPageOptions
  // );

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();
  // const count = Math.ceil(totalAutomationCount / rowsPerPage);

  const { data, isError, error, isFetching, isSuccess } =
    useGetAutomationManagerDetailsTableDataQuery({
      collegeId,
      automationId: detailsId,
      tabValue,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setAutomationList(data?.data);
        } else {
          throw new Error("Automation details table API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error.status === 500) {
          handleInternalServerError(
            setIsInternalServerError,
            setHideTable,
            5000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, setHideTable, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isError, error, isSuccess]);

  return (
    <Card className="common-box-shadow automation-header-card" sx={{ mt: 2.5 }}>
      <Box className="automation-details-table-header">
        <Box>
          <AutomationDetailsTab
            tabArray={[
              { tabName: "Email" },
              { tabName: "SMS" },
              {
                tabName: "Whatsapp",
              },
            ]}
            setMapTabValue={setTabValue}
            mapTabValue={tabValue}
          ></AutomationDetailsTab>
        </Box>
        <Button className="view-on-editor-btn">View on Editor</Button>
      </Box>

      <Box sx={{ mt: 2,visibility: hideTable ? "hidden" : "visible" }}>
        {isFetching ? (
          <>
            <Box
              sx={{ minHeight: "50vh" }}
              className="common-not-found-container"
            >
              <LeefLottieAnimationLoader
                height={200}
                width={200}
              ></LeefLottieAnimationLoader>
            </Box>
          </>
        ) : (
          <>
            {isInternalServerError || isSomethingWentWrong ? (
              <Box
                sx={{ minHeight: "25vh" }}
                className="common-not-found-container"
              >
                {isInternalServerError && (
                  <Error500Animation
                    height={200}
                    width={200}
                  ></Error500Animation>
                )}
                {isSomethingWentWrong && (
                  <ErrorFallback
                    error={apiResponseChangeMessage}
                    resetErrorBoundary={() => window.location.reload()}
                  />
                )}
              </Box>
            ) : (
              <>
                {/* 
                  For now the pagination is commented because it is not present in figma.
                <Box className="automation-table-top-pagination">
                  <TableDataCount
                    //   totalCount={totalAutomationCount}
                    totalCount={smsData.length}
                    currentPageShowingCount={smsData.length}
                    //   currentPageShowingCount={automationList.length}
                    pageNumber={pageNumber}
                    rowsPerPage={rowsPerPage}
                  />
                  <TableTopPagination
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    totalCount={totalAutomationCount}
                    rowsPerPage={rowsPerPage}
                  />
                </Box> */}

                {automationList.length > 0 ? (
                  <>
                    {" "}
                    <Box className="automation-details-table-container">
                      {tabValue === 0 && (
                        <EmailDetailsTable data={automationList} />
                      )}
                      {tabValue === 1 && (
                        <SmsDetailsTable data={automationList} />
                      )}
                      {tabValue === 2 && (
                        <WhatsappDetailsTable data={automationList} />
                      )}
                    </Box>
                    {/* 
                      For now we are commenting the pagination because it is not present in figma design.
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
                        totalCount={1}
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
                        rowCount={1}
                        page={pageNumber}
                        setPage={setPageNumber}
                        setRowsPerPage={setRowsPerPage}
                      ></AutoCompletePagination>
                    </Box> */}
                  </>
                ) : (
                  <Box className="common-not-found-container">
                    <BaseNotFoundLottieLoader height={200} width={200} />
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Card>
  );
}

export default AutomationManagerDetailsTable;
