import React, { useState } from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { Box, CardHeader, CardContent } from "@mui/material";

function ApplicationStageChart(props) {
  const theme = useTheme();
  const [stateData] = useState({
    // ! setStateData
    series: [
      {
        name: "New Customers",
        data: [138, 118, 45, 117, 140, 42, 100, 15, 97, 117, 60, 140],
      },
      {
        name: "Up/Cross-Selling",
        data: [90, 32, 2, 22, 90, 33, 25, 8, 1, 21, 21, 100],
      },
    ],
    options: {
      chart: {
        background: "transparent",
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      colors: ["#2F3EB1", "#6E7AD8"],
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 1,
        type: "solid",
      },
      grid: {
        borderColor: theme.palette.divider,
      },
      theme: {
        mode: theme.palette.mode,
      },
      xaxis: {
        axisBorder: {
          color: theme.palette.divider,
          show: true,
        },
        axisTicks: {
          color: theme.palette.divider,
          show: true,
        },
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
  });
  return (
    <Box>
      <CardHeader title="Application Stage" />
      <CardContent>
        <Chart
          height={467}
          options={stateData.options}
          series={stateData.series}
          type="area"
        />
      </CardContent>
    </Box>
  );
}

export default ApplicationStageChart;
