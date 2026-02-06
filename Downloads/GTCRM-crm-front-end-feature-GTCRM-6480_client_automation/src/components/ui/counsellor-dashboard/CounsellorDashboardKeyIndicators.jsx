import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import IndicatorDropDown from "../../shared/DropDownButton/IndicatorDropDown";
import {
  indicatorValue,
  leadChurnRatioList,
} from "../../../constants/LeadStageList";
import IndicatorImage from "../../../images/indicatorImage.svg";
import CustomTabs from "../../shared/tab-panel/CustomTabs";
import IndicatorComponent from "../admin-dashboard/IndicatorComponent";
import { SelectPicker } from "rsuite";
import "../../../styles/keyIndicator.css";
import keyIndicatorArrow from "../../../icons/key-indicator-arrow.svg";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import { useNavigate } from "react-router";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { useContext } from "react";
import { useGetCounsellorKeyIndicatorDetailsQuery } from "../../../Redux/Slices/adminDashboardSlice";
import useCommonErrorHandling from "../../../hooks/useCommonErrorHandling";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { useSelector } from "react-redux";

const CounsellorDashboardKeyIndicators = ({
  collegeId,
  setHideKeyIndicators,
}) => {
  const [keyIndicatorFormattedData, setKeyIndicatorFormattedData] = useState(
    []
  );
  const [keyIndicatorChangeIndicator, setKeyIndicatorChangeIndicator] =
    useState(null);
  const [keyIndicatorLcrType, setKeyIndicatorLcrType] = useState("Not picked");
  const [
    somethingWentWrongInKeyIndicators,
    setSomethingWentWrongInKeyIndicators,
  ] = useState(false);
  const [
    KeyIndicatorsInternalServerError,
    setKeyIndicatorsInternalServerError,
  ] = useState(false);

  const [tabNo, setTabNo] = useState(2);

  const navigate = useNavigate();
  const handleError = useCommonErrorHandling();

  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  function secondsToHourMinute(seconds) {
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const remainingSecondsFinal = remainingSeconds % 60;

    return `${hours > 0 ? `${hours}h` : ""}${
      minutes > 0 ? `${hours}m` : ""
    }${remainingSecondsFinal}s`;
  }

  const { data, isSuccess, isFetching, isError, error } =
    useGetCounsellorKeyIndicatorDetailsQuery(
      { collegeId, keyIndicatorChangeIndicator, keyIndicatorLcrType },
      { skip: collegeId?.length > 0 ? false : true }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof data?.data === "object") {
          const keyIndicatorData = data?.data;
          const formattedData = [
            {
              tabData: {
                itemOne: {
                  dividedTextOne: "Upcoming",
                  dividedTextTwo: "Follow-ups",
                  value: keyIndicatorData.upcoming_follow_up,
                  tab: 1,
                  navigate: "/followup-task-details",
                },
                itemTwo: {
                  dividedTextOne: "Fresh",
                  dividedTextTwo: "Leads",
                  value: keyIndicatorData?.fresh_lead,
                  tab: 1,
                  navigate: "/lead-manager",
                },
                itemThree: {
                  dividedTextOne: "Active",
                  dividedTextTwo: "Queries",
                  value: keyIndicatorData?.student_queries,
                  tab: 1,
                  navigate: "/student-queries",
                },
                itemFour: {
                  dividedTextOne: "Lead Churn Ratio",
                  dividedTextTwo: "of",
                  value: keyIndicatorData?.lcr_count,
                  tab: 1,
                  indicatorPercentage: keyIndicatorData?.lcr_perc || 0,
                  indicatorPosition: keyIndicatorData?.lcr_position || "equal",
                  indicator: true,
                  navigate: "/application-manager",
                  navigateState: {
                    admin_dashboard: true,
                    filters: {
                      lead_stage: {
                        lead_name: [
                          {
                            name: [keyIndicatorLcrType],
                            label: [],
                          },
                        ],
                      },
                      addColumn: ["Outbound Calls Count"],
                    },
                  },
                },
              },
            },
            {
              tabData: {
                itemOne: {
                  dividedTextOne: "Avg Talk",
                  dividedTextTwo: "Time/Day",
                  indicatorPercentage:
                    keyIndicatorData?.avg_talk_time_perc || 0,
                  indicatorPosition:
                    keyIndicatorData?.avg_talk_time_position || "equal",
                  value: secondsToHourMinute(
                    keyIndicatorData?.avg_talk_time_day
                  ),
                  tab: 2,
                  indicator: true,
                },
                itemTwo: {
                  dividedTextOne: "Avg Connected",
                  dividedTextTwo: "Calls/Day",
                  indicatorPercentage:
                    keyIndicatorData?.connected_call_perc || 0,
                  indicatorPosition:
                    keyIndicatorData?.connected_call_position || "equal",
                  value: keyIndicatorData?.connected_calls,
                  tab: 2,
                  indicator: true,
                },
                itemThree: {
                  dividedTextOne: "Percentage of",
                  dividedTextTwo: "Connected Calls",
                  indicatorPercentage:
                    keyIndicatorData?.percent_connected_perc || 0,
                  indicatorPosition:
                    keyIndicatorData?.percent_connected_position || "equal",
                  value: `${keyIndicatorData?.percentage_connected_call}%`,
                  tab: 2,
                  indicator: true,
                },
                itemFour: {
                  dividedTextOne: "Lead to",
                  dividedTextTwo: "Interested",
                  value: `${keyIndicatorData?.interested_lead}%`,
                  tab: 2,
                  indicatorPercentage:
                    keyIndicatorData?.interested_lead_perc || 0,
                  indicatorPosition:
                    keyIndicatorData?.interested_lead_position || "equal",
                  indicator: true,
                },
              },
            },
          ];
          setKeyIndicatorFormattedData(formattedData);
        } else {
          throw new Error(
            "Counselor key indicator API response has been changed"
          );
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError: setKeyIndicatorsInternalServerError,
          setHide: setHideKeyIndicators,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInKeyIndicators,
        setHideKeyIndicators,
        5000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, isSuccess]);

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["c2a62998"]?.features?.["a1ccd630"]
        ?.features
    );
  }, [permissions]);

  return (
    <>
      {somethingWentWrongInKeyIndicators || KeyIndicatorsInternalServerError ? (
        <Card>
          {KeyIndicatorsInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInKeyIndicators && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Card>
      ) : (
        <Card className="counsellor-key-indicators-box">
          {isFetching ? (
            <Box className="loader-container">
              <LeefLottieAnimationLoader
                height={100}
                width={150}
              ></LeefLottieAnimationLoader>
            </Box>
          ) : (
            <>
              <CardHeader
                sx={{ py: 1 }}
                action={
                  <>
                    {features?.["e16a6f5f"]?.visibility && (
                      <Box
                        sx={{ pt: 1.2, display: "flex", flexDirection: "row" }}
                      >
                        <Box sx={{ ml: 1 }}>
                          <IndicatorDropDown
                            indicator={keyIndicatorChangeIndicator}
                            image={IndicatorImage}
                            indicatorValue={indicatorValue}
                            setIndicator={setKeyIndicatorChangeIndicator}
                          ></IndicatorDropDown>
                        </Box>
                      </Box>
                    )}
                  </>
                }
                title={
                  <Typography
                    color="textPrimary"
                    className="Header-title-shared"
                  >
                    Key Indicators
                  </Typography>
                }
              />

              <CardContent sx={{ p: "0px !important" }}>
                <Box sx={{ mx: 2, mt: 2, mb: 3 }}>
                  <Grid
                    item
                    container
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                  >
                    <Grid item container direction="row" spacing="20px">
                      <Grid item md={5} xs={12}>
                        <Box className="key-indicator-inside-box">
                          <Box>
                            <Typography className="shared-title-design">
                              {
                                keyIndicatorFormattedData[tabNo === 1 ? 0 : 1]
                                  ?.tabData.itemOne.dividedTextOne
                              }
                            </Typography>
                            <Typography className="shared-title-design">
                              {
                                keyIndicatorFormattedData[tabNo === 1 ? 0 : 1]
                                  ?.tabData.itemOne.dividedTextTwo
                              }
                            </Typography>
                            <Box className="key-indicator-value-arrow-box">
                              <Box className="indicator-text-box">
                                <Typography id="counsellor-key-indicator-value">
                                  {
                                    keyIndicatorFormattedData[
                                      tabNo === 1 ? 0 : 1
                                    ]?.tabData.itemOne.value
                                  }
                                </Typography>
                                {keyIndicatorFormattedData[tabNo === 1 ? 0 : 1]
                                  ?.tabData.itemOne?.indicator && (
                                  <IndicatorComponent
                                    indicator={keyIndicatorChangeIndicator}
                                    title={`${
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemOne.dividedTextOne
                                    } ${
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemOne.dividedTextTwo
                                    }`}
                                    performance={
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemOne.indicatorPosition
                                    }
                                    percentage={
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemOne.indicatorPercentage
                                    }
                                    fontSize={17}
                                    indicatorSize={18}
                                    iconMargin={3}
                                  ></IndicatorComponent>
                                )}
                              </Box>
                              {tabNo === 1 && (
                                <Box
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => {
                                    if (
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemOne?.navigate
                                    ) {
                                      navigate(
                                        keyIndicatorFormattedData[
                                          tabNo === 1 ? 0 : 1
                                        ]?.tabData.itemOne?.navigate,
                                        {
                                          state:
                                            keyIndicatorFormattedData[
                                              tabNo === 1 ? 0 : 1
                                            ]?.tabData.itemOne?.navigateState,
                                        }
                                      );
                                    }
                                  }}
                                >
                                  <img
                                    width="24px"
                                    height="24px"
                                    src={keyIndicatorArrow}
                                    alt="arrow-icon"
                                  />
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid
                        item
                        md={2}
                        xs={0}
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Divider
                          orientation="vertical"
                          style={{ height: "100%", width: "1px" }}
                        />
                      </Grid>
                      <Grid item md={5} xs={12}>
                        <Box className="key-indicator-inside-box">
                          <Box>
                            <Typography className="shared-title-design">
                              {
                                keyIndicatorFormattedData[tabNo === 1 ? 0 : 1]
                                  ?.tabData.itemTwo.dividedTextOne
                              }
                            </Typography>
                            <Typography className="shared-title-design">
                              {
                                keyIndicatorFormattedData[tabNo === 1 ? 0 : 1]
                                  ?.tabData.itemTwo.dividedTextTwo
                              }
                            </Typography>
                            <Box className="key-indicator-value-arrow-box">
                              <Box className="indicator-text-box">
                                <Typography id="counsellor-key-indicator-value">
                                  {
                                    keyIndicatorFormattedData[
                                      tabNo === 1 ? 0 : 1
                                    ]?.tabData.itemTwo.value
                                  }
                                </Typography>
                                {keyIndicatorFormattedData[tabNo === 1 ? 0 : 1]
                                  ?.tabData.itemTwo?.indicator && (
                                  <IndicatorComponent
                                    indicator={keyIndicatorChangeIndicator}
                                    title={`${
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemTwo.dividedTextOne
                                    } ${
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemTwo.dividedTextTwo
                                    }`}
                                    performance={
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemTwo.indicatorPosition
                                    }
                                    percentage={
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemTwo.indicatorPercentage
                                    }
                                    fontSize={17}
                                    indicatorSize={18}
                                    iconMargin={3}
                                  ></IndicatorComponent>
                                )}
                              </Box>
                              {tabNo === 1 && (
                                <Box
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => {
                                    if (
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemTwo?.navigate
                                    ) {
                                      navigate(
                                        keyIndicatorFormattedData[
                                          tabNo === 1 ? 0 : 1
                                        ]?.tabData.itemTwo?.navigate,
                                        {
                                          state:
                                            keyIndicatorFormattedData[
                                              tabNo === 1 ? 0 : 1
                                            ]?.tabData.itemTwo?.navigateState,
                                        }
                                      );
                                    }
                                  }}
                                >
                                  <img
                                    width="24px"
                                    height="24px"
                                    src={keyIndicatorArrow}
                                    alt="arrow-icon"
                                  />
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Grid>

                      {/* ==== */}
                      <Grid item md={6} xs={0}>
                        <Divider
                          orientation="horizontal"
                          style={{ height: "100%", width: "100%" }}
                        />
                      </Grid>
                      <Grid item md={6} xs={0}>
                        <Divider
                          orientation="horizontal"
                          style={{ height: "100%", width: "100%" }}
                        />
                      </Grid>
                      <Grid item md={5} xs={12}>
                        <Box className="key-indicator-inside-box">
                          <Box>
                            <Typography className="shared-title-design">
                              {
                                keyIndicatorFormattedData[tabNo === 1 ? 0 : 1]
                                  ?.tabData.itemThree.dividedTextOne
                              }
                            </Typography>
                            <Typography className="shared-title-design">
                              {
                                keyIndicatorFormattedData[tabNo === 1 ? 0 : 1]
                                  ?.tabData.itemThree.dividedTextTwo
                              }
                            </Typography>
                            <Box className="key-indicator-value-arrow-box">
                              <Box className="indicator-text-box">
                                <Typography id="counsellor-key-indicator-value">
                                  {
                                    keyIndicatorFormattedData[
                                      tabNo === 1 ? 0 : 1
                                    ]?.tabData.itemThree.value
                                  }
                                </Typography>
                                {keyIndicatorFormattedData[tabNo === 1 ? 0 : 1]
                                  ?.tabData.itemThree?.indicator && (
                                  <IndicatorComponent
                                    indicator={keyIndicatorChangeIndicator}
                                    title={`${
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemThree.dividedTextOne
                                    } ${
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemThree.dividedTextTwo
                                    }`}
                                    performance={
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemThree.indicatorPosition
                                    }
                                    percentage={
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemThree.indicatorPercentage
                                    }
                                    fontSize={17}
                                    indicatorSize={18}
                                    iconMargin={3}
                                  ></IndicatorComponent>
                                )}
                              </Box>
                              {tabNo === 1 && (
                                <Box
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => {
                                    if (
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemThree?.navigate
                                    ) {
                                      navigate(
                                        keyIndicatorFormattedData[
                                          tabNo === 1 ? 0 : 1
                                        ]?.tabData.itemThree?.navigate,
                                        {
                                          state:
                                            keyIndicatorFormattedData[
                                              tabNo === 1 ? 0 : 1
                                            ]?.tabData.itemThree?.navigateState,
                                        }
                                      );
                                    }
                                  }}
                                >
                                  <img
                                    width="24px"
                                    height="24px"
                                    src={keyIndicatorArrow}
                                    alt="arrow-icon"
                                  />
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid
                        item
                        md={2}
                        xs={0}
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Divider
                          orientation="vertical"
                          style={{ height: "100%", width: "1px" }}
                        />
                      </Grid>
                      <Grid item md={5} xs={12}>
                        <Box className="key-indicator-inside-box">
                          <Box>
                            <Typography className="shared-title-design">
                              {
                                keyIndicatorFormattedData[tabNo === 1 ? 0 : 1]
                                  ?.tabData.itemFour.dividedTextOne
                              }
                            </Typography>
                            <Box className="key-indicator-lead-churn-text-box">
                              <Typography className="shared-title-design">
                                {
                                  keyIndicatorFormattedData[tabNo === 1 ? 0 : 1]
                                    ?.tabData.itemFour.dividedTextTwo
                                }
                              </Typography>
                              {tabNo === 1 && (
                                <Box className="key-indicator-picker-box">
                                  <SelectPicker
                                    data={leadChurnRatioList}
                                    defaultValue="not picked"
                                    appearance="subtle"
                                    value={keyIndicatorLcrType}
                                    cleanable={false}
                                    menuClassName="paid-calculation"
                                    onChange={setKeyIndicatorLcrType}
                                  />
                                </Box>
                              )}
                            </Box>
                            <Box className="key-indicator-value-arrow-box">
                              <Box className="indicator-text-box">
                                <Typography id="counsellor-key-indicator-value">
                                  {
                                    keyIndicatorFormattedData[
                                      tabNo === 1 ? 0 : 1
                                    ]?.tabData.itemFour.value
                                  }
                                </Typography>
                                {keyIndicatorFormattedData[tabNo === 1 ? 0 : 1]
                                  ?.tabData.itemFour?.indicator && (
                                  <IndicatorComponent
                                    indicator={keyIndicatorChangeIndicator}
                                    title={`${
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemFour.dividedTextOne
                                    } ${
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemFour.dividedTextTwo
                                    } ${tabNo === 1 && keyIndicatorLcrType}`}
                                    performance={
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemFour.indicatorPosition
                                    }
                                    percentage={
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemFour.indicatorPercentage
                                    }
                                    fontSize={17}
                                    indicatorSize={18}
                                    iconMargin={3}
                                  ></IndicatorComponent>
                                )}
                              </Box>
                              {tabNo === 1 && (
                                <Box
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => {
                                    if (
                                      keyIndicatorFormattedData[
                                        tabNo === 1 ? 0 : 1
                                      ]?.tabData.itemFour?.navigate
                                    ) {
                                      navigate(
                                        keyIndicatorFormattedData[
                                          tabNo === 1 ? 0 : 1
                                        ]?.tabData.itemFour?.navigate,
                                        {
                                          state:
                                            keyIndicatorFormattedData[
                                              tabNo === 1 ? 0 : 1
                                            ]?.tabData.itemFour?.navigateState,
                                        }
                                      );
                                    }
                                  }}
                                >
                                  <img
                                    width="24px"
                                    height="24px"
                                    src={keyIndicatorArrow}
                                    alt="arrow-icon"
                                  />
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>

                <CustomTabs tabNo={tabNo} setTabNo={setTabNo}></CustomTabs>
              </CardContent>
            </>
          )}
        </Card>
      )}
    </>
  );
};

export default React.memo(CounsellorDashboardKeyIndicators);
