import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Fab,
  TableContainer,
  Card,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { adminDashboardApiPayload } from "../../../utils/AdminDashboardApiPayload";
import { startAndEndDateSelect } from "../../../utils/adminDashboardDateRangeSelect";
import { indicatorValue } from "../../../constants/LeadStageList";
import TopPerformingChannelTableCell from "./TopPerformingChannelTableCell";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../../styles/topPerformingChannel.css";
import "../../../styles/sharedStyles.css";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";
import IndicatorDropDown from "../../shared/DropDownButton/IndicatorDropDown";
import IndicatorImage from "../../../images/indicatorImage.svg";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import CustomTabs from "../../shared/tab-panel/CustomTabs";
import TopPerforMingChannelCharts from "../../shared/graphs/TopPerforMingChannelCharts";
import useTableCellDesign from "../../../hooks/useTableCellDesign";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { useGetChannelWisePerformanceDetailsQuery } from "../../../Redux/Slices/adminDashboardSlice";
import useCommonErrorHandling from "../../../hooks/useCommonErrorHandling";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import ErrorAndSomethingWentWrong from "../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";

function TopPerformingChannels({
  handleDownloadFile,
  collegeId,
  hideCourseList,
  setSkipCourseApiCall,
  courseDetails,
  courseListInfo,
  apiCallingConditions,
  isScrolledTopPerformingChannel,
}) {
  const [topPerformData, setTopPerformData] = useState([]);
  const [topPerformDate, setTopPerformDate] = useState([]);
  const [topPerformingIndicator, setTopPerformingIndicator] = useState(null);
  const [selectedCourseFilterValue, setSelectedCourseFilterValue] = useState(
    []
  );
  const [selectedCourseId, setSelectedCourseId] = useState([]);
  const [hideTopPerformingChannel, setHideTopPerformingChannel] =
    useState(false);

  const StyledTableCell = useTableCellDesign();
  // const permissions = useSelector((state) => state.authentication.permissions);
  const [tabNo, setTabNo] = useState(1);
  // const hyperLinkPermission =
  //   permissions?.menus?.dashboard?.admin_dashboard?.features?.hyper_link;

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["e7d559dc"]?.features?.["b45a67ff"]
        ?.features
    );
  }, [permissions]);

  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  const [slicedTopPerformData, setSlicedTopPerformData] = useState([]);
  const navigate = useNavigate();
  const selectedSeason = useSelector(
    (state) => state.authentication.selectedSeason
  );

  const {
    setApiResponseChangeMessage,
    topPerformingInternalServerError,
    setTopPerformingInternalServerError,
    somethingWentWrongInTopPerformingChannel,
    setSomethingWentWrongInTopPerformingChannel,
  } = useContext(DashboradDataContext);

  const handleError = useCommonErrorHandling();

  const { data, error, isError, isFetching, isSuccess } =
    useGetChannelWisePerformanceDetailsQuery(
      {
        collegeId,
        topPerformingIndicator,
        payload: {
          ...JSON.parse(
            adminDashboardApiPayload({
              dateRange: topPerformDate,
              selectedSeason,
              programName: selectedCourseId,
            })
          ),
        },
      },
      {
        skip:
          apiCallingConditions && isScrolledTopPerformingChannel ? false : true,
      }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setTopPerformData(data?.data);
        } else {
          throw new Error(
            "Channel wise performance API response has been changed"
          );
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError: setTopPerformingInternalServerError,
          setHide: setHideTopPerformingChannel,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInTopPerformingChannel,
        setHideTopPerformingChannel,
        5000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, isSuccess]);

  useEffect(() => {
    if (topPerformDate?.length > 1) {
      const startDate = new Date(topPerformDate[0]);
      const endDate = new Date(topPerformDate[1]);
      setStartDateRange(startDate.toDateString());
      setEndDateRange(endDate.toDateString());
    } else {
      startAndEndDateSelect(selectedSeason, setStartDateRange, setEndDateRange);
    }
  }, [topPerformDate, selectedSeason]);

  useEffect(() => {
    if (topPerformData[0]?.source_wise_lead?.length > 9) {
      // const slicedData = topPerformData[0]?.source_wise_lead.slice(0, 5);
      const slicedData = topPerformData[0]?.source_wise_lead;
      setSlicedTopPerformData(slicedData);
      // setSlicedTopPerformData(slicedData);
    } else {
      setSlicedTopPerformData(topPerformData[0]?.source_wise_lead);
    }
  }, [topPerformData]);

  // data length variable for slicing data from data-array
  const dataLengthNine = 9;
  const dataLength19 = 19;
  const dataLength29 = 29;
  const dataLength39 = 39;
  const dataLength49 = 49;
  // State value to slice data in the state
  const stateValue10 = 10;
  const stateValue20 = 20;
  const stateValue30 = 30;
  const stateValue40 = 40;

  const sliceStartValue = 0;

  const handleNavigateHyperLink = (path, filters) => {
    navigate(path, {
      state: {
        admin_dashboard: true,
        filters: filters,
      },
    });
  };

  const responseChangeToChartREsponse = useMemo(() => {
    let chartsArray = [];
    for (
      let index = 0;
      index < topPerformData[0]?.source_wise_lead?.length;
      index++
    ) {
      const element = topPerformData[0]?.source_wise_lead[index];

      chartsArray.push({
        source: element?.source_name ? element?.source_name : "N/A",
        leads: element?.total_utm,
        paid_applications: element?.paid_utm,
      });
    }
    return chartsArray;
  }, [topPerformData]);

  if (hideTopPerformingChannel) {
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
          {topPerformingInternalServerError ||
          somethingWentWrongInTopPerformingChannel ? (
            <Card>
              <ErrorAndSomethingWentWrong
                isInternalServerError={topPerformingInternalServerError}
                isSomethingWentWrong={somethingWentWrongInTopPerformingChannel}
                containerHeight="20vh"
              />
            </Card>
          ) : (
            <Box className="top-performance-funnel-box channel-wise-container">
              {topPerformDate?.length > 1 && (
                <DateRangeShowcase
                  startDateRange={startDateRange}
                  endDateRange={endDateRange}
                  triggeredFunction={() => setTopPerformDate([])}
                ></DateRangeShowcase>
              )}

              <Box className="top-dashboard-header-and-filter-section">
                <Box className="title-box-hover">
                  <Typography className="top-section-title">
                    Channel wise Performance
                  </Typography>
                  <Typography className="top-section-date">
                    {startDateRange} - {endDateRange}
                  </Typography>
                </Box>
                <Box className="top-dashboard-section-filters-box">
                  {features?.["a2775866"]?.visibility && (
                    <>
                      {hideCourseList || (
                        <MultipleFilterSelectPicker
                          style={{ width: "150px" }}
                          placement="bottomEnd"
                          placeholder="Program Name"
                          onChange={(value) => {
                            setSelectedCourseFilterValue(value);
                          }}
                          pickerData={courseDetails}
                          setSelectedPicker={setSelectedCourseFilterValue}
                          pickerValue={selectedCourseFilterValue}
                          loading={courseListInfo?.isFetching}
                          onOpen={() => setSkipCourseApiCall(false)}
                          className="dashboard-select-picker"
                          callAPIAgain={() =>
                            setSelectedCourseId(selectedCourseFilterValue)
                          }
                          onClean={() => setSelectedCourseId([])}
                        />
                      )}
                    </>
                  )}
                  {features?.["2f5068d7"]?.visibility && (
                    <>
                      {topPerformDate?.length === 0 && (
                        <IndicatorDropDown
                          indicator={topPerformingIndicator}
                          image={IndicatorImage}
                          indicatorValue={indicatorValue}
                          setIndicator={setTopPerformingIndicator}
                        ></IndicatorDropDown>
                      )}
                    </>
                  )}
                  {features?.["0c4ed742"]?.visibility && (
                    <IconDateRangePicker
                      onChange={(value) => {
                        setTopPerformDate(value);
                      }}
                      dateRange={topPerformDate}
                    />
                  )}
                  {features?.["be81173a"]?.visibility && (
                    <IconButton
                      className="download-button-dashboard"
                      disabled={
                        selectedSeason
                          ? JSON.parse(selectedSeason)?.current_season
                            ? false
                            : true
                          : false
                      }
                      onClick={() =>
                        handleDownloadFile(
                          `${
                            import.meta.env.VITE_API_BASE_URL
                          }/admin/download_top_performing_channel_data/${collegeId}`,
                          adminDashboardApiPayload({
                            dateRange: topPerformDate,
                            selectedSeason,
                            programName: selectedCourseFilterValue,
                          }),
                          "top-performing-channel"
                        )
                      }
                      aria-label="Download"
                    >
                      <FileDownloadOutlinedIcon color="info" />
                    </IconButton>
                  )}
                </Box>
              </Box>
              <Box
                sx={{ pt: 2, flexGrow: 1 }}
                className="topperforming-channel-card-content"
              >
                {tabNo === 1 ? (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <TopPerforMingChannelCharts
                      responseChangeToChartREsponse={
                        responseChangeToChartREsponse
                      }
                    ></TopPerforMingChannelCharts>
                  </Box>
                ) : (
                  <>
                    <TableContainer
                      sx={{
                        maxWeight: 440,
                        width: "auto",
                        height: 300,
                      }}
                      className="topPerformingTable1 vertical-scrollbar"
                    >
                      <Table size="small">
                        <TableHead sx={{ whiteSpace: "nowrap" }}>
                          <TableRow>
                            <StyledTableCell
                              style={{
                                whiteSpace: "nowrap",
                                color: "#7E92A2",
                                fontWeight: 500,
                              }}
                            >
                              Traffic Channel
                            </StyledTableCell>
                            <StyledTableCell
                              style={{
                                whiteSpace: "nowrap",
                                color: "#7E92A2",
                                fontWeight: 500,
                              }}
                              align="left"
                            >
                              Leads
                            </StyledTableCell>

                            <StyledTableCell
                              style={{
                                whiteSpace: "nowrap",
                                color: "#7E92A2",
                                fontWeight: 500,
                              }}
                              align="left"
                            >
                              paid application
                            </StyledTableCell>
                            <StyledTableCell
                              style={{
                                whiteSpace: "nowrap",
                                color: "#7E92A2",
                                fontWeight: 500,
                              }}
                              align="left"
                            >
                              Admissions
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {topPerformData[0]?.source_wise_lead?.length > 0 &&
                            slicedTopPerformData?.map((source) => (
                              <TableRow key={source?.source_name}>
                                <StyledTableCell
                                  sx={{
                                    borderColor: "#E6E8F0",
                                    fontWeight: "500",
                                    maxWidth: "120px",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  {source?.source_name
                                    ? source?.source_name
                                    : ""}
                                </StyledTableCell>

                                <TopPerformingChannelTableCell
                                  handleNavigate={() => {
                                    // hyperLinkPermission &&
                                    handleNavigateHyperLink("/lead-manager", {
                                      source: {
                                        source_name: [source?.source_name],
                                      },
                                      addColumn: ["Source"],
                                    });
                                  }}
                                  dataCount={source?.total_utm}
                                  dataCountPercentage={source?.total_percentage}
                                  indicatorTitle="Leads"
                                  indicator={topPerformingIndicator}
                                  dataCountPercentagePosition={
                                    source?.total_lead_percentage_position
                                  }
                                  dataCountPercentageDifference={
                                    source?.total_lead_percentage_difference
                                  }
                                />

                                {/* PAID APP */}

                                <TopPerformingChannelTableCell
                                  handleNavigate={() => {
                                    // hyperLinkPermission &&
                                    handleNavigateHyperLink(
                                      "/paid-applications",
                                      {
                                        source: {
                                          source_name: [source?.source_name],
                                        },
                                        addColumn: ["Source"],
                                      }
                                    );
                                  }}
                                  dataCount={source?.paid_utm}
                                  dataCountPercentage={
                                    source?.paid_application_percentage
                                  }
                                  indicatorTitle="Paid Applications"
                                  indicator={topPerformingIndicator}
                                  dataCountPercentagePosition={
                                    source?.paid_application_percentage_position
                                  }
                                  dataCountPercentageDifference={
                                    source?.paid_application_percentage_difference
                                  }
                                />

                                <TopPerformingChannelTableCell
                                  dataCount={source?.submit_utm}
                                  dataCountPercentage={
                                    source?.submit_application_percentage
                                  }
                                  indicatorTitle="Admissions"
                                  indicator={topPerformingIndicator}
                                  dataCountPercentagePosition={
                                    source?.submit_application_percentage_position
                                  }
                                  dataCountPercentageDifference={
                                    source?.submit_application_percentage_difference
                                  }
                                />
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </Box>
              <CustomTabs tabNo={tabNo} setTabNo={setTabNo}></CustomTabs>
            </Box>
          )}
        </>
      )}
    </>
  );
}

export default React.memo(TopPerformingChannels);
