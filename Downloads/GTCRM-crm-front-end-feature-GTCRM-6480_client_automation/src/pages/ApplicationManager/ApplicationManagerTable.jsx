/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography, Card, Button, Drawer } from "@mui/material";
import "../../styles/ApplicationManagerTable.css";
import BasicDetailsTable from "../../components/ui/application-manager/BasicDetailsTable";
import QuickSnapshoot from "../../components/ui/application-manager/QuickSnapshoot";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import { useDispatch, useSelector } from "react-redux";
import { removeCookies } from "../../Redux/Slices/authSlice";
import GetJsonDate from "../../hooks/GetJsonDate";
import ChangeMultipleLeadStage from "../../components/ui/counsellor-dashboard/ChangeMultipleLeadStage";
import AssignCounsellorDialog from "../../components/ui/application-manager/AssignCounsellorDialog";
import Mail from "../../components/userProfile/Mail";
import { DateRangePicker, SelectPicker } from "rsuite";
import {
  addColumnOptionForApplications,
  applicationStage,
  ApplicationVerificationStatus,
  blankPayloadOfAllApplication,
  formStageList,
  leadType,
  listOfSourcesType,
  paymentStatusList,
} from "../../constants/LeadStageList";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import FilterSelectPicker from "../../components/shared/filters/FilterSelectPicker";
import useToasterHook from "../../hooks/useToasterHook";
import { handleReportGenerate } from "../../hooks/useReportGenerateApi";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import SelectTemplateDialog from "../TemplateManager/SelectTemplateDialog";
import SmsAndWhatsapp from "../../components/userProfile/SmsAndWhatsapp";
import { removeDuplicatesAndSetObjectValues } from "../../helperFunctions/removeDuplicatesAndSetObjectValues";
import {
  useGetApplicationsQuery,
  usePrefetch,
  useGenerateReportMutation,
  useGetCounselorListQuery,
} from "../../Redux/Slices/applicationDataApiSlice";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import RestrictedAlert from "../../components/ui/admin-dashboard/RestrictedAlert";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import DeleteDialogue from "../../components/shared/Dialogs/DeleteDialogue";
import FilterSaveDialog from "../../components/shared/Dialogs/FilterSaveDialog";
import ReportNameDialog from "./ReportNameGettingDialog";
import FilterHeader from "../../components/ui/application-manager/FIlterHeader";
import LeadActions from "../../components/ui/application-manager/LeadActions";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import useFetchUTMMedium from "../../hooks/useFetchUTMMedium";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import { useCallback } from "react";
import "../../styles/sharedStyles.css";

