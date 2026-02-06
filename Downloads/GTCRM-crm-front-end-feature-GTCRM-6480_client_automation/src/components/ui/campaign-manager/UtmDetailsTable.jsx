/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetAllSourceListQuery,
  useGetUtmDataDetailsQuery,
  usePrefetch,
} from "../../../Redux/Slices/filterDataSlice";
import { indicatorValue } from "../../../constants/LeadStageList";
import { organizeSourceFilterOption } from "../../../helperFunctions/filterHelperFunction";
import { handleChangePage } from "../../../helperFunctions/pagination";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { GetFormatDate } from "../../../hooks/GetJsonDate";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import useTableCellDesign from "../../../hooks/useTableCellDesign";
import useToasterHook from "../../../hooks/useToasterHook";
import IndicatorImage from "../../../images/indicatorImage.svg";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { LayoutSettingContext } from "../../../store/contexts/LayoutSetting";
import "../../../styles/AdminDashboard.css";
import "../../../styles/CampaignManager.css";
import "../../../styles/sharedStyles.css";
import "../../../styles/topPerformingChannel.css";
import { startAndEndDateSelect } from "../../../utils/adminDashboardDateRangeSelect";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import {
  currentSeasonDateRangeGenerator,
  defaultRowsPerPageOptions,
} from "../../Calendar/utils";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import IndicatorDropDown from "../../shared/DropDownButton/IndicatorDropDown";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";
import AutoCompletePagination from "../../shared/forms/AutoCompletePagination";
import MultipleTabs from "../../shared/tab-panel/MultipleTabs";
import IndicatorComponent from "../admin-dashboard/IndicatorComponent";
import Pagination from "../../shared/Pagination/Pagination";
import { apiCallFrontAndBackPage } from "../../../helperFunctions/apiCallFrontAndBackPage";

