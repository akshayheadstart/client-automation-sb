import { Box, Card, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Chart from "react-apexcharts";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import { optionOfAllSourceLeads } from "../../constants/LeadStageList";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { useSelector } from "react-redux";
import { customFetch } from "../StudentTotalQueries/helperFunction";
const AllSourceLeads = () => {
  const [allSourceLeadSeries, setAllSourceLeadSeries] = useState({
    series: [
      {
        data: [],
      },
    ],
  });
  const [
    AllSourceLeadInternalServerError,
    setAllSourceLeadInternalServerError,
  ] = useState(false);
  const [allSourceLeadSomethingWentWrong, setAllSourceLeadSomethingWentWrong] =
    useState(false);
  const [sourceLeadLoading, setSourceLeadLoading] = useState(false);
  const [hideAllSourceGraph, setHideAllSourceGraph] = useState(false);

  const token = Cookies.get("jwtTokenCredentialsAccessToken");

  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  useEffect(() => {
    setSourceLeadLoading(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/publisher/get_publisher_leads_count_by_source_for_graph${
        collegeId ? "?college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(token, "GET")
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data.code === 200) {
          try {
            if (Array.isArray(data.data)) {
              const allLeads = data.data[0];
              const listOfSourceLeads = [
                allLeads.primary_source,
                allLeads.secondary_source,
                allLeads.tertiary_source,
                allLeads.total_leads,
              ];
              setAllSourceLeadSeries(() => {
                return {
                  series: [
                    {
                      name: "Total",
                      data: listOfSourceLeads,
                    },
                  ],
                };
              });
            } else {
              throw new Error(
                "All source leads get api response has been changed"
              );
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setAllSourceLeadSomethingWentWrong,
              setHideAllSourceGraph,
              5000
            );
          }
        }
      })
      .catch(() => {
        handleInternalServerError(
          setAllSourceLeadInternalServerError,
          setHideAllSourceGraph,
          5000
        );
      })
      .finally(() => {
        setSourceLeadLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">All Source Leads</Typography>
      {sourceLeadLoading ? (
        <Box sx={{ mt: 3 }}>
          <LeefLottieAnimationLoader
            height={150}
            width={200}
          ></LeefLottieAnimationLoader>
        </Box>
      ) : (
        <Box>
          {allSourceLeadSomethingWentWrong ||
          AllSourceLeadInternalServerError ? (
            <Box sx={{ mt: 2 }}>
              {allSourceLeadSomethingWentWrong && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
              {AllSourceLeadInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
            </Box>
          ) : (
            <Card
              sx={{
                mt: 2,
                p: 2,
                visibility: `${hideAllSourceGraph ? "hidden" : "visible"}`,
              }}
            >
              <Chart
                options={optionOfAllSourceLeads.options}
                series={allSourceLeadSeries.series}
                type="bar"
                height={350}
              />
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AllSourceLeads;
