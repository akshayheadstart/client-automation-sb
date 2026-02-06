import { Box } from "@mui/system";
import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  applicationStage,
  ApplicationVerificationStatus,
  filterValueAndApiCallKeys,
  formFillingStages,
  formStageList,
  leadType,
  reportPaymentFilter,
  twelveMarksList,
} from "../../../constants/LeadStageList";
import { reportFilterExceptionHandling } from "../../../helperFunctions/reportFilterExceptionHandling";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import useToasterHook from "../../../hooks/useToasterHook";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import FilterSelectPicker from "../../shared/filters/FilterSelectPicker";
import MultipleSelectOptions from "./MultipleSelectOptions";
import { useGetCounselorListQuery } from "../../../Redux/Slices/applicationDataApiSlice";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";
import {
  useGetAllCourseListQuery,
  useGetAllSourceListQuery,
  useGetAllStateListQuery,
} from "../../../Redux/Slices/filterDataSlice";
import {
  organizeCounselorFilterOption,
  organizeCourseFilterOption,
  organizeSourceFilterOption,
} from "../../../helperFunctions/filterHelperFunction";
import { useSelector } from "react-redux";
import { useLeadStageLabel } from "../../../hooks/useLeadStageLabel";
import useFetchCommonApi from "../../../hooks/useFetchCommonApi";
import { customFetch } from "../../../pages/StudentTotalQueries/helperFunction";

