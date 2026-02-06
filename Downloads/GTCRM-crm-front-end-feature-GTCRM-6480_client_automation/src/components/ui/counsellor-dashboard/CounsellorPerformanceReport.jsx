import { Box, Card, Typography } from "@mui/material";
import downloadIcon from "../../../icons/download-icon.svg";
import CounsellorPerformanceBlock from "./CounsellorPerformanceBlock";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import React, { useContext, useEffect, useState } from "react";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import "../../../styles/CounsellorPerformanceReport.css";
import GetJsonDate from "../../../hooks/GetJsonDate";
import { startAndEndDateSelect } from "../../../utils/adminDashboardDateRangeSelect";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import { useGetCounsellorPerformanceDetailsQuery } from "../../../Redux/Slices/adminDashboardSlice";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import useCommonErrorHandling from "../../../hooks/useCommonErrorHandling";
import { useSelector } from "react-redux";

const CounsellorPerformanceReport = ({
  handleDownloadFile,
  collegeId,
  setSomethingWentWrong,
  setInternalServerError,
  selectedSeason,
  isScrolledPerformanceReport,
  setHidePerformanceReport,
}) => {
  const [counsellorPerformanceDate, setCounsellorPerformanceDate] = useState(
    []
  );

  const [performanceReport, setPerformanceReport] = useState([]);

  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);
  const handleError = useCommonErrorHandling();

  const { data, isSuccess, isError, error, isFetching } =
    useGetCounsellorPerformanceDetailsQuery(
      {
        collegeId,
        payload:
          counsellorPerformanceDate?.length >= 1
            ? JSON.stringify({
                date_range: JSON.parse(GetJsonDate(counsellorPerformanceDate)),
              })
            : null,
      },
      {
        skip:
          collegeId?.length > 0 && isScrolledPerformanceReport ? false : true,
      }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof data === "object") {
          const performanceReportData = data;
          const performanceReportFormattedDetails = [
            {
              name: "Application Submitted",
              value: performanceReportData?.application_submitted,
            },
            {
              name: "Paid Applications",
              value: performanceReportData?.paid_application,
            },
            {
              name: "Payment Initiated",
              value: performanceReportData?.payment_initiated,
            },
            {
              name: "Form Initiated",
              value: performanceReportData?.form_initiated,
            },
            {
              name: "Verified Leads",
              value: performanceReportData?.verified_leads,
            },
            {
              name: "Call Quality Score (%)",
              value: performanceReportData?.call_quality_score,
            },
            {
              name: "Pending Follow-ups",
              value: performanceReportData?.total_pending_followup,
            },
            {
              name: "Average Call Duration",
              value: performanceReportData?.avr_call_duration,
            },
            {
              name: "Avg. No. of Call/Day",
              value: performanceReportData?.avr_call_day,
            },
          ];
          setPerformanceReport(performanceReportFormattedDetails);
        } else {
          throw new Error(
            "Counsellor performance API response has been changed"
          );
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError: setInternalServerError,
          setHide: setHidePerformanceReport,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrong,
        setHidePerformanceReport,
        5000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, isSuccess]);

  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");

  useEffect(() => {
    if (counsellorPerformanceDate?.length > 1) {
      setStartDateRange(getDateMonthYear(counsellorPerformanceDate[0]));
      setEndDateRange(getDateMonthYear(counsellorPerformanceDate[1]));
    } else if (selectedSeason) {
      startAndEndDateSelect(selectedSeason, setStartDateRange, setEndDateRange);
    }
  }, [counsellorPerformanceDate, selectedSeason]);

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["c2a62998"]?.features?.["4406dd1f"]
        ?.features
    );
  }, [permissions]);

  return (
    <Box className="counsellor-performance-report-box">
      {counsellorPerformanceDate?.length > 1 && (
        <DateRangeShowcase
          startDateRange={startDateRange}
          endDateRange={endDateRange}
          triggeredFunction={() => setCounsellorPerformanceDate([])}
        ></DateRangeShowcase>
      )}
      {isFetching ? (
        <Card className="loader-wrapper">
          <LeefLottieAnimationLoader
            height={100}
            width={150}
          ></LeefLottieAnimationLoader>{" "}
        </Card>
      ) : (
        <>
          <Box className="counsellor-performance-report-header">
            <Box className="title-box-hover">
              <Typography className="counsellor-performance-report-title">
                Performance Report
              </Typography>
              <Typography className="top-section-date">
                {startDateRange} - {endDateRange}
              </Typography>
            </Box>
            <Box className="counsellor-performance-report-icon-box">
              {features?.["5c193ebf"]?.visibility && (
                <IconDateRangePicker
                  onChange={(value) => {
                    setCounsellorPerformanceDate(value);
                  }}
                  dateRange={counsellorPerformanceDate}
                />
              )}
              {features?.["bd8178f3"]?.visibility && (
                <Box
                  sx={{ cursor: "pointer", width: "35px", height: "35px" }}
                  onClick={() =>
                    handleDownloadFile(
                      `${
                        import.meta.env.VITE_API_BASE_URL
                      }/counselor/counselor_performance_download?college_id=${collegeId}`,
                      counsellorPerformanceDate?.length >= 1
                        ? JSON.stringify({
                            date_range: JSON.parse(
                              GetJsonDate(counsellorPerformanceDate)
                            ),
                          })
                        : null,
                      "Performance report",
                      setSomethingWentWrong,
                      setInternalServerError
                    )
                  }
                >
                  <img src={downloadIcon} alt="download-icon" width="100%" />
                </Box>
              )}
            </Box>
          </Box>
          <Box sx={{ p: 1 }}>
            {performanceReport?.map((report) => (
              <CounsellorPerformanceBlock
                fieldName={report?.name}
                fieldValue={report?.value}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default React.memo(CounsellorPerformanceReport);
