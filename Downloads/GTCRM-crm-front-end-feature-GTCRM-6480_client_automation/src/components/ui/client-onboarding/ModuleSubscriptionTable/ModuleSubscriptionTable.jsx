import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import SharedPaginationAndRowsPerPage from "../../../shared/Pagination/SharedPaginationAndRowsPerPage";
import TableDataCount from "../../application-manager/TableDataCount";
import TableTopPagination from "../../application-manager/TableTopPagination";
import ModuleSubscriptionActions from "./ModuleSubscriptionActions";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import NavigationButtons from "../NavigationButtons";
import {
  useAddFeatureScreenMutation,
  useGetAllFeatureListsQuery,
  useGetApprovalRequestByIdQuery,
} from "../../../../Redux/Slices/clientOnboardingSlice";
import useCommonErrorHandling from "../../../../hooks/useCommonErrorHandling";
import { DashboradDataContext } from "../../../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../../../utils/handleSomethingWentWrong";
import LeefLottieAnimationLoader from "../../../shared/Loader/LeefLottieAnimationLoader";
import ErrorAndSomethingWentWrong from "../../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import BaseNotFoundLottieLoader from "../../../shared/Loader/BaseNotFoundLottieLoader";
import useToasterHook from "../../../../hooks/useToasterHook";
import { useSelector } from "react-redux";
import { useGetCounselorListQuery } from "../../../../Redux/Slices/applicationDataApiSlice";
import { useNavigate } from "react-router-dom";
import ShowModulesAndSubModules from "./ShowModulesAndSubModules";

