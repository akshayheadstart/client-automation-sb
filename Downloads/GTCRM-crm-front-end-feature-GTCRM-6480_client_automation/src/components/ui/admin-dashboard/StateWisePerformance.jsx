import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import MultipleTabs from "../../shared/tab-panel/MultipleTabs";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";
import IndicatorDropDown from "../../shared/DropDownButton/IndicatorDropDown";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import ChoroplethMap from "./ChoroplethMap";
import { TabPanel } from "@mui/lab";
import ChoroplethMapLeads from "./ChoroplethMapLeads";
import ChoropleteMapApplications from "./ChoropleteMapApplications";
import { indicatorValue } from "../../../constants/LeadStageList";
import IndicatorImage from "../../../images/indicatorImage.svg";
import { defaultMapArray } from "../../../constants/defaultMapData";
import { useGetStateWisePerformanceDetailsQuery } from "../../../Redux/Slices/adminDashboardSlice";
import { useSelector } from "react-redux";
import useCommonErrorHandling from "../../../hooks/useCommonErrorHandling";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import GetJsonDate from "../../../hooks/GetJsonDate";
import { startAndEndDateSelect } from "../../../utils/adminDashboardDateRangeSelect";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";

const StateWisePerformance = ({
  hideSourceList,
  sourceList,
  sourceListInfo,
  setSkipSourceApiCall,
  apiCallingConditions,
  isScrolledToMapData,
  collegeId,
  featureKey,
  sourceFilterFeature,
  dateRangeFilterFeature,
  changeIndicatorFilterFeature,
}) => {
  const [mapTabsValue, setMapTabValue] = useState(0);
  const [selectedMapSourceId, setSelectedMapSourceId] = useState([]);
  useState([]);
  const [appliedMapSource, setAppliedMapSource] = useState([]);
  const [stateWiseIndicator, setStateWiseIndicator] = useState(null);

  const [mapData, setMapData] = useState(defaultMapArray);
  const [leadData, setLeadsData] = useState([
    {
      map: defaultMapArray,
      total_applications: 0,
      Other: {
        state_name: "Other",
        state_code: "",
        total_lead: 0,
        lead_percentage: 0,
        application_percentage: 0,
        application_count: 0,
      },
    },
  ]);

  const [
    somethingWentWrongInStateWisePerformance,
    setSomethingWentWrongInStateWisePerformance,
  ] = useState(false);

  const [
    stateWisePerformanceInternalServerError,
    setStateWisePerformanceInternalServerError,
  ] = useState(false);

  //map data date
  const [mapDataDateRange, setMapDataDateRange] = useState([]);
  const [mapDataStartDateRange, setMapDataStartDateRange] = useState("");
  const [mapDataEndDateRange, setMapDataEndDateRange] = useState("");
  const [hideStateWisePerformance, setHideStateWisePerformance] =
    useState(false);

  const selectedSeason = useSelector(
    (state) => state.authentication.selectedSeason
  );
  const handleError = useCommonErrorHandling();

  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  const mapDetailsPayload = {
    season: selectedSeason ? JSON.parse(selectedSeason)?.season_id : "",
    payload: {
      date_range: mapDataDateRange?.length
        ? JSON.parse(GetJsonDate(mapDataDateRange))
        : {},
      source_name: appliedMapSource,
    },
  };

  const { data, isSuccess, isFetching, isError, error } =
    useGetStateWisePerformanceDetailsQuery(
      {
        collegeId,
        featureKey,
        stateWiseIndicator,
        payload: mapDetailsPayload,
      },
      { skip: apiCallingConditions && isScrolledToMapData ? false : true }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setMapData(data?.data[0]?.map);
          setLeadsData(data?.data);
        } else {
          throw new Error(
            "State wise performance API response has been changed"
          );
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError: setStateWisePerformanceInternalServerError,
          setHide: setHideStateWisePerformance,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInStateWisePerformance,
        setHideStateWisePerformance,
        5000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, isSuccess]);

  useEffect(() => {
    if (mapDataDateRange?.length > 1) {
      setMapDataStartDateRange(getDateMonthYear(mapDataDateRange[0]));
      setMapDataEndDateRange(getDateMonthYear(mapDataDateRange[1]));
    } else {
      startAndEndDateSelect(
        selectedSeason,
        setMapDataStartDateRange,
        setMapDataEndDateRange
      );
    }
  }, [mapDataDateRange, selectedSeason]);

  if (hideStateWisePerformance) {
    return null;
  }

  return (
    <>
      {isFetching ? (
        <Card className="loader-wrapper">
          <LeefLottieAnimationLoader
            height={100}
            width={150}
          ></LeefLottieAnimationLoader>{" "}
        </Card>
      ) : (
        <>
          {stateWisePerformanceInternalServerError ||
          somethingWentWrongInStateWisePerformance ? (
            <Card>
              <ErrorAndSomethingWentWrong
                isInternalServerError={stateWisePerformanceInternalServerError}
                isSomethingWentWrong={somethingWentWrongInStateWisePerformance}
                containerHeight="20vh"
              />
            </Card>
          ) : (
            <Box className="state-wise-dashboard-box">
              {mapDataDateRange?.length > 1 && (
                <DateRangeShowcase
                  startDateRange={mapDataStartDateRange}
                  endDateRange={mapDataEndDateRange}
                  triggeredFunction={() => setMapDataDateRange([])}
                ></DateRangeShowcase>
              )}
              <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={4} sm={8} md={12}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                    }}
                    className="top-dashboard-header-and-filter-section"
                  >
                    <Box className="title-box-hover">
                      <Typography className="top-section-title">
                        State wise Performance
                      </Typography>
                      <Typography className="top-section-date">
                        {mapDataStartDateRange} - {mapDataEndDateRange}
                      </Typography>
                    </Box>
                    <Box className="top-dashboard-section-filters-box">
                      <Box className="state-wise-section-tab-wrapper">
                        <MultipleTabs
                          tabArray={[
                            { tabName: "Leads" },
                            { tabName: "Applications" },
                            {
                              tabName: "Admissions",
                              disable: true,
                            },
                          ]}
                          setMapTabValue={setMapTabValue}
                          mapTabValue={mapTabsValue}
                          boxWidth="330px"
                        ></MultipleTabs>
                      </Box>
                      {sourceFilterFeature && (
                        <>
                          {hideSourceList || (
                            <MultipleFilterSelectPicker
                              style={{ width: "150px" }}
                              placement="bottomEnd"
                              placeholder="Source Name"
                              onChange={(value) => {
                                setSelectedMapSourceId(value);
                              }}
                              pickerData={sourceList}
                              setSelectedPicker={setSelectedMapSourceId}
                              pickerValue={selectedMapSourceId}
                              loading={sourceListInfo.isFetching}
                              onOpen={() => setSkipSourceApiCall(false)}
                              className="key-select-picker"
                              callAPIAgain={() =>
                                setAppliedMapSource(selectedMapSourceId)
                              }
                              onClean={() => setAppliedMapSource([])}
                            />
                          )}
                        </>
                      )}
                      {changeIndicatorFilterFeature && (
                        <>
                          {mapDataDateRange.length === 0 && (
                            <IndicatorDropDown
                              indicator={stateWiseIndicator}
                              image={IndicatorImage}
                              indicatorValue={indicatorValue}
                              setIndicator={setStateWiseIndicator}
                            ></IndicatorDropDown>
                          )}
                        </>
                      )}
                      {dateRangeFilterFeature && (
                        <IconDateRangePicker
                          onChange={(value) => {
                            setMapDataDateRange(value);
                          }}
                          dateRange={mapDataDateRange}
                        />
                      )}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={4} sm={8} md={6}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <ChoroplethMap
                      tabsCurrentValue={mapTabsValue}
                      mapData={mapData}
                    />
                  </Box>
                </Grid>
                <Grid item xs={4} sm={8} md={6}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                    }}
                    className="state-wise-data-box-container"
                  >
                    <CardContent sx={{ pt: 0 }}>
                      <Box sx={{ width: "100%" }}>
                        {mapTabsValue === 0 && (
                          <ChoroplethMapLeads
                            stateWiseIndicator={stateWiseIndicator}
                            leadData={leadData}
                            selectedMapSourceId={selectedMapSourceId}
                          ></ChoroplethMapLeads>
                        )}

                        {mapTabsValue === 1 && (
                          <ChoropleteMapApplications
                            stateWiseIndicator={stateWiseIndicator}
                            leadData={leadData}
                            selectedMapSourceId={selectedMapSourceId}
                          ></ChoropleteMapApplications>
                        )}
                      </Box>
                    </CardContent>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default StateWisePerformance;
