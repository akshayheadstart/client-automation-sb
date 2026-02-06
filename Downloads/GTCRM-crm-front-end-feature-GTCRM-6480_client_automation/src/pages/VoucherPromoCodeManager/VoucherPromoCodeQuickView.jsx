import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import DateRangeShowcase from "../../components/shared/CalendarTimeData/DateRangeShowcase";
import { getDateMonthYear } from "../../hooks/getDayMonthYear";
import IndicatorComponent from "../../components/ui/admin-dashboard/IndicatorComponent";
import HorizontalCharts from "../../components/CustomCharts/HorizontalCharts";
import IndicatorDropDown from "../../components/shared/DropDownButton/IndicatorDropDown";
import IconDateRangePicker from "../../components/shared/filters/IconDateRangePicker";
import { SelectPicker } from "rsuite";
import IndicatorImage from "../../images/indicatorImage.svg";
import {
  indicatorValue,
  voucherPromoCodeStage,
} from "../../constants/LeadStageList";
import "../../styles/CampaignManager.css";
import "../../styles/sharedStyles.css";
import "../../styles/voucherPromocodeManager.css";
const VoucherPromoCodeQuickView = ({
  headerDetailsData,
  voucherPromoCodeDate,
  setVoucherPromoCodeDate,
  setVoucherPromoCodeIndicator,
  voucherPromoCodeIndicator,
}) => {
  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  const [voucherPromoCodeQuickViewData, setVoucherPromoCodeQuickViewData] =
    useState([]);
  const [leadType, setLeadType] = useState("promocode");
  useEffect(() => {
    // three month back date calculation
    if (voucherPromoCodeDate?.length > 1) {
      setStartDateRange(getDateMonthYear(voucherPromoCodeDate[0]));
      setEndDateRange(getDateMonthYear(voucherPromoCodeDate[1]));
    }
    setVoucherPromoCodeQuickViewData([
      {
        title: "Total Applied",
        value: headerDetailsData?.total_applied,
        indicatorPercentage: headerDetailsData?.total_applied_perc,
        indicaTorPosition: headerDetailsData?.total_applied_position,
        indicatorTitle: `Total Applied`,
        indicatorTooltipPosition: "right",
        chartsData: [
          {
            plotName: "Voucher",
            value: headerDetailsData?.total_voucher_applied,
            color: "#008BE2",
          },
          {
            plotName: "PromoCode",
            value: headerDetailsData?.total_promocode_applied,
            color: "#0FABBD",
          },
        ],
      },
      {
        title: "Promocode Estimated Cost",
        value: headerDetailsData?.estimated_promocode_cost,
        indicatorPercentage: headerDetailsData?.estimated_promocode_cost_perc,
        indicaTorPosition: headerDetailsData?.estimated_promocode_cost_position,
        indicatorTitle: "Promocode Estimated Cost",
        indicatorTooltipPosition: "right",
        // navigate: "/lead-manager",
        // navigateState: {
        //   admin_dashboard: true,
        // },
      },
      {
        title: "Voucher Estimated Revenue",
        value: `${
          headerDetailsData?.estimated_voucher_cost
            ? headerDetailsData?.estimated_voucher_cost
            : "0"
        }`,
        indicatorPercentage: headerDetailsData?.estimated_voucher_cost_perc,
        indicaTorPosition: headerDetailsData?.estimated_voucher_cost_position,
        indicatorTitle: "Voucher Estimated Revenue",
        indicatorTooltipPosition: "right",
      },
      {
        title: "Total Unused",
        value:
          leadType === "promocode"
            ? headerDetailsData?.unused_promocode
            : headerDetailsData?.unused_vouchers,
        indicatorPercentage: 10,
        indicaTorPosition: "equal",
        indicatorTitle: "Total Unused",
        indicatorTooltipPosition: "top",
      },
    ]);
  }, [headerDetailsData, voucherPromoCodeDate, leadType]);
  return (
    <Box className="voucher-promoCode-manager-dashboard-box" sx={{ mt: 1 }}>
      {voucherPromoCodeDate?.length > 1 && (
        <DateRangeShowcase
          startDateRange={startDateRange}
          endDateRange={endDateRange}
          triggeredFunction={() => setVoucherPromoCodeDate([])}
        ></DateRangeShowcase>
      )}
      <Box sx={{ p: 0 }} className="score-board-card-content">
        <Box className="score-board-card-content-inside">
          <Box sx={{ px: 0, pt: 0 }} className="scoreboard-list-wrapper">
            {voucherPromoCodeQuickViewData?.map((data, index) => (
              <>
                <Box className={"campaign-quick-header-box"}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "10px",
                      flexDirection: "column",
                    }}
                  >
                    <Typography className="voucher-promoCode-title-design">
                      {data?.title}
                    </Typography>
                    {index === 3 && (
                      <Box
                        sx={{ ml: "-10px", mt: "-10px" }}
                        className="scoreboard-picker-box"
                      >
                        <SelectPicker
                          data={voucherPromoCodeStage}
                          appearance="subtle"
                          value={leadType}
                          cleanable={false}
                          menuClassName="paid-calculation"
                          onChange={setLeadType}
                          searchable={false}
                        />
                      </Box>
                    )}
                  </Box>
                  <Box className={"scoreboard"}>
                    <Box className="indicator-text-box">
                      <Typography
                        color="#333333"
                        //   onClick={() => {
                        //     if (data?.navigate && hyperLinkPermission) {
                        //       navigate(data?.navigate, {
                        //         state: data?.navigateState,
                        //       });
                        //     }
                        //   }}
                        className="scoreboard-value-text"
                        mr={0.5}
                      >
                        {data?.value ? data?.value : 0}
                      </Typography>
                      {(index === 0 || index === 2 || index === 1) && (
                        <IndicatorComponent
                          indicator={voucherPromoCodeIndicator}
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
                      )}
                    </Box>
                  </Box>
                  {index === 0 && (
                    <Box
                      className="interview-list-vertical-representation"
                      sx={{ display: data?.value ? "block" : "none" }}
                    >
                      <HorizontalCharts
                        data={data?.chartsData}
                      ></HorizontalCharts>
                    </Box>
                  )}
                </Box>
                {index === voucherPromoCodeQuickViewData.length - 1 || (
                  <Box className="scoreboard-header-vertical-line"></Box>
                )}
              </>
            ))}
          </Box>
          <Box className="scoreboard-filter-box">
            <IconDateRangePicker
              onChange={(value) => {
                setVoucherPromoCodeDate(value);
              }}
              dateRange={voucherPromoCodeDate}
            />
            {voucherPromoCodeDate.length === 0 && (
              <IndicatorDropDown
                indicator={voucherPromoCodeIndicator}
                image={IndicatorImage}
                indicatorValue={indicatorValue}
                setIndicator={setVoucherPromoCodeIndicator}
                position={"bottomEnd"}
              ></IndicatorDropDown>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VoucherPromoCodeQuickView;
