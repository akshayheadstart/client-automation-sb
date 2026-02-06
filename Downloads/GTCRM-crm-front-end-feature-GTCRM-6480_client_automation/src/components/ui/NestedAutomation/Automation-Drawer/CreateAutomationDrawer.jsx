import {
  Box,
  Button,
  Typography,
  Drawer,
  FormHelperText,
  Grid,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Input, InputGroup, SelectPicker } from "rsuite";
import CloseSVG from "../../../../icons/close.svg";
import BorderLineText from "../AutomationHelperComponent/BorderLineText";
import {
  ApplicationVerificationStatus,
  formStageListForAutomation,
  leadType,
  paymentStatusList,
} from "../../../../constants/LeadStageList";
import { useCommonApiCalls } from "../../../../hooks/apiCalls/useCommonApiCalls";
import {
  useGetAllCourseListQuery,
  useGetAllSourceListQuery,
  useGetAllStateListQuery,
} from "../../../../Redux/Slices/filterDataSlice";
import { useSelector } from "react-redux";
import MultipleFilterSelectPicker from "../../../shared/filters/MultipleFilterSelectPicker";
import {
  organizeCounselorFilterOption,
  organizeCourseFilterOption,
  organizeSourceFilterOption,
} from "../../../../helperFunctions/filterHelperFunction";
import { useGetCounselorListQuery } from "../../../../Redux/Slices/applicationDataApiSlice";
import { DashboradDataContext } from "../../../../store/contexts/DashboardDataContext";
import { useLeadStageLabel } from "../../../../hooks/useLeadStageLabel";
import FilterSelectPicker from "../../../shared/filters/FilterSelectPicker";
import { DateRangePicker } from "rsuite";
import AdvanceFilterButton from "../../../shared/AdvanceFilter/AdvanceFilterButton";
import Cookies from "js-cookie";
import AdvanceFilterDrawer from "../../../shared/AdvanceFilter/AdvanceFilterDrawer";
import { addFilterOptionToCookies } from "../../../../helperFunctions/advanceFilterHelperFunctions";
import { useCreateDataSegmentCountOfEntriesMutation } from "../../../../Redux/Slices/dataSegmentSlice";
import GetJsonDate, {
  convertToCustomFormat,
} from "../../../../hooks/GetJsonDate";
import { handleSomethingWentWrong } from "../../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../../utils/handleInternalServerError";
import useToasterHook from "../../../../hooks/useToasterHook";
import BackDrop from "../../../shared/Backdrop/Backdrop";
import Error500Animation from "../../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../../hooks/ErrorFallback";
import TimeRoundIcon from "@rsuite/icons/TimeRound";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import useFetchCommonApi from "../../../../hooks/useFetchCommonApi";

