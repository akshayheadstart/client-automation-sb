/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  currentSeasonDateRangeGenerator,
  defaultRowsPerPageOptions,
} from "../../components/Calendar/utils";
import DateRangeShowcase from "../../components/shared/CalendarTimeData/DateRangeShowcase";
import IndicatorDropDown from "../../components/shared/DropDownButton/IndicatorDropDown";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import IconDateRangePicker from "../../components/shared/filters/IconDateRangePicker";
import UtmDetailsTable from "../../components/ui/campaign-manager/UtmDetailsTable";
import { indicatorValue } from "../../constants/LeadStageList";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { GetFormatDate } from "../../hooks/GetJsonDate";
import { getDateMonthYear } from "../../hooks/getDayMonthYear";
import useToasterHook from "../../hooks/useToasterHook";
import IndicatorImage from "../../images/indicatorImage.svg";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import "../../styles/CampaignManager.css";
import "../../styles/sharedStyles.css";
import "../../styles/topPerformingChannel.css";
import { startAndEndDateSelect } from "../../utils/adminDashboardDateRangeSelect";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import AllLeadDetails from "./AllLeadDetails";
import CampaignManagerQuickView from "./CampaignManagerQuickView";
import SourcePerformanceTable from "./SourcePerformanceTable";
import {
  useGetCampaignManagerHeaderDataQuery,
  useGetSourceWiseDataDetailsQuery,
  usePrefetch,
} from "../../Redux/Slices/filterDataSlice";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../helperFunctions/pagination";
import Pagination from "../../components/shared/Pagination/Pagination";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import { handleSetSectionVisibility } from "../StudentTotalQueries/helperFunction";
import useCommonErrorHandling from "../../hooks/useCommonErrorHandling";
function CampaignManager() {
  const [
    somethingWentWrongInSourceWiseDetails,
    setSomethingWentWrongInSourceWiseDetails,
  ] = useState(false);
  const [
    sourceWiseDetailsInternalServerError,
    setSourceWiseDetailsInternalServerError,
  ] = useState(false);
  const [hideSourceWiseDetails, setHideSourceWiseDetails] = useState(false);
  const [sourceWiseDetailsTableData, setSourceWiseDetailsTableData] = useState(
    []
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const pushNotification = useToasterHook();

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const [sourceWiseDataRange, setSourceWiseDataRange] = useState([]);
  const dateSourceRangeObject =
    sourceWiseDataRange?.length > 0 ? GetFormatDate(sourceWiseDataRange) : {};
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState();
  const count = Math.ceil(rowCount / pageSize);
  const [sourceWiseIndicator, setSourceWiseIndicator] = useState(null);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [isScrolledToOverlapSource, setIsScrolledToOverlapSource] =
    useState(false);
  const [isScrolledToUTMDetails, setIsScrolledToUTMDetails] = useState(false);

  const [overlapSourceRef, { entry: overlapSourceEntry }] =
    useIntersectionObserver();
  const [UTMDetailsRef, { entry: UTMDetailsEntry }] = useIntersectionObserver();

  const isOverlapSourceSectionVisible =
    overlapSourceEntry && overlapSourceEntry?.isIntersecting;
  const isUTMDetailsSectionVisible =
    UTMDetailsEntry && UTMDetailsEntry?.isIntersecting;

  // setting true if overlap source section is visible
  useEffect(() => {
    handleSetSectionVisibility(
      isUTMDetailsSectionVisible,
      isScrolledToUTMDetails,
      setIsScrolledToUTMDetails
    );
  }, [isUTMDetailsSectionVisible]);

  // setting true if overlap source section is visible
  useEffect(() => {
    handleSetSectionVisibility(
      isOverlapSourceSectionVisible,
      isScrolledToOverlapSource,
      setIsScrolledToOverlapSource
    );
  }, [isOverlapSourceSectionVisible]);

  const { data, isSuccess, isFetching, error, isError } =
    useGetSourceWiseDataDetailsQuery({
      pageNumber: pageNumber,
      rowsPerPage: pageSize,
      payload: dateSourceRangeObject,
      collegeId: collegeId,
      sourceWiseIndicator: sourceWiseIndicator,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setRowCount(data?.total);
          setSourceWiseDetailsTableData(data?.data);
          // setAPICallAgain(false)
        } else {
          throw new Error("get all Event API response has changed");
        }
      }
      if (isError) {
        setSourceWiseDetailsTableData([]);
        // setAPICallAgain(false)
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
          // setAPICallAgain(false)
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setSourceWiseDetailsInternalServerError,
            setHideSourceWiseDetails,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInSourceWiseDetails,
        setHideSourceWiseDetails,
        10000
      );
    } finally {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSuccess,
    data?.data,
    error,
    isError,
    error?.data?.detail,
    error?.status,
  ]);
  // use react hook for prefetch data
  const prefetchSourceWiseData = usePrefetch("getSourceWiseDataDetails");
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      pageSize,
      pageNumber,
      collegeId,
      prefetchSourceWiseData,
      {
        payload: dateSourceRangeObject,
        sourceWiseIndicator: sourceWiseIndicator,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, pageSize, sourceWiseIndicator, collegeId]);
  const { setHeadTitle, headTitle, selectedSeason } =
    useContext(LayoutSettingContext);
  //Campaign manager Head Title add
  useEffect(() => {
    setHeadTitle("Campaign Performance");
    document.title = "Campaign Performance";
  }, [headTitle]);

  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  useEffect(() => {
    if (sourceWiseDataRange?.length > 1) {
      setStartDateRange(getDateMonthYear(sourceWiseDataRange[0]));
      setEndDateRange(getDateMonthYear(sourceWiseDataRange[1]));
    }
  }, [sourceWiseDataRange]);

  const settingStartAndEndDate = () => {
    if (sourceWiseDataRange?.length) {
      setStartDateRange(getDateMonthYear(sourceWiseDataRange[0]));
      setEndDateRange(getDateMonthYear(sourceWiseDataRange[1]));
    } else if (selectedSeason?.length) {
      startAndEndDateSelect(selectedSeason, setStartDateRange, setEndDateRange);
    } else {
      const seasonDate = currentSeasonDateRangeGenerator();
      setStartDateRange(getDateMonthYear(seasonDate?.firstDayOfSeason));
      setEndDateRange(getDateMonthYear(seasonDate?.lastDayOfSeason));
    }
  };
  useEffect(() => {
    settingStartAndEndDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeason]);
  const [hideHeaderDetails, setHideHeaderDetails] = useState(false);
  const [headerDetailsData, setHeaderDetailsData] = useState({});
  const [
    somethingWentWrongInHeaderDetails,
    setSomethingWentWrongInHeaderDetails,
  ] = useState(false);
  const [
    headerDetailsInternalServerError,
    setHeaderDetailsInternalServerError,
  ] = useState(false);
  const [campaignIndicator, setCampaignIndicator] = useState(null);
  const [leadType, setLeadType] = useState("API");
  const [campaignDate, setCampaignDate] = useState([]);

  const topStripApiCallInfo = useGetCampaignManagerHeaderDataQuery({
    collegeId,
    leadType,
    campaignIndicator,
    payload: campaignDate?.length > 0 ? GetFormatDate(campaignDate) : null,
  });

  const handleError = useCommonErrorHandling();

  useEffect(() => {
    const { data, isSuccess, isError, error } = topStripApiCallInfo;
    try {
      if (isSuccess) {
        if (typeof data === "object") {
          setHeaderDetailsData(data);
        } else {
          throw new Error(
            "Campaign manager header details api response has been changed."
          );
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError: setHeaderDetailsInternalServerError,
          setHide: setHideHeaderDetails,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInHeaderDetails,
        setHideHeaderDetails,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topStripApiCallInfo]);
  return (
    <Box sx={{ mx: 3, mb: 3 }} className="campaign-manager-container-box">
      <Grid container spacing={1}>
        <Grid item sm={12} md={12} xs={12}>
          {topStripApiCallInfo?.isFetching ? (
            <Box
              sx={{
                width: "100%",
                minHeight: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              data-testid="loading-animation-container"
            >
              <LeefLottieAnimationLoader
                height={120}
                width={120}
              ></LeefLottieAnimationLoader>
            </Box>
          ) : (
            <Box>
              {somethingWentWrongInHeaderDetails ||
              headerDetailsInternalServerError ? (
                <Box>
                  {headerDetailsInternalServerError && (
                    <Error500Animation
                      height={400}
                      width={400}
                    ></Error500Animation>
                  )}
                  {somethingWentWrongInHeaderDetails && (
                    <ErrorFallback
                      error={apiResponseChangeMessage}
                      resetErrorBoundary={() => window.location.reload()}
                    />
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    visibility: hideHeaderDetails ? "hidden" : "visible",
                  }}
                >
                  {Object.keys(headerDetailsData).length > 0 ? (
                    <CampaignManagerQuickView
                      campaignIndicator={campaignIndicator}
                      setCampaignIndicator={setCampaignIndicator}
                      campaignDate={campaignDate}
                      setCampaignDate={setCampaignDate}
                      setLeadType={setLeadType}
                      leadType={leadType}
                      headerDetailsData={headerDetailsData}
                    />
                  ) : (
                    <BaseNotFoundLottieLoader
                      height={250}
                      width={250}
                    ></BaseNotFoundLottieLoader>
                  )}
                </Box>
              )}
            </Box>
          )}
        </Grid>
        <Grid item sm={12} md={12} xs={12}>
          <Box
            sx={{
              p: 2,
              mt: 2,
              borderRadius: "20px",
              boxShadow: "0px 10px 60px rgba(226, 236, 249, 0.5) !important",
              backgroundColor: "#fff",
              position: "relative",
            }}
          >
            {sourceWiseDataRange?.length > 1 && (
              <DateRangeShowcase
                startDateRange={startDateRange}
                endDateRange={endDateRange}
                triggeredFunction={() => {
                  setSourceWiseDataRange([]);
                  setPageNumber(1);
                  setSourceWiseDetailsTableData([]);
                }}
              ></DateRangeShowcase>
            )}
            {isFetching ? (
              <Box
                sx={{
                  width: "100%",
                  minHeight: "200px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                data-testid="loading-animation-container"
              >
                <LeefLottieAnimationLoader
                  height={120}
                  width={120}
                ></LeefLottieAnimationLoader>
              </Box>
            ) : (
              <Box className="campaign-manager-table-box">
                <Box className="top-dashboard-header-and-filter-section">
                  <Box className="title-box-hover">
                    <Typography className="top-section-title">
                      Source Wise Details
                    </Typography>
                    <Typography className="top-section-date">
                      {startDateRange} - {endDateRange}
                    </Typography>
                  </Box>
                  <Box className="top-dashboard-section-filters-box">
                    {sourceWiseDataRange?.length === 0 && (
                      <IndicatorDropDown
                        indicator={sourceWiseIndicator}
                        image={IndicatorImage}
                        indicatorValue={indicatorValue}
                        setIndicator={setSourceWiseIndicator}
                        setPageNumber={setPageNumber}
                        setDataValue={setSourceWiseDetailsTableData}
                        page={true}
                        position={"bottomEnd"}
                      ></IndicatorDropDown>
                    )}
                    <IconDateRangePicker
                      onChange={(value) => {
                        setSourceWiseDataRange(value);
                        setPageNumber(1);
                        setSourceWiseDetailsTableData([]);
                      }}
                      dateRange={sourceWiseDataRange}
                    />
                  </Box>
                </Box>
                {somethingWentWrongInSourceWiseDetails ||
                sourceWiseDetailsInternalServerError ? (
                  <Box>
                    {sourceWiseDetailsInternalServerError && (
                      <Error500Animation
                        height={400}
                        width={400}
                      ></Error500Animation>
                    )}
                    {somethingWentWrongInSourceWiseDetails && (
                      <ErrorFallback
                        error={apiResponseChangeMessage}
                        resetErrorBoundary={() => window.location.reload()}
                      />
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      visibility: hideSourceWiseDetails ? "hidden" : "visible",
                    }}
                  >
                    {sourceWiseDetailsTableData?.length > 0 ? (
                      <Grid container spacing={2}>
                        <Grid sx={{ mt: 2 }} md={12} sm={12} xs={12}>
                          <SourcePerformanceTable
                            sourceWiseDetailsTableData={
                              sourceWiseDetailsTableData
                            }
                            sourceWiseIndicator={sourceWiseIndicator}
                          />
                          {data?.data.length > 0 && (
                            <Box className="pagination-container-campaign-manager">
                              <Pagination
                                className="pagination-bar"
                                currentPage={pageNumber}
                                page={pageNumber}
                                totalCount={rowCount}
                                pageSize={pageSize}
                                onPageChange={(page) =>
                                  handleChangePage(
                                    page,
                                    `sourceWiseSavePageNo`,
                                    setPageNumber
                                  )
                                }
                                count={count}
                              />
                              <AutoCompletePagination
                                rowsPerPage={pageSize}
                                rowPerPageOptions={rowPerPageOptions}
                                setRowsPerPageOptions={setRowsPerPageOptions}
                                rowCount={rowCount}
                                page={pageNumber}
                                setPage={setPageNumber}
                                localStorageChangeRowPerPage={`sourceWiseRowPerPage`}
                                localStorageChangePage={`sourceWiseSavePageNo`}
                                setRowsPerPage={setPageSize}
                              ></AutoCompletePagination>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    ) : (
                      <BaseNotFoundLottieLoader
                        height={250}
                        width={250}
                      ></BaseNotFoundLottieLoader>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Grid>
        <Grid ref={overlapSourceRef} item sm={12} md={12} xs={12}>
          {isScrolledToOverlapSource && <AllLeadDetails />}
        </Grid>

        <Grid ref={UTMDetailsRef} item sm={12} md={12} xs={12}>
          {isScrolledToUTMDetails && <UtmDetailsTable />}
        </Grid>
      </Grid>
    </Box>
  );
}

export default CampaignManager;
