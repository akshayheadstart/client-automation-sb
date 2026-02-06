import React, { useContext, useEffect, useState } from "react";
import "../../../styles/sharedStyles.css";
import "../../../styles/preferenceWiseAppliction.css";
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
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import { startAndEndDateSelect } from "../../../utils/adminDashboardDateRangeSelect";
import { currentSeasonDateRangeGenerator } from "../../Calendar/utils";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import MultipleTabs from "../../shared/tab-panel/MultipleTabs";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import SortIndicatorWithTooltip from "../../shared/SortIndicatorWithTooltip/SortIndicatorWithTooltip";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GetFormatDate } from "../../../hooks/GetJsonDate";
import { useGetPreferenceWisePerformanceQuery } from "../../../Redux/Slices/applicationDataApiSlice";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import useToasterHook from "../../../hooks/useToasterHook";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { useSelector } from "react-redux";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";
import { useGetAllCourseListQuery } from "../../../Redux/Slices/filterDataSlice";
import { organizeCourseFilterCoursePreferenceOption } from "../../../helperFunctions/filterHelperFunction";
import {
  customFetch,
  safeJsonParse,
} from "../../../pages/StudentTotalQueries/helperFunction";
const PreferenceWiseApplication = ({
  selectedSeason,
  isScrolledPreferenceWiseApplication,
  apiCallingConditions,
  hidePreferenceWise,
  setHidePreferenceWise,
}) => {
  const pushNotification = useToasterHook();
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [mapTabsValue, setMapTabValue] = useState(0);
  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  const [
    preferenceWiseApplicationDateRange,
    setPreferenceWiseApplicationDateRange,
  ] = useState([]);
  const [selectedCourseFilterValue, setSelectedCourseFilterValue] = useState(
    []
  );
  const [selectedCourseId, setSelectedCourseId] = useState([]);
  const [sortColumn, setSortColumn] = useState("");
  const [sortType, setSortType] = useState(null); // asc or dsc or null
  const [preferenceWiseSortObj, setPreferenceWiseSortObj] = useState({
    sort: "",
    sort_type: "",
  });
  const [
    somethingWentWrongInPreferenceWise,
    setSomethingWentWrongInPreferenceWise,
  ] = useState(false);

  const [
    preferenceWiseInternalServerError,
    setPreferenceWiseInternalServerError,
  ] = useState(false);
  const { handleFilterListApiCall } = useCommonApiCalls();
  const [hideCourseList, setHideCourseList] = useState(false);
  const [skipCourseApiCall, setSkipCourseApiCall] = useState(true);
  const [courseDetails, setCourseDetails] = useState([]);
  const courseListInfo = useGetAllCourseListQuery(
    { collegeId: collegeId },
    { skip: skipCourseApiCall }
  );
  useEffect(() => {
    if (!skipCourseApiCall) {
      const courseList = courseListInfo?.data?.data[0];
      handleFilterListApiCall(
        courseList,
        courseListInfo,
        setCourseDetails,
        setHideCourseList,
        organizeCourseFilterCoursePreferenceOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseListInfo, skipCourseApiCall]);
  const settingStartAndEndDate = () => {
    if (preferenceWiseApplicationDateRange?.length) {
      setStartDateRange(
        getDateMonthYear(preferenceWiseApplicationDateRange[0])
      );
      setEndDateRange(getDateMonthYear(preferenceWiseApplicationDateRange[1]));
    } else if (selectedSeason?.length) {
      startAndEndDateSelect(selectedSeason, setStartDateRange, setEndDateRange);
    } else {
      const seasonDate = currentSeasonDateRangeGenerator();
      setStartDateRange(getDateMonthYear(seasonDate?.firstDayOfSeason));
      setEndDateRange(getDateMonthYear(seasonDate?.lastDayOfSeason));
    }
  };
  useEffect(() => {
    settingStartAndEndDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeason, preferenceWiseApplicationDateRange]);
  const [applicationsUpdateData, setApplicationsUpdateData] = useState([]);
  const [applications, setApplications] = useState({});
  const initialItemsToShow = 10;
  const [itemsToShow, setItemsToShow] = useState(initialItemsToShow);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isRemoveButtonDisabled, setIsRemoveButtonDisabled] = useState(false);
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const handleButtonClick = () => {
    const nextItemsToShow = itemsToShow + 10;

    if (nextItemsToShow >= applications?.data.length) {
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
    const displayedData = applications?.data?.slice(0, itemsToShow);
    if (displayedData) {
      setApplicationsUpdateData(displayedData);
    }
  }, [itemsToShow, applications]);
  const [payload, setPayload] = useState({});
  useEffect(() => {
    let newPayload = {};

    if (preferenceWiseApplicationDateRange?.length > 0) {
      newPayload.date_range = GetFormatDate(preferenceWiseApplicationDateRange);
    } else if (
      preferenceWiseSortObj?.sort &&
      preferenceWiseSortObj?.sort_type
    ) {
      newPayload.sort = true;
      newPayload.sort_name = preferenceWiseSortObj.sort
        .replace(/\s+/g, "")
        .toLowerCase();
      newPayload.sort_type = preferenceWiseSortObj.sort_type;
    } else if (selectedCourseId?.length > 0) {
      newPayload.program_name = selectedCourseId;
    }
    setPayload(newPayload);
  }, [
    preferenceWiseApplicationDateRange,
    preferenceWiseSortObj?.sort,
    preferenceWiseSortObj?.sort_type,
    selectedCourseId,
  ]);
  const { data, isFetching, isError, error, isSuccess } =
    useGetPreferenceWisePerformanceQuery(
      {
        collegeId,
        season: selectedSeason ? safeJsonParse(selectedSeason) : "",
        selectTabs:
          mapTabsValue === 0
            ? "Leads"
            : mapTabsValue === 1
            ? "Applications"
            : "Admissions",
        payload: payload,
      },
      {
        skip:
          isScrolledPreferenceWiseApplication && apiCallingConditions
            ? false
            : true,
      }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        const expectedData = data;
        if (
          typeof expectedData === "object" &&
          expectedData !== null &&
          !Array.isArray(expectedData)
        ) {
          setApplications(data);
        } else {
          throw new Error("ger preference Wise API response has changed");
        }
      }
      if (isError) {
        setApplications({});
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setPreferenceWiseInternalServerError,
            setHidePreferenceWise,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInPreferenceWise,
        setHidePreferenceWise,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, isSuccess]);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const handleDownloadPreferenceWiseData = () => {
    setDownloadLoading(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/admin/preference_wise_data/?data_for=${
        mapTabsValue === 0
          ? "Leads"
          : mapTabsValue === 1
          ? "Applications"
          : "Admissions"
      }&season=${
        selectedSeason ? JSON.parse(selectedSeason)?.season_id : ""
      }&download_data=true&college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "POST", JSON.stringify(payload))
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else {
          const expectedData = result?.file_url;
          pushNotification("success", result?.message);
          try {
            if (typeof expectedData === "string") {
              window.open(result?.file_url);
            } else {
              throw new Error(
                "download_applications_data API response has changed"
              );
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInPreferenceWise,
              setHidePreferenceWise,
              10000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setPreferenceWiseInternalServerError,
          setHidePreferenceWise,
          10000
        );
      })
      .finally(() => {
        setDownloadLoading(false);
      });
  };
  return (
    <Box
      className="top-dashboard-box-table"
      sx={{ visibility: hidePreferenceWise ? "hidden" : "visible" }}
    >
      {preferenceWiseApplicationDateRange?.length > 1 && (
        <DateRangeShowcase
          startDateRange={startDateRange}
          endDateRange={endDateRange}
          triggeredFunction={() => setPreferenceWiseApplicationDateRange([])}
        ></DateRangeShowcase>
      )}
      {somethingWentWrongInPreferenceWise ||
      preferenceWiseInternalServerError ? (
        <>
          {preferenceWiseInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInPreferenceWise && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </>
      ) : (
        <>
          {isFetching ? (
            <Box className="loading-lottie-file-container">
              <LeefLottieAnimationLoader
                height={200}
                width={180}
              ></LeefLottieAnimationLoader>
            </Box>
          ) : (
            <>
              <Box className="top-dashboard-header-and-filter-section">
                <Box className="title-box-hover">
                  <Typography className="top-section-title">
                    Preference Wise Performance
                  </Typography>
                  <Typography className="top-section-date">
                    {startDateRange} - {endDateRange}
                  </Typography>
                </Box>
                <Box className="top-dashboard-section-filters-box">
                  <Box className="state-wise-section-tab-wrapper">
                    <MultipleTabs
                      tabArray={[
                        { tabName: "Leads" },
                        { tabName: "Applications" },
                        {
                          tabName: "Admissions",
                          disable: true,
                        },
                      ]}
                      setMapTabValue={setMapTabValue}
                      mapTabValue={mapTabsValue}
                      boxWidth="330px"
                    ></MultipleTabs>
                  </Box>
                  {hideCourseList || (
                    <MultipleFilterSelectPicker
                      style={{ width: "150px" }}
                      placement="bottomEnd"
                      placeholder="Program"
                      onChange={(value) => {
                        setSelectedCourseFilterValue(value);
                        setPreferenceWiseSortObj({
                          sort: "",
                          sort_type: "",
                        });
                        setSortType(null);
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
                  <IconDateRangePicker
                    onChange={(value) => {
                      setPreferenceWiseApplicationDateRange(value);
                      setPreferenceWiseSortObj({
                        sort: "",
                        sort_type: "",
                      });
                      setSortType(null);
                    }}
                    dateRange={preferenceWiseApplicationDateRange}
                  />
                  <IconButton
                    className="download-button-dashboard"
                    onClick={() => {
                      handleDownloadPreferenceWiseData();
                    }}
                    aria-label="Download"
                  >
                    {downloadLoading ? (
                      <CircularProgress color="info" size={20} />
                    ) : (
                      <FileDownloadOutlinedIcon color="info" />
                    )}
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ p: 0, mt: 2 }}>
                {applicationsUpdateData?.length > 0 ? (
                  <>
                    <TableContainer className="custom-scrollbar">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            {applications?.header?.map((items, headerIndex) => {
                              return (
                                <TableCell
                                  align={headerIndex === 0 ? "left" : "center"}
                                  className="preference-wise-application-table-head-cell"
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent:
                                        headerIndex === 0 ? "start" : "center",
                                      gap: "6px",
                                    }}
                                  >
                                    <Typography className="preference-wise-application-table-head-cell-text">
                                      {items}
                                    </Typography>
                                    {headerIndex !== 0 && (
                                      <>
                                        {sortColumn === items ? (
                                          <SortIndicatorWithTooltip
                                            sortType={sortType}
                                            value={items}
                                            sortColumn={sortColumn}
                                            setSortType={setSortType}
                                            setSortColumn={setSortColumn}
                                            setSortObj={
                                              setPreferenceWiseSortObj
                                            }
                                          />
                                        ) : (
                                          <SortIndicatorWithTooltip
                                            sortColumn={sortColumn}
                                            setSortType={setSortType}
                                            setSortColumn={setSortColumn}
                                            setSortObj={
                                              setPreferenceWiseSortObj
                                            }
                                            value={items}
                                          />
                                        )}
                                      </>
                                    )}
                                  </Box>
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {applicationsUpdateData?.map((form) => (
                            <TableRow
                              key={form?.course_name}
                              sx={{ ml: "5px" }}
                            >
                              {Object.values(form)?.map(
                                (keysValue, dataIndex) => {
                                  return (
                                    <TableCell
                                      align={
                                        dataIndex === 0 ? "left" : "center"
                                      }
                                      className="preference-wise-application-common"
                                      sx={{ pl: "5px" }}
                                    >
                                      <Typography
                                        variant="subtitle2"
                                        fontWeight={dataIndex === 0 ? 400 : 600}
                                        fontSize={15}
                                      >
                                        {keysValue ? keysValue : "0"}
                                      </Typography>
                                    </TableCell>
                                  );
                                }
                              )}
                            </TableRow>
                          ))}
                          <TableRow>
                            {applications?.total?.map((total, totalIndex) => {
                              return (
                                <TableCell
                                  align={totalIndex === 0 ? "left" : "center"}
                                >
                                  <Typography
                                    sx={{ fontWeight: "bold" }}
                                    variant="subtitle"
                                  >
                                    {total}
                                  </Typography>
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {applications?.data?.length > 10 && (
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
                  <Box className="base-not-found-box">
                    <BaseNotFoundLottieLoader
                      height={250}
                      width={250}
                    ></BaseNotFoundLottieLoader>
                  </Box>
                )}
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default PreferenceWiseApplication;