function ModuleSubscriptionTable({
  clientId,
  collegeId,
  currentSectionIndex,
  setCurrentSectionIndex,
  hideNextBtn,
  approverId,
  from,
  hideBackBtn,
}) {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);

  const [subscriptionModules, setSubscriptionModules] = useState([]);
  const [totalModulesCount, setTotalModulesCount] = useState(0);
  const [selectedModules, setSelectedModules] = useState([]);

  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);

  const [isLoadingAddFeature, setIsLoadingAddFeature] = useState(false);

  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);
  const [addFeatureScreen] = useAddFeatureScreenMutation();

  const pushNotification = useToasterHook();
  const navigate = useNavigate();

  const userId = useSelector((state) => state.authentication.token?.user_id);

  const [paginationRef, { entry: paginationEntry }] = useIntersectionObserver();
  const isPaginationVisible =
    paginationEntry && paginationEntry?.isIntersecting;

  useEffect(() => {
    if (isPaginationVisible) {
      setIsScrolledToPagination(true);
    } else {
      setIsScrolledToPagination(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginationVisible]);

  const { isError, error, isSuccess, isFetching, data } =
    useGetAllFeatureListsQuery({
      pageNumber,
      pageSize: rowsPerPage,
      clientId: "",
      collegeId: from === "requestView" ? "" : collegeId,
    });
  const { handleError } = useCommonErrorHandling();
  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data.data)) {
          setSubscriptionModules(data.data.data);
          setTotalModulesCount(data.total);
        } else {
          throw new Error(
            "Get all feature list API response has been changed."
          );
        }
      } else if (isError) {
        handleError({ error, setIsInternalServerError });
      }
    } catch {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, null, 5000);
    }
  }, [data, error, isError, isSuccess]);

  const {
    data: getRequestData,
    isSuccess: isGetRequestDataSuccess,
    isFetching: isFetchingGetRequestData,
    error: errorGetRequest,
    isError: isErrorGetRequest,
  } = useGetApprovalRequestByIdQuery(
    {
      approverId: approverId,
    },
    {
      skip: !approverId,
    }
  );

  useEffect(() => {
    try {
      if (isGetRequestDataSuccess) {
        const expectedData = getRequestData;
        if (expectedData) {
          setSelectedModules(getRequestData?.payload);
        } else {
          throw new Error(
            "get approval request data by id API response has changed"
          );
        }
      }
      if (isErrorGetRequest) {
        if (
          errorGetRequest?.data?.detail === "Could not validate credentials"
        ) {
          window.location.reload();
        } else if (errorGetRequest?.data?.detail) {
          pushNotification("error", errorGetRequest?.data?.detail);
        }
        if (errorGetRequest?.status === 500) {
          navigate("/page500");
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }, [
    errorGetRequest,
    isErrorGetRequest,
    isGetRequestDataSuccess,
    getRequestData,
  ]);

  const handleBack = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      localStorage.setItem(
        `${userId}createCollegeSectionIndex`,
        (currentSectionIndex - 1).toString()
      );
    }
  };

  const handleNext = () => {
    formik.handleSubmit();
  };

  const handleSubmitFeatures = () => {
    setIsLoadingAddFeature(true);

    addFeatureScreen({
      payload: { screen_details: selectedModules },
      collegeId,
      clientId: collegeId ? "" : clientId,
      approverId: approverId,
    })
      .unwrap()
      .then((response) => {
        if (response.message) {
          pushNotification("success", response.message);
          setSelectedModules([]);
          navigate("/management-dashboard");
          localStorage.removeItem("createdCollegeId");
          localStorage.removeItem(`${userId}createCollegeSectionIndex`);
          localStorage.removeItem(`${userId}createCollegeAddedCourses`);
          localStorage.removeItem(`${userId}createCollegeDifferentForm`);
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
      })
      .finally(() => setIsLoadingAddFeature(false));
  };

  return (
    <Card className="common-box-shadow" sx={{ borderRadius: 2.5, p: 4 }}>
      <Typography sx={{ mb: 3 }} variant="h5">
        Subscription Module
      </Typography>
      <Box className="common-table-heading-container">
        <TableDataCount
          totalCount={totalModulesCount}
          currentPageShowingCount={subscriptionModules.length}
          pageNumber={pageNumber}
          rowsPerPage={rowsPerPage}
        />

        <TableTopPagination
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          totalCount={totalModulesCount}
          rowsPerPage={rowsPerPage}
        />
      </Box>
      {isFetching || isFetchingGetRequestData ? (
        <Box className="common-not-found-container">
          <LeefLottieAnimationLoader height={150} width={150} />
        </Box>
      ) : (
        <>
          {isInternalServerError || isSomethingWentWrong ? (
            <ErrorAndSomethingWentWrong
              isInternalServerError={isInternalServerError}
              isSomethingWentWrong={isSomethingWentWrong}
            />
          ) : (
            <>
              {subscriptionModules?.length > 0 ? (
                <>
                  <ShowModulesAndSubModules
                    selectedModules={selectedModules}
                    setSelectedModules={setSelectedModules}
                    subscriptionModules={subscriptionModules}
                  />

                  <Box ref={paginationRef}>
                    <SharedPaginationAndRowsPerPage
                      rowsPerPage={rowsPerPage}
                      setRowsPerPage={setRowsPerPage}
                      pageNumber={pageNumber}
                      setPageNumber={setPageNumber}
                      totalDataCount={totalModulesCount}
                    />
                  </Box>
                </>
              ) : (
                <Box className={"common-not-found-container"}>
                  <BaseNotFoundLottieLoader height={250} width={250} />
                </Box>
              )}
            </>
          )}
        </>
      )}

      {selectedModules?.length > 0 && (
        <ModuleSubscriptionActions
          isScrolledToPagination={isScrolledToPagination}
          selectedModules={selectedModules}
          handleSubmitFeatures={handleSubmitFeatures}
          isLoading={isLoadingAddFeature}
        />
      )}

      {/* Navigation Buttons */}
      <NavigationButtons
        currentSectionIndex={currentSectionIndex}
        handleBack={handleBack}
        handleNext={handleNext}
        hideNextBtn={hideNextBtn}
        hideBackBtn={hideBackBtn}
      />
    </Card>
  );
}

export default ModuleSubscriptionTable;
