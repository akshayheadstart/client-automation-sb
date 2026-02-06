import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Drawer,
  FormHelperText,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DatePicker, DateRangePicker, Input, SelectPicker } from "rsuite";
import {
  dataSegmentTypes,
  dataSegmentationPeriodOptions,
  segmentTypes,
} from "../../../constants/LeadStageList";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ReportFilter from "../Report/ReportFilter";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import useToasterHook from "../../../hooks/useToasterHook";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import GetJsonDate from "../../../hooks/GetJsonDate";
import {
  useCreateDataSegmentCountOfEntriesMutation,
  useCreateDataSegmentMutation,
} from "../../../Redux/Slices/dataSegmentSlice";
import BackDrop from "../../shared/Backdrop/Backdrop";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { isBefore } from "date-fns";
import { useNavigate } from "react-router-dom";
import "../../../styles/DataSegmentRecordsTable.css";
import AdvanceFilterButton from "../../shared/AdvanceFilter/AdvanceFilterButton";
import AdvanceFilterDrawer from "../../shared/AdvanceFilter/AdvanceFilterDrawer";
import CustomRawDataSelectPicker from "./CustomRawDataSelectPicker";
import useFetchCommonApi from "../../../hooks/useFetchCommonApi";
import { useGetRawDataNameListQuery } from "../../../Redux/Slices/applicationDataApiSlice";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";

