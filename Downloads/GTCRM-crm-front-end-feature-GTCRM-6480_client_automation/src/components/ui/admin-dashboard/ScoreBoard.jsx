import React, { useContext, useEffect, useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import IndicatorImage from "../../../images/indicatorImage.svg";
import "../../../styles/sharedStyles.css";

import { startAndEndDateSelect } from "../../../utils/adminDashboardDateRangeSelect";
import {
  applicationStages,
  indicatorValue,
} from "../../../constants/LeadStageList";
import IndicatorComponent from "./IndicatorComponent";
import { useNavigate } from "react-router-dom";

import HorizontalCharts from "../../CustomCharts/HorizontalCharts";
import IndicatorDropDown from "../../shared/DropDownButton/IndicatorDropDown";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import { SelectPicker } from "rsuite";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import { useGetScoreBoardDataQuery } from "../../../Redux/Slices/adminDashboardSlice";
import { adminDashboardApiPayload } from "../../../utils/AdminDashboardApiPayload";
import { useSelector } from "react-redux";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import useCommonErrorHandling from "../../../hooks/useCommonErrorHandling";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import ErrorAndSomethingWentWrong from "../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
function ScoreBoard({
  collegeId,
  apiCallingConditions,
  isScrolledToScoreBoard,
}) {
  const selectedSeason = useSelector(
    (state) => state.authentication.selectedSeason
  );

  const navigate = useNavigate();
  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  const [scoreboardModifiedData, setScoreboardModifiedData] = useState([]);
  const [hideScoreBoard, setHideScoreBoard] = useState(false);

  const [scoreBoardDateRange, setScoreBoardDateRange] = useState([]);
  const [scoreBoardIndicator, setScoreBoardIndicator] = useState(null);
  const [scoreBoardApplicationType, setScoreBoardApplicationType] =
    useState("paid");

  const {
    setApiResponseChangeMessage,
    scoreBoardInternalServerError,
    setScoreBoardInternalServerError,
    somethingWentWrongInScoreBoard,
    setSomethingWentWrongInScoreBoard,
  } = useContext(DashboradDataContext);

  const handleError = useCommonErrorHandling();

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["e7d559dc"]?.features?.["e7cb13a0"]
        ?.features
    );
  }, [permissions]);

  const { data, isFetching, isError, error, isSuccess } =
    useGetScoreBoardDataQuery(
      {
        scoreBoardApplicationType,
        scoreBoardIndicator,
        collegeId,
        payloadForScoreBoard: adminDashboardApiPayload({
          dateRange: scoreBoardDateRange,
          selectedSeason,
        }),
      },
      { skip: apiCallingConditions && isScrolledToScoreBoard ? false : true }
    );

  useEffect(() => {
    if (scoreBoardDateRange?.length > 1) {
      setStartDateRange(getDateMonthYear(scoreBoardDateRange[0]));
      setEndDateRange(getDateMonthYear(scoreBoardDateRange[1]));
    } else if (selectedSeason) {
      startAndEndDateSelect(selectedSeason, setStartDateRange, setEndDateRange);
    }

    try {
      if (isSuccess) {
        if (typeof data?.data[0] === "object") {
          const scoreBoardData = data?.data[0];
          setScoreboardModifiedData([
            {
              title: "Applications",
              value: scoreBoardData?.application_count,
              indicatorPercentage: scoreBoardData?.application_count_percentage,
              indicaTorPosition: scoreBoardData?.application_count_position,
              indicatorTitle: `Applications ${scoreBoardApplicationType}`,
              indicatorTooltipPosition: "right",
              navigate:
                scoreBoardApplicationType === "paid" ||
                scoreBoardApplicationType === "submitted"
                  ? "/application-manager#application-manager-container"
                  : "",
              navigateState: {
                admin_dashboard: true,
                filters: {
                  payment_status:
                    scoreBoardApplicationType === "paid" ? ["captured"] : [],
                  application_stage: {
                    application_stage_name:
                      scoreBoardApplicationType === "submitted"
                        ? "completed"
                        : "",
                  },
                  date_range: {
                    start_date: scoreBoardDateRange?.[0],
                    end_date: scoreBoardDateRange?.[1],
                  },
                },
              },
            },
            {
              title: "Leads",
              value: scoreBoardData?.total_lead,
              indicatorPercentage: scoreBoardData?.lead_percentage,
              indicaTorPosition: scoreBoardData?.lead_position,
              indicatorTitle: "Total Lead",
              indicatorTooltipPosition: "right",
              navigate: "/lead-manager#lead-manager-container",
              navigateState: {
                admin_dashboard: true,
                filters: {
                  date_range: {
                    start_date: scoreBoardDateRange?.[0],
                    end_date: scoreBoardDateRange?.[1],
                  },
                  lead_stage: {
                    lead_b: true,
                    lead_name: [],
                  },
                },
              },
              chartsData: [
                {
                  plotName: "Verified",
                  value: scoreBoardData?.verify_student,
                  color: "#11BED2",
                  navigate: "/lead-manager#lead-manager-container",
                  navigateState: {
                    admin_dashboard: true,
                    filters: {
                      is_verify: "verified",
                      date_range: {
                        start_date: scoreBoardDateRange?.[0],
                        end_date: scoreBoardDateRange?.[1],
                      },
                      lead_stage: {
                        lead_b: true,
                        lead_name: [],
                      },
                    },
                  },
                },
                {
                  plotName: "Unverified",
                  value: scoreBoardData?.un_verify_student,
                  color: "#008BE2",
                  navigate: "/lead-manager#lead-manager-container",
                  navigateState: {
                    admin_dashboard: true,
                    filters: {
                      is_verify: "unverified",
                      date_range: {
                        start_date: scoreBoardDateRange?.[0],
                        end_date: scoreBoardDateRange?.[1],
                      },
                      lead_stage: {
                        lead_b: true,
                        lead_name: [],
                      },
                    },
                  },
                },
              ],
            },
            {
              title: "Applications Initiated",
              value: scoreBoardData?.form_initiated,
              indicatorPercentage: scoreBoardData?.form_initiated_percentage,
              indicaTorPosition: scoreBoardData?.form_initiated_position,
              indicatorTitle: "Total Application Initiated",
              indicatorTooltipPosition: "right",
              navigate: "/application-manager#application-manager-container",
              navigateState: {
                admin_dashboard: true,
                filters: {
                  date_range: {
                    start_date: scoreBoardDateRange?.[0],
                    end_date: scoreBoardDateRange?.[1],
                  },
                },
              },
              chartsData: [
                {
                  plotName: "Payment Initiated",
                  value: scoreBoardData?.payment_init_but_not_paid,
                  color: "#11BED2",
                  navigate:
                    "/application-manager#application-manager-container",
                  navigateState: {
                    admin_dashboard: true,
                    filters: {
                      payment_status: ["started"],
                      date_range: {
                        start_date: scoreBoardDateRange?.[0],
                        end_date: scoreBoardDateRange?.[1],
                      },
                    },
                  },
                },
                {
                  plotName: "Payment Not Initiated",
                  value: scoreBoardData?.payment_not_initiated,
                  color: "#008BE2",
                  navigate:
                    "/application-manager#application-manager-container",
                  navigateState: {
                    admin_dashboard: true,
                    filters: {
                      payment_status: ["not started"],
                      date_range: {
                        start_date: scoreBoardDateRange?.[0],
                        end_date: scoreBoardDateRange?.[1],
                      },
                    },
                  },
                },
              ],
            },
            {
              title: "Communications",
              value: scoreBoardData?.total_communication,
              indicatorPercentage:
                scoreBoardData?.total_communication_percentage,
              indicaTorPosition: scoreBoardData?.total_communication_position,
              indicatorTitle: "Communications",
              indicatorTooltipPosition: "top",
              navigate: "/communicationPerformance",

              chartsData: [
                {
                  plotName: "Email",
                  value: scoreBoardData?.total_email,
                  color: "#008BE2",
                },
                {
                  plotName: "WhatsApp",
                  value: scoreBoardData?.total_whatsapp,
                  color: "#0FABBD",
                },
                {
                  plotName: "SMS",
                  value: scoreBoardData?.total_sms,
                  color: "#00465F",
                },
              ],
            },
          ]);
        } else {
          throw new Error("Scoreboard api response has been changed");
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError: setScoreBoardInternalServerError,
          setHide: setHideScoreBoard,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInScoreBoard,
        setHideScoreBoard,
        5000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    scoreBoardDateRange,
    selectedSeason,
    scoreBoardApplicationType,
    isSuccess,
    isError,
    error,
    data,
  ]);

  if (hideScoreBoard) {
    return null;
  }

  return (
    <>
      {isFetching ? (
        <Card className="loader-wrapper-scoreboard">
          <LeefLottieAnimationLoader height={100} width={150} />
        </Card>
      ) : (
        <>
          {scoreBoardInternalServerError || somethingWentWrongInScoreBoard ? (
            <Card>
              <ErrorAndSomethingWentWrong
                isInternalServerError={scoreBoardInternalServerError}
                isSomethingWentWrong={somethingWentWrongInScoreBoard}
                containerHeight="20vh"
              />
            </Card>
          ) : (
            <Box className="shared-admin-dashboard-box" sx={{ mt: 1 }}>
              {scoreBoardDateRange?.length > 1 && (
                <DateRangeShowcase
                  startDateRange={startDateRange}
                  endDateRange={endDateRange}
                  triggeredFunction={() => setScoreBoardDateRange([])}
                ></DateRangeShowcase>
              )}
              <Box sx={{ p: 0 }} className="score-board-card-content">
                <Box className="score-board-card-content-inside">
                  <Box
                    sx={{ px: 0, pt: 0 }}
                    className="scoreboard-list-wrapper"
                  >
                    {scoreboardModifiedData.map((data, index) => (
                      <>
                        <Box className={index === 0 || "scoreboard-header-box"}>
                          <Typography className="scoreboard-title-design">
                            {data?.title}
                          </Typography>
                          {index === 0 && (
                            <Box
                              sx={{ ml: -1.5 }}
                              className="scoreboard-picker-box"
                            >
                              <SelectPicker
                                data={applicationStages}
                                defaultValue="paid"
                                appearance="subtle"
                                value={scoreBoardApplicationType}
                                cleanable={false}
                                menuClassName="paid-calculation"
                                onChange={setScoreBoardApplicationType}
                              />
                            </Box>
                          )}
                          <Box className={"scoreboard"}>
                            <Box className="indicator-text-box">
                              <Typography
                                color="#333333"
                                onClick={() => {
                                  if (features?.["8759379f"]?.visibility) {
                                    if (data?.navigate) {
                                      navigate(data?.navigate, {
                                        state: data?.navigateState,
                                      });
                                    }
                                  }
                                }}
                                className="scoreboard-value-text"
                                mr={0.5}
                              >
                                {data?.value ? data?.value : 0}
                              </Typography>
                              <IndicatorComponent
                                indicator={scoreBoardIndicator}
                                title={data?.indicatorTitle}
                                performance={data.indicaTorPosition}
                                percentage={
                                  data?.indicatorPercentage
                                    ? data?.indicatorPercentage
                                    : "0"
                                }
                                tooltipPosition={data?.indicatorTooltipPosition}
                                fontSize={17}
                                indicatorSize={20}
                                iconMargin={4}
                              ></IndicatorComponent>
                            </Box>
                          </Box>
                          {index === 0 || (
                            <Box
                              sx={{
                                mt: data?.value ? "12px" : "0px",
                                display: data?.value ? "block" : "none",
                              }}
                            >
                              <HorizontalCharts
                                data={data?.chartsData}
                              ></HorizontalCharts>
                            </Box>
                          )}
                        </Box>

                        {index === scoreboardModifiedData.length - 1 || (
                          <Box className="scoreboard-header-vertical-line"></Box>
                        )}
                      </>
                    ))}
                  </Box>
                  <Box className="scoreboard-filter-box">
                    {features?.["f8235846"]?.visibility && (
                      <>
                        {scoreBoardDateRange?.length === 0 && (
                          <IndicatorDropDown
                            indicator={scoreBoardIndicator}
                            image={IndicatorImage}
                            indicatorValue={indicatorValue}
                            setIndicator={setScoreBoardIndicator}
                            position={"bottomEnd"}
                          ></IndicatorDropDown>
                        )}
                      </>
                    )}

                    {features?.["89cb6a4a"]?.visibility && (
                      <IconDateRangePicker
                        onChange={(value) => {
                          setScoreBoardDateRange(value);
                        }}
                        dateRange={scoreBoardDateRange}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  );
}

export default React.memo(ScoreBoard);