import {
  useGetAllCourseListQuery,
  useGetAllExtraFiltersListQuery,
  useGetAllSourceListQuery,
  useGetAllStateListQuery,
} from "../../Redux/Slices/filterDataSlice";
import {
  organizeCounselorFilterOption,
  organizeCourseFilterOption,
  organizeSourceFilterOption,
} from "../../helperFunctions/filterHelperFunction";
import ExtraFilterList from "./ExtraFilterList";
import SendEmailVerificationDialog from "../../components/shared/Dialogs/SendEmailVerificationDialog";
import { useLeadStageLabel } from "../../hooks/useLeadStageLabel";
import { handleDataFilterOption } from "../../helperFunctions/handleDataFilterOption";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import LeadStageCountAndDetails from "../../components/ui/application-manager/LeadStageCountAndDetails";
import TableTopPagination from "../../components/ui/application-manager/TableTopPagination";
import { applicationInitialColumns } from "../../components/Calendar/utils";
import LeadManagerHeader from "../../components/ui/application-manager/LeadManagerHeader";
import ApplicationHeader from "../../components/userProfile/ApplicationHeader";
import "../../styles/sharedStyles.css";
// import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { scrollToTheElement } from "../../utils/ScrollToTheElement";
import AdvanceFilterButton from "../../components/shared/AdvanceFilter/AdvanceFilterButton";
import AdvanceFilterDrawer from "../../components/shared/AdvanceFilter/AdvanceFilterDrawer";
import { addFilterOptionToCookies } from "../../helperFunctions/advanceFilterHelperFunctions";
import useFetchCommonApi from "../../hooks/useFetchCommonApi";
import { customFetch } from "../StudentTotalQueries/helperFunction";
// ============
function ApplicationManagerTable(props) {
  // counselor id coming from counsellor dashboard
  const { state } = useLocation();
  const permissions = useSelector((state) => state.authentication.permissions);
  const innerSearchPermission =
    permissions?.menus?.application_manager?.manage_applications?.features
      ?.application_manager_search;
  const pushNotification = useToasterHook();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const tokenState = useSelector((state) => state.authentication.token);
  const [collegeId, setCollegeId] = useState("");
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const {
    leadStageLabelList,
    setSkipCallNameAndLabelApi,
    loadingLabelList,
    leadStageObject,
  } = useFetchCommonApi();

  const userEmail = useSelector(
    (state) => state.authentication.userEmail?.userId
  );
  const selectedSeason = useSelector(
    (state) => state.authentication.selectedSeason
  );
  const isActionDisable = useSelector(
    (state) => state.authentication.isActionDisable
  );

  const currentUserCollegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  //advance filter
  const [openAdvanceFilter, setOpenAdvanceFilter] = useState(false);
  const [advanceFilterBlocks, setAdvanceFilterBlocks] = useState([]);
  const [applyAdvanceFilter, setApplyAdvanceFilter] = useState(false);

  const advFilterLocalStorageKey = `${Cookies.get(
    "userId"
  )}applicationManagerAdvanceFilterOptions`;

  const [counselorIdFromNavigation, setCounselorIdFromNavigation] =
    useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (tokenState.detail) {
    dispatch(removeCookies());
    navigate("/page401");
  }

  //send verification email dialog state
  const [openSendVerificationEmailDialog, setOpenSendVerificationEmailDialog] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [openCol, setOpenCol] = useState(false);
  const [allApplicationDateRange, setAllApplicationDateRange] = useState([]);

  const [openQuickSnapShotDrawer, setOpenQuickSnapShotDrawer] = useState(false);
  // action button-----

  const [searchedEmail, setSearchedEmail] = useState("");
  useEffect(() => {
    localStorage.setItem(
      `${Cookies.get("userId")}adminApplicationSavePageNo`,
      JSON.stringify(1)
    );
  }, []);
  // states for pagination
  const applicationPageNo = localStorage.getItem(
    `${Cookies.get("userId")}adminApplicationSavePageNo`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}adminApplicationSavePageNo`
        )
      )
    : 1;

  const tableRowPerPage = localStorage.getItem(
    `${Cookies.get("userId")}adminTableRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}adminTableRowPerPage`)
      )
    : 25;
  const [pageNumber, setPageNumber] = useState(applicationPageNo);
  const [rowsPerPage, setRowsPerPage] = useState(tableRowPerPage);
  const [rowCount, setRowCount] = useState();
  const [sourceList, setSourceList] = useState([]);
  const [counsellorList, setCounsellorList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [listOfCourses, setListOfCourses] = useState([]);
  const [shouldCallApplicationsApi, setShouldCallApplicationsApi] =
    useState(false);

  //loading filter options
  const [loadingFilterOptions, setLoadingFilterOptions] = useState({
    stateData: false,
    sourceData: false,
    courseData: false,
    utmMediumData: false,
  });

  // filter option api calling state
  const [callFilterOptionApi, setCallFilterOptionApi] = useState({
    skipStateApiCall: true,
    skipSourceApiCall: true,
    skipCounselorApiCall: true,
    skipCourseApiCall: true,
    callUtmMedium: undefined,
  });

  const {
    handleFilterListApiCall,
    handleExtraFilterListApiCall,
    getSavedFiltersList,
    handleDeleteSavedFilter,
    handleAddSavedFilter,
  } = useCommonApiCalls();

  //additional column states
  const [regState, setRegState] = useState(false);
  const [city, setCity] = useState(false);

  //states of user scope
  const [collegeHeadCounsellor, setCollegeHeadCounsellor] = useState(false);
  const [collegeCounsellor, setCollegeCounsellor] = useState(false);
  const [collegeSuperAdmin, setCollegeSuperAdmin] = useState(false);
  const [collegeAdmin, setCollegeAdmin] = useState(false);

  //states for add column and application filter
  const [checkedState, setCheckedState] = useState(false);
  const [checkedCity, setCheckedCity] = useState(false);
  const [checkedSource, setCheckedSource] = useState(false);
  const [checkedLeadType, setCheckedLeadType] = useState(false);
  const [checkedLeadStage, setCheckedLeadStage] = useState(false);
  const [checkedCounselorName, setCheckedCounselorName] = useState(false);
  const [checkedApplicationStage, setCheckedApplicationStage] = useState(false);
  const [checkedApplicationDate, setCheckedApplicationDate] = useState(false);
  const [checkUTMMedium, setCheckUTMMedium] = useState(false);
  const [checkUTMCampaign, setCheckUTMCampaign] = useState(false);
  const [checkOutboundCallsCount, setCheckOutboundCallsCount] = useState(false);
  const [checkedSourceType, setCheckedSourceType] = useState(false);
  const [checkedVerificationStatus, setCheckedVerificationStatus] =
    useState(false);
  const [checkedLeadSubStage, steCheckedLeadSubStage] = useState(false);

  const [openSaveFilterDialog, setOpenSaveFilterDialog] = useState(false);
  const [filterSaveName, setFilterSaveName] = useState("");
  const [filterSaveInternalServerError, setFilterSaveInternalServerError] =
    useState(false);
  const [filterSaveSomethingWentWrong, setFilterSaveSomethingWentWrong] =
    useState(false);
  const [listOfFilters, setListOfFilters] = useState([]);
  const [callFilterSaveApi, setCallFilterSaveApi] = useState(false);
  const [savedFilterLoading, setSavedFilterLoading] = useState(false);
  const [openDeleteFilterDialog, setOpenDeleteFilterDialog] = useState(false);
  const [deleteFilterLoading, setDeleteFilterLoading] = useState(false);
  const [deleteFilterName, setDeleteFilterName] = useState("");
  const [filterPayload, setFilterPayload] = useState("");
  const [showLeadStageCount, setShowLeadStageCount] = useState(false);
  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState([]);

  //report name dialog
  const [openReportNameDialog, setOpenReportNameDialog] = useState(false);

  const [allApplicationPayload, setAllApplicationPayload] = useState(() => {
    const filtersFromAdminDashboard = state?.filters;
    if (filtersFromAdminDashboard) {
      return {
        ...filtersFromAdminDashboard,
        season: selectedSeason?.length
          ? JSON.parse(selectedSeason)?.season_id
          : "",
      };
    } else {
      return {
        ...blankPayloadOfAllApplication,
        season: selectedSeason?.length
          ? JSON.parse(selectedSeason)?.season_id
          : "",
      };
    }
  });

  const [filterDataLoading, setFilterDataLoading] = useState(false);
  const [addedColumnsOrder, setaddedColumnsOrder] = useState(() => {
    if (
      JSON.parse(
        localStorage.getItem(`${Cookies.get("userId")}addedCollumnsOrder`)
      ) === null
    ) {
      localStorage.setItem(
        `${Cookies.get("userId")}addedCollumnsOrder`,
        JSON.stringify([])
      );
      return [];
    }
    return JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}addedCollumnsOrder`)
    );
  });
  //mail component states
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [emailPayload, setEmailPayload] = useState(false);

  const handleComposeClick = useCallback(
    (mailType) => {
      if (mailType === "selected email") {
        if (selectedApplications?.length === 0) {
          setIsLoading(false);
          pushNotification("warning", "Please select applications");
        } else {
          setEmailPayload(false);
          setIsComposeOpen(true);
        }
      } else {
        setEmailPayload(true);
        setIsComposeOpen(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedApplications]
  );

  const handleComposerClose = () => {
    setIsComposeOpen(false);
  };

  //select sms template component
  const [openSelectTemplateDialog, setOpenSelectTemplateDialog] =
    React.useState(false);
  const [templateBody, setTemplateBody] = React.useState("");
  const [templateId, setTemplateId] = useState("");
  const [smsDltContentId, setSmsDltContentId] = React.useState("");
  const [smsType, setSmsType] = React.useState("");
  const [smsSenderName, setSenderName] = React.useState("");
  const [templateType, setTemplateType] = React.useState("");
  const handleClickOpenSelectTemplate = useCallback(
    (type) => {
      if (selectedApplications?.length === 0) {
        pushNotification("warning", "Please select applications");
      } else {
        setOpenSelectTemplateDialog(true);
        setTemplateType(type);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedApplications]
  );

  const handleCloseSelectTemplate = () => {
    setOpenSelectTemplateDialog(false);
  };

  //sms
  const [openDialogsSms, setOpenDialogsSms] = React.useState(false);
  const handleClickOpenDialogsSms = useCallback(() => {
    setOpenDialogsSms(true);
  }, []);
  const handleCloseDialogsSms = useCallback(() => {
    setOpenDialogsSms(false);
  }, []);
  //sms
  const [openDialogsWhatsApp, setOpenDialogsWhatsApp] = React.useState(false);
  const handleClickOpenDialogsWhatsApp = useCallback(() => {
    if (selectedApplications?.length === 0) {
      pushNotification("warning", "Please select applications");
    } else {
      setOpenDialogsWhatsApp(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedApplications]);

  const handleCloseDialogsWhatsApp = useCallback(() => {
    setOpenDialogsWhatsApp(false);
  }, []);
  const [selectedFormStage, setSelectedFormStage] = useState([]);
  const [selectedSourceType, setSelectedSourceType] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [selectedVerificationStatus, setSelectedVerificationStatus] =
    useState("");
  const [selectedState, setSelectedState] = useState([]);
  const [selectedSource, setSelectedSource] = useState([]);
  const [selectedUtmMedium, setSelectedUtmMedium] = useState([]);
  const [selectedLeadType, setSelectedLeadType] = useState("");
  const [selectedLeadStage, setSelectedLeadStage] = useState([]);
  const [selectedLeadStageLabel, setSelectedLeadStageLabel] = useState([]);
  const [leadStageLabelArray, setLeadStageLabelArray] = useState([]);
  const [shouldShowLeadStageLabel, setShouldShowLeadStageLabel] =
    useState(false);

  const [selectedCounselor, setSelectedCounselor] = useState([]);
  const [shouldShowAddColumn, setShouldShowAddColumn] = useState(false);
  const [showFilterOption, setShowFilterOption] = useState(false);
  const [selectedApplicationStage, setSelectedApplicationStage] = useState("");
  const [totalApplicationCount, setTotalApplicationCount] = useState(0);
  const [multiCascaderDefaultValue, setMultiCascaderDefaultValue] = useState(
    []
  );
  const [studentId, setStudentId] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [showGenerateRequest, setShowGenerateRequest] = useState(false);

  const [allExtraFiltersList, setAllExtraFiltersList] = useState([]);
  const [selectedExtraFilters, setSelectedExtraFilters] = useState([]);
  //internal server error states
  const [hideExtraFilterList, setHideExtraFilterList] = useState(false);
  const [hideUTMMedium, setHideUTMMedium] = useState(false);
  const [hideSourceList, setHideSourceList] = useState(false);
  const [hideCounsellorList, setHideCounsellorList] = useState(false);
  const [hideStateList, setHideStateList] = useState(false);
  const [hideCourseList, setHideCourseList] = useState(false);
  const [
    allApplicationInternalServerError,
    setAllApplicationInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInApplicationDownload,
    setSomethingWentWrongInApplicationDownload,
  ] = useState(false);
  const [
    somethingWentWrongInAllApplication,
    setSomethingWentWrongInAllApplication,
  ] = useState(false);
  const [hideApplicationsTable, setHideApplicationsTable] = useState(false);
  const [columnsOrder, setColumnsOrder] = useState(false);

  const additionalColumnStates = useMemo(() => {
    return {
      regState,
      setRegState,
      city,
      setCity,
    };
  }, [regState, setRegState, city, setCity]);

  const [utmMedium, setUtmMedium] = useState([]);
  const fetchUtmMediumData = useFetchUTMMedium();

  const handleFilterOption = useCallback((value) => {
    handleDataFilterOption(value, "filterOptions");
  }, []);

  useEffect(() => {
    setShouldShowLeadStageLabel(
      selectedLeadStage.some((label) => leadStageObject[label]?.length > 0)
    );
    // eslint-disable-next-line no-use-before-define
  }, [selectedLeadStage, leadStageObject]);

  // getting the UTM Medium list
  useEffect(() => {
    if (callFilterOptionApi.callUtmMedium !== undefined) {
      fetchUtmMediumData(
        selectedSource,
        setHideUTMMedium,
        setLoadingFilterOptions,
        setSomethingWentWrongInAllApplication,
        setAllApplicationInternalServerError,
        setUtmMedium
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callFilterOptionApi.callUtmMedium]);

  useEffect(() => {
    if (callFilterSaveApi) {
      setSavedFilterLoading(true);
      const params = {
        apiURL: `${import.meta.env.VITE_API_BASE_URL}/admin/filter/${
          currentUserCollegeId ? "?college_id=" + currentUserCollegeId : ""
        }`,
        setListOfFilters,
        setFilterSaveSomethingWentWrong,
        setFilterSaveInternalServerError,
        setSavedFilterLoading,
      };
      // saved filter api is getting called in this common function
      getSavedFiltersList(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callFilterSaveApi]);

  useEffect(() => {
    if (state?.counselorId) {
      handleFilterOption({ counselor: { counselor_id: [state?.counselorId] } });
      setCounselorIdFromNavigation(state?.counselorId);
      setAllApplicationPayload((prev) => ({
        ...prev,
        counselor: { ...prev.counselor, counselor_id: [state?.counselorId] },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // getting all the extra filter list
  const extraFilterListInfo = useGetAllExtraFiltersListQuery(
    { collegeId: currentUserCollegeId },
    { skip: !showFilterOption }
  );

  useEffect(() => {
    handleExtraFilterListApiCall(
      extraFilterListInfo,
      setHideExtraFilterList,
      setAllExtraFiltersList
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFilterOption, extraFilterListInfo]);

  const sourceListInfo = useGetAllSourceListQuery(
    { collegeId: currentUserCollegeId },
    {
      skip: callFilterOptionApi.skipSourceApiCall,
    }
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
  }, [callFilterOptionApi.skipSourceApiCall, sourceListInfo]);

  // get course list
  const courseListInfo = useGetAllCourseListQuery(
    { collegeId: currentUserCollegeId },
    {
      skip: callFilterOptionApi.skipCourseApiCall,
    }
  );

  useEffect(() => {
    if (!callFilterOptionApi.skipCourseApiCall) {
      const courseList = courseListInfo?.data?.data[0];
      handleFilterListApiCall(
        courseList,
        courseListInfo,
        setListOfCourses,
        setHideCourseList,
        organizeCourseFilterOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseListInfo, callFilterOptionApi.skipCourseApiCall]);

  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId: currentUserCollegeId },
    {
      skip: callFilterOptionApi.skipCounselorApiCall,
    }
  );

  //get counsellor list
  useEffect(() => {
    if (!callFilterOptionApi.skipCounselorApiCall) {
      const counselorList = counselorListApiCallInfo.data?.data[0];
      handleFilterListApiCall(
        counselorList,
        counselorListApiCallInfo,
        setCounsellorList,
        setHideCounsellorList,
        organizeCounselorFilterOption,
        setCollegeId
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callFilterOptionApi.skipCounselorApiCall, counselorListApiCallInfo]);

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
  }, [callFilterOptionApi.skipStateApiCall, stateListInfo]);

  const initialColumns = useMemo(() => applicationInitialColumns, []);

  const [items, setItems] = useState(() => {
    if (
      JSON.parse(
        localStorage.getItem(`${Cookies.get("userId")}arrangedCollumns`)
      ) === null
    ) {
      localStorage.setItem(
        `${Cookies.get("userId")}arrangedCollumns`,
        JSON.stringify(initialColumns)
      );
      return initialColumns;
    }
    return JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}arrangedCollumns`)
    );
  });

  const tableColumns = JSON.parse(
    localStorage.getItem(`${Cookies.get("userId")}arrangedCollumns`)
  );
  useEffect(() => {
    if (items) {
      const slicedItem = items.slice(0, 5);
      const itemsContent = slicedItem.map(({ content }) => content);
      const initialColumnsContent = initialColumns.map(
        ({ content }) => content
      );
      if (
        JSON.stringify(itemsContent) !== JSON.stringify(initialColumnsContent)
      ) {
        setColumnsOrder(true);
      } else {
        setColumnsOrder(false);
      }
      if (addedColumnsOrder?.length > 0) {
        const slicedItem = tableColumns.slice(5);
        let itemsContent = slicedItem.map(({ content }) => content);
        if (
          JSON.stringify(itemsContent) !== JSON.stringify(addedColumnsOrder)
        ) {
          setColumnsOrder(true);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, addedColumnsOrder, tableColumns]);

  const handleCustomizeTableColumn = useCallback(() => {
    const filterOptions = JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}filterOptions`)
    );
    const values = filterOptions?.addColumn;
    const arrangedCollumns = JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}arrangedCollumns`)
    );
    const addedColumnsOrder = JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}addedCollumnsOrder`)
    );

    // For loop to to add added columns
    for (let index = 0; index < values?.length; index++) {
      let findObj = arrangedCollumns?.find((obj) => obj.id === values[index]);
      if (findObj === undefined) {
        const newColumn = { content: values[index], id: values[index] };
        arrangedCollumns?.push(newColumn);
        localStorage.setItem(
          `${Cookies.get("userId")}arrangedCollumns`,
          JSON.stringify(arrangedCollumns)
        );
        setItems(
          JSON.parse(
            localStorage.getItem(`${Cookies.get("userId")}arrangedCollumns`)
          )
        );
      }
      //  storing added columns order
      const valueExist = addedColumnsOrder?.includes(values[index]);
      if (valueExist === false) {
        addedColumnsOrder.push(values[index]);
        localStorage.setItem(
          `${Cookies.get("userId")}addedCollumnsOrder`,
          JSON.stringify(addedColumnsOrder)
        );
        setaddedColumnsOrder(
          JSON.parse(
            localStorage.getItem(`${Cookies.get("userId")}addedCollumnsOrder`)
          )
        );
      }
    }
    // Removing columns that doesn't exist in added columns list
    if (arrangedCollumns?.length > initialColumns?.length) {
      const finalColumns = [];
      for (let column of arrangedCollumns) {
        if (values.includes(column.content) || values.includes(column.id)) {
          if (column.content === column.id) {
            finalColumns.push(column);
          }
        } else if (column.content !== column.id) {
          finalColumns.push(column);
        }
      }
      localStorage.setItem(
        `${Cookies.get("userId")}arrangedCollumns`,
        JSON.stringify(finalColumns)
      );
      setItems(
        JSON.parse(
          localStorage.getItem(`${Cookies.get("userId")}arrangedCollumns`)
        )
      );
      //  filter added columns order
      const filtered = addedColumnsOrder.filter((column) =>
        values.includes(column)
      );
      localStorage.setItem(
        `${Cookies.get("userId")}addedCollumnsOrder`,
        JSON.stringify(filtered)
      );
      setaddedColumnsOrder(
        JSON.parse(
          localStorage.getItem(`${Cookies.get("userId")}addedCollumnsOrder`)
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCustomizeColumn = (values, existInLocalStorage) => {
    if (values.length) {
      if (values.includes("State")) {
        setCheckedState(true);
        existInLocalStorage &&
          setAllApplicationPayload((prev) => ({
            ...prev,
            state: { ...prev.state, state_b: true },
          }));
      } else {
        setCheckedState(false);
      }
      if (values.includes("City")) {
        setCheckedCity(true);
        existInLocalStorage &&
          setAllApplicationPayload((prev) => ({
            ...prev,
            city: { ...prev.city, city_b: true },
          }));
      } else {
        setCheckedCity(false);
      }
      if (values.includes("Source")) {
        setCheckedSource(true);
        existInLocalStorage &&
          setAllApplicationPayload((prev) => ({
            ...prev,
            source: { ...prev.source, source_b: true },
          }));
      } else {
        setCheckedSource(false);
      }
      if (values.includes("Lead Type")) {
        setCheckedLeadType(true);
        existInLocalStorage &&
          setAllApplicationPayload((prev) => ({
            ...prev,
            lead_type: { ...prev.lead_type, lead_type_b: true },
          }));
      } else {
        setCheckedLeadType(false);
      }
      if (values.includes("Lead Stage")) {
        setCheckedLeadStage(true);
        existInLocalStorage &&
          setAllApplicationPayload((prev) => ({
            ...prev,
            lead_stage: { ...prev.lead_stage, lead_b: true },
          }));
      } else {
        setCheckedLeadStage(false);
      }
      if (values.includes("Counselor Name")) {
        setCheckedCounselorName(true);
        existInLocalStorage &&
          setAllApplicationPayload((prev) => ({
            ...prev,
            counselor: { ...prev.counselor, counselor_b: true },
          }));
      } else {
        setCheckedCounselorName(false);
      }
      if (values.includes("Application Stage")) {
        setCheckedApplicationStage(true);
        existInLocalStorage &&
          setAllApplicationPayload((prev) => ({
            ...prev,
            application_stage: {
              ...prev.application_stage,
              application_stage_b: true,
            },
          }));
      } else {
        setCheckedApplicationStage(false);
      }
      if (values.includes("Registration Date")) {
        setCheckedApplicationDate(true);
        existInLocalStorage &&
          setAllApplicationPayload((prev) => ({ ...prev, date: true }));
      } else {
        setCheckedApplicationDate(false);
      }
      if (values.includes("UTM Campaign")) {
        setCheckUTMCampaign(true);
        existInLocalStorage &&
          setAllApplicationPayload((prev) => ({
            ...prev,
            utm_campaign_b: true,
          }));
      } else {
        setCheckUTMCampaign(false);
      }
      if (values.includes("UTM Medium")) {
        setCheckUTMMedium(true);
        existInLocalStorage &&
          setAllApplicationPayload((prev) => ({ ...prev, utm_medium_b: true }));
      } else {
        setCheckUTMMedium(false);
      }
      if (values.includes("Outbound Calls Count")) {
        setCheckOutboundCallsCount(true);
        existInLocalStorage &&
          setAllApplicationPayload((prev) => ({ ...prev, outbound_b: true }));
      } else {
        setCheckOutboundCallsCount(false);
      }
      if (values.includes("Source Type")) {
        setCheckedSourceType(true);
        existInLocalStorage &&
          setAllApplicationPayload((prev) => ({
            ...prev,
            source_type_b: true,
          }));
      } else {
        setCheckedSourceType(false);
      }
      if (values.includes("Verification Status")) {
        setCheckedVerificationStatus(true);
        existInLocalStorage &&
          setAllApplicationPayload((prev) => ({
            ...prev,
            is_verify_b: true,
          }));
      } else {
        setCheckedVerificationStatus(false);
      }
      if (values.includes("Lead Sub Stage")) {
        steCheckedLeadSubStage(true);
        existInLocalStorage &&
          setAllApplicationPayload((prev) => ({
            ...prev,
            lead_stage: { ...prev.lead_stage, lead_sub_b: true },
          }));
      } else {
        steCheckedLeadSubStage(false);
      }
    } else {
      setCheckedState(false);
      setCheckedCity(false);
      setCheckedSource(false);
      setCheckedApplicationStage(false);
      setCheckedCounselorName(false);
      setCheckedLeadStage(false);
      setCheckedLeadType(false);
      setCheckedApplicationDate(false);
      setCheckUTMCampaign(false);
      setCheckUTMMedium(false);
      setCheckedSourceType(false);
      setCheckedVerificationStatus(false);
      steCheckedLeadSubStage(false);
    }
  };
  const settingCourse = (courseDetails) => {
    const course = [];
    courseDetails?.course_id.forEach((id, index) => {
      course.push({
        course_id: id,
        course_specialization: courseDetails?.course_specialization[index],
      });
    });
    setSelectedCourse(course);
    setAllApplicationPayload((prev) => ({
      ...prev,
      course: {
        course_id: courseDetails?.course_id,
        course_specialization: courseDetails?.course_specialization,
      },
    }));
  };
  const settingFilterOptions = useCallback((filterOptions, from) => {
    if (filterOptions) {
      if (filterOptions.extra_filters) {
        setSelectedExtraFilters(filterOptions.extra_filters);
      }
      if (filterOptions?.utm_medium) {
        filterOptions?.utm_medium?.length &&
          setCallFilterOptionApi((prev) => ({ ...prev, callUtmMedium: true }));
        setSelectedUtmMedium(filterOptions?.utm_medium);
        setAllApplicationPayload((prev) => ({
          ...prev,
          utm_medium: filterOptions?.utm_medium,
        }));
      }
      if (filterOptions.state) {
        filterOptions.state.state_code?.length &&
          setCallFilterOptionApi((prev) => ({
            ...prev,
            skipStateApiCall: false,
          }));
        setSelectedState(filterOptions.state.state_code);
        setAllApplicationPayload((prev) => ({
          ...prev,
          state: {
            ...prev.state,
            state_code: filterOptions.state.state_code,
          },
        }));
      }
      if (filterOptions.source) {
        setSelectedSource(filterOptions.source.source_name);
        filterOptions.source.source_name.length &&
          setCallFilterOptionApi((prev) => ({
            ...prev,
            skipSourceApiCall: false,
          }));
        setAllApplicationPayload((prev) => ({
          ...prev,
          source: {
            ...prev.source,
            source_name: filterOptions.source.source_name,
          },
        }));
      }
      if (filterOptions.lead_type) {
        setSelectedLeadType(filterOptions.lead_type.lead_type_name);
        setAllApplicationPayload((prev) => ({
          ...prev,
          lead_type: {
            ...prev.lead_type,
            lead_type_name: filterOptions.lead_type.lead_type_name,
          },
        }));
      }
      if (filterOptions.lead_stage) {
        if (filterOptions?.lead_stage?.lead_name[0]?.name?.length) {
          setSkipCallNameAndLabelApi(false);
          setSelectedLeadStage(filterOptions?.lead_stage?.lead_name[0]?.name);
          setSelectedLeadStageLabel(
            filterOptions?.lead_stage?.lead_name[0]?.label
              ? filterOptions?.lead_stage?.lead_name[0]?.label
              : []
          );
          setAllApplicationPayload((prev) => ({
            ...prev,
            lead_stage: {
              ...prev.lead_stage,
              lead_name: filterOptions?.lead_stage?.lead_name,
            },
          }));
        }
      }

      if (filterOptions.counselor?.counselor_id) {
        filterOptions.counselor?.counselor_id?.length &&
          setCallFilterOptionApi((prev) => ({
            ...prev,
            skipCounselorApiCall: false,
          }));
        setSelectedCounselor(filterOptions.counselor.counselor_id);
        setAllApplicationPayload((prev) => ({
          ...prev,
          counselor: {
            ...prev.counselor,
            counselor_id: filterOptions.counselor?.counselor_id,
          },
        }));
      } else {
        setSelectedCounselor([]);
      }
      if (filterOptions.application_stage) {
        setSelectedApplicationStage(
          filterOptions.application_stage?.application_stage_name
        );
        setAllApplicationPayload((prev) => ({
          ...prev,
          application_stage: {
            ...prev.application_stage,
            application_stage_name:
              filterOptions.application_stage?.application_stage_name,
          },
        }));
      }
      if (filterOptions.application_filling_stage) {
        setSelectedFormStage(filterOptions.application_filling_stage);
        setAllApplicationPayload((prev) => ({
          ...prev,
          application_filling_stage: filterOptions.application_filling_stage,
        }));
      }
      if (filterOptions.date_range) {
        if (filterOptions.date_range.start_date) {
          setAllApplicationDateRange([
            new Date(filterOptions.date_range.start_date),
            new Date(filterOptions.date_range.end_date),
          ]);
          setAllApplicationPayload((prev) => ({
            ...prev,
            date_range: JSON.parse(
              GetJsonDate([
                new Date(filterOptions.date_range.start_date),
                new Date(filterOptions.date_range.end_date),
              ])
            ),
          }));
        }
      } else {
        setAllApplicationDateRange([]);
        handleFilterOption({ date_range: { start_date: "", end_date: "" } });
      }
      if (filterOptions) {
        setPaymentStatus(filterOptions?.payment_status);
        setAllApplicationPayload((prev) => ({
          ...prev,
          payment_status: filterOptions?.payment_status,
          is_verify: filterOptions?.is_verify,
        }));

        setSelectedVerificationStatus(filterOptions?.is_verify);
      }
      if (filterOptions?.source_type) {
        setSelectedSourceType(filterOptions?.source_type);
        setAllApplicationPayload((prev) => ({
          ...prev,
          source_type: filterOptions?.source_type,
        }));
      }
      if (filterOptions.course) {
        if (Array.isArray(filterOptions.course)) {
          filterOptions.course?.length &&
            setCallFilterOptionApi((prev) => ({
              ...prev,
              skipCourseApiCall: false,
            }));
          setSelectedCourse(filterOptions.course);
          setAllApplicationPayload((prev) => ({
            ...prev,
            course: {
              course_id: filterOptions.course?.map(
                (course) => course?.course_id
              ),
              course_specialization: filterOptions.course?.map(
                (course) => course?.course_specialization || ""
              ),
            },
          }));
        } else if (filterOptions.course?.course_id) {
          filterOptions.course?.course_id?.length &&
            setCallFilterOptionApi((prev) => ({
              ...prev,
              skipCourseApiCall: false,
            }));
          settingCourse(filterOptions.course);
        }
      }
      if (filterOptions?.addColumn?.length) {
        setMultiCascaderDefaultValue(filterOptions?.addColumn);
        handleCustomizeColumn(filterOptions?.addColumn, "fromLocalStorage");
        setShouldShowAddColumn(true);
      }

      if (
        filterOptions.state?.state_code?.length ||
        filterOptions.source?.source_name?.length ||
        filterOptions.lead_type?.lead_type_name ||
        filterOptions.lead_stage?.lead_name[0]?.name?.length ||
        filterOptions.lead_stage_label?.lead_stage_label_name ||
        filterOptions.application_stage?.application_stage_name ||
        filterOptions?.date_range?.start_date ||
        filterOptions.counselor?.counselor_id?.length ||
        filterOptions.is_verify ||
        filterOptions.payment_status ||
        filterOptions.course?.course_id?.length ||
        filterOptions.course?.length ||
        filterOptions?.source_type?.length ||
        filterOptions?.application_filling_stage?.length
      ) {
        setTimeout(() => {
          setShowFilterOption(true);
        }, 5);
      }
      if (from === "filter") {
        setAllApplicationPayload(filterOptions);
        handleUpdatePageNumber();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // set filter options from localStorage of user is not coming by re-directing from admin dashboard
    if (state?.admin_dashboard) {
      settingFilterOptions(state?.filters, "local");
      if (state?.filters?.addColumn) {
        handleCustomizeColumn(state?.filters?.addColumn);
        handleFilterOption({
          addColumn: state?.filters?.addColumn,
        });
      } else {
        handleCustomizeColumn([]);
        handleFilterOption({
          addColumn: [],
        });
      }
      handleCustomizeTableColumn();
    } else {
      const filterOptions = localStorage.getItem(
        `${Cookies.get("userId")}filterOptions`
      );
      if (filterOptions) {
        settingFilterOptions(JSON.parse(filterOptions), "local");
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const payloadForAllApplication = {
    state: {
      state_b: checkedState,
      state_code: applyAdvanceFilter ? [] : selectedState,
    },
    city: {
      city_b: checkedCity,
      city_name: [],
    },
    source: {
      source_b: checkedSource,
      source_name: applyAdvanceFilter ? [] : selectedSource,
    },
    lead_stage: {
      lead_b: checkedLeadStage,
      lead_sub_b: checkedLeadSubStage,
      lead_name: applyAdvanceFilter
        ? []
        : selectedLeadStage?.length
        ? [
            {
              name: selectedLeadStage,
              label: selectedLeadStageLabel,
            },
          ]
        : [],
    },
    lead_type: {
      lead_type_b: checkedLeadType,
      lead_type_name: applyAdvanceFilter ? "" : selectedLeadType,
    },
    counselor: {
      counselor_b: checkedCounselorName,
      counselor_id: collegeCounsellor
        ? [counsellorList[0]?.value]
        : applyAdvanceFilter
        ? []
        : selectedCounselor?.length > 0
        ? selectedCounselor
        : [],
    },
    application_stage: {
      application_stage_b: checkedApplicationStage,
      application_stage_name: applyAdvanceFilter
        ? ""
        : selectedApplicationStage,
    },
    course: {},
    payment_status: applyAdvanceFilter ? [] : paymentStatus,
    is_verify: applyAdvanceFilter ? "" : selectedVerificationStatus,
    date: checkedApplicationDate,
    utm_medium: applyAdvanceFilter ? [] : selectedUtmMedium,
    utm_medium_b: checkUTMMedium,
    utm_campaign_b: checkUTMCampaign,
    extra_filters: selectedExtraFilters,
    application_filling_stage: applyAdvanceFilter ? [] : selectedFormStage,
    season: selectedSeason?.length ? JSON.parse(selectedSeason)?.season_id : "",
    outbound_b: checkOutboundCallsCount,
    source_type_b: checkedSourceType,
    is_verify_b: checkedVerificationStatus,
  };

  if (selectedSourceType.length) {
    payloadForAllApplication.source_type = selectedSourceType;
  }
  if (selectedCourse.length) {
    payloadForAllApplication.course.course_id = selectedCourse?.length
      ? selectedCourse.map((course) => course?.course_id)
      : [];
    payloadForAllApplication.course.course_specialization =
      selectedCourse?.length
        ? selectedCourse.map((course) =>
            course?.course_specialization ? course?.course_specialization : null
          )
        : [];
  }

  const payloadForEmail = {
    state_code: applyAdvanceFilter ? [] : selectedState,
    college_id: collegeId,
    city_name: [],
    source_name: applyAdvanceFilter ? [] : selectedSource,
    lead_name: applyAdvanceFilter
      ? []
      : selectedLeadStage?.length
      ? [{ name: selectedLeadStage, label: selectedLeadStageLabel }]
      : [],
    lead_type_name: applyAdvanceFilter ? "" : selectedLeadType,
    counselor_id: collegeCounsellor
      ? [counsellorList[0]?.value]
      : applyAdvanceFilter
      ? []
      : selectedCounselor?.length > 0
      ? selectedCounselor
      : [],
    application_stage_name: applyAdvanceFilter ? "" : selectedApplicationStage,
    is_verify: applyAdvanceFilter
      ? ""
      : selectedVerificationStatus
      ? selectedVerificationStatus
      : "",
    utm_medium: applyAdvanceFilter ? [] : selectedUtmMedium,
    source_type: applyAdvanceFilter ? [] : selectedSourceType,
    payment_status: applyAdvanceFilter ? [] : paymentStatus,
    course: {
      course_id: [],
      course_specialization: [],
    },
    twelve_marks: {
      twelve_marks_b: false,
      twelve_marks_name: [],
    },
    twelve_board: {
      twelve_board_b: false,
      twelve_board_name: [],
    },
    form_filling_stage: {
      form_filling_stage_b: false,
      form_filling_stage_name: [],
    },
    extra_filters: selectedExtraFilters,
    application_filling_stage: applyAdvanceFilter ? [] : selectedFormStage,
  };

  if (applyAdvanceFilter) {
    payloadForEmail.advance_filters = advanceFilterBlocks;
  }

  if (selectedCourse.length) {
    payloadForEmail.course.course_id = applyAdvanceFilter
      ? []
      : selectedCourse?.length
      ? selectedCourse.map((course) => course?.course_id)
      : [];
    payloadForEmail.course.course_specialization = applyAdvanceFilter
      ? []
      : selectedCourse?.length
      ? selectedCourse.map((course) =>
          course?.course_specialization ? course?.course_specialization : null
        )
      : [];
  }

  if (allApplicationDateRange?.length) {
    payloadForAllApplication.date_range = JSON.parse(
      GetJsonDate(allApplicationDateRange)
    );
    payloadForEmail.date_range = JSON.parse(
      GetJsonDate(allApplicationDateRange)
    );
  }

  if (counselorIdFromNavigation) {
    payloadForAllApplication.counselor.counselor_id = [
      counselorIdFromNavigation,
    ];
    payloadForEmail.counselor_id = [counselorIdFromNavigation];
  }

  const [twelveScoreSort, setTwelveScoreSort] = useState(null);
  const [callGetApplicationApi, setCallGetApplicationApi] = useState(false);

  const sortingLocalStorageKeyName = `${Cookies.get(
    "userId"
  )}applicationManagerTwelveScoreSort`;

  const [sort, setSort] = useState(
    localStorage.getItem(sortingLocalStorageKeyName)
      ? localStorage.getItem(sortingLocalStorageKeyName)
      : "default"
  );

  useEffect(() => {
    if (sort === "default") {
      setTwelveScoreSort(null);
      setCallGetApplicationApi(true);
    }
    if (sort === "asc") {
      setTwelveScoreSort(true);
      setCallGetApplicationApi(true);
    }
    if (sort === "des") {
      setTwelveScoreSort(false);
      setCallGetApplicationApi(true);
    }
  }, [sort]);

  const {
    data: applicationData,
    isSuccess,
    isFetching,
    error: allApplicationError,
    isError,
  } = useGetApplicationsQuery(
    {
      pageNumber: pageNumber,
      rowsPerPage: rowsPerPage,
      payload: allApplicationPayload,
      collegeId: currentUserCollegeId,
      twelveScoreSort: twelveScoreSort,
    },
    {
      skip: callGetApplicationApi ? false : true,
    }
  );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(applicationData?.data)) {
          setTotalApplicationCount(applicationData?.total);
          setApplications(applicationData?.data);
          setRowCount(applicationData?.total);

          const applications = [...applicationData?.data];
          const applicationsWithPageNumber = applications.map((application) => {
            const updatedApplication = { ...application };
            updatedApplication.pageNo = pageNumber;
            return updatedApplication;
          });
          localStorage.setItem(
            `${Cookies.get("userId")}applications`,
            JSON.stringify(applicationsWithPageNumber)
          );
          localStorage.setItem(
            `${Cookies.get("userId")}applicationsTotalCount`,
            JSON.stringify(applicationData?.total)
          );
        } else {
          throw new Error("All application manager API response has changed");
        }
      } else if (isError) {
        setApplications([]);
        setTotalApplicationCount(0);
        if (
          allApplicationError?.data?.detail === "Could not validate credentials"
        ) {
          window.location.reload();
        } else if (allApplicationError?.data?.detail) {
          pushNotification("error", allApplicationError?.data?.detail);
        }
        if (allApplicationError?.status === 500) {
          handleInternalServerError(
            setAllApplicationInternalServerError,
            setHideApplicationsTable,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInAllApplication,
        setHideApplicationsTable,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    applicationData,
    allApplicationError,
    isError,
    isSuccess,
    shouldCallApplicationsApi,
  ]);

  const prefetchAllApplications = usePrefetch("getApplications");
  useEffect(() => {
    apiCallFrontAndBackPage(
      applicationData,
      rowsPerPage,
      pageNumber,
      currentUserCollegeId,
      prefetchAllApplications,
      { payload: allApplicationPayload },
      twelveScoreSort
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    applicationData,
    pageNumber,
    prefetchAllApplications,
    rowsPerPage,
    currentUserCollegeId,
    twelveScoreSort,
  ]);

  //application download state
  const [isLoading, setIsLoading] = useState(false);

  //selected application and emails state
  const [selectedApplicationIds, setSelectedApplicationIds] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedMobileNumbers, setSelectedMobileNumbers] = useState([]);

  const payloadOfDownloadingAllApplication = {
    application_ids: selectedApplicationIds,
  };

  const payloadForDownloadFilterData = {
    payload: {
      state_code: applyAdvanceFilter ? [] : selectedState,
      college_id: collegeId,
      city_name: [],
      source_name: applyAdvanceFilter ? [] : selectedSource,
      lead_name: applyAdvanceFilter
        ? []
        : selectedLeadStage?.length
        ? [{ name: selectedLeadStage, label: selectedLeadStageLabel }]
        : [],
      lead_type_name: applyAdvanceFilter
        ? ""
        : selectedLeadType
        ? selectedLeadType
        : "",
      counselor_id: collegeCounsellor
        ? [counsellorList[0]?.value]
        : applyAdvanceFilter
        ? []
        : selectedCounselor?.length > 0
        ? selectedCounselor
        : [],
      application_stage_name: applyAdvanceFilter
        ? ""
        : selectedApplicationStage,
      is_verify: applyAdvanceFilter
        ? ""
        : selectedVerificationStatus
        ? selectedVerificationStatus
        : "",
      date_range: allApplicationDateRange?.length
        ? JSON.parse(GetJsonDate(allApplicationDateRange))
        : {},
      course: {
        course_id: [],
        course_specialization: [],
      },
      payment_status: applyAdvanceFilter ? [] : paymentStatus,
      utm_medium: applyAdvanceFilter ? [] : selectedUtmMedium,
      source_type: applyAdvanceFilter ? [] : selectedSourceType,
      extra_filters: selectedExtraFilters,
      application_filling_stage: applyAdvanceFilter ? [] : selectedFormStage,
    },
  };

  if (applyAdvanceFilter) {
    payloadForDownloadFilterData.payload.advance_filters = advanceFilterBlocks;
  }

  if (selectedCourse.length) {
    payloadForDownloadFilterData.payload.course.course_id = applyAdvanceFilter
      ? []
      : selectedCourse?.length
      ? selectedCourse.map((course) => course?.course_id)
      : [];
    payloadForDownloadFilterData.payload.course.course_specialization =
      applyAdvanceFilter
        ? []
        : selectedCourse?.length
        ? selectedCourse.map((course) =>
            course?.course_specialization ? course?.course_specialization : null
          )
        : [];
  }

  if (multiCascaderDefaultValue.length) {
    payloadOfDownloadingAllApplication.column_names =
      multiCascaderDefaultValue.map((value) => value.toLowerCase());
    payloadForDownloadFilterData.column_names = multiCascaderDefaultValue.map(
      (value) => value.toLowerCase()
    );
  }

  //download all applications function
  const handleAllApplicationsDownload = useCallback(
    (downloadButtonName, application) => {
      setIsLoading(true);
      if (
        (downloadButtonName === "download all" ||
          downloadButtonName === "custom download") &&
        application > 200
      ) {
        if (permissions?.menus?.report_and_analytics.reports) {
          setIsLoading(false);
          pushNotification(
            "warning",
            "Selected data is more than 200 kindly select data less than 200 and request again or generate a report from the reports section"
          );
          setShowGenerateRequest(true);
          setTimeout(() => {
            setShowGenerateRequest(false);
          }, 60000);
        } else {
          setIsLoading(false);
          pushNotification(
            "warning",
            "Selected data is more than 200 kindly select data less than 200 and request again "
          );
        }
      } else if (application === 0) {
        setIsLoading(false);
        pushNotification("warning", "No application found");
      } else if (
        downloadButtonName === "custom download" &&
        application === 0
      ) {
        setIsLoading(false);
        pushNotification("warning", "Please select applications");
      } else {
        customFetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/admin/download_applications_data/${
            currentUserCollegeId ? "?college_id=" + currentUserCollegeId : ""
          }`,
          ApiCallHeaderAndBody(
            token,
            "POST",
            JSON.stringify(
              downloadButtonName === "custom download"
                ? payloadOfDownloadingAllApplication
                : payloadForDownloadFilterData
            )
          )
        )
          .then((res) =>
            res.json().then((result) => {
              if (result?.detail === "Could not validate credentials") {
                window.location.reload();
              } else if (result?.message) {
                const expectedData = result?.file_url;
                try {
                  if (typeof expectedData === "string") {
                    window.open(result?.file_url);
                    setSelectedApplications([]);
                    localStorage.removeItem(
                      `${Cookies.get("userId")}adminSelectedApplications`
                    );
                  } else {
                    throw new Error(
                      "download_applications_data API response has changed"
                    );
                  }
                } catch (error) {
                  setApiResponseChangeMessage(error);
                  handleSomethingWentWrong(
                    setSomethingWentWrongInApplicationDownload,
                    "",
                    5000
                  );
                }
              } else if (result?.detail) {
                pushNotification("error", result?.detail);
              }
            })
          )
          .catch((err) => {
            handleInternalServerError(
              setAllApplicationInternalServerError,
              "",
              5000
            );
          })
          .finally(() => setIsLoading(false));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [payloadOfDownloadingAllApplication, payloadForDownloadFilterData]
  );

  const payloadForReportGeneration = {
    request_data: {
      report_name: reportName,
      report_details: reportDescription,
      report_type: "Applications",
      format: "CSV",
      report_send_to: userEmail,
    },
    payload: {
      state_code: applyAdvanceFilter ? [] : selectedState,
      city_name: [],
      source_name: applyAdvanceFilter ? [] : selectedSource,
      lead_name: applyAdvanceFilter
        ? []
        : selectedLeadStage?.length
        ? [{ name: selectedLeadStage, label: selectedLeadStageLabel }]
        : [],
      lead_type_name: applyAdvanceFilter ? "" : selectedLeadType,
      counselor_id: collegeCounsellor
        ? [counsellorList[0]?.value]
        : applyAdvanceFilter
        ? []
        : selectedCounselor?.length > 0
        ? selectedCounselor
        : [],
      application_stage_name: applyAdvanceFilter
        ? ""
        : selectedApplicationStage,
      is_verify: applyAdvanceFilter ? "" : selectedVerificationStatus,
      payment_status: applyAdvanceFilter ? [] : paymentStatus,
      extra_filters: selectedExtraFilters,
      application_filling_stage: applyAdvanceFilter ? [] : selectedFormStage,
    },
  };

  if (applyAdvanceFilter) {
    payloadForReportGeneration.request_data.advance_filter =
      advanceFilterBlocks;
  }

  const [generateReport] = useGenerateReportMutation();

  const handleGenerateReportRequest = () => {
    handleReportGenerate(
      generateReport,
      currentUserCollegeId,
      token,
      payloadForReportGeneration,
      pushNotification,
      setApiResponseChangeMessage,
      setSomethingWentWrongInApplicationDownload,
      setAllApplicationInternalServerError,
      setShowGenerateRequest
    );
  };

  //set customise columns in localstorage
  useEffect(() => {
    localStorage.setItem(
      `${Cookies.get("userId")}customizeColumns`,
      JSON.stringify({ city: city, state: regState })
    );
  }, [regState, city]);

  const handleSearchByEmail = () => {
    if (!searchedEmail.length) {
      pushNotification("warning", "Please give input.");
      return;
    }
    setLoading(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/admin/all_applications_by_email/?search_input=${searchedEmail}&basic_details=true${
        currentUserCollegeId ? "&college_id=" + currentUserCollegeId : ""
      }`,
      ApiCallHeaderAndBody(token, "POST")
    ).then((res) =>
      res
        .json()
        .then((result) => {
          if (result?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (result?.data) {
            try {
              if (Array.isArray(result?.data)) {
                setApplications(result?.data);
                setTotalApplicationCount(result?.data?.length);
                setRowCount(result?.data?.length);
                const applications = result?.data;
                applications.forEach((application) => {
                  application.pageNo = 1;
                });
                localStorage.setItem(
                  `${Cookies.get("userId")}applications`,
                  JSON.stringify(applications)
                );
              } else {
                throw new Error(
                  "all_applications_by_email API response has changed"
                );
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInAllApplication,
                "",
                5000
              );
            }
          } else if (result?.detail) {
            setApplications([]);
            setTotalApplicationCount(0);
          }
        })
        .catch(() => {
          handleInternalServerError(
            setAllApplicationInternalServerError,
            "",
            5000
          );
        })
        .finally(() => setLoading(false))
    );
  };

  const handleResetSearchByEmail = () => {
    setSearchedEmail("");
    setAllApplicationPayload(() => {
      return {
        ...blankPayloadOfAllApplication,
        season: selectedSeason?.length
          ? JSON.parse(selectedSeason)?.season_id
          : "",
      };
    });
    setShouldCallApplicationsApi((prev) => !prev);
  };

  //dialogs to change multiple lead stage
  const [openDialogsLead, setOpenDialogsLead] = useState(false);
  const handleClickOpenDialogsLead = useCallback(() => {
    if (selectedApplications?.length === 0) {
      setIsLoading(false);
      pushNotification("warning", "Please select applications");
    } else {
      setOpenDialogsLead(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedApplications]);

  const handleCloseDialogsLead = useCallback(() => {
    setOpenDialogsLead(false);
  }, []);

  //dialogs to assign multiple lead to counellor
  const [openDialogsAssignCounsellor, setOpenDialogsAssignCounsellor] =
    useState(false);
  const handleClickOpenDialogsAssignCounsellor = useCallback(() => {
    if (selectedApplications?.length === 0) {
      setIsLoading(false);
      pushNotification("warning", "Please select applications");
    } else {
      setOpenDialogsAssignCounsellor(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedApplications]);

  const handleCloseDialogsAssignCounsellor = () => {
    setOpenDialogsAssignCounsellor(false);
  };

  //according to user scope set the value
  useEffect(() => {
    if (tokenState?.scopes?.[0] === "college_head_counselor") {
      setCollegeHeadCounsellor(true);
    } else if (tokenState?.scopes?.[0] === "college_counselor") {
      setCollegeCounsellor(true);
      setCallFilterOptionApi((prev) => ({
        ...prev,
        skipCounselorApiCall: false,
      }));
    } else if (tokenState?.scopes?.[0] === "college_super_admin") {
      setCollegeSuperAdmin(true);
    } else if (tokenState?.scopes?.[0] === "college_admin") {
      setCollegeAdmin(true);
    }
  }, [tokenState?.scopes]);

  const customizeColumnOptions = useMemo(() => {
    return {
      checkedCity,
      checkedApplicationStage,
      checkedState,
      checkedSource,
      checkedLeadStage,
      checkedLeadType,
      checkedCounselorName,
      checkedApplicationDate,
    };
  }, [
    checkedCity,
    checkedApplicationStage,
    checkedState,
    checkedSource,
    checkedLeadStage,
    checkedLeadType,
    checkedCounselorName,
    checkedApplicationDate,
  ]);

  const handleUpdatePageNumber = () => {
    setPageNumber(1);
    localStorage.setItem(
      `${Cookies.get("userId")}adminApplicationSavePageNo`,
      1
    );
  };

  const resetAllTheSelectedFilters = () => {
    localStorage.removeItem(`${Cookies.get("userId")}filterOptions`);
    window.history.replaceState({}, document.title);
    setCounselorIdFromNavigation(null);
    setMultiCascaderDefaultValue([]);
    handleCustomizeColumn([]);
    setSelectedState([]);
    setSelectedSource([]);
    setPaymentStatus([]);
    setSelectedCourse([]);
    setSelectedApplicationStage("");
    setSelectedCounselor([]);
    setSelectedLeadStage([]);
    setSelectedLeadStageLabel([]);
    setSelectedLeadType("");
    setSelectedSourceType([]);
    setSelectedVerificationStatus("");
    setSelectedUtmMedium([]);
    setSelectedExtraFilters([]);
    setSelectedFormStage([]);
    setAllApplicationDateRange([]);
  };

  const handleEmailInputField = (value) => {
    resetAllTheSelectedFilters();

    setFilterPayload("");
    setSearchedEmail(value);
  };

  const [openColumnsReorder, setOpenColumnsReorder] = React.useState(false);
  const handleClickOpenColumnsReorder = useCallback(() => {
    setOpenColumnsReorder(true);
  }, []);

  const leadStageLabel = useLeadStageLabel();

  useEffect(() => {
    leadStageLabel(leadStageObject, selectedLeadStage, setLeadStageLabelArray);
  }, [leadStageObject, selectedLeadStage]);

  const handleApplyFilters = (applyAdvFilter) => {
    setApplyAdvanceFilter(applyAdvFilter);
    if (pageNumber !== 1) {
      handleUpdatePageNumber();
    }
    handleFilterOption({
      addColumn: multiCascaderDefaultValue,
    });
    handleCustomizeTableColumn();

    if (applyAdvFilter) {
      const updatedPayload = {
        ...payloadForAllApplication,
        state: {
          ...payloadForAllApplication.state,
          state_code: [],
        },

        source: {
          ...payloadForAllApplication.source,
          source_name: [],
        },
        lead_stage: {
          ...payloadForAllApplication.lead_stage,
          lead_name: [],
        },
        lead_type: {
          ...payloadForAllApplication.lead_type,
          lead_type_name: "",
        },
        counselor: {
          ...payloadForAllApplication.counselor,
          counselor_id: collegeCounsellor ? [counsellorList[0]?.value] : [],
        },
        application_stage: {
          ...payloadForAllApplication.application_stage,
          application_stage_name: "",
        },
        course: {},
        payment_status: [],
        is_verify: "",
        utm_medium: [],
        extra_filters: [],
        application_filling_stage: [],
        source_type: [],
        advance_filters: advanceFilterBlocks,
      };

      setAllApplicationPayload(updatedPayload);
    } else {
      setAllApplicationPayload(payloadForAllApplication);
    }
  };

  const filterAndColumnOption = () => {
    return (
      <>
        {showFilterOption && (
          <>
            {!collegeCounsellor && (
              <>
                {hideCounsellorList || (
                  <MultipleFilterSelectPicker
                    searchedEmail={searchedEmail}
                    onChange={(value) => {
                      window.history.replaceState({}, document.title);
                      setCounselorIdFromNavigation(null);
                      handleFilterOption({
                        counselor: { counselor_id: value },
                      });
                      setSelectedCounselor(value);
                      setFilterPayload("");
                    }}
                    setSelectedPicker={setSelectedCounselor}
                    pickerData={counsellorList}
                    placeholder="Counselor"
                    pickerValue={selectedCounselor}
                    className="select-picker"
                    handleFilterOption={(checkAll, allValue) =>
                      handleFilterOption({
                        counselor: { counselor_id: checkAll ? allValue : [] },
                      })
                    }
                    loading={counselorListApiCallInfo.isFetching}
                    onOpen={() =>
                      setCallFilterOptionApi((prev) => ({
                        ...prev,
                        skipCounselorApiCall: false,
                      }))
                    }
                    from="applicationManager"
                  />
                )}
              </>
            )}

            <FilterSelectPicker
              searchedEmail={searchedEmail}
              handleFilterOption={handleFilterOption}
              filterOptionParams={[
                "application_stage",
                "application_stage_name",
                { application_stage: {} },
              ]}
              setSelectedPicker={setSelectedApplicationStage}
              pickerData={applicationStage}
              placeholder="Application stage"
              pickerValue={selectedApplicationStage}
              setSelectedFilter={setFilterPayload}
              from="applicationManager"
            />

            <SelectPicker
              disabled={searchedEmail.length ? true : false}
              onChange={(value) => {
                handleFilterOption({ is_verify: value });
                setSelectedVerificationStatus(value);
                setFilterPayload("");

                addFilterOptionToCookies(
                  "applicationManager",
                  "Verify status",
                  value,
                  ApplicationVerificationStatus,
                  "select"
                );
              }}
              data={ApplicationVerificationStatus}
              placeholder="Verify status"
              value={selectedVerificationStatus}
              className="select-picker"
            />

            <MultipleFilterSelectPicker
              searchedEmail={searchedEmail}
              onChange={(value) => {
                handleFilterOption({ payment_status: value });
                setPaymentStatus(value);
                setFilterPayload("");
              }}
              pickerData={paymentStatusList}
              placeholder="Payment status"
              pickerValue={paymentStatus}
              className="select-picker"
              setSelectedPicker={setPaymentStatus}
              handleFilterOption={(checkAll, allValue) =>
                handleFilterOption({ payment_status: checkAll ? allValue : [] })
              }
              from="applicationManager"
            />

            <MultipleFilterSelectPicker
              className="select-picker"
              searchedEmail={searchedEmail}
              handleFilterOption={(checkAll, allValue, otherValue) =>
                handleFilterOption({
                  lead_stage: {
                    lead_name: [
                      {
                        name: checkAll ? allValue : [],
                        label: otherValue?.length ? otherValue : [],
                      },
                    ],
                  },
                })
              }
              // filterOptionParams={["lead_stage", "lead_name", { lead_stage: {} }]}
              onChange={(value, otherValue) => {
                handleFilterOption({
                  lead_stage: {
                    lead_name: [
                      {
                        name: value,
                        label: otherValue?.length ? otherValue : [],
                      },
                    ],
                  },
                });
                setSelectedLeadStage(value);
                setFilterPayload("");
              }}
              setSelectedPicker={setSelectedLeadStage}
              pickerData={leadStageLabelList}
              placeholder="Lead stage"
              pickerValue={selectedLeadStage}
              setSelectedFilter={setFilterPayload}
              leadStageValue={selectedLeadStageLabel}
              setSelectedLeadStageLabel={setSelectedLeadStageLabel}
              onOpen={() => setSkipCallNameAndLabelApi(false)}
              loading={loadingLabelList}
              from="applicationManager"
            />

            {shouldShowLeadStageLabel && (
              <MultipleFilterSelectPicker
                className="select-picker"
                searchedEmail={searchedEmail}
                handleFilterOption={(checkAll, allValue, otherValue) =>
                  handleFilterOption({
                    lead_stage: {
                      lead_name: [
                        { name: otherValue, label: checkAll ? allValue : [] },
                      ],
                    },
                  })
                }
                // filterOptionParams={["lead_stage_label", "lead_stage_label_name", { lead_stage_label: {} }]}
                onChange={(value, otherValue) => {
                  handleFilterOption({
                    lead_stage: {
                      lead_name: [{ name: otherValue, label: value }],
                    },
                  });
                  setSelectedLeadStageLabel(value);
                  setFilterPayload("");
                }}
                setSelectedPicker={setSelectedLeadStageLabel}
                pickerData={leadStageLabelArray}
                placeholder="Lead stage label"
                pickerValue={selectedLeadStageLabel}
                setSelectedFilter={setFilterPayload}
                leadStageValue={selectedLeadStage}
                groupBy="role"
                from="applicationManager"
              />
            )}

            {hideSourceList || (
              <MultipleFilterSelectPicker
                className="select-picker"
                searchedEmail={searchedEmail}
                handleFilterOption={(checkAll, allValue) =>
                  handleFilterOption({
                    source: { source_name: checkAll ? allValue : [] },
                  })
                }
                onChange={(value) => {
                  handleFilterOption({ source: { source_name: value } });
                  setSelectedSource(value);
                  setFilterPayload("");
                  setUtmMedium([]);
                  setSelectedUtmMedium([]);
                }}
                setSelectedPicker={setSelectedSource}
                pickerData={sourceList}
                placeholder="Source"
                pickerValue={selectedSource}
                setSelectedFilter={setFilterPayload}
                loading={sourceListInfo.isFetching}
                onOpen={() =>
                  setCallFilterOptionApi((prev) => ({
                    ...prev,
                    skipSourceApiCall: false,
                  }))
                }
                from="applicationManager"
              />
            )}

            {selectedSource?.length > 0 && !hideUTMMedium && (
              <MultipleFilterSelectPicker
                className="select-picker"
                searchedEmail={searchedEmail}
                handleFilterOption={(checkAll, allValue) =>
                  handleFilterOption({ utm_medium: checkAll ? allValue : [] })
                }
                onChange={(value) => {
                  handleFilterOption({ utm_medium: value });
                  setSelectedUtmMedium(value);
                  setFilterPayload("");
                }}
                setSelectedPicker={setSelectedUtmMedium}
                pickerData={utmMedium}
                placeholder="UTM Medium"
                pickerValue={selectedUtmMedium}
                setSelectedFilter={setFilterPayload}
                loading={loadingFilterOptions.utmMediumData}
                groupBy="role"
                onOpen={() =>
                  setCallFilterOptionApi((prev) => ({
                    ...prev,
                    callUtmMedium: prev.callUtmMedium ? false : true,
                  }))
                }
                from="applicationManager"
              />
            )}

            {hideStateList || (
              <MultipleFilterSelectPicker
                className="select-picker"
                searchedEmail={searchedEmail}
                handleFilterOption={handleFilterOption}
                filterOptionParams={["state", "state_code", { state: {} }]}
                setSelectedPicker={setSelectedState}
                pickerData={stateList}
                placeholder="State"
                pickerValue={selectedState}
                setSelectedFilter={setFilterPayload}
                loading={stateListInfo.isFetching}
                onOpen={() =>
                  setCallFilterOptionApi((prev) => ({
                    ...prev,
                    skipStateApiCall: false,
                  }))
                }
                from="applicationManager"
              />
            )}

            <FilterSelectPicker
              searchedEmail={searchedEmail}
              handleFilterOption={handleFilterOption}
              filterOptionParams={[
                "lead_type",
                "lead_type_name",
                { lead_type: {} },
              ]}
              setSelectedPicker={setSelectedLeadType}
              pickerData={leadType}
              placeholder="Lead type"
              pickerValue={selectedLeadType}
              setSelectedFilter={setFilterPayload}
              from="applicationManager"
            />

            {hideCourseList || (
              <MultipleFilterSelectPicker
                searchedEmail={searchedEmail}
                onChange={(value) => {
                  handleFilterOption({ course: value });
                  setSelectedCourse(value);
                  setFilterPayload("");
                }}
                pickerData={listOfCourses}
                placeholder="Course"
                pickerValue={selectedCourse}
                className="select-picker"
                setSelectedPicker={setSelectedCourse}
                handleFilterOption={(checkAll, allValue) =>
                  handleFilterOption({ course: checkAll ? allValue : [] })
                }
                loading={courseListInfo.isFetching}
                onOpen={() =>
                  setCallFilterOptionApi((prev) => ({
                    ...prev,
                    skipCourseApiCall: false,
                  }))
                }
                from="applicationManager"
              />
            )}
            <MultipleFilterSelectPicker
              searchedEmail={searchedEmail}
              placeholder="Source type"
              className="select-picker"
              pickerData={listOfSourcesType}
              pickerValue={selectedSourceType}
              onChange={(value) => {
                handleFilterOption({ source_type: value });
                setSelectedSourceType(value);
                setFilterPayload("");
              }}
              handleFilterOption={(checkAll, allValue) =>
                handleFilterOption({ source_type: checkAll ? allValue : [] })
              }
              setSelectedPicker={setSelectedSourceType}
              from="applicationManager"
            />
            <MultipleFilterSelectPicker
              className="select-picker"
              searchedEmail={searchedEmail}
              placeholder="Application Filling Stage"
              pickerData={formStageList}
              pickerValue={selectedFormStage}
              onChange={(value) => {
                handleFilterOption({ application_filling_stage: value });
                setSelectedFormStage(value);
                setFilterPayload("");
              }}
              handleFilterOption={(checkAll, allValue) =>
                handleFilterOption({
                  application_filling_stage: checkAll ? allValue : [],
                })
              }
              setSelectedPicker={setSelectedFormStage}
              from="applicationManager"
            />
            {!hideExtraFilterList && (
              <ExtraFilterList
                loading={extraFilterListInfo.isFetching}
                allExtraFiltersList={allExtraFiltersList}
                searchedEmail={searchedEmail}
                setSelectedExtraFilters={setSelectedExtraFilters}
                selectedExtraFilters={selectedExtraFilters}
                handleFilterOption={handleFilterOption}
              />
            )}

            <DateRangePicker
              className="select-picker"
              placeholder="Date Range"
              placement="auto"
              disabled={searchedEmail.length ? true : false}
              value={
                allApplicationDateRange?.length ? allApplicationDateRange : null
              }
              onChange={(value) => {
                if (value?.length) {
                  handleFilterOption({
                    date_range: { start_date: value[0], end_date: value[1] },
                  });
                } else {
                  handleFilterOption({
                    date_range: { start_date: "", end_date: "" },
                  });
                }
                setAllApplicationDateRange(value);
                setFilterPayload("");
                const payload = { ...payloadForAllApplication };
                if (value?.length) {
                  payload.date_range = JSON.parse(GetJsonDate(value));
                } else {
                  delete payload.date_range;
                }
                setAllApplicationPayload(payload);
              }}
            />
          </>
        )}
        {shouldShowAddColumn && (
          <MultipleFilterSelectPicker
            appearance="subtle"
            className="border-select-picker"
            searchedEmail={searchedEmail}
            pickerData={addColumnOptionForApplications}
            pickerValue={multiCascaderDefaultValue}
            placeholder="Select Column"
            onChange={(values) => {
              handleCustomizeColumn(values);
              setMultiCascaderDefaultValue(values);
              handleFilterOption({ addColumn: values });
            }}
            handleFilterOption={(checkAll, allValue) => {
              handleCustomizeColumn(checkAll ? allValue : []);
              handleFilterOption({ addColumn: allValue });
            }}
            setSelectedPicker={setMultiCascaderDefaultValue}
          />
        )}

        <>
          {(showFilterOption || shouldShowAddColumn) && (
            <>
              {showFilterOption && (
                <>
                  <AdvanceFilterButton
                    setOpenAdvanceFilter={setOpenAdvanceFilter}
                  />
                  {openAdvanceFilter && (
                    <AdvanceFilterDrawer
                      openAdvanceFilter={openAdvanceFilter}
                      setOpenAdvanceFilter={setOpenAdvanceFilter}
                      regularFilter={advFilterLocalStorageKey}
                      advanceFilterBlocks={advanceFilterBlocks}
                      setAdvanceFilterBlocks={setAdvanceFilterBlocks}
                      handleApplyFilters={handleApplyFilters}
                    />
                  )}
                </>
              )}
              {((!shouldShowAddColumn && !filterPayload) ||
                (showFilterOption &&
                  shouldShowAddColumn &&
                  !filterPayload)) && (
                <Button
                  disabled={
                    searchedEmail.length ||
                    (!localStorage.getItem(
                      `${Cookies.get("userId")}filterOptions`
                    ) &&
                      !multiCascaderDefaultValue.length)
                      ? true
                      : false
                  }
                  variant="contained"
                  size="small"
                  className="filter-save-btn"
                  onClick={() => {
                    if (
                      localStorage.getItem(
                        `${Cookies.get("userId")}filterOptions`
                      )
                    ) {
                      setOpenSaveFilterDialog(true);
                    } else {
                      pushNotification(
                        "warning",
                        "Please select any filter first"
                      );
                    }
                  }}
                >
                  Save
                </Button>
              )}
              <Button
                disabled={
                  searchedEmail.length ||
                  (!localStorage.getItem(
                    `${Cookies.get("userId")}filterOptions`
                  ) &&
                    !multiCascaderDefaultValue.length)
                    ? true
                    : false
                }
                variant="contained"
                size="small"
                className="filter-apply-btn"
                onClick={() => {
                  handleApplyFilters(false);
                  localStorage.removeItem(
                    `${Cookies.get("userId")}adminSelectedApplications`
                  );
                  setSelectedApplications([]);
                  setSelectedEmails([]);
                  setSelectedMobileNumbers([]);
                }}
              >
                Apply
              </Button>
            </>
          )}
        </>
      </>
    );
  };

  // reset filter options
  const resetFilterOptions = useCallback(() => {
    resetAllTheSelectedFilters();

    localStorage.setItem(
      `${Cookies.get("userId")}arrangedCollumns`,
      JSON.stringify(initialColumns)
    );
    setItems(
      JSON.parse(
        localStorage.getItem(`${Cookies.get("userId")}arrangedCollumns`)
      )
    );
    localStorage.setItem(
      `${Cookies.get("userId")}addedCollumnsOrder`,
      JSON.stringify([])
    );
    setaddedColumnsOrder(
      JSON.parse(
        localStorage.getItem(`${Cookies.get("userId")}addedCollumnsOrder`)
      )
    );
    setAllApplicationPayload(() => {
      return {
        ...blankPayloadOfAllApplication,
        season: selectedSeason?.length
          ? JSON.parse(selectedSeason)?.season_id
          : "",
      };
    });
    setShouldCallApplicationsApi((prev) => !prev);
    setSearchedEmail("");

    setAdvanceFilterBlocks([]);
    localStorage.removeItem(advFilterLocalStorageKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //set state of application id, emails and mobile numbers
  useEffect(() => {
    setSelectedMobileNumbers(
      removeDuplicatesAndSetObjectValues(
        "student_mobile_no",
        selectedApplications
      )
    );
    setSelectedEmails(
      removeDuplicatesAndSetObjectValues(
        "student_email_id",
        selectedApplications
      )
    );
    const selectedApplicationIds = selectedApplications?.map(
      (object) => object.application_id
    );
    setSelectedApplicationIds(selectedApplicationIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedApplications]);
  const handleSaveFilters = (event) => {
    event.preventDefault();
    const payload = {
      filter_name: filterSaveName,
      payload: payloadForAllApplication,
    };

    const params = {
      apiURL: `${import.meta.env.VITE_API_BASE_URL}/admin/filter/add/${
        currentUserCollegeId ? "?college_id=" + currentUserCollegeId : ""
      }`,
      payload,
      setCallFilterSaveApi,
      setListOfFilters,
      setFilterSaveSomethingWentWrong,
      setFilterDataLoading,
      setOpenSaveFilterDialog,
      setFilterSaveName,
      setFilterSaveInternalServerError,
    };

    setFilterDataLoading(true);
    // we are calling the add filter api in this shared function.
    handleAddSavedFilter(params);
  };

  const handleDeleteSaveFilter = () => {
    setDeleteFilterLoading(true);
    const params = {
      apiURL: `${
        import.meta.env.VITE_API_BASE_URL
      }/admin/filter/delete_by_name/?filter_name=${deleteFilterName}${
        currentUserCollegeId ? "&college_id=" + currentUserCollegeId : ""
      }`,
      setCallFilterSaveApi,
      setListOfFilters,
      resetFilterOptions,
      setFilterPayload,
      setDeleteFilterLoading,
      setOpenDeleteFilterDialog,
      setFilterSaveInternalServerError,
      setFilterSaveSomethingWentWrong,
    };
    // in this shared function we are calling delete saved filter api
    handleDeleteSavedFilter(params);
  };

  const handleResetAllTheFilters = useCallback(() => {
    resetFilterOptions();
    setFilterPayload("");
    localStorage.removeItem(
      `${Cookies.get("userId")}adminSelectedApplications`
    );
    setSelectedApplications([]);
    setSelectedEmails([]);
    setSelectedMobileNumbers([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savedFilterProps = {
    savedFilterLoading,
    listOfFilters,
    setFilterPayload,
    filterPayload,
    setCallFilterSaveApi,
    setOpenDeleteFilterDialog,
    resetFilterOptions,
    handleFilterOption,
    settingFilterOptions,
    setDeleteFilterName,
  };

  const handleApplyQuickFilters = useCallback(() => {
    setAllApplicationPayload(payloadForAllApplication);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLeadStage, paymentStatus, selectedVerificationStatus]);
  //new Code
  const [userProfileOpen, setUserProfileOpen] = React.useState(false);

  const handleOpenUserProfileDrawer = (key) => {
    setUserProfileOpen(true);
  };
  const [userDetailsStateData, setUserDetailsStateData] = useState({});

  const quickFilterList = [
    {
      label: "Fresh Lead",
      color: "#00B087",
      value: ["Fresh Lead"],
      stateValue: selectedLeadStage,
      setStateValue: setSelectedLeadStage,
      isChecked: selectedLeadStage?.includes("Fresh Lead"),
    },
    {
      label: "Verified",
      color: "#008BE2",
      value: "verified",
      stateValue: selectedVerificationStatus,
      setStateValue: setSelectedVerificationStatus,
      isChecked: selectedVerificationStatus === "verified",
    },
    {
      label: "Paid lead",
      color: "#1D8F00",
      value: ["captured"],
      stateValue: paymentStatus,
      setStateValue: setPaymentStatus,
      isChecked: paymentStatus?.includes("captured"),
    },
  ];
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Application manager Head Title add
  useEffect(() => {
    setHeadTitle("Application Manager");
    document.title = "Application Manager";
  }, [headTitle]);

  const location = useLocation();
  useEffect(() => {
    scrollToTheElement(location?.hash);
  }, [location]);

  return (
    <>
      {isLoading || loading || filterDataLoading ? (
        <Box className="loading-lottie-file-container">
          <LeefLottieAnimationLoader
            height={200}
            width={180}
          ></LeefLottieAnimationLoader>
        </Box>
      ) : (
        <Box
          component="main"
          className="mainTable"
          sx={{ flexGrow: 1, py: 2, px: 2 }}
        >
          {isActionDisable && <RestrictedAlert />}
          <Grid container>
            <Grid item md={12} sm={12} xs={12}>
              {!showFilterOption && !shouldShowAddColumn && (
                <LeadManagerHeader
                  application={true}
                  keyName="form_initiated"
                  title="Total Applications"
                  formInitiated={"&form_initiated=true"}
                />
              )}

              {(showLeadStageCount ||
                showFilterOption ||
                shouldShowAddColumn) && (
                <LeadStageCountAndDetails
                  fromApplication={true}
                  handleOpenUserProfileDrawer={handleOpenUserProfileDrawer}
                  setUserDetailsStateData={setUserDetailsStateData}
                  userDetailsStateData={userDetailsStateData}
                />
              )}
              <Card
                id="application-manager-container"
                className="common-box-shadow"
                sx={{
                  p: 2,
                  mt: 3,
                  borderRadius: "20px !important",
                }}
              >
                <Box sx={{ mb: 2 }} className="applicationManagerTableCard">
                  <Box className="tableHeading">
                    <FilterHeader
                      openQuickSnapShotDrawer={openQuickSnapShotDrawer}
                      setOpenQuickSnapShotDrawer={setOpenQuickSnapShotDrawer}
                      setShowLeadStageCount={setShowLeadStageCount}
                      showLeadStageCount={showLeadStageCount}
                      savedFilterProps={savedFilterProps}
                      searchedInput={searchedEmail}
                      isActionDisable={isActionDisable}
                      handleClickOpenColumnsReorder={
                        handleClickOpenColumnsReorder
                      }
                      resetFilterOptions={handleResetAllTheFilters}
                      setShouldShowAddColumn={setShouldShowAddColumn}
                      setShowFilterOption={setShowFilterOption}
                      columnsOrder={columnsOrder}
                      showFilterOption={showFilterOption}
                      shouldShowAddColumn={shouldShowAddColumn}
                      shouldSentEmailToAll={
                        collegeHeadCounsellor ||
                        collegeSuperAdmin ||
                        collegeAdmin ||
                        collegeCounsellor
                      }
                      handleComposeClick={handleComposeClick}
                      handleAllApplicationsDownload={
                        handleAllApplicationsDownload
                      }
                      totalApplicationCount={totalApplicationCount}
                      showChartPermission={
                        !isActionDisable && (collegeSuperAdmin || collegeAdmin)
                      }
                      handleEmailInputField={handleEmailInputField}
                      searchedEmail={searchedEmail}
                      setSearchedEmail={setSearchedEmail}
                      handleSearchByEmail={handleSearchByEmail}
                      handleResetSearchByEmail={handleResetSearchByEmail}
                      initialColumns={initialColumns}
                      setItems={setItems}
                      innerSearchPermission={innerSearchPermission}
                    />
                  </Box>

                  <>
                    <Box
                      className={
                        showFilterOption || shouldShowAddColumn
                          ? "show-all-the-filters"
                          : "hide-all-the-filters"
                      }
                    >
                      <Box className="filter-container">
                        {filterAndColumnOption()}
                      </Box>
                    </Box>
                    {/* {innerSearchPermission && (
                      <SearchBox
                        handleEmailInputField={handleEmailInputField}
                        searchedEmail={searchedEmail}
                        setSearchedEmail={setSearchedEmail}
                        handleSearchByEmail={handleSearchByEmail}
                        handleResetSearchByEmail={handleResetSearchByEmail}
                      />
                    )} */}
                  </>
                </Box>

                <Card sx={{ my: 2, boxShadow: 0 }}>
                  <Box
                    sx={{
                      mb: 0.7,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <TableDataCount
                      totalCount={totalApplicationCount}
                      currentPageShowingCount={applications?.length}
                      pageNumber={pageNumber}
                      rowsPerPage={rowsPerPage}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      {showGenerateRequest && (
                        <Typography variant="h6" sx={{ color: "#4A7ADC" }}>
                          Generate report ?{" "}
                          <Button
                            onClick={() => setOpenReportNameDialog(true)}
                            className="common-outlined-button"
                          >
                            Click here
                          </Button>
                        </Typography>
                      )}
                      <TableTopPagination
                        pageNumber={pageNumber}
                        setPageNumber={setPageNumber}
                        localStoragePageNumberKey={"adminApplicationSavePageNo"}
                        rowsPerPage={rowsPerPage}
                        totalCount={totalApplicationCount}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <BasicDetailsTable
                      quickFilterList={quickFilterList}
                      handleApplyQuickFilters={handleApplyQuickFilters}
                      studentId={studentId}
                      setStudentId={setStudentId}
                      setIsScrolledToPagination={setIsScrolledToPagination}
                      // handleCallApplicationApi={handleCallApplicationApi}
                      loading={isFetching}
                      setLoading={setLoading}
                      rowCount={rowCount}
                      rowsPerPage={rowsPerPage}
                      setRowsPerPage={setRowsPerPage}
                      applications={applications}
                      openCol={openCol}
                      setOpenCol={setOpenCol}
                      key={applications?.application_id}
                      setSelectedApplications={setSelectedApplications}
                      selectedApplications={selectedApplications}
                      additionalColumnStates={additionalColumnStates}
                      selectedEmails={selectedEmails}
                      setSelectedEmails={setSelectedEmails}
                      customizeColumnOptions={customizeColumnOptions}
                      searchedEmail={searchedEmail}
                      page={pageNumber}
                      setPage={setPageNumber}
                      allApplicationInternalServerError={
                        allApplicationInternalServerError
                      }
                      somethingWentWrongInApplicationDownload={
                        somethingWentWrongInApplicationDownload
                      }
                      setSomethingWentWrongInApplicationDownload={
                        setSomethingWentWrongInApplicationDownload
                      }
                      multiCascaderDefaultValue={multiCascaderDefaultValue}
                      somethingWentWrongInAllApplication={
                        somethingWentWrongInAllApplication
                      }
                      hideApplicationsTable={hideApplicationsTable}
                      items={items}
                      setItems={setItems}
                      setOpenColumnsReorder={setOpenColumnsReorder}
                      openColumnsReorder={openColumnsReorder}
                      initialColumns={initialColumns}
                      setaddedColumnsOrder={setaddedColumnsOrder}
                      columnsOrder={columnsOrder}
                      handleCustomizeTableColumn={handleCustomizeTableColumn}
                      setSelectedMobileNumbers={setSelectedMobileNumbers}
                      selectedMobileNumbers={selectedMobileNumbers}
                      selectedApplicationIds={selectedApplicationIds}
                      isActionDisable={isActionDisable}
                      setTwelveScoreSort={setTwelveScoreSort}
                      sort={sort}
                      setSort={setSort}
                      sortingLocalStorageKeyName={sortingLocalStorageKeyName}
                      handleOpenUserProfileDrawer={handleOpenUserProfileDrawer}
                      setUserDetailsStateData={setUserDetailsStateData}
                    />
                  </Box>
                </Card>
              </Card>
            </Grid>
          </Grid>
          {selectedApplications?.length > 0 && !isActionDisable && (
            <LeadActions
              showMergeLead={true}
              handleClickOpenSelectTemplate={handleClickOpenSelectTemplate}
              isScrolledToPagination={isScrolledToPagination}
              handleDownload={handleAllApplicationsDownload}
              handleSentWhatsapp={handleClickOpenDialogsWhatsApp}
              handleSendSms={handleClickOpenSelectTemplate}
              handleSentEmail={handleComposeClick}
              handleAssignCounselor={handleClickOpenDialogsAssignCounsellor}
              assignCounselorPermission={
                collegeHeadCounsellor || collegeSuperAdmin || collegeAdmin
              }
              smsEmailWhatsappPermission={
                collegeHeadCounsellor ||
                collegeSuperAdmin ||
                collegeAdmin ||
                collegeCounsellor
              }
              handleChangeLeadStage={handleClickOpenDialogsLead}
              changeLeadStagePermission={true}
              selectedApplications={selectedApplications?.length}
              setSelectedApplications={setSelectedApplications}
              setSelectedEmails={setSelectedEmails}
              localStorageKey={"adminSelectedApplications"}
              handleSendVerificationEmail={() =>
                setOpenSendVerificationEmailDialog(true)
              }
              studentId={studentId}
            />
          )}
          {/* dreawer user profile */}

          <Drawer
            anchor={"right"}
            open={userProfileOpen}
            disableEnforceFocus={true}
            onClose={() => {
              setUserProfileOpen(false);
            }}
            className="vertical-scrollbar-drawer"
          >
            <Box className="user-profile-control-drawer-box-container">
              <Box>
                <ApplicationHeader
                  userDetailsStateData={userDetailsStateData}
                  viewProfileButton={true}
                  setUserProfileOpen={setUserProfileOpen}
                ></ApplicationHeader>
              </Box>
            </Box>
          </Drawer>
          {/* Change multiple Lead Stages */}
          <Box>
            <ChangeMultipleLeadStage
              color={"application"}
              handleClickOpenDialogs={handleClickOpenDialogsLead}
              handleCloseDialogs={handleCloseDialogsLead}
              openDialogs={openDialogsLead}
              selectedApplicationIds={selectedApplicationIds}
              setSelectedApplications={setSelectedApplications}
              setSelectedEmails={setSelectedEmails}
              localStorageKey={"adminSelectedApplications"}
            ></ChangeMultipleLeadStage>
          </Box>
          {/* assign multiple Lead to counsellor */}
          <Box>
            <AssignCounsellorDialog
              color={"application"}
              handleClickOpenDialogs={handleClickOpenDialogsAssignCounsellor}
              handleCloseDialogs={handleCloseDialogsAssignCounsellor}
              openDialogs={openDialogsAssignCounsellor}
              selectedApplicationIds={selectedApplicationIds}
              setSelectedApplications={setSelectedApplications}
              setSelectedEmails={setSelectedEmails}
              counsellorList={counsellorList}
              localStorageKey={"adminSelectedApplications"}
              setCallFilterOptionApi={setCallFilterOptionApi}
              loading={counselorListApiCallInfo.isFetching}
            ></AssignCounsellorDialog>
          </Box>
          {/* send email */}
          <Box>
            <Mail
              emailPayload={emailPayload}
              payloadForEmail={payloadForEmail}
              open={isComposeOpen}
              hideToInputField={true}
              sendBulkEmail={true}
              onClose={handleComposerClose}
              selectedEmails={selectedEmails}
              setSelectedApplications={setSelectedApplications}
              setSelectedEmails={setSelectedEmails}
              localStorageKey={"adminSelectedApplications"}
            ></Mail>
          </Box>
          {/* select sms template component  */}
          {openSelectTemplateDialog && (
            <SelectTemplateDialog
              setTemplateId={setTemplateId}
              handleClickOpenDialogsSms={handleClickOpenDialogsSms}
              openDialoge={openSelectTemplateDialog}
              handleClose={handleCloseSelectTemplate}
              setTemplateBody={setTemplateBody}
              setSenderName={setSenderName}
              setSmsType={setSmsType}
              setSmsDltContentId={setSmsDltContentId}
              from={templateType}
            ></SelectTemplateDialog>
          )}
          {/* Send Sms  */}
          <Box>
            <SmsAndWhatsapp
              color="#DD34B8"
              name={"SMS"}
              handleClickOpenDialogs={handleClickOpenDialogsSms}
              handleCloseDialogs={handleCloseDialogsSms}
              openDialogs={openDialogsSms}
              setOpenDialogs={setOpenDialogsSms}
              selecteMobileNumber={selectedMobileNumbers}
              templateBody={templateBody}
              setTemplateBody={setTemplateBody}
              smsDltContentId={smsDltContentId}
              smsType={smsType}
              smsSenderName={smsSenderName}
              from={"lead-manager"}
              setSelectedApplications={setSelectedApplications}
              setSelectedEmails={setSelectedEmails}
              setSelectedMobileNumbers={setSelectedMobileNumbers}
              localStorageKey={"adminSelectedApplications"}
            ></SmsAndWhatsapp>
          </Box>
          <Box>
            <SmsAndWhatsapp
              templateId={templateId}
              color="#25D366"
              name={"WhatsApp"}
              handleClickOpenDialogs={handleClickOpenDialogsWhatsApp}
              handleCloseDialogs={handleCloseDialogsWhatsApp}
              openDialogs={openDialogsWhatsApp}
              setOpenDialogs={setOpenDialogsWhatsApp}
              selecteMobileNumber={selectedMobileNumbers}
              templateBody={templateBody}
              setTemplateBody={setTemplateBody}
              handleClickOpenSelectTemplate={handleClickOpenSelectTemplate}
              from={"lead-manager"}
              setSelectedApplications={setSelectedApplications}
              setSelectedEmails={setSelectedEmails}
              setSelectedMobileNumbers={setSelectedMobileNumbers}
              localStorageKey={"adminSelectedApplications"}
            ></SmsAndWhatsapp>
          </Box>
        </Box>
      )}

      <ReportNameDialog
        handleGenerateReport={handleGenerateReportRequest}
        openReportNameDialog={openReportNameDialog}
        setReportName={setReportName}
        setReportDescription={setReportDescription}
        setOpenReportNameDialog={setOpenReportNameDialog}
      />
      <FilterSaveDialog
        openSaveFilterDialog={openSaveFilterDialog}
        setOpenSaveFilterDialog={setOpenSaveFilterDialog}
        filterDataLoading={filterDataLoading}
        handleSaveFilters={handleSaveFilters}
        filterSaveName={filterSaveName}
        setFilterSaveName={setFilterSaveName}
      />

      <DeleteDialogue
        openDeleteModal={openDeleteFilterDialog}
        handleCloseDeleteModal={() => setOpenDeleteFilterDialog(false)}
        handleDeleteSingleTemplate={handleDeleteSaveFilter}
        internalServerError={filterSaveInternalServerError}
        somethingWentWrong={filterSaveSomethingWentWrong}
        apiResponseChangeMessage={apiResponseChangeMessage}
        loading={deleteFilterLoading}
      />

      {openSendVerificationEmailDialog && (
        <SendEmailVerificationDialog
          open={openSendVerificationEmailDialog}
          handleClose={() => setOpenSendVerificationEmailDialog(false)}
          selectedEmails={selectedEmails}
          setSelectedApplications={setSelectedApplications}
          localStorageKey={"adminSelectedApplications"}
        />
      )}
      {openQuickSnapShotDrawer && (
        <QuickSnapshoot
          openQuickSnapShotDrawer={openQuickSnapShotDrawer}
          setOpenQuickSnapShotDrawer={setOpenQuickSnapShotDrawer}
        />
      )}
    </>
  );
}

export default ApplicationManagerTable;
