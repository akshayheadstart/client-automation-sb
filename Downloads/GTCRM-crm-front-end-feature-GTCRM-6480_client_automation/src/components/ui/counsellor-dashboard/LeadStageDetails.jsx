import { Box, Typography } from "@mui/material";
import downloadIcon from "../../../icons/download-icon.svg";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import React, { useEffect, useMemo, useState } from "react";
import LeadStageDetailsProgressBar from "./LeadStageDetailsProgressBar";
import "../../../styles/LeadStageDetails.css";
// import "../../../styles/sharedStyles.css";
import sortAscIcon from "../../../icons/sort-ascending-icon.png";
import sortDescIcon from "../../../icons/sort-desc-icon.png";
import { BootstrapTooltip } from "../../shared/Tooltip/BootsrapTooltip";
import { useSelector } from "react-redux";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { useContext } from "react";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import GetJsonDate from "../../../hooks/GetJsonDate";
import { startAndEndDateSelect } from "../../../utils/adminDashboardDateRangeSelect";
import { useGetLeadStageCountDetailsQuery } from "../../../Redux/Slices/adminDashboardSlice";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import useCommonErrorHandling from "../../../hooks/useCommonErrorHandling";
import { calculatePercentageOfValue } from "../../../pages/StudentTotalQueries/helperFunction";

