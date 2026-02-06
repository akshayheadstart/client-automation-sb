/* eslint-disable react-hooks/exhaustive-deps */

import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  ClickAwayListener,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import CounselorManagerDialog from "../../components/shared/Dialogs/CounselorManagerDialog";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Pagination from "../../components/shared/Pagination/Pagination";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import { handleChangePage } from "../../helperFunctions/pagination";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useToasterHook from "../../hooks/useToasterHook";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  useGetAllCounsellorListQuery,
  useGetHeadCounselorListQuery,
  useMapCounselorToHeadCounselorMutation,
  usePrefetch,
  useUpdateUserStatusMutation,
} from "../../Redux/Slices/applicationDataApiSlice";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/CounsellorManager.css";
import "../../styles/UserManager.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { Popover, Whisper } from "rsuite";
import AllocateCounsellorDialog from "../../components/shared/Dialogs/AllocateCounsellorDialog";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import {
  useGetAllCourseListQuery,
  useGetAllLanguagesListQuery,
  useGetAllSourceListQuery,
  useGetAllStateListQuery,
} from "../../Redux/Slices/filterDataSlice";
import {
  convertAllocatedSpecializationsArray,
  courseSpecializationFilter,
  organizeSourceFilterOption,
} from "../../helperFunctions/filterHelperFunction";
import { useSelector } from "react-redux";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CustomTooltip from "../../components/shared/Popover/Tooltip";
import "../../styles/sharedStyles.css";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import counsellorSearchIcon from "../../images/searchIcon.png";
import counsellorCalendarIcon from "../../images/calendar.png";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import useDebounce from "../../hooks/useDebounce";
import SearchBox from "../../components/shared/SearchBox/SearchBox";
import useCommonErrorHandling from "../../hooks/useCommonErrorHandling";
import { customFetch } from "../StudentTotalQueries/helperFunction";
const CounsellorManager = ({ classToggleCounsellorManager, headerShow }) => {
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [openCounselorManagerDialog, setOpenCounselorManagerDialog] =
    useState(false);
  const pushNotification = useToasterHook();
  const [leaveDates, setLeaveDates] = useState([]);
  const [counsellorList, setCounsellorList] = useState([]);
  const [counselorId, setCounselorId] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [openAllocateCounsellorDialog, setOpenAllocateCounsellorDialog] =
    useState(false);
  const [counsellorWiseAllocatedCourse, setCounsellorWiseAllocatedCourse] =
    useState([]);
  const [
    counsellorWiseAllocatedSpecializations,
    setCounsellorWiseAllocatedSpecializations,
  ] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [counsellorWiseAllocatedState, setCounsellorWiseAllocatedState] =
    useState([]);
  const [counsellorWiseAllocatedSource, setCounsellorWiseAllocatedSource] =
    useState([]);
  const [courseListData, setCourseListData] = useState([]);
  const [selectedCounsellorId, setSelectedCounsellorId] = useState([]);
  const [
    counsellorManagerInternalServerError,
    setCounsellorManagerInternalServerError,
  ] = useState(false);
  const [hideCounsellorManager, setHideCounsellorManager] = useState(false);
  const [
    somethingWentWrongInCounsellorManager,
    setSomethingWentWrongInCounsellorManager,
  ] = useState(false);

  // states for pagination
  const applicationPageNo = localStorage.getItem(
    `${Cookies.get("userId")}counsellorManagerPageNo`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}counsellorManagerPageNo`)
      )
    : 1;

  const tableRowPerPage = localStorage.getItem(
    `${Cookies.get("userId")}counsellorManagerRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}counsellorManagerRowPerPage`
        )
      )
    : 25;

  const [pageNumber, setPageNumber] = useState(applicationPageNo);
  const [rowsPerPage, setRowsPerPage] = useState(tableRowPerPage);
  const [rowCount, setRowCount] = useState(0);
  const [totalRecordsCount, setTotalRecordsCount] = useState(0);
  const [sourceList, setSourceList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [hideSourceList, setHideSourceList] = useState(false);
  const [hideStateList, setHideStateList] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [headCounselorList, setHeadCounselorList] = useState([]);
  const [selectedHeadCounselor, setSelectedHeadCounselor] = useState({
    counselor_id: "",
    head_counselor_id: "",
  });

  const [callFilterOptionApi, setCallFilterOptionApi] = useState({
    skipStateApiCall: true,
    skipSourceApiCall: true,
  });
  const [skipCourseApiCall, setSkipCourseApiCall] = useState(true);
  const [skipHeadCounselorApiCall, setSkipHeadCounselorApiCall] =
    useState(true);

  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [search, setSearch] = useState("");
  const debouncedSearchText = useDebounce(search, 500);
  const count = Math.ceil(rowCount / rowsPerPage);
  const {
    data: counsellorData,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetAllCounsellorListQuery({
    pageNumber: pageNumber,
    rowsPerPage: rowsPerPage,
    collegeId: collegeId,
    search: debouncedSearchText,
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(counsellorData?.data)) {
          setTotalRecordsCount(counsellorData?.total);
          setCounsellorList(counsellorData?.data);
          setRowCount(counsellorData?.total);
        } else {
          throw new Error("all counsellor list API response has changed");
        }
      }
      if (isError) {
        setTotalRecordsCount(0);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setCounsellorManagerInternalServerError,
            setHideCounsellorManager,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInCounsellorManager,
        setHideCounsellorManager,
        10000
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isError, isSuccess, counsellorData]);

  // use react hook for prefetch data
  const prefetchCounsellorListData = usePrefetch("getAllCounsellorList");
  useEffect(() => {
    apiCallFrontAndBackPage(
      counsellorData,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchCounsellorListData,
      {
        search: debouncedSearchText,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counsellorData, pageNumber, prefetchCounsellorListData, rowsPerPage]);

  const headCounselorApiCallInfo = useGetHeadCounselorListQuery(
    { collegeId },
    { skip: skipHeadCounselorApiCall }
  );
  const handleError = useCommonErrorHandling();
  useEffect(() => {
    const { data, isError, isSuccess, error } = headCounselorApiCallInfo;
    try {
      if (isSuccess) {
        if (data?.data) {
          if (Array.isArray(data?.data)) {
            setHeadCounselorList(data.data);
          } else {
            throw new Error("Head counselor api response has been changed.");
          }
        } else if (isError) {
          handleError({
            error,
            setIsInternalServerError: setApplicationFunnelInternalServerError,
            setHide: () => {},
          });
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInCounsellorManager,
        "",
        5000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headCounselorApiCallInfo]);
  const { handleFilterListApiCall } = useCommonApiCalls();
  // get course list
  const courseListInfo = useGetAllCourseListQuery(
    { collegeId: collegeId },
    {
      skip: skipCourseApiCall,
    }
  );

  useEffect(() => {
    if (!skipCourseApiCall) {
      const courseList = courseListInfo?.data?.data[0]?.map((course) => {
        return { label: course.course_name, value: course.course_name };
      });
      handleFilterListApiCall(
        courseList,
        courseListInfo,
        (listOfCourses) => {
          setCourseList(listOfCourses);
          setCourseListData(courseListInfo?.data?.data[0]);
        },
        () => {}
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseListInfo, skipCourseApiCall]);

  const sourceListInfo = useGetAllSourceListQuery(
    { collegeId },
    { skip: callFilterOptionApi.skipSourceApiCall }
  );

  //get source list
  useEffect(() => {
    if (!callFilterOptionApi.skipSourceApiCall) {
      const sourceList = sourceListInfo?.data?.data[0];

      handleFilterListApiCall(
        sourceList,
        sourceListInfo,
        setSourceList,
        setHideSourceList,
        organizeSourceFilterOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callFilterOptionApi.skipSourceApiCall, sourceListInfo, hideSourceList]);

  useEffect(() => {
    const filterOptions = JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}counselorManagerFilter`)
    );
    if (filterOptions) {
      if (filterOptions.source) {
        filterOptions.source?.length &&
          setCallFilterOptionApi((prev) => ({
            ...prev,
            skipSourceApiCall: false,
          }));
      }
      if (filterOptions.state) {
        filterOptions.state?.length &&
          setCallFilterOptionApi((prev) => ({
            ...prev,
            skipStateApiCall: false,
          }));
      }

      if (filterOptions.source || filterOptions.state) {
        setShowFilter(true);
      }
    }
  }, []);

  //getting state list
  const stateListInfo = useGetAllStateListQuery(undefined, {
    skip: callFilterOptionApi.skipStateApiCall,
  });

  useEffect(() => {
    if (!callFilterOptionApi.skipStateApiCall) {
      const stateList = stateListInfo.data;
      const modifyFilterOptions = (data) => {
        return data.map((item) => ({ label: item.name, value: item.iso2 }));
      };
      handleFilterListApiCall(
        stateList,
        stateListInfo,
        setStateList,
        setHideStateList,
        modifyFilterOptions
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callFilterOptionApi.skipStateApiCall, stateListInfo, hideStateList]);

  // getting absent date of counselor
  const getAbsentDateOfCounselor = (counselorId) => {
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/counselor/absent?counselor_id=${counselorId}${
        collegeId ? "&college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(token, "GET")
    )
      .then((res) =>
        res.json().then((data) => {
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (Array.isArray(data?.data?.leave_dates)) {
            setLeaveDates(data?.data?.leave_dates);
          } else if (data.detail) {
            setLeaveDates([]);
            pushNotification("error", data.detail);
          }
        })
      )
      .catch(() => {
        handleInternalServerError(
          setCounsellorManagerInternalServerError,
          "",
          10000
        );
      });
  };

  const [isMapDone, setIsMapDone] = useState(false);
  const [isCounselorMapLoading, setIsCounselorMapLoading] = useState(false);
  const [mapCounselorToHeadCounselor] =
    useMapCounselorToHeadCounselorMutation();

  const handleMapCounselorToHeadCounselor = async (e) => {
    e.preventDefault();
    setIsCounselorMapLoading(true);
    await mapCounselorToHeadCounselor({ selectedHeadCounselor, collegeId })
      .unwrap()
      .then((data) => {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data.message) {
          pushNotification("success", data.message);
        } else if (data.detail) {
          pushNotification("error", data.detail);
        }
      })
      .catch(() => {
        handleInternalServerError(
          setCounsellorManagerInternalServerError,
          "",
          10000
        );
      })
      .finally(() => {
        setIsMapDone(true);
        setIsCounselorMapLoading(false);
        setSelectedHeadCounselor({ counselor_id: "", head_counselor_id: "" });
      });
  };

  useEffect(() => {
    if (courseListData) {
      const filteredSpecializations = courseSpecializationFilter(
        courseListData,
        counsellorWiseAllocatedCourse
      );
      setCounsellorWiseAllocatedSpecializations(filteredSpecializations);
    }
  }, [counsellorWiseAllocatedCourse, courseListData]);

  const speaker = (
    <Popover style={{ display: `${isMapDone ? "none" : "block"}` }}>
      <form onSubmit={handleMapCounselorToHeadCounselor}>
        {isCounselorMapLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <CircularProgress size={25} color="info" />
          </Box>
        )}
        <Box className="map-head-counselor-container">
          <Autocomplete
            onOpen={() => setSkipHeadCounselorApiCall(false)}
            loading={headCounselorApiCallInfo?.isFetching}
            disablePortal
            getOptionLabel={(option) => option.counselor_name}
            options={headCounselorList}
            sx={{ width: 250 }}
            size="small"
            onChange={(_, value) =>
              setSelectedHeadCounselor((prev) => ({
                ...prev,
                head_counselor_id: value?.id,
              }))
            }
            renderInput={(params) => (
              <TextField
                required
                size="small"
                color="info"
                {...params}
                label="Select Head Counselor"
              />
            )}
          />
          <Button size="small" variant="outlined" type="submit" color="info">
            Submit
          </Button>
        </Box>
      </form>
    </Popover>
  );
  const [searchFieldToggle, setSearchFieldToggle] = useState(false);
  const StyledTableCell = useTableCellDesign();
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Counsellor Manager Head Title add
  useEffect(() => {
    if (!headerShow) {
      setHeadTitle("Counsellor Manager");
      document.title = "Counsellor Manager";
    }
  }, [headTitle]);
  const [counsellorWiseAllocatedLanguage, setCounsellorWiseAllocatedLanguage] =
    useState([]);
  const [skipLanguageApiCall, setSkipLanguageApiCall] = useState(true);
  //Get languages List
  const languagesList = useGetAllLanguagesListQuery(
    { collegeId },
    { skip: skipLanguageApiCall }
  );
  const [languagesDataList, setLanguagesDataList] = useState([]);
  const [hideLanguageList, setHideLanguageList] = useState(false);
  //get source list
  useEffect(() => {
    if (!skipLanguageApiCall) {
      const languagesInfoList = languagesList?.data?.data;
      handleFilterListApiCall(
        languagesInfoList,
        languagesList,
        setLanguagesDataList,
        setHideLanguageList,
        organizeSourceFilterOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipLanguageApiCall, languagesList]);
  const [counsellorWiseFreshLeadLimit, setCounsellorWiseFreshLeadLimit] =
    useState(0);
  const columns = [
    { columnName: "Counsellor Name", id: "counsellor_name" },
    { columnName: "Mapped head counselor", id: "mapped_head_counselor" },
    { columnName: "Allocated Courses", id: "allocated_courses" },
    { columnName: "Allocated Specialization", id: "allocated_specialization" },
    { columnName: "Allocated States", id: "allocated_states" },
    { columnName: "Allocated Sources", id: "allocated_sources" },
    { columnName: "Fresh Lead Limit", id: "fresh_lead_limit" },
    { columnName: "Language", id: "language" },
    { columnName: "Status", id: "status" },
    { columnName: "Custom holiday", id: "custom_holiday" },
  ];

  const [userStatusInternalServerError, setUserStatusInternalServerError] =
    useState(false);
  const [
    somethingWentWrongInUserStatusUpdate,
    setSomethingWentWrongInUserStatusUpdate,
  ] = useState(false);
  const [updateUserStatus] = useUpdateUserStatusMutation();

  const handleActiveOrInactiveUser = (userId, isActive) => {
    updateUserStatus({ userId, isActive, collegeId })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              pushNotification("success", res?.message);
            } else {
              throw new Error("enable_or_disable API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInUserStatusUpdate,
              "",
              5000
            );
          }
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        }
      })
      .catch((error) => {
        handleInternalServerError(setUserStatusInternalServerError, "", 5000);
      });
  };

  const handleSettingConfigStates = (counsellor) => {
    setOpenAllocateCounsellorDialog(true);
    setSelectedCounsellorId(counsellor?.id);
    setCounsellorWiseAllocatedCourse(
      !counsellor?.allocate_courses ? [] : counsellor?.allocate_courses
    );
    setSkipCourseApiCall(counsellor?.allocate_courses?.length ? false : true);
    setCounsellorWiseAllocatedState(
      !counsellor?.allocate_state ? [] : counsellor?.allocate_state
    );
    counsellor?.allocate_state?.length &&
      setCallFilterOptionApi((prev) => ({
        ...prev,
        skipStateApiCall: false,
      }));
    setCounsellorWiseAllocatedSource(
      !counsellor?.allocate_source ? [] : counsellor?.allocate_source
    );
    counsellor?.allocate_source?.length &&
      setCallFilterOptionApi((prev) => ({
        ...prev,
        skipSourceApiCall: false,
      }));
    counsellor?.allocated_specialization.length > 0 &&
      setSelectedSpecializations(
        counsellor?.allocated_specialization.length > 0
          ? convertAllocatedSpecializationsArray(
              counsellor?.allocated_specialization
            )
          : []
      );
    setCounsellorWiseAllocatedLanguage(
      !counsellor?.language?.length ? [] : counsellor?.language
    );
    counsellor?.language?.length && setSkipLanguageApiCall((prev) => !prev);

    setCounsellorWiseFreshLeadLimit(counsellor?.fresh_lead_limit);
  };
  return (
    <Box
      sx={{ px: "28px", py: "20px" }}
      className={
        classToggleCounsellorManager
          ? ""
          : "counsellor-manager-header-box-container"
      }
    >
      <Paper
        sx={{
          width: "auto",
          overflow: "hidden",
          p: "32px",
          borderRadius: "20px",
          boxShadow: "0px 10px 60px rgba(226, 236, 249, 0.5) !important",
        }}
      >
        <Box>
          <Box className="counselor-manager-heading">
            <Box>
              <Typography className="counsellor-manager-headline-text">
                Counsellor Details
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "#9E9E9E" }}>
                Total <span>{totalRecordsCount}</span> Records
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: "5px" }}>
              <Box sx={{ mb: 1 }}>
                <ClickAwayListener
                  onClickAway={() => setSearchFieldToggle(false)}
                >
                  <Box>
                    {!searchFieldToggle ? (
                      <img
                        onClick={() => setSearchFieldToggle(true)}
                        src={counsellorSearchIcon}
                        alt=""
                        srcset=""
                        height={"38px"}
                      />
                    ) : (
                      <SearchBox
                        setSearchText={setSearch}
                        searchText={search}
                        setPageNumber={setPageNumber}
                        setAllDataFetched={() => {}}
                        searchIconClassName="search-icon"
                        className="counsellor-manager-searchbox"
                        searchBoxColor={"info"}
                      />
                    )}
                  </Box>
                </ClickAwayListener>
              </Box>
            </Box>
          </Box>

          {!showFilter && <Box className="counselor-manager-filters"></Box>}
        </Box>

        {counsellorManagerInternalServerError ||
        somethingWentWrongInCounsellorManager ||
        somethingWentWrongInUserStatusUpdate ||
        userStatusInternalServerError ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              minHeight: "55vh",
              alignItems: "center",
            }}
            data-testid="error-animation-container"
          >
            {(counsellorManagerInternalServerError ||
              userStatusInternalServerError) && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {(somethingWentWrongInCounsellorManager ||
              somethingWentWrongInUserStatusUpdate) && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </Box>
        ) : (
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{ visibility: hideCounsellorManager ? "hidden" : "visible" }}
          >
            {isFetching ? (
              <Box className="loading-animation-counselor-manager">
                <LeefLottieAnimationLoader
                  height={200}
                  width={180}
                ></LeefLottieAnimationLoader>
              </Box>
            ) : (
              <Card sx={{ boxShadow: 0 }}>
                {counsellorList?.length > 0 ? (
                  <TableContainer
                    component={Paper}
                    className="counselor-manager-table-container custom-scrollbar"
                    sx={{ boxShadow: 0 }}
                  >
                    <Table
                      sx={{
                        minWidth: 650,
                      }}
                      aria-label="a dense table"
                    >
                      <TableHead sx={{ bgcolor: "#FFF" }}>
                        <TableRow sx={{ borderBottom: "1px solid #EEE" }}>
                          <StyledTableCell
                            className="counsellor-manager-head-text"
                            align="left"
                          >
                            Configure
                          </StyledTableCell>
                          {columns?.map((col) => (
                            <StyledTableCell
                              key={col.id}
                              // onClick={(e) => {
                              //   if(col.id==='allocated_courses'){

                              //     handleSortColumn(col.id)
                              //   }
                              // }}
                              // width={col.width}
                            >
                              <Box sx={{ display: "flex", gap: "5px" }}>
                                {col.columnName}{" "}
                                {/* {
                                col.id==='allocated_courses' &&
                                <>
                              {sortColumn === col.id ? (
                                <SortIndicatorWithTooltip sortType={sortType} />
                              ) : (
                                <SortIndicatorWithTooltip />
                              )}
                                </>
                              } */}
                              </Box>
                            </StyledTableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {counsellorList?.map((counsellor) => (
                          <TableRow key={counsellor?.id}>
                            <TableCell
                              align="center"
                              sx={{ borderBottom: "1px solid #E6E8F0" }}
                            >
                              <SettingsOutlinedIcon
                                sx={{
                                  color: "rgba(0, 139, 226, 1)",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleSettingConfigStates(counsellor)
                                }
                              />
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{ borderBottom: "1px solid #E6E8F0" }}
                            >
                              <Typography variant="subtitle2">
                                {counsellor?.counselor_name
                                  ? counsellor?.counselor_name
                                  : `– –`}
                              </Typography>
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{ borderBottom: "1px solid #E6E8F0" }}
                            >
                              <div>
                                <Whisper
                                  placement="bottom"
                                  controlId="control-id-click"
                                  trigger="click"
                                  speaker={speaker}
                                >
                                  <div>
                                    <CustomTooltip
                                      description={
                                        <div>
                                          Click here and update Head Counsellor
                                        </div>
                                      }
                                      component={
                                        <Button
                                          variant="outlined"
                                          endIcon={<ArrowDropDownIcon />}
                                          color="info"
                                          className="add-course-button"
                                          size="small"
                                          onClick={() => {
                                            setSelectedHeadCounselor({
                                              counselor_id: counsellor.id,
                                              head_counselor_id: "",
                                            });
                                            setIsMapDone(false);
                                          }}
                                        >
                                          {counsellor?.head_counselor_name
                                            ? counsellor?.head_counselor_name
                                            : `– –`}
                                        </Button>
                                      }
                                    />
                                  </div>
                                </Whisper>
                              </div>
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                p: "1.5rem",
                                borderBottom: "1px solid #E6E8F0",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                }}
                              >
                                {counsellor?.allocate_courses
                                  ? counsellor?.allocate_courses
                                      ?.slice(0, 2)
                                      .map((course, index) => (
                                        <span
                                          className="counsellor-allocated-items"
                                          key={index}
                                        >
                                          {`${course},`}
                                        </span>
                                      ))
                                  : `– –`}
                                {counsellor?.allocate_courses?.length > 2 && (
                                  <CustomTooltip
                                    description={
                                      <div>
                                        {" "}
                                        <ul>
                                          {" "}
                                          {counsellor?.allocate_courses
                                            ?.slice(2)
                                            .map((course) => {
                                              return <li>{course}</li>;
                                            })}
                                        </ul>
                                      </div>
                                    }
                                    component={
                                      <Box
                                        sx={{ borderRadius: 10 }}
                                        className="counsellor-manager-course-length-box"
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: "10px",
                                            color: "white",
                                          }}
                                        >{`+${
                                          counsellor?.allocate_courses?.slice(2)
                                            ?.length
                                        }`}</Typography>
                                      </Box>
                                    }
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                p: "1.5rem",
                                borderBottom: "1px solid #E6E8F0",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                }}
                              >
                                {counsellor?.allocated_specialization.length > 0
                                  ? counsellor?.allocated_specialization
                                      ?.slice(0, 1)
                                      .map((specialization, index) => (
                                        <span
                                          className="counsellor-allocated-items"
                                          key={index}
                                        >
                                          {`${specialization.course_name} ${
                                            specialization.spec_name ? "in" : ""
                                          } ${
                                            specialization.spec_name
                                              ? specialization.spec_name
                                              : "(no specialization)"
                                          }`}
                                        </span>
                                      ))
                                  : `– –`}
                                {counsellor?.allocated_specialization?.length >
                                  1 && (
                                  <CustomTooltip
                                    description={
                                      <div>
                                        {" "}
                                        <ul>
                                          {" "}
                                          {counsellor?.allocated_specialization
                                            ?.slice(1)
                                            .map((specialization) => {
                                              return (
                                                <li>{`${
                                                  specialization.course_name
                                                } ${
                                                  specialization.spec_name
                                                    ? "in"
                                                    : ""
                                                } ${
                                                  specialization.spec_name
                                                    ? specialization.spec_name
                                                    : "(no specialization)"
                                                }`}</li>
                                              );
                                            })}
                                        </ul>
                                      </div>
                                    }
                                    component={
                                      <Box
                                        sx={{ borderRadius: 10 }}
                                        className="counsellor-manager-course-length-box"
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: "10px",
                                            color: "white",
                                          }}
                                        >{`+${
                                          counsellor?.allocated_specialization?.slice(
                                            1
                                          )?.length
                                        }`}</Typography>
                                      </Box>
                                    }
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                p: "1.5rem",
                                borderBottom: "1px solid #E6E8F0",
                              }}
                            >
                              {counsellor?.allocate_state_name
                                ? counsellor?.allocate_state_name?.map(
                                    (stateName, index) => (
                                      <span
                                        className="counsellor-allocated-items"
                                        key={index}
                                      >
                                        {stateName}
                                      </span>
                                    )
                                  )
                                : `– –`}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                p: "1.5rem",
                                borderBottom: "1px solid #E6E8F0",
                              }}
                            >
                              {counsellor?.allocate_source
                                ? counsellor?.allocate_source?.map(
                                    (source, index) => (
                                      <span
                                        className="counsellor-allocated-items"
                                        key={index}
                                      >
                                        {source}
                                      </span>
                                    )
                                  )
                                : `– –`}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ borderBottom: "1px solid #E6E8F0" }}
                            >
                              {counsellor?.fresh_lead_limit
                                ? counsellor?.fresh_lead_limit
                                : "0"}
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                p: "1.5rem",
                                borderBottom: "1px solid #E6E8F0",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                }}
                              >
                                {counsellor?.language
                                  ? counsellor?.language
                                      ?.slice(0, 2)
                                      .map((item, index) => (
                                        <span
                                          className="counsellor-allocated-items"
                                          key={index}
                                        >
                                          {`${item},`}
                                        </span>
                                      ))
                                  : `– –`}
                                {counsellor?.language?.length > 2 && (
                                  <CustomTooltip
                                    description={
                                      <div>
                                        {" "}
                                        <ul>
                                          {" "}
                                          {counsellor?.language
                                            ?.slice(2)
                                            .map((course) => {
                                              return <li>{course}</li>;
                                            })}
                                        </ul>
                                      </div>
                                    }
                                    component={
                                      <Box
                                        sx={{ borderRadius: 10 }}
                                        className="counsellor-manager-course-length-box"
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: "10px",
                                            color: "white",
                                          }}
                                        >{`+${
                                          counsellor?.language?.slice(2)?.length
                                        }`}</Typography>
                                      </Box>
                                    }
                                  />
                                )}
                              </Box>
                            </TableCell>

                            <TableCell
                              align="left"
                              sx={{
                                p: "1.5rem",
                                borderBottom: "1px solid #E6E8F0",
                              }}
                            >
                              {counsellor.status === "Active" ? (
                                <Tooltip
                                  placement="left"
                                  title="Click here to Inactivate"
                                  arrow
                                >
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    className="add-status-course-button"
                                    color="info"
                                    onClick={() =>
                                      handleActiveOrInactiveUser(
                                        counsellor.id,
                                        false
                                      )
                                    }
                                    sx={{ borderRadius: 50 }}
                                  >
                                    {counsellor.status
                                      ? counsellor.status
                                      : "Active"}
                                  </Button>
                                </Tooltip>
                              ) : (
                                <Tooltip
                                  placement="left"
                                  title="Click here to Activate"
                                  arrow
                                >
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    className="add-status-course-button-inActive"
                                    color="info"
                                    onClick={() =>
                                      handleActiveOrInactiveUser(
                                        counsellor.id,
                                        true
                                      )
                                    }
                                    sx={{ borderRadius: 50 }}
                                  >
                                    {counsellor.status
                                      ? counsellor.status
                                      : "Inactive"}
                                  </Button>
                                </Tooltip>
                              )}
                            </TableCell>

                            <TableCell
                              align="center"
                              sx={{ borderBottom: "1px solid #E6E8F0" }}
                            >
                              <img
                                src={counsellorCalendarIcon}
                                alt=""
                                srcset=""
                                onClick={() => {
                                  setCounselorId(counsellor.id);
                                  getAbsentDateOfCounselor(counsellor?.id);
                                  setOpenCounselorManagerDialog(true);
                                }}
                                style={{ cursor: "pointer" }}
                                width={"30px"}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <BaseNotFoundLottieLoader
                    height={250}
                    width={250}
                  ></BaseNotFoundLottieLoader>
                )}
                {counsellorList.length > 0 && (
                  <Box className="pagination-container-counsellor-manager">
                    <Pagination
                      className="pagination-bar"
                      currentPage={pageNumber}
                      totalCount={rowCount}
                      pageSize={rowsPerPage}
                      onPageChange={(page) =>
                        handleChangePage(
                          page,
                          `counsellorManagerPageNo`,
                          setPageNumber
                        )
                      }
                      count={count}
                    />

                    <AutoCompletePagination
                      rowsPerPage={rowsPerPage}
                      rowPerPageOptions={rowPerPageOptions}
                      setRowsPerPageOptions={setRowsPerPageOptions}
                      rowCount={rowCount}
                      page={pageNumber}
                      setPage={setPageNumber}
                      localStorageChangeRowPerPage={`counsellorManagerRowPerPage`}
                      localStorageChangePage={`counsellorManagerPageNo`}
                      setRowsPerPage={setRowsPerPage}
                    ></AutoCompletePagination>
                  </Box>
                )}
              </Card>
            )}
          </Grid>
        )}
      </Paper>
      <CounselorManagerDialog
        leaveDates={leaveDates}
        open={openCounselorManagerDialog}
        setOpen={setOpenCounselorManagerDialog}
        setCounsellorManagerInternalServerError={
          setCounsellorManagerInternalServerError
        }
        counselorId={counselorId}
      />
      <AllocateCounsellorDialog
        open={openAllocateCounsellorDialog}
        setOpen={setOpenAllocateCounsellorDialog}
        selectedCounsellorId={selectedCounsellorId}
        courseList={courseList}
        stateList={stateList}
        sourceList={sourceList}
        counsellorWiseAllocatedCourse={counsellorWiseAllocatedCourse}
        setCounsellorWiseAllocatedCourse={setCounsellorWiseAllocatedCourse}
        counsellorWiseAllocatedState={counsellorWiseAllocatedState}
        setCounsellorWiseAllocatedState={setCounsellorWiseAllocatedState}
        counsellorWiseAllocatedSource={counsellorWiseAllocatedSource}
        setCounsellorWiseAllocatedSource={setCounsellorWiseAllocatedSource}
        sourceListInfo={sourceListInfo}
        stateListInfo={stateListInfo}
        setCallFilterOptionApi={setCallFilterOptionApi}
        counsellorWiseAllocatedSpecializations={
          counsellorWiseAllocatedSpecializations
        }
        setCounsellorWiseAllocatedSpecializations={
          setCounsellorWiseAllocatedSpecializations
        }
        languagesDataList={languagesDataList}
        setSkipLanguageApiCall={setSkipLanguageApiCall}
        languagesList={languagesList}
        hideLanguageList={hideLanguageList}
        counsellorWiseAllocatedLanguage={counsellorWiseAllocatedLanguage}
        setCounsellorWiseAllocatedLanguage={setCounsellorWiseAllocatedLanguage}
        counsellorWiseFreshLeadLimit={counsellorWiseFreshLeadLimit}
        setCounsellorWiseFreshLeadLimit={setCounsellorWiseFreshLeadLimit}
        setSelectedSpecializations={setSelectedSpecializations}
        selectedSpecializations={selectedSpecializations}
        setSkipCourseApiCall={setSkipCourseApiCall}
        loadingCourseListApi={courseListInfo?.isFetching}
      />
    </Box>
  );
};

export default CounsellorManager;
