import { Box, Card, Divider, Grid, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import IndicatorDropDown from "../../shared/DropDownButton/IndicatorDropDown";
import { indicatorValue } from "../../../constants/LeadStageList";

import IndicatorImage from "../../../images/indicatorImage.svg";
import CustomTabs from "../../shared/tab-panel/CustomTabs";
import "../../../styles/keyIndicator.css";
import "../../../styles/sharedStyles.css";
import "../../../styles/AdminDashboard.css";
import IndicatorComponent from "./IndicatorComponent";

import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import LiveStudentDialog from "../../LiveStudentDialog/LiveStudentDialog";
import { useGetKeyIndicatorDetailsQuery } from "../../../Redux/Slices/adminDashboardSlice";
import { adminDashboardApiPayload } from "../../../utils/AdminDashboardApiPayload";
import useCommonErrorHandling from "../../../hooks/useCommonErrorHandling";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import ErrorAndSomethingWentWrong from "../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
const KeyIndicator = (props) => {
  const {
    hideCourseList,
    setSkipCourseApiCall,
    courseDetails,
    courseListInfo,
    isScrolledToKeyIndicator,
    apiCallingConditions,
    collegeId,
  } = props;
  const [tabNo, setTabNo] = useState(1);
  const liveApplicantsCount = useSelector(
    (state) => state.authentication.liveApplicantsCount
  );
  const [keyIndicatorData, setKeyIndicatorData] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState([]);
  const [appliedCourseId, setAppliedCourseId] = useState([]);
  const [keyIndicatorIndicator, setKeyIndicatorIndicator] = useState("");
  const [hideKeyIndicator, setHideKeyIndicator] = useState(false);

  const [
    somethingWentWrongInKeyIndicator,
    setSomethingWentWrongInAKeyIndicator,
  ] = useState(false);
  const [keyIndicatorInternalServerError, setKeyIndicatorInternalServerError] =
    useState(false);

  const selectedSeason = useSelector(
    (state) => state.authentication.selectedSeason
  );

  const navigate = useNavigate();
  const hyperLinkPermission = useSelector(
    (state) =>
      state?.authentication?.permissions?.menus?.dashboard?.admin_dashboard
        ?.features?.hyper_link
  );

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["e7d559dc"]?.features?.["acdbd75a"]
        ?.features
    );
  }, [permissions]);

  //Live Student Dialog
  const [openLiveStudent, setLiveStudentOpen] = React.useState(false);
  const handleError = useCommonErrorHandling();

  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  const { data, isError, error, isFetching, isSuccess } =
    useGetKeyIndicatorDetailsQuery(
      {
        keyIndicatorIndicator,
        collegeId,
        payload: {
          ...JSON.parse(
            adminDashboardApiPayload({
              dateRange: {},
              selectedSeason,
              programName: appliedCourseId,
            })
          ),
        },
      },
      { skip: apiCallingConditions && isScrolledToKeyIndicator ? false : true }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          const keyIndicatorDetails = data?.data[0];

          const formattedKeyIndicatorDetails = [
            {
              tabData: {
                itemOne: {
                  dividedTextOne: "Payment",
                  dividedTextTwo: "Initiated",
                  value: keyIndicatorDetails.payment_init,
                  indicatorPercentage:
                    keyIndicatorDetails?.payment_init_perc || 0,
                  indicatorPosition:
                    keyIndicatorDetails?.payment_init_position || "equal",
                  indicator: true,
                  tab: 1,
                  navigate: "/form-manager#form-manager-container",
                  navigateState: {
                    admin_dashboard: true,
                    filters: {
                      payment_status: ["started"],
                      course: selectedCourseId,
                    },
                  },
                },
                itemTwo: {
                  dividedTextOne: "Applicants live",
                  dividedTextTwo: "on Dashboard",
                  value: liveApplicantsCount?.live_students_count
                    ? liveApplicantsCount?.live_students_count
                    : 0,
                  tab: 1,
                },
                itemThree: {
                  dividedTextOne: "Total",
                  dividedTextTwo: "Payment Failed",
                  value: keyIndicatorDetails?.total_payment_failed,
                  tab: 1,
                  navigate: "/form-manager#form-manager-container",
                  navigateState: {
                    admin_dashboard: true,
                    filters: {
                      payment_status: ["failed"],
                      course: selectedCourseId,
                    },
                  },
                },
                itemFour: {
                  dividedTextOne: "Active",
                  dividedTextTwo: "Queries",
                  value: keyIndicatorDetails?.open_queries,
                  tab: 1,
                },
              },
            },
            {
              tabData: {
                itemOne: {
                  dividedTextOne: "Applications",
                  dividedTextTwo: "Completed > 70%",
                  indicatorPercentage:
                    keyIndicatorDetails?.app_completed_perc || 0,
                  indicatorPosition:
                    keyIndicatorDetails?.app_completed_position || "equal",
                  value: keyIndicatorDetails?.applications_completed,
                  indicator: true,
                  tab: 2,
                  navigate: "/form-manager#form-manager-container",
                  navigateState: {
                    admin_dashboard: true,
                    filters: {
                      application_filling_stage: [
                        {
                          current_stage: 7.5,
                        },
                        {
                          current_stage: 8.75,
                        },
                        {
                          current_stage: 10,
                        },
                      ],
                      course: selectedCourseId,
                    },
                  },
                },
                itemTwo: {
                  dividedTextOne: "Shortlisted",
                  dividedTextTwo: "for GD/PI",
                  indicatorPercentage:
                    keyIndicatorDetails?.shortlisted_app_perc || 0,
                  indicatorPosition:
                    keyIndicatorDetails?.shortlisted_app_position || "equal",
                  value: keyIndicatorDetails?.shortlisted_applications,
                  tab: 2,
                  indicator: true,
                },
                itemThree: {
                  dividedTextOne: "Selected",
                  dividedTextTwo: "Applicants",
                  indicatorPercentage:
                    keyIndicatorDetails?.selected_app_perc || 0,
                  indicatorPosition:
                    keyIndicatorDetails?.selected_app_position || "equal",
                  value: keyIndicatorDetails?.selected_students,
                  tab: 2,
                  indicator: true,
                },
                itemFour: {
                  dividedTextOne: "Offer",
                  dividedTextTwo: "Letter Sent",
                  value: keyIndicatorDetails?.offer_letter_sent,
                  tab: 2,
                },
              },
            },
          ];
          setKeyIndicatorData(formattedKeyIndicatorDetails);
        } else {
          throw new Error("Key indicator API response has been changed");
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError: setKeyIndicatorInternalServerError,
          setHide: setHideKeyIndicator,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInAKeyIndicator,
        setHideKeyIndicator,
        5000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, isSuccess, liveApplicantsCount]);

  const handleClickLiveStudentOpen = () => {
    setLiveStudentOpen(true);
  };

  const handleLiveStudentClose = () => {
    setLiveStudentOpen(false);
  };

  if (hideKeyIndicator) {
    return null;
  }

  return (
    <>
      {isFetching ? (
        <Card className="loader-wrapper">
          <LeefLottieAnimationLoader
            height={100}
            width={150}
          ></LeefLottieAnimationLoader>{" "}
        </Card>
      ) : (
        <>
          {keyIndicatorInternalServerError ||
          somethingWentWrongInKeyIndicator ? (
            <Card>
              <ErrorAndSomethingWentWrong
                isInternalServerError={keyIndicatorInternalServerError}
                isSomethingWentWrong={somethingWentWrongInKeyIndicator}
                containerHeight="20vh"
              />
            </Card>
          ) : (
            <Box className="top-dashboard-box box-aligned-column">
              <Box className="top-dashboard-header-and-filter-section">
                <Box className="title-box-hover">
                  <Typography className="top-section-title">
                    Key Indicators
                  </Typography>
                </Box>
                <Box className="top-dashboard-section-filters-box">
                  {features?.["fefe2c7d"]?.visibility && (
                    <>
                      {hideCourseList || (
                        <MultipleFilterSelectPicker
                          style={{ width: "150px" }}
                          placement="bottomEnd"
                          placeholder="Program Name"
                          onChange={(value) => {
                            setSelectedCourseId(value);
                          }}
                          pickerData={courseDetails}
                          setSelectedPicker={setSelectedCourseId}
                          pickerValue={selectedCourseId}
                          loading={courseListInfo.isFetching}
                          onOpen={() => setSkipCourseApiCall(false)}
                          className="key-select-picker"
                          callAPIAgain={() =>
                            setAppliedCourseId(selectedCourseId)
                          }
                          onClean={() => setAppliedCourseId([])}
                        />
                      )}
                    </>
                  )}
                  {features?.["b9338f8d"]?.visibility && (
                    <Box className="scoreboard-picker">
                      <IndicatorDropDown
                        indicator={keyIndicatorIndicator}
                        image={IndicatorImage}
                        indicatorValue={indicatorValue}
                        setIndicator={setKeyIndicatorIndicator}
                      ></IndicatorDropDown>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box sx={{ my: 2 }}>
                <Grid
                  item
                  container
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                >
                  {/* keyIndicatorFormatedData[tabNo===1?0:1] */}
                  <Grid
                    className="key-indicator-grid-box"
                    item
                    container
                    direction="row"
                    spacing="20px"
                  >
                    <Grid item md={5} xs={12}>
                      <Box className="key-indicator-inside-box">
                        <Box>
                          <Typography className="shared-title-design">
                            {
                              keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                .itemOne.dividedTextOne
                            }
                          </Typography>
                          <Typography className="shared-title-design">
                            {
                              keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                .itemOne.dividedTextTwo
                            }
                          </Typography>

                          <Box className="indicator-text-box">
                            <Typography
                              onClick={() => {
                                if (hyperLinkPermission) {
                                  if (
                                    keyIndicatorData[tabNo === 1 ? 0 : 1]
                                      ?.tabData.itemOne.navigate
                                  ) {
                                    navigate(
                                      keyIndicatorData[tabNo === 1 ? 0 : 1]
                                        ?.tabData.itemOne.navigate,
                                      {
                                        state:
                                          keyIndicatorData[tabNo === 1 ? 0 : 1]
                                            ?.tabData.itemOne.navigateState,
                                      }
                                    );
                                  }
                                }
                              }}
                              color="#333333"
                              className="scoreboard-value-text"
                              mr={0.5}
                            >
                              {
                                keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                  .itemOne.value
                              }
                            </Typography>
                            {keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                              .itemOne?.indicator && (
                              <IndicatorComponent
                                indicator={keyIndicatorIndicator}
                                title={`${
                                  keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                    .itemOne.dividedTextOne
                                } ${
                                  keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                    .itemOne.dividedTextTwo
                                }`}
                                performance={
                                  keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                    .itemOne.indicatorPosition
                                }
                                percentage={
                                  keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                    .itemOne.indicatorPercentage
                                }
                                fontSize={17}
                                indicatorSize={20}
                                iconMargin={5}
                              ></IndicatorComponent>
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
                              keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                .itemTwo.dividedTextOne
                            }
                          </Typography>
                          <Typography className="shared-title-design">
                            {
                              keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                .itemTwo.dividedTextTwo
                            }
                          </Typography>

                          <Box className="indicator-text-box">
                            <Typography
                              color="#333333"
                              className="scoreboard-value-text"
                              mr={0.5}
                              onClick={() => {
                                if (
                                  tabNo === 1 &&
                                  keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                    .itemTwo.value
                                ) {
                                  handleClickLiveStudentOpen();
                                }
                              }}
                            >
                              {
                                keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                  .itemTwo.value
                              }
                            </Typography>
                            {keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                              .itemTwo?.indicator && (
                              <IndicatorComponent
                                indicator={keyIndicatorIndicator}
                                title={`${
                                  keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                    .itemTwo.dividedTextOne
                                } ${
                                  keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                    .itemTwo.dividedTextTwo
                                }`}
                                performance={
                                  keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                    .itemTwo.indicatorPosition
                                }
                                percentage={
                                  keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                    .itemTwo.indicatorPercentage
                                }
                                fontSize={17}
                                indicatorSize={20}
                                iconMargin={5}
                              ></IndicatorComponent>
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
                              keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                .itemThree.dividedTextOne
                            }
                          </Typography>
                          <Typography className="shared-title-design">
                            {
                              keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                .itemThree.dividedTextTwo
                            }
                          </Typography>

                          <Box className="indicator-text-box">
                            <Typography
                              color="#333333"
                              className="scoreboard-value-text"
                              mr={0.5}
                              onClick={() => {
                                if (hyperLinkPermission) {
                                  if (
                                    keyIndicatorData[tabNo === 1 ? 0 : 1]
                                      ?.tabData.itemThree.navigate
                                  ) {
                                    navigate(
                                      keyIndicatorData[tabNo === 1 ? 0 : 1]
                                        ?.tabData.itemThree.navigate,
                                      {
                                        state:
                                          keyIndicatorData[tabNo === 1 ? 0 : 1]
                                            ?.tabData.itemThree.navigateState,
                                      }
                                    );
                                  }
                                }
                              }}
                            >
                              {
                                keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                  .itemThree.value
                              }
                            </Typography>
                            {keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                              .itemThree?.indicator && (
                              <IndicatorComponent
                                indicator={keyIndicatorIndicator}
                                title={`${
                                  keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                    .itemThree.dividedTextOne
                                } ${
                                  keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                    .itemThree.dividedTextTwo
                                }`}
                                performance={
                                  keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                    .itemThree.indicatorPosition
                                }
                                percentage={
                                  keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                    .itemThree.indicatorPercentage
                                }
                                fontSize={17}
                                indicatorSize={20}
                                iconMargin={5}
                              ></IndicatorComponent>
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
                              keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                .itemFour.dividedTextOne
                            }
                          </Typography>
                          <Typography className="shared-title-design">
                            {
                              keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                .itemFour.dividedTextTwo
                            }
                          </Typography>

                          <Box className="indicator-text-box">
                            <Typography
                              color="#333333"
                              className="scoreboard-value-text"
                              mr={0.5}
                            >
                              {
                                keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                  .itemFour.value
                              }
                            </Typography>
                            {keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                              .itemFour?.indicator && (
                              <IndicatorComponent
                                indicator={keyIndicatorIndicator}
                                title={`${
                                  keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                    .itemFour.dividedTextOne
                                } ${
                                  keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                    .itemFour.dividedTextTwo
                                }`}
                                performance={
                                  keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                    .itemFour.indicatorPosition
                                }
                                percentage={
                                  keyIndicatorData[tabNo === 1 ? 0 : 1]?.tabData
                                    .itemFour.indicatorPercentage
                                }
                                fontSize={17}
                                indicatorSize={20}
                                iconMargin={5}
                              ></IndicatorComponent>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>

              <CustomTabs tabNo={tabNo} setTabNo={setTabNo}></CustomTabs>
              {openLiveStudent && (
                <LiveStudentDialog
                  openLiveStudent={openLiveStudent}
                  handleLiveStudentClose={handleLiveStudentClose}
                  liveApplicantsCount={liveApplicantsCount}
                ></LiveStudentDialog>
              )}
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default KeyIndicator;