const LeadStageDetails = ({
  handleDownloadFile,
  hideSourceList,
  sourceList,
  sourceListInfo,
  setCallSourceListApi,
  selectedSeason,
  isScrolledLeadStageDetails,
  setHideLeadStageDetails,
}) => {
  const [
    somethingWentWrongInLeadStageDetails,
    setSomethingWentWrongInLeadStageDetails,
  ] = useState(false);
  const [
    leadStageDetailsInternalServerError,
    setLeadStageDetailsInternalServerError,
  ] = useState(false);

  const [leadStageDetailsDateRange, setLeadStageDetailsDateRange] = useState(
    []
  );
  const [leadStageDetailsSelectedSource, setLeadStageDetailsSelectedSource] =
    useState([]);
  const [appliedSource, setAppliedSource] = useState([]);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");

  useEffect(() => {
    if (leadStageDetailsDateRange?.length > 1) {
      setStartDateRange(getDateMonthYear(leadStageDetailsDateRange[0]));
      setEndDateRange(getDateMonthYear(leadStageDetailsDateRange[1]));
    } else if (selectedSeason) {
      startAndEndDateSelect(selectedSeason, setStartDateRange, setEndDateRange);
    }
  }, [leadStageDetailsDateRange, selectedSeason]);

  const [leadStages, setLeadStages] = useState([]);

  const [sort, setSort] = useState("asc");
  const handleError = useCommonErrorHandling();

  const { data, isFetching, isSuccess, isError, error } =
    useGetLeadStageCountDetailsQuery(
      {
        collegeId,
        payload: {
          date_range:
            leadStageDetailsDateRange?.length >= 1
              ? JSON.parse(GetJsonDate(leadStageDetailsDateRange))
              : {},
          source_names: appliedSource,
        },
      },
      {
        skip:
          collegeId?.length > 0 && isScrolledLeadStageDetails ? false : true,
      }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setLeadStages(data?.data);
        } else {
          throw new Error("Lead stage details API response has been changed");
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError: setLeadStageDetailsInternalServerError,
          setHide: setHideLeadStageDetails,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInLeadStageDetails,
        setHideLeadStageDetails,
        5000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, isSuccess]);

  useEffect(() => {
    if (sort === "asc") {
      setLeadStages((prev) => prev?.slice().sort((a, b) => a.total - b.total));
    }
    if (sort === "des") {
      setLeadStages((prev) => prev?.slice().sort((a, b) => b.total - a.total));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  const leadStageConvertedData = useMemo(() => {
    return leadStages?.map((item) => ({
      name: item?.lead_stage,
      value: item?.total,
      subStage: item?.lead_stage_label,
    }));
  }, [leadStages]);

  const allProgressValues = useMemo(
    () => leadStageConvertedData.map((value) => value?.value),
    [leadStageConvertedData]
  );

  const normalizeBarValue = (value) => {
    return calculatePercentageOfValue(value, allProgressValues);
  };

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["c2a62998"]?.features?.["24c09f26"]
        ?.features
    );
  }, [permissions]);

  return (
    <Box className="counsellor-lead-stage-details-box">
      {leadStageDetailsDateRange?.length > 1 && (
        <DateRangeShowcase
          startDateRange={startDateRange}
          endDateRange={endDateRange}
          triggeredFunction={() => setLeadStageDetailsDateRange([])}
        ></DateRangeShowcase>
      )}

      {somethingWentWrongInLeadStageDetails ||
      leadStageDetailsInternalServerError ? (
        <Box>
          {leadStageDetailsInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInLeadStageDetails && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          {isFetching ? (
            <Box className="loader-container">
              <LeefLottieAnimationLoader
                height={100}
                width={150}
              ></LeefLottieAnimationLoader>
            </Box>
          ) : (
            <>
              <Box className="lead-stage-details-header">
                <Box className="title-box-hover">
                  <Typography className="lead-stage-details-title">
                    Lead Stage Details
                  </Typography>
                  <Typography className="top-section-date">
                    {startDateRange} - {endDateRange}
                  </Typography>
                </Box>
                <Box className="lead-stage-details-icon-box">
                  {features?.["6b23e172"]?.visibility && (
                    <>
                      {hideSourceList || (
                        <MultipleFilterSelectPicker
                          onChange={(value) => {
                            setLeadStageDetailsSelectedSource(value);
                          }}
                          pickerData={sourceList}
                          placeholder="Source"
                          pickerValue={leadStageDetailsSelectedSource}
                          setSelectedPicker={setLeadStageDetailsSelectedSource}
                          loading={sourceListInfo?.isFetching}
                          onOpen={() => setCallSourceListApi(false)}
                          style={{ width: "180px" }}
                          callAPIAgain={() =>
                            setAppliedSource(leadStageDetailsSelectedSource)
                          }
                          onClean={() => setAppliedSource([])}
                        />
                      )}
                    </>
                  )}
                  {features?.["cc78fd32"]?.visibility && (
                    <>
                      {sort === "asc" || sort === "default" ? (
                        <Box
                          sx={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            if (sort === "asc") {
                              setSort("des");
                            }
                          }}
                        >
                          <BootstrapTooltip
                            arrow
                            title={"Sorted as ascending"}
                            placement="top"
                            backgroundColor="#11BED2"
                          >
                            <Box className="lead-stage-details-sort-icon-box">
                              <img
                                width="20px"
                                height="20px"
                                src={sortAscIcon}
                                alt="sort-asc-icon"
                              />
                            </Box>
                          </BootstrapTooltip>
                        </Box>
                      ) : (
                        <Box
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            if (sort === "des") {
                              setSort("asc");
                            }
                          }}
                        >
                          <BootstrapTooltip
                            arrow
                            title="Sorted as descending"
                            placement="top"
                            backgroundColor="#11BED2"
                          >
                            <Box className="lead-stage-details-sort-icon-box">
                              <img
                                width="20px"
                                height="20px"
                                src={sortDescIcon}
                                alt="sort-asc-icon"
                              />
                            </Box>
                          </BootstrapTooltip>
                        </Box>
                      )}
                    </>
                  )}

                  {features?.["b6984089"]?.visibility && (
                    <IconDateRangePicker
                      onChange={(value) => {
                        setLeadStageDetailsDateRange(value);
                      }}
                      dateRange={leadStageDetailsDateRange}
                    />
                  )}

                  {features?.["3e4fda6e"]?.visibility && (
                    <Box
                      sx={{ cursor: "pointer", width: "35px", height: "35px" }}
                      onClick={() =>
                        handleDownloadFile(
                          `${
                            import.meta.env.VITE_API_BASE_URL
                          }/counselor/lead_stage_count_summary/?download_data=true&college_id=${collegeId}`,
                          JSON.stringify({
                            date_range:
                              leadStageDetailsDateRange?.length >= 1
                                ? JSON.parse(
                                    GetJsonDate(leadStageDetailsDateRange)
                                  )
                                : {},
                            source_names: leadStageDetailsSelectedSource
                              ? leadStageDetailsSelectedSource
                              : [],
                          }),
                          "lead stage details",
                          setSomethingWentWrongInLeadStageDetails,
                          setLeadStageDetailsInternalServerError
                        )
                      }
                    >
                      <img
                        src={downloadIcon}
                        alt="download-icon"
                        width="100%"
                      />
                    </Box>
                  )}
                </Box>
              </Box>
              {leadStageConvertedData.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {leadStageConvertedData?.map((stage) => (
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
                    minHeight: "55vh",
                    alignItems: "center",
                  }}
                >
                  <BaseNotFoundLottieLoader
                    height={250}
                    width={250}
                  ></BaseNotFoundLottieLoader>
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default React.memo(LeadStageDetails);
