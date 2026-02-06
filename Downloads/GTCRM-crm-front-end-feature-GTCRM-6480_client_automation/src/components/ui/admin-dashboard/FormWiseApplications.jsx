/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  Fab,
  Card,
} from "@mui/material";

import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import {
  adminDashboardApiPayload,
  adminDashboardFormWiseApiPayload,
} from "../../../utils/AdminDashboardApiPayload";
import { startAndEndDateSelect } from "../../../utils/adminDashboardDateRangeSelect";
import IndicatorComponent from "./IndicatorComponent";
import "../../../styles/EventMapping.css";
import IndicatorImage from "../../../images/indicatorImage.svg";
import useTableCellDesign from "../../../hooks/useTableCellDesign";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import IndicatorDropDown from "../../shared/DropDownButton/IndicatorDropDown";
import { indicatorValue } from "../../../constants/LeadStageList";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import { currentSeasonDateRangeGenerator } from "../../Calendar/utils";
import "../../../styles/sharedStyles.css";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../../../styles/topPerformingChannel.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetProgramWiseApplicationDetailsQuery } from "../../../Redux/Slices/adminDashboardSlice";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import useCommonErrorHandling from "../../../hooks/useCommonErrorHandling";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import ErrorAndSomethingWentWrong from "../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import { createPreferenceList } from "../../../pages/StudentTotalQueries/helperFunction";
function FormWiseApplications({
  handleDownloadFile,
  collegeId,
  counsellorList,
  hideCounsellorList,
  selectedSeason,
  loadingCounselorList,
  setSkipCounselorApiCall,
  schoolList,
  hideSchoolList,
  loadingSchoolList,
  setSkipSchoolApiCall,
  hideSourceList,
  sourceList,
  sourceListInfo,
  setSkipSourceApiCall,
  apiCallingConditions,
  isScrolledFormWiseApplication,
  featureKey,
  sourceFilterFeature,
  dateRangeFilterFeature,
  changeIndicatorFilterFeature,
  schoolFilterFeature,
  counselorFilterFeature,
  downloadFeature,
}) {
  const [selectedSource, setSelectedSource] = useState([]);
  const [appliedSource, setAppliedSource] = useState([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState([]);
  const [appliedCounsellor, setAppliedCounsellor] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState([]);
  const [appliedSchool, setAppliedSchool] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedPreference, setSelectedPreference] = useState([]);
  const [appliedPreference, setAppliedPreference] = useState([]);
  const [programWiseIndicator, setProgramWiseIndicator] = useState("");

  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  const [formWiseApplicationDateRange, setFormWiseApplicationDateRange] =
    useState([]);
  const [hideFormWiseApplications, setHideFormWiseApplications] =
    useState(false);

  const StyledTableCell = useTableCellDesign();
  const handleError = useCommonErrorHandling();

  const settingStartAndEndDate = () => {
    if (formWiseApplicationDateRange?.length) {
      setStartDateRange(getDateMonthYear(formWiseApplicationDateRange[0]));
      setEndDateRange(getDateMonthYear(formWiseApplicationDateRange[1]));
    } else if (selectedSeason?.length) {
      startAndEndDateSelect(selectedSeason, setStartDateRange, setEndDateRange);
    } else {
      const seasonDate = currentSeasonDateRangeGenerator();
      setStartDateRange(getDateMonthYear(seasonDate?.firstDayOfSeason));
      setEndDateRange(getDateMonthYear(seasonDate?.lastDayOfSeason));
    }
  };

  const {
    setApiResponseChangeMessage,
    somethingWentWrongInFormWiseApplication,
    setSomethingWentWrongInFormWiseApplication,
    formWiseApplicationsInternalServerError,
    setFormWiseApplicationsInternalServerError,
  } = useContext(DashboradDataContext);

  const { data, isFetching, isError, error, isSuccess } =
    useGetProgramWiseApplicationDetailsQuery(
      {
        collegeId,
        programWiseIndicator,
        featureKey,
        payload: {
          ...JSON.parse(
            adminDashboardFormWiseApiPayload({
              dateRange: formWiseApplicationDateRange,
              selectedSeason,
              counselor_id: appliedCounsellor,
              school: appliedSchool,
              source: appliedSource,
              preference: appliedPreference,
            })
          ),
        },
      },
      {
        skip:
          isScrolledFormWiseApplication && apiCallingConditions ? false : true,
      }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data[0])) {
          setApplications(data?.data[0]);
        } else {
          throw new Error(
            "Program wise application API response has been changed"
          );
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError: setFormWiseApplicationsInternalServerError,
          setHide: setHideFormWiseApplications,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInFormWiseApplication,
        setHideFormWiseApplications,
        5000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, isSuccess]);

  useEffect(() => {
    settingStartAndEndDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeason]);

  let totalApplication = useMemo(() => {
    return applications?.reduce(
      (accum, item) =>
        accum + (item?.total_application ? item?.total_application : 0),
      0
    );
  }, [applications]);

  let totalPaidApplication = useMemo(() => {
    return applications?.reduce(
      (accum, item) =>
        accum +
        (item?.total_paid_application ? item?.total_paid_application : 0),
      0
    );
  }, [applications]);

  let totalApplicationSubmited = useMemo(() => {
    return applications?.reduce(
      (accum, item) =>
        accum + (item?.application_submitted ? item?.application_submitted : 0),
      0
    );
  }, [applications]);

  let totalLeads = useMemo(() => {
    return applications?.reduce(
      (accum, item) => accum + (item?.total_lead ? item?.total_lead : 0),
      0
    );
  }, [applications]);
  const initialItemsToShow = 10;
  const [itemsToShow, setItemsToShow] = useState(initialItemsToShow);
  const [applicationsUpdateData, setApplicationsUpdateData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isRemoveButtonDisabled, setIsRemoveButtonDisabled] = useState(false);
  const handleButtonClick = () => {
    const nextItemsToShow = itemsToShow + 10;

    if (nextItemsToShow >= applications.length) {
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
    const displayedData = applications?.slice(0, itemsToShow);
    if (displayedData) {
      setApplicationsUpdateData(displayedData);
    }
  }, [itemsToShow, applications]);

  const navigate = useNavigate();
  const hyperLinkPermission = useSelector(
    (state) =>
      state?.authentication?.permissions?.menus?.dashboard?.admin_dashboard
        ?.features?.hyper_link
  );
  const hyperLinkCounselorPermission = useSelector(
    (state) =>
      state?.authentication?.permissions?.menus?.dashboard?.counselor_dashboard
        ?.features?.hyper_link
  );

  const handleRedirectToDetails = ({
    redirectionPath,
    courseDetails,
    extraParam,
  }) => {
    const filterDetails = {
      state: {
        admin_dashboard: true,
        filters: {
          ...extraParam,
          date_range: {
            start_date: formWiseApplicationDateRange[0],
            end_date: formWiseApplicationDateRange[1],
          },
          source: {
            source_name: appliedSource,
          },
          counselor: {
            counselor_id: appliedCounsellor,
          },
        },
      },
    };
    if (courseDetails?.course_id) {
      filterDetails.state.filters.course = {
        course_id: [courseDetails?.course_id],
        course_specialization: [courseDetails?.spec],
      };
    }
    if (
      (hyperLinkPermission || hyperLinkCounselorPermission) &&
      selectedSchool.length === 0
    ) {
      navigate(`/${redirectionPath}`, filterDetails);
    }
  };

  if (hideFormWiseApplications) {
    return null;
  }
  const systemPreference = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.system_preference
  );

  const listOfPreference = createPreferenceList(
    systemPreference?.preference_count
  );

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
          {formWiseApplicationsInternalServerError ||
          somethingWentWrongInFormWiseApplication ? (
            <Card>
              <ErrorAndSomethingWentWrong
                isInternalServerError={formWiseApplicationsInternalServerError}
                isSomethingWentWrong={somethingWentWrongInFormWiseApplication}
                containerHeight="20vh"
              />
            </Card>
          ) : (
            <Box className="top-dashboard-box-table">
              {formWiseApplicationDateRange?.length > 1 && (
                <DateRangeShowcase
                  startDateRange={startDateRange}
                  endDateRange={endDateRange}
                  triggeredFunction={() => setFormWiseApplicationDateRange([])}
                ></DateRangeShowcase>
              )}

              <Box className="top-dashboard-header-and-filter-section">
                <Box className="title-box-hover">
                  <Typography className="top-section-title">
                    Program Wise Performance
                  </Typography>
                  <Typography className="top-section-date">
                    {startDateRange} - {endDateRange}
                  </Typography>
                </Box>
                <Box className="top-dashboard-section-filters-box">
                  <>
                    {systemPreference?.preference && (
                      <MultipleFilterSelectPicker
                        style={{ width: "130px" }}
                        placement="bottomEnd"
                        placeholder="Preference"
                        onChange={(value) => {
                          setSelectedPreference(value);
                        }}
                        pickerData={listOfPreference}
                        setSelectedPicker={setSelectedPreference}
                        pickerValue={selectedPreference}
                        className="dashboard-select-picker"
                        callAPIAgain={() =>
                          setAppliedPreference(selectedPreference)
                        }
                        onClean={() => setAppliedPreference([])}
                      />
                    )}
                    {sourceFilterFeature && (
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
                    {counselorFilterFeature && (
                      <>
                        {hideCounsellorList || (
                          <MultipleFilterSelectPicker
                            onChange={(value) => {
                              setSelectedCounsellor(value);
                            }}
                            pickerData={counsellorList}
                            placeholder="Select Counselor"
                            pickerValue={selectedCounsellor}
                            className="dashboard-select-picker"
                            setSelectedPicker={setSelectedCounsellor}
                            loading={loadingCounselorList}
                            onOpen={() => setSkipCounselorApiCall(false)}
                            style={{ width: "180px" }}
                            callAPIAgain={() =>
                              setAppliedCounsellor(selectedCounsellor)
                            }
                            onClean={() => setAppliedCounsellor([])}
                          />
                        )}
                      </>
                    )}
                  </>
                  {schoolFilterFeature && (
                    <>
                      {hideSchoolList || (
                        <MultipleFilterSelectPicker
                          onChange={(value) => {
                            setSelectedSchool(value);
                          }}
                          pickerData={schoolList}
                          placeholder="Select School"
                          pickerValue={selectedSchool}
                          className="dashboard-select-picker"
                          setSelectedPicker={setSelectedSchool}
                          loading={loadingSchoolList}
                          onOpen={() => setSkipSchoolApiCall(false)}
                          style={{ width: "180px" }}
                          callAPIAgain={() => setAppliedSchool(selectedSchool)}
                          onClean={() => setAppliedSchool([])}
                        />
                      )}
                    </>
                  )}
                  {changeIndicatorFilterFeature && (
                    <>
                      {formWiseApplicationDateRange?.length === 0 && (
                        <IndicatorDropDown
                          indicator={programWiseIndicator}
                          image={IndicatorImage}
                          indicatorValue={indicatorValue}
                          setIndicator={setProgramWiseIndicator}
                          position={"bottomEnd"}
                        ></IndicatorDropDown>
                      )}
                    </>
                  )}
                  {dateRangeFilterFeature && (
                    <IconDateRangePicker
                      onChange={(value) => {
                        setFormWiseApplicationDateRange(value);
                      }}
                      dateRange={formWiseApplicationDateRange}
                    />
                  )}
                  {downloadFeature && (
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
                          }/admin/download_form_wise_status_data/${collegeId}`,
                          adminDashboardApiPayload({
                            dateRange: formWiseApplicationDateRange,
                            selectedSeason,
                            counselorId: selectedCounsellor,
                            school: selectedSchool,
                            source: selectedSource,
                          }),
                          "form-wise-applications"
                        )
                      }
                      aria-label="Download"
                    >
                      <FileDownloadOutlinedIcon color="info" />
                    </IconButton>
                  )}
                </Box>
              </Box>

              <Box sx={{ p: 0, mt: 2 }}>
                {applicationsUpdateData?.length > 0 ? (
                  <>
                    <TableContainer className="custom-scrollbar">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>
                              <span>Course Name</span>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Total Leads
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Total Applications
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Paid Applications
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              Applications Submitted
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {applicationsUpdateData?.map((form) => (
                            <TableRow key={form?.course_name}>
                              <StyledTableCell>
                                <span style={{ fontWeight: "500" }}>
                                  {" "}
                                  {form?.course_name}
                                </span>
                              </StyledTableCell>
                              <StyledTableCell align="left">
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
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => {
                                      handleRedirectToDetails({
                                        redirectionPath:
                                          "form-manager#form-manager-container",
                                        courseDetails: form,
                                        extraParam: {
                                          lead_stage: {
                                            lead_b: true,
                                            lead_name: [],
                                          },
                                        },
                                      });
                                    }}
                                  >
                                    {form?.total_lead ? form?.total_lead : "0"}
                                  </Typography>
                                  <Box>
                                    <IndicatorComponent
                                      indicator={programWiseIndicator}
                                      indicatorSize="15"
                                      fontSize="12"
                                      title="Total Lead "
                                      performance={
                                        form?.total_indicator_lead_position ||
                                        "equal"
                                      }
                                      percentage={parseFloat(
                                        form?.total_indicator_lead_percentage
                                          ? form?.total_indicator_lead_percentage
                                          : 0
                                      ).toFixed(2)}
                                      tooltipPosition="right"
                                    ></IndicatorComponent>
                                  </Box>
                                </Box>
                              </StyledTableCell>

                              <StyledTableCell align="left">
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                    fontSize={15}
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => {
                                      handleRedirectToDetails({
                                        redirectionPath:
                                          "application-manager#application-manager-container",
                                        courseDetails: form,
                                      });
                                    }}
                                  >
                                    {form?.total_application}
                                  </Typography>
                                  <Box>
                                    <IndicatorComponent
                                      indicator={programWiseIndicator}
                                      indicatorSize="15"
                                      fontSize="12"
                                      title="Total Applications "
                                      performance={
                                        form?.application_indicator_position ||
                                        "equal"
                                      }
                                      percentage={parseFloat(
                                        form?.application_indicator_percentage
                                          ? form?.application_indicator_percentage
                                          : 0
                                      ).toFixed(2)}
                                      tooltipPosition="right"
                                    ></IndicatorComponent>
                                  </Box>
                                </Box>
                              </StyledTableCell>

                              <StyledTableCell align="left">
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                    fontSize={15}
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => {
                                      handleRedirectToDetails({
                                        redirectionPath:
                                          "paid-applications#paid-application-manager-container",
                                        courseDetails: form,
                                      });
                                    }}
                                  >
                                    {form?.total_paid_application}
                                  </Typography>
                                  <Box>
                                    <IndicatorComponent
                                      indicator={programWiseIndicator}
                                      indicatorSize="15"
                                      fontSize="12"
                                      title="Paid Applications "
                                      performance={
                                        form?.paid_indicator_position || "equal"
                                      }
                                      percentage={parseFloat(
                                        form?.paid_indicator_percentage
                                          ? form?.paid_indicator_percentage
                                          : 0
                                      ).toFixed(2)}
                                      tooltipPosition="right"
                                    ></IndicatorComponent>
                                  </Box>
                                </Box>
                              </StyledTableCell>

                              <StyledTableCell align="left">
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                    fontSize={15}
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => {
                                      handleRedirectToDetails({
                                        redirectionPath:
                                          "application-manager#application-manager-container",
                                        courseDetails: form,
                                        extraParam: {
                                          application_stage: {
                                            application_stage_b: true,
                                            application_stage_name: "completed",
                                          },
                                          addColumn: ["Application Stage"],
                                        },
                                      });
                                    }}
                                  >
                                    {form?.application_submitted}
                                  </Typography>
                                  <Box>
                                    <IndicatorComponent
                                      indicator={programWiseIndicator}
                                      indicatorSize="15"
                                      fontSize="12"
                                      title="Submit Applications "
                                      performance={
                                        form?.submit_indicator_application_position ||
                                        "equal"
                                      }
                                      percentage={parseFloat(
                                        form?.submit_indicator_application_percentage
                                          ? form?.submit_indicator_application_percentage
                                          : 0
                                      ).toFixed(2)}
                                      tooltipPosition="right"
                                    ></IndicatorComponent>
                                  </Box>
                                </Box>
                              </StyledTableCell>
                            </TableRow>
                          ))}

                          <TableRow>
                            <StyledTableCell>
                              <Typography
                                sx={{ fontWeight: "bold" }}
                                variant="subtitle"
                              >
                                Total
                              </Typography>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              <Typography
                                sx={{ cursor: "pointer" }}
                                variant="subtitle"
                                fontWeight={600}
                                fontSize={15}
                                onClick={() => {
                                  handleRedirectToDetails({
                                    redirectionPath:
                                      "form-manager#form-manager-container",
                                    courseDetails: {},
                                    extraParam: {
                                      lead_stage: {
                                        lead_b: true,
                                        lead_name: [],
                                      },
                                    },
                                  });
                                }}
                              >
                                {totalLeads}
                              </Typography>
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              <Typography
                                variant="subtitle"
                                fontWeight={600}
                                fontSize={15}
                                sx={{ cursor: "pointer" }}
                                onClick={() => {
                                  handleRedirectToDetails({
                                    redirectionPath:
                                      "application-manager#application-manager-container",
                                    courseDetails: {},
                                  });
                                }}
                              >
                                {totalApplication}
                              </Typography>
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              <Typography
                                variant="subtitle"
                                fontWeight={600}
                                fontSize={15}
                                sx={{ cursor: "pointer" }}
                                onClick={() => {
                                  handleRedirectToDetails({
                                    redirectionPath:
                                      "paid-applications#paid-application-manager-container",
                                    courseDetails: {},
                                  });
                                }}
                              >
                                {totalPaidApplication}
                              </Typography>
                            </StyledTableCell>

                            <StyledTableCell align="left">
                              <Typography
                                variant="subtitle"
                                fontWeight={600}
                                fontSize={15}
                                sx={{ cursor: "pointer" }}
                                onClick={() => {
                                  handleRedirectToDetails({
                                    redirectionPath:
                                      "application-manager#application-manager-container",
                                    courseDetails: {},
                                    extraParam: {
                                      application_stage: {
                                        application_stage_b: true,
                                        application_stage_name: "completed",
                                      },
                                      addColumn: ["Application Stage"],
                                    },
                                  });
                                }}
                              >
                                {totalApplicationSubmited}
                              </Typography>
                            </StyledTableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {applications?.length > 10 && (
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
          )}
        </>
      )}
    </>
  );
}

export default React.memo(FormWiseApplications);
