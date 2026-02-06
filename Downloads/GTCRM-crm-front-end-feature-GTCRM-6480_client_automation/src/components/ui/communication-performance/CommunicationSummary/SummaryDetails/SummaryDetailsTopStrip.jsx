import React, { useContext, useEffect, useState } from "react";
import CommonTopStrip from "../../../../shared/TopStrip/CommonTopStrip";
import { Box } from "@mui/material";
import { DashboradDataContext } from "../../../../../store/contexts/DashboardDataContext";
import { useSelector } from "react-redux";
import useCommonErrorHandling from "../../../../../hooks/useCommonErrorHandling";
import GetJsonDate from "../../../../../hooks/GetJsonDate";
import { useGetCommunicationSummaryTopStripDetailsQuery } from "../../../../../Redux/Slices/telephonySlice";
import { handleSomethingWentWrong } from "../../../../../utils/handleSomethingWentWrong";

const SummaryDetailsTopStrip = () => {
  const [indicator, setIndicator] = useState("last_7_days");
  const [dateRange, setDateRange] = useState([]);
  const [
    communicationSummaryTopStripDetails,
    setCommunicationSummaryTopStripDetails,
  ] = useState([]);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);

  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const handleError = useCommonErrorHandling();

  const { data, isFetching, isError, error, isSuccess } =
    useGetCommunicationSummaryTopStripDetailsQuery({
      indicator,
      payload: JSON.parse(GetJsonDate(dateRange)),
      collegeId,
    });
  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof data?.data === "object") {
          const details = data?.data;
          const summaryDetails = [
            {
              title: "Communications Sent",
              value: details?.total_communication || 0,
              indicatorPercentage:
                details?.total_communication_change_indicator
                  ?.total_communication_perc_indicator,
              indicaTorPosition:
                details?.total_communication_change_indicator
                  ?.total_communication_pos_indicator,
              indicatorTitle: "Communications Sent",
              indicatorTooltipPosition: "right",
            },
            {
              title: "Email Sent",
              value: details?.email?.total_email || 0,
              chartsData: [
                {
                  plotName: "Automated",
                  value: details?.email?.email_type?.automated,
                  color: "#008BE2",
                },
                {
                  plotName: "Manual",
                  value: details?.email?.email_type?.manual,
                  color: "#11BED2",
                },
              ],
            },
            {
              title: "SMS Sent",
              value: details?.sms?.total_sms || 0,
              chartsData: [
                {
                  plotName: "Automated",
                  value: details?.sms?.sms_type?.automated,
                  color: "#008BE2",
                },
                {
                  plotName: "Manual",
                  value: details?.sms?.sms_type?.manual,
                  color: "#11BED2",
                },
              ],
            },
            {
              title: "Whatsapp Sent",
              value: details?.whatsapp?.total_whatsapp || 0,
              chartsData: [
                {
                  plotName: "Automated",
                  value: details?.whatsapp?.whatsapp_type?.automated,
                  color: "#008BE2",
                },
                {
                  plotName: "Manual",
                  value: details?.whatsapp?.whatsapp_type?.manual,
                  color: "#11BED2",
                },
              ],
            },
          ];
          setCommunicationSummaryTopStripDetails(summaryDetails);
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
    <Box sx={{ mt: 3 }}>
      <CommonTopStrip
        isInternalServerError={isInternalServerError}
        isSomethingWentWrong={isSomethingWentWrong}
        dateRange={dateRange}
        isFetching={isFetching}
        setDateRange={setDateRange}
        topStripDetails={communicationSummaryTopStripDetails}
        indicator={indicator}
        setIndicator={setIndicator}
      />
    </Box>
  );
};

export default SummaryDetailsTopStrip;
