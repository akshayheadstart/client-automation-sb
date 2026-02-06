/* eslint-disable react-hooks/exhaustive-deps */
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetAllSourceListQuery,
  useGetSourceWiseOverlapDataDetailsQuery,
  usePrefetch,
} from "../../Redux/Slices/filterDataSlice";
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
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import IndicatorComponent from "../../components/ui/admin-dashboard/IndicatorComponent";
import { indicatorValue } from "../../constants/LeadStageList";
import { organizeSourceFilterOption } from "../../helperFunctions/filterHelperFunction";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { GetFormatDate } from "../../hooks/GetJsonDate";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import { getDateMonthYear } from "../../hooks/getDayMonthYear";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import useToasterHook from "../../hooks/useToasterHook";
import IndicatorImage from "../../images/indicatorImage.svg";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import "../../styles/AdminDashboard.css";
import "../../styles/CampaignManager.css";
import "../../styles/sharedStyles.css";
import "../../styles/topPerformingChannel.css";
import { startAndEndDateSelect } from "../../utils/adminDashboardDateRangeSelect";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleChangePage } from "../../helperFunctions/pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import Pagination from "../../components/shared/Pagination/Pagination";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
const AllLeadDetails = () => {
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  const [sourceWiseDataRange, setSourceWiseDataRange] = useState([]);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { selectedSeason } = useContext(LayoutSettingContext);
  const [sourceWiseIndicator, setSourceWiseIndicator] = useState(null);
  const [selectedSource, setSelectedSource] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState();
  const count = Math.ceil(rowCount / pageSize);
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
  const [callFilterOptionApi, setCallFilterOptionApi] = useState({
    skipStateApiCall: true,
    skipSourceApiCall: true,
  });
  const [hideSourceList, setHideSourceList] = useState(false);
  const [sourceList, setSourceList] = useState([]);
  const { handleFilterListApiCall } = useCommonApiCalls();
  const sourceListInfo = useGetAllSourceListQuery(
    { collegeId },
    { skip: callFilterOptionApi.skipSourceApiCall }
  );
  //get source list
  useEffect(() => {
    if (!callFilterOptionApi.skipSourceApiCall) {
      const sourceList = sourceListInfo?.data?.data[0];

      handleFilterListApiCall(
        sourceList,
        sourceListInfo,
        setSourceList,
        setHideSourceList,
        organizeSourceFilterOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callFilterOptionApi.skipSourceApiCall, sourceListInfo]);

  const StyledTableCell = useTableCellDesign();
  const [sourceWiseDetailsTableData, setSourceWiseDetailsTableData] = useState(
    []
  );
  const [
    somethingWentWrongInSourceWiseDetails,
    setSomethingWentWrongInSourceWiseDetails,
  ] = useState(false);
  const [
    sourceWiseDetailsInternalServerError,
    setSourceWiseDetailsInternalServerError,
  ] = useState(false);
  const [hideSourceWiseDetails, setHideSourceWiseDetails] = useState(false);
  const pushNotification = useToasterHook();

  const dateSourceRangeObject =
    sourceWiseDataRange?.length > 0 ? GetFormatDate(sourceWiseDataRange) : null;

  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const [selectedSourceId, setSelectedSourceId] = useState([]);
  const payload = {
    source_name: selectedSourceId.length > 0 ? selectedSourceId : [],
    date_range: dateSourceRangeObject,
  };
  const [totalData, setTotalData] = useState({});
  const [sourceToggle, setSourceToggle] = useState(false);
  useEffect(() => {
    if (sourceToggle) {
      setSelectedSourceId(selectedSource);
      setSourceToggle(false);
    }
  }, [sourceToggle]);
  const { data, isSuccess, isFetching, error, isError } =
    useGetSourceWiseOverlapDataDetailsQuery({
      pageNumber: pageNumber,
      rowsPerPage: pageSize,
      payload: payload,
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
          setTotalData(data?.total_count_data);
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
  const prefetchSourceOverlapData = usePrefetch(
    "getSourceWiseOverlapDataDetails"
  );
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      pageSize,
      pageNumber,
      collegeId,
      prefetchSourceOverlapData,
      {
        payload,
        sourceWiseIndicator,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, collegeId, pageSize, sourceWiseIndicator]);
  return (
    <Box
      sx={{
        mt: "16px",
        display: hideSourceWiseDetails ? "none" : "block",
        borderRadius: "20px",
        boxShadow: "0px 10px 60px rgba(226, 236, 249, 0.5) !important",
        padding: "32px",
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
      {somethingWentWrongInSourceWiseDetails ||
      sourceWiseDetailsInternalServerError ? (
        <Box>
          {sourceWiseDetailsInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInSourceWiseDetails && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box>
          {" "}
          {isFetching ? (
            <Box
              data-testid="loader-container"
              className="campaign-manager-loader-container"
            >
              <LeefLottieAnimationLoader width={100} height={100} />
            </Box>
          ) : (
            <Box sx={{ mt: sourceWiseDataRange?.length > 1 ? "10px" : "0px" }}>
              <Box className="top-dashboard-header-and-filter-section">
                <Box className="title-box-hover">
                  <Typography className="top-section-title">
                    Source Wise Overlap Details
                  </Typography>
                  <Typography className="top-section-date">
                    {startDateRange} - {endDateRange}
                  </Typography>
                </Box>
                <Box className="top-dashboard-section-filters-box">
                  {hideSourceList || (
                    <MultipleFilterSelectPicker
                      onChange={(value) => {
                        setSelectedSource(value);
                      }}
                      setSelectedPicker={setSelectedSource}
                      pickerData={sourceList}
                      className="dashboard-select-picker"
                      placeholder="Select Source"
                      placement="bottomEnd"
                      pickerValue={selectedSource}
                      loading={sourceListInfo.isFetching}
                      style={{ width: "150px" }}
                      onOpen={() =>
                        setCallFilterOptionApi((prev) => ({
                          ...prev,
                          skipSourceApiCall: false,
                        }))
                      }
                      callAPIAgain={() => {
                        setSourceToggle(true);
                        setPageNumber(1);
                      }}
                      onClean={() => {
                        setSourceToggle(true);
                        setPageNumber(1);
                      }}
                    />
                  )}
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

              <Box>
                {sourceWiseDetailsTableData?.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      minHeight: "55vh",
                      alignItems: "center",
                    }}
                  >
                    <BaseNotFoundLottieLoader
                      height={250}
                      width={250}
                    ></BaseNotFoundLottieLoader>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      mt: "20px",
                      visibility: hideSourceWiseDetails ? "hidden" : "visible",
                    }}
                  >
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>
                              <span>Source Name</span>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Total Lead
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Primary
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Secondary
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Tertiary
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sourceWiseDetailsTableData?.map((form) => (
                            <TableRow key={form?.source_name}>
                              <StyledTableCell>
                                <span style={{ fontWeight: "500" }}>
                                  {" "}
                                  {form?.source_name}
                                </span>
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                    fontSize={15}
                                  >
                                    {form?.primary_source
                                      ? form?.primary_source
                                      : "0"}
                                  </Typography>
                                  <Box>
                                    <IndicatorComponent
                                      indicator={sourceWiseIndicator}
                                      indicatorSize="15"
                                      fontSize="12"
                                      title="Primary source "
                                      performance={
                                        form?.primary_position || "equal"
                                      }
                                      percentage={parseFloat(
                                        form?.primary_percentage
                                          ? form?.primary_percentage
                                          : 0
                                      ).toFixed(2)}
                                      tooltipPosition="right"
                                    ></IndicatorComponent>
                                  </Box>
                                </Box>
                              </StyledTableCell>

                              <StyledTableCell align="left">
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                    fontSize={15}
                                  >
                                    {form?.primary_source
                                      ? form?.primary_source
                                      : "0"}
                                  </Typography>
                                  <Box>
                                    <IndicatorComponent
                                      indicator={sourceWiseIndicator}
                                      indicatorSize="15"
                                      fontSize="12"
                                      title="Primary source "
                                      performance={
                                        form?.primary_position || "equal"
                                      }
                                      percentage={parseFloat(
                                        form?.primary_percentage
                                          ? form?.primary_percentage
                                          : 0
                                      ).toFixed(2)}
                                      tooltipPosition="right"
                                    ></IndicatorComponent>
                                  </Box>
                                </Box>
                              </StyledTableCell>

                              <StyledTableCell align="left">
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                    fontSize={15}
                                  >
                                    {form?.secondary_source
                                      ? form?.secondary_source
                                      : "0"}
                                  </Typography>
                                  <Box>
                                    <IndicatorComponent
                                      indicator={sourceWiseIndicator}
                                      indicatorSize="15"
                                      fontSize="12"
                                      title="Secondary source "
                                      performance={
                                        form?.secondary_position || "equal"
                                      }
                                      percentage={parseFloat(
                                        form?.secondary_percentage
                                          ? form?.secondary_percentage
                                          : 0
                                      ).toFixed(2)}
                                      tooltipPosition="right"
                                    ></IndicatorComponent>
                                  </Box>
                                </Box>
                              </StyledTableCell>

                              <StyledTableCell align="left">
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                    fontSize={15}
                                  >
                                    {form?.tertiary_source
                                      ? form?.tertiary_source
                                      : "0"}
                                  </Typography>
                                  <Box>
                                    <IndicatorComponent
                                      indicator={sourceWiseIndicator}
                                      indicatorSize="15"
                                      fontSize="12"
                                      title="Tertiary source "
                                      performance={
                                        form?.tertiary_position || "equal"
                                      }
                                      percentage={parseFloat(
                                        form?.tertiary_percentage
                                          ? form?.tertiary_percentage
                                          : 0
                                      ).toFixed(2)}
                                      tooltipPosition="right"
                                    ></IndicatorComponent>
                                  </Box>
                                </Box>
                              </StyledTableCell>
                            </TableRow>
                          ))}
                          {sourceWiseDetailsTableData.length > 0 && (
                            <TableRow>
                              <StyledTableCell>
                                <Typography
                                  sx={{ fontWeight: "bold" }}
                                  variant="subtitle"
                                >
                                  Total
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <Typography
                                  variant="subtitle"
                                  fontWeight={600}
                                  fontSize={15}
                                >
                                  {totalData?.primary_source}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <Typography
                                  variant="subtitle"
                                  fontWeight={600}
                                  fontSize={15}
                                >
                                  {totalData?.primary_source}
                                </Typography>
                              </StyledTableCell>

                              <StyledTableCell align="left">
                                <Typography
                                  variant="subtitle"
                                  fontWeight={600}
                                  fontSize={15}
                                >
                                  {totalData?.secondary_source}
                                </Typography>
                              </StyledTableCell>

                              <StyledTableCell align="left">
                                <Typography
                                  variant="subtitle"
                                  fontWeight={600}
                                  fontSize={15}
                                >
                                  {totalData?.tertiary_source}
                                </Typography>
                              </StyledTableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {sourceWiseDetailsTableData.length > 0 && (
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
                              `sourceWiseOverLapSavePageNo`,
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
                          localStorageChangePage={`eventMappingSavePageNo`}
                          setRowsPerPage={setPageSize}
                        ></AutoCompletePagination>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default React.memo(AllLeadDetails);
