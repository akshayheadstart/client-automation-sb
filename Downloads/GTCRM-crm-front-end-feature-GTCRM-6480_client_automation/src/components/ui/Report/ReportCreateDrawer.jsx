/* eslint-disable react-hooks/exhaustive-deps */
import { CloseOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DatePicker, DateRangePicker, Input, InputNumber, SelectPicker } from "rsuite";
import {
  useGenerateReportMutation,
  useGetCounselorListQuery,
} from "../../../Redux/Slices/applicationDataApiSlice";
import {
  useGetAllCourseListQuery,
  useGetAllSourceListQuery,
  useGetAllStateListQuery,
  useGetAllTwelveBoardListQuery,
} from "../../../Redux/Slices/filterDataSlice";
import {
  ApplicationVerificationStatus,
  applicationStage,
  formFillingStages,
  formStageList,
  leadType,
  listOfSourcesType,
  paymentStatusList,
  reportFormat,
  reportPeriod,
  reportTypes,
  triggerByList,
  twelveMarksList,
} from "../../../constants/LeadStageList";
import { addFilterOptionToCookies } from "../../../helperFunctions/advanceFilterHelperFunctions";
import {
  organizeCounselorFilterOption,
  organizeCourseFilterCourseIdOption,
  organizeSourceFilterOption
} from "../../../helperFunctions/filterHelperFunction";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import GetJsonDate from "../../../hooks/GetJsonDate";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";
import useFetchCommonApi from "../../../hooks/useFetchCommonApi";
import useFetchUTMMedium from "../../../hooks/useFetchUTMMedium";
import useToasterHook from "../../../hooks/useToasterHook";
import {
  convertDatesAndTime,
  extractDateRangeWithString,
} from "../../../pages/StudentTotalQueries/helperFunction";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import "../../../styles/report.css";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import AdvanceFilterButton from "../../shared/AdvanceFilter/AdvanceFilterButton";
import AdvanceFilterDrawer from "../../shared/AdvanceFilter/AdvanceFilterDrawer";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import FilterSelectPicker from "../../shared/filters/FilterSelectPicker";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";
import BorderLineText from "../NestedAutomation/AutomationHelperComponent/BorderLineText";
import MultipleSelectOptions from "./MultipleSelectOptions";
function ReportCreateDrawer({
  openDrawer,
  setOpenDrawer,
  title,
  selectedSingleData,
  viewButton,
  reportTemplateCount,
  setReportId,
  reportId,
  readOnlyToggle,
  setSelectedData,
  setViewButton,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [checkedSentOverMail, setCheckedSentOverMail] = useState(false);
  const [checkedGenerateAndSchedule, setCheckedGenerateAndSchedule] =
    useState(false);
  const [callFilterOptionApi, setCallFilterOptionApi] = useState({
    skipStateApiCall: true,
    skipSourceApiCall: true,
    skipCounselorApiCall: true,
    skipCourseApiCall: true,
    callUtmMedium: false,
    callTwelveBoard: true,
  });
  const [hideSourceList, setHideSourceList] = useState(false);
  const [sourceList, setSourceList] = useState([]);
  const [selectedSourceList, setSelectedSourceList] = useState([]);
  const [selectedStateList, setSelectedStateList] = useState([]);
  const [selectedCounselorList, setSelectedCounselorList] = useState([]);
  const [selectedLeadType, setSelectedLeadType] = useState("");
  const [selectedApplicationStage, setSelectedApplicationStage] = useState("");
  const [selectedVerificationStatus, setSelectedVerificationStatus] =
    useState("");
  const [selectedLeadStage, setSelectedLeadStage] = useState([]);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState([]);
  const [selectedReportType, setSelectedReportType] = useState("");
  const [selectedReportFormat, setSelectedReportFormat] = useState("");
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [selectedReportPeriod, setSelectedReportPeriod] = useState(null);
  const [selectedReportTriggerBy, setSelectedReportTriggerBy] = useState("");
  const [startAndEndDateGenerate, setStartAndEndDateGenerate] = useState(null);
  const [interval, setIntervalString] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmailId, setRecipientEmailId] = useState("");
  const [recipientEmailIdCC, setRecipientEmailIdCC] = useState("");
  const [periodDateAndTime, setPeriodDateAndTime] = useState([]);
  const [startDateForPeriod,setStartDateForPeriod]=useState(null)
  const [endDateForPeriod,setEndDateForPeriod]=useState(null)
  const { handleFilterListApiCall } = useCommonApiCalls();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [selectedSourceType,setSelectedSourceType]=useState([])
  const [selectedApplicationFillingStage,setSelectedApplicationFillingStage]=useState([])

  const [utmMedium, setUtmMedium] = useState([]);
  const [hideUTMMedium, setHideUTMMedium] = useState(false);
  const [selectedUtmMedium, setSelectedUtmMedium] = useState([]);
  const [selected12thBoard, setSelected12thBoard] = useState([]);
  const [twelveBoardList, setTwelveBoardList] = useState([]);
  const [hideTwelveBoardList, setHideTwelveBoardList] = useState(false);
  const [selected12thMarks, setSelected12thMarks] = useState([]);
  const [selectedFormFillingStage, setSelectedFormFillingStage] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState([]);
  //advance filter
  const [openAdvanceFilter, setOpenAdvanceFilter] = useState(false);
  const [advanceFilterBlocks, setAdvanceFilterBlocks] = useState([]);

  const advFilterLocalStorageKey = `${Cookies.get(
    "userId"
  )}reportSectionAdvanceFilterOptions`;

  const handleAdvanceFilter = () => {
    setOpenAdvanceFilter(false);
  };

  const resetAdvanceFilter = () => {
    localStorage.removeItem(advFilterLocalStorageKey);
  };

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
  }, [callFilterOptionApi.skipSourceApiCall, sourceListInfo]);
  //getting state list
  const [hideStateList, setHideStateList] = useState(false);
  const [stateList, setStateList] = useState([]);

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
  const [counsellorList, setCounsellorList] = useState([]);
  const [hideCounsellorList, setHideCounsellorList] = useState(false);
  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId: collegeId },
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
        organizeCounselorFilterOption
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callFilterOptionApi.skipCounselorApiCall, counselorListApiCallInfo]);

  const { leadStageLabelList, setSkipCallNameAndLabelApi, loadingLabelList } =
    useFetchCommonApi();

  useEffect(() => {
    if (selectedSingleData?.payload?.lead_name?.length > 0) {
      setSkipCallNameAndLabelApi(false);
    }
  }, [selectedSingleData?.payload?.lead_name?.length > 0]);

  const payloadForReportGeneration = {
    request_data: {
      report_type: selectedReportType,
      report_name: reportName,
      format: selectedReportFormat,
      report_details: reportDescription,
      period:
        selectedReportPeriod === "Custom Date & Time" &&
        startDateForPeriod
          ?  convertDatesAndTime(startDateForPeriod,endDateForPeriod)
          : selectedReportPeriod,
      sent_mail: checkedSentOverMail,
      is_auto_schedule: checkedGenerateAndSchedule,
      add_column: [],
    },
    payload: {
      state_code: advanceFilterBlocks?.length > 0 ? [] : selectedStateList,
      city_name: [],
      source_name: advanceFilterBlocks?.length > 0 ? [] : selectedSourceList,
      lead_name: advanceFilterBlocks?.length > 0 ? [] : selectedLeadStage,
      lead_type_name: advanceFilterBlocks?.length > 0 ? "" : selectedLeadType,

      application_filling_stage: selectedApplicationFillingStage?.length>0 && advanceFilterBlocks?.length ==0?selectedApplicationFillingStage:[],
      source_type:selectedSourceType?.length>0 && advanceFilterBlocks?.length ==0?selectedSourceType:[],
      utm_medium:selectedUtmMedium?.length>0&& advanceFilterBlocks?.length ==0?selectedUtmMedium:[],
      twelve_board_name:selected12thBoard?.length>0 && advanceFilterBlocks?.length ==0?selected12thBoard:[],
      twelve_marks_name:selected12thMarks?.length>0 && advanceFilterBlocks?.length ==0?selected12thMarks:[],
      form_filling_stage_name:selectedFormFillingStage?.length>0 && advanceFilterBlocks?.length ==0?selectedFormFillingStage:[],
      course:selectedCourseId?.length>0 && advanceFilterBlocks?.length ==0?selectedCourseId:[],


      counselor_id:
        advanceFilterBlocks?.length > 0 ? [] : selectedCounselorList,
      application_stage_name:
        advanceFilterBlocks?.length > 0 ? "" : selectedApplicationStage,
      is_verify:
        advanceFilterBlocks?.length > 0 ? "" : selectedVerificationStatus,
      payment_status:
        advanceFilterBlocks?.length > 0 ? [] : selectedPaymentStatus,
    },
  };
  if (checkedGenerateAndSchedule) {
    payloadForReportGeneration.request_data.generate_and_reschedule = {
      trigger_by: selectedReportTriggerBy,
      interval: interval,
      date_range: JSON.parse(GetJsonDate(startAndEndDateGenerate)),
      recipient_details: [],
    };
  }
  if (checkedSentOverMail || checkedGenerateAndSchedule) {
    payloadForReportGeneration.request_data.recipient_details = [
      {
        recipient_name: recipientName,
        recipient_email_id: recipientEmailId,
        recipient_cc_mail_id: recipientEmailIdCC,
      },
    ];
  }

  if (advanceFilterBlocks?.length > 0) {
    payloadForReportGeneration.request_data.advance_filter =
      advanceFilterBlocks;
  }
  const resetAll = (dataType) => {
    setSelectedSourceList([]);
    setSelectedStateList([]);
    setSelectedCounselorList([]);
    setSelectedLeadType("");
    setSelectedApplicationStage("");
    setSelectedVerificationStatus("");
    setSelectedLeadStage([]);
    setSelectedPaymentStatus([]);
   if(!dataType){
     setSelectedReportType("");
   }
    setSelectedReportFormat("");
    setReportName("");
    setReportDescription("");
    setSelectedReportPeriod("");
    setSelectedReportTriggerBy("");
    setStartAndEndDateGenerate(null);
    setRecipientName("");
    setIntervalString("");
    setRecipientEmailId("");
    setRecipientEmailIdCC("");
    setCheckedGenerateAndSchedule(false);
    setCheckedSentOverMail(false);
    setSelectedReportPeriod(null);
    if(!dataType){
      setOpenDrawer(false);
    }
    setReportId("");
    setStartDateForPeriod(null);
    setEndDateForPeriod(null);
    setSelectedSourceType([])
    setSelectedApplicationFillingStage([])
    setSelectedUtmMedium([])
    setUtmMedium([])
    setSelected12thBoard([])
    setSelected12thMarks([])
    setSelectedFormFillingStage([])
  };

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [generateReport] = useGenerateReportMutation();
  const [
    somethingWentWrongInInfoReportGenerate,
    setSomethingWentWrongInInfoReportGenerate,
  ] = useState(false);
  const [
    reportGenerateInternalServerError,
    setInfoReportGenerateInternalServerError,
  ] = useState(false);
  const pushNotification = useToasterHook();
  const [loading, setLoading] = useState(false);
  const handleReportGenerateData = (save) => {
    payloadForReportGeneration.request_data.save_template = save;
    setLoading(true);
    generateReport({
      reportId: save ? reportId : "",
      payloadForReportGeneration,
      collegeId: collegeId,
    })
      .unwrap()
      .then((result) => {
        try {
          if (result?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (result?.message) {
            pushNotification("success", result?.message);
            resetAll();
          } else if (result?.detail) {
            pushNotification("error", result?.detail);
          } else {
            throw new Error("Report generate API response has been changed.");
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInInfoReportGenerate,
            "",
            5000
          );
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else if (error?.status === 500) {
          handleInternalServerError(
            setInfoReportGenerateInternalServerError,
            "",
            5000
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (selectedSingleData?.report_name) {
      setReportName(selectedSingleData?.report_name);
    }
    if (!selectedSingleData?.report_name) {
      setReportName("");
    }
    if (selectedSingleData?.sent_mail) {
      setCheckedSentOverMail(selectedSingleData?.sent_mail ? true : false);
    }
    if (!selectedSingleData?.sent_mail) {
      setCheckedSentOverMail(false);
    }
    if (selectedSingleData?.is_auto_schedule) {
      setCheckedGenerateAndSchedule(
        selectedSingleData?.is_auto_schedule ? true : false
      );
    }
    if (!selectedSingleData?.is_auto_schedule) {
      setCheckedGenerateAndSchedule(false);
    }
    if (
      selectedSingleData?.payload?.state_code?.length > 0 ||
      selectedSingleData?.payload?.source_name?.length > 0 ||
      selectedSingleData?.payload?.counselor_id.length > 0 ||
      selectedSingleData?.payload?.utm_medium?.length > 0 ||
      selectedSingleData?.payload?.course?.length > 0 ||
      selectedSingleData?.payload?.twelve_board_name?.length > 0
    ) {
      setCallFilterOptionApi({
        skipStateApiCall:
          selectedSingleData?.payload?.state_code?.length > 0 ? false : true,
        skipSourceApiCall:
          selectedSingleData?.payload?.source_name?.length > 0 ? false : true,
        skipCounselorApiCall:
          selectedSingleData?.payload?.counselor_id.length > 0 ? false : true,
          callUtmMedium:
          selectedSingleData?.payload?.utm_medium?.length > 0 ? true : false,
          skipCourseApiCall:
          selectedSingleData?.payload?.course?.length > 0 ? false : true,
          callTwelveBoard:
          selectedSingleData?.payload?.twelve_board_name?.length > 0 ? false : true,
      });
    }
    if (selectedSingleData?.payload?.source_name?.length > 0) {
      setSelectedSourceList(selectedSingleData?.payload?.source_name);
    }
    if (selectedSingleData?.payload?.source_name?.length === 0) {
      setSelectedSourceList([]);
    }
    if (selectedSingleData?.payload?.state_code?.length > 0) {
      setSelectedStateList(selectedSingleData?.payload?.state_code);
    }
    if (selectedSingleData?.payload?.state_code?.length === 0) {
      setSelectedStateList([]);
    }
    if (selectedSingleData?.payload?.counselor_id.length > 0) {
      setSelectedCounselorList(selectedSingleData?.payload?.counselor_id);
    }
    if (selectedSingleData?.payload?.counselor_id.length === 0) {
      setSelectedCounselorList([]);
    }
    if (selectedSingleData?.payload?.lead_type_name) {
      setSelectedLeadType(selectedSingleData?.payload?.lead_type_name);
    }
    if (!selectedSingleData?.payload?.lead_type_name) {
      setSelectedLeadType("");
    }
    if (selectedSingleData?.payload?.application_stage_name) {
      setSelectedApplicationStage(
        selectedSingleData?.payload?.application_stage_name
      );
    }
    if (!selectedSingleData?.payload?.application_stage_name) {
      setSelectedApplicationStage("");
    }
    if (selectedSingleData?.payload?.is_verify) {
      setSelectedVerificationStatus(selectedSingleData?.payload?.is_verify);
    }
    if (!selectedSingleData?.payload?.is_verify) {
      setSelectedVerificationStatus("");
    }
    if (selectedSingleData?.payload?.lead_name?.length > 0) {
      setSelectedLeadStage(selectedSingleData?.payload?.lead_name);
    }
    if (selectedSingleData?.payload?.lead_name?.length === 0) {
      setSelectedLeadStage([]);
    }
    if (selectedSingleData?.payload?.payment_status?.length > 0) {
      setSelectedPaymentStatus(selectedSingleData?.payload?.payment_status);
    }
    if (selectedSingleData?.payload?.payment_status?.length === 0) {
      setSelectedPaymentStatus([]);
    }
    if (selectedSingleData?.report_type) {
      setSelectedReportType(selectedSingleData?.report_type);
    }
    if (!selectedSingleData?.report_type) {
      setSelectedReportType("");
    }
    if (selectedSingleData?.format) {
      setSelectedReportFormat(selectedSingleData?.format);
    }
    if (!selectedSingleData?.format) {
      setSelectedReportFormat("");
    }
    if (selectedSingleData?.report_details) {
      setReportDescription(selectedSingleData?.report_details);
    }
    if (!selectedSingleData?.report_details) {
      setReportDescription("");
    }
    if (selectedSingleData?.period) {
      setSelectedReportPeriod(
        selectedSingleData?.period &&
          selectedSingleData?.period?.includes("Date Range:")
          ? "Custom Date & Time"
          : selectedSingleData?.period
          ?  selectedSingleData?.period
          : null
      );
    }
    if (!selectedSingleData?.period) {
      setSelectedReportPeriod(null);
      setStartDateForPeriod(null);
      setEndDateForPeriod(null);

    }
    if (selectedSingleData?.trigger_by) {
      setSelectedReportTriggerBy(selectedSingleData?.trigger_by);
    }
    if (!selectedSingleData?.trigger_by) {
      setSelectedReportTriggerBy("");
    }
    if (selectedSingleData?.date_range) {
      if (
        !selectedSingleData?.date_range?.start_date ||
        !selectedSingleData?.date_range?.end_date
      ) {
        setStartAndEndDateGenerate(null);
      } else {
        setStartAndEndDateGenerate([
          new Date(selectedSingleData?.date_range?.start_date),
          new Date(selectedSingleData?.date_range?.end_date),
        ]);
      }
    }
    if (!selectedSingleData?.date_range) {
      setStartAndEndDateGenerate(null);
    }
    if (selectedSingleData?.interval) {
      setIntervalString(selectedSingleData?.interval);
    }
    if (!selectedSingleData?.interval) {
      setIntervalString("");
    }
    if (selectedSingleData?.send_mail_recipients_info?.length > 0) {
      if (selectedSingleData?.send_mail_recipients_info[0]?.recipient_name) {
        setRecipientName(
          selectedSingleData?.send_mail_recipients_info[0]?.recipient_name
        );
      }
      if (
        selectedSingleData?.send_mail_recipients_info[0]?.recipient_email_id
          .length > 0
      ) {
        setRecipientEmailId(
          selectedSingleData?.send_mail_recipients_info[0]?.recipient_email_id
        );
      }

      if (
        selectedSingleData?.send_mail_recipients_info[0]?.recipient_cc_mail_id
          .length > 0
      ) {
        setRecipientEmailIdCC(
          selectedSingleData?.send_mail_recipients_info[0]?.recipient_cc_mail_id
        );
      }
    }
    if (!selectedSingleData?.send_mail_recipients_info) {
      setRecipientName("");
    }
    if (!selectedSingleData?.send_mail_recipients_info) {
      setRecipientEmailId("");
    }
    if (!selectedSingleData?.send_mail_recipients_info) {
      setRecipientEmailIdCC("");
    }

    if (selectedSingleData?.period) {
      if (
        selectedSingleData?.period &&
        selectedSingleData?.period?.includes("Date Range:")
      ) {
        const extractDateRange= extractDateRangeWithString(selectedSingleData?.period)
        setStartDateForPeriod(extractDateRange[0])
        setEndDateForPeriod(extractDateRange[1])
      } else {
        // setPeriodDateAndTime(selectedSingleData?.period);
        setStartDateForPeriod(selectedSingleData?.period[0])
        setEndDateForPeriod(selectedSingleData?.period[1])
      }
    }
    if (!selectedSingleData?.period) {
      setStartDateForPeriod(null);
      setEndDateForPeriod(null);
    }
    //set advance filter Blocks for template and preview report
    if (selectedSingleData?.advance_filter?.length > 0) {
      setAdvanceFilterBlocks(selectedSingleData?.advance_filter);
      localStorage.setItem(
        advFilterLocalStorageKey,
        JSON.stringify(selectedSingleData?.advance_filter)
      );
    }
    if (selectedSingleData?.payload?.utm_medium?.length > 0) {
      setSelectedUtmMedium(selectedSingleData?.payload?.utm_medium);
    }
    if (selectedSingleData?.payload?.utm_medium?.length === 0) {
      setSelectedUtmMedium([]);
    }
    if (selectedSingleData?.payload?.source_type?.length > 0) {
      setSelectedSourceType(selectedSingleData?.payload?.source_type);
    }
    if (selectedSingleData?.payload?.source_type?.length === 0) {
      setSelectedSourceType([]);
    }
    if (selectedSingleData?.payload?.course?.length > 0) {
      setSelectedCourseId(selectedSingleData?.payload?.course);
    }
    if (selectedSingleData?.payload?.course?.length === 0) {
      setSelectedCourseId([]);
    }
    if (selectedSingleData?.payload?.application_filling_stage?.length > 0) {
      setSelectedApplicationFillingStage(selectedSingleData?.payload?.application_filling_stage);
    }
    if (selectedSingleData?.payload?.application_filling_stage?.length === 0) {
      setSelectedApplicationFillingStage([]);
    }
    if (selectedSingleData?.payload?.twelve_marks_name?.length > 0) {
      setSelected12thMarks(selectedSingleData?.payload?.twelve_marks_name);
    }
    if (selectedSingleData?.payload?.twelve_marks_name?.length === 0) {
      setSelected12thMarks([]);
    }
    if (selectedSingleData?.payload?.form_filling_stage_name?.length > 0) {
      setSelectedFormFillingStage(selectedSingleData?.payload?.form_filling_stage_name);
    }
    if (selectedSingleData?.payload?.form_filling_stage_name?.length === 0) {
      setSelectedFormFillingStage([]);
    }
    if (selectedSingleData?.payload?.twelve_board_name?.length > 0) {
      setSelected12thBoard(selectedSingleData?.payload?.twelve_board_name);
    }
    if (selectedSingleData?.payload?.twelve_board_name?.length === 0) {
      setSelected12thBoard([]);
    }
  }, [selectedSingleData,openDrawer]);
const [disabledButton, setDisabledButton]=useState(false);
useEffect(()=>{
  if((selectedReportType && reportName) ||
    (reportTemplateCount === 12 && !reportId)){
      setDisabledButton(true)
      if(selectedReportPeriod === "Custom Date & Time" && startDateForPeriod){
        setDisabledButton(true)
      }
      else if(selectedReportPeriod === "Custom Date & Time" && !startDateForPeriod){
        setDisabledButton(false)
      }
    }else{
      setDisabledButton(false)
    }
},[selectedReportType,reportTemplateCount,reportName,selectedReportPeriod,startDateForPeriod])
 const [hideCourseList, setHideCourseList] = useState(false);
 const [courseDetails, setCourseDetails] = useState([]);
 
 //get course list
 const courseListInfo = useGetAllCourseListQuery(
   { collegeId: collegeId },
   { skip: callFilterOptionApi?.skipCourseApiCall}
 );
 useEffect(() => {
   if (!callFilterOptionApi?.skipCourseApiCall) {
     const courseList = courseListInfo?.data?.data[0];
     handleFilterListApiCall(
       courseList,
       courseListInfo,
       setCourseDetails,
       setHideCourseList,
       organizeCourseFilterCourseIdOption
      //  organizeCourseFilterCourseNameOption
     );
   }
   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [courseListInfo, callFilterOptionApi?.skipCourseApiCall]);
 //loading filter options
 const [loadingFilterOptions, setLoadingFilterOptions] = useState({
  stateData: false,
  sourceData: false,
  counselorData: false,
  courseData: false,
  interBoardData: false,
});
 // filter option api calling state
  const fetchUtmMediumData = useFetchUTMMedium();
   // getting the UTM Medium list
   useEffect(() => {
    if (callFilterOptionApi.callUtmMedium) {
      fetchUtmMediumData(
        selectedSourceList,
        setHideUTMMedium,
        setLoadingFilterOptions,
        setSomethingWentWrongInInfoReportGenerate,
        setInfoReportGenerateInternalServerError,
        setUtmMedium
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callFilterOptionApi.callUtmMedium,selectedSourceList]);
  // getting inter board list
  const { data, isSuccess, isFetching, error, isError } =useGetAllTwelveBoardListQuery({ collegeId: collegeId },
    { skip: callFilterOptionApi?.callTwelveBoard})
    
    useEffect(()=>{
      if(!callFilterOptionApi.callTwelveBoard){
        try {
          if (isSuccess) {
            if (Array.isArray(data?.data[0])) {
                            const interBoardList =
                  data?.data[0]?.[0]?.inter_board_name?.map((item) => {
                    return { label: item, value: item };
                  });
                setTwelveBoardList(interBoardList);
            } else {
              throw new Error("get all Twelve board API response has changed");
            }
          }
          if (isError) {
            setTwelveBoardList([]);
            if (error?.data?.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (error?.data?.detail) {
              pushNotification("error", error?.data?.detail);
            }
            if (error?.status === 500) {
              handleInternalServerError(
                setAllApplicationInternalServerError,
                "",
                10000
              );
            }
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInAllApplication,
            "",
            10000
          );
        }
      }
    },[
      callFilterOptionApi.callTwelveBoard,  
      isSuccess,
      data?.data,
      error,
      isError,
      error?.data?.detail,
      error?.status
    ])
  return (
    <Drawer
      disableEnforceFocus={true}
      PaperProps={{
        sx: {
          width: fullScreen ? "100%" : "60%",
        },
      }}
      open={openDrawer}
      onClose={() => {
        setOpenDrawer(false);
        setReportId("");
        resetAdvanceFilter();
        setViewButton(false);
      }}
      anchor="right"
    >
      {reportGenerateInternalServerError ||
      somethingWentWrongInInfoReportGenerate ? (
        <>
          {reportGenerateInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInInfoReportGenerate && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </>
      ) : (
        <Box sx={{ px: 4, py: 3 }}>
          <Box className="report-create-header">
            <Typography>{title}</Typography>
            <IconButton
              onClick={() => {
                setOpenDrawer(false);
                setReportId("");
                resetAdvanceFilter();
                setViewButton(false);
              }}
            >
              <CloseOutlined />
            </IconButton>
          </Box>
          {loading && (
            <Box sx={{ display: "grid", placeItems: "center" }}>
              <CircularProgress color="info" />
            </Box>
          )}
          <Box className="report-create-details">
            <Box sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item md={4} sm={12} xs={12}>
                  <SelectPicker
                    onChange={(value) => {
                      setSelectedReportType(value);
                      resetAll(true)
                    }}
                    data={reportTypes}
                    placeholder="Select Data Type *"
                    value={selectedReportType}
                    className="select-picker"
                    style={{ width: "100%" }}
                    readOnly={readOnlyToggle ? true : false}
                  />
                  {selectedReportType && (
                    <BorderLineText
                      text={"Select Data Type *"}
                      width={100}
                    ></BorderLineText>
                  )}
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <Input
                    onChange={(event) => {
                      setReportName(event);
                    }}
                    style={{ height: "38px !important" }}
                    value={reportName}
                    placeholder="Report Name*"
                    className="select-picker input-field-height-report"
                    readOnly={readOnlyToggle ? true : false}
                  />
                  {reportName && (
                    <BorderLineText
                      text={"Report Name*"}
                      width={70}
                    ></BorderLineText>
                  )}
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <SelectPicker
                    onChange={(value) => {
                      setSelectedReportFormat(value);
                    }}
                    data={reportFormat}
                    placeholder="Select Format"
                    value={selectedReportFormat}
                    className="select-picker"
                    style={{ width: "100%" }}
                    readOnly={readOnlyToggle ? true : false}
                  />
                  {selectedReportFormat && (
                    <BorderLineText
                      text={"Select Format"}
                      width={70}
                    ></BorderLineText>
                  )}
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Input
                    onChange={(event) => {
                      setReportDescription(event);
                    }}
                    value={reportDescription}
                    placeholder="Report Description"
                    className="select-picker input-field-height-report"
                    readOnly={readOnlyToggle ? true : false}
                  />
                  {reportDescription && (
                    <BorderLineText
                      text={"Report Description"}
                      width={90}
                    ></BorderLineText>
                  )}
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <Box>
              <Grid container spacing={2}>
                {
                  selectedReportType?.toLowerCase() ==="payments" || selectedReportType?.toLowerCase() ==="applications" || selectedReportType?.toLowerCase() ==="forms"
                  ?
                <Grid item md={3} sm={12} xs={12}>
                  {hideCounsellorList || (
                    <MultipleSelectOptions
                      columnOption={counsellorList}
                      multiCascaderDefaultValue={selectedCounselorList}
                      setMultiCascaderDefaultValue={setSelectedCounselorList}
                      loading={counselorListApiCallInfo.isFetching}
                      placeholder="Counselor"
                      style={{ width: "100%" }}
                      onOpen={() =>
                        setCallFilterOptionApi((prev) => ({
                          ...prev,
                          skipCounselorApiCall: false,
                        }))
                      }
                      readOnly={readOnlyToggle ? true : false}
                      from="reportSection"
                    />
                  )}
                </Grid>
                :""
                }
                <Grid item md={3} sm={12} xs={12}>
                  {hideStateList || (
                    <MultipleSelectOptions
                      columnOption={stateList}
                      multiCascaderDefaultValue={selectedStateList}
                      setMultiCascaderDefaultValue={setSelectedStateList}
                      loading={stateListInfo.isFetching}
                      placeholder="State"
                      style={{ width: "100%" }}
                      onOpen={() =>
                        setCallFilterOptionApi((prev) => ({
                          ...prev,
                          skipStateApiCall: false,
                        }))
                      }
                      readOnly={readOnlyToggle ? true : false}
                      from="reportSection"
                    />
                  )}
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FilterSelectPicker
                    handleFilterOption={(value) => setSelectedLeadType(value)}
                    setSelectedPicker={setSelectedLeadType}
                    pickerData={leadType}
                    placeholder="Lead type"
                    pickerValue={selectedLeadType}
                    style={{ width: "100%" }}
                    readOnly={readOnlyToggle ? true : false}
                    from="reportSection"
                  />
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  {hideSourceList || (
                    <MultipleSelectOptions
                      columnOption={sourceList}
                      multiCascaderDefaultValue={selectedSourceList}
                      placeholder="Source"
                      style={{ width: "100%" }}
                      setMultiCascaderDefaultValue={setSelectedSourceList}
                      loading={sourceListInfo.isFetching}
                      onOpen={() =>
                        setCallFilterOptionApi((prev) => ({
                          ...prev,
                          skipSourceApiCall: false,
                        }))
                      }
                      readOnly={readOnlyToggle ? true : false}
                      from="reportSection"
                    />
                  )}
                </Grid>
                {(selectedSourceList?.length > 0 && selectedReportType?.toLowerCase() !=="leads") && !hideUTMMedium && (
                <Grid item md={3} sm={12} xs={12}>
              <MultipleFilterSelectPicker
                className="select-picker"
                style={{ width: "100%" }}
                onChange={(value) => {
                  setSelectedUtmMedium(value);
                }}
                setSelectedPicker={setSelectedUtmMedium}
                pickerData={utmMedium}
                placeholder="UTM Medium"
                pickerValue={selectedUtmMedium}
                loading={loadingFilterOptions.utmMediumData}
                groupBy="role"
                onOpen={() =>
                  setCallFilterOptionApi((prev) => ({
                    ...prev,
                    callUtmMedium: prev.callUtmMedium ? false : true,
                  }))
                }
                from="paidApplications"
                readOnly={readOnlyToggle ? true : false}
              />
                </Grid>
            )}
            {
(selectedReportType?.toLowerCase() ==="applications"||selectedReportType?.toLowerCase() ==="forms") &&
                <Grid item md={3} sm={12} xs={12}>
                  <MultipleSelectOptions
                    columnOption={leadStageLabelList}
                    multiCascaderDefaultValue={selectedLeadStage}
                    setMultiCascaderDefaultValue={setSelectedLeadStage}
                    placeholder="Lead Stage"
                    style={{ width: "100%" }}
                    onOpen={() => setSkipCallNameAndLabelApi(false)}
                    loading={loadingLabelList}
                    readOnly={readOnlyToggle ? true : false}
                    from="reportSection"
                  />
                </Grid>
            }
                {
                  (selectedReportType?.toLowerCase() ==="applications"||selectedReportType?.toLowerCase() ==="forms")
                  &&
                <Grid item md={3} sm={12} xs={12}>
                  <MultipleSelectOptions
                    columnOption={paymentStatusList}
                    multiCascaderDefaultValue={selectedPaymentStatus}
                    setMultiCascaderDefaultValue={setSelectedPaymentStatus}
                    placeholder="Payment Status"
                    style={{ width: "100%" }}
                    readOnly={readOnlyToggle ? true : false}
                    from="reportSection"
                  />
                </Grid>
                }
                {
                  selectedReportType?.toLowerCase() ==="leads" || selectedReportType?.toLowerCase() ==="applications" || selectedReportType?.toLowerCase() ==="forms"
                  ?
                <Grid item md={3} sm={12} xs={12}>
                  <SelectPicker
                    onChange={(value) => {
                      setSelectedVerificationStatus(value);

                      //add report regular filter with advance filter
                      addFilterOptionToCookies(
                        "reportSection",
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
                    style={{ width: "100%" }}
                    readOnly={readOnlyToggle ? true : false}
                  />
                </Grid>
                :""
                }
                {
                  selectedReportType?.toLowerCase() ==="payments" || selectedReportType?.toLowerCase() ==="applications" || selectedReportType?.toLowerCase() ==="forms"
                  ?
                <Grid item md={3} sm={12} xs={12}>
                  <FilterSelectPicker
                    handleFilterOption={(value) =>
                      setSelectedApplicationStage(value)
                    }
                    filterOptionParams={[
                      "application_stage",
                      "application_stage_name",
                      { application_stage: {} },
                    ]}
                    setSelectedPicker={setSelectedApplicationStage}
                    pickerData={applicationStage}
                    placeholder="Application stage"
                    pickerValue={selectedApplicationStage}
                    style={{ width: "100%" }}
                    readOnly={readOnlyToggle ? true : false}
                    from="reportSection"
                  />
                </Grid>
                :""
                }
                {
                  selectedReportType?.toLowerCase() ==="leads" || selectedReportType?.toLowerCase() ==="applications" || selectedReportType?.toLowerCase() ==="forms"
                  ?
                <Grid item md={3} sm={12} xs={12}>
                <MultipleSelectOptions
                    columnOption={listOfSourcesType}
                    multiCascaderDefaultValue={selectedSourceType}
                    setMultiCascaderDefaultValue={setSelectedSourceType}
                    placeholder="Source Type"
                    style={{ width: "100%" }}
                    readOnly={readOnlyToggle ? true : false}
                    from="reportSection"
                  />
                </Grid>
                :""
                }
                {
                  selectedReportType?.toLowerCase() ==="payments" || selectedReportType?.toLowerCase() ==="applications" || selectedReportType?.toLowerCase() ==="forms"
                  ?
                  <>
                <Grid item md={3} sm={12} xs={12}>
                {hideCourseList || (
              <MultipleFilterSelectPicker
                style={{ width: "100%" }}
                placement="bottomEnd"
                placeholder="Course"
                onChange={(value) => {
                  setSelectedCourseId(value);
                }}
                pickerData={courseDetails}
                setSelectedPicker={setSelectedCourseId}
                pickerValue={selectedCourseId}
                loading={courseListInfo.isFetching}
                onOpen={() =>
                  setCallFilterOptionApi((prev) => ({
                    ...prev,
                    skipCourseApiCall: false,
                  }))
                }
                maxHeight={170}
              />
            )}
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                <MultipleSelectOptions
                    columnOption={formStageList}
                    multiCascaderDefaultValue={selectedApplicationFillingStage}
                    setMultiCascaderDefaultValue={setSelectedApplicationFillingStage}
                    placeholder="Application Filling Stage"
                    style={{ width: "100%" }}
                    readOnly={readOnlyToggle ? true : false}
                    from="reportSection"
                  />
                </Grid>
                  </>
                  :""
                }
                {
                   selectedReportType?.toLowerCase() ==="payments" &&
                   <>
                <Grid item md={3} sm={12} xs={12}>
                {hideTwelveBoardList || (
              <MultipleFilterSelectPicker
              style={{ width: "100%" }}
                className="select-picker"
                filterOptionParams={[
                  "twelve_board",
                  "twelve_board_name",
                  { twelve_board: {} },
                ]}
                setSelectedPicker={setSelected12thBoard}
                pickerData={twelveBoardList}
                placeholder="12th Board"
                pickerValue={selected12thBoard}
                loading={isFetching}
                onOpen={() =>
                  setCallFilterOptionApi((prev) => ({
                    ...prev,
                    callTwelveBoard: false,
                  }))
                }
                from="paidApplications"
                placement={"left"}
                readOnly={readOnlyToggle ? true : false}
              />
            )}
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                <MultipleFilterSelectPicker
                style={{ width: "100%" }}
              className="select-picker"
              filterOptionParams={[
                "twelve_marks",
                "twelve_marks_name",
                { twelve_marks: {} },
              ]}
              setSelectedPicker={setSelected12thMarks}
              pickerData={twelveMarksList}
              placeholder="12th Marks"
              pickerValue={selected12thMarks}
              from="paidApplications"
              maxHeight={120}
              readOnly={readOnlyToggle ? true : false}
            />
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                <MultipleFilterSelectPicker
                style={{ width: "100%" }}
              className="select-picker"
              filterOptionParams={[
                "form_filling_stage",
                "form_filling_stage_name",
                { form_filling_stage: {} },
              ]}
              setSelectedPicker={setSelectedFormFillingStage}
              pickerData={formFillingStages}
              placeholder="Form Filling Stage"
              pickerValue={selectedFormFillingStage}
              from="paidApplications"
              readOnly={readOnlyToggle ? true : false}
            />
                </Grid>
                   </>
                }
                <Grid item md={3} sm={12} xs={12}>
                  <Box>
                    <AdvanceFilterButton
                      setOpenAdvanceFilter={setOpenAdvanceFilter}
                      setAdvanceFilterBlocks={setAdvanceFilterBlocks}
                      selectedReport={selectedSingleData}
                      advFilterLocalStorageKey={advFilterLocalStorageKey}
                    />
                    {openAdvanceFilter && (
                      <AdvanceFilterDrawer
                        openAdvanceFilter={openAdvanceFilter}
                        setOpenAdvanceFilter={setOpenAdvanceFilter}
                        regularFilter={advFilterLocalStorageKey}
                        advanceFilterBlocks={advanceFilterBlocks}
                        setAdvanceFilterBlocks={setAdvanceFilterBlocks}
                        handleApplyFilters={handleAdvanceFilter}
                        preview={readOnlyToggle}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
            {/* <Divider />
          <Box>
            <button className="report-add-column-button">
              <AddIcon /> Add Column
            </button>
          </Box>
          <Divider /> */}
            <Box>
              <Grid container spacing={2}>
                <Grid item md={3} sm={12} xs={12}>
                  <SelectPicker
                    data={reportPeriod}
                    placeholder="Select Period"
                    style={{ width: "100%" }}
                    placement="auto"
                    onChange={(value) => {
                      setSelectedReportPeriod(value);
                      if(selectedReportPeriod !== "Custom Date & Time"){
                        setStartDateForPeriod(null)
                        setEndDateForPeriod(null)
                      }
                    }}
                    className="select-picker"
                    value={selectedReportPeriod}
                    readOnly={readOnlyToggle ? true : false}
                    menuMaxHeight={425}
                    searchable={false}
                  />
                </Grid>
                {selectedReportPeriod === "Custom Date & Time" && (
                  <>
                  <Grid item md={3} sm={12} xs={12}>
                      <DatePicker 
                      format="dd/MM/yyyy hh:mm aa" 
                      showMeridian
                      className="select-picker"
                      placement="auto"
                      style={{ width: "100%" }}
                      placeholder="Start Date"
                      onChange={(value) => setStartDateForPeriod(value)}
                      value={startDateForPeriod }
                      readOnly={readOnlyToggle ? true : false}
                      />
                    
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                  
                      <DatePicker 
                       format="dd/MM/yyyy hh:mm aa" 
                       showMeridian
                      className="select-picker"
                      placement="auto"
                      style={{ width: "100%" }}
                      placeholder="End Date"
                      onChange={(value) => setEndDateForPeriod(value)}
                      value={
                        endDateForPeriod
                      }
                      readOnly={readOnlyToggle ? true : false}
                      />
                    
                  </Grid>
                  </>
                )}
              </Grid>
              <Box sx={{ mt: 1.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "30px",
                    flexWrap: "wrap",
                  }}
                >
                  <Box className="sent-it-over-mail-confirmation">
                    <Checkbox
                      onChange={(e) => {
                        setCheckedSentOverMail(e.target.checked);
                        setCheckedGenerateAndSchedule(false);
                      }}
                      sx={{ p: 0 }}
                      color="info"
                      checked={checkedSentOverMail}
                      disabled={readOnlyToggle ? true : false}
                    />{" "}
                    <Typography>Send it over Mail too?</Typography>
                  </Box>
                  <Box className="sent-it-over-mail-confirmation">
                    <Checkbox
                      onChange={(e) => {
                        setCheckedGenerateAndSchedule(e.target.checked);
                        setCheckedSentOverMail(false);
                      }}
                      sx={{ p: 0 }}
                      color="info"
                      checked={checkedGenerateAndSchedule}
                      disabled={readOnlyToggle ? true : false}
                    />{" "}
                    <Typography>Generate and Schedule</Typography>
                  </Box>
                </Box>
                {checkedGenerateAndSchedule && (
                  <Box sx={{ mt: 1.5 }}>
                    <Grid sx={{ pt: 1 }} container spacing={2}>
                      <Grid item md={4} sm={12} xs={12}>
                        <SelectPicker
                          data={triggerByList}
                          placeholder="Trigger by"
                          style={{ width: "100%" }}
                          placement="auto"
                          value={selectedReportTriggerBy}
                          onChange={(value) => {
                            setSelectedReportTriggerBy(value);
                          }}
                          className="select-picker"
                          readOnly={readOnlyToggle ? true : false}
                        />
                      </Grid>
                      <Grid item md={4} sm={12} xs={12}>
                        <InputNumber
                          size="md"
                          placeholder="Interval"
                          className="select-picker"
                          value={interval}
                          onChange={(value) => {
                            setIntervalString(value);
                          }}
                          readOnly={readOnlyToggle ? true : false}
                        />
                      </Grid>
                      <Grid item md={4} sm={12} xs={12}>
                        <DateRangePicker
                          style={{ width: "100%" }}
                          placeholder="Start & End Date"
                          value={startAndEndDateGenerate}
                          onChange={(value) => {
                            setStartAndEndDateGenerate(value);
                          }}
                          className="select-picker"
                          placement="auto"
                          readOnly={readOnlyToggle ? true : false}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {(checkedSentOverMail || checkedGenerateAndSchedule) && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                      Select Recipient Details
                    </Typography>
                    <Grid sx={{ pt: 1 }} container spacing={2}>
                      <Grid item md={4} sm={12} xs={12}>
                        <Input
                          onChange={(e) => {
                            setRecipientName(e);
                          }}
                          value={recipientName}
                          placeholder="Enter The Recipient Name"
                          className="select-picker input-field-height-report"
                          readOnly={readOnlyToggle ? true : false}
                        />
                        {recipientName && (
                          <BorderLineText
                            text={"Enter The Recipient Name"}
                            width={120}
                          ></BorderLineText>
                        )}
                      </Grid>
                      <Grid item md={4} sm={12} xs={12}>
                        <Input
                          onChange={(e) => {
                            setRecipientEmailId(e);
                          }}
                          value={recipientEmailId}
                          placeholder="Enter The Recipient Email Id"
                          className="select-picker input-field-height-report"
                          readOnly={readOnlyToggle ? true : false}
                        />
                        {recipientEmailId && (
                          <BorderLineText
                            text={"Enter The Recipient Email Id"}
                            width={140}
                          ></BorderLineText>
                        )}
                      </Grid>
                      <Grid item md={4} sm={12} xs={12}>
                        <Input
                          onChange={(event) => {
                            setRecipientEmailIdCC(event);
                          }}
                          value={recipientEmailIdCC}
                          placeholder='Enter "CC" Mail IDs separated by ","'
                          className="select-picker input-field-height-report"
                          readOnly={readOnlyToggle ? true : false}
                        />
                        {recipientEmailIdCC && (
                          <BorderLineText
                            text={'Enter "CC" Mail IDs separated by ","'}
                            width={170}
                          ></BorderLineText>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </Box>
            {title !== "Preview Report" && (
              <Box className="report-generate-buttons">
                <Button
                  sx={{ color: "#008BE2" }}
                  className={
                    !disabledButton
                      ? "common-outlined-button-disabled"
                      : "common-outlined-button"
                  }
                  onClick={() => handleReportGenerateData(true)}
                  disabled={
                    !disabledButton
                  }
                >
                  Save Report
                </Button>
                {!viewButton && (
                  <Button
                    className={
                      !disabledButton
                        ? "generate-contained-button-disabled"
                        : "common-contained-button"
                    }
                    onClick={() => handleReportGenerateData(false)}
                    disabled={
                      !disabledButton
                    }
                  >
                    {checkedGenerateAndSchedule
                      ? "Generate & Schedule Report"
                      : "Generate Report"}
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Drawer>
  );
}

export default ReportCreateDrawer;
