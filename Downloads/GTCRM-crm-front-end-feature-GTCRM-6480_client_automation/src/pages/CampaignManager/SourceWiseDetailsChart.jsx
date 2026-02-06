import { Card, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Chart from "react-apexcharts";
import { Box } from "@mui/system";
import { SelectPicker } from "rsuite";
import { useEffect } from "react";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import Cookies from "js-cookie";
import useToasterHook from "../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { useSelector } from "react-redux";
import { customFetch } from "../StudentTotalQueries/helperFunction";
const SourceWiseDetailsChart = ({ listOfSources }) => {
  const [selectedSource, setSelectedSource] = useState("");
  const [sourceWiseDetails, setSourceWiseDetails] = useState({});
  const [internalServerError, setInternalServerError] = useState(false);
  const [somethingWentWrong, setSomethingWentWrong] = useState(false);
  const [hideDetails, setHideDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const chartData = {
    series: [
      {
        name: "Total",
        data: [
          sourceWiseDetails?.all_source,
          sourceWiseDetails?.primary_source,
          sourceWiseDetails?.secondary_source,
          sourceWiseDetails?.tertiary_source,
        ],
      },
    ],
    options: {
      chart: {
        stacked: false,
        toolbar: {
          show: false,
        },
        height: 350,
        type: "bar",
        events: {
          click: function (chart, w, e) {},
        },
      },
      colors: ["#0C7CD5", "#FF9800", "#4CAF50", "#D14343"],
      plotOptions: {
        bar: {
          distributed: true,
          borderRadius: 5,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: [
          "Total Leads",
          "Primary Source",
          "Secondary Source",
          "Tertiary Source",
        ],
        labels: {
          style: {
            colors: ["#0C7CD5", "#FF9800", "#4CAF50", "#D14343"],
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "12px",
            colors: ["#0C7CD5", "#FF9800", "#4CAF50", "#D14343"],
          },
        },
      },
    },
  };

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const pushNotification = useToasterHook();

  useEffect(() => {
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/campaign_manager/source_wise_details/${
        selectedSource ? `?source_name=${selectedSource}` : ""
      }${
        collegeId
          ? selectedSource
            ? "&college_id="
            : "?college_id=" + collegeId
          : ""
      }`,
      ApiCallHeaderAndBody(token, "GET")
    )
      .then((response) => response.json())
      .then((data) => {
        setLoading(true);
        if (data.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data.data) {
          try {
            setSourceWiseDetails(data.data);
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrong,
              setHideDetails,
              10000
            );
          }
        } else if (data.detail) {
          pushNotification("error", data.detail);
        }
      })
      .catch(() => {
        handleInternalServerError(
          setInternalServerError,
          setHideDetails,
          10000
        );
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSource]);

  return (
    <Card sx={{ p: 2, mt: 2, display: hideDetails ? "none" : "block" }}>
      {somethingWentWrong || internalServerError ? (
        <Box>
          {internalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box>
          <Box className="source-wise-details-container">
            <Typography variant="h6">
              {" "}
              Source Wise Details
              <Tooltip
                title="Source wise details represents all leads by default. If you want to see particular source leads, you can change source from the top right select option."
                placement="top"
                arrow
              >
                <IconButton>
                  <InfoOutlinedIcon sx={{ fontSize: 17 }} />
                </IconButton>
              </Tooltip>
            </Typography>
            <SelectPicker
              onChange={(value) => {
                setSelectedSource(value);
              }}
              value={selectedSource}
              placeholder="Select Source"
              data={listOfSources}
              placement="bottomEnd"
            />
          </Box>
          {loading ? (
            <Box className="campaign-manager-loader-container">
              <LeefLottieAnimationLoader width={100} height={100} />
            </Box>
          ) : (
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={350}
            />
          )}
        </Box>
      )}
    </Card>
  );
};

export default SourceWiseDetailsChart;
