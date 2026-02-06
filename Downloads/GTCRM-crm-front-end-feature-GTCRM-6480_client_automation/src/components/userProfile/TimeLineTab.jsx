import {
  Box,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import TimeLine from "./TimeLine";
import "../../styles/timeLineTab.css";
import TabularFilterComponent from "./TabularFilterComponent";
import BaseNotFoundLottieLoader from "../shared/Loader/BaseNotFoundLottieLoader";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { SelectPicker } from 'rsuite';
import { timeLineAction } from "../../constants/LeadStageList";
import IconDateRangePicker from "../shared/filters/IconDateRangePicker";
import DateRangeShowcase from "../shared/CalendarTimeData/DateRangeShowcase";
import { getDateMonthYear } from "../../hooks/getDayMonthYear";
import { Toggle } from 'rsuite';
import '../../styles/sharedStyles.css'
import EmailTemplateDialogUserProfile from "../EmailTemplateDialogUserProfile/EmailTemplateDialogUserProfile";
import LeefLottieAnimationLoader from "../shared/Loader/LeefLottieAnimationLoader";

const TimeLineTab = (props) => {
  const [openFilter, setFilterOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState("");
  const [startingDate, setStartingDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  //getting data form context
  const {
    apiResponseChangeMessage
  } = useContext(DashboradDataContext);


  const handleFilterClose = () => {
    setFilterOpen(false);
    setSelectedIndex("");
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  
const [startDateRange, setStartDateRange] = useState("");
const [endDateRange, setEndDateRange] = useState("");
useEffect(()=>{
  if (props?.timelineDateRange?.length > 1) {
    setStartDateRange(getDateMonthYear(props?.timelineDateRange[0]));
    setEndDateRange(getDateMonthYear(props?.timelineDateRange[1]));
  }
},[props?.timelineDateRange])
const [openEmailTemplate, setOpenEmailTemplate] = React.useState(false);
  const handleClickEmailTemplateOpen = () => {
    setOpenEmailTemplate(true);
  };

  const handleEmailTemplateClose = () => {
    setOpenEmailTemplate(false);
  };
  const[selectedEmailTemplateId,setSelectedEmailTemplateId]=useState({})
  return (
    <>

    <Box sx={{ pl: 2, pr: 2, pt: 0.5}} className='time-line-tab-box-container'>
      {
        props?.timelineDateRange?.length > 1 &&
      <Box sx={{position:'relative',my:props?.timelineDateRange.length>1?2:0}}>
      {props?.timelineDateRange?.length > 1 && (
        <DateRangeShowcase
          startDateRange={startDateRange}
          endDateRange={endDateRange}
          triggeredFunction={() => {props?.setTimelineDateRange([]);props?.setUserProfileTimelineData([])}}
        ></DateRangeShowcase>
      )}
      </Box>
      }
      <Box sx={{ pb: 0.5,mt:props?.timelineDateRange?.length>1?5:2,mx:1, }} id="time-line-tab-top-section">
        <Box sx={{display:'flex',gap:"10px"}}>
      <SelectPicker data={timeLineAction} searchable={false} style={{ width: 120 }} placeholder='Action' onChange={(value)=>{
        props?.setFilterAction(value)
        props?.setUserProfileTimelineData([])
      }} />
      <IconDateRangePicker
              onChange={(value) => {
                props?.setTimelineDateRange(value);
                props?.setUserProfileTimelineData([])
              }}
              dateRange={props?.timelineDateRange}
            />
        </Box>
        <Box id="time-line-tab-action-and-filter">
          <Typography className="show-timeline-merge-text">Show Merged Details</Typography>
          <Toggle />
        </Box>
      </Box>
      {
         props?.isFetchingTimeLine?
         <Box
         className="leef-lottie-animation-box"
         data-testid="loading-animation-container"
       >
         {" "}
         <LeefLottieAnimationLoader
           height={150}
           width={150}
         ></LeefLottieAnimationLoader>{" "}
       </Box>
       :
       <>
      {props?.timelineInternalServerError || props?.somethingWentWrongInTimeline ? <Box>
        {props?.timelineInternalServerError && <Error500Animation height={400} width={400}></Error500Animation>}
        {props?.somethingWentWrongInTimeline && <ErrorFallback error={apiResponseChangeMessage} resetErrorBoundary={() => window.location.reload()} />}
      </Box> :
        <Box sx={{ display: props?.hideTimeline ? "none" : "block" }}>
          {props?.timeLineData?.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                minHeight: "350px",
                alignItems: "center",
              }}
            >
              <BaseNotFoundLottieLoader height={250} width={250}></BaseNotFoundLottieLoader>
            </Box>
          ) : (
            <Box className='vertical-scrollbar' sx={{backgroundColor:'rgba(255, 255, 255, 1)',mt:4,height:'440px',overflowY:'scroll'}}>
            <TimeLine toggle={true} timeLineData={props?.timeLineData}
            showEmailTemplateButton={true}
            handleClickEmailTemplateOpen={handleClickEmailTemplateOpen}
            setSelectedEmailTemplateId=
            {setSelectedEmailTemplateId}
            clickEvent={true}
            ></TimeLine>
            </Box>
          )}
        </Box>}
       </>
      }
      <TabularFilterComponent
        openFilter={openFilter}
        handleFilterClose={handleFilterClose}
        selectedIndex={selectedIndex}
        handleListItemClick={handleListItemClick}
        startingDate={startingDate}
        setStartingDate={setStartingDate}
        endDate={endDate}
        setEndDate={setEndDate}
      ></TabularFilterComponent>
      {
        openEmailTemplate && 
        <EmailTemplateDialogUserProfile
        handleEmailTemplateClose={handleEmailTemplateClose}
        openEmailTemplate={openEmailTemplate}
        selectedEmailTemplateId={selectedEmailTemplateId}
        />
      }
    </Box>
    </>
  );
};

export default TimeLineTab;
