import React, { useContext, useEffect, useState } from "react";
import IndicatorDropDown from "../../../shared/DropDownButton/IndicatorDropDown";
import { Card, Typography } from "@mui/material";
import IndicatorImage from "../../../../images/indicatorImage.svg";
import { Box } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DashboradDataContext } from "../../../../store/contexts/DashboardDataContext";
import LeefLottieAnimationLoader from "../../../shared/Loader/LeefLottieAnimationLoader";
import DateRangeShowcase from "../../../shared/CalendarTimeData/DateRangeShowcase";
import { getDateMonthYear } from "../../../../hooks/getDayMonthYear";
import IconDateRangePicker from "../../../shared/filters/IconDateRangePicker";
import { indicatorValue } from "../../../../constants/LeadStageList";
import IndicatorComponent from "../../admin-dashboard/IndicatorComponent";
import "../../../../styles/DataSegmentQuickView.css";
import { useGetMissedCallDetailsTopStripDataQuery } from "../../../../Redux/Slices/telephonySlice";
import GetJsonDate from "../../../../hooks/GetJsonDate";
import { useSelector } from "react-redux";
import useToasterHook from "../../../../hooks/useToasterHook";
import { handleInternalServerError } from "../../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../../utils/handleSomethingWentWrong";
import ErrorAndSomethingWentWrong from "../../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";

const MissedCallDashboardHeader = () => {
  const [dateRange, setDateRange] = useState([]);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [callingSummary, setCallingSummary] = useState([]);
  const [indicator, setIndicator] = useState("last_7_days");
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const theme = useTheme();
  const mediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const pushNotification = useToasterHook();

  const { data, error, isError, isSuccess, isFetching } =
    useGetMissedCallDetailsTopStripDataQuery({
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
              title: "Total Missed Calls",
              value: data?.data?.total_missed_calls,
              indicatorPercentage:
                data?.data?.total_calls_change_indicator
                  ?.total_missed_calls_perc_indicator,
              indicaTorPosition:
                data?.data?.total_calls_change_indicator
                  ?.total_missed_calls_pos_indicator,
              indicatorTitle: "Total Missed Calls",
              indicatorTooltipPosition: "right",
            },
            {
              title: "Converted to Lead",
              value: `${data?.data?.converted_to_lead_percentage}%`,
            },
            {
              title: "Converted Paid Application",
              value: `${data?.data?.converted_to_paid_application_percentage}%`,
            },
            {
              title: "Responded Calls",
              value: data?.data?.total_responded_calls,
            },
            {
              title: "Interested Percentage",
              value: `${data?.data?.interested_percentage}%`,
            },
          ];

          setCallingSummary(callSummaryData);
        } else {
          throw new Error(
            "Missed Call summary header API response has changed"
          );
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
            setHideHeader,
            5000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, setHideHeader, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error, data]);

  return (
    <Card
      className="common-box-shadow"
      sx={{
        my: 3,
        py: 3,
        px: 4,
        borderRadius: 2.5,
        overflow: "visible",
        position: "relative",
        display: hideHeader ? "none" : "block",
        border: "1px solid #008BE2",
      }}
    >
      {isInternalServerError || isSomethingWentWrong ? (
        <ErrorAndSomethingWentWrong
          containerHeight="25vh"
          isInternalServerError={isInternalServerError}
          isSomethingWentWrong={isSomethingWentWrong}
        />
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
                  gap: { md: "3rem !important", sm: "1rem" },
                }}
                className="segment-details-summary-header"
              >
                {callingSummary?.map((details, index) => (
                  <>
                    <Box sx={{ flex: 10 }}>
                      <Typography className="top-stripe-header-title">
                        {details.title}
                      </Typography>
                      <Box className="indicator-text-box">
                        <Typography
                          sx={{ mr: 0.5 }}
                          className="top-stripe-header-count"
                        >
                          {details.value}
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
                  {
                    dateRange?.length === 0 &&
                  <IndicatorDropDown
                    indicator={indicator}
                    image={IndicatorImage}
                    indicatorValue={indicatorValue}
                    setIndicator={setIndicator}
                    position={"bottomEnd"}
                  ></IndicatorDropDown>
                  }
                </Box>
              </Box>
            </>
          )}
        </>
      )}
    </Card>
  );
};

export default MissedCallDashboardHeader;
