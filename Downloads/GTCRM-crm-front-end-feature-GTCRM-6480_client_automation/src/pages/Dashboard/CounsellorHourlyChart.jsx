/* eslint-disable react-hooks/exhaustive-deps */
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, IconButton, Skeleton, Typography } from "@mui/material";
import dayjs from "dayjs";
import React, { useContext, useState } from "react";
import { useGetCounsellorLeadsApplicationDataQuery } from "../../Redux/Slices/applicationDataApiSlice";
import MultipleTabs from "../../components/shared/tab-panel/MultipleTabs";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/CounselorFollowUpCalendar.css";
import {
  formatLeadApplicationChartData,
  hourlyChartColors,
} from "../../utils/ResourceUtils";

const CounsellorHourlyChart = ({
  onClickDate,
  selectedValue,
  collegeId,
  setHideFollowupCalendar,
  setApiResponseChangeMessage,
}) => {
  const { apiResponseChangeMessage } = useContext(DashboradDataContext);
  const [chartData, setChartData] = useState([]);
  const [tabValue, setTabValue] = React.useState(0);
  const [value, setValue] = React.useState(selectedValue);
  const [hourlyChartInternalServerError, setHourlyChartInternalServerError] =
    React.useState("");
  const [hourlyChartSomethingWentWrong, setHourlyChartSomethingWentWrong] =
    React.useState("");
  const { data, isLoading, isSuccess, isError, isFetching, error } =
    useGetCounsellorLeadsApplicationDataQuery({
      collegeId,
      date: value?.format("YYYY-MM-DD"),
      leadData: tabValue === 0,
    });

  const pushNotification = useToasterHook();

  const previousDate = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValue(value.subtract(1, "day"));
  };

  const nextDate = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValue(value.add(1, "day"));
  };

  React.useEffect(() => {
    try {
      if (isSuccess) {
        if (data) {
          const cData = formatLeadApplicationChartData(data, tabValue === 0);
          setChartData(cData);
        } else {
          throw new Error("get leads application API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setHourlyChartInternalServerError,
            setHideFollowupCalendar,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setHourlyChartSomethingWentWrong,
        setHideFollowupCalendar,
        10000
      );
    }
  }, [data, isSuccess, isError, tabValue, error]);

  const renderTick = ({ x: xAxisPostion, y: yAxisPosition, payload }) => {
    const { value } = payload;
    const [hourNum, hourLabel] = value?.split(" ");
    return (
      <text
        orientation="bottom"
        stroke="none"
        x={xAxisPostion}
        y={yAxisPosition}
        class="xaxis-tick-label"
        text-anchor="middle"
        fill="#666"
      >
        <tspan x={xAxisPostion} dy="0.71em" style={{ marginBottom: "2px" }}>
          {hourNum}
        </tspan>
        <tspan x={xAxisPostion} dy="0.71em">
          {hourLabel}
        </tspan>
      </text>
    );
  };

  const CustomTooltip = ({ payload, active }) => {
    const [bottomBarData, topBarData] = payload;
    if (active) {
      return tabValue === 0 ? (
        <div className="hourly-chart-tooltip">
          <div className="leads-assigned-text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="9"
              viewBox="0 0 8 9"
              fill="none"
            >
              <circle cx="4" cy="4.5" r="4" fill="#008BE2" />
            </svg>
            <span className="ml-10">Leads Assigned: {topBarData?.value}</span>
          </div>
          <div className="leads-called-text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="9"
              viewBox="0 0 8 9"
              fill="none"
            >
              <circle cx="4" cy="4.5" r="4" fill="#00465F" />
            </svg>
            <span className="ml-10">Leads Called: {bottomBarData?.value}</span>
          </div>
        </div>
      ) : (
        <div className="hourly-chart-tooltip">
          <div className="leads-assigned-text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="9"
              viewBox="0 0 8 9"
              fill="none"
            >
              <circle cx="4" cy="4.5" r="4" fill="#11BED2" />
            </svg>
            <span className="ml-10">Application Paid: {topBarData?.value}</span>
          </div>
          <div className="leads-called-text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="9"
              viewBox="0 0 8 9"
              fill="none"
            >
              <circle cx="4" cy="4.5" r="4" fill="#0A7EAE" />
            </svg>
            <span className="ml-10">
              Application Submitted: {bottomBarData?.value}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Box className="date-tabs-wrapper">
        <Box
          className="displayed-date-wrapper charts-date-button justify-space-between"
          onClick={() => onClickDate()}
        >
          <IconButton className="left-arrow-icon">
            <KeyboardArrowLeftIcon onClick={(event) => previousDate(event)} />
          </IconButton>
          <Typography variant="h6" className="selected-date-label">
            {dayjs(value).format("DD MMMM YYYY")}
          </Typography>
          <IconButton className="right-arrow-icon">
            <KeyboardArrowRightIcon onClick={(event) => nextDate(event)} />
          </IconButton>
        </Box>
        <MultipleTabs
          tabArray={[{ tabName: "Leads" }, { tabName: "Application" }]}
          setMapTabValue={setTabValue}
          mapTabValue={tabValue}
        ></MultipleTabs>
      </Box>

      <Box className="chart-wrapper">
        {hourlyChartSomethingWentWrong || hourlyChartInternalServerError ? (
          <>
            {hourlyChartInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {hourlyChartSomethingWentWrong && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </>
        ) : (
          <>
            {isLoading || isFetching ? (
              <Skeleton variant="rectangular" height={235} width="100%" />
            ) : (
              <ResponsiveContainer width="100%" height={235}>
                <BarChart
                  height="102%"
                  width="100%"
                  data={chartData}
                  margin={{
                    right: 0,
                    left: -15,
                    top: 5,
                    bottom: 5,
                  }}
                >
                  <XAxis
                    interval={0}
                    includeHidden
                    dataKey="name"
                    tick={renderTick}
                  />
                  <YAxis className="yaxis-tick-label" type="number" />
                  <Tooltip content={CustomTooltip} />

                  <Bar
                    // bottom bar
                    dataKey="bottomStack"
                    stackId="a"
                    fill={
                      tabValue === 0
                        ? hourlyChartColors.leads.leads_called
                        : hourlyChartColors.application.applications_submitted
                    }
                  />
                  <Bar
                    // top bar
                    dataKey="topStack"
                    stackId="a"
                    fill={
                      tabValue === 0
                        ? hourlyChartColors.leads.leads_assigned
                        : hourlyChartColors.application.application_paid
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default CounsellorHourlyChart;
