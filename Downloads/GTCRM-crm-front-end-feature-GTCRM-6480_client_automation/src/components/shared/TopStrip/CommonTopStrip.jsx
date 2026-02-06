import { Card, Typography } from "@mui/material";
import React from "react";
import "../../../styles/DataSegmentQuickView.css";
import IndicatorDropDown from "../DropDownButton/IndicatorDropDown";
import IconDateRangePicker from "../filters/IconDateRangePicker";
import { Box } from "@mui/system";
import IndicatorComponent from "../../ui/admin-dashboard/IndicatorComponent";
import DateRangeShowcase from "../CalendarTimeData/DateRangeShowcase";
import LeefLottieAnimationLoader from "../Loader/LeefLottieAnimationLoader";
import ErrorAndSomethingWentWrong from "../ErrorAnimation/ErrorAndSomethingWentWrong";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import HorizontalCharts from "../../CustomCharts/HorizontalCharts";
import { indicatorValue } from "../../../constants/LeadStageList";
import IndicatorImage from "../../../images/indicatorImage.svg";
const CommonTopStrip = ({
  isInternalServerError,
  isSomethingWentWrong,
  dateRange,
  isFetching,
  setDateRange,
  topStripDetails,
  indicator,
  setIndicator,
}) => {
  const theme = useTheme();
  const mediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Card className="common-box-shadow common-top-strip-container">
      {isInternalServerError || isSomethingWentWrong ? (
        <Box sx={{ minHeight: "25vh" }} className="common-not-found-container">
          <ErrorAndSomethingWentWrong
            isInternalServerError={isInternalServerError}
            isSomethingWentWrong={isSomethingWentWrong}
            containerHeight="20vh"
          />
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
                  gap: { md: "2rem !important", sm: "1rem" },
                }}
                className="segment-details-summary-header"
              >
                {topStripDetails?.map((details, index) => (
                  <>
                    <Box
                      sx={{
                        flex: details?.chartsData?.some(
                          (data) => data?.value > 0
                        )
                          ? 13
                          : 10,
                        width: "100%",
                      }}
                    >
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

                    {index === topStripDetails.length - 1 || mediumScreen || (
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

export default CommonTopStrip;
