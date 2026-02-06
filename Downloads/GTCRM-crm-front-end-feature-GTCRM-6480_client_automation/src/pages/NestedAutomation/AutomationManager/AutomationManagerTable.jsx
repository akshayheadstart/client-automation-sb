import { Card } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import AutomationTableTopSection from "./AutomationTableTopSection";
import AutomationManagerTableDetails from "./AutomationManagerTableDetails";
import TableTopPagination from "../../../components/ui/application-manager/TableTopPagination";
import TableDataCount from "../../../components/ui/application-manager/TableDataCount";
import {
  useCopyNestedAutomationMutation,
  useDeleteNestedAutomationMutation,
  useGetAutomationByIdMutation,
  useGetAutomationManagerTableDataQuery,
  usePrefetch,
  useUpdateNestedAutomationStatusMutation,
} from "../../../Redux/Slices/applicationDataApiSlice";
import useToasterHook from "../../../hooks/useToasterHook";
import { useSelector } from "react-redux";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import GetJsonDate from "../../../hooks/GetJsonDate";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import Error500Animation from "../../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../../../components/shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../../components/shared/Loader/BaseNotFoundLottieLoader";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import AutomationManagerActions from "./AutomationManagerActions";
import { apiCallFrontAndBackPage } from "../../../helperFunctions/apiCallFrontAndBackPage";
import DeleteDialogue from "../../../components/shared/Dialogs/DeleteDialogue";
import NestedAutomation from "../NestedAutomation";
import { useNavigate} from "react-router";
import { updateLastNodeValue } from "../../../Redux/Slices/authSlice";
import { useDispatch } from "react-redux";

