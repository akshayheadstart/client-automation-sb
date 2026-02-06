import { Box, Typography } from "@mui/material";
import "../../../styles/CounsellorQuickView.css";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import IndicatorDropDown from "../../shared/DropDownButton/IndicatorDropDown";
import IndicatorComponent from "../admin-dashboard/IndicatorComponent";
import React, { useContext, useEffect, useState } from "react";
import HorizontalCharts from "../../CustomCharts/HorizontalCharts";
import IndicatorImage from "../../../images/indicatorImage.svg";
import { indicatorValue } from "../../../constants/LeadStageList";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import LiveStudentDialog from "../../LiveStudentDialog/LiveStudentDialog";
import GetJsonDate, { formatTypeDate } from "../../../hooks/GetJsonDate";
import { useGetCounsellorQuickViewDetailsQuery } from "../../../Redux/Slices/adminDashboardSlice";
import useCommonErrorHandling from "../../../hooks/useCommonErrorHandling";
import ErrorAndSomethingWentWrong from "../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";

const CounsellorQuickView = ({ collegeId }) => {
  const [quickViewDataList, setQuickViewDataList] = useState([]);
  const [quickViewChangeIndicator, setQuickViewChangeIndicator] =
    useState(null);
  const [quickViewDateRange, setQuickViewDateRange] = useState([]);

  const [somethingWentWrongInQuickView, setSomethingWentWrongInQuickView] =
    useState(false);
  const [quickViewInternalServerError, setQuickViewInternalServerError] =
    useState(false);
  const [hideQuickView, setHideQuickView] = useState(false);

  //getting data form context
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  const liveApplicants = useSelector(
    (state) => state.authentication.liveApplicantsCount
  );
  const handleError = useCommonErrorHandling();

  const { data, isSuccess, isError, error, isFetching } =
    useGetCounsellorQuickViewDetailsQuery(
      {
        payload: {
          date_range: JSON.parse(GetJsonDate(quickViewDateRange)),
        },
        collegeId,
        quickViewChangeIndicator,
      },
      { skip: collegeId?.length ? false : true }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof data?.data === "object") {
          const quickViewData = data?.data;
          const quickViewDetails = [
            {
              title: "Lead Assigned",
              value: quickViewData?.lead_assigned,
              indicatorPercentage: quickViewData?.lead_assigned_perc,
              indicaTorPosition: quickViewData?.lead_assigned_pos,
              indicatorTitle: "Lead Assigned",
              navigate: "/lead-manager#lead-manager-container",
              navigateState: {
                admin_dashboard: true,
                filters: {
                  is_verify: "",
                  date_range:
                    quickViewDateRange?.length > 0
                      ? {
                          start_date: quickViewDateRange?.[0]
                            ? formatTypeDate(quickViewDateRange?.[0])
                            : "",
                          end_date: quickViewDateRange?.[1]
                            ? formatTypeDate(quickViewDateRange?.[1])
                            : "",
                        }
                      : {},
                },
              },
              indicatorTooltipPosition: "right",
              chartsData: [
                {
                  plotName: "Fresh",
                  value: quickViewData?.fresh_leads,
                  color: "#11BED2",
                  navigate: "/lead-manager",
                  navigateState: {
                    dataType: "fresh_lead",
                  },
                },
                {
                  plotName: "Follow up",
                  value: quickViewData?.followup_leads,
                  color: "#008BE2",
                  navigate: "/lead-manager",
                  navigateState: {
                    dataType: "follow_up",
                  },
                },
                {
                  plotName: "Interested",
                  value: quickViewData?.interested_leads,
                  color: "#00465F",
                  navigate: "/lead-manager",
                  navigateState: {
                    dataType: "interested",
                  },
                },
              ],
            },
            {
              title: "Verified Leads",
              value: quickViewData?.verified_leads,
              indicatorPercentage: quickViewData?.verified_leads_perc,
              indicaTorPosition: quickViewData?.verified_leads_pos,
              indicatorTitle: "Verified Leads",
              indicatorTooltipPosition: "right",
              navigate: "/lead-manager#lead-manager-container",
              navigateState: {
                admin_dashboard: true,
                filters: {
                  is_verify: "verified",
                  date_range:
                    quickViewDateRange?.length > 0
                      ? {
                          start_date: quickViewDateRange?.[0]
                            ? formatTypeDate(quickViewDateRange?.[0])
                            : "",
                          end_date: quickViewDateRange?.[1]
                            ? formatTypeDate(quickViewDateRange?.[1])
                            : "",
                        }
                      : {},
                },
              },
            },
            {
              title: "Form Initiated",
              value: quickViewData?.form_initiated,
              indicatorPercentage: quickViewData?.form_initiated_perc,
              indicaTorPosition: quickViewData?.form_initiated_pos,
              indicatorTitle: "Form Initiated",
              indicatorTooltipPosition: "right",
              navigate: "/application-manager#application-manager-container",
              navigateState: {
                admin_dashboard: true,
                filters: {
                  date_range:
                    quickViewDateRange?.length > 0
                      ? {
                          start_date: quickViewDateRange?.[0]
                            ? formatTypeDate(quickViewDateRange?.[0])
                            : "",
                          end_date: quickViewDateRange?.[1]
                            ? formatTypeDate(quickViewDateRange?.[1])
                            : "",
                        }
                      : {},
                },
              },
            },
            {
              title: "Applicants live on dashboard",
              value: liveApplicants?.live_students_count
                ? liveApplicants?.live_students_count
                : 0,
            },
            {
              title: "Total Applications",
              value: quickViewData?.total_applicants,
              indicatorPercentage: quickViewData?.total_applicants_perc,
              indicaTorPosition: quickViewData?.total_applicants_pos,
              indicatorTitle: "Total Applications",
              indicatorTooltipPosition: "right",
              navigate: "/paid-applications#paid-application-manager-container",
              navigateState: {
                admin_dashboard: true,
                filters: {
                  is_verify: "",
                  date_range:
                    quickViewDateRange?.length > 0
                      ? {
                          start_date: quickViewDateRange?.[0]
                            ? formatTypeDate(quickViewDateRange?.[0])
                            : "",
                          end_date: quickViewDateRange?.[1]
                            ? formatTypeDate(quickViewDateRange?.[1])
                            : "",
                        }
                      : {},
                },
              },
            },
          ];
          setQuickViewDataList(quickViewDetails);
        } else {
          throw new Error(
            "Counsellor quick view API response has been changed"
          );
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError: setQuickViewInternalServerError,
          setHide: setHideQuickView,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInQuickView,
        setHideQuickView,
        5000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, isSuccess, liveApplicants]);

  useEffect(() => {
    if (quickViewDateRange?.length > 1) {
      setStartDateRange(getDateMonthYear(quickViewDateRange[0]));
      setEndDateRange(getDateMonthYear(quickViewDateRange[1]));
    }
  }, [quickViewDateRange]);

  const navigate = useNavigate();
  //Live Student Dialog
  const [openLiveStudent, setLiveStudentOpen] = useState(false);

  const handleClickLiveStudentOpen = () => {
    setLiveStudentOpen(true);
  };

  const handleLiveStudentClose = () => {
    setLiveStudentOpen(false);
  };

  if (hideQuickView) {
    return null;
  }

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["c2a62998"]?.features?.["345e082b"]
        ?.features
    );
  }, [permissions]);

  return (
    <Box
      className="counsellor-quick-view-card"
      sx={{ px: "32px", pt: "20px", pb: "5px", boxSizing: "unset" }}
    >
      {quickViewDateRange?.length > 1 && (
        <DateRangeShowcase
          startDateRange={startDateRange}
          endDateRange={endDateRange}
          triggeredFunction={() => setQuickViewDateRange([])}
        ></DateRangeShowcase>
      )}
      <Box className="counsellor-quick-view-card-content">
        {somethingWentWrongInQuickView || quickViewInternalServerError ? (
          <ErrorAndSomethingWentWrong
            isInternalServerError={quickViewInternalServerError}
            isSomethingWentWrong={somethingWentWrongInQuickView}
            containerHeight="20vh"
          />
        ) : (
          <>
            {isFetching ? (
              <Box
                className="loader-container"
                sx={{ minHeight: "30vh !important" }}
              >
                <LeefLottieAnimationLoader
                  height={100}
                  width={150}
                ></LeefLottieAnimationLoader>
              </Box>
            ) : (
              <Box
                sx={{ px: 0, pt: 0 }}
                className="counsellor-quick-view-list-wrapper"
              >
                {quickViewDataList?.map((data, index) => (
                  <>
                    <Box
                      // className={
                      //   index === 0 && "counsellor-quick-view-header-box"
                      // }
                      sx={{
                        minWidth:
                          index === 0 &&
                          data?.chartsData?.some((chart) => chart?.value > 0)
                            ? "150px"
                            : "auto",
                      }}
                    >
                      <Typography className="counsellor-quick-view-title-design">
                        {data?.title}
                      </Typography>

                      <Box className="indicator-text-box">
                        <Typography
                          id="counsellor-quick-view-value"
                          onClick={() => {
                            if (features?.["6def2683"]?.visibility) {
                              if (data?.navigate) {
                                navigate(data?.navigate, {
                                  state: data?.navigateState,
                                });
                              }

                              if (data?.value && index === 3) {
                                handleClickLiveStudentOpen();
                              }
                            }
                          }}
                        >
                          {data?.value ? data?.value : 0}
                        </Typography>
                        {index !== 3 && (
                          <IndicatorComponent
                            indicator={quickViewChangeIndicator}
                            title={data.title}
                            performance={data.indicaTorPosition}
                            percentage={
                              data?.indicatorPercentage
                                ? data?.indicatorPercentage
                                : "0"
                            }
                            tooltipPosition={data?.indicatorTooltipPosition}
                            fontSize={17}
                            indicatorSize={18}
                            iconMargin={3}
                          ></IndicatorComponent>
                        )}
                      </Box>

                      {index === 0 &&
                      data?.chartsData?.some((chart) => chart?.value > 0) &&
                      data?.value > 0 ? (
                        <Box
                          className="counsellor-quick-view-vertical-representation"
                          // sx={{ display: data?.value ? "block" : "none" }}
                        >
                          <HorizontalCharts
                            data={data?.chartsData}
                          ></HorizontalCharts>
                        </Box>
                      ) : (
                        ""
                      )}
                    </Box>

                    {index === quickViewDataList?.length - 1 || (
                      <Box className="counsellor-quick-view-vertical-line"></Box>
                    )}
                  </>
                ))}
                <Box className="counsellor-quick-view-filter-box">
                  {features?.["459616b8"]?.visibility && (
                    <>
                      {quickViewDateRange?.length === 0 && (
                        <IndicatorDropDown
                          indicator={quickViewChangeIndicator}
                          image={IndicatorImage}
                          indicatorValue={indicatorValue}
                          setIndicator={setQuickViewChangeIndicator}
                        ></IndicatorDropDown>
                      )}
                    </>
                  )}

                  {features?.["3e7e725e"]?.visibility && (
                    <IconDateRangePicker
                      onChange={(value) => {
                        setQuickViewDateRange(value);
                      }}
                      dateRange={quickViewDateRange}
                    />
                  )}
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
      {openLiveStudent && (
        <LiveStudentDialog
          openLiveStudent={openLiveStudent}
          handleLiveStudentClose={handleLiveStudentClose}
          liveApplicantsCount={liveApplicants}
        ></LiveStudentDialog>
      )}
    </Box>
  );
};

export default React.memo(CounsellorQuickView);