const CreateDataSegmentDrawer = ({
  setOpenCreateDataSegmentDrawer,
  openCreateDataSegmentDrawer,
  from,
  handleManageCreateAutomationDialogue,
  selectedDataSegment,
  zIndex,
  promoCode,
  setCountOfDataEntries,
}) => {
  const handleCloseDrawer = () => {
    setOpenCreateDataSegmentDrawer(false);
    localStorage.removeItem(advFilterLocalStorageKey);
  };

  const pushNotification = useToasterHook();

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const navigate = useNavigate();

  const nestedAutomationPayload = useSelector(
    (state) => state.authentication.nestedAutomationPayload
  );

  //advance filter
  const [openAdvanceFilter, setOpenAdvanceFilter] = useState(false);
  const [advanceFilterBlocks, setAdvanceFilterBlocks] = useState([]);

  const advFilterLocalStorageKey =
    selectedDataSegment?.advance_filters?.length > 0
      ? `${Cookies.get("userId")}dataSegmentViewAdvanceFilterOptions`
      : `${Cookies.get("userId")}createDataSegmentAdvanceFilterOptions`;

  const [selectedDataType, setSelectedDataType] = useState("");

  const [selectedVerificationStatus, setSelectedVerificationStatus] =
    useState("");
  const [selectedState, setSelectedState] = useState([]);
  const [selectedSource, setSelectedSource] = useState([]);
  const [selectedLeadType, setSelectedLeadType] = useState("");
  const [selectedLeadStage, setSelectedLeadStage] = useState([]);
  const [selectedLeadStageLabel, setSelectedLeadStageLabel] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState([]);
  const [selectedApplicationStage, setSelectedApplicationStage] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState([]);
  const [selectedFormStage, setSelectedFormStage] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState([]);
  const [selectedTwelveBoard, setSelectedTwelveBoard] = useState([]);
  const [selectedTwelveMarks, setSelectedTwelveMarks] = useState([]);
  const [selectedFormFillingStage, setSelectedFormFillingStage] = useState([]);

  const [dateRange, setDateRange] = useState([]);
  const [startAndEndDate, setStartAndEndDate] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const { setSkipCallNameAndLabelApi } = useFetchCommonApi();

  const [listOfRawDataNames, setListOfRawDataNames] = useState([]);

  const [selectedRawDataName, setSelectedRawDataName] = useState([]);

  const [dataSegmentName, setDataSegmentName] = useState("");

  const [countOfEntries, setCountOfEntries] = useState();

  const [
    internalServerErrorInReportFilter,
    setInternalServerErrorInReportFilter,
  ] = useState(false);
  const [
    somethingWentWrongInReportFilter,
    setSomethingWentWrongInReportFilter,
  ] = useState(false);

  const [
    createDataSegmentInternalServerError,
    setCreateDataSegmentInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInCreateDataSegment,
    setSomethingWentWrongInCreateDataSegment,
  ] = useState(false);

  const [openViewDataSegmentDialog, setOpenViewDataSegmentDialog] =
    useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const mediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const selectedFilters = {
    internalServerErrorInReportFilter,
    setInternalServerErrorInReportFilter,
    somethingWentWrongInReportFilter,
    setSomethingWentWrongInReportFilter,
    selectedVerificationStatus,
    setSelectedVerificationStatus,
    selectedState,
    setSelectedState,
    selectedSource,
    setSelectedSource,
    selectedLeadType,
    setSelectedLeadType,
    selectedLeadStage,
    setSelectedLeadStage,
    selectedLeadStageLabel,
    setSelectedLeadStageLabel,
    selectedCounselor,
    setSelectedCounselor,
    selectedApplicationStage,
    setSelectedApplicationStage,
    selectedPaymentStatus,
    setSelectedPaymentStatus,
    setSelectedCourse,
    selectedCourse,
    selectedTwelveBoard,
    setSelectedTwelveBoard,
    selectedTwelveMarks,
    setSelectedTwelveMarks,
    selectedFormFillingStage,
    setSelectedFormFillingStage,
    setSelectedFormStage,
    selectedFormStage,
  };
  const [selectedSegmentType, setSelectedSegmentType] = useState("");
  const [apisResponse, setApisResponse] = useState({});
  const [skipRawDataNameApiCall, setSkipRawDataNameApiCall] = useState(true);

  const { handleFilterListApiCall } = useCommonApiCalls();

  const rawDataNameListInfo = useGetRawDataNameListQuery(
    { collegeId },
    { skip: skipRawDataNameApiCall }
  );

  // getting raw data list
  useEffect(() => {
    if (rawDataNameListInfo?.isSuccess) {
      const rawDataNameList = rawDataNameListInfo.data?.data;
      const organizeRawDataName = (rawData) =>
        rawData?.map((rawDataDetails) => ({
          label: rawDataDetails?.raw_data_name,
          value: rawDataDetails,
        }));
      handleFilterListApiCall(
        rawDataNameList,
        rawDataNameListInfo,
        setListOfRawDataNames,
        () => {},
        organizeRawDataName
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawDataNameListInfo]);

  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [dataSegmentPickerWidth, setDataSegmentPickerWidth] = useState(0);

  const handlePeriod = (value) => {
    setSelectedPeriod(value);
    setDateRange([]);
    setStartAndEndDate(null);
  };

  const dataSegmentPayload = {
    module_name: selectedDataType,
    segment_type: selectedSegmentType,
    data_segment_name: dataSegmentName,
    raw_data_name: selectedRawDataName?.map((name) => name?.raw_data_name),
    period:
      selectedSegmentType === "Static" || selectedPeriod === "Custom"
        ? JSON.parse(GetJsonDate(dateRange))
        : selectedPeriod,
    enabled: true,
    is_published: true,
    count_at_origin: countOfEntries ? countOfEntries : 0,
  };

  if (openAdvanceFilter) {
    if (advanceFilterBlocks?.length > 0) {
      dataSegmentPayload.advance_filters = advanceFilterBlocks;
    }
  } else {
    dataSegmentPayload.filters = {
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
      application_stage_name: selectedApplicationStage,
      is_verify: selectedVerificationStatus,
      payment_status: selectedPaymentStatus,
      course: {
        course_id: selectedCourse?.length
          ? selectedCourse.map((course) => course?.course_id)
          : [],
        course_specialization: selectedCourse?.length
          ? selectedCourse.map((course) => course?.course_specialization)
          : [],
      },
      twelve_board: selectedTwelveBoard,
      twelve_marks: selectedTwelveMarks,
      form_filling_stage: selectedFormFillingStage,
      application_filling_stage: selectedFormStage,
    };
  }

  const [loadingCountOfEntries, setLoadingCountOfEntries] = useState(false);

  const [loadingCreateDataSegment, setLoadingCreateDataSegment] =
    useState(false);

  const [createDataSegmentCountOfEntries] =
    useCreateDataSegmentCountOfEntriesMutation();

  const handleGetCountOfEntries = (from) => {
    if (selectedDataSegment?.data_segment_name?.length > 0) {
      return;
    } else {
      if (!selectedDataType) {
        setDataTypeWarning(true);
      } else if (!selectedSegmentType) {
        setSegmentTypeWarning(true);
      } else if (!startAndEndDate && selectedSegmentType === "Static") {
        setDurationWarning(true);
      } else if (!selectedPeriod && selectedSegmentType === "Dynamic") {
        setSelectPeriodWarning(true);
      } else if (!startDate && selectedPeriod === "Custom") {
        setStartDateWarning(true);
      } else {
        setLoadingCountOfEntries(true);
        createDataSegmentCountOfEntries({
          collegeId,
          featureKey: "ef5bffc5",
          payload: dataSegmentPayload,
        })
          .unwrap()
          .then((res) => {
            if (res) {
              try {
                if (typeof res?.entities_count === "number") {
                  setCountOfEntries(res?.entities_count);

                  if (from === "continue-btn") {
                    dataSegmentPayload.count_at_origin = res?.entities_count;
                    createDataSegmentApiCall();
                  }
                } else {
                  throw new Error(
                    "data segment count of entities API response changed"
                  );
                }
              } catch (error) {
                setApiResponseChangeMessage(error);
                handleSomethingWentWrong(
                  setSomethingWentWrongInCreateDataSegment,
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
                setCreateDataSegmentInternalServerError,
                "",
                5000
              );
            }
          })
          .finally(() => {
            setLoadingCountOfEntries(false);
          });
      }
    }
  };

  const [createDataSegment] = useCreateDataSegmentMutation();

  const createDataSegmentApiCall = () => {
    if (advanceFilterBlocks?.length > 0) {
      dataSegmentPayload.advance_filters = advanceFilterBlocks;
      delete dataSegmentPayload.filters;
    }
    setLoadingCreateDataSegment(true);
    createDataSegment({
      dataSegmentPayload,
      collegeId,
    })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              pushNotification("success", res?.message);
              setOpenViewDataSegmentDialog(true);
              setApisResponse(res?.data);
              if (promoCode) {
                setCountOfDataEntries(res?.data);
              }
            } else {
              throw new Error("create data segment API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInCreateDataSegment,
              "",
              5000
            );
          }
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        }
      })
      .catch(() => {
        handleInternalServerError(
          setCreateDataSegmentInternalServerError,
          "",
          5000
        );
      })
      .finally(() => {
        setLoadingCreateDataSegment(false);
        localStorage.removeItem(advFilterLocalStorageKey);
      });
  };

  const [dataTypeWarning, setDataTypeWarning] = useState(false);
  const [segmentTypeWarning, setSegmentTypeWarning] = useState(false);
  const [selectPeriodWarning, setSelectPeriodWarning] = useState(false);

  const [durationWarning, setDurationWarning] = useState(false);
  const [startDateWarning, setStartDateWarning] = useState(false);

  const handleDataSegmentCreation = (event) => {
    event.preventDefault();
    if (!selectedDataType) {
      setDataTypeWarning(true);
    } else if (!selectedSegmentType) {
      setSegmentTypeWarning(true);
    } else if (!startAndEndDate && selectedSegmentType === "Static") {
      setDurationWarning(true);
    } else if (!selectedPeriod && selectedSegmentType === "Dynamic") {
      setSelectPeriodWarning(true);
    } else if (!startDate && selectedPeriod === "Custom") {
      setStartDateWarning(true);
    } else {
      if (countOfEntries >= 0) {
        createDataSegmentApiCall();
      } else {
        handleGetCountOfEntries("continue-btn");
      }
    }
  };

  useEffect(() => {
    //data segment name field
    if (selectedDataSegment?.data_segment_name?.length > 0) {
      setDataSegmentName(selectedDataSegment?.data_segment_name);
    }
    //data type field
    if (nestedAutomationPayload?.automation_details?.data_type?.length > 0) {
      setSelectedDataType(
        nestedAutomationPayload?.automation_details?.data_type
      );
    }
    if (selectedDataSegment?.module_name) {
      setSelectedDataType(selectedDataSegment?.module_name);
    }
    if (selectedDataSegment?.segment_type?.length > 0) {
      setSelectedSegmentType(selectedDataSegment?.segment_type);
    }

    if (
      selectedDataSegment?.segment_type?.toLowerCase() === "static" &&
      selectedDataSegment?.period?.start_date?.length > 0
    ) {
      const dateArray = [
        new Date(selectedDataSegment?.period?.start_date),
        new Date(selectedDataSegment?.period?.end_date),
      ];

      setStartAndEndDate(dateArray);
    } else if (
      selectedDataSegment?.segment_type?.toLowerCase() === "dynamic" &&
      selectedDataSegment?.period?.start_date?.length > 0
    ) {
      setStartDate(new Date(selectedDataSegment?.period?.start_date));
      setEndDate(new Date(selectedDataSegment?.period?.end_date));
    } else if (
      selectedDataSegment?.segment_type?.toLowerCase() === "dynamic" &&
      selectedDataSegment?.period?.length > 0
    ) {
      setSelectedPeriod(selectedDataSegment?.period);
    }

    //state filter
    if (selectedDataSegment?.filters?.state_code?.length > 0) {
      setSelectedState(selectedDataSegment?.filters?.state_code);
    }
    //lead type filter
    if (selectedDataSegment?.filters?.lead_type_name?.length > 0) {
      setSelectedLeadType(selectedDataSegment?.filters?.lead_type_name);
    }

    //course filter
    if (selectedDataSegment?.filters?.course?.length > 0) {
      setSelectedCourse(selectedDataSegment?.filters?.course);
    }

    //source filter
    if (selectedDataSegment?.filters?.source_name?.length > 0) {
      setSelectedSource(selectedDataSegment?.filters?.source_name);
    }

    //counsellor filter
    if (selectedDataSegment?.filters?.counselor_id?.length > 0) {
      setSelectedCounselor(selectedDataSegment?.filters?.counselor_id);
    }
    //application stage filter
    if (selectedDataSegment?.filters?.application_stage_name?.length > 0) {
      setSelectedApplicationStage(
        selectedDataSegment?.filters?.application_stage_name
      );
    }
    //twelve board filter
    if (selectedDataSegment?.filters?.twelve_board?.length > 0) {
      setSelectedTwelveBoard(selectedDataSegment?.filters?.twelve_board);
    }
    //twelve marks filter
    if (selectedDataSegment?.filters?.twelve_marks?.length > 0) {
      setSelectedTwelveMarks(selectedDataSegment?.filters?.twelve_marks);
    }
    //form filling stage filter
    if (selectedDataSegment?.filters?.form_filling_stage?.length > 0) {
      setSelectedFormFillingStage(
        selectedDataSegment?.filters?.form_filling_stage
      );
    }
    //application filling stage filter
    if (selectedDataSegment?.filters?.application_filling_stage?.length > 0) {
      setSelectedFormStage(
        selectedDataSegment?.filters?.application_filling_stage
      );
    }

    //verify status filter
    if (selectedDataSegment?.filters?.is_verify?.length > 0) {
      setSelectedVerificationStatus(selectedDataSegment?.filters?.is_verify);
    }
    //payment status filter
    if (selectedDataSegment?.filters?.payment_status?.length > 0) {
      setSelectedPaymentStatus(selectedDataSegment?.filters?.payment_status);
    }

    //lead stage and  lead stage label filter
    if (selectedDataSegment?.filters?.lead_name[0]?.name?.length > 0) {
      setSkipCallNameAndLabelApi(false);
      setSelectedLeadStage(
        selectedDataSegment?.filters?.selected_filters?.filters?.lead_name[0]
          ?.name
      );
      setSelectedLeadStageLabel(
        selectedDataSegment?.filters?.selected_filters?.filters?.lead_name[0]
          ?.label
      );
    }

    //count of entries
    if (selectedDataSegment?.count_of_entities) {
      setCountOfEntries(selectedDataSegment?.count_of_entities);
    }

    // we are removing the prev selected local Storage if case the user reload the page with selected advance filters
    if (localStorage.getItem(advFilterLocalStorageKey)?.length) {
      localStorage.removeItem(advFilterLocalStorageKey);
    }
    //advance filter Blocks
    if (selectedDataSegment?.advance_filters?.length > 0) {
      setAdvanceFilterBlocks(selectedDataSegment?.advance_filters);
      localStorage.setItem(
        advFilterLocalStorageKey,
        JSON.stringify(selectedDataSegment?.advance_filters)
      );
    }

    if (
      nestedAutomationPayload?.automation_details?.filters?.selected_filters
        ?.advance_filters?.length
    ) {
      setAdvanceFilterBlocks(
        nestedAutomationPayload?.automation_details?.filters?.selected_filters
          ?.advance_filters
      );
      localStorage.setItem(
        advFilterLocalStorageKey,
        JSON.stringify(
          nestedAutomationPayload?.automation_details?.filters?.selected_filters
            ?.advance_filters
        )
      );
    }
    //raw data name
    if (selectedDataSegment?.raw_data_name?.length > 0) {
      setListOfRawDataNames(
        selectedDataSegment?.raw_data_name?.map((name) => ({
          label: name,
          value: name,
        }))
      );
      setSelectedRawDataName(selectedDataSegment?.raw_data_name);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    advFilterLocalStorageKey,
    nestedAutomationPayload,
    selectedDataSegment,
    openCreateDataSegmentDrawer,
  ]);

  const setStartAndEndDateRange = (index, updatedDate) => {
    const prevDateRange = [...dateRange];
    prevDateRange[index] = updatedDate;
    setDateRange(prevDateRange);
  };

  const formRef = useRef();

  useEffect(() => {
    if (formRef?.current) {
      setDataSegmentPickerWidth(formRef.current?.clientWidth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef, selectedRawDataName]);

  const handleSelectDataType = (value) => {
    setSelectedDataType(value);
    setSelectedRawDataName([]);
    setDataTypeWarning(false);

    // resetting the previous selected filters to get the right data

    setSelectedVerificationStatus("");
    setSelectedState([]);
    setSelectedSource([]);
    setSelectedLeadType("");
    setSelectedLeadStage([]);
    setSelectedLeadStageLabel([]);
    setSelectedCounselor([]);
    setSelectedApplicationStage("");
    setSelectedPaymentStatus([]);
    setSelectedCourse([]);
    setSelectedTwelveBoard([]);
    setSelectedTwelveMarks([]);
    setSelectedFormFillingStage([]);
    setSelectedFormStage([]);
  };

  return (
    <Drawer
      anchor="right"
      onClose={handleCloseDrawer}
      open={openCreateDataSegmentDrawer}
      PaperProps={{
        sx: {
          width: fullScreen ? "100%" : mediumScreen ? "60%" : "45%",
        },
      }}
      sx={{ zIndex: zIndex ? 1300 : 1200 }}
    >
      <BackDrop openBackdrop={loadingCountOfEntries} text="Loading..." />
      {loadingCreateDataSegment && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <CircularProgress color="info" />
        </Box>
      )}
      {createDataSegmentInternalServerError ||
      somethingWentWrongInCreateDataSegment ? (
        <>
          {createDataSegmentInternalServerError && (
            <Error500Animation height={200} width={200}></Error500Animation>
          )}
          {somethingWentWrongInCreateDataSegment && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </>
      ) : (
        <Box sx={{ pt: 3, px: 4 }}>
          <form
            ref={formRef}
            onSubmit={(event) => {
              event.preventDefault();
              if (selectedDataSegment) {
                handleCloseDrawer();
              } else {
                handleDataSegmentCreation(event);
              }
            }}
          >
            <Typography className="create-data-segment-drawer-title">
              {selectedDataSegment?.data_segment_name?.length > 0
                ? selectedDataSegment?.data_segment_name
                : "Create Data Segment"}
            </Typography>

            <Box>
              <Box className="data-segment-flex-box">
                <Box>
                  <Input
                    readOnly={selectedDataSegment ? true : false}
                    value={dataSegmentName}
                    onChange={setDataSegmentName}
                    placeholder="Name"
                    type="text"
                    required
                    style={{
                      width: "100%",
                    }}
                  />
                </Box>
                <Box>
                  <SelectPicker
                    readOnly={
                      from === "automation" || selectedDataSegment
                        ? true
                        : false
                    }
                    data={dataSegmentTypes}
                    style={{
                      width: "100%",
                    }}
                    placeholder="Select Data Type"
                    value={selectedDataType}
                    onChange={(value) => {
                      handleSelectDataType(value);
                    }}
                    placement="bottomEnd"
                  />
                </Box>
              </Box>

              {dataTypeWarning && (
                <FormHelperText className="right-warning-text" variant="h6">
                  *Required
                </FormHelperText>
              )}
              <Box className="data-segment-flex-box">
                <Box>
                  <SelectPicker
                    readOnly={selectedDataSegment ? true : false}
                    data={segmentTypes}
                    style={{
                      width: "100%",
                    }}
                    placeholder="Segment Type"
                    value={selectedSegmentType}
                    onChange={(value) => {
                      setSelectedSegmentType(value);

                      setSegmentTypeWarning(false);

                      if (value === "Dynamic") {
                        setDurationWarning(false);
                      }
                      if (value === "Static") {
                        setSelectPeriodWarning(false);
                      }

                      setSelectedPeriod("");
                      setStartDate(null);
                      setEndDate(null);
                      setStartAndEndDate(null);
                      setDateRange([]);
                    }}
                    placement="bottomEnd"
                  />
                </Box>

                {(selectedSegmentType === "Static" || !selectedSegmentType) && (
                  <Box>
                    <DateRangePicker
                      readOnly={selectedDataSegment ? true : false}
                      aria-required
                      placeholder="Duration"
                      value={startAndEndDate}
                      onChange={(value) => {
                        setStartAndEndDate(value);
                        setDateRange(value);

                        setDurationWarning(false);
                      }}
                      style={{
                        width: "100%",
                      }}
                      placement="bottomEnd"
                    />
                  </Box>
                )}

                {selectedSegmentType === "Dynamic" && (
                  <Box>
                    <SelectPicker
                      readOnly={selectedDataSegment ? true : false}
                      data={dataSegmentationPeriodOptions}
                      placeholder="Select period"
                      onChange={(value) => {
                        handlePeriod(value);

                        setSelectPeriodWarning(false);

                        setStartDate(null);
                        setEndDate(null);
                        setDateRange([]);
                      }}
                      value={selectedPeriod}
                      style={{
                        width: "100%",
                      }}
                      placement="bottomEnd"
                    />
                  </Box>
                )}
              </Box>
              {segmentTypeWarning && (
                <FormHelperText className="left-warning-text" variant="h6">
                  *Required
                </FormHelperText>
              )}
              {durationWarning && (
                <FormHelperText className="right-warning-text" variant="h6">
                  *Required
                </FormHelperText>
              )}
              {selectPeriodWarning && (
                <FormHelperText className="right-warning-text" variant="h6">
                  *Required
                </FormHelperText>
              )}

              {selectedSegmentType === "Dynamic" &&
                selectedPeriod === "Custom" && (
                  <>
                    <Box className="data-segment-flex-box">
                      <Box>
                        <DatePicker
                          readOnly={selectedDataSegment ? true : false}
                          placeholder="Select Start Date"
                          value={startDate}
                          onChange={(value) => {
                            setStartDate(value);
                            setStartAndEndDateRange(0, value);
                            setStartDateWarning(false);
                          }}
                          style={{
                            width: "100%",
                          }}
                          placement="bottomEnd"
                        />
                      </Box>
                      <Box>
                        <DatePicker
                          readOnly={selectedDataSegment ? true : false}
                          placeholder="Select End Date"
                          value={endDate}
                          onChange={(value) => {
                            setEndDate(value);
                            setStartAndEndDateRange(1, value);
                          }}
                          style={{
                            width: "100%",
                          }}
                          placement="bottomEnd"
                          shouldDisableDate={(date) =>
                            isBefore(date, startDate)
                          }
                        />
                      </Box>
                    </Box>
                    {startDateWarning && (
                      <FormHelperText
                        className="left-warning-text"
                        variant="h6"
                      >
                        *Required
                      </FormHelperText>
                    )}
                  </>
                )}

              {selectedDataType === "Raw Data" && (
                <Box
                  sx={{ gridTemplateColumns: "1fr" }}
                  className="data-segment-flex-box"
                >
                  <CustomRawDataSelectPicker
                    loading={rawDataNameListInfo?.isFetching}
                    onOpen={() => setSkipRawDataNameApiCall(false)}
                    placement="bottomEnd"
                    readOnly={selectedDataSegment ? true : false}
                    columnOption={listOfRawDataNames}
                    multiCascaderDefaultValue={selectedRawDataName}
                    placeholder="Select Raw Data Name"
                    setMultiCascaderDefaultValue={setSelectedRawDataName}
                    style={{ maxWidth: dataSegmentPickerWidth || "" }}
                    maxHeight={250}
                  />
                </Box>
              )}
              <Box>
                <Box className="create-data-segment-drawer-filters">
                  <ReportFilter
                    from={"data-segment"}
                    reportType={selectedDataType}
                    selectedFilters={selectedFilters}
                    type={selectedDataSegment ? "Preview" : ""}
                    showLeadRelatedFilters={selectedDataType === "Lead"}
                  />
                </Box>

                {selectedDataType?.length > 0 && (
                  <>
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Box>
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
                            handleApplyFilters={handleGetCountOfEntries}
                            preview={selectedDataSegment}
                          />
                        )}
                      </Box>
                      {!selectedDataSegment && (
                        <button
                          type="button"
                          id="data-segment-apply-btn"
                          onClick={() => {
                            handleGetCountOfEntries();
                          }}
                        >
                          Apply
                        </button>
                      )}
                    </Box>

                    {countOfEntries >= 0 && (
                      <Box className="data-segment-entries-count-box">
                        <Typography className="count-of-entries-text">
                          Count of Entries :
                        </Typography>
                        <Typography className="count-of-entries-value">
                          {countOfEntries}
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>

            <Box
              className="data-segment-drawer-btn-box"
              sx={{
                marginTop: "20%",
              }}
            >
              {!selectedDataSegment && (
                <Button
                  className="data-segment-back-btn"
                  onClick={() => {
                    handleCloseDrawer();
                    if (from === "automation") {
                      handleManageCreateAutomationDialogue(true);
                    }
                  }}
                >
                  Back
                </Button>
              )}
              <Button id="data-segment-apply-btn" type="submit">
                Continue
              </Button>
            </Box>
          </form>
        </Box>
      )}
      {openViewDataSegmentDialog && (
        <Dialog
          open={openViewDataSegmentDialog}
          onClose={() => {
            setOpenViewDataSegmentDialog(false);
          }}
        >
          <DialogContent sx={{ p: 5, minWidth: 400 }}>
            <Typography className="view-dialog-text">
              Data segment has been created:
            </Typography>
            <Typography className="view-dialog-text">
              Data segment Name: {dataSegmentName}
            </Typography>
            <Typography className="view-dialog-text">
              Data type: {selectedDataType}
            </Typography>
            <Typography className="view-dialog-text">
              Total data generated count: {countOfEntries}
            </Typography>
            <Box className="data-segment-drawer-btn-box">
              <button
                onClick={() => {
                  setOpenViewDataSegmentDialog(false);
                  handleCloseDrawer();
                  navigate("/data-segment-details", {
                    state: {
                      segmentId: apisResponse?.data_segment_id,
                      module_name: apisResponse?.module_name,
                    },
                  });
                }}
                id="data-segment-apply-btn"
              >
                View Data Segment
              </button>
              {from === "automation" && (
                <Button
                  id="data-segment-apply-btn"
                  onClick={() => {
                    const updatedNestedAutomationPayload = {
                      ...nestedAutomationPayload,
                      automation_details: {
                        ...nestedAutomationPayload?.automation_details,
                        data_count: countOfEntries,
                        data_segment: [apisResponse],
                      },
                    };

                    navigate("/create-automation", {
                      state: {
                        template: false,
                        automationPayload: updatedNestedAutomationPayload,
                      },
                    });

                    setOpenViewDataSegmentDialog(false);
                    handleCloseDrawer();
                  }}
                >
                  Continue
                </Button>
              )}
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Drawer>
  );
};

export default React.memo(CreateDataSegmentDrawer);