const AutomationManagerTable = ({ setDetailsId, setShowDetailsPage }) => {
  const [communicationType, setCommunicationType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalAutomationCount, setTotalAutomationCount] = useState(0);
  const [automationList, setAutomationList] = useState([]);
  const [selectedAutomation, setSelectedAutomation] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteModalTitle, setDeleteModalTitle] = useState("");
  const [openCreateAutomationDialog, setCreateAutomationDialog] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [deleteApiLoading, setDeleteApiLoading] = useState(false);
  const [hideTable, setHideTable] = useState(false);
  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);
  const [paginationRef, { entry: paginationEntry }] = useIntersectionObserver();

  const isPaginationVisible =
    paginationEntry && paginationEntry?.isIntersecting;

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();

  const { data, isError, error, isFetching, isSuccess } =
    useGetAutomationManagerTableDataQuery({
      collegeId,
      pageNumber,
      rowsPerPage,
      searchText,
      payload: {
        communication: communicationType ? [communicationType] : [],
        date_range: dateRange?.length
          ? JSON.parse(GetJsonDate(dateRange))
          : null,
      },
    });

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
        if (Array.isArray(data?.data)) {
          setAutomationList(data.data);
          setTotalAutomationCount(data?.total);
        } else {
          throw new Error("Tag list API response has changed");
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

  const prefetchAutomation = usePrefetch("getAutomationManagerTableData");

  useEffect(() => {
    apiCallFrontAndBackPage(
      data?.data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchAutomation,
      {
        payload: {
          payload: {
            communication: communicationType ? [communicationType] : [],
            date_range: dateRange?.length
              ? JSON.parse(GetJsonDate(dateRange))
              : null,
          },
          searchText,
        },
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    pageNumber,
    prefetchAutomation,
    rowsPerPage,
    collegeId,
    searchText,
  ]);

  const handleManageCreateAutomationDialogue = (value) => {
    setCreateAutomationDialog(value);
  };
  const [deleteNestedAutomation] = useDeleteNestedAutomationMutation();
  const [copyNestedAutomation] = useCopyNestedAutomationMutation();
  const [updateNestedAutomationStatus] =
    useUpdateNestedAutomationStatusMutation();
  const [getAutomationById] = useGetAutomationByIdMutation();

  const handleAutomationDetailsApiCall = () => {
    getAutomationById({
      collegeId,
      automationId: selectedAutomation[0],
    })
      .unwrap()
      .then((res) => {
        if (res?.message) {
          try {
            if (typeof res.message === "string") {
              const automationObj = res?.data;
              dispatch(
                updateLastNodeValue(
                  automationObj?.automation_node_edge_details?.lastNodesCount
                )
              );

              navigate("/create-automation", {
                state: {
                  template: false,
                  automationPayload: automationObj,
                },
              });

              // Updating the object with selected data segments and count
            } else {
              throw new Error("automation get by id API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
          }
        } else if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        }
      })
      .catch((error) => {
        if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else {
          handleInternalServerError(setIsInternalServerError, "", 5000);
        }
      })
      .finally(() => {});
  };

  const handlePerformQuickActionOfAutomation = (handleApiCall, payload) => {
    setDeleteApiLoading(true);
    handleApiCall(payload)
      .unwrap()
      .then((response) => {
        if (response.message) {
          pushNotification("success", response.message);
          setOpenDeleteModal(false);
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else {
          handleInternalServerError(setIsInternalServerError, "", 10000);
        }
      })
      .finally(() => {
        setDeleteApiLoading(false);
        setSelectedAutomation([]);
      });
  };

  return (
    <Card className="common-box-shadow automation-header-card" sx={{ mt: 2.5 }}>
      <AutomationTableTopSection
        communicationType={communicationType}
        setCommunicationType={setCommunicationType}
        searchText={searchText}
        setSearchText={setSearchText}
        dateRange={dateRange}
        setDateRange={setDateRange}
        setPageNumber={setPageNumber}
        handleManageCreateAutomationDialogue={
          handleManageCreateAutomationDialogue
        }
      />

      <Box className="automation-table-top-pagination">
        <TableDataCount
          totalCount={totalAutomationCount}
          currentPageShowingCount={automationList.length}
          pageNumber={pageNumber}
          rowsPerPage={rowsPerPage}
        />
        <TableTopPagination
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          totalCount={totalAutomationCount}
          rowsPerPage={rowsPerPage}
        />
      </Box>
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
                <Error500Animation height={200} width={200}></Error500Animation>
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
              {automationList.length > 0 ? (
                <>
                  <AutomationManagerTableDetails
                    totalCount={totalAutomationCount}
                    pageNumber={pageNumber}
                    rowsPerPage={rowsPerPage}
                    setPageNumber={setPageNumber}
                    setRowsPerPage={setRowsPerPage}
                    automationList={automationList}
                    hideTable={hideTable}
                    paginationRef={paginationRef}
                    selectedAutomation={selectedAutomation}
                    setSelectedAutomation={setSelectedAutomation}
                    setDetailsId={setDetailsId}
                    setShowDetailsPage={setShowDetailsPage}
                  />
                  {selectedAutomation.length > 0 && (
                    <AutomationManagerActions
                      isScrolledToPagination={isScrolledToPagination}
                      selectedAutomationCount={selectedAutomation.length}
                      setDeleteModalTitle={setDeleteModalTitle}
                      setOpenDeleteModal={setOpenDeleteModal}
                      handleEdit={handleAutomationDetailsApiCall}
                    />
                  )}
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
      <DeleteDialogue
        loading={deleteApiLoading}
        openDeleteModal={openDeleteModal}
        handleCloseDeleteModal={() => setOpenDeleteModal(false)}
        title={deleteModalTitle}
        internalServerError={isInternalServerError}
        somethingWentWrong={isSomethingWentWrong}
        apiResponseChangeMessage={apiResponseChangeMessage}
        handleDeleteSingleTemplate={() =>
          deleteModalTitle?.includes("delete")
            ? handlePerformQuickActionOfAutomation(deleteNestedAutomation, {
                collegeId,
                payload: selectedAutomation,
              })
            : deleteModalTitle?.includes("stop")
            ? handlePerformQuickActionOfAutomation(
                updateNestedAutomationStatus,
                {
                  collegeId,
                  payload: {
                    automation_ids: selectedAutomation,
                    status: "stopped",
                  },
                }
              )
            : handlePerformQuickActionOfAutomation(copyNestedAutomation, {
                collegeId,
                automationId: selectedAutomation[0],
              })
        }
      />
      <NestedAutomation
        openCreateAutomationDialog={openCreateAutomationDialog}
        setCreateAutomationDialog={setCreateAutomationDialog}
        handleManageCreateAutomationDialogue={
          handleManageCreateAutomationDialogue
        }
      >
        {" "}
      </NestedAutomation>
    </Card>
  );
};

export default AutomationManagerTable;
