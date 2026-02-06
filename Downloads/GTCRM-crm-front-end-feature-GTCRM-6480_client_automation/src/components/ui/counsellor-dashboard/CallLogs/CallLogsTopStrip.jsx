import React, { useContext, useEffect, useState } from "react";
import { DashboradDataContext } from "../../../../store/contexts/DashboardDataContext";
import { Box } from "@mui/system";
import CommonTopStrip from "../../../shared/TopStrip/CommonTopStrip";
import useToasterHook from "../../../../hooks/useToasterHook";
import { useGetCallLogsTopStripDetailsQuery } from "../../../../Redux/Slices/telephonySlice";
import GetJsonDate from "../../../../hooks/GetJsonDate";
import { useSelector } from "react-redux";
import useCommonErrorHandling from "../../../../hooks/useCommonErrorHandling";
import { handleSomethingWentWrong } from "../../../../utils/handleSomethingWentWrong";

const CallLogsTopStrip = () => {
  const [indicator, setIndicator] = useState("last_7_days");
  const [dateRange, setDateRange] = useState([]);
  const [callLogTopStripDetails, setCallLogTopStripDetails] = useState([]);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);

  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const handleError = useCommonErrorHandling();

  const { data, isFetching, isError, error, isSuccess } =
    useGetCallLogsTopStripDetailsQuery({
      indicator,
      payload: JSON.parse(GetJsonDate(dateRange)),
      collegeId,
    });
  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof data?.data === "object") {
          const details = data?.data;
          const callLogDetails = [
            {
              title: "Total Calls",
              value: details?.total_calls,
              indicatorPercentage:
                details?.total_calls_change_indicator
                  ?.total_calls_perc_indicator,
              indicaTorPosition:
                details?.total_calls_change_indicator
                  ?.total_calls_pos_indicator,
              indicatorTitle: "Total Calls",
              indicatorTooltipPosition: "right",
              chartsData: [
                {
                  plotName: "Inbound",
                  value: details?.inbound_calls,
                  color: "#008BE2",
                },
                {
                  plotName: "Outbound",
                  value: details?.outbound_calls,
                  color: "#11BED2",
                },
              ],
            },
            {
              title: "Calls Connected",
              value: details?.connected_calls,
            },
            {
              title: "Calls Greater Than 90sec",
              value: details?.call_gt_90,
              indicatorPercentage:
                details?.call_gt_90_change_indicator
                  ?.calls_gt_90_perc_indicator,
              indicaTorPosition:
                details?.call_gt_90_change_indicator?.calls_gt_90_pos_indicator,
              indicatorTitle: "Total Calls",
              indicatorTooltipPosition: "right",
            },
            {
              title: "Missed Calls",
              value: details?.missed_calls,
            },
            {
              title: "Callback Count",
              value: details?.callback_calls,
            },
          ];
          setCallLogTopStripDetails(callLogDetails);
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError: setIsInternalServerError,
          setHide: setHideHeader,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, setHideHeader, 5000);
    }
  }, [data, isError, error, isSuccess]);

  if (hideHeader) {
    return null;
  }
  return (
    <Box>
      <CommonTopStrip
        isInternalServerError={isInternalServerError}
        isSomethingWentWrong={isSomethingWentWrong}
        dateRange={dateRange}
        isFetching={isFetching}
        setDateRange={setDateRange}
        topStripDetails={callLogTopStripDetails}
        indicator={indicator}
        setIndicator={setIndicator}
      />
    </Box>
  );
};

export default CallLogsTopStrip;
