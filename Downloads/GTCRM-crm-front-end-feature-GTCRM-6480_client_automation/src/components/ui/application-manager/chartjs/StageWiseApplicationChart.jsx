import React, { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { Box, CardContent, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { DashboradDataContext } from "../../../../store/contexts/DashboardDataContext";
import LeefLottieAnimationLoader from "../../../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../../shared/ErrorAnimation/Error500Animation";

import { ErrorFallback } from "../../../../hooks/ErrorFallback";
import { handleInternalServerError } from "../../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../../utils/handleSomethingWentWrong";
import useToasterHook from "../../../../hooks/useToasterHook";
import { ApiCallHeaderAndBody } from "../../../../hooks/ApiCallHeaderAndBody";
import { useSelector } from "react-redux";
import { customFetch } from "../../../../pages/StudentTotalQueries/helperFunction";

function StageWiseApplicationChart() {
  const pushNotification = useToasterHook();
  const [
    stageWiseApplicationsInternalServerError,
    setStageWiseApplicationsInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInStageWiseApplication,
    setSomethingWentWrongInStageWiseApplication,
  ] = useState(false);
  const [hideStageWiseApplications, setHideStageWiseApplications] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const theme = useTheme();
  const [stageData, setStageData] = useState({
    // ! setStageData
    series: [
      {
        data: [],
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

      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
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
        categories: [],
      },
    },
  });

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const getOrganizedData = (data) => {
    const updatedApplicationList = [];
    data.forEach((item) => {
      if (item?.step === "initial_step") {
        updatedApplicationList[0] = item;
      } else if (item?.step === "basic_step") {
        updatedApplicationList[1] = item;
      } else if (item?.step === "parent_step") {
        updatedApplicationList[2] = item;
      } else if (item?.step === "address_detail") {
        updatedApplicationList[3] = item;
      } else if (item?.step === "education_detail") {
        updatedApplicationList[4] = item;
      } else if (item?.step === "payment_detail") {
        updatedApplicationList[5] = item;
      } else if (item?.step === "upload_document_step") {
        updatedApplicationList[6] = item;
      } else if (item?.step === "submit_step") {
        updatedApplicationList[7] = item;
      }
    });
    return updatedApplicationList;
  };

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  useEffect(() => {
    setLoading(true);
    customFetch(
      `${import.meta.env.VITE_API_BASE_URL}/lead/step_wise_data${
        collegeId ? "?college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(token, "POST")
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.code === 200) {
          const data = result.data[0];
          const organizedUpdatedData = getOrganizedData(data);
          try {
            if (Array.isArray(data)) {
              setStageData({
                series: [
                  {
                    name: "Total",
                    data: organizedUpdatedData?.map((item) => item.application),
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

                  plotOptions: {
                    bar: {
                      columnWidth: "45%",
                      distributed: true,
                    },
                  },
                  dataLabels: {
                    enabled: false,
                  },
                  legend: {
                    show: false,
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
                    categories: organizedUpdatedData?.map((item) =>
                      item.step.split("_").join(" ")
                    ),
                  },
                },
              });
            } else {
              throw new Error("step_wise_data API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInStageWiseApplication,
              setHideStageWiseApplications,
              10000
            );
          }
        } else if (result.detail) {
          pushNotification("error", result.detail);
        }
      })
      .catch((err) => {
        handleInternalServerError(
          setStageWiseApplicationsInternalServerError,
          setHideStageWiseApplications,
          10000
        );
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box>
      <Typography className="quick-snapshot-chart-title">
        Stage-wise Application
      </Typography>
      {stageWiseApplicationsInternalServerError ||
      somethingWentWrongInStageWiseApplication ? (
        <CardContent>
          {stageWiseApplicationsInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInStageWiseApplication && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </CardContent>
      ) : (
        <Box
          sx={{ visibility: hideStageWiseApplications ? "hidden" : "visible" }}
        >
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
            <Chart
              height={250}
              options={stageData.options}
              series={stageData.series}
              type="bar"
            />
          )}
        </Box>
      )}
    </Box>
  );
}

export default StageWiseApplicationChart;
