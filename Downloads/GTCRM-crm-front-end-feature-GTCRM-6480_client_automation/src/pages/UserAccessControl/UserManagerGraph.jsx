import { Box } from "@mui/material";
import React from "react";
import ReactApexChart from "react-apexcharts";
import "../../styles/UserManager.css";
import { color, width } from "@mui/system";
import { Spa } from "@mui/icons-material";
import { Background } from "reactflow";

const UserManagerGraph = ({ userChart }) => {
  const activeCount=userChart?.userChart?.data.map(item=>item.active_count);
  const inactiveCount=userChart?.userChart?.data.map(item=>item.inactive_count);
  const activePercentage=userChart?.userChart?.data.map(item=>item.active_percentage);
  const inactivePercentage=userChart?.userChart?.data.map(item=>item.inactive_percentage);
  const overallPercentage=userChart?.userChart?.data.map(item=>item.overall_percentage);
 const dataSet1={
  series: [{
    name: 'Active User',
    data: activeCount,
  },{
    name: 'Inactive User',
    data: inactiveCount,
  },],
   options : {
   
    chart: {
      toolbar: {
        show: false,
      },
    type: 'bar',
    stacked: true,
  },
  
  tooltip: {
    enabled: true, // Ensure tooltips are enabled
    y: {
        formatter: function (val, { seriesIndex, dataPointIndex, w }) {
          const totalCount = w.config.series[seriesIndex].data[dataPointIndex];
          const percentage = seriesIndex === 0 ? activePercentage[dataPointIndex] : inactivePercentage[dataPointIndex];
          return `${percentage}% (${val})`;
        },
    },
    style:{
      padding:10
    }
  },
  plotOptions: {
    bar: {
        borderRadius: 8,
        borderRadiusApplication: 'end',
      horizontal: true,
    },
  },
  xaxis: {
    categories: userChart?.userChart?.labels,
    min:0,
  },
  
  colors: ["#008BE2", "#00B4D8"],
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
    {
      breakpoint: 900,
      options: {
        chart: {
          width: 400,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
  fill: {
    opacity: 1
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    offsetX: 40
  },
  grid:{
    show:true,
    yaxis:{
      lines:{
        show:false
      }
    }
  }
  }

 }
  const dataSet2 = {
    series: {
      data: userChart?.dataChart?.data,
    },
    options: {
      chart: {
        type: "donut",
      },
      labels: userChart?.dataChart?.labels,
      colors: ["#00B4D8", "#03045E", "#0096C7"],
      stroke:{
        show:false
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
        {
          breakpoint: 900,
          options: {
            chart: {
              width: 400,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  if (!userChart?.userChart) {
    return null;
  }

  return (
    <Box className="user-manager-graph-chart-box-container">
      <ReactApexChart
      series={dataSet1?.series}
        options={dataSet1?.options}
        type="bar"
        height={345}
      />
      <ReactApexChart
        options={dataSet2?.options}
        series={dataSet2?.series?.data}
        type="donut"
        height={345}
      />
    </Box>
  );
};

export default UserManagerGraph;
