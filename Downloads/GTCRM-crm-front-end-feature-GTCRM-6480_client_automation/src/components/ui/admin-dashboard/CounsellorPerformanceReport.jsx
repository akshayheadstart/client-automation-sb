import React, { useMemo, useState } from "react";
import {
  Box,
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
import IndicatorImage from "../../../images/indicatorImage.svg";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import { useEffect } from "react";
import { startAndEndDateSelect } from "../../../utils/adminDashboardDateRangeSelect";
import "../../../styles/AdminDashboard.css";
import { indicatorValue } from "../../../constants/LeadStageList";
import IndicatorComponent from "./IndicatorComponent";
import useTableCellDesign from "../../../hooks/useTableCellDesign";
import IndicatorDropDown from "../../shared/DropDownButton/IndicatorDropDown";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";
import { adminDashboardApiPayload } from "../../../utils/AdminDashboardApiPayload";

import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../../../styles/topPerformingChannel.css";
import arrowRightIcon from "../../../images/arrowRightIcon.png";
import { removeUnderlineAndJoin } from "../../../helperFunctions/calendarHelperfunction";
import {
  isNumberOrStringCompare,
  removeUnderlineAndJoinNumberOrString,
} from "../../../helperFunctions/filterHelperFunction";
import { useSelector } from "react-redux";
const CounsellorPerformanceReport = ({
  counsellorPerformanceData,
  counsellorPeroformanceReportDateRange,
  setCounsellorPeroformanceReportDateRange,
  selectedSeason,
  counsellorPerformanceIndicator,
  setCounsellorPerformanceIndicator,
  hideCounsellorList,
  setCounsellorID,
  counsellorList,
  selectedCounsellor,
  loadingCounselorList,
  setSkipCounselorApiCall,
  setCallAPI,
  handleDownloadFile,
  collegeId,
  setCounselorReportAPICall,
}) => {
  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  //calculate counsellor total performance report
  const StyledTableCell = useTableCellDesign();

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["e7d559dc"]?.features?.["5b6387aa"]
        ?.features
    );
  }, [permissions]);

  useEffect(() => {
    if (counsellorPeroformanceReportDateRange?.length > 1) {
      const startDate = new Date(counsellorPeroformanceReportDateRange[0]);
      const endDate = new Date(counsellorPeroformanceReportDateRange[1]);
      setStartDateRange(startDate.toDateString());
      setEndDateRange(endDate.toDateString());
    } else {
      startAndEndDateSelect(selectedSeason, setStartDateRange, setEndDateRange);
    }
  }, [counsellorPeroformanceReportDateRange, selectedSeason]);
  const initialItemsToShow = 6;
  const [itemsToShow, setItemsToShow] = useState(initialItemsToShow);
  const [applicationsUpdateData, setApplicationsUpdateData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isRemoveButtonDisabled, setIsRemoveButtonDisabled] = useState(false);
  const handleButtonClick = () => {
    const nextItemsToShow = itemsToShow + 6;

    if (nextItemsToShow >= counsellorPerformanceData?.data?.length) {
      setIsButtonDisabled(true);
    }
    setIsRemoveButtonDisabled(false);
    setItemsToShow(nextItemsToShow);
  };
  const handleRemoveClick = () => {
    const nextItemsToShow = itemsToShow - 6;

    if (nextItemsToShow <= 0) {
      setItemsToShow(initialItemsToShow);
      setIsRemoveButtonDisabled(true);
      setIsButtonDisabled(false);
    } else {
      setItemsToShow(nextItemsToShow);
      setIsButtonDisabled(false);
    }
  };
  const [expandedIndices, setExpandedIndices] = useState([]);
  const handleToggle = (index) => {
    setExpandedIndices((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index)
        : [...prevIndices, index]
    );
  };
  useEffect(() => {
    const displayedData = counsellorPerformanceData?.data?.slice(
      0,
      itemsToShow
    );
    if (displayedData) {
      setApplicationsUpdateData(displayedData);
    }
  }, [itemsToShow, counsellorPerformanceData?.data]);

  return (
    <Box sx={{ height: "100%" }}>
      <Box className="top-dashboard-header-and-filter-section">
        <Box className="title-box-hover">
          <Typography className="top-section-title">
            Counsellor Performance Report
          </Typography>
          <Typography className="top-section-date">
            {startDateRange} - {endDateRange}
          </Typography>
        </Box>
        <Box className="top-dashboard-section-filters-box">
          {features?.["cfed2e2b"]?.visibility && (
            <>
              {hideCounsellorList || (
                <MultipleFilterSelectPicker
                  onChange={(value) => {
                    setCounsellorID(value);
                  }}
                  pickerData={counsellorList}
                  placeholder="Select Counselor"
                  pickerValue={selectedCounsellor}
                  className="dashboard-select-picker"
                  setSelectedPicker={setCounsellorID}
                  loading={loadingCounselorList}
                  onOpen={() => setSkipCounselorApiCall(false)}
                  style={{ width: "180px" }}
                  callAPIAgain={() => {
                    setCallAPI((prev) => !prev);
                    setCounselorReportAPICall(true);
                  }}
                  onClean={() => {
                    setCallAPI((prev) => !prev);
                    setCounselorReportAPICall(true);
                  }}
                />
              )}
            </>
          )}
          {features?.["215413f5"]?.visibility && (
            <>
              {counsellorPeroformanceReportDateRange?.length === 0 && (
                <IndicatorDropDown
                  indicator={counsellorPerformanceIndicator}
                  image={IndicatorImage}
                  indicatorValue={indicatorValue}
                  setIndicator={setCounsellorPerformanceIndicator}
                  position={"bottomEnd"}
                ></IndicatorDropDown>
              )}
            </>
          )}
          {features?.["3a773576"]?.visibility && (
            <IconDateRangePicker
              onChange={(value) => {
                setCounsellorPeroformanceReportDateRange(value);
                setCallAPI((prev) => !prev);
              }}
              dateRange={counsellorPeroformanceReportDateRange}
            />
          )}
          {features?.["8a4fba4f"]?.visibility && (
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
                  }/counselor/download_counselor_performance_report?college_id=${collegeId}`,
                  adminDashboardApiPayload({
                    dateRange: counsellorPeroformanceReportDateRange,
                    selectedSeason,
                    counselorId: selectedCounsellor,
                  }),
                  "form-wise-applications",
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

      <Box sx={{ py: 2 }}>
        {applicationsUpdateData?.length > 0 ? (
          <>
            <TableContainer
              sx={{ whiteSpace: "nowrap", mt: 2 }}
              className="custom-scrollbar table-container"
            >
              <Table stickyHeader sx={{ minWidth: 650 }} size="small">
                <TableHead>
                  <TableRow>
                    {counsellorPerformanceData?.headers?.map(
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
                                  column?.sub_stage?.length > 0 ? "8px" : "",
                                color: "#F8F8F8",
                                borderColor: "#E6E8F0",
                                zIndex: index === 0 ? 1111 : "",
                              }}
                              key={index}
                              className={index === 0 ? "table-cell-fixed" : ""}
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
                                  {removeUnderlineAndJoin(column.lead_stage)}
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
                                {column?.sub_stage?.map((subStage, idx) => {
                                  return (
                                    <TableCell
                                      sx={{
                                        backgroundColor: "#F8F8F8 !important",
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
                                        {removeUnderlineAndJoin(subStage)}
                                      </Typography>
                                    </TableCell>
                                  );
                                })}
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
                                    Object.keys(row[stage]?.sub_stage_data)
                                      .length > 0
                                      ? "#F8F8F8"
                                      : "white",
                                  borderColor: "#E6E8F0",
                                }}
                                align="center"
                                key={stageIndex}
                                className={
                                  stageIndex === 0 ? "table-cell-fixed" : ""
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
                                      isNumberOrStringCompare(row[stage].value)
                                        ? "source-wise-table-value-text"
                                        : "source-wise-table-value-text-not-string"
                                    }
                                  >
                                    {row[stage].value
                                      ? removeUnderlineAndJoinNumberOrString(
                                          row[stage].value
                                        )
                                      : "0"}
                                  </Typography>
                                  {(row[stage]?.position ||
                                    row[stage]?.percentage) && (
                                    <Box>
                                      <IndicatorComponent
                                        indicator={
                                          counsellorPerformanceIndicator
                                        }
                                        indicatorSize="15"
                                        fontSize="12"
                                        title={stage}
                                        performance={
                                          row[stage]?.position || "equal"
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
                  {counsellorPerformanceData?.total?.map((row, rowIndex) => {
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
                                    Object.keys(row[stage].sub_stage_data)
                                      .length > 0
                                      ? "#F8F8F8"
                                      : "white",
                                  borderColor: "#E6E8F0",
                                }}
                                align="center"
                                key={stageIndex}
                                className={
                                  stageIndex === 0 ? "table-cell-fixed" : ""
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
                                    {row[stage].value ? row[stage].value : "0"}
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
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {counsellorPerformanceData?.data?.length > 6 && (
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
                {applicationsUpdateData?.length > 6 && (
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
      </Box>
    </Box>
  );
};

export default React.memo(CounsellorPerformanceReport);