const CreateAutomationDrawer = ({
  openDrawer,
  setOpenDrawer,
  selectedCondition,
  handleManageCreateAutomationDialogue,
}) => {
  const navigate = useNavigate();

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const {
    leadStageLabelList,
    setSkipCallNameAndLabelApi,
    loadingLabelList,
    leadStageObject,
  } = useFetchCommonApi();

  const pushNotification = useToasterHook();

  const nestedAutomationPayload = useSelector(
    (state) => state.authentication.nestedAutomationPayload
  );

  const dateArray = [
    dayjs(
      nestedAutomationPayload?.automation_details?.releaseWindow?.start_time
    ),
    dayjs(nestedAutomationPayload?.automation_details?.releaseWindow?.end_time),
  ];
  const customFormat = convertToCustomFormat(dateArray);

  const [applicationStageToWarning, setApplicationStageToWarning] =
    useState(false);
  const [leadStageToWarning, setLeadStageToWarning] = useState(false);
  const [sourceWarning, setSourceWarning] = useState(false);

  const [selectedSourceForAutomation, setSelectedSourceForAutomation] =
    useState([]);

  const [selectedSource, setSelectedSource] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [hideSourceList, setHideSourceList] = useState(false);

  const [selectedCounselor, setSelectedCounselor] = useState([]);

  const [selectedVerificationStatus, setSelectedVerificationStatus] =
    useState("");
  const [paymentStatus, setPaymentStatus] = useState([]);

  const [selectedLeadStage, setSelectedLeadStage] = useState([]);
  const [selectedLeadStageLabel, setSelectedLeadStageLabel] = useState([]);
  const [leadStageLabelArray, setLeadStageLabelArray] = useState([]);
  const [shouldShowLeadStageLabel, setShouldShowLeadStageLabel] =
    useState(false);

  const [selectedState, setSelectedState] = useState([]);
  const [selectedLeadType, setSelectedLeadType] = useState("");
  const [selectedCourse, setSelectedCourse] = useState([]);

  const [counsellorList, setCounsellorList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [listOfCourses, setListOfCourses] = useState([]);

  const [hideCounsellorList, setHideCounsellorList] = useState(false);
  const [hideStateList, setHideStateList] = useState(false);
  const [hideCourseList, setHideCourseList] = useState(false);

  const [automationFilterDateRange, setAutomationFilterDateRange] =
    useState(null);

  //advance filter
  const [openAdvanceFilter, setOpenAdvanceFilter] = useState(false);
  const [advanceFilterBlocks, setAdvanceFilterBlocks] = useState([]);

  const advFilterLocalStorageKey = `${Cookies.get(
    "userId"
  )}automationManagerAdvanceFilterOptions`;

  // filter option api calling state
  const [callFilterOptionApi, setCallFilterOptionApi] = useState({
    skipStateApiCall: true,
    skipSourceApiCall: true,
    skipCounselorApiCall: true,
    skipCourseApiCall: true,
    callUtmMedium: undefined,
  });

  const { handleFilterListApiCall } = useCommonApiCalls();
  const sourceListInfo = useGetAllSourceListQuery(
    { collegeId: collegeId },
    { skip: callFilterOptionApi.skipSourceApiCall }
  );

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

  //get lead stage label
  const leadStageLabel = useLeadStageLabel();

  useEffect(() => {
    leadStageLabel(leadStageObject, selectedLeadStage, setLeadStageLabelArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadStageObject, selectedLeadStage]);

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

  // get course list
  const courseListInfo = useGetAllCourseListQuery(
    { collegeId: collegeId },
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

  const sourceFilterOption = () => {
    return (
      <>
        {hideSourceList || (
          <MultipleFilterSelectPicker
            style={{ width: "160px" }}
            onChange={(value) => {
              setSelectedSource(value);
            }}
            setSelectedPicker={setSelectedSource}
            pickerData={sourceList}
            placeholder="Source"
            pickerValue={selectedSource}
            loading={sourceListInfo.isFetching}
            onOpen={() =>
              setCallFilterOptionApi((prev) => ({
                ...prev,
                skipSourceApiCall: false,
              }))
            }
            from="automationManager"
          />
        )}
      </>
    );
  };

  const sourceOptionForAutomation = () => {
    return (
      <Grid
        rowGap={1.5}
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        spacing={2}
      >
        <Grid item md={6}>
          {hideSourceList || (
            <MultipleFilterSelectPicker
              style={{ width: "160px" }}
              onChange={(value) => {
                setSelectedSourceForAutomation(value);
                setSourceWarning(false);
              }}
              setSelectedPicker={setSelectedSourceForAutomation}
              pickerData={sourceList}
              placeholder="Source*"
              pickerValue={selectedSourceForAutomation}
              loading={sourceListInfo.isFetching}
              onOpen={() =>
                setCallFilterOptionApi((prev) => ({
                  ...prev,
                  skipSourceApiCall: false,
                }))
              }
            />
          )}
          {sourceWarning && (
            <FormHelperText sx={{ color: "#fea21b", fontSize: "10px" }}>
              *Required
            </FormHelperText>
          )}
        </Grid>
      </Grid>
    );
  };

  const leadStageFilterOption = () => {
    return (
      <>
        <MultipleFilterSelectPicker
          style={{ width: "160px" }}
          onChange={(value) => {
            setSelectedLeadStage(value);
          }}
          setSelectedPicker={setSelectedLeadStage}
          pickerData={leadStageLabelList}
          placeholder="Lead stage"
          pickerValue={selectedLeadStage}
          leadStageValue={selectedLeadStageLabel}
          setSelectedLeadStageLabel={setSelectedLeadStageLabel}
          onOpen={() => setSkipCallNameAndLabelApi(false)}
          loading={loadingLabelList}
          from="automationManager"
          placement="bottomEnd"
        />

        {shouldShowLeadStageLabel && (
          <MultipleFilterSelectPicker
            style={{ width: "160px" }}
            onChange={(value) => {
              setSelectedLeadStageLabel(value);
            }}
            setSelectedPicker={setSelectedLeadStageLabel}
            pickerData={leadStageLabelArray}
            placeholder="Lead stage label"
            pickerValue={selectedLeadStageLabel}
            leadStageValue={selectedLeadStage}
            groupBy="role"
            from="automationManager"
            placement="bottomEnd"
          />
        )}
      </>
    );
  };

  const leadStages = Object.keys(leadStageObject).map((value) => ({
    label: value,
    value: value,
  }));

  const [selectedLeadStageDataFrom, setSelectedLeadStageDataFrom] =
    useState(null);
  const leadSubStageDataFrom =
    leadStageObject[selectedLeadStageDataFrom]?.length > 0
      ? leadStageObject[selectedLeadStageDataFrom].map((value) => ({
          label: value,
          value: value,
        }))
      : null;
  const [selectedLeadSubStageDataFrom, setSelectedLeadSubStageDataFrom] =
    useState(null);

  const [selectedLeadStageDataTo, setSelectedLeadStageDataTo] = useState(null);
  const leadSubStageDataTo =
    leadStageObject[selectedLeadStageDataTo]?.length > 0
      ? leadStageObject[selectedLeadStageDataTo].map((value) => ({
          label: value,
          value: value,
        }))
      : null;
  const [selectedLeadSubStageDataTo, setSelectedLeadSubStageDataTo] =
    useState(null);

  const leadStageAndLabelFilterOption = () => {
    return (
      <>
        <Grid
          rowGap={1.5}
          container
          columns={{ xs: 4, sm: 8, md: 12 }}
          columnSpacing={2}
        >
          <Grid item md={6}>
            <SelectPicker
              style={{ width: "100%" }}
              placeholder="Lead Stage From"
              data={leadStages}
              value={selectedLeadStageDataFrom}
              onChange={(value) => {
                setSelectedLeadStageDataFrom(value);
                if (value === null) {
                  setSelectedLeadSubStageDataFrom(null);
                }
              }}
              onOpen={() => setSkipCallNameAndLabelApi(false)}
              placement="bottomEnd"
            />
          </Grid>

          <Grid item md={6}>
            <SelectPicker
              style={{ width: "100%" }}
              placeholder="Lead Stage To*"
              data={leadStages}
              value={selectedLeadStageDataTo}
              onChange={(value) => {
                setSelectedLeadStageDataTo(value);
                if (value === null) {
                  setSelectedLeadSubStageDataTo(null);
                }
                setLeadStageToWarning(false);
              }}
              onOpen={() => setSkipCallNameAndLabelApi(false)}
              placement="bottomEnd"
            />
            {leadStageToWarning && (
              <FormHelperText sx={{ color: "#fea21b", fontSize: "10px" }}>
                *Required
              </FormHelperText>
            )}
          </Grid>

          <Grid item md={6}>
            {leadSubStageDataFrom && (
              <SelectPicker
                style={{ width: "100%" }}
                placeholder="Sub Stage"
                data={leadSubStageDataFrom}
                value={selectedLeadSubStageDataFrom}
                onChange={(value) => setSelectedLeadSubStageDataFrom(value)}
                placement="bottomEnd"
              />
            )}
          </Grid>
          <Grid item md={6}>
            {leadSubStageDataTo && (
              <SelectPicker
                style={{ width: "100%" }}
                placeholder="Sub Stage"
                data={leadSubStageDataTo}
                value={selectedLeadSubStageDataTo}
                onChange={(value) => setSelectedLeadSubStageDataTo(value)}
                placement="bottomEnd"
              />
            )}
          </Grid>
        </Grid>
      </>
    );
  };

  const [selectedApplicationStageFrom, setSelectedApplicationStageFrom] =
    useState(null);
  const [selectedApplicationStageTo, setSelectedApplicationStageTo] =
    useState(null);

  const applicationStageFilterOption = () => {
    return (
      <Grid
        rowGap={1.5}
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        spacing={2}
      >
        <Grid item md={6}>
          <SelectPicker
            style={{ width: "100%" }}
            placeholder="Application Stage From"
            data={formStageListForAutomation}
            value={selectedApplicationStageFrom}
            onChange={(value) => {
              setSelectedApplicationStageFrom(value);
            }}
            placement="bottomEnd"
          />
        </Grid>
        <Grid item md={6}>
          <SelectPicker
            style={{ width: "100%" }}
            placeholder="Application Stage To*"
            data={formStageListForAutomation}
            value={selectedApplicationStageTo}
            onChange={(value) => {
              setSelectedApplicationStageTo(value);
              setApplicationStageToWarning(false);
            }}
            placement="bottomEnd"
          />
          {applicationStageToWarning && (
            <FormHelperText sx={{ color: "#fea21b", fontSize: "10px" }}>
              *Required
            </FormHelperText>
          )}
        </Grid>
      </Grid>
    );
  };

  const createAutomationPayload = {
    lead_stage_change: {
      lead_stage_from: {
        lead_stage: selectedLeadStageDataFrom,
        lead_stage_label: selectedLeadSubStageDataFrom,
      },
      lead_stage_to: {
        lead_stage: selectedLeadStageDataTo,
        lead_stage_label: selectedLeadSubStageDataTo,
      },
    },
    application_stage: {
      stage_from: selectedApplicationStageFrom,
      stage_to: selectedApplicationStageTo,
    },
    source_name: selectedSourceForAutomation,
    selected_filters: {
      filters: {
        state_code: selectedState,
        source_name: selectedSourceForAutomation || selectedSource,
        lead_name: selectedLeadStage
          ? [
              {
                name: selectedLeadStage,
                label: selectedLeadStageLabel ? selectedLeadStageLabel : [],
              },
            ]
          : [],
        lead_type_name: selectedLeadType,
        counselor_id: selectedCounselor,

        is_verify: selectedVerificationStatus,
        payment_status: paymentStatus,
        course: {
          course_id: [],
          course_specialization: [],
        },
      },
      date_range: JSON.parse(GetJsonDate(automationFilterDateRange)),
    },
  };

  const dataGeneratedPayload = {
    module_name: nestedAutomationPayload?.automation_details?.data_type,
    period: JSON.parse(GetJsonDate(automationFilterDateRange)),
  };

  if (advanceFilterBlocks?.length > 0) {
    dataGeneratedPayload.advance_filters = advanceFilterBlocks;
    createAutomationPayload.selected_filters.advance_filters =
      advanceFilterBlocks;
  }

  if (advanceFilterBlocks?.length > 0) {
    dataGeneratedPayload.filters = {};
    createAutomationPayload.selected_filters.filters = {};
  } else {
    dataGeneratedPayload.filters = {
      lead_stage_change:
        selectedCondition?.toLowerCase() === "change in lead stage"
          ? {
              lead_stage_from: {
                lead_stage: selectedLeadStageDataFrom,
                lead_stage_label: selectedLeadSubStageDataFrom,
              },
              lead_stage_to: {
                lead_stage: selectedLeadStageDataTo,
                lead_stage_label: selectedLeadSubStageDataTo,
              },
            }
          : {},
      application_stage:
        selectedCondition?.toLowerCase() === "change in application stage"
          ? {
              stage_from: selectedApplicationStageFrom,
              stage_to: selectedApplicationStageTo,
            }
          : {},
      state_code: selectedState,
      source_name: selectedSourceForAutomation || selectedSource,
      lead_name: selectedLeadStage
        ? [
            {
              name: selectedLeadStage,
              label: selectedLeadStageLabel ? selectedLeadStageLabel : [],
            },
          ]
        : [],
      lead_type_name: selectedLeadType,
      counselor_id: selectedCounselor,
      is_verify: selectedVerificationStatus,
      payment_status: paymentStatus,
      course: {
        course_id: [],
        course_specialization: [],
      },
    };
    //create automation filters payload
    createAutomationPayload.selected_filters.filters = {
      state_code: selectedState,
      source_name: selectedSource,
      lead_name: selectedLeadStage
        ? [
            {
              name: selectedLeadStage,
              label: selectedLeadStageLabel ? selectedLeadStageLabel : [],
            },
          ]
        : [],
      lead_type_name: selectedLeadType,
      counselor_id: selectedCounselor,
      is_verify: selectedVerificationStatus,
      payment_status: paymentStatus,
      course: {
        course_id: [],
        course_specialization: [],
      },
    };
  }

  if (advanceFilterBlocks?.length === 0 && selectedCourse.length) {
    dataGeneratedPayload.filters.course.course_name = selectedCourse?.length
      ? selectedCourse.map((course) => course?.course_name)
      : [];
    dataGeneratedPayload.filters.course.course_id = selectedCourse?.length
      ? selectedCourse.map((course) => course?.course_id)
      : [];
    dataGeneratedPayload.filters.course.course_specialization =
      selectedCourse?.length
        ? selectedCourse.map((course) => course?.course_specialization)
        : [];

    createAutomationPayload.selected_filters.filters.course.course_name =
      selectedCourse?.length
        ? selectedCourse.map((course) => course?.course_name)
        : [];
    createAutomationPayload.selected_filters.filters.course.course_id =
      selectedCourse?.length
        ? selectedCourse.map((course) => course?.course_id)
        : [];
    createAutomationPayload.selected_filters.filters.course.course_specialization =
      selectedCourse?.length
        ? selectedCourse.map((course) => course?.course_specialization)
        : [];
  }

  const [countOfEntries, setCountOfEntries] = useState();
  const [loadingCountOfEntries, setLoadingCountOfEntries] = useState(false);

  const [
    somethingWentWrongInCreateAutomation,
    setSomethingWentWrongInCreateAutomation,
  ] = useState(false);
  const [
    createAutomationInternalServerError,
    setCreateAutomationInternalServerError,
  ] = useState(false);

  const [createDataSegmentCountOfEntries] =
    useCreateDataSegmentCountOfEntriesMutation();

  const handleGetCountOfEntries = (from) => {
    if (
      selectedCondition?.toLowerCase() === "origin" &&
      !selectedSourceForAutomation?.length > 0
    ) {
      setSourceWarning(true);
    } else if (
      selectedCondition?.toLowerCase() === "change in application stage" &&
      !selectedApplicationStageTo
    ) {
      setApplicationStageToWarning(true);
    } else if (
      selectedCondition?.toLowerCase() === "change in lead stage" &&
      !selectedLeadStageDataTo
    ) {
      setLeadStageToWarning(true);
    } else {
      setLoadingCountOfEntries(true);
      createDataSegmentCountOfEntries({
        collegeId,
        featureKey: "ca8ed51b",
        payload: dataGeneratedPayload,
      })
        .unwrap()
        .then(async (res) => {
          if (res) {
            try {
              if (typeof res?.entities_count === "number") {
                setCountOfEntries(res?.entities_count);

                const updatedNestedAutomationPayload = {
                  ...nestedAutomationPayload,
                  automation_details: {
                    ...nestedAutomationPayload?.automation_details,
                    data_count: res?.entities_count,
                    filters: createAutomationPayload,
                    data_segment: [],
                  },
                };

                if (from === "continue-btn") {
                  navigate("/create-automation", {
                    state: {
                      template: false,
                      automationPayload: updatedNestedAutomationPayload,
                    },
                  });
                }
              } else {
                throw new Error(
                  "data segment count of entities API response changed"
                );
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInCreateAutomation,
                "",
                5000
              );
            }
          } else if (res?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (res?.detail) {
            pushNotification("error", res?.detail);
          }
        })
        .catch((error) => {
          if (error?.data?.detail) {
            pushNotification("error", error?.data?.detail);
          } else {
            handleInternalServerError(
              setCreateAutomationInternalServerError,
              "",
              5000
            );
          }
        })
        .finally(() => {
          setLoadingCountOfEntries(false);
        });
    }
  };

  return (
    <Drawer
      anchor="right"
      onClose={() => setOpenDrawer(false)}
      open={openDrawer}
      PaperProps={{
        sx: {
          width: "600px",
        },
      }}
    >
      <BackDrop openBackdrop={loadingCountOfEntries} text="Loading..." />
      <Box className="automation-communication-drawer-header">
        <Box className="create-automation-drawer-title">Create Automation</Box>
        <Box
          onClick={() => setOpenDrawer(false)}
          className="automation-drawer-close-icon"
        >
          <img src={CloseSVG} alt="settingsImage" style={{ width: "100%" }} />
        </Box>
      </Box>

      {createAutomationInternalServerError ||
      somethingWentWrongInCreateAutomation ? (
        <>
          {createAutomationInternalServerError && (
            <Error500Animation height={200} width={200}></Error500Animation>
          )}
          {somethingWentWrongInCreateAutomation && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </>
      ) : (
        <Box className="automation-drawer-box">
          <Grid
            rowGap={1.5}
            container
            columns={{ xs: 4, sm: 8, md: 12 }}
            columnSpacing={2}
          >
            <Grid item md={6}>
              <Box style={{ display: "flex", flexDirection: "column" }}>
                <Input
                  readOnly
                  className="create-automation-input"
                  style={{ width: "100%" }}
                  placeholder="Name*"
                  value={
                    nestedAutomationPayload?.automation_details?.automation_name
                  }
                />
                {nestedAutomationPayload?.automation_details
                  ?.automation_name && (
                  <BorderLineText text={"Name*"} width={32}></BorderLineText>
                )}
              </Box>
            </Grid>
            <Grid item md={6}>
              <Box style={{ display: "flex", flexDirection: "column" }}>
                <SelectPicker
                  readOnly
                  style={{ width: "100%" }}
                  className="create-automation-picker"
                  placeholder="Select Data Type*"
                  data={[
                    {
                      label: "Lead",
                      value: "Lead",
                    },
                    {
                      label: "Application",
                      value: "Application",
                    },
                    {
                      label: "Raw Data",
                      value: "Raw Data",
                    },
                  ]}
                  value={nestedAutomationPayload?.automation_details?.data_type}
                />

                {nestedAutomationPayload?.automation_details?.data_type && (
                  <BorderLineText
                    text={"Select Data Type*"}
                    width={80}
                  ></BorderLineText>
                )}
              </Box>
            </Grid>

            <Grid item md={6}>
              <Box style={{ display: "flex", flexDirection: "column" }}>
                <Box>
                  <InputGroup
                    className="create-automation-input"
                    inside
                    style={{ width: "100%" }}
                  >
                    <Input
                      className="create-automation-input"
                      placeholder="Release window*"
                      style={{ pointerEvents: "none" }}
                      value={`${
                        nestedAutomationPayload?.automation_details
                          ?.releaseWindow?.start_time &&
                        nestedAutomationPayload?.automation_details
                          ?.releaseWindow?.end_time
                          ? `${customFormat?.start_time?.time} to ${customFormat?.end_time?.time}`
                          : ""
                      }`}
                    />
                    <InputGroup.Addon>
                      <TimeRoundIcon className="communication-release-window-icon" />
                    </InputGroup.Addon>
                  </InputGroup>
                </Box>

                {nestedAutomationPayload?.automation_details?.releaseWindow
                  ?.start_time &&
                  nestedAutomationPayload?.automation_details?.releaseWindow
                    ?.end_time && (
                    <BorderLineText
                      text={"Communication Release window*"}
                      width={150}
                    ></BorderLineText>
                  )}
              </Box>
            </Grid>
            <Grid item md={6}>
              <Box style={{ display: "flex", flexDirection: "column" }}>
                <DateRangePicker
                  readOnly
                  appearance="subtle"
                  placeholder="Start Date & End Date*"
                  value={
                    nestedAutomationPayload?.automation_details?.date
                      ?.start_date
                      ? [
                          new Date(
                            nestedAutomationPayload?.automation_details?.date?.start_date
                          ),
                          new Date(
                            nestedAutomationPayload?.automation_details?.date?.end_date
                          ),
                        ]
                      : []
                  }
                  placement="bottomEnd"
                  style={{ width: "100%" }}
                  className="date-range-btn-automation"
                />
                {nestedAutomationPayload?.automation_details?.date?.start_date
                  ?.length > 0 &&
                  nestedAutomationPayload?.automation_details?.date?.end_date
                    ?.length > 0 && (
                    <BorderLineText
                      text={"Start Date & End Date*"}
                      width={105}
                    ></BorderLineText>
                  )}
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ my: "28px" }}>
            {selectedCondition?.toLowerCase() === "origin" &&
              sourceOptionForAutomation()}
            {selectedCondition?.toLowerCase() === "change in lead stage" &&
              leadStageAndLabelFilterOption()}
            {selectedCondition?.toLowerCase() ===
              "change in application stage" && applicationStageFilterOption()}
          </Box>

          <Box className="automation-drawer-filter-title">Filters</Box>
          <Box className="automation-drawer-flex-box">
            <>
              {hideCounsellorList || (
                <MultipleFilterSelectPicker
                  style={{ width: "160px" }}
                  onChange={(value) => {
                    setSelectedCounselor(value);
                  }}
                  setSelectedPicker={setSelectedCounselor}
                  pickerData={counsellorList}
                  placeholder="Counselor"
                  pickerValue={selectedCounselor}
                  loading={counselorListApiCallInfo.isFetching}
                  onOpen={() =>
                    setCallFilterOptionApi((prev) => ({
                      ...prev,
                      skipCounselorApiCall: false,
                    }))
                  }
                  from="automationManager"
                  placement="bottomEnd"
                />
              )}
            </>
            <SelectPicker
              style={{ width: "160px" }}
              onChange={(value) => {
                setSelectedVerificationStatus(value);

                addFilterOptionToCookies(
                  "automationManager",
                  "Verify status",
                  value,
                  ApplicationVerificationStatus,
                  "select"
                );
              }}
              data={ApplicationVerificationStatus}
              placeholder="Verify status"
              value={selectedVerificationStatus}
              placement="bottomEnd"
            />

            <MultipleFilterSelectPicker
              onChange={(value) => {
                setPaymentStatus(value);
              }}
              pickerData={paymentStatusList}
              placeholder="Payment status"
              pickerValue={paymentStatus}
              setSelectedPicker={setPaymentStatus}
              from="automationManager"
              placement="bottomEnd"
              style={{ width: "160px" }}
            />

            {selectedCondition?.toLowerCase() !== "change in lead stage" &&
              leadStageFilterOption()}

            {selectedCondition?.toLowerCase() !== "origin" &&
              sourceFilterOption()}

            {hideStateList || (
              <MultipleFilterSelectPicker
                style={{ width: "160px" }}
                setSelectedPicker={setSelectedState}
                pickerData={stateList}
                placeholder="State"
                pickerValue={selectedState}
                loading={stateListInfo.isFetching}
                onOpen={() =>
                  setCallFilterOptionApi((prev) => ({
                    ...prev,
                    skipStateApiCall: false,
                  }))
                }
                from="automationManager"
                placement="bottomEnd"
              />
            )}

            <FilterSelectPicker
              style={{ width: "160px" }}
              className="No"
              setSelectedPicker={setSelectedLeadType}
              pickerData={leadType}
              placeholder="Lead type"
              pickerValue={selectedLeadType}
              from="automationManager"
            />

            {hideCourseList || (
              <MultipleFilterSelectPicker
                style={{ width: "160px" }}
                onChange={(value) => {
                  setSelectedCourse(value);
                }}
                pickerData={listOfCourses}
                placeholder="Course"
                pickerValue={selectedCourse}
                setSelectedPicker={setSelectedCourse}
                loading={courseListInfo.isFetching}
                onOpen={() =>
                  setCallFilterOptionApi((prev) => ({
                    ...prev,
                    skipCourseApiCall: false,
                  }))
                }
                from="automationManager"
              />
            )}

            <DateRangePicker
              style={{ width: "160px" }}
              placeholder="Date Range"
              value={automationFilterDateRange}
              onChange={(value) => {
                setAutomationFilterDateRange(value);
              }}
              placement="auto"
            />
            <AdvanceFilterButton setOpenAdvanceFilter={setOpenAdvanceFilter} />
            {openAdvanceFilter && (
              <AdvanceFilterDrawer
                openAdvanceFilter={openAdvanceFilter}
                setOpenAdvanceFilter={setOpenAdvanceFilter}
                regularFilter={advFilterLocalStorageKey}
                advanceFilterBlocks={advanceFilterBlocks}
                setAdvanceFilterBlocks={setAdvanceFilterBlocks}
                handleApplyFilters={handleGetCountOfEntries}
              />
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              mt: "28px",
            }}
          >
            <Box>
              <button
                type="button"
                id="automation-drawer-apply-btn"
                onClick={() => {
                  handleGetCountOfEntries();
                }}
              >
                Apply
              </button>
            </Box>

            <Box className="automation-drawer-entries-count-box">
              <Typography className="count-of-entries-text">
                Total data generated :
              </Typography>
              <Typography id="count-of-entries-value">
                {countOfEntries}
              </Typography>
            </Box>
          </Box>

          <Box className="create-automation-drawer-buttons">
            <Button
              sx={{ color: "#008BE2 !important" }}
              className="common-outlined-button"
              onClick={() => {
                setOpenDrawer(false);
                handleManageCreateAutomationDialogue(true);
              }}
            >
              Back
            </Button>
            <Button
              className="common-contained-button"
              onClick={() => {
                handleGetCountOfEntries("continue-btn");
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default CreateAutomationDrawer;