const ReportFilter = ({
  reportType,
  selectedFilters,
  from,
  type,
  showLeadRelatedFilters,
}) => {
  const [hideCounsellorList, setHideCounsellorList] = useState(false);
  const [hideStateList, setHideStateList] = useState(false);
  const [hideCourseList, setHideCourseList] = useState(false);
  const [hideSourceList, setHideSourceList] = useState(false);
  const [hideTwelveBoardList, setHideTwelveBoardList] = useState(false);
  const [sourceList, setSourceList] = useState([]);
  const [counsellorList, setCounsellorList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [listOfCourses, setListOfCourses] = useState([]);
  const [twelveBoardList, setTwelveBoardList] = useState([]);
  const [leadStageLabelArray, setLeadStageLabelArray] = useState([]);
  const [shouldShowLeadStageLabel, setShouldShowLeadStageLabel] =
    useState(false);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  // filter loader
  const [loadingFilterOption, setLoadingFilterOption] = useState({
    loadingBoard: false,
  });

  // call filter api
  const [callFilterOptionApi, setCallFilterOptionApi] = useState({
    skipStateApiCall: true,
    skipSourceApiCall: true,
    skipCounselorApiCall: true,
    skipCourseApiCall: true,
    skipCallBoard: true,
  });

  useEffect(() => {
    /**
     in this loop, we are setting the skip api call states false if the selected states length are found
     For Example : if the selected states is found, the state list api will get called to show the selected states in the input value.
     */

    filterValueAndApiCallKeys.forEach((stateDetails) => {
      if (selectedFilters[stateDetails.stateValue]?.length) {
        const skipState = {};
        skipState[stateDetails?.skipApiCall] = false;
        setCallFilterOptionApi((prev) => ({ ...prev, ...skipState }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedFilters?.selectedState,
    selectedFilters?.selectedSource,
    selectedFilters?.selectedCounselor,
    selectedFilters?.selectedCourse,
    selectedFilters?.selectedTwelveBoard,
  ]);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const {
    leadStageLabelList,
    leadStageObject,
    setSkipCallNameAndLabelApi,
    loadingLabelList,
  } = useFetchCommonApi();

  const pushNotification = useToasterHook();

  const { handleFilterListApiCall } = useCommonApiCalls();
  const sourceListInfo = useGetAllSourceListQuery(
    { collegeId: collegeId },
    { skip: callFilterOptionApi.skipSourceApiCall }
  );

  useEffect(() => {
    setShouldShowLeadStageLabel(
      selectedFilters.selectedLeadStageLabel?.some(
        (label) => leadStageObject[label]?.length > 0
      )
    );
    // eslint-disable-next-line no-use-before-define
  }, [selectedFilters.selectedLeadStageLabel, leadStageObject]);

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
    { isHoliday: false, collegeId: collegeId },
    { skip: callFilterOptionApi.skipCounselorApiCall }
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

  //getting state list
  const stateListInfo = useGetAllStateListQuery(undefined, {
    skip: callFilterOptionApi.skipStateApiCall,
  });

  useEffect(() => {
    if (!callFilterOptionApi.skipStateApiCall) {
      const stateList = stateListInfo.data;

      const modifyFilterOptions = (data) => {
        const listOfModifiedData = data.map((item) => ({
          label: item.name,
          value: item.iso2,
        }));
        localStorage.setItem("stateList", JSON.stringify(listOfModifiedData));
        return listOfModifiedData;
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

  // get course list
  const courseListInfo = useGetAllCourseListQuery(
    { collegeId: collegeId },
    { skip: callFilterOptionApi.skipCourseApiCall }
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

  const leadStageLabel = useLeadStageLabel();

  useEffect(() => {
    leadStageLabel(
      leadStageObject,
      selectedFilters.selectedLeadStage,
      setLeadStageLabelArray
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters.selectedLeadStage, leadStageObject]);

  // getting inter board list
  useEffect(() => {
    if (!callFilterOptionApi.skipCallBoard) {
      setLoadingFilterOption((prev) => ({ ...prev, loadingBoard: true }));
      customFetch(
        `${import.meta.env.VITE_API_BASE_URL}/student_user_crud/board_detail/${
          collegeId ? "?college_id=" + collegeId : ""
        }`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data?.detail) {
            pushNotification("error", data?.detail);
          } else if (data?.data[0]?.length) {
            try {
              if (Array.isArray(data?.data[0])) {
                const interBoardList =
                  data?.data[0]?.[0]?.inter_board_name?.map((item) => {
                    return { label: item, value: item };
                  });
                setTwelveBoardList(interBoardList);
              } else {
                throw new Error(
                  "In student board details API response has changed"
                );
              }
            } catch (error) {
              setHideTwelveBoardList(true);
              setApiResponseChangeMessage(error);
              reportFilterExceptionHandling(
                selectedFilters?.setSomethingWentWrongInReportFilter
              );
            }
          }
        })
        .catch(() => {
          setHideTwelveBoardList(true);
          reportFilterExceptionHandling(
            selectedFilters?.setInternalServerErrorInReportFilter
          );
        })
        .finally(() =>
          setLoadingFilterOption((prev) => ({ ...prev, loadingBoard: false }))
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callFilterOptionApi.skipCallBoard]);

  const paymentFilterOption = () => {
    return (
      <>
        {!showLeadRelatedFilters && (
          <MultipleSelectOptions
            readOnly={type === "Preview" ? true : false}
            columnOption={reportPaymentFilter}
            multiCascaderDefaultValue={selectedFilters.selectedPaymentStatus}
            placeholder="Payment Status"
            setMultiCascaderDefaultValue={
              selectedFilters.setSelectedPaymentStatus
            }
            from="createDataSegment"
          />
        )}
      </>
    );
  };
  const sourceFilterOption = () => {
    return (
      <>
        {" "}
        {hideSourceList || (
          <MultipleSelectOptions
            readOnly={type === "Preview" ? true : false}
            columnOption={sourceList}
            multiCascaderDefaultValue={selectedFilters.selectedSource}
            placeholder="Source"
            setMultiCascaderDefaultValue={selectedFilters.setSelectedSource}
            loading={sourceListInfo.isFetching}
            onOpen={() =>
              setCallFilterOptionApi((prev) => ({
                ...prev,
                skipSourceApiCall: false,
              }))
            }
            from="createDataSegment"
          />
        )}
      </>
    );
  };
  const counsellorFilterOption = () => {
    return (
      <>
        {" "}
        {hideCounsellorList || (
          <MultipleSelectOptions
            readOnly={type === "Preview" ? true : false}
            columnOption={counsellorList}
            multiCascaderDefaultValue={selectedFilters.selectedCounselor}
            placeholder="Counselor"
            setMultiCascaderDefaultValue={selectedFilters.setSelectedCounselor}
            loading={counselorListApiCallInfo.isFetching}
            onOpen={() =>
              setCallFilterOptionApi((prev) => ({
                ...prev,
                skipCounselorApiCall: false,
              }))
            }
            from="createDataSegment"
          />
        )}
        {((reportType !== "Application" && from === "data-segment") ||
          reportType === "Applications" ||
          reportType === "Leads" ||
          reportType === "Lead" ||
          (reportType === "Application" && from === "Campaign")) && (
          <>
            <MultipleSelectOptions
              readOnly={type === "Preview" ? true : false}
              setMultiCascaderDefaultValue={
                selectedFilters.setSelectedLeadStage
              }
              columnOption={leadStageLabelList}
              placeholder="Lead Stage"
              multiCascaderDefaultValue={selectedFilters.selectedLeadStage}
              setSelectedLeadStageLabel={
                selectedFilters.setSelectedLeadStageLabel
              }
              onOpen={() => setSkipCallNameAndLabelApi(false)}
              loading={loadingLabelList}
              from="createDataSegment"
            />

            {shouldShowLeadStageLabel && (
              <MultipleSelectOptions
                readOnly={type === "Preview" ? true : false}
                columnOption={leadStageLabelArray}
                multiCascaderDefaultValue={
                  selectedFilters.selectedLeadStageLabel
                }
                placeholder="Lead Stage Label"
                setMultiCascaderDefaultValue={
                  selectedFilters.setSelectedLeadStageLabel
                }
                groupBy="role"
                from="createDataSegment"
              />
            )}
          </>
        )}
        <FilterSelectPicker
          readOnly={type === "Preview" ? true : false}
          setSelectedPicker={selectedFilters.setSelectedApplicationStage}
          pickerData={applicationStage}
          placeholder="Application Stage"
          pickerValue={selectedFilters.selectedApplicationStage}
          from="createDataSegment"
        />
      </>
    );
  };

  return selectedFilters?.somethingWentWrongInReportFilter ||
    selectedFilters?.internalServerErrorInReportFilter ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        minHeight: "55vh",
        alignItems: "center",
      }}
    >
      {selectedFilters?.internalServerErrorInReportFilter && (
        <Error500Animation height={400} width={400} />
      )}
      {selectedFilters?.somethingWentWrongInReportFilter && (
        <ErrorFallback
          error={apiResponseChangeMessage}
          resetErrorBoundary={() => window.location.reload()}
        />
      )}
    </Box>
  ) : (
    <Box
      className={
        from === "data-segment" ? "data-segment-filters-box" : "reportFilter"
      }
    >
      {(reportType === "Applications" ||
        reportType === "Leads" ||
        reportType === "Lead" ||
        reportType === "Raw Data" ||
        reportType === "Application") && (
        <>
          {hideStateList || (
            <MultipleSelectOptions
              readOnly={type === "Preview" ? true : false}
              columnOption={stateList}
              multiCascaderDefaultValue={selectedFilters.selectedState}
              placeholder="State"
              setMultiCascaderDefaultValue={selectedFilters.setSelectedState}
              loading={stateListInfo.isFetching}
              onOpen={() =>
                setCallFilterOptionApi((prev) => ({
                  ...prev,
                  skipStateApiCall: false,
                }))
              }
              from="createDataSegment"
            />
          )}
          <FilterSelectPicker
            readOnly={type === "Preview" ? true : false}
            setSelectedPicker={selectedFilters.setSelectedLeadType}
            pickerData={leadType}
            placeholder="Lead Type"
            pickerValue={selectedFilters.selectedLeadType}
            from="createDataSegment"
          />

          {((reportType !== "Application" && from === "data-segment") ||
            reportType === "Applications" ||
            reportType === "Leads" ||
            reportType === "Lead" ||
            (reportType === "Application" && from === "Campaign")) && (
            <FilterSelectPicker
              readOnly={type === "Preview" ? true : false}
              setSelectedPicker={selectedFilters.setSelectedVerificationStatus}
              pickerData={ApplicationVerificationStatus}
              placeholder="Verify Status"
              pickerValue={selectedFilters.selectedVerificationStatus}
              from="createDataSegment"
            />
          )}

          {from === "data-segment" && !showLeadRelatedFilters && (
            <>
              {hideCourseList || (
                <MultipleSelectOptions
                  readOnly={type === "Preview" ? true : false}
                  setMultiCascaderDefaultValue={
                    selectedFilters.setSelectedCourse
                  }
                  columnOption={listOfCourses}
                  placeholder="Course"
                  multiCascaderDefaultValue={selectedFilters.selectedCourse}
                  loading={courseListInfo.isFetching}
                  onOpen={() =>
                    setCallFilterOptionApi((prev) => ({
                      ...prev,
                      skipCourseApiCall: false,
                    }))
                  }
                  from="createDataSegment"
                />
              )}
            </>
          )}
          {((reportType !== "Application" && from === "data-segment") ||
            reportType === "Applications" ||
            reportType === "Leads" ||
            reportType === "Lead" ||
            reportType === "Raw Data" ||
            (reportType === "Application" && from === "Campaign")) &&
            paymentFilterOption()}
          {sourceFilterOption()}
          {!showLeadRelatedFilters && counsellorFilterOption()}

          {reportType === "Application" && from === "data-segment" && (
            <>
              {hideTwelveBoardList || (
                <MultipleSelectOptions
                  readOnly={type === "Preview" ? true : false}
                  columnOption={twelveBoardList}
                  multiCascaderDefaultValue={
                    selectedFilters.selectedTwelveBoard
                  }
                  placeholder="12th Board"
                  setMultiCascaderDefaultValue={
                    selectedFilters.setSelectedTwelveBoard
                  }
                  loading={loadingFilterOption.loadingBoard}
                  onOpen={() =>
                    setCallFilterOptionApi((prev) => ({
                      ...prev,
                      skipCallBoard: false,
                    }))
                  }
                  from="createDataSegment"
                />
              )}

              <MultipleSelectOptions
                readOnly={type === "Preview" ? true : false}
                columnOption={twelveMarksList}
                multiCascaderDefaultValue={selectedFilters.selectedTwelveMarks}
                placeholder="12th Marks"
                setMultiCascaderDefaultValue={
                  selectedFilters.setSelectedTwelveMarks
                }
                from="createDataSegment"
              />

              <MultipleSelectOptions
                readOnly={type === "Preview" ? true : false}
                columnOption={formFillingStages}
                multiCascaderDefaultValue={
                  selectedFilters.selectedFormFillingStage
                }
                placeholder="Form Filling Stage"
                setMultiCascaderDefaultValue={
                  selectedFilters.setSelectedFormFillingStage
                }
                from="createDataSegment"
              />
            </>
          )}
          {!showLeadRelatedFilters && (
            <MultipleSelectOptions
              readOnly={type === "Preview" ? true : false}
              columnOption={formStageList}
              multiCascaderDefaultValue={selectedFilters.selectedFormStage}
              placeholder="Application Filling Stage"
              setMultiCascaderDefaultValue={
                selectedFilters.setSelectedFormStage
              }
              from="createDataSegment"
            />
          )}
        </>
      )}
      {(reportType === "Payments" || reportType === "Payment") &&
        paymentFilterOption()}
    </Box>
  );
};

export default React.memo(ReportFilter);
