import { Box, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import "../../styles/communicationLog.css";
import TimeLine from "./TimeLine";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconDateRangePicker from "../shared/filters/IconDateRangePicker";
import CustomTabs from "../shared/tab-panel/CustomTabs";
import LeefLottieAnimationLoader from "../shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../shared/Loader/BaseNotFoundLottieLoader";
import { getDateMonthYear } from "../../hooks/getDayMonthYear";
import DateRangeShowcase from "../shared/CalendarTimeData/DateRangeShowcase";
import { useMemo } from "react";
import "../../styles/sharedStyles.css";
const CommunicationLog = ({
  communicationData,
  communicationsLogsInternalServerError,
  hideCommunicationsLogs,
  somethingWentWrongInCommunicationLogs,
  communicationTabValue,
  setCommunicationTabValue,
  loadingCommunicationsLogs,
  communicationLogsDate,
  setCommunicationLogsDate,
}) => {
  //getting data form context
  const { apiResponseChangeMessage } = useContext(DashboradDataContext);

  const communicationTabs = ["Call Logs", "WhatsApp", "Email", "SMS"];

  const callLogsArray = useMemo(
    () => [
      { title1: "Outbound", value: communicationData?.outbound_call },
      { title1: "Inbound", value: communicationData?.inbound_call },
      {
        title1: "Outbound",
        title2: "Duration",
        value: (
          <Box>
            {communicationData?.outbound_call_duration || 0}
            <span className="communication-log-sec-text">sec</span>
          </Box>
        ),
      },
      {
        title1: "Inbound",
        title2: "Duration",
        value: (
          <Box>
            {communicationData?.inbound_call_duration || 0}
            <span className="communication-log-sec-text">sec</span>
          </Box>
        ),
      },
    ],
    [communicationData]
  );

  const whatsAppArray = useMemo(
    () => [
      { title1: "Sent", value: communicationData?.sent },
      { title1: "Delivered", value: communicationData?.delivered },
      {
        title1: "Auto Reply",
        value: (
          <Box>
            {communicationData?.auto_apply || 0}
            <span className="communication-log-sec-text">sec</span>
          </Box>
        ),
      },
      { title1: "Click Rate", value: `${communicationData?.click_rate || 0}%` },
    ],
    [communicationData]
  );

  const smsArray = useMemo(
    () => [
      { title1: "Sent", value: communicationData?.sent },
      { title1: "Delivered", value: communicationData?.delivered },
    ],
    [communicationData]
  );

  const emailArray = useMemo(() => {
    return {
      tabOne: [
        { title1: "Sent", value: communicationData?.sent },
        { title1: "Delivered", value: communicationData?.delivered },
        {
          title1: "Click Rate",
          value: `${communicationData?.click_rate || 0}%`,
        },
        {
          title1: "Delivered Rate",
          value: `${communicationData?.delivered_rate || 0}%`,
        },
      ],
      tabTwo: [
        { title1: "Open Rate", value: `${communicationData?.open_rate || 0}%` },
        {
          title1: "Bounce Rate",
          value: `${communicationData?.bounce_rate || 0}%`,
        },
        {
          title1: "Complaint Rate",
          value: `${communicationData?.complaint_rate || 0}%`,
        },
        {
          title1: "Unsubscribe Rate",
          value: `${communicationData?.unsubscribe_rate || 0}%`,
        },
      ],
    };
  }, [communicationData]);

  const [communicationDataArray, setCommunicationDataArray] =
    useState(callLogsArray);

  const [emailTabNo, setEmailTabNo] = useState(2);

  useEffect(() => {
    if (communicationTabValue === 0) {
      setCommunicationDataArray(callLogsArray);
    }
    if (communicationTabValue === 1) {
      setCommunicationDataArray(whatsAppArray);
    }
    if (communicationTabValue === 2) {
      if (emailTabNo === 2) {
        setCommunicationDataArray(emailArray?.tabOne);
      } else {
        setCommunicationDataArray(emailArray?.tabTwo);
      }
    }
    if (communicationTabValue === 3) {
      setCommunicationDataArray(smsArray);
    }
  }, [
    callLogsArray,
    communicationTabValue,
    emailArray?.tabOne,
    emailArray?.tabTwo,
    emailTabNo,
    smsArray,
    whatsAppArray,
  ]);

  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");

  useEffect(() => {
    if (communicationLogsDate?.length > 1) {
      setStartDateRange(getDateMonthYear(communicationLogsDate[0]));
      setEndDateRange(getDateMonthYear(communicationLogsDate[1]));
    }
  }, [communicationLogsDate]);

  return (
    <>
      {communicationsLogsInternalServerError ||
      somethingWentWrongInCommunicationLogs ? (
        <Box>
          <Typography align="left" pl={2} variant="h6">
            Communication Log
          </Typography>
          {communicationsLogsInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInCommunicationLogs && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box sx={{ px: 2, display: hideCommunicationsLogs ? "none" : "block" }}>
          <Box className="communication-logs-tab-box-shadow">
          <Box className="communication-logs-tab-box">
            {communicationTabs?.map((tab, index) => (
              <Box
                onClick={() => setCommunicationTabValue(index)}
                key={tab}
                className={`${
                  index === communicationTabValue
                    ? "communication-logs-single-tab-active"
                    : "communication-logs-single-tab"
                }`}
              >
                <Typography className="communication-logs-tab-name">
                  {tab}
                </Typography>
                <ChevronRightIcon
                  className={`${
                    index === communicationTabValue
                      ? "arrow-icon-active"
                      : "arrow-icon"
                  }`}
                />
              </Box>
            ))}
          </Box>
          {loadingCommunicationsLogs ? (
            <Box className="loading-lottie-file-container">
              <LeefLottieAnimationLoader
                height={120}
                width={120}
              ></LeefLottieAnimationLoader>
            </Box>
          ) : (
            <Box>
              <Box className="communication-logs-data-box">
                {communicationLogsDate?.length > 1 && (
                  <DateRangeShowcase
                    startDateRange={startDateRange}
                    endDateRange={endDateRange}
                    triggeredFunction={() => setCommunicationLogsDate([])}
                  ></DateRangeShowcase>
                )}
                <Box className="communication-logs-data-content-inside">
                  <Box
                    sx={{ px: 2, py: 2 }}
                    className={
                      communicationTabValue === 3
                        ? "communication-logs-list-wrapper-sms"
                        : "communication-logs-list-wrapper"
                    }
                  >
                    {communicationDataArray?.map((data, index) => (
                      <>
                        <Box>
                          <Typography className="communication-logs-data-title-design">
                            {data?.title1}
                          </Typography>
                          <Typography className="communication-logs-data-title-design">
                            {data?.title2}
                          </Typography>

                          <Box>
                            <Box className="indicator-text-box">
                              <Typography color="#333333" variant="h3" mr={0.5}>
                                {data?.value ? data?.value : 0}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {index === communicationDataArray?.length - 1 || (
                          <Box className="communication-logs-list-vertical-line"></Box>
                        )}
                      </>
                    ))}
                  </Box>
                  <Box className="communication-logs-filter-box">
                    <IconDateRangePicker
                      onChange={(value) => {
                        setCommunicationLogsDate(value);
                      }}
                      dateRange={communicationLogsDate}
                    />
                  </Box>
                </Box>
                {communicationTabValue === 2 && (
                  <Box sx={{ pb: 1 }}>
                    <CustomTabs
                      tabNo={emailTabNo}
                      setTabNo={setEmailTabNo}
                    ></CustomTabs>
                  </Box>
                )}
              </Box>
              
            </Box>
          )}
          </Box>
          <Box>
            {
              loadingCommunicationsLogs ? (
                <Box className="loading-lottie-file-container">
                  <LeefLottieAnimationLoader
                    height={120}
                    width={120}
                  ></LeefLottieAnimationLoader>
                </Box>
              ):
              <>
              <Box sx={{ py: 2, px: 1 }}>
                <Typography className="communication-log-title">
                  Communication Log
                </Typography>
              </Box>

              {communicationData[
                `${
                  communicationTabValue === 0
                    ? "call_timelines"
                    : "communication_timelines"
                }`
              ]?.length > 0 ? (
                <Box className='vertical-scrollbar' sx={{backgroundColor:'rgba(255, 255, 255, 1)',mt:4,height:'200px',overflowY:'scroll'}}>
                <TimeLine
                toggle={true}
                  timeLineData={
                    communicationData[
                      `${
                        communicationTabValue === 0
                          ? "call_timelines"
                          : "communication_timelines"
                      }`
                    ]
                  }
                ></TimeLine>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "55vh",
                    alignItems: "center",
                  }}
                >
                  <BaseNotFoundLottieLoader
                    height={250}
                    width={250}
                  ></BaseNotFoundLottieLoader>
                </Box>
              )}
              </>
            }
          </Box>
        </Box>
      )}
    </>
  );
};

export default CommunicationLog;
