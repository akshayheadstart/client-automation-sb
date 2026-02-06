import React, { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { Box, CardContent, Typography } from "@mui/material";
import { DashboradDataContext } from "../../../../store/contexts/DashboardDataContext";
import Cookies from "js-cookie";
import LeefLottieAnimationLoader from "../../../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../../hooks/ErrorFallback";
import { ApiCallHeaderAndBody } from "../../../../hooks/ApiCallHeaderAndBody";
import { handleInternalServerError } from "../../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../../utils/handleSomethingWentWrong";
import useToasterHook from "../../../../hooks/useToasterHook";
import { customFetch } from "../../../../pages/StudentTotalQueries/helperFunction";

function ApplicationTrendsGraph({ collegeId }) {
  const pushNotification = useToasterHook();
  const [
    applicationTrendInternalServerError,
    setApplicationTrendInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInApplicationTrend,
    setSomethingWentWrongInApplicationTrend,
  ] = useState(false);
  const [hideApplicationTrend, setHideApplicationTrend] = useState(false);
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({
    series: [
      {
        color: "#FF9800",
        data: [],
        name: "Leads",
      },
      {
        color: "#0C7CD5",
        data: [],
        name: "Applications",
      },
    ],
    options: {
      chart: {
        id: "basic-bar",
        background: "transparent",
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: [],
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 1,
      },
      grid: {
        borderColor: theme.palette.divider,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      legend: {
        show: true,
      },
      markers: {
        hover: {
          size: undefined,
          sizeOffset: 2,
        },
        radius: 2,
        shape: "circle",
        size: 4,
        strokeWidth: 0,
      },
      stroke: {
        curve: "smooth",
        lineCap: "butt",
        width: 3,
      },
    },
  });

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  // getting lead application graph data
  useEffect(() => {
    if (collegeId?.length > 0) {
      setLoading(true);
      customFetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/admin/lead_application/${collegeId}`,
        ApiCallHeaderAndBody(token, "PUT", JSON.stringify({})),
        true
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data.detail) {
            pushNotification("error", data?.detail);
          } else if (data.code === 200) {
            const expectedData = data?.data[0];
            try {
              if (
                typeof expectedData === "object" &&
                expectedData !== null &&
                !Array.isArray(expectedData)
              ) {
                setChartData({
                  series: [
                    {
                      color: "#09BBD0",
                      data: data?.data[0]?.lead,
                      name: "Leads",
                    },
                    {
                      color: "#008BE2",
                      data: data?.data[0]?.application,
                      name: "Applications",
                    },
                  ],
                  options: {
                    chart: {
                      id: "basic-bar",
                      background: "transparent",
                      stacked: false,
                      toolbar: {
                        show: false,
                      },
                    },
                    xaxis: {
                      categories: data?.data[0]?.date,
                    },
                    dataLabels: {
                      enabled: false,
                    },
                    fill: {
                      opacity: 1,
                    },
                    grid: {
                      borderColor: theme.palette.divider,
                      xaxis: {
                        lines: {
                          show: false,
                        },
                      },
                      yaxis: {
                        lines: {
                          show: true,
                        },
                      },
                    },
                    legend: {
                      show: true,
                    },
                    markers: {
                      hover: {
                        size: undefined,
                        sizeOffset: 2,
                      },
                      radius: 2,
                      shape: "circle",
                      size: 4,
                      strokeWidth: 0,
                    },
                    stroke: {
                      curve: "smooth",
                      lineCap: "butt",
                      width: 3,
                    },
                  },
                });
              } else {
                throw new Error("lead_application API response has changed");
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInApplicationTrend,
                setHideApplicationTrend,
                10000
              );
            }
          }
        })
        .catch((err) => {
          handleInternalServerError(
            setApplicationTrendInternalServerError,
            setHideApplicationTrend,
            10000
          );
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collegeId]);

  return (
    <div>
      {loading ? (
        <Box
          sx={{
            width: "100%",
            minHeight: "40vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LeefLottieAnimationLoader
            height={150}
            width={180}
          ></LeefLottieAnimationLoader>
        </Box>
      ) : (
        <Box>
          <Typography className="quick-snapshot-chart-title">
            Application Trends
          </Typography>
          {applicationTrendInternalServerError ||
          somethingWentWrongInApplicationTrend ? (
            <CardContent>
              {applicationTrendInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrongInApplicationTrend && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </CardContent>
          ) : (
            <Box
              sx={{ visibility: hideApplicationTrend ? "hidden" : "visible" }}
            >
              <Chart
                height={250}
                options={chartData.options}
                series={chartData.series}
                type="line"
              />
            </Box>
          )}
        </Box>
      )}
    </div>
  );
}

export default ApplicationTrendsGraph;
