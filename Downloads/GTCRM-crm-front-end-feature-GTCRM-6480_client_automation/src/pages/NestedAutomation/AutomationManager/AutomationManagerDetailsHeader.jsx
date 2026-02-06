import { Card, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { Divider } from "rsuite";
import { useSelector } from "react-redux";
import {
  useGetAutomationManagerDetailsHeaderDataQuery
} from "../../../Redux/Slices/applicationDataApiSlice";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import useToasterHook from "../../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import Error500Animation from "../../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../../../components/shared/Loader/LeefLottieAnimationLoader";
import IconDateRangePicker from "../../../components/shared/filters/IconDateRangePicker";
import "../../../styles/DataSegmentQuickView.css";
import DateRangeShowcase from "../../../components/shared/CalendarTimeData/DateRangeShowcase";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import GetJsonDate from "../../../hooks/GetJsonDate";
function AutomationManagerDetailsHeader({ setShowDetailsPage, detailsId }) {
  const [headerDetails, setHeaderDetails] = useState([]);
  const [dateRange, setDateRange] = useState([]);

  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);

  const theme = useTheme();
  const mediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();

  const { data, isError, error, isFetching, isSuccess } =
    useGetAutomationManagerDetailsHeaderDataQuery({
      collegeId,
      automationId: detailsId,
      payload: JSON.parse(GetJsonDate(dateRange)),
    });
  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof data?.data === "object") {
          const headerData = [
            {
              automation_name: data?.data?.automation_name,
              data_type: data?.data?.data_type,
              status: data?.data?.status,
              count_at_origin: data?.data?.count_at_origin,
              date: data?.data?.date,
              time: data?.data?.time,
            },
            {
              title: "Current Data Count",
              value: data?.data?.current_data_count || 0,
            },
            {
              title: "Email Communication",
              value: `${data?.data?.email_communication?.delivered}/${data?.data?.email_communication?.sent}`,
            },
            {
              title: `SMS Communication`,
              value: `${data?.data?.sms_communication?.delivered}/${data?.data?.sms_communication?.sent}`,
            },
            {
              title: "Whatsapp Communication",
              value: `${data?.data?.whatsapp_communication?.delivered}/${data?.data?.whatsapp_communication?.sent}`,
            },
          ];
          setHeaderDetails(headerData);
        } else {
          throw new Error("Tag list API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
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
  }, [data, isError, error, isSuccess]);

  return (
    <Card
      sx={{ display: hideHeader ? "none" : "", overflow: "visible" }}
      className="common-box-shadow automation-header-card"
    >
      <Box sx={{ position: "relative", top: "-22px" }}>
        {dateRange?.length > 1 && (
          <DateRangeShowcase
            startDateRange={getDateMonthYear(dateRange[0])}
            endDateRange={getDateMonthYear(dateRange[1])}
            triggeredFunction={() => setDateRange([])}
          ></DateRangeShowcase>
        )}
      </Box>

      {isInternalServerError || isSomethingWentWrong ? (
        <Box sx={{ minHeight: "25vh" }} className="common-not-found-container">
          {isInternalServerError && (
            <Error500Animation height={200} width={200}></Error500Animation>
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
            <Box
              sx={{
                flexDirection: mediumScreen ? "column" : "row",
                alignItems: mediumScreen ? "flex-start" : "center",
              }}
              className="automation-manager-header-container"
            >
              {headerDetails.map((details, index) => (
                <>
                  {index === 0 ? (
                    <Box sx={{ display: "flex", gap: 1.5, flex: 200 }}>
                      <IconButton
                        sx={{ alignSelf: "flex-start", p: 0 }}
                        onClick={() => setShowDetailsPage(false)}
                      >
                        <NavigateBeforeIcon />
                      </IconButton>
                      <Box className="segment-name-and-date-container">
                        <Box>
                          <Typography>{details?.automation_name}</Typography>
                          <Box sx={{ gap: "8px !important" }}>
                            <Divider
                              style={{ background: "black", margin: 0 }}
                              vertical
                            />
                            <Typography>
                              {details?.data_type || "--"}
                            </Typography>
                            <Divider
                              style={{ background: "black", margin: 0 }}
                              vertical
                            />
                            <Typography
                              sx={{ borderRadius: 1, fontSize: 11, px: 1.2 }}
                              className="active"
                            >
                              {details?.status || "--"}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography className="details-create-on-date">
                          Count at Origin : {details?.count_at_origin}
                        </Typography>
                        <Typography className="details-create-on-date">
                          {details?.date} : {details?.time}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ flex: 200, width: "100%" }}>
                        <Typography className="top-stripe-header-title">
                          {details.title}
                        </Typography>
                        <Typography className="top-stripe-header-count">
                          {details.value}
                        </Typography>
                      </Box>
                    </>
                  )}
                  {index === headerDetails.length - 1 || mediumScreen || (
                    <Box
                      sx={{ flex: 1 }}
                      className="top-stripe-header-vertical-line"
                    ></Box>
                  )}
                </>
              ))}
              <Box
                sx={{
                  width: mediumScreen ? "100%" : "auto",
                  alignSelf: "flex-start",
                }}
                className="automation-manager-header-filter"
              >
                <IconDateRangePicker
                  onChange={(value) => {
                    setDateRange(value);
                  }}
                  dateRange={dateRange}
                />
              </Box>
            </Box>
          )}
        </>
      )}
    </Card>
  );
}

export default AutomationManagerDetailsHeader;
