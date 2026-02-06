import React, { useEffect } from "react";
import Chart from "react-apexcharts";

const TopPerforMingChannelCharts = ({
  responseChangeToChartREsponse: chartsData,
}) => {
  const [series, setSeries] = React.useState([]);
  const [options, setOptions] = React.useState({});

  const applicationColor = "#0077c1";
  const leadsColor = "#11bed2";

  useEffect(() => {
    if (chartsData?.length) {
      setSeries([
        {
          name: "Paid applications",
          type: "column",
          data: chartsData?.map((item) => item?.paid_applications),
        },
        {
          name: "Leads",
          type: "line",
          data: chartsData?.map((item) => item?.leads),
        },
      ]);
      setOptions({
        chart: {
          height: 350,
          type: "line",
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        grid: {
          show: true,
        },
        colors: [applicationColor, leadsColor],
        stroke: {
          width: [0, 4],
        },
        legend: {
          show: true,
          offsetY: -5
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1],
          offsetY: -2,
        },
        labels: chartsData?.map((item) => item?.source),
        xaxis: {
          labels: {
            trim: true,
            rotate: -20,
            maxHeight: 100,
            rotateAlways: true,
            hideOverlappingLabels: false,
            style: {
              fill: applicationColor,
              fontSize: "13px",
              colors: applicationColor,
            },
          },
          tooltip: {
            enabled: false,
          },
          axisTicks: {
            show: true,
            color: "#000",
          },
        },
        yaxis: [
          {
            title: {
              text: "Application",
              style: {
                textAnchor: "middle",
                fontSize: "17px",
                color: applicationColor,
                fontWeight: "bolder",
              },
              offsetX: -15,
            },
            labels: {
              style: {
                colors: applicationColor,
              },
            },
          },
          {
            opposite: true,
            title: {
              text: "Leads",
              style: {
                textAnchor: "middle",
                fontSize: "17px",
                color: leadsColor,
                fontWeight: "bolder",
              },
              offsetX: 15,
            },
            labels: {
              style: {
                colors: leadsColor,
              },
            },
          },
        ],
        tooltip: {
          inverseOrder: true,
          onDatasetHover: {
            highlightDataSeries: true,
          },
          marker: {
            show: true,
          },
        },
      });
    }
  }, [chartsData]);

  return (
    <Chart options={options} series={series} type="line" height={"310"} />
  );
};

export default TopPerforMingChannelCharts;
