import { Box, Card, IconButton, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AutomationIcon from "../../../icons/automation-rule-icon.svg";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useNavigate } from "react-router-dom";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { ShowDate } from "../../shared/ViewStudentList/ShowDate";
import { Divider } from "rsuite";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { useGetDataSegmentDetailsHeaderDataQuery } from "../../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
import GetJsonDate from "../../../hooks/GetJsonDate";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import useToasterHook from "../../../hooks/useToasterHook";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
function SegmentDetailsSummary({ dataSegmentId, token, setPermissionData }) {
  const [dateRange, setDateRange] = useState([]);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [segmentDetailsSummary, setSegmentDetailsSummary] = useState([]);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const { data, isError, error, isFetching, isSuccess } =
    useGetDataSegmentDetailsHeaderDataQuery({
      collegeId,
      dataSegmentId,
      token,
      payload: dateRange?.length ? JSON.parse(GetJsonDate(dateRange)) : null,
    });

  const theme = useTheme();
  const mediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const pushNotification = useToasterHook();

  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof data === "object") {
          setSegmentDetailsSummary([
            {
              segmentName: data?.data_segment_name,
              createdOn: data?.created_on,
              count: data?.initial_count,
              segmentType: data?.data_segment_type,
            },
            {
              title: "Current Data Count",
              count: data?.current_data_count,
            },
            {
              title: "Email Communication",
              count: data?.email_count,
            },
            {
              title: "SMS Communication",
              count: data?.sms_count,
            },
            {
              title: "Whatsapp Communication",
              count: data?.whatsapp_count,
            },
          ]);
        } else {
          throw new Error(
            "Data segment details header API response has changed"
          );
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
          if (error?.data?.detail === "Not enough permissions") {
            setPermissionData(true);
          }
        }
        if (error.status === 500) {
          handleInternalServerError(
            setIsInternalServerError,
            setHideHeader,
            5000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, setHideHeader, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error, data]);

  return (
    <Card
      className="common-box-shadow"
      sx={{
        mb: 2.5,
        px: 1.5,
        py: 2.5,
        borderRadius: 2,
        overflow: "visible",
        position: "relative",
        display: hideHeader ? "none" : "block",
      }}
    >
      {isInternalServerError || isSomethingWentWrong ? (
        <Box sx={{ minHeight: "25vh" }} className="common-not-found-container">
          {isInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {isSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
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
                }}
                className="segment-details-summary-header"
              >
                {segmentDetailsSummary?.map((details, index) => (
                  <>
                    {index === 0 ? (
                      <Box sx={{ display: "flex", gap: 1.5 }}>
                        <IconButton
                          sx={{ alignSelf: "flex-start", p: 0 }}
                          onClick={() => navigate("/data-segment-manager")}
                        >
                          <NavigateBeforeIcon />
                        </IconButton>
                        <Box className="segment-name-and-date-container">
                          <Box>
                            <Box>
                              <Typography>{details?.segmentName}</Typography>
                              <Divider
                                style={{ background: "black" }}
                                vertical
                              />
                              <Typography>{details.segmentType}</Typography>
                            </Box>
                          </Box>
                          <Box className="create-date-container">
                            <CalendarMonthOutlinedIcon />
                            <Box className="details-create-on-date">
                              <ShowDate date={details?.createdOn} />
                            </Box>
                          </Box>
                          <Typography className="details-create-on-date">
                            Initial Count : {details.count}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Typography className="top-stripe-header-title">
                          {details.title}
                        </Typography>
                        <Typography className="top-stripe-header-count">
                          {details.count}
                        </Typography>
                      </Box>
                    )}
                    {index === segmentDetailsSummary.length - 1 ||
                      mediumScreen || (
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
                    defaultSize={true}
                  />
                  <img src={AutomationIcon} alt="automationIcon" />
                </Box>
              </Box>
            </>
          )}
        </>
      )}
    </Card>
  );
}

export default SegmentDetailsSummary;
