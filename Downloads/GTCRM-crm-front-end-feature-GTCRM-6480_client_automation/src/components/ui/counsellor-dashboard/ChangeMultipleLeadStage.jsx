/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  TextField,
} from "@mui/material";
import BootstrapDialogTitle from "../../shared/Dialogs/BootsrapDialogsTitle";
import Cookies from "js-cookie";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import useToasterHook from "../../../hooks/useToasterHook";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { useSelector } from "react-redux";
import {
  useGetCounselorListQuery,
  useHandleLeadStageChangeMutation,
} from "../../../Redux/Slices/applicationDataApiSlice";
import SelectFollowupDate from "../../shared/SelectFollowupDate/SelectFollowupDate";
import formatDateAndTime from "../../../hooks/useDateAndTimeFormat";
import NoteTextField from "../../shared/NoteTextField/NoteTextField";
import SelectCounsellor from "../../shared/SelectCounsellor/SelectCounsellor";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";
import useFetchCommonApi from "../../../hooks/useFetchCommonApi";
import { customFetch } from "../../../pages/StudentTotalQueries/helperFunction";

const ChangeMultipleLeadStage = (props) => {
  const pushNotification = useToasterHook();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");

  const permissions = useSelector((state) => state.authentication.permissions); // user permissions objects

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const {
    leadStageObject,
    reFetchLabelApi,
    setSkipCallNameAndLabelApi,
    loadingLabelList,
  } = useFetchCommonApi();

  //change lead stage data
  const [leadStage, setLeadStage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [followupDate, setFollowUpDate] = useState(new Date());
  const [noteFieldValue, setNoteFieldValue] = useState("");
  const [dateTimeError, setDateTimeError] = useState(false);
  const [
    changeMultipleLeadStageInternalServerError,
    setChangeMultipleLeadStageInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInChangeMultipleLeadStage,
    setSomethingWentWrongInChangeMultipleLeadStage,
  ] = useState(false);
  const [selectedLeadStageLabel, setSelectedLeadStageLabel] = useState("");
  const [leadStageLabelList, setLeadStageLabelList] = useState([]);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const filter = createFilterOptions();

  const [leadStageLabelListForSelect, setLeadStageLabelListForSelect] =
    useState([]);

  useEffect(() => {
    for (let stageName in leadStageObject) {
      if (stageName === leadStage) {
        if (leadStageObject[stageName]?.length > 0) {
          const leadStageLabels = leadStageObject[stageName].map((item) => {
            return { title: item };
          });
          setLeadStageLabelList(leadStageLabels);

          const leadStageLabelsForSelect = leadStageObject[stageName].map(
            (item) => {
              return item;
            }
          );
          setLeadStageLabelListForSelect(leadStageLabelsForSelect);
        }
      }
    }
  }, [leadStage, leadStageObject]);
  const formattedFollowupDateDateAndTime = formatDateAndTime(followupDate);
  const [handleLeadStageChange] = useHandleLeadStageChangeMutation();
  const [assignedCounselorId, setAssignedCounselorId] = useState("");
  const addLeadStageLabel = () => {
    if (selectedLeadStageLabel?.title) {
      customFetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/followup_notes/add_lead_stage_label?lead_stage=${leadStage}${
          selectedLeadStageLabel?.title
            ? "&label=" + selectedLeadStageLabel?.title
            : ""
        }${collegeId ? "&college_id=" + collegeId : ""}`,
        ApiCallHeaderAndBody(token, "PUT")
      )
        .then((res) => res.json())
        .then((result) => {
          if (result?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (result?.code === 200) {
            reFetchLabelApi();
          } else if (result?.detail) {
            setIsLoading(false);
            pushNotification("error", result?.detail);
            props?.handleCloseDialogs();
          }
        })
        .catch(() => {
          handleInternalServerError(
            setChangeMultipleLeadStageInternalServerError,
            props?.handleCloseDialogs,
            5000
          );
        });
    }
  };
  const [changeMultipleLeadStageData, setChangeMultipleLeadStageData] =
    useState({});
  useEffect(() => {
    if (leadStage === "Follow-up") {
      setChangeMultipleLeadStageData((prevData) => ({
        application_id: props?.selectedApplicationIds,
        followup_date: formattedFollowupDateDateAndTime,
        followup_note: noteFieldValue,
        assigned_counselor_id: assignedCounselorId,
      }));
    } else {
      setChangeMultipleLeadStageData((prevData) => ({
        application_id: props?.selectedApplicationIds,
      }));
    }
  }, [
    leadStage,
    props?.selectedApplicationIds,
    assignedCounselorId,
    noteFieldValue,
  ]);
  //lead stage change handler function
  const handleMultipleLeadStageChange = (e) => {
    addLeadStageLabel();
    e.preventDefault();
    setIsLoading(true);
    handleLeadStageChange({
      leadStage,
      collegeId,
      selectedLeadStageLabel,
      permissions,
      changeMultipleLeadStageData: changeMultipleLeadStageData,
    })
      .unwrap()
      .then((data) => {
        try {
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data?.code === 200) {
            setIsLoading(false);
            pushNotification("success", "Lead stage changed successfully");
            props?.handleCloseDialogs();
            props?.setSelectedApplications([]);
            props?.localStorageKey &&
              localStorage.removeItem(
                `${Cookies.get("userId")}${props?.localStorageKey}`
              );
            props?.setSelectedEmails && props?.setSelectedEmails([]);
          } else if (data?.detail) {
            pushNotification("error", data?.detail);
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInChangeMultipleLeadStage,
            props?.handleCloseDialogs,
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
            setChangeMultipleLeadStageInternalServerError,
            props?.handleCloseDialogs,
            5000
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
        setLeadStage("");
        setSelectedLeadStageLabel("");
      });
  };
  const tokenState = useSelector((state) => state.authentication.token);
  const [counsellorList, setCounsellorList] = useState([]);
  // list option api calling state
  const [skipCounselorApiCall, setSkipCounselorApiCall] = useState(true);

  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId: collegeId },
    {
      skip: skipCounselorApiCall,
    }
  );
  //get counsellor list
  const { handleFilterListApiCall } = useCommonApiCalls();
  const [
    counsellorListInternalServerError,
    setCounsellorListInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInCounsellorList,
    setSomethingWentWrongInCounsellorList,
  ] = useState(false);
  const [hideCounsellorList, setHideCounsellorList] = useState(false);
  //get counsellor list
  useEffect(() => {
    if (!skipCounselorApiCall) {
      const counselorList = counselorListApiCallInfo.data?.data[0];
      handleFilterListApiCall(
        counselorList,
        counselorListApiCallInfo,
        setCounsellorList,
        setHideCounsellorList,
        null,
        null,
        setCounsellorListInternalServerError,
        setSomethingWentWrongInCounsellorList
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCounselorApiCall, counselorListApiCallInfo]);
  return (
    <Box>
      <Dialog
        onClose={() => {
          props?.handleCloseDialogs();
          setLeadStage("");
          setSelectedLeadStageLabel("");
        }}
        aria-labelledby="customized-dialog-title"
        open={props?.openDialogs}
        maxWidth={false}
      >
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={35} color="info" />
          </Box>
        )}
        <Box
          sx={{
            backgroundColor: "background.paper",
            minHeight: "100%",
            minWidth: "400px",
          }}
        >
          <BootstrapDialogTitle
            color={props?.color}
            id="customized-dialog-title"
            onClose={() => {
              props?.handleCloseDialogs();
              setLeadStage("");
              setSelectedLeadStageLabel("");
            }}
          >
            Change Lead Stage
          </BootstrapDialogTitle>
          {changeMultipleLeadStageInternalServerError ||
          somethingWentWrongInChangeMultipleLeadStage ||
          counsellorListInternalServerError ||
          somethingWentWrongInCounsellorList ? (
            <Box>
              {(changeMultipleLeadStageInternalServerError ||
                counsellorListInternalServerError) && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {(somethingWentWrongInChangeMultipleLeadStage ||
                somethingWentWrongInCounsellorList) && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  pb: 3,
                  pt: 2,
                  px: 2,
                }}
              >
                <form onSubmit={handleMultipleLeadStageChange}>
                  <Autocomplete
                    options={Object.keys(leadStageObject)}
                    onChange={(event, newValue) => {
                      setLeadStage(newValue);
                      setSelectedLeadStageLabel("");
                      if (newValue === "Follow-up") {
                        setFollowUpDate(new Date());
                      } else {
                        setFollowUpDate(null);
                      }
                    }}
                    id="combo-box-demo"
                    loading={loadingLabelList}
                    onOpen={() => setSkipCallNameAndLabelApi(false)}
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        required
                        {...params}
                        label="Lead Stage"
                        color="info"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loadingLabelList ? (
                                <CircularProgress color="info" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                  {leadStageObject[leadStage]?.length > 0 && (
                    <>
                      {permissions?.menus?.others?.add_lead_stage_label
                        ?.menu ? (
                        <Autocomplete
                          value={selectedLeadStageLabel}
                          onChange={(event, newValue) => {
                            if (typeof newValue === "string") {
                              setSelectedLeadStageLabel({
                                title: newValue,
                              });
                            } else if (newValue && newValue.inputValue) {
                              // Create a new value from the user input
                              setSelectedLeadStageLabel({
                                title: newValue.inputValue,
                              });
                            } else {
                              setSelectedLeadStageLabel(newValue);
                            }
                          }}
                          filterOptions={(options, params) => {
                            const filtered = filter(options, params);

                            const { inputValue } = params;
                            // Suggest the creation of a new value
                            const isExisting = options.some(
                              (option) => inputValue === option.title
                            );
                            if (inputValue !== "" && !isExisting) {
                              filtered.push({
                                inputValue,
                                title: `Add "${inputValue}"`,
                              });
                            }

                            return filtered;
                          }}
                          fullWidth
                          selectOnFocus
                          clearOnBlur
                          handleHomeEndKeys
                          id="free-solo-with-text-demo"
                          options={leadStageLabelList}
                          getOptionLabel={(option) => {
                            // Value selected with enter, right from the input
                            if (typeof option === "string") {
                              return option;
                            }
                            // Add "xxx" option created dynamically
                            if (option.inputValue) {
                              return option.inputValue;
                            }
                            // Regular option
                            return option.title;
                          }}
                          renderOption={(props, option) => (
                            <li {...props}>{option.title}</li>
                          )}
                          sx={{ mt: 2 }}
                          onOpen={() => setSkipCallNameAndLabelApi(false)}
                          loading={loadingLabelList}
                          freeSolo
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              inputProps={{
                                ...params.inputProps,
                                maxLength: 30,
                              }}
                              label="Add label(max 30 character) /Select label"
                              color="info"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    {loadingLabelList ? (
                                      <CircularProgress
                                        color="info"
                                        size={20}
                                      />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </React.Fragment>
                                ),
                              }}
                            />
                          )}
                        />
                      ) : (
                        <Autocomplete
                          sx={{ mt: 2 }}
                          value={selectedLeadStageLabel}
                          options={leadStageLabelListForSelect}
                          onChange={(event, newValue) => {
                            setSelectedLeadStageLabel(newValue);
                          }}
                          id="combo-box-demo"
                          onOpen={() => setSkipCallNameAndLabelApi(false)}
                          loading={loadingLabelList}
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              color="info"
                              {...params}
                              label="Select label"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    {loadingLabelList ? (
                                      <CircularProgress
                                        color="info"
                                        size={20}
                                      />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </React.Fragment>
                                ),
                              }}
                            />
                          )}
                        />
                      )}
                    </>
                  )}
                  {leadStage === "Follow-up" && (
                    <Box sx={{ mt: 2 }}>
                      <SelectFollowupDate
                        setDateTimeError={setDateTimeError}
                        setFollowUpDate={setFollowUpDate}
                        followupDate={followupDate}
                        dateTimeError={dateTimeError}
                      />
                      {!hideCounsellorList && (
                        <Box sx={{ mt: "20px" }}>
                          {(tokenState?.scopes?.[0] === "super_admin" ||
                            tokenState?.scopes?.[0] === "client_manager" ||
                            tokenState?.scopes?.[0] === "college_super_admin" ||
                            tokenState?.scopes?.[0] === "college_admin" ||
                            tokenState?.scopes?.[0] ===
                              "college_head_counselor") && (
                            <SelectCounsellor
                              loading={counselorListApiCallInfo.isFetching}
                              setSkipCounselorApiCall={setSkipCounselorApiCall}
                              counsellorList={counsellorList}
                              setSelectedCounsellorId={setAssignedCounselorId}
                              style={{ mb: 2 }}
                            />
                          )}
                        </Box>
                      )}
                    </Box>
                  )}
                  {leadStage === "Follow-up" && (
                    <NoteTextField setNoteFieldValue={setNoteFieldValue} />
                  )}

                  <Box sx={{ mt: 3, display: "grid", placeItems: "center" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="small"
                      color="info"
                    >
                      Save
                    </Button>
                  </Box>
                </form>
              </Box>
            </>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default React.memo(ChangeMultipleLeadStage);
