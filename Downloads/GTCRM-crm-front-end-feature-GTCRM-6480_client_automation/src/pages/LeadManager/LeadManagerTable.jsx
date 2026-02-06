/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Card,
  Container,
  Drawer,
  Grid,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import "../../styles/ApplicationManagerTable.css";
// Icons
// import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import ChangeMultipleLeadStage from "../../components/ui/counsellor-dashboard/ChangeMultipleLeadStage";
import GetJsonDate from "../../hooks/GetJsonDate";
import { removeCookies } from "../../Redux/Slices/authSlice";

import { DateRangePicker, SelectPicker } from "rsuite";
import DeleteDialogue from "../../components/shared/Dialogs/DeleteDialogue";
import FilterSaveDialog from "../../components/shared/Dialogs/FilterSaveDialog";
import FilterSelectPicker from "../../components/shared/filters/FilterSelectPicker";
import RestrictedAlert from "../../components/ui/admin-dashboard/RestrictedAlert";
import Mail from "../../components/userProfile/Mail";
import SmsAndWhatsapp from "../../components/userProfile/SmsAndWhatsapp";
import {
  addColumnOptionForApplicationManager,
  ApplicationVerificationStatus,
  blankPayloadOfAllApplication,
  leadType,
  listOfSourcesType,
} from "../../constants/LeadStageList";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import { removeDuplicatesAndSetObjectValues } from "../../helperFunctions/removeDuplicatesAndSetObjectValues";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import { handleReportGenerate } from "../../hooks/useReportGenerateApi";
import useToasterHook from "../../hooks/useToasterHook";
import {
  useGenerateReportMutation,
  useGetCounselorListQuery,
  useGetLeadsQuery,
  usePrefetch,
} from "../../Redux/Slices/applicationDataApiSlice";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import SelectTemplateDialog from "../TemplateManager/SelectTemplateDialog";
// import ReportNameDialog from "./ReportNameGettingDialog";
import { useCallback } from "react";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import FilterHeader from "../../components/ui/application-manager/FIlterHeader";
import LeadActions from "../../components/ui/application-manager/LeadActions";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import useFetchUTMMedium from "../../hooks/useFetchUTMMedium";
import "../../styles/sharedStyles.css";