const UtmDetailsTable = () => {
  const [utmDetailsTableData, setUtmDetailsTableData] = useState([]);
  const [tabValue, setTabValue] = React.useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState();
  const count = Math.ceil(rowCount / pageSize);
  const [sourceWiseIndicator, setSourceWiseIndicator] = useState(null);
  const [sourceWiseDataRange, setSourceWiseDataRange] = useState([]);
  const [selectedSource, setSelectedSource] = useState([]);
  const [callFilterOptionApi, setCallFilterOptionApi] = useState({
    skipStateApiCall: true,
    skipSourceApiCall: true,
  });
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
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
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [selectedSourceId, setSelectedSourceId] = useState([]);
  const dateSourceRangeObject =
    sourceWiseDataRange?.length > 0 ? GetFormatDate(sourceWiseDataRange) : null;
  const payload = {
    source_name: selectedSourceId.length > 0 ? selectedSourceId : [],
    date_range: dateSourceRangeObject,
  };
  const [sourceToggle, setSourceToggle] = useState(false);
  useEffect(() => {
    if (sourceToggle) {
      setSelectedSourceId(selectedSource);
      setSourceToggle(false);
    }
  }, [sourceToggle]);
  const [somethingWentWrongInUtmDetails, setSomethingWentWrongInUtmDetails] =
    useState(false);
  const [utmDetailsInternalServerError, setUtmDetailsInternalServerError] =
    useState(false);
  const [hideUtmDetails, setHideUtmDetails] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [totalData, setTotalData] = useState({});
  const pushNotification = useToasterHook();
  const { data, isSuccess, isFetching, error, isError } =
    useGetUtmDataDetailsQuery({
      pageNumber: pageNumber,
      rowsPerPage: pageSize,
      payload: payload,
      collegeId: collegeId,
      sourceWiseIndicator: sourceWiseIndicator,
      utmType:
        tabValue === 0
          ? "utm_campaign"
          : tabValue === 1
          ? "utm_keyword"
          : "utm_medium",
    });
  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setRowCount(data?.total);
          setUtmDetailsTableData(data?.data);
          setTotalData(data?.total_count_data);
        } else {
          throw new Error("get all Event API response has changed");
        }
      }
      if (isError) {
        setUtmDetailsTableData([]);
        // setAPICallAgain(false)
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
          // setAPICallAgain(false)
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setUtmDetailsInternalServerError,
            setHideUtmDetails,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInUtmDetails,
        setHideUtmDetails,
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
  const prefetchUtmDataDetailsData = usePrefetch("getUtmDataDetails");
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      pageSize,
      pageNumber,
      collegeId,
      prefetchUtmDataDetailsData,
      {
        payload: payload,
        sourceWiseIndicator: sourceWiseIndicator,
        utmType:
          tabValue === 0
            ? "utm_campaign"
            : tabValue === 1
            ? "utm_keyword"
            : "utm_medium",
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, pageSize, sourceWiseIndicator, collegeId, tabValue]);
  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  const { selectedSeason } = useContext(LayoutSettingContext);
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
  return (
    <Box
      sx={{
        p: 2,
        mt: 2,
        display: hideUtmDetails ? "none" : "block",
        padding: "32px",
        borderRadius: "20px",
        boxShadow: "0px 10px 60px rgba(226, 236, 249, 0.5) !important",
        backgroundColor: "#fff",
        position: "relative",
      }}
    >
      {sourceWiseDataRange?.length > 1 && (
        <DateRangeShowcase
          startDateRange={getDateMonthYear(sourceWiseDataRange[0])}
          endDateRange={getDateMonthYear(sourceWiseDataRange[1])}
          triggeredFunction={() => {
            setSourceWiseDataRange([]);
            setPageNumber(1);
            setUtmDetailsTableData([]);
          }}
        ></DateRangeShowcase>
      )}
      {somethingWentWrongInUtmDetails || utmDetailsInternalServerError ? (
        <Box>
          {utmDetailsInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInUtmDetails && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box>
          {isFetching ? (
            <Box className="campaign-manager-loader-container">
              <LeefLottieAnimationLoader width={100} height={100} />
            </Box>
          ) : (
            <Box>
              <Box className="top-dashboard-header-and-filter-section">
                <Box className="title-box-hover">
                  <Typography className="top-section-title">
                    UTM Details
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
                  <MultipleTabs
                    tabArray={[
                      { tabName: "Campaign" },
                      { tabName: "Keyword" },
                      { tabName: "Medium" },
                    ]}
                    setMapTabValue={setTabValue}
                    mapTabValue={tabValue}
                    boxWidth="280px !important"
                  ></MultipleTabs>
                  {sourceWiseDataRange?.length === 0 && (
                    <IndicatorDropDown
                      indicator={sourceWiseIndicator}
                      image={IndicatorImage}
                      indicatorValue={indicatorValue}
                      setIndicator={setSourceWiseIndicator}
                      setPageNumber={setPageNumber}
                      setDataValue={setUtmDetailsTableData}
                      page={true}
                      position={"bottomEnd"}
                    ></IndicatorDropDown>
                  )}
                  <IconDateRangePicker
                    onChange={(value) => {
                      setSourceWiseDataRange(value);
                      setPageNumber(1);
                      setUtmDetailsTableData([]);
                    }}
                    dateRange={sourceWiseDataRange}
                  />
                </Box>
              </Box>
              {utmDetailsTableData.length > 0 ? (
                <>
                  <TableContainer
                    component={Paper}
                    sx={{ mt: 2, boxShadow: 0 }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="left">
                            {tabValue === 0
                              ? "Campaign Name"
                              : tabValue === 1
                              ? "keyword Name"
                              : "Medium Name"}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            Source Name
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            Total Leads
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            Total Applications
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            Form initiated
                          </StyledTableCell>
                          <StyledTableCell align="left">Paid</StyledTableCell>
                          <StyledTableCell align="left">
                            Verified
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {utmDetailsTableData?.map((item, index) => {
                          return (
                            <TableRow key={index}>
                              <StyledTableCell align="left">
                                <span style={{ fontWeight: "500" }}>
                                  {" "}
                                  {item?.name}
                                </span>
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <span style={{ fontWeight: "500" }}>
                                  {" "}
                                  {item?.source_name}
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
                                    {item?.total_leads
                                      ? item?.total_leads
                                      : "0"}
                                  </Typography>
                                  <Box>
                                    <IndicatorComponent
                                      indicator={sourceWiseIndicator}
                                      indicatorSize="15"
                                      fontSize="12"
                                      title="Total Leads "
                                      performance={
                                        item?.lead_position || "equal"
                                      }
                                      percentage={parseFloat(
                                        item?.lead_percentage
                                          ? item?.lead_percentage
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
                                    {item?.total_application
                                      ? item?.total_application
                                      : "0"}
                                  </Typography>
                                  <Box>
                                    <IndicatorComponent
                                      indicator={sourceWiseIndicator}
                                      indicatorSize="15"
                                      fontSize="12"
                                      title="Total Applications "
                                      performance={
                                        item?.application_position || "equal"
                                      }
                                      percentage={parseFloat(
                                        item?.application_percentage
                                          ? item?.application_percentage
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
                                    {item?.form_initiated
                                      ? item?.form_initiated
                                      : "0"}
                                  </Typography>
                                  <Box>
                                    <IndicatorComponent
                                      indicator={sourceWiseIndicator}
                                      indicatorSize="15"
                                      fontSize="12"
                                      title="Form Initiated "
                                      performance={
                                        item?.form_initiated_position || "equal"
                                      }
                                      percentage={parseFloat(
                                        item?.form_initiated_percentage
                                          ? item?.form_initiated_percentage
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
                                    {item?.paid_application
                                      ? item?.paid_application
                                      : "0"}
                                  </Typography>
                                  <Box>
                                    <IndicatorComponent
                                      indicator={sourceWiseIndicator}
                                      indicatorSize="15"
                                      fontSize="12"
                                      title="Paid "
                                      performance={
                                        item?.paid_position || "equal"
                                      }
                                      percentage={parseFloat(
                                        item?.paid_percentage
                                          ? item?.paid_percentage
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
                                    {item?.verified_leads
                                      ? item?.verified_leads
                                      : "0"}
                                  </Typography>
                                  <Box>
                                    <IndicatorComponent
                                      indicator={sourceWiseIndicator}
                                      indicatorSize="15"
                                      fontSize="12"
                                      title="Verified "
                                      performance={
                                        item?.verified_position || "equal"
                                      }
                                      percentage={parseFloat(
                                        item?.verified_percentage
                                          ? item?.verified_percentage
                                          : 0
                                      ).toFixed(2)}
                                      tooltipPosition="right"
                                    ></IndicatorComponent>
                                  </Box>
                                </Box>
                              </StyledTableCell>
                            </TableRow>
                          );
                        })}
                        {utmDetailsTableData.length > 0 && (
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
                                {""}
                              </Typography>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              <Typography
                                variant="subtitle"
                                fontWeight={600}
                                fontSize={15}
                              >
                                {totalData?.total_leads
                                  ? totalData?.total_leads
                                  : "0"}
                              </Typography>
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              <Typography
                                variant="subtitle"
                                fontWeight={600}
                                fontSize={15}
                              >
                                {totalData?.total_applications
                                  ? totalData?.total_applications
                                  : "0"}
                              </Typography>
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              <Typography
                                variant="subtitle"
                                fontWeight={600}
                                fontSize={15}
                              >
                                {totalData?.form_initiated
                                  ? totalData?.form_initiated
                                  : "0"}
                              </Typography>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              <Typography
                                variant="subtitle"
                                fontWeight={600}
                                fontSize={15}
                              >
                                {totalData?.paid ? totalData?.paid : "0"}
                              </Typography>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              <Typography
                                variant="subtitle"
                                fontWeight={600}
                                fontSize={15}
                              >
                                {totalData?.verified
                                  ? totalData?.verified
                                  : "0"}
                              </Typography>
                            </StyledTableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {utmDetailsTableData?.length > 0 && (
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
                            `utmDetailsSavePageNo`,
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
                        localStorageChangeRowPerPage={`utmDetailsRowPerPage`}
                        localStorageChangePage={`utmDetailsSavePageNo`}
                        setRowsPerPage={setPageSize}
                      ></AutoCompletePagination>
                    </Box>
                  )}
                </>
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
  );
};

export default React.memo(UtmDetailsTable);
