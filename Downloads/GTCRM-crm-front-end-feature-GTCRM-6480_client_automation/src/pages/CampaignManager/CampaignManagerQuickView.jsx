/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography } from '@mui/material';
import React from 'react';
import "../../styles/sharedStyles.css";
import { useState } from 'react';
import { useEffect } from 'react';
import { getDateMonthYear } from '../../hooks/getDayMonthYear';
import DateRangeShowcase from '../../components/shared/CalendarTimeData/DateRangeShowcase';
import { SelectPicker } from 'rsuite';
import { campaignStages, indicatorValue } from '../../constants/LeadStageList';
import IndicatorComponent from '../../components/ui/admin-dashboard/IndicatorComponent';
import HorizontalCharts from '../../components/CustomCharts/HorizontalCharts';
import IconDateRangePicker from '../../components/shared/filters/IconDateRangePicker';
import IndicatorImage from "../../images/indicatorImage.svg";
import IndicatorDropDown from '../../components/shared/DropDownButton/IndicatorDropDown';
import '../../styles/CampaignManager.css'

const CampaignManagerQuickView = ({campaignIndicator,setCampaignIndicator,setCampaignDate,campaignDate,setLeadType,leadType,headerDetailsData}) => {
    const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  const [campaignQuickViewData, setCampaignQuickViewData] = useState([]);

  useEffect(() => {
    // three month back date calculation
    if (campaignDate?.length > 1) {
      setStartDateRange(getDateMonthYear(campaignDate[0]));
      setEndDateRange(getDateMonthYear(campaignDate[1]));
    }
    setCampaignQuickViewData([
      {
        title: "Leads",
        value: headerDetailsData?.total_leads,
        indicatorPercentage: headerDetailsData?.lead_percentage,
        indicaTorPosition: headerDetailsData?.lead_position,
        indicatorTitle: `Leads`,
        indicatorTooltipPosition: "right",
        chartsData: [
            {
              plotName: "Primary",
              value: headerDetailsData?.primary_leads,
              color: "#008BE2",
            },
            {
              plotName: "Secondary",
              value: headerDetailsData?.secondary_leads,
              color: "#0FABBD",
            },
            {
              plotName: "Tertiary",
              value: headerDetailsData?.tertiary_leads,
              color: "#00465F",
            },
          ],
      },
      {
        title: "Verified Leads",
        value: headerDetailsData?.verified_leads ,
        indicatorPercentage: headerDetailsData?.verified_percentage,
        indicaTorPosition: headerDetailsData?.verified_position,
        indicatorTitle: "Verified Leads",
        indicatorTooltipPosition: "right",
        navigate: "/lead-manager",
        navigateState: {
          admin_dashboard: true,
        },
      },
      {
        title: "Lead Verification Rate",
        value: `${headerDetailsData?.verified_lead_percentage?headerDetailsData?.verified_lead_percentage:'0'}%`,
        indicatorPercentage: headerDetailsData?.verified_percentage,
        indicaTorPosition: headerDetailsData?.verified_position,
        indicatorTitle: "Lead Verification Rate",
        indicatorTooltipPosition: "right",
        
      },
      {
        title: "Total Applications",
        value: headerDetailsData?.total_application,
        indicatorPercentage: 10,
        indicaTorPosition: 'equal',
        indicatorTitle: "Total Applications",
        indicatorTooltipPosition: "top",
      },
      {
        title: "Lead to Application Conversion Rate",
        value: `${headerDetailsData?.paid_application?headerDetailsData?.paid_application:'0'}%`,
        indicatorPercentage: headerDetailsData?.paid_application_percentage,
        indicaTorPosition: headerDetailsData?.paid_position,
        indicatorTitle: "Lead to Application Conversion Rate",
        indicatorTooltipPosition: "top",
      },
    ]);
  }, [headerDetailsData]);
    return (
        <Box className="campaign-manager-dashboard-box" sx={{ mt: 1 }}>
        {campaignDate?.length > 1 && (
          <DateRangeShowcase
            startDateRange={startDateRange}
            endDateRange={endDateRange}
            triggeredFunction={() => setCampaignDate([])}
          ></DateRangeShowcase>
        )}
        <Box sx={{ p: 0 }} className="score-board-card-content">
          <Box className="score-board-card-content-inside">
            <Box sx={{ px: 0, pt: 0}} className="scoreboard-list-wrapper">
              {campaignQuickViewData?.map((data, index) => (
                <>
                  <Box className={ "campaign-quick-header-box"}>
                    <Box sx={{display:'flex',gap:'10px',alignItems:'center'}}>
                    <Typography className="scoreboard-title-design"
                    //  sx={{width:(data?.title ==='Verified Leads'||data?.title ==='Total Applications')?'100px':data?.title==='Leads'?'50px':'150px'}}
                    >
                      {data?.title}
                    </Typography>
                    {index === 0 && (
                      <Box sx={{ ml: '-5px' }} className="scoreboard-picker-box">
                        <SelectPicker
                          data={campaignStages}
                          appearance="subtle"
                          value={leadType}
                          cleanable={false}
                          menuClassName="paid-calculation"
                          onChange={setLeadType}
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
                        {
                            (index===0 || index ===2||index ===4)&&
                        <IndicatorComponent
                        //   indicator={scoreBoardIndicator}
                          indicator={campaignIndicator}
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
                        }
                      </Box>
                    </Box>
                    {index === 0 && (
                      <Box className="interview-list-vertical-representation" sx={{display:data?.value?'block':'none'}}>
                        <HorizontalCharts
                          data={data?.chartsData}
                        ></HorizontalCharts>
                      </Box>
                    )}
                  </Box>
                  {index === campaignQuickViewData.length - 1 || (
                    <Box className="scoreboard-header-vertical-line"></Box>
                  )}
                </>
              ))}
            </Box>
            <Box className="scoreboard-filter-box">
              {
                campaignDate.length===0&&
              <IndicatorDropDown
                // indicator={scoreBoardIndicator}
                indicator={null}
                image={IndicatorImage}
                indicatorValue={indicatorValue}
                setIndicator={setCampaignIndicator}
                position={"bottomEnd"}
              ></IndicatorDropDown>
              }
  
              <IconDateRangePicker
                onChange={(value) => {
                    setCampaignDate(value);
                }}
                dateRange={campaignDate}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    );
};

export default CampaignManagerQuickView;