import { Box, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SelectPicker } from "rsuite";
import {
  indicatorValue,
  publisherDashboardSourceList,
} from "../../../constants/LeadStageList";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import IndicatorImage from "../../../images/indicatorImage.svg";
import "../../../styles/sharedStyles.css";
import { startAndEndDateSelect } from "../../../utils/adminDashboardDateRangeSelect";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import IndicatorDropDown from "../../shared/DropDownButton/IndicatorDropDown";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import IndicatorComponent from "../admin-dashboard/IndicatorComponent";
const PublisherDashboardCard = ({
  allLeadSummary,
  isSummaryLoading,
  setPublisherApplicationType,
  publisherApplicationType,
  publisherIndicator,
  setPublisherIndicator,
  publisherQuickViewDateRange,
  setPublisherQuickViewDateRange,
  quickViewData,
}) => {
  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  const selectedSeason = useSelector(
    (state) => state.authentication.selectedSeason
  );
  useEffect(() => {
    if (publisherQuickViewDateRange?.length > 1) {
      setStartDateRange(getDateMonthYear(publisherQuickViewDateRange[0]));
      setEndDateRange(getDateMonthYear(publisherQuickViewDateRange[1]));
    } else if (selectedSeason) {
      startAndEndDateSelect(selectedSeason, setStartDateRange, setEndDateRange);
    }
  }, [publisherQuickViewDateRange, selectedSeason]);

  return (
    <>
      {isSummaryLoading ? (
        <Card className="loader-wrapper-scoreboard">
          <LeefLottieAnimationLoader height={100} width={150} />
        </Card>
      ) : (
        <>
          {allLeadSummary?.length > 0 ? (
            <Box className="shared-admin-dashboard-box" sx={{ mt: 1 }}>
              {publisherQuickViewDateRange?.length > 1 && (
                <DateRangeShowcase
                  startDateRange={startDateRange}
                  endDateRange={endDateRange}
                  triggeredFunction={() => setPublisherQuickViewDateRange([])}
                ></DateRangeShowcase>
              )}
              <Box sx={{ p: 0 }} className="score-board-card-content">
                <Box className="score-board-card-content-inside">
                  <Box
                    sx={{ px: 0, pt: 0 }}
                    className="scoreboard-list-wrapper"
                  >
                    {quickViewData?.map((data, index) => (
                      <>
                        <Box>
                          {index === 0 && (
                            <Box
                              sx={{ ml: -1.5 }}
                              className="scoreboard-picker-box"
                            >
                              <SelectPicker
                                data={publisherDashboardSourceList}
                                searchable={false}
                                defaultValue="primary"
                                appearance="subtle"
                                value={publisherApplicationType}
                                cleanable={false}
                                menuClassName="paid-calculation"
                                onChange={setPublisherApplicationType}
                              />
                            </Box>
                          )}
                          <Typography
                            className="scoreboard-title-design"
                            sx={{ width: "96px" }}
                          >
                            {data?.title}
                          </Typography>

                          <Box className={"scoreboard"}>
                            <Box className="indicator-text-box">
                              <Typography
                                color="#333333"
                                onClick={() =>
                                  data?.handleApplyFilter(
                                    data?.sourceType,
                                    data?.subHeading
                                  )
                                }
                                className="scoreboard-value-text"
                                mr={0.5}
                              >
                                {data?.value ? data?.value : 0}
                              </Typography>
                              <IndicatorComponent
                                indicator={publisherIndicator}
                                title={data?.indicatorTitle}
                                performance={data.indicaTorPosition}
                                percentage={
                                  data?.indicatorPercentage
                                    ? data?.indicatorPercentage
                                    : "0"
                                }
                                tooltipPosition={data?.indicatorTooltipPosition}
                                fontSize={17}
                                indicatorSize={20}
                                iconMargin={4}
                              ></IndicatorComponent>
                            </Box>
                          </Box>
                        </Box>

                        {index === quickViewData?.length - 1 || (
                          <Box className="scoreboard-header-vertical-line"></Box>
                        )}
                      </>
                    ))}
                  </Box>
                  <Box className="scoreboard-filter-box">
                    {publisherQuickViewDateRange?.length === 0 && (
                      <IndicatorDropDown
                        indicator={publisherIndicator}
                        image={IndicatorImage}
                        indicatorValue={indicatorValue}
                        setIndicator={setPublisherIndicator}
                        position={"bottomEnd"}
                      ></IndicatorDropDown>
                    )}

                    <IconDateRangePicker
                      onChange={(value) => {
                        setPublisherQuickViewDateRange(value);
                      }}
                      dateRange={publisherQuickViewDateRange}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                minHeight: "15vh",
                alignItems: "center",
              }}
              data-testid="not-found-animation-container"
            >
              <BaseNotFoundLottieLoader
                height={100}
                width={100}
              ></BaseNotFoundLottieLoader>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default PublisherDashboardCard;
