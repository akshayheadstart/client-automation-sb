import { Box, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import "../../../styles/sharedStyles.css";
import "../../../styles/AdminDashboard.css";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import IndicatorImage from "../../../images/indicatorImage.svg";
import { SelectPicker } from "rsuite";
import IndicatorComponent from "../admin-dashboard/IndicatorComponent";
import HorizontalCharts from "../../CustomCharts/HorizontalCharts";
import IndicatorDropDown from "../../shared/DropDownButton/IndicatorDropDown";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import ArrowDownIcon from "../../../icons/arrow-down.svg";
import ArrowUpIcon from "../../../icons/arrow-up.svg";
import {
  indicatorValue,
  leadHeaderLeadStage,
} from "../../../constants/LeadStageList";
import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useToasterHook from "../../../hooks/useToasterHook";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { useGetLeadAndApplicationSummaryQuery } from "../../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
import GetJsonDate from "../../../hooks/GetJsonDate";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import LeadHeaderProgressBar from "./LeadHeaderProgressBar";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import { useNavigate } from "react-router-dom";

const LeadManagerHeader = ({
  application,
  keyName,
  title,
  forms,
  formInitiated,
}) => {
  const [leadHeaderDateRange, setLeadHeaderDateRange] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [leadStage, setLeadStage] = useState("Online");
  const [leadHeaderData, setLeadHeaderData] = useState([]);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [indicator, setIndicator] = useState("");
  const pushNotification = useToasterHook();

  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const theme = useTheme();
  const tabScreen = useMediaQuery(theme.breakpoints.down("md"));
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const isCounsellor = useSelector(
    (state) => state.authentication.token?.scopes?.[0] === "college_counselor"
  );
  const selectedSeason = useSelector(
    (state) => state.authentication.selectedSeason
  );
  const seasonId = selectedSeason?.length
    ? JSON.parse(selectedSeason)?.season_id
    : "";
  const { data, isFetching, isError, error, isSuccess } =
    useGetLeadAndApplicationSummaryQuery({
      collegeId,
      indicator: indicator,
      leadType: leadStage,
      payload: leadHeaderDateRange?.length
        ? GetJsonDate(leadHeaderDateRange)
        : {},
      formInitiated: formInitiated,
      seasonId,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof data === "object") {
          if (application) {
            setLeadHeaderData([
              {
                first: true,
                second: true,
                title: title,
                value: data[keyName],
              },

              {
                first: true,
                second: true,
                showPicker: true,
                title: "Application To Provisional Admission",
                value: `${data?.application_to_provisions_percentage}%`,
                indicatorPercentage:
                  data?.application_to_provisions_percentage_indicator,
                indicaTorPosition: data?.application_to_provisions_position,
                indicatorTitle: `Lead to ${leadStage} Application`,
                indicatorTooltipPosition: "right",
              },
              {
                second: true,
                title: "Form Initiated To Paid Applications",
                value: data?.form_paid_app_perc_diff,
                indicatorPercentage: data?.form_paid_app_perc,
                indicaTorPosition: data?.form_paid_app_position,
                indicatorTitle: `Lead to ${leadStage} Application`,
                indicatorTooltipPosition: "right",
              },

              {
                title: "Offer letter sent",
                value: data?.offer_letter,
                first: true,
                second: true,
              },
              {
                title: "Provisional Admission",
                value: data?.provisional_admission,
                first: true,
                second: true,
              },
            ]);
          } else {
            const headerData = [
              {
                first: true,
                second: true,
                title: title,
                value: data[keyName],
                indicatorPercentage: forms
                  ? data?.total_application_percentage
                  : data?.lead_percentage,
                indicaTorPosition: forms
                  ? data?.total_application_position
                  : data?.lead_position,
                indicatorTitle: title,
                indicatorTooltipPosition: "right",
                chartsData: forms
                  ? [
                      {
                        plotName: "Submitted",
                        value: data?.application_submitted || 0,
                        color: "#008BE2",
                        navigate: "/form-manager#form-manager-container",
                        navigateState: {
                          admin_dashboard: true,
                          filters: {
                            application_stage: {
                              application_stage_name: "completed",
                            },
                          },
                        },
                      },
                      {
                        plotName: "Not Submitted",
                        value: data?.application_not_submitted || 0,
                        color: "#11BED2",
                        navigate: "/form-manager#form-manager-container",
                        navigateState: {
                          admin_dashboard: true,
                          filters: {
                            application_stage: {
                              application_stage_name: "incomplete",
                            },
                          },
                        },
                      },
                    ]
                  : isCounsellor
                  ? [
                      {
                        plotName: "Fresh",
                        value: data?.fresh_lead || 0,
                        color: "#11BED2",
                        navigate: "/form-manager#form-manager-container",
                        navigateState: {
                          admin_dashboard: true,
                          filters: {
                            lead_stage: {
                              lead_name: [
                                {
                                  name: ["Fresh Lead"],
                                  label: [],
                                },
                              ],
                            },
                          },
                        },
                      },
                      {
                        plotName: "Contacted",
                        value: data?.contact_lead_count || 0,
                        color: "#00465F",
                      },
                      {
                        plotName: "Dead/Closed",
                        value: data?.closed_lead || 0,
                        color: "#0041BF",
                      },
                      {
                        plotName: "Not Contacted",
                        value: data?.not_contact_lead_count || 0,
                        color: "#008BE2",
                      },
                    ]
                  : [
                      {
                        plotName: "Online",
                        value: data?.online_lead || 0,
                        color: "#11BED2",
                        navigate: "/lead-manager#lead-manager-container",
                        navigateState: {
                          admin_dashboard: true,
                          filters: {
                            lead_type: {
                              lead_type_name: "online",
                            },
                          },
                        },
                      },
                      {
                        plotName: "Telephony",
                        value: data?.telephony_lead || 0,
                        color: "#00465F",
                      },
                      {
                        plotName: "Offline",
                        value: data?.offline_lead || 0,
                        color: "#008BE2",
                      },
                      {
                        plotName: "API",
                        value: data?.api_lead || 0,
                        color: "#0041BF",
                        navigate: "/lead-manager#lead-manager-container",
                        navigateState: {
                          admin_dashboard: true,
                          filters: {
                            lead_type: {
                              lead_type_name: "api",
                            },
                          },
                        },
                      },
                    ],
              },
              {
                second: isCounsellor ? false : true,
                title: "Overlap",
                value: data?.primary_source,
                indicatorPercentage: data?.primary_percentage,
                indicaTorPosition: data?.primary_position,
                indicatorTitle: `Overlap`,
                indicatorTooltipPosition: "right",
                navigate: "/lead-manager#lead-manager-container",
                navigateState: {
                  admin_dashboard: true,
                  filters: {
                    source_type: ["primary"],
                  },
                },
                chartsData: [
                  {
                    plotName: "Primary",
                    value: data?.primary_source || 0,
                    color: "#11BED2",
                    navigate: "/lead-manager#lead-manager-container",
                    navigateState: {
                      admin_dashboard: true,
                      filters: {
                        source_type: ["primary"],
                      },
                    },
                  },
                  {
                    plotName: "Secondary",
                    value: data?.secondary_source || 0,
                    color: "#008BE2",
                    navigate: "/lead-manager#lead-manager-container",
                    navigateState: {
                      admin_dashboard: true,
                      filters: {
                        source_type: ["secondary"],
                      },
                    },
                  },
                  {
                    plotName: "Tertiary",
                    value: data?.tertiary_source || 0,
                    color: "#00465F",
                    navigate: "/lead-manager#lead-manager-container",
                    navigateState: {
                      admin_dashboard: true,
                      filters: {
                        source_type: ["tertiary"],
                      },
                    },
                  },
                ],
              },

              {
                first: true,
                second: true,
                showPicker: true,
                title: "Leads To",
                value: `${data?.lead_to_application_percentage}%`,
                indicatorPercentage:
                  data?.lead_to_application_percentage_indicator,
                indicaTorPosition: data?.lead_to_application_position_indicator,
                indicatorTitle: `Lead to ${leadStage} Application`,
                indicatorTooltipPosition: "right",
              },
              {
                title: "Form Initiated",
                value: data?.form_initiated || 0,
                second: isCounsellor ? true : false,
                indicatorPercentage: data?.form_initiated_percentage_indicator,
                indicaTorPosition: data?.form_initiated_position_indicator,
                indicatorTitle: "Form Initiated",
                indicatorTooltipPosition: "right",
                navigate: "/form-manager#form-manager-container",
                navigateState: {
                  admin_dashboard: true,
                  filters: {
                    application_filling_stage: [{ current_stage: 2.5 }],
                  },
                },
              },
              {
                title: "Payment Started",
                value: data?.payment_initiated || 0,
                second: isCounsellor ? true : false,
                indicatorPercentage: data?.payment_initiated_percent_indicator,
                indicaTorPosition: data?.payment_initiated_position_indicator,
                indicatorTitle: "Payment Initiated",
                indicatorTooltipPosition: "right",
                navigate: "/form-manager#form-manager-container",
                navigateState: {
                  admin_dashboard: true,
                  filters: {
                    payment_status: ["started"],
                  },
                },
              },
              {
                title: "Fresh Lead",
                value: data?.fresh_lead,
                first: true,
                navigate: "/form-manager#form-manager-container",
                navigateState: {
                  admin_dashboard: true,
                  filters: {
                    lead_stage: {
                      lead_name: [
                        {
                          name: ["Fresh Lead"],
                          label: [],
                        },
                      ],
                    },
                  },
                },
              },
              {
                title: "Followup",
                value: data?.follow_up_lead,
                first: true,
                navigate: "/form-manager#form-manager-container",
                navigateState: {
                  admin_dashboard: true,
                  filters: {
                    lead_stage: {
                      lead_name: [
                        {
                          name: ["Follow-up"],
                          label: [],
                        },
                      ],
                    },
                  },
                },
              },
              {
                second: true,
                progress: [
                  {
                    name: "Fresh Lead",
                    value: data?.fresh_lead || 0,
                    navigate: "/form-manager#form-manager-container",
                    navigateState: {
                      admin_dashboard: true,
                      filters: {
                        lead_stage: {
                          lead_name: [
                            {
                              name: ["Fresh Lead"],
                              label: [],
                            },
                          ],
                        },
                      },
                    },
                  },
                  {
                    name: "Followup",
                    value: data?.follow_up_lead || 0,
                    navigate: "/form-manager#form-manager-container",
                    navigateState: {
                      admin_dashboard: true,
                      filters: {
                        lead_stage: {
                          lead_name: [
                            {
                              name: ["Follow-up"],
                              label: [],
                            },
                          ],
                        },
                      },
                    },
                  },
                  {
                    name: "Interested",
                    value: data?.interested_lead || 0,
                    navigate: "/form-manager#form-manager-container",
                    navigateState: {
                      admin_dashboard: true,
                      filters: {
                        lead_stage: {
                          lead_name: [
                            {
                              name: ["Interested"],
                              label: [],
                            },
                          ],
                        },
                      },
                    },
                  },
                ],
              },
            ];

            setLeadHeaderData(headerData);
          }
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setIsInternalServerError, "", 10000);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [application, data, isSuccess, isError, error, keyName]);

  const navigate = useNavigate();
  // const hyperLinkPermission = useSelector(
  //   (state) =>
  //     state.authentication.permissions.menus?.dashboard?.admin_dashboard
  //       ?.features?.hyper_link
  // );
  return (
    <Box
      className="shared-admin-dashboard-box"
      sx={{
        mb: 2,
        mt: 4,
        px: 4,
        py: 1,
        border: "1px solid #008be2",
        minHeight: "auto",
      }}
    >
      {isInternalServerError || isSomethingWentWrong ? (
        <Box>
          {isInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {isSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          {isFetching ? (
            <>
              <LeefLottieAnimationLoader width={100} height={100} />
            </>
          ) : (
            <>
              <Box sx={{ position: "relative", top: "-22px", left: "-35px" }}>
                {leadHeaderDateRange?.length > 1 && (
                  <DateRangeShowcase
                    startDateRange={getDateMonthYear(leadHeaderDateRange[0])}
                    endDateRange={getDateMonthYear(leadHeaderDateRange[1])}
                    triggeredFunction={() => setLeadHeaderDateRange([])}
                  ></DateRangeShowcase>
                )}
              </Box>
              <Box sx={{ p: 0 }} className="score-board-card-content">
                <Box
                  sx={{
                    flexDirection: tabScreen ? "column !important" : "row",
                    gap: 2,
                    height: !tabScreen
                      ? showFilter
                        ? "150px"
                        : "100px"
                      : "auto",
                  }}
                  className="score-board-card-content-inside"
                >
                  <Box
                    className="scoreboard-list-wrapper lead-manager-header-wrapper"
                    sx={{
                      px: 0,
                      pt: 0,
                      alignItems: tabScreen
                        ? "flex-start"
                        : "center !important",
                      gap: `${tabScreen ? "1.5rem" : "8px"} !important`,
                      flexDirection: tabScreen ? "column !important" : "row",
                    }}
                  >
                    {leadHeaderData
                      .filter((data) => data[showFilter ? "second" : "first"])
                      .map((data) => (
                        <>
                          {data?.progress ? (
                            <Box
                              sx={{
                                flex: 100,
                              }}
                            >
                              {data.progress?.map((stage) => (
                                <LeadHeaderProgressBar
                                  stage={stage}
                                  progress={data.progress}
                                />
                              ))}
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                flex: 100,
                              }}
                            >
                              <Box>
                                {!data.showPicker && (
                                  <Typography className="scoreboard-title-design">
                                    {data?.title}
                                  </Typography>
                                )}
                                {data.showPicker && (
                                  <>
                                    <Box
                                      sx={{
                                        display: application
                                          ? "inline"
                                          : "flex",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                      }}
                                      className="scoreboard-picker-box"
                                    >
                                      <Typography
                                        sx={{
                                          display: application
                                            ? "inline"
                                            : "block",
                                        }}
                                        className="scoreboard-title-design"
                                      >
                                        {data?.title}
                                      </Typography>

                                      <SelectPicker
                                        searchable={false}
                                        data={leadHeaderLeadStage}
                                        appearance="subtle"
                                        value={leadStage}
                                        cleanable={false}
                                        menuClassName="paid-calculation"
                                        onChange={setLeadStage}
                                      />
                                      {!application && (
                                        <Typography className="scoreboard-title-design">
                                          Application
                                        </Typography>
                                      )}
                                    </Box>
                                  </>
                                )}
                                <Box sx={{ mt: -1 }} className={"scoreboard"}>
                                  <Box className="indicator-text-box">
                                    <Typography
                                      color="#333333"
                                      variant="h3"
                                      mr={0.5}
                                      onClick={() => {
                                        // if (hyperLinkPermission) {
                                        if (data?.navigate) {
                                          navigate(data?.navigate, {
                                            state: data?.navigateState,
                                          });
                                        }
                                        // }
                                      }}
                                    >
                                      {data?.value ? data?.value : 0}
                                    </Typography>
                                    {data?.indicaTorPosition && (
                                      <IndicatorComponent
                                        // indicator={scoreBoardIndicator}
                                        title={data.title}
                                        performance={data.indicaTorPosition}
                                        percentage={
                                          data?.indicatorPercentage
                                            ? data?.indicatorPercentage
                                            : "0"
                                        }
                                        tooltipPosition={
                                          data?.indicatorTooltipPosition
                                        }
                                        fontSize={18}
                                        indicatorSize={20}
                                        iconMargin={5}
                                      ></IndicatorComponent>
                                    )}
                                  </Box>
                                </Box>
                                {showFilter &&
                                  data?.chartsData?.some(
                                    (data) => data?.value > 0
                                  ) && (
                                    <Box className="interview-list-vertical-representation">
                                      <HorizontalCharts
                                        data={data?.chartsData}
                                      ></HorizontalCharts>
                                    </Box>
                                  )}
                              </Box>
                            </Box>
                          )}

                          <Box
                            sx={{
                              alignSelf: "center",
                              marginTop: "-5px",
                              flex: showFilter ? 5 : 30,
                              display: tabScreen ? "none" : "flex",
                              justifyContent: showFilter
                                ? "center"
                                : "flex-start",
                            }}
                            className="lead-manager-header-line"
                          >
                            <Box
                              sx={{
                                height: showFilter ? "140px" : "100px",
                                background: "rgba(0, 139, 226, 0.3)",
                                width: "1px",
                              }}
                            ></Box>
                          </Box>
                        </>
                      ))}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.8,
                      alignItems: "flex-end",
                      flexDirection: "column",
                      justifyContent: showFilter ? "space-between" : "flex-end",
                    }}
                  >
                    {showFilter && (
                      <Box sx={{ display: "flex", gap: 0.8 }}>
                        <IconDateRangePicker
                          onChange={(value) => {
                            setLeadHeaderDateRange(value);
                          }}
                          dateRange={leadHeaderDateRange}
                        />
                        <IndicatorDropDown
                          indicator={indicator}
                          image={IndicatorImage}
                          indicatorValue={indicatorValue}
                          setIndicator={setIndicator}
                          position={"bottomEnd"}
                        ></IndicatorDropDown>
                      </Box>
                    )}

                    <img
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowFilter((prev) => !prev)}
                      src={showFilter ? ArrowUpIcon : ArrowDownIcon}
                      alt="arrow-down"
                    />
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default LeadManagerHeader;
