import React, { useContext, useEffect, useState } from "react";
import { Card, Typography } from "@mui/material";
import IndicatorImage from "../../../images/indicatorImage.svg";
import { Box } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { useSelector } from "react-redux";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import HorizontalCharts from "../../CustomCharts/HorizontalCharts";
import IndicatorComponent from "../admin-dashboard/IndicatorComponent";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import IndicatorDropDown from "../../shared/DropDownButton/IndicatorDropDown";
import {
  TelephonyFilterOptions,
  indicatorValue,
} from "../../../constants/LeadStageList";
import "../../../styles/DataSegmentQuickView.css";
import { SelectPicker } from "rsuite";
import { useGetCallDetailsTopStripDataQuery } from "../../../Redux/Slices/telephonySlice";
import GetJsonDate from "../../../hooks/GetJsonDate";
import { secondsToMMSS } from "../../../helperFunctions/telephonyHelperFunction";
import useCommonErrorHandling from "../../../hooks/useCommonErrorHandling";
const TelephonyDashboardHeader = () => {
  const [dateRange, setDateRange] = useState([]);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [callingSummary, setCallingSummary] = useState([]);
  const [indicator, setIndicator] = useState("last_7_days");
  const [callDurationValue, setCallDurationValue] = useState("value");
  const [call90SecValue, setCall90SecValue] = useState("value");
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const theme = useTheme();
  const mediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleError = useCommonErrorHandling();

  const { data, error, isError, isSuccess, isFetching } =
    useGetCallDetailsTopStripDataQuery({
      payload: JSON.parse(GetJsonDate(dateRange)),
      collegeId,
      indicatorValue: indicator,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof data?.data === "object") {
          const callSummaryData = [
            {
              title: "Total Calls",
              value: data?.data?.total_calls,
              indicatorPercentage:
                data?.data?.total_calls_change_indicator
                  ?.total_calls_perc_indicator,
              indicaTorPosition:
                data?.data?.total_calls_change_indicator
                  ?.total_calls_pos_indicator,
              indicatorTitle: "Total Calls",
              indicatorTooltipPosition: "right",
              chartsData: [
                {
                  plotName: "Inbound Calls",
                  value: data?.data?.inbound_calls,
                  color: "#008BE2",
                },
                {
                  plotName: "Outbound Calls",
                  value: data?.data?.outbound_calls,
                  color: "#11BED2",
                },
              ],
            },
            {
              title: "Call Duration",
              value: secondsToMMSS(data?.data?.total_duration || 0),
              filterOptions: TelephonyFilterOptions,
              setValue: setCallDurationValue,
              inbound: secondsToMMSS(data?.data?.inbound_duration || 0),
              outbound: secondsToMMSS(data?.data?.outbound_duration || 0),
            },
            {
              title: "Total Active Counsellors",
              value: data?.data?.active_counsellor_count,
            },
            {
              title: "Calls > 90sec",
              value: data?.data?.total_calls_gt_90_sec,
              filterOptions: TelephonyFilterOptions,
              setValue: setCall90SecValue,
              inbound: data?.data?.inbound_calls_gt_90_sec,
              outbound: data?.data?.outbound_calls_gt_90_sec,
            },
          ];

          setCallingSummary(callSummaryData);
        } else {
          throw new Error("Call summary header API response has changed");
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError,
          setHide: setHideHeader,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, setHideHeader, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, isSuccess]);

  return (
    <Card
      className="common-box-shadow"
      sx={{
        my: 3,
        py: 3,
        px: { sm: 3, md: 4 },
        borderRadius: 2.5,
        overflow: "visible",
        position: "relative",
        display: hideHeader ? "none" : "block",
        border: "1px solid #008BE2",
      }}
    >
      {isInternalServerError || isSomethingWentWrong ? (
        <Box sx={{ minHeight: "25vh" }} className="common-not-found-container">
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
          {isFetching ? (
            <>
              <Box
                sx={{ minHeight: "10vh" }}
                className="common-not-found-container"
              >
                <LeefLottieAnimationLoader
                  height={100}
                  width={100}
                ></LeefLottieAnimationLoader>
              </Box>
            </>
          ) : (
            <>
              {dateRange.length > 1 && (
                <DateRangeShowcase
                  startDateRange={getDateMonthYear(dateRange[0])}
                  endDateRange={getDateMonthYear(dateRange[1])}
                  triggeredFunction={() => setDateRange([])}
                />
              )}
              <Box
                sx={{
                  flexDirection: mediumScreen ? "column" : "row",
                  alignItems: mediumScreen ? "flex-start" : "center",
                  gap: "32px !important",
                }}
                className="segment-details-summary-header"
              >
                {callingSummary?.map((details, index) => (
                  <>
                    <Box sx={{ flex: 10, width: mediumScreen && "100%" }}>
                      {details?.filterOptions && (
                        <SelectPicker
                          data={details?.filterOptions}
                          appearance="subtle"
                          searchable={false}
                          cleanable={false}
                          className="telephony-header-filter"
                          value={
                            index === 1 ? callDurationValue : call90SecValue
                          }
                          onChange={(value) => details?.setValue(value)}
                        />
                      )}
                      <Typography className="top-stripe-header-title">
                        {details.title}
                      </Typography>
                      <Box className="indicator-text-box">
                        <Typography
                          sx={{ mr: 0.5 }}
                          className="top-stripe-header-count"
                        >
                          {index === 1
                            ? details[callDurationValue]
                            : index === 3
                            ? details[call90SecValue]
                            : details?.value}
                        </Typography>
                        {details?.indicaTorPosition && (
                          <IndicatorComponent
                            title={details.title}
                            performance={details.indicaTorPosition}
                            percentage={
                              details?.indicatorPercentage
                                ? details?.indicatorPercentage
                                : "0"
                            }
                            tooltipPosition={details?.indicatorTooltipPosition}
                            fontSize={18}
                            indicatorSize={20}
                            iconMargin={5}
                          ></IndicatorComponent>
                        )}
                      </Box>
                      {details?.chartsData?.some((data) => data?.value > 0) && (
                        <Box
                          sx={{ mt: 0 }}
                          className="interview-list-vertical-representation"
                        >
                          <HorizontalCharts
                            data={details?.chartsData}
                          ></HorizontalCharts>
                        </Box>
                      )}
                    </Box>

                    {index === callingSummary.length - 1 || mediumScreen || (
                      <Box className="top-stripe-header-vertical-line"></Box>
                    )}
                  </>
                ))}

                <Box className="segment-details-date-range">
                  <IconDateRangePicker
                    onChange={(value) => {
                      setDateRange(value);
                    }}
                    dateRange={dateRange}
                  />
                  {dateRange?.length === 0 && (
                    <IndicatorDropDown
                      indicator={indicator}
                      image={IndicatorImage}
                      indicatorValue={indicatorValue}
                      setIndicator={setIndicator}
                      position={"bottomEnd"}
                    ></IndicatorDropDown>
                  )}
                </Box>
              </Box>
            </>
          )}
        </>
      )}
    </Card>
  );
};

export default TelephonyDashboardHeader;
