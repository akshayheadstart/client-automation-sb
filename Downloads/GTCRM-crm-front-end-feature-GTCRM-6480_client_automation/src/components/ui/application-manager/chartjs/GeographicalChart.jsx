import React, { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Box, Container, Grid, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { DashboradDataContext } from "../../../../store/contexts/DashboardDataContext";
import { useNavigate } from "react-router-dom";
import LeefLottieAnimationLoader from "../../../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../../shared/ErrorAnimation/Error500Animation";
import BaseNotFoundLottieLoader from "../../../shared/Loader/BaseNotFoundLottieLoader";
import { ErrorFallback } from "../../../../hooks/ErrorFallback";
import { handleInternalServerError } from "../../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../../utils/handleSomethingWentWrong";
import useToasterHook from "../../../../hooks/useToasterHook";
import { ApiCallHeaderAndBody } from "../../../../hooks/ApiCallHeaderAndBody";
import { customFetch } from "../../../../pages/StudentTotalQueries/helperFunction";

function GeographicalChart({
  collegeId,
  setStateList,
  selectPickerValue,
  stateList,
}) {
  const [selectedStateName, setSelectedStateName] = useState("");
  const [stateData, setStateData] = useState({
    options: {
      chart: {
        background: "transparent",
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      legend: {
        show: true,
        position: "right",
        offsetY: 40,
      },
      dataLabels: {
        enabled: true,
      },
      labels: [],
      stroke: {
        width: 1,
      },
    },
  });

  const [cityData, setCityData] = useState({
    options: {
      chart: {
        background: "transparent",
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      legend: {
        show: true,
        position: "right",
        offsetY: 40,
      },
      dataLabels: {
        enabled: true,
      },
      labels: [],
      stroke: {
        width: 1,
      },
    },
  });
  // const [setApplicationData] = useState({});
  const [mapData, setMapData] = useState([]);
  const [cityWiseData, setCityWiseData] = useState([]);
  const [loadingStateData, setLoadingStateData] = useState(false);
  const [loadingCityData, setLoadingCityData] = useState(true);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [
    stateWiseApplicationsInternalServerError,
    setStateWiseApplicationsInternalServerError,
  ] = useState(false);
  const [hideStateWiseApplications, setHideStateWiseApplications] =
    useState(false);
  const [
    cityWiseApplicationsInternalServerError,
    setCityWiseApplicationsInternalServerError,
  ] = useState(false);
  const [hideCityWiseApplications, setHideCityWiseApplications] =
    useState(false);
  const [
    somethingWentWrongInStateWiseApplications,
    setSomethingWentWrongInStateWiseApplications,
  ] = useState(false);
  const [
    somethingWentWrongInCityWiseApplications,
    setSomethingWentWrongInCityWiseApplications,
  ] = useState(false);
  const pushNotification = useToasterHook();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const navigate = useNavigate();
  const others = {
    state_name: "Others",
    application_count: 0,
  };

  //fetching map Data
  useEffect(() => {
    if (collegeId?.length > 0) {
      setLoadingStateData(true);
      customFetch(
        `${import.meta.env.VITE_API_BASE_URL}/map_data/${collegeId}`,
        ApiCallHeaderAndBody(token, "POST"),
        true
      )
        .then((res) => res.json())
        .then((result) => {
          if (result.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (result.code === 200) {
            const expectedData = result?.data[0];
            try {
              if (
                typeof expectedData === "object" &&
                expectedData !== null &&
                !Array.isArray(expectedData)
              ) {
                // setApplicationData(result?.data[0]);
                let map = result?.data[0].map;
                setStateList(map);
                const otherData = result?.data[0]?.Other;
                if (map?.length <= 5) {
                  map.sort(
                    (a, b) =>
                      b.application_percentage - a.application_percentage
                  );
                  if (otherData.application_count) {
                    otherData.state_name = "Others";
                    map.push(otherData);
                  } else {
                    map.push(others);
                  }
                } else {
                  let sortedMapData = map.sort(
                    (a, b) =>
                      b?.application_percentage - a?.application_percentage
                  );

                  map = map?.slice(0, 5);

                  // extracting 5 to 8 data to show the application count in Others
                  const fiveToEightData = sortedMapData.slice(5, 8);
                  let fiveToEightDataCount = 0;
                  fiveToEightData.forEach(
                    (item) => (fiveToEightDataCount += item.application_count)
                  );

                  if (otherData.application_count) {
                    otherData.state_name = "Others";
                    otherData.application_count += fiveToEightDataCount;
                    map.push(otherData);
                  } else {
                    others.application_count = fiveToEightDataCount;
                    map.push(others);
                  }
                }
                const mapDataHavingApplicationCount = map.filter(
                  (item) =>
                    (item.application_count > 0 &&
                      item.state_name !== "Others") ||
                    item.state_name === "Others"
                );

                setMapData(mapDataHavingApplicationCount);
                setStateData({
                  options: {
                    chart: {
                      background: "transparent",
                      stacked: false,
                      toolbar: {
                        show: false,
                      },
                    },
                    legend: {
                      show: true,
                      position: "right",
                      offsetY: 40,
                    },
                    dataLabels: {
                      enabled: true,
                    },
                    labels: mapDataHavingApplicationCount.map(
                      (item) => item.state_name
                    ),
                    stroke: {
                      width: 1,
                    },
                  },
                });
              } else {
                throw new Error("map_data API response has changed");
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInStateWiseApplications,
                setHideStateWiseApplications,
                10000
              );
            }
          } else if (result.detail) {
            pushNotification("error", result?.detail);
          }
        })
        .catch((error) => {
          handleInternalServerError(
            setStateWiseApplicationsInternalServerError,
            setHideStateWiseApplications,
            10000
          );
        })
        .finally(() => setLoadingStateData(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, collegeId]);
  // fetching city wise data
  useEffect(() => {
    if (mapData?.length > 1) {
      setLoadingCityData(true);
      customFetch(
        `${import.meta.env.VITE_API_BASE_URL}/map_data/city_wise_data/${
          selectPickerValue ? selectPickerValue : mapData[0]?.state_code
        }?college_id=${collegeId}`,
        ApiCallHeaderAndBody(token, "POST")
      )
        .then((res) => res.json())
        .then((result) => {
          if (result.detail) {
            pushNotification("error", result.detail);
          } else {
            let resultData = result;
            try {
              if (Array.isArray(resultData)) {
                if (resultData?.length <= 5) {
                  resultData.sort(
                    (a, b) => b.paid_application - a.paid_application
                  );
                } else {
                  resultData.sort(
                    (a, b) => b?.paid_application - a?.paid_application
                  );
                  resultData = resultData?.slice(0, 5);
                }

                setCityWiseData(resultData);
                setCityData({
                  options: {
                    chart: {
                      background: "transparent",
                      stacked: false,
                      toolbar: {
                        show: false,
                      },
                    },
                    legend: {
                      show: true,
                      position: "right",
                      offsetY: 40,
                    },
                    dataLabels: {
                      enabled: true,
                    },
                    labels: resultData.map((item) => item.city_name),
                    stroke: {
                      width: 1,
                    },
                  },
                });
              } else {
                throw new Error("city_wise_data API response has changed");
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInCityWiseApplications,
                setHideCityWiseApplications,
                10000
              );
            }
          }
        })
        .catch((err) => {
          handleInternalServerError(
            setCityWiseApplicationsInternalServerError,
            setHideCityWiseApplications,
            10000
          );
        })
        .finally(() => setLoadingCityData(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectPickerValue, mapData]);

  // setting selected state name to show in the top
  useEffect(() => {
    if (selectPickerValue) {
      const selectedState = stateList?.find(
        (item) => item?.state_code === selectPickerValue
      );
      setSelectedStateName(selectedState?.state_name);
    } else {
      setSelectedStateName(mapData[0]?.state_name);
    }
  }, [selectPickerValue, stateList, mapData]);

  return (
    <>
      {stateWiseApplicationsInternalServerError ||
      somethingWentWrongInStateWiseApplications ? (
        <Box sx={{ pb: 2 }}>
          {stateWiseApplicationsInternalServerError && (
            <Error500Animation height={300} width={300}></Error500Animation>
          )}
          {somethingWentWrongInStateWiseApplications && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box
          sx={{ visibility: hideStateWiseApplications ? "hidden" : "visible" }}
          className="donut-chart"
        >
          <Container>
            <Grid container spacing={3}>
              <Grid item md={6} sm={6} xs={12}>
                <Box className="data-wise-data">
                  <Typography className="quick-snapshot-chart-title">
                    State-wise Applications (India)
                  </Typography>
                  <Box className="data-wise-data">
                    {loadingStateData ? (
                      <Box
                        sx={{
                          width: "100%",
                          minHeight: "250px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <LeefLottieAnimationLoader
                          height={100}
                          width={80}
                        ></LeefLottieAnimationLoader>
                      </Box>
                    ) : (
                      <Box>
                        {mapData?.length === 0 && !loadingStateData ? (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              minHeight: "250px",
                              alignItems: "center",
                            }}
                          >
                            <BaseNotFoundLottieLoader
                              height={250}
                              width={250}
                            ></BaseNotFoundLottieLoader>
                          </Box>
                        ) : (
                          <Chart
                            options={stateData.options}
                            series={mapData.map(
                              (item) => item.application_count
                            )}
                            type="donut"
                            height={250}
                          />
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <Box className="data-wise-data">
                  <Typography className="quick-snapshot-chart-title">
                    City-wise Applications{" "}
                    {selectedStateName && `(${selectedStateName})`}
                  </Typography>
                  {(cityWiseApplicationsInternalServerError ||
                    somethingWentWrongInCityWiseApplications) &&
                  !loadingStateData ? (
                    <Box sx={{ pb: 4 }}>
                      {cityWiseApplicationsInternalServerError && (
                        <Error500Animation
                          height={300}
                          width={300}
                        ></Error500Animation>
                      )}
                      {somethingWentWrongInCityWiseApplications && (
                        <ErrorFallback
                          error={apiResponseChangeMessage}
                          resetErrorBoundary={() => window.location.reload()}
                        />
                      )}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        visibility:
                          hideCityWiseApplications || hideStateWiseApplications
                            ? "hidden"
                            : "visible",
                      }}
                      className="data-wise-data"
                    >
                      {loadingCityData && mapData?.length > 0 ? (
                        <Box
                          sx={{
                            width: "100%",
                            minHeight: "250px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <LeefLottieAnimationLoader
                            height={100}
                            width={80}
                          ></LeefLottieAnimationLoader>
                        </Box>
                      ) : (
                        <Box>
                          {cityWiseData?.length === 0 && !loadingStateData ? (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                minHeight: "250px",
                                alignItems: "center",
                              }}
                            >
                              <BaseNotFoundLottieLoader
                                height={250}
                                width={250}
                              ></BaseNotFoundLottieLoader>
                            </Box>
                          ) : (
                            <Chart
                              options={cityData.options}
                              series={cityWiseData.map(
                                (item) => item.paid_application
                              )}
                              type="donut"
                              height={250}
                            />
                          )}{" "}
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}
    </>
  );
}

export default GeographicalChart;
