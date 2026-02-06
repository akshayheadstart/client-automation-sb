import { Box, Card, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "../../../styles/CounsellorQuickView.css";
import "../../../styles/sharedStyles.css";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import IndicatorComponent from "../admin-dashboard/IndicatorComponent";
import HorizontalCharts from "../../CustomCharts/HorizontalCharts";
import IndicatorDropDown from "../../shared/DropDownButton/IndicatorDropDown";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import { indicatorValue } from "../../../constants/LeadStageList";
import IndicatorImage from "../../../images/indicatorImage.svg";
import { useGetFollowupSummaryQuery } from "../../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
import GetJsonDate from "../../../hooks/GetJsonDate";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import useToasterHook from "../../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { useContext } from "react";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import CommonTopStrip from "../../shared/TopStrip/CommonTopStrip";

const FollowupTaskDetailsHeader = ({ sx }) => {
  const [followupSummaryDateRange, setFollowupSummaryDateRange] = useState([]);
  const [followupSummaryDetails, setFollowupSummaryDetails] = useState([]);
  const [counsellorQuickViewIndicator, setCounsellorQuickViewIndicator] =
    useState(null);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [hideFollowupHeader, setHideFollowupHeader] = useState(false);

  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();

  const theme = useTheme();
  const tabScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  useEffect(() => {
    if (followupSummaryDateRange?.length > 1) {
      const startDate = new Date(followupSummaryDateRange[0]);
      const endDate = new Date(followupSummaryDateRange[1]);
      setStartDateRange(startDate.toDateString());
      setEndDateRange(endDate.toDateString());
    }
  }, [followupSummaryDateRange]);

  const { isSuccess, isError, error, data, isFetching } =
    useGetFollowupSummaryQuery({
      collegeId: collegeId,
      indicatorValue: counsellorQuickViewIndicator,
      payload: followupSummaryDateRange?.length
        ? GetJsonDate(followupSummaryDateRange)
        : {},
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof data === "object") {
          const followupSummary = data?.data;
          const quickViewData = [
            {
              title: "Total Follow-ups",
              value: followupSummary?.total_followups || 0,
              indicatorPercentage: followupSummary?.total_followups_perc,
              indicaTorPosition: followupSummary?.total_followups_pos,
              indicatorTitle: "Total Follow-ups",
              indicatorTooltipPosition: "right",
            },
            {
              title: "Todays Follow-ups",
              value: followupSummary?.today_followups || 0,
            },
            {
              title: "Upcoming Follow-ups",
              value: followupSummary?.upcoming_followups || 0,
            },
            {
              title: "Completed Follow-ups",
              value: followupSummary?.completed_followups || 0,
            },
            {
              title: "Overdue Follow-ups",
              value: followupSummary?.overdue_followups,
            },
          ];

          setFollowupSummaryDetails(quickViewData);
        } else {
          throw new Error("Followup details summary API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setIsInternalServerError,
            setHideFollowupHeader,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setIsSomethingWentWrong,
        setHideFollowupHeader,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error, data]);

  if (hideFollowupHeader) {
    return null;
  }
  return (
    <Box sx={sx}>
      <CommonTopStrip
        isInternalServerError={isInternalServerError}
        isSomethingWentWrong={isSomethingWentWrong}
        dateRange={followupSummaryDateRange}
        isFetching={isFetching}
        setDateRange={setFollowupSummaryDateRange}
        topStripDetails={followupSummaryDetails}
        indicator={counsellorQuickViewIndicator}
        setIndicator={setCounsellorQuickViewIndicator}
      />
    </Box>
  );
};

export default FollowupTaskDetailsHeader;
