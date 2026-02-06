import { Box, Card, Typography } from "@mui/material";
import React from "react";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import { useState } from "react";
import { useEffect } from "react";
import LeadStageDetailsProgressBar from "../counsellor-dashboard/LeadStageDetailsProgressBar";
import "../../../styles/applicationSteps.css";
import "../../../styles/sharedStyles.css";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import { startAndEndDateSelect } from "../../../utils/adminDashboardDateRangeSelect";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import { useMemo } from "react";
import { formStageList } from "../../../constants/LeadStageList";
import { useGetApplicationStepWiseDetailsQuery } from "../../../Redux/Slices/adminDashboardSlice";
import { adminDashboardApiPayload } from "../../../utils/AdminDashboardApiPayload";
import useCommonErrorHandling from "../../../hooks/useCommonErrorHandling";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import ErrorAndSomethingWentWrong from "../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { calculatePercentageOfValue } from "../../../pages/StudentTotalQueries/helperFunction";
import { useSelector } from "react-redux";

const ApplicationSteps = ({
  collegeId,
  selectedSeason,
  counsellorList,
  hideCounsellorList,
  loadingCounselorList,
  setSkipCounselorApiCall,
  hideCourseList,
  setSkipCourseApiCall,
  courseDetails,
  courseListInfo,
  apiCallingCondition,
  isScrolledToApplicationSteps,
  hideSourceList,
  sourceList,
  sourceListInfo,
  setSkipSourceApiCall,
}) => {
  const [applicationStepsData, setApplicationStepsData] = useState([]);
  const [applicationStepsDateRange, setApplicationStepsDateRange] = useState(
    []
  );
  const [selectedCounselor, setSelectedCounselor] = useState([]);
  const [appliedCounselor, setAppliedCounselor] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [appliedCourse, setAppliedCourse] = useState([]);

  const [selectedSource, setSelectedSource] = useState([]);
  const [appliedSource, setAppliedSource] = useState([]);

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["e7d559dc"]?.features?.["cff4944d"]
        ?.features
    );
  }, [permissions]);

  const [
    somethingWentWrongInApplicationSteps,
    setSomethingWentWrongInApplicationSteps,
  ] = useState(false);
  const [
    applicationStepsInternalServerError,
    setApplicationStepsInternalServerError,
  ] = useState(false);
  const [hideApplicationSteps, setHideApplicationSteps] = useState(false);

  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");

  const handleError = useCommonErrorHandling();

  const { data, isSuccess, isFetching, isError, error } =
    useGetApplicationStepWiseDetailsQuery(
      {
        collegeId,
        payload: {
          ...JSON.parse(
            adminDashboardApiPayload({
              dateRange: applicationStepsDateRange,
              selectedSeason,
              counselorIds: appliedCounselor,
              programName: appliedCourse,
              source: appliedSource,
            })
          ),
        },
      },
      {
        skip:
          apiCallingCondition && isScrolledToApplicationSteps ? false : true,
      }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setApplicationStepsData(data?.data[0]);
        } else {
          throw new Error("Application Steps API response has been changed");
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError: setApplicationStepsInternalServerError,
          setHide: setHideApplicationSteps,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInApplicationSteps,
        setHideApplicationSteps,
        5000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, isSuccess]);

  useEffect(() => {
    if (applicationStepsDateRange?.length > 1) {
      setStartDateRange(getDateMonthYear(applicationStepsDateRange[0]));
      setEndDateRange(getDateMonthYear(applicationStepsDateRange[1]));
    } else if (selectedSeason) {
      startAndEndDateSelect(selectedSeason, setStartDateRange, setEndDateRange);
    }
  }, [applicationStepsDateRange, selectedSeason]);

  const ApplicationStepsConvertedData = useMemo(() => {
    return applicationStepsData.map((items, index) => ({
      name: items?.step?.split("_")?.join(" "),
      value: items?.application,
      navigate: "/form-manager#form-manager-container",
      navigateState: {
        admin_dashboard: true,
        filters: {
          application_filling_stage: [formStageList[index].value],
          course: selectedCourse,
          counselor: {
            counselor_id: selectedCounselor,
          },
          source: {
            source_name: appliedSource,
          },
          date_range: {
            start_date: applicationStepsDateRange[0],
            end_date: applicationStepsDateRange[1],
          },
        },
      },
    }));
  }, [
    applicationStepsData,
    selectedCounselor,
    selectedCourse,
    applicationStepsDateRange,
    appliedSource,
  ]);

  const allProgressValues = useMemo(
    () => ApplicationStepsConvertedData.map((value) => value?.value),
    [ApplicationStepsConvertedData]
  );

  const normalizeBarValue = (value) => {
    return calculatePercentageOfValue(value, allProgressValues);
  };

  if (hideApplicationSteps) {
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
          {applicationStepsInternalServerError ||
          somethingWentWrongInApplicationSteps ? (
            <Card>
              <ErrorAndSomethingWentWrong
                isInternalServerError={applicationStepsInternalServerError}
                isSomethingWentWrong={somethingWentWrongInApplicationSteps}
                containerHeight="20vh"
              />
            </Card>
          ) : (
            <Box className="top-dashboard-box">
              {applicationStepsDateRange?.length > 1 && (
                <DateRangeShowcase
                  startDateRange={startDateRange}
                  endDateRange={endDateRange}
                  triggeredFunction={() => setApplicationStepsDateRange([])}
                ></DateRangeShowcase>
              )}
              <Box className="top-dashboard-header-and-filter-section">
                <Box className="title-box-hover">
                  <Typography className="top-section-title">
                    Application Steps
                  </Typography>
                  <Typography className="top-section-date">
                    {startDateRange} - {endDateRange}
                  </Typography>
                </Box>
                <Box className="top-dashboard-section-filters-box">
                  <>
                    {features?.["8e3c4469"]?.visibility && (
                      <>
                        {hideCourseList || (
                          <MultipleFilterSelectPicker
                            style={{ width: "140px" }}
                            placement="bottomEnd"
                            placeholder="Program Name"
                            onChange={(value) => {
                              setSelectedCourse(value);
                            }}
                            pickerData={courseDetails}
                            setSelectedPicker={setSelectedCourse}
                            pickerValue={selectedCourse}
                            loading={courseListInfo.isFetching}
                            onOpen={() => setSkipCourseApiCall(false)}
                            className="dashboard-select-picker"
                            callAPIAgain={() =>
                              setAppliedCourse(selectedCourse)
                            }
                            onClean={() => setAppliedCourse([])}
                          />
                        )}
                      </>
                    )}
                    {features?.["12295646"]?.visibility && (
                      <>
                        {hideCounsellorList || (
                          <MultipleFilterSelectPicker
                            onChange={(value) => {
                              setSelectedCounselor(value);
                            }}
                            pickerData={counsellorList}
                            placeholder="Select Counselor"
                            pickerValue={selectedCounselor}
                            className="dashboard-select-picker"
                            setSelectedPicker={setSelectedCounselor}
                            loading={loadingCounselorList}
                            onOpen={() => setSkipCounselorApiCall(false)}
                            style={{ width: "140px" }}
                            callAPIAgain={() =>
                              setAppliedCounselor(selectedCounselor)
                            }
                            onClean={() => setAppliedCounselor([])}
                            placement="bottomEnd"
                          />
                        )}
                      </>
                    )}
                    {features?.["3fb70d5a"]?.visibility && (
                      <>
                        {hideSourceList || (
                          <MultipleFilterSelectPicker
                            style={{ width: "130px" }}
                            placement="bottomEnd"
                            placeholder="Source Name"
                            onChange={(value) => {
                              setSelectedSource(value);
                            }}
                            pickerData={sourceList}
                            setSelectedPicker={setSelectedSource}
                            pickerValue={selectedSource}
                            loading={sourceListInfo?.isFetching}
                            onOpen={() => setSkipSourceApiCall(false)}
                            className="dashboard-select-picker"
                            callAPIAgain={() =>
                              setAppliedSource(selectedSource)
                            }
                            onClean={() => setAppliedSource([])}
                          />
                        )}
                      </>
                    )}
                  </>

                  {features?.["e8c94de8"]?.visibility && (
                    <IconDateRangePicker
                      onChange={(value) => {
                        setApplicationStepsDateRange(value);
                      }}
                      dateRange={applicationStepsDateRange}
                    />
                  )}
                </Box>
              </Box>
              {applicationStepsData.length > 0 ? (
                <Box
                  sx={{
                    mt: 2,
                    height: 300,
                    overflow: "auto",
                  }}
                  className="vertical-scrollbar"
                >
                  {ApplicationStepsConvertedData?.map((stage) => (
                    <LeadStageDetailsProgressBar
                      normalise={normalizeBarValue}
                      stage={stage}
                    />
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "30vh",
                    alignItems: "center",
                  }}
                >
                  <BaseNotFoundLottieLoader
                    height={250}
                    width={250}
                  ></BaseNotFoundLottieLoader>
                </Box>
              )}
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default React.memo(ApplicationSteps);