import {
  organizeCounselorFilterOption,
  organizeSourceFilterOption,
} from "../../helperFunctions/filterHelperFunction";
import {
  useGetAllSourceListQuery,
  useGetAllStateListQuery,
} from "../../Redux/Slices/filterDataSlice";
// import ExtraFilterList from "./ExtraFilterList";
import AdvanceFilterButton from "../../components/shared/AdvanceFilter/AdvanceFilterButton";
import AdvanceFilterDrawer from "../../components/shared/AdvanceFilter/AdvanceFilterDrawer";
import SendEmailVerificationDialog from "../../components/shared/Dialogs/SendEmailVerificationDialog";
import LeadDetailsTable from "../../components/ui/application-manager/LeadDetailsTable";
import LeadManagerHeader from "../../components/ui/application-manager/LeadManagerHeader";
import LeadStageCountAndDetails from "../../components/ui/application-manager/LeadStageCountAndDetails";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import TableTopPagination from "../../components/ui/application-manager/TableTopPagination";
import { addFilterOptionToCookies } from "../../helperFunctions/advanceFilterHelperFunctions";
import { handleDataFilterOption } from "../../helperFunctions/handleDataFilterOption";
import { scrollToTheElement } from "../../utils/ScrollToTheElement";
import ReportNameDialog from "../ApplicationManager/ReportNameGettingDialog";
import ApplicationHeader from "../../components/userProfile/ApplicationHeader";
import {
  border,
  borderColor,
  borderRadius,
  boxSizing,
  color,
  padding,
} from "@mui/system";
import { customFetch } from "../StudentTotalQueries/helperFunction";
// ============
function LeadManagerTable(props) {
  // counselor id coming from counsellor dashboard
  const { state } = useLocation();
  const permissions = useSelector((state) => state.authentication.permissions);
  const innerSearchPermission =
    permissions?.menus?.lead_manager?.manage_leads?.features
      ?.lead_manager_search;
  const pushNotification = useToasterHook();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const tokenState = useSelector((state) => state.authentication.token);
  const [collegeId, setCollegeId] = useState("");
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const userEmail = useSelector(
    (state) => state.authentication.userEmail?.userId
  );

  const currentUserCollegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

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

  const selectedSeason = useSelector(
    (state) => state.authentication.selectedSeason
  );
  const isActionDisable = useSelector(
    (state) => state.authentication.isActionDisable
  );

  //report name dialog
  const [openReportNameDialog, setOpenReportNameDialog] = useState(false);

  //advance filter
  const [openAdvanceFilter, setOpenAdvanceFilter] = useState(false);
  const [advanceFilterBlocks, setAdvanceFilterBlocks] = useState([]);

  const [applyAdvanceFilter, setApplyAdvanceFilter] = useState(false);

  const advFilterLocalStorageKey = `${Cookies.get(
    "userId"
  )}leadManagerAdvanceFilterOptions`;

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
        localStorage.getItem(`${Cookies.get("userId")}leadAddedCollumnsOrder`)
      ) === null
    ) {
      localStorage.setItem(
        `${Cookies.get("userId")}leadAddedCollumnsOrder`,
        JSON.stringify([])
      );
      return [];
    }
    return JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}leadAddedCollumnsOrder`)
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

  //common api cal hook
  const {
    handleFilterListApiCall,
    getSavedFiltersList,
    handleDeleteSavedFilter,
    handleAddSavedFilter,
  } = useCommonApiCalls();
  const [selectedLeadStage, setSelectedLeadStage] = useState([]);
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

  const [selectedSourceType, setSelectedSourceType] = useState([]);

  const [selectedVerificationStatus, setSelectedVerificationStatus] =
    useState("");
  const [selectedState, setSelectedState] = useState([]);
  const [selectedSource, setSelectedSource] = useState([]);
  const [selectedUtmMedium, setSelectedUtmMedium] = useState([]);
  const [selectedLeadType, setSelectedLeadType] = useState("");

  const [selectedCounselor, setSelectedCounselor] = useState([]);
  const [shouldShowAddColumn, setShouldShowAddColumn] = useState(false);
  const [showFilterOption, setShowFilterOption] = useState(false);

  const [totalApplicationCount, setTotalApplicationCount] = useState(0);
  const [multiCascaderDefaultValue, setMultiCascaderDefaultValue] = useState(
    []
  );

  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [showGenerateRequest, setShowGenerateRequest] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState([]);
  //internal server error states

  const [hideUTMMedium, setHideUTMMedium] = useState(false);
  const [hideSourceList, setHideSourceList] = useState(false);

  const [hideStateList, setHideStateList] = useState(false);

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
    handleDataFilterOption(value, "leadFilterOptions");
  }, []);

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
        apiURL: `${
          import.meta.env.VITE_API_BASE_URL
        }/admin/filter/?leads_filter=true&${
          currentUserCollegeId ? "college_id=" + currentUserCollegeId : ""
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

      setAllApplicationPayload((prev) => ({
        ...prev,
        counselor: { ...prev.counselor, counselor_id: [state?.counselorId] },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        () => {},
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

  const initialColumns = useMemo(() => {
    return [
      {
        content: "Name",
        id: "name",
      },
      { content: "Form Name", id: "form" },
      { content: "Automation", id: "automation" },
      { content: "Contact Details", id: "contact" },
      { content: "Payment Status", id: "payment" },
      { content: "Lead Stage", id: "stage" },
    ];
  }, []);

  const [items, setItems] = useState(() => {
    if (
      JSON.parse(
        localStorage.getItem(`${Cookies.get("userId")}leadArrangedCollumns`)
      ) === null
    ) {
      localStorage.setItem(
        `${Cookies.get("userId")}leadArrangedCollumns`,
        JSON.stringify(initialColumns)
      );
      return initialColumns;
    }
    return JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}leadArrangedCollumns`)
    );
  });

  const tableColumns = JSON.parse(
    localStorage.getItem(`${Cookies.get("userId")}leadArrangedCollumns`)
  );
  useEffect(() => {
    if (items) {
      const slicedItem = items.slice(0, 6);
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
        const slicedItem = tableColumns.slice(6);
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
      localStorage.getItem(`${Cookies.get("userId")}leadFilterOptions`)
    );
    const values = filterOptions?.addColumn;
    const arrangedCollumns = JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}leadArrangedCollumns`)
    );
    const addedColumnsOrder = JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}leadAddedCollumnsOrder`)
    );

    // For loop to to add added columns
    for (let index = 0; index < values?.length; index++) {
      let findObj = arrangedCollumns?.find((obj) => obj.id === values[index]);
      if (findObj === undefined) {
        const newColumn = { content: values[index], id: values[index] };
        arrangedCollumns?.push(newColumn);
        localStorage.setItem(
          `${Cookies.get("userId")}leadArrangedCollumns`,
          JSON.stringify(arrangedCollumns)
        );
        setItems(
          JSON.parse(
            localStorage.getItem(`${Cookies.get("userId")}leadArrangedCollumns`)
          )
        );
      }
      //  storing added columns order
      const valueExist = addedColumnsOrder?.includes(values[index]);
      if (valueExist === false) {
        addedColumnsOrder.push(values[index]);
        localStorage.setItem(
          `${Cookies.get("userId")}leadAddedCollumnsOrder`,
          JSON.stringify(addedColumnsOrder)
        );
        setaddedColumnsOrder(
          JSON.parse(
            localStorage.getItem(
              `${Cookies.get("userId")}leadAddedCollumnsOrder`
            )
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
        `${Cookies.get("userId")}leadArrangedCollumns`,
        JSON.stringify(finalColumns)
      );
      setItems(
        JSON.parse(
          localStorage.getItem(`${Cookies.get("userId")}leadArrangedCollumns`)
        )
      );
      //  filter added columns order
      const filtered = addedColumnsOrder.filter((column) =>
        values.includes(column)
      );
      localStorage.setItem(
        `${Cookies.get("userId")}leadAddedCollumnsOrder`,
        JSON.stringify(filtered)
      );
      setaddedColumnsOrder(
        JSON.parse(
          localStorage.getItem(`${Cookies.get("userId")}leadAddedCollumnsOrder`)
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

  const settingFilterOptions = useCallback((filterOptions, from) => {
    if (filterOptions) {
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
        setSelectedSource(filterOptions?.source?.source_name);
        filterOptions?.source?.source_name?.length &&
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
        setSelectedVerificationStatus(filterOptions?.is_verify);
        setAllApplicationPayload((prev) => ({
          ...prev,
          is_verify: filterOptions?.is_verify,
        }));
      }
      if (filterOptions?.source_type) {
        setSelectedSourceType(filterOptions?.source_type);
        setAllApplicationPayload((prev) => ({
          ...prev,
          source_type: filterOptions?.source_type,
        }));
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
        filterOptions?.date_range?.start_date ||
        filterOptions.is_verify ||
        filterOptions?.source_type?.length
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
      setAllApplicationPayload((prev) => ({
        ...prev,
        lead_stage: { ...prev.lead_stage, lead_b: true },
      }));
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
        `${Cookies.get("userId")}leadFilterOptions`
      );
      if (filterOptions) {
        settingFilterOptions(JSON.parse(filterOptions), "local");
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const payloadForAllApplication = {
    state: {
      state_b: checkedState,
      state_code: selectedState,
    },
    city: {
      city_b: checkedCity,
      city_name: [],
    },
    source: {
      source_b: checkedSource,
      source_name: selectedSource,
    },
    lead_stage: {
      lead_b: checkedLeadStage ? checkedLeadStage : true,
      lead_sub_b: checkedLeadSubStage,
      lead_name: selectedLeadStage.length
        ? [
            {
              name: selectedLeadStage,
              label: [],
            },
          ]
        : [],
    },
    counselor: {
      counselor_b: checkedCounselorName,
      counselor_id: [],
    },
    application_stage: {
      application_stage_b: checkedApplicationStage,
      application_stage_name: "",
    },
    lead_type: {
      lead_type_b: checkedLeadType,
      lead_type_name: selectedLeadType,
    },
    is_verify: selectedVerificationStatus,
    is_verify_b: checkedVerificationStatus,
    payment_status: paymentStatus,
    date: checkedApplicationDate,
    utm_medium: selectedUtmMedium,
    utm_medium_b: checkUTMMedium,
    utm_campaign_b: checkUTMCampaign,
    source_type_b: checkedSourceType,
    season: selectedSeason?.length ? JSON.parse(selectedSeason)?.season_id : "",
    // extra_filters: selectedExtraFilters,
  };

  if (selectedSourceType.length) {
    payloadForAllApplication.source_type = selectedSourceType;
  }

  const payloadForEmail = {
    state_code: applyAdvanceFilter ? [] : selectedState,
    college_id: collegeId,
    city_name: [],
    source_name: applyAdvanceFilter ? [] : selectedSource,
    lead_type_name: applyAdvanceFilter ? "" : selectedLeadType,
    counselor_id: collegeCounsellor
      ? [counsellorList[0]?.value]
      : applyAdvanceFilter
      ? []
      : selectedCounselor?.length > 0
      ? selectedCounselor
      : [],
    application_stage_name: "",
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
    lead_name: applyAdvanceFilter
      ? []
      : selectedLeadStage.length
      ? [{ name: selectedLeadStage, label: [] }]
      : [],
    // extra_filters: selectedExtraFilters,
  };

  if (applyAdvanceFilter) {
    payloadForEmail.advance_filters = advanceFilterBlocks;
  }

  if (allApplicationDateRange?.length) {
    payloadForAllApplication.date_range = JSON.parse(
      GetJsonDate(allApplicationDateRange)
    );
    payloadForEmail.date_range = JSON.parse(
      GetJsonDate(allApplicationDateRange)
    );
  }

  const [twelveScoreSort, setTwelveScoreSort] = useState(null);
  const [callGetLeadsApi, setCallGetLeadsApi] = useState(false);

  const sortingLocalStorageKeyName = `${Cookies.get(
    "userId"
  )}leadManagerTwelveScoreSort`;

  const [sort, setSort] = useState(
    localStorage.getItem(sortingLocalStorageKeyName)
      ? localStorage.getItem(sortingLocalStorageKeyName)
      : "default"
  );

  useEffect(() => {
    if (sort === "default") {
      setTwelveScoreSort(null);
      setCallGetLeadsApi(true);
    }
    if (sort === "asc") {
      setTwelveScoreSort(true);
      setCallGetLeadsApi(true);
    }
    if (sort === "des") {
      setTwelveScoreSort(false);
      setCallGetLeadsApi(true);
    }
  }, [sort]);

  const {
    data: applicationData,
    isSuccess,
    isFetching,
    error: allApplicationError,
    isError,
  } = useGetLeadsQuery(
    {
      pageNumber: pageNumber,
      rowsPerPage: rowsPerPage,
      payload: allApplicationPayload,
      collegeId: currentUserCollegeId,
      twelveScoreSort: twelveScoreSort,
    },
    {
      skip: callGetLeadsApi ? false : true,
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

  const prefetchAllLeads = usePrefetch("getLeads");
  useEffect(() => {
    apiCallFrontAndBackPage(
      applicationData,
      rowsPerPage,
      pageNumber,
      currentUserCollegeId,
      prefetchAllLeads,
      { payload: allApplicationPayload },
      twelveScoreSort
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    applicationData,
    pageNumber,
    prefetchAllLeads,
    rowsPerPage,
    currentUserCollegeId,
    twelveScoreSort,
  ]);

  //application download state
  const [isLoading, setIsLoading] = useState(false);

  //selected application and emails state
  const [selectedApplicationIds, setSelectedApplicationIds] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedMobileNumbers, setSelectedMobileNumbers] = useState([]);

  const payloadForDownloadFilterData = {
    payload: {
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
        lead_b: checkedLeadStage ? checkedLeadStage : true,
        lead_sub_b: checkedLeadSubStage,
        lead_name: applyAdvanceFilter
          ? []
          : selectedLeadStage.length
          ? [
              {
                name: selectedLeadStage,
                label: [],
              },
            ]
          : [],
      },
      counselor: {
        counselor_b: checkedCounselorName,
        counselor_id: [],
      },
      application_stage: {
        application_stage_b: checkedApplicationStage,
        application_stage_name: "",
      },
      lead_type: {
        lead_type_b: checkedLeadType,
        lead_type_name: applyAdvanceFilter ? "" : selectedLeadType,
      },
      is_verify: applyAdvanceFilter ? "" : selectedVerificationStatus,
      payment_status: applyAdvanceFilter ? [] : paymentStatus,
      date: checkedApplicationDate,
      utm_medium: applyAdvanceFilter ? [] : selectedUtmMedium,
      utm_medium_b: checkUTMMedium,
      utm_campaign_b: checkUTMCampaign,
      source_type_b: checkedSourceType,
    },
  };

  const payloadOfDownloadingAllApplication = {
    student_ids: selectedApplicationIds,
    payload: payloadForDownloadFilterData?.payload,
  };

  if (applyAdvanceFilter) {
    payloadForDownloadFilterData.payload.advance_filters = advanceFilterBlocks;
  }

  if (allApplicationDateRange?.length) {
    payloadForDownloadFilterData.payload.date_range = JSON.parse(
      GetJsonDate(allApplicationDateRange)
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
          `${import.meta.env.VITE_API_BASE_URL}/admin/download_leads/${
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
                      `${Cookies.get("userId")}adminSelectedLeads`
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
      report_type: "Leads",
      format: "CSV",
      report_send_to: userEmail,
    },
    payload: {
      state_code: applyAdvanceFilter ? [] : selectedState,
      city_name: [],
      source_name: applyAdvanceFilter ? [] : selectedSource,
      lead_type_name: applyAdvanceFilter ? "" : selectedLeadType,
      counselor_id: collegeCounsellor
        ? [counsellorList[0]?.value]
        : applyAdvanceFilter
        ? []
        : selectedCounselor?.length > 0
        ? selectedCounselor
        : [],
      application_stage_name: "",
      is_verify: applyAdvanceFilter ? "" : selectedVerificationStatus,
      payment_status: applyAdvanceFilter ? [] : paymentStatus,
      // extra_filters: selectedExtraFilters,
      application_filling_stage: [],
      lead_name: applyAdvanceFilter
        ? []
        : selectedLeadStage.length
        ? [{ name: selectedLeadStage, label: [] }]
        : [],
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
      }/admin/search_leads/?search_input=${searchedEmail}${
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
    localStorage.setItem(`${Cookies.get("userId")}adminLeadSavePageNo`, 1);
  };

  const resetAllTheSelectedFilters = () => {
    localStorage.removeItem(`${Cookies.get("userId")}leadFilterOptions`);
    window.history.replaceState({}, document.title);

    setMultiCascaderDefaultValue([]);
    handleCustomizeColumn([]);
    setSelectedState([]);
    setSelectedSource([]);

    setSelectedCounselor([]);

    setSelectedLeadType("");
    setSelectedSourceType([]);
    setSelectedVerificationStatus("");
    setSelectedUtmMedium([]);
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
        is_verify: "",
        payment_status: [],
        utm_medium: [],
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
            <SelectPicker
              disabled={searchedEmail.length ? true : false}
              onChange={(value) => {
                handleFilterOption({ is_verify: value });
                setSelectedVerificationStatus(value);
                setFilterPayload("");

                addFilterOptionToCookies(
                  "leadManager",
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
                from="leadManager"
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
                from="leadManager"
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
                from="leadManager"
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
              from="leadManager"
            />

            <MultipleFilterSelectPicker
              searchedEmail={searchedEmail}
              placeholder="Source type"
              // className="select-picker"
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
              from="leadManager"
              className="select-picker"
            />
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
            pickerData={addColumnOptionForApplicationManager}
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
                      `${Cookies.get("userId")}leadFilterOptions`
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
                        `${Cookies.get("userId")}leadFilterOptions`
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
                    `${Cookies.get("userId")}leadFilterOptions`
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
                    `${Cookies.get("userId")}adminSelectedLeads`
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
      `${Cookies.get("userId")}leadArrangedCollumns`,
      JSON.stringify(initialColumns)
    );
    setItems(
      JSON.parse(
        localStorage.getItem(`${Cookies.get("userId")}leadArrangedCollumns`)
      )
    );
    localStorage.setItem(
      `${Cookies.get("userId")}leadAddedCollumnsOrder`,
      JSON.stringify([])
    );
    setaddedColumnsOrder(
      JSON.parse(
        localStorage.getItem(`${Cookies.get("userId")}leadAddedCollumnsOrder`)
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
      (object) => object.student_id
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
      apiURL: `${
        import.meta.env.VITE_API_BASE_URL
      }/admin/filter/add/?leads_filter=true&${
        currentUserCollegeId ? "college_id=" + currentUserCollegeId : ""
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
      }/admin/filter/delete_by_name/?leads_filter=true&filter_name=${deleteFilterName}${
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
    localStorage.removeItem(`${Cookies.get("userId")}adminSelectedLeads`);
    setSelectedApplications([]);
    setSelectedEmails([]);
    setSelectedMobileNumbers([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [userProfileOpen, setUserProfileOpen] = React.useState(false);

  const handleOpenUserProfileDrawer = (key) => {
    setUserProfileOpen(true);
  };
  //new Code
  const [userDetailsStateData, setUserDetailsStateData] = useState({});

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
  //Lead manager Head Title add
  useEffect(() => {
    setHeadTitle("Lead Manager");
    document.title = "Lead Manager";
  }, [headTitle]);

  const location = useLocation();
  useEffect(() => {
    scrollToTheElement(location?.hash);
  }, [location]);
  useEffect(() => {
    if (state?.dataType) {
      setShouldShowAddColumn(true);
    }
  }, [state?.dataType]);
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
          sx={{ flexGrow: 1, py: 2, px: 1 }}
        >
          <Container maxWidth={false}>
            {isActionDisable && <RestrictedAlert />}
            <Grid container>
              <Grid item md={12} sm={12} xs={12}>
                {!showFilterOption && !shouldShowAddColumn && (
                  <LeadManagerHeader keyName="total_lead" title="Total Leads" />
                )}
                {(showLeadStageCount ||
                  showFilterOption ||
                  shouldShowAddColumn) && (
                  <LeadStageCountAndDetails
                    handleOpenUserProfileDrawer={handleOpenUserProfileDrawer}
                    setUserDetailsStateData={setUserDetailsStateData}
                    userDetailsStateData={userDetailsStateData}
                    openRedirectByDefault={
                      state?.dataType ? state?.dataType : ""
                    }
                  />
                )}
                <Card
                  className="common-box-shadow"
                  sx={{
                    p: 2,
                    mt: 3,
                    borderRadius: "20px !important",
                  }}
                  id="lead-manager-container"
                >
                  <Box className="applicationManagerTableCard">
                    <Box className="tableHeading">
                      <FilterHeader
                        setShowLeadStageCount={setShowLeadStageCount}
                        showLeadStageCount={showLeadStageCount}
                        savedFilterProps={savedFilterProps}
                        searchedInput={searchedEmail?.length}
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
                        showCreateLead={true}
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

                    <Box>
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
                          initialColumns={initialColumns}
                          setItems={setItems}
                        />
                      )} */}
                    </Box>
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
                        <TableTopPagination
                          pageNumber={pageNumber}
                          setPageNumber={setPageNumber}
                          localStoragePageNumberKey={"adminLeadSavePageNo"}
                          rowsPerPage={rowsPerPage}
                          totalCount={totalApplicationCount}
                        />
                        {showGenerateRequest && (
                          <Typography variant="h6" sx={{ color: "#4A7ADC" }}>
                            Generate report ?{" "}
                            <Button
                              onClick={() => setOpenReportNameDialog(true)}
                              variant="outlined"
                              size="small"
                            >
                              Click here
                            </Button>
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Box>
                      <LeadDetailsTable
                        quickFilterList={quickFilterList}
                        handleClickOpenDialogsLead={handleClickOpenDialogsLead}
                        handleApplyQuickFilters={handleApplyQuickFilters}
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
                        handleOpenUserProfileDrawer={
                          handleOpenUserProfileDrawer
                        }
                        setUserDetailsStateData={setUserDetailsStateData}
                      />

                      {/*
                                            <<  TO DO : >>
                                                For now we are commenting quick snapshot,
                                                  because it is related to applications 
                                                  but if client wants, we can uncomment and show.

                                             {tableTabs === 2 && <QuickSnapshoot />} */}
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
                assignCounselorPermission={false}
                smsEmailWhatsappPermission={
                  collegeHeadCounsellor ||
                  collegeSuperAdmin ||
                  collegeAdmin ||
                  collegeCounsellor
                }
                handleChangeLeadStage={handleClickOpenDialogsLead}
                selectedApplications={selectedApplications?.length}
                setSelectedApplications={setSelectedApplications}
                setSelectedEmails={setSelectedEmails}
                localStorageKey={"adminSelectedLeads"}
                handleSendVerificationEmail={() =>
                  setOpenSendVerificationEmailDialog(true)
                }
              />
            )}
          </Container>
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
              localStorageKey={"adminSelectedLeads"}
            ></ChangeMultipleLeadStage>
          </Box>
          {/* assign multiple Lead to counsellor */}
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
              localStorageKey={"adminSelectedLeads"}
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
              localStorageKey={"adminSelectedLeads"}
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
              localStorageKey={"adminSelectedLeads"}
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
          localStorageKey={"adminSelectedLeads"}
        />
      )}
    </>
  );
}

export default LeadManagerTable;
