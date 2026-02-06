import React, { useEffect, useMemo, useState } from "react";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";
import FilterSelectPicker from "../../shared/filters/FilterSelectPicker";
import { DateRangePicker } from "rsuite";
import {
  ApplicationVerificationStatus,
  addColumnOptionForApplicationManager,
  applicationStage,
  leadType,
  listOfSourcesType,
  paymentStatusList,
} from "../../../constants/LeadStageList";
// import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AdvanceFilterButton from "../../shared/AdvanceFilter/AdvanceFilterButton";
import AdvanceFilterDrawer from "../../shared/AdvanceFilter/AdvanceFilterDrawer";
import { Box, Button } from "@mui/material";
import Cookies from "js-cookie";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";
import { useSelector } from "react-redux";
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
import { useGetCounselorListQuery } from "../../../Redux/Slices/applicationDataApiSlice";
import useFetchUTMMedium from "../../../hooks/useFetchUTMMedium";
import { useLeadStageLabel } from "../../../hooks/useLeadStageLabel";
import GetJsonDate from "../../../hooks/GetJsonDate";
import useFetchCommonApi from "../../../hooks/useFetchCommonApi";

const DataSegmentDetailsFilters = ({
  shouldShowAddColumn,
  setAddedColumn,
  addedColumn,
  showFilterOption,
  setSelectedApplications,
  setSelectedEmails,
  setSelectedMobileNumbers,
  setAllApplicationPayload,
  allApplicationPayload,
  pageNumber,
  setPageNumber,
  isTypeLead,
  setApplyBasicFilter,
}) => {
  const [hideUTMMedium, setHideUTMMedium] = useState(false);
  const [hideSourceList, setHideSourceList] = useState(false);
  const [hideCounsellorList, setHideCounsellorList] = useState(false);
  const [hideStateList, setHideStateList] = useState(false);
  const [hideCourseList, setHideCourseList] = useState(false);

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
  const [selectedApplicationStage, setSelectedApplicationStage] = useState("");
  const [segmentDetailsDateRange, setSegmentDetailsDateRange] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);

  const [sourceList, setSourceList] = useState([]);
  const [counsellorList, setCounsellorList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [listOfCourses, setListOfCourses] = useState([]);
  const [utmMedium, setUtmMedium] = useState([]);

  // filter option api calling state
  const [callFilterOptionApi, setCallFilterOptionApi] = useState({
    skipStateApiCall: true,
    skipSourceApiCall: true,
    skipCounselorApiCall: true,
    skipCourseApiCall: true,
    callUtmMedium: undefined,
  });

  //advance filter
  const [openAdvanceFilter, setOpenAdvanceFilter] = useState(false);
  const [advanceFilterBlocks, setAdvanceFilterBlocks] = useState([]);

  const fetchUtmMediumData = useFetchUTMMedium();

  const advFilterLocalStorageKey = `${Cookies.get(
    "userId"
  )}dataSegmentDetailsAdvanceFilterOptions`;
  const {
    leadStageLabelList,
    setSkipCallNameAndLabelApi,
    loadingLabelList,
    leadStageObject,
  } = useFetchCommonApi();

  //loading filter options
  const [loadingFilterOptions, setLoadingFilterOptions] = useState({
    utmMediumData: false,
  });

  const { handleFilterListApiCall } = useCommonApiCalls();

  const currentUserCollegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const sourceListInfo = useGetAllSourceListQuery(
    { collegeId: currentUserCollegeId },
    {
      skip: callFilterOptionApi.skipSourceApiCall,
    }
  );

  useEffect(() => {
    localStorage.removeItem(advFilterLocalStorageKey);
  }, [advFilterLocalStorageKey]);

  //get lead stage label
  const leadStageLabel = useLeadStageLabel();

  useEffect(() => {
    leadStageLabel(leadStageObject, selectedLeadStage, setLeadStageLabelArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadStageObject, selectedLeadStage]);

  useEffect(() => {
    setShouldShowLeadStageLabel(
      selectedLeadStage.some((label) => leadStageObject[label]?.length > 0)
    );
    // eslint-disable-next-line no-use-before-define
  }, [selectedLeadStage, leadStageObject]);

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

  // getting the UTM Medium list
  useEffect(() => {
    if (callFilterOptionApi.callUtmMedium !== undefined) {
      fetchUtmMediumData(
        selectedSource,
        setHideUTMMedium,
        setLoadingFilterOptions,
        () => {},
        () => {},
        setUtmMedium
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callFilterOptionApi.callUtmMedium]);

  const courseAndSpecialization = useMemo(() => {
    const courseId = [];
    const specialization = [];
    selectedCourse?.forEach((course) => {
      courseId.push(course?.course_id);
      specialization.push(course?.course_specialization);
    });
    return { courseId, specialization };
  }, [selectedCourse]);

  const filterPayload = {
    state: {
      state_b: true,
      state_code: selectedState,
    },
    city: {
      city_b: true,
      city_name: [],
    },
    source: {
      source_b: true,
      source_name: selectedSource,
    },
    lead_stage: {
      lead_b: true,
      lead_sub_b: true,
      lead_name: [
        {
          name: selectedLeadStage,
          label: selectedLeadStageLabel,
        },
      ],
    },
    lead_type: {
      lead_type_b: true,
      lead_type_name: selectedLeadType,
    },
    counselor: {
      counselor_b: true,
      counselor_id: selectedCounselor,
    },
    application_stage: {
      application_stage_b: true,
      application_stage_name: selectedApplicationStage,
    },
    course: {
      course_id: courseAndSpecialization?.courseId,
      course_specialization: courseAndSpecialization?.specialization,
    },
    payment_status: paymentStatus,
    is_verify_b: true,
    is_verify: selectedVerificationStatus,
    date: true,
    source_type_b: true,
    source_type: selectedSourceType,
    utm_medium: selectedUtmMedium,
    utm_medium_b: true,
    utm_campaign_b: true,
    advance_filters: [],
  };

  if (segmentDetailsDateRange?.length) {
    filterPayload.date_range = JSON.parse(GetJsonDate(segmentDetailsDateRange));
  } else {
    filterPayload.date_range = null;
  }

  const handleApplyFilters = () => {
    if (pageNumber !== 1) {
      setPageNumber(1);
    }

    setAllApplicationPayload({
      payload: {
        advance_filters: advanceFilterBlocks,
      },
    });
  };

  return (
    <Box className="filter-container">
      {showFilterOption && (
        <>
          <>
            {hideCounsellorList || isTypeLead || (
              <MultipleFilterSelectPicker
                onChange={(value) => {
                  setSelectedCounselor(value);
                }}
                from="dataSegmentDetails"
                setSelectedPicker={setSelectedCounselor}
                pickerData={counsellorList}
                placeholder="Counselor"
                pickerValue={selectedCounselor}
                className="select-picker"
                loading={counselorListApiCallInfo.isFetching}
                onOpen={() =>
                  setCallFilterOptionApi((prev) => ({
                    ...prev,
                    skipCounselorApiCall: false,
                  }))
                }
              />
            )}
          </>

          {isTypeLead || (
            <FilterSelectPicker
              from="dataSegmentDetails"
              setSelectedPicker={setSelectedApplicationStage}
              pickerData={applicationStage}
              placeholder="Application stage"
              pickerValue={selectedApplicationStage}
            />
          )}
          <FilterSelectPicker
            from="dataSegmentDetails"
            setSelectedPicker={setSelectedVerificationStatus}
            pickerData={ApplicationVerificationStatus}
            placeholder="Verify status"
            pickerValue={selectedVerificationStatus}
          />
          {isTypeLead || (
            <MultipleFilterSelectPicker
              from="dataSegmentDetails"
              pickerData={paymentStatusList}
              placeholder="Payment status"
              pickerValue={paymentStatus}
              className="select-picker"
              setSelectedPicker={setPaymentStatus}
              onChange={(value) => {
                setPaymentStatus(value);
              }}
            />
          )}

          {isTypeLead || (
            <MultipleFilterSelectPicker
              from="dataSegmentDetails"
              className="select-picker"
              setSelectedPicker={setSelectedLeadStage}
              pickerData={leadStageLabelList}
              placeholder="Lead stage"
              pickerValue={selectedLeadStage}
              onOpen={() => setSkipCallNameAndLabelApi(false)}
              loading={loadingLabelList}
              onChange={(value) => {
                setSelectedLeadStage(value);
              }}
            />
          )}

          {shouldShowLeadStageLabel && (
            <MultipleFilterSelectPicker
              from="dataSegmentDetails"
              className="select-picker"
              setSelectedPicker={setSelectedLeadStageLabel}
              pickerData={leadStageLabelArray}
              placeholder="Lead stage label"
              pickerValue={selectedLeadStageLabel}
              groupBy="role"
              onChange={(value) => {
                setSelectedLeadStageLabel(value);
              }}
            />
          )}

          {hideSourceList || (
            <MultipleFilterSelectPicker
              from="dataSegmentDetails"
              className="select-picker"
              setSelectedPicker={setSelectedSource}
              pickerData={sourceList}
              placeholder="Source"
              pickerValue={selectedSource}
              loading={sourceListInfo.isFetching}
              onChange={(value) => {
                setSelectedSource(value);
              }}
              onOpen={() =>
                setCallFilterOptionApi((prev) => ({
                  ...prev,
                  skipSourceApiCall: false,
                }))
              }
            />
          )}
          {selectedSource?.length > 0 && !hideUTMMedium && (
            <MultipleFilterSelectPicker
              from="dataSegmentDetails"
              className="select-picker"
              setSelectedPicker={setSelectedUtmMedium}
              pickerData={utmMedium}
              placeholder="UTM Medium"
              pickerValue={selectedUtmMedium}
              loading={loadingFilterOptions.utmMediumData}
              groupBy="role"
              onChange={(value) => {
                setSelectedUtmMedium(value);
              }}
              onOpen={() =>
                setCallFilterOptionApi((prev) => ({
                  ...prev,
                  callUtmMedium: prev.callUtmMedium ? false : true,
                }))
              }
            />
          )}

          {hideStateList || (
            <MultipleFilterSelectPicker
              from="dataSegmentDetails"
              className="select-picker"
              setSelectedPicker={setSelectedState}
              pickerData={stateList}
              placeholder="State"
              pickerValue={selectedState}
              loading={stateListInfo.isFetching}
              onChange={(value) => {
                setSelectedState(value);
              }}
              onOpen={() =>
                setCallFilterOptionApi((prev) => ({
                  ...prev,
                  skipStateApiCall: false,
                }))
              }
            />
          )}

          <FilterSelectPicker
            from="dataSegmentDetails"
            setSelectedPicker={setSelectedLeadType}
            pickerData={leadType}
            placeholder="Lead type"
            pickerValue={selectedLeadType}
          />

          {hideCourseList || isTypeLead || (
            <MultipleFilterSelectPicker
              from="dataSegmentDetails"
              pickerData={listOfCourses}
              placeholder="Course"
              pickerValue={selectedCourse}
              className="select-picker"
              setSelectedPicker={setSelectedCourse}
              loading={courseListInfo.isFetching}
              onChange={(value) => {
                setSelectedCourse(value);
              }}
              onOpen={() =>
                setCallFilterOptionApi((prev) => ({
                  ...prev,
                  skipCourseApiCall: false,
                }))
              }
            />
          )}
          <MultipleFilterSelectPicker
            from="dataSegmentDetails"
            placeholder="Source type"
            className="select-picker"
            pickerData={listOfSourcesType}
            pickerValue={selectedSourceType}
            setSelectedPicker={setSelectedSourceType}
            onChange={(value) => {
              setSelectedSourceType(value);
            }}
          />

          <DateRangePicker
            className="select-picker"
            placeholder="Date Range"
            placement="auto"
            value={
              segmentDetailsDateRange?.length ? segmentDetailsDateRange : null
            }
            onChange={(value) => {
              setSegmentDetailsDateRange(value);

              const payload = { ...filterPayload };
              if (value?.length) {
                payload.date_range = JSON.parse(GetJsonDate(value));
              } else {
                delete payload.date_range;
              }
              setAllApplicationPayload({ payload });
            }}
          />
        </>
      )}
      {shouldShowAddColumn && (
        <MultipleFilterSelectPicker
        appearance="subtle"
            className="border-select-picker"
          pickerData={addColumnOptionForApplicationManager}
          pickerValue={addedColumn}
          placeholder="Select Column"
          onChange={(values) => {
            setAddedColumn(values);
          }}
          setSelectedPicker={setAddedColumn}
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

            <Button
              variant="contained"
              size="small"
              className="filter-apply-btn"
              onClick={() => {
                if (pageNumber !== 1) {
                  setPageNumber(1);
                }
                setAllApplicationPayload({
                  ...allApplicationPayload,
                  payload: filterPayload,
                });
                setSelectedApplications([]);
                setSelectedEmails([]);
                setSelectedMobileNumbers([]);
                setApplyBasicFilter(true);
              }}
            >
              Apply
            </Button>
          </>
        )}
      </>
    </Box>
  );
};

export default DataSegmentDetailsFilters;
