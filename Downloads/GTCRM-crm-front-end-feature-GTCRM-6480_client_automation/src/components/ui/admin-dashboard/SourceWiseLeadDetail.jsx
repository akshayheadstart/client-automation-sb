import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  Fab,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import IndicatorImage from "../../../images/indicatorImage.svg";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import FilterSelectPicker from "../../shared/filters/FilterSelectPicker";
import {
  indicatorValue,
  leadTypeFilter,
} from "../../../constants/LeadStageList";
import { startAndEndDateSelect } from "../../../utils/adminDashboardDateRangeSelect";
import "../../../styles/AdminDashboard.css";
import IndicatorComponent from "./IndicatorComponent";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import IndicatorDropDown from "../../shared/DropDownButton/IndicatorDropDown";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import { adminDashboardApiPayload } from "../../../utils/AdminDashboardApiPayload";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import arrowRightIcon from "../../../images/arrowRightIcon.png";
import { removeUnderlineAndJoin } from "../../../helperFunctions/calendarHelperfunction";
import {
  isNumberOrStringCompare,
  removeUnderlineAndJoinNumberOrString,
} from "../../../helperFunctions/filterHelperFunction";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../../../styles/topPerformingChannel.css";
import "../../../styles/sharedStyles.css";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import useCommonErrorHandling from "../../../hooks/useCommonErrorHandling";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import ErrorAndSomethingWentWrong from "../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import { useGetSourceWiseLeadDetailsQuery } from "../../../Redux/Slices/adminDashboardSlice";
import { useSelector } from "react-redux";
const SourceWiseLeadDetail = ({
  selectedSeason,
  handleDownloadFile,
  collegeId,
  apiCallingCondition,
  isScrolledSourceWiseLeadDetail,
}) => {
  const [sourceWiseLeadDetailData, setSourceWiseLeadDetailData] = useState([]);
  const [selectedLeadType, setSelectedLeadType] = useState("");
  const [sourceWiseLeadDetailDateRange, setSourceWiseLeadDetailDateRange] =
    useState([]);
  const [sourceWiseLeadIndicator, setSourceWiseLeadIndicator] = useState("");
  const [hideSourceWiseLeadDetail, setHideSourceWiseLeadDetail] =
    useState(false);

  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");

  const handleError = useCommonErrorHandling();

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["e7d559dc"]?.features?.["20c9aaa4"]
        ?.features
    );
  }, [permissions]);

  const {
    setApiResponseChangeMessage,
    somethingWentWrongInSourceWiseLeadDetail,
    setSomethingWentWrongInSourceWiseLeadDetail,
    sourceWiseLeadDetailInternalServerError,
    setSourceWiseLeadDetailInternalServerError,
  } = useContext(DashboradDataContext);

  const { data, isError, error, isFetching, isSuccess } =
    useGetSourceWiseLeadDetailsQuery(
      {
        collegeId,
        sourceWiseLeadIndicator,
        selectedLeadType,
        payload: {
          ...JSON.parse(
            adminDashboardApiPayload({
              dateRange: sourceWiseLeadDetailDateRange,
              selectedSeason,
            })
          ),
        },
      },
      {
        skip:
          isScrolledSourceWiseLeadDetail && apiCallingCondition ? false : true,
      }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setSourceWiseLeadDetailData(data);
        } else {
          throw new Error(
            "Source Wise Lead details API response has been changed"
          );
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError: setSourceWiseLeadDetailInternalServerError,
          setHide: setHideSourceWiseLeadDetail,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInSourceWiseLeadDetail,
        setHideSourceWiseLeadDetail,
        5000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, isSuccess]);

  useEffect(() => {
    if (sourceWiseLeadDetailDateRange?.length > 1) {
      setStartDateRange(getDateMonthYear(sourceWiseLeadDetailDateRange[0]));
      setEndDateRange(getDateMonthYear(sourceWiseLeadDetailDateRange[1]));
    } else {
      startAndEndDateSelect(selectedSeason, setStartDateRange, setEndDateRange);
    }
  }, [sourceWiseLeadDetailDateRange, selectedSeason]);
  const [expandedIndices, setExpandedIndices] = useState([]);

  const handleToggle = (index) => {
    setExpandedIndices((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index)
        : [...prevIndices, index]
    );
  };
  const initialItemsToShow = 10;
  const [itemsToShow, setItemsToShow] = useState(initialItemsToShow);
  const [applicationsUpdateData, setApplicationsUpdateData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isRemoveButtonDisabled, setIsRemoveButtonDisabled] = useState(false);
  const handleButtonClick = () => {
    const nextItemsToShow = itemsToShow + 10;

    if (nextItemsToShow >= sourceWiseLeadDetailData?.data?.length) {
      setIsButtonDisabled(true);
    }
    setIsRemoveButtonDisabled(false);
    setItemsToShow(nextItemsToShow);
  };
  const handleRemoveClick = () => {
    const nextItemsToShow = itemsToShow - 10;

    if (nextItemsToShow <= 0) {
      setItemsToShow(initialItemsToShow);
      setIsRemoveButtonDisabled(true);
      setIsButtonDisabled(false);
    } else {
      setItemsToShow(nextItemsToShow);
      setIsButtonDisabled(false);
    }
  };
  useEffect(() => {
    const displayedData = sourceWiseLeadDetailData?.data?.slice(0, itemsToShow);
    if (displayedData) {
      setApplicationsUpdateData(displayedData);
    }
  }, [itemsToShow, sourceWiseLeadDetailData?.data]);

  if (hideSourceWiseLeadDetail) {
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
          {sourceWiseLeadDetailInternalServerError ||
          somethingWentWrongInSourceWiseLeadDetail ? (
            <Card>
              <ErrorAndSomethingWentWrong
                isInternalServerError={sourceWiseLeadDetailInternalServerError}
                isSomethingWentWrong={somethingWentWrongInSourceWiseLeadDetail}
                containerHeight="20vh"
              />
            </Card>
          ) : (
            <Box className="top-dashboard-box-table">
              {sourceWiseLeadDetailDateRange?.length > 1 && (
                <DateRangeShowcase
                  startDateRange={startDateRange}
                  endDateRange={endDateRange}
                  triggeredFunction={() => setSourceWiseLeadDetailDateRange([])}
                ></DateRangeShowcase>
              )}
              <Box className="top-dashboard-header-and-filter-section">
                <Box className="title-box-hover">
                  <Typography className="top-section-title">
                    Source Wise Lead Detail
                  </Typography>
                  <Typography className="top-section-date">
                    {startDateRange} - {endDateRange}
                  </Typography>
                </Box>
                <Box className="top-dashboard-section-filters-box">
                  {features?.["9fc5784f"]?.visibility && (
                    <FilterSelectPicker
                      setSelectedPicker={setSelectedLeadType}
                      pickerData={leadTypeFilter}
                      placeholder="Select Lead Type"
                      pickerValue={selectedLeadType}
                      className="dashboard-select-picker"
                    />
                  )}
                  {features?.["2721f53b"]?.visibility && (
                    <>
                      {sourceWiseLeadDetailDateRange?.length === 0 && (
                        <IndicatorDropDown
                          indicator={sourceWiseLeadIndicator}
                          image={IndicatorImage}
                          indicatorValue={indicatorValue}
                          setIndicator={setSourceWiseLeadIndicator}
                          position={"bottomEnd"}
                        ></IndicatorDropDown>
                      )}
                    </>
                  )}
                  {features?.["74b96cf3"]?.visibility && (
                    <IconDateRangePicker
                      onChange={(value) => {
                        setSourceWiseLeadDetailDateRange(value);
                      }}
                      dateRange={sourceWiseLeadDetailDateRange}
                    />
                  )}
                  {features?.["b1a34226"]?.visibility && (
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
                          }/admin/download_source_wise_details?${
                            selectedLeadType
                              ? "lead_type=" + selectedLeadType
                              : ""
                          }&college_id=${collegeId}`,
                          adminDashboardApiPayload({
                            dateRange: sourceWiseLeadDetailDateRange,
                            selectedSeason,
                          }),
                          "source-wise-applications",
                          "PUT"
                        )
                      }
                      aria-label="Download"
                    >
                      <FileDownloadOutlinedIcon color="info" />
                    </IconButton>
                  )}
                </Box>
              </Box>

              <Box>
                {sourceWiseLeadDetailData?.data?.length === 0 ? (
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
                ) : (
                  <>
                    <TableContainer
                      sx={{ whiteSpace: "nowrap", mt: 2 }}
                      className="custom-scrollbar table-container"
                    >
                      <Table stickyHeader sx={{ minWidth: 650 }} size="small">
                        <TableHead>
                          <TableRow>
                            {sourceWiseLeadDetailData?.headers?.map(
                              (column, index) => {
                                return (
                                  <>
                                    <TableCell
                                      sx={{
                                        backgroundColor:
                                          column?.sub_stage?.length > 0
                                            ? "#F8F8F8"
                                            : "white",
                                        padding:
                                          column?.sub_stage?.length > 0
                                            ? "8px"
                                            : "",
                                        color: "#F8F8F8",
                                        borderColor: "#E6E8F0",
                                        zIndex: index === 0 ? 1111 : "",
                                      }}
                                      key={index}
                                      className={
                                        index === 0 ? "table-cell-fixed" : ""
                                      }
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "3px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            color: "#7E92A2",
                                            fontSize: "16px",
                                            fontWeight: 500,
                                          }}
                                        >
                                          {removeUnderlineAndJoin(
                                            column.lead_stage
                                          )}
                                        </Typography>
                                        {column?.sub_stage?.length > 0 && (
                                          <img
                                            className={
                                              expandedIndices.includes(index)
                                                ? "arrow-icon-flip"
                                                : ""
                                            }
                                            onClick={() => handleToggle(index)}
                                            src={arrowRightIcon}
                                            alt="arrow Icon"
                                          />
                                        )}
                                      </Box>
                                    </TableCell>
                                    {(expandedIndices.includes(index) ||
                                      !column?.sub_stage?.length) && (
                                      <>
                                        {column?.sub_stage?.map(
                                          (subStage, idx) => {
                                            return (
                                              <TableCell
                                                sx={{
                                                  backgroundColor:
                                                    "#F8F8F8 !important",
                                                  padding: "8px",
                                                  borderColor: "#E6E8F0",
                                                }}
                                                key={idx}
                                              >
                                                <Typography
                                                  sx={{
                                                    color: "#7E92A2",
                                                    fontSize: "16px",
                                                    fontWeight: 500,
                                                  }}
                                                >
                                                  {removeUnderlineAndJoin(
                                                    subStage
                                                  )}
                                                </Typography>
                                              </TableCell>
                                            );
                                          }
                                        )}
                                      </>
                                    )}
                                  </>
                                );
                              }
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {applicationsUpdateData?.map((row, rowIndex) => {
                            return (
                              <TableRow hover role="checkbox" key={rowIndex}>
                                {Object.keys(row).map((stage, stageIndex) => {
                                  return (
                                    <>
                                      <TableCell
                                        sx={{
                                          backgroundColor:
                                            Object.keys(
                                              row[stage]?.sub_stage_data
                                            ).length > 0
                                              ? "#F8F8F8"
                                              : "white",
                                          borderColor: "#E6E8F0",
                                        }}
                                        align="center"
                                        key={stageIndex}
                                        className={
                                          stageIndex === 0
                                            ? "table-cell-fixed"
                                            : ""
                                        }
                                      >
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                            gap: 1,
                                          }}
                                        >
                                          <Typography
                                            className={
                                              isNumberOrStringCompare(
                                                row[stage].value
                                              )
                                                ? "source-wise-table-value-text"
                                                : "source-wise-table-value-text-not-string"
                                            }
                                          >
                                            {row[stage].value
                                              ? removeUnderlineAndJoinNumberOrString(
                                                  row[stage].value
                                                )
                                              : stageIndex > 0
                                              ? "0"
                                              : "N/A"}
                                          </Typography>
                                          {(row[stage]?.position ||
                                            row[stage]?.percentage) && (
                                            <Box>
                                              <IndicatorComponent
                                                indicator={
                                                  sourceWiseLeadIndicator
                                                }
                                                indicatorSize="15"
                                                fontSize="12"
                                                title={stage}
                                                performance={
                                                  row[stage]?.position ||
                                                  "equal"
                                                }
                                                percentage={parseFloat(
                                                  row[stage]?.percentage
                                                    ? row[stage]?.percentage
                                                    : 0
                                                ).toFixed(2)}
                                                tooltipPosition="right"
                                              ></IndicatorComponent>
                                            </Box>
                                          )}
                                        </Box>
                                      </TableCell>
                                      {expandedIndices.includes(stageIndex) &&
                                        !stage?.sub_stage?.length && (
                                          <>
                                            {Object.values(
                                              row[stage].sub_stage_data
                                            ).map((subStage) => {
                                              return (
                                                <TableCell
                                                  sx={{
                                                    backgroundColor:
                                                      "#F8F8F8 !important",
                                                    padding: "8px",
                                                    borderColor: "#E6E8F0",
                                                  }}
                                                  align="center"
                                                  key={stageIndex}
                                                >
                                                  <Typography
                                                    sx={{
                                                      color: "#121828",
                                                      fontSize: "15px",
                                                      fontWeight: 600,
                                                    }}
                                                  >
                                                    {subStage}
                                                  </Typography>
                                                </TableCell>
                                              );
                                            })}
                                          </>
                                        )}
                                    </>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
                          {sourceWiseLeadDetailData?.total?.map(
                            (row, rowIndex) => {
                              return (
                                <TableRow
                                  className="sticky-row"
                                  hover
                                  role="checkbox"
                                  key={rowIndex}
                                >
                                  {Object.keys(row).map((stage, stageIndex) => {
                                    return (
                                      <>
                                        <TableCell
                                          sx={{
                                            backgroundColor:
                                              Object.keys(
                                                row[stage].sub_stage_data
                                              ).length > 0
                                                ? "#F8F8F8"
                                                : "white",
                                            borderColor: "#E6E8F0",
                                          }}
                                          align="center"
                                          key={stageIndex}
                                          className={
                                            stageIndex === 0
                                              ? "table-cell-fixed"
                                              : ""
                                          }
                                        >
                                          <Box
                                            sx={{
                                              display: "flex",
                                              justifyContent: "flex-start",
                                              alignItems: "left",
                                              gap: 1,
                                            }}
                                          >
                                            <Typography
                                              variant="subtitle2"
                                              fontWeight={600}
                                              fontSize={15}
                                            >
                                              {row[stage].value
                                                ? row[stage].value
                                                : "0"}
                                            </Typography>
                                          </Box>
                                        </TableCell>
                                        {expandedIndices.includes(stageIndex) &&
                                          !stage?.sub_stage?.length && (
                                            <>
                                              {Object.values(
                                                row[stage].sub_stage_data
                                              ).map((subStage) => {
                                                return (
                                                  <TableCell
                                                    sx={{
                                                      backgroundColor:
                                                        "#F8F8F8 !important",
                                                      padding: "8px",
                                                      borderColor: "#E6E8F0",
                                                    }}
                                                    align="center"
                                                    key={stageIndex}
                                                  >
                                                    <Typography
                                                      sx={{
                                                        color: "#121828",
                                                        fontSize: "15px",
                                                        fontWeight: 600,
                                                      }}
                                                    >
                                                      {subStage}
                                                    </Typography>
                                                  </TableCell>
                                                );
                                              })}
                                            </>
                                          )}
                                      </>
                                    );
                                  })}
                                </TableRow>
                              );
                            }
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {sourceWiseLeadDetailData?.data?.length > 10 && (
                      <Box className="top-performing-fab-box">
                        {!isButtonDisabled && (
                          <Fab
                            onClick={handleButtonClick}
                            size="small"
                            sx={{
                              zIndex: "0",
                              mx: "5px",
                            }}
                            className="top-performing-fab"
                          >
                            <ExpandMoreIcon />
                          </Fab>
                        )}
                        {applicationsUpdateData?.length > 10 && (
                          <>
                            {!isRemoveButtonDisabled && (
                              <Fab
                                onClick={handleRemoveClick}
                                size="small"
                                sx={{
                                  zIndex: "0",
                                  mx: "5px",
                                }}
                                className="top-performing-fab"
                              >
                                <ExpandLessIcon />
                              </Fab>
                            )}
                          </>
                        )}
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default React.memo(SourceWiseLeadDetail);
