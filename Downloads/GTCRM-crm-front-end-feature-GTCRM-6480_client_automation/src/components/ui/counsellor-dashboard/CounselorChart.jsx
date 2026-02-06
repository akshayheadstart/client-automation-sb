import React, { useState, useContext } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Chart from "react-apexcharts";
import { useEffect } from "react";
import Cookies from "js-cookie";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import useToasterHook from "../../../hooks/useToasterHook";
import { useSelector } from "react-redux";
import { customFetch } from "../../../pages/StudentTotalQueries/helperFunction";

const CounselorChart = () => {
  const theme = useTheme();
  const pushNotification = useToasterHook();
  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  //counsellor chart internal server error and hide states
  const [
    counsellorChartInternalServerError,
    setCounsellorChartInternalServerError,
  ] = useState(false);
  const [hideCounsellorChart, setHideCounsellorChart] = useState(false);
  const [
    somethingWentWrongInCounsellorChart,
    setSomethingWentWrongInCounsellorChart,
  ] = useState(false);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  useEffect(() => {
    setLoading(true);
    customFetch(
      `${import.meta.env.VITE_API_BASE_URL}/counselor/counselor_wise_lead${
        collegeId ? "?college_id=" + collegeId : ""
      }`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res1) => res1.json())
      .then((res) => {
        if (res.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.data) {
          const counselorName = [];
          const totalLeads = [];
          const totalPaid = [];

          try {
            if (Array.isArray(res?.data[0])) {
              res?.data[0]?.forEach((counselor) => {
                counselorName.push(counselor.counselor_name);
                totalLeads.push(counselor.total_lead);
                totalPaid.push(counselor.total_paid);
              });
              setChartSeries([
                {
                  data: [...totalLeads],
                  name: "Leads",
                },
                {
                  data: [...totalPaid],
                  name: "Applications",
                },
              ]);
              setChartOptions({
                chart: {
                  background: "transparent",
                  toolbar: {
                    show: true,
                  },
                },
                colors: ["#13affe", "#fbab49"],
                dataLabels: {
                  enabled: true,
                },
                fill: {
                  opacity: 1,
                },
                grid: {
                  borderColor: theme.palette.divider,
                  yaxis: {
                    lines: {
                      show: true,
                    },
                  },
                },
                legend: {
                  labels: {
                    colors: theme.palette.text.secondary,
                  },
                  show: true,
                },
                plotOptions: {
                  bar: {
                    columnWidth: "40%",
                  },
                },
                stroke: {
                  colors: ["transparent"],
                  show: true,
                  width: 2,
                },
                theme: {
                  mode: theme.palette.mode,
                },
                xaxis: {
                  axisBorder: {
                    show: true,
                    color: theme.palette.divider,
                  },
                  axisTicks: {
                    show: true,
                    color: theme.palette.divider,
                  },
                  categories: [...counselorName],
                  labels: {
                    style: {
                      colors: theme.palette.text.secondary,
                    },
                  },
                },
                yaxis: {
                  axisBorder: {
                    color: theme.palette.divider,
                    show: true,
                  },
                  axisTicks: {
                    color: theme.palette.divider,
                    show: true,
                  },
                  labels: {
                    style: {
                      colors: theme.palette.text.secondary,
                    },
                  },
                },
              });
            } else {
              throw new Error("counselor_wise_lead API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInCounsellorChart,
              setHideCounsellorChart,
              10000
            );
          }
        } else if (res?.detail !== "No counsellor found") {
          pushNotification("error", res?.detail);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        handleInternalServerError(
          setCounsellorChartInternalServerError,
          setHideCounsellorChart,
          10000
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {counsellorChartInternalServerError ||
      somethingWentWrongInCounsellorChart ? (
        <Box>
          <Typography
            align="left"
            variant="h6"
            sx={{ fontWeight: "bold", pb: 1 }}
          >
            Counsellor Wise Lead and Application Count
          </Typography>
          {counsellorChartInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInCounsellorChart && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box sx={{ visibility: hideCounsellorChart ? "hidden" : "visible" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: {
                md: "row",
                xs: "column",
                sm: "column",
                lg: "row",
              },
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: "bold" }} variant="h6">
                Counsellor Wise Lead and Application Count
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {/* <DropDownButton buttonName={"Leads Assigned"}></DropDownButton>
               <DropDownButton buttonName={"Applications Assigned"}></DropDownButton>
               <DropDownButton buttonName={"All Selected"}></DropDownButton> */}
            </Box>
          </Box>
          {loading ? (
            <Box
              sx={{
                width: "100%",
                minHeight: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {" "}
              <LeefLottieAnimationLoader
                height={80}
                width={100}
              ></LeefLottieAnimationLoader>{" "}
            </Box>
          ) : (
            <>
              {chartOptions.chart ? (
                <Chart
                  height={300}
                  options={chartOptions}
                  series={chartSeries}
                  type="bar"
                />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "350px",
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
          )}
        </Box>
      )}
    </>
  );
};

export default React.memo(CounselorChart);
