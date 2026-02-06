import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  DialogContent,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import React, { useContext, useEffect, useMemo } from "react";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import TimeLine from "./TimeLine";
import BootstrapDialogTitle from "../shared/Dialogs/BootsrapDialogsTitle";
import formatDateAndTime from "../../hooks/useDateAndTimeFormat";
import BaseNotFoundLottieLoader from "../shared/Loader/BaseNotFoundLottieLoader";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import SelectFollowupDate from "../shared/SelectFollowupDate/SelectFollowupDate";
import NoteTextField from "../shared/NoteTextField/NoteTextField";
import useToasterHook from "../../hooks/useToasterHook";
import {
  useGetStudentTimelineFollowupAndNotesQuery,
  useGetUserProfileHeaderInfoQuery,
  useUpdateFollowupMutation,
  useUpdateFollowupStatusMutation,
} from "../../Redux/Slices/applicationDataApiSlice";
import { followupUpdateApiInner } from "../../utils/followupUpdateApiInner";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import "../../styles/sharedStyles.css";
import useFetchCommonApi from "../../hooks/useFetchCommonApi";
import EmailTemplateDialogUserProfile from "../EmailTemplateDialogUserProfile/EmailTemplateDialogUserProfile";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { color, Stack } from "@mui/system";
import { customFetch } from "../../pages/StudentTotalQueries/helperFunction";
const ChangeLeadStage = (props) => {
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const pushNotification = useToasterHook();
  const permissions = useSelector((state) => state.authentication.permissions); // user permissions objects

  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const {
    leadStageObject,
    reFetchLabelApi,
    setSkipCallNameAndLabelApi,
    loadingLabelList,
  } = useFetchCommonApi();

  //change lead stage data
  const [leadStage, setLeadStage] = useState("");
  const [followupDate, setFollowUpDate] = useState(new Date());
  const [dateTimeError, setDateTimeError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noteFieldValue, setNoteFieldValue] = useState("");
  const [
    changeLeadStageInternalServerError,
    setChangeLeadStageInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInChangeLeadStage,
    setSomethingWentWrongInChangeLeadStage,
  ] = useState(false);
  const [selectedLeadStageLabel, setSelectedLeadStageLabel] = useState("");
  const [leadStageLabelList, setLeadStageLabelList] = useState([]);

  const formattedFollowupDateDateAndTime = formatDateAndTime(followupDate);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const changeLeadStageDataForFollowup = {
    followup: {
      followup_date: formattedFollowupDateDateAndTime,
      followup_note: noteFieldValue,
    },
    lead_stage: leadStage,
  };

  const changeLeadStageDataForOthers = {
    note: noteFieldValue,
    lead_stage: leadStage,
    lead_stage_label: permissions?.menus?.others?.add_lead_stage_label?.menu
      ? selectedLeadStageLabel?.title
      : selectedLeadStageLabel,
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleModalButton = () => {
    handleClose();
    handleLeadStageChange();
  };
  const [updateLeadStage] = useUpdateFollowupMutation();
  const { data: followupsData } = useGetStudentTimelineFollowupAndNotesQuery(
    {
      collegeId,
      applicationId: props?.applicationId,
    },
    { skip: props?.applicationId ? false : true }
  );
  const allIncompleteFollowups = useMemo(() => {
    return followupsData?.followups?.filter(
      (item) => item.status === "Incomplete"
    );
  }, [followupsData]);

  const handleLeadStageChange = (e) => {
    addLeadStageLabel();

    setIsLoading(true);
    updateLeadStage({
      applicationId: props?.applicationId,
      followupData: followupDate
        ? changeLeadStageDataForFollowup
        : changeLeadStageDataForOthers,
      collegeId: collegeId,
      checkedValue:
        allIncompleteFollowups.length > 0 &&
        props.userRecentState === "Follow-up"
          ? true
          : false,
    })
      .unwrap()
      .then((res) => {
        followupUpdateApiInner(
          res,
          pushNotification,
          props,
          setNoteFieldValue,
          setApiResponseChangeMessage,
          handleSomethingWentWrong,
          setSomethingWentWrongInChangeLeadStage
        );
        e?.target?.reset();
      })
      .catch(() => {
        handleInternalServerError(
          setChangeLeadStageInternalServerError,
          props?.handleCloseDialogs,
          5000
        );
      })
      .finally(() => setIsLoading(false));
  };

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
            setChangeLeadStageInternalServerError,
            props?.handleCloseDialogs,
            5000
          );
        });
    }
  };
  //show template
  const [openEmailTemplate, setOpenEmailTemplate] = React.useState(false);
  const handleClickEmailTemplateOpen = () => {
    setOpenEmailTemplate(true);
  };

  const handleEmailTemplateClose = () => {
    setOpenEmailTemplate(false);
  };
  const [selectedEmailTemplateId, setSelectedEmailTemplateId] = useState({});
  return (
    <Box sx={{ backgroundColor: "rgba(255, 255, 255, 1)" }}>
      <Dialog
        onClose={() => {
          props?.handleCloseDialogs();
          setFollowUpDate(null);
          setDateTimeError(false);
          setNoteFieldValue("");
          setLeadStage("");
          setSelectedLeadStageLabel("");
        }}
        aria-labelledby="customized-dialog-title"
        open={props?.openDialogs}
        className="change-dialog-box-container"
      >
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={35} color="info" />
          </Box>
        )}
        <DialogContent
          className="vertical-scrollbar"
          sx={{
            backgroundColor: "background.paper",
            minHeight: "100%",
            p: "10px",
          }}
        >
          <BootstrapDialogTitle
            color={props?.color}
            id="customized-dialog-title"
            onClose={() => {
              props?.handleCloseDialogs();
              setFollowUpDate(null);
              setDateTimeError(false);
              setNoteFieldValue("");
              setLeadStage("");
              setSelectedLeadStageLabel("");
            }}
          >
            Change Lead Stage
          </BootstrapDialogTitle>
          {changeLeadStageInternalServerError ||
          somethingWentWrongInChangeLeadStage ? (
            <Box>
              {changeLeadStageInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrongInChangeLeadStage && (
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
                  px: 2,
                }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault(); // Prevent default form submission behavior

                    if (
                      allIncompleteFollowups?.length > 0 &&
                      props.userRecentState === "Follow-up"
                    ) {
                      handleOpen(); // Call handleOpen to open the modal
                    } else {
                      handleLeadStageChange(); // Call handleLeadStageChange to handle form submission
                    }
                  }}
                >
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
                    onOpen={() => setSkipCallNameAndLabelApi(false)}
                    renderInput={(params) => (
                      <TextField
                        color="info"
                        fullWidth
                        required
                        {...params}
                        label="Lead Stage"
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
                              color="info"
                              label="Add label(max 30 character) /Select label"
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
                              color="info"
                              fullWidth
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
                    </Box>
                  )}
                  <NoteTextField setNoteFieldValue={setNoteFieldValue} />
                  <br />
                  <Tooltip
                    title={
                      isNaN(new Date(followupDate).getTime()) || dateTimeError
                        ? "Enter valid followup date."
                        : ""
                    }
                    arrow
                    placement="top"
                  >
                    <Box
                      sx={{
                        cursor:
                          isNaN(new Date(followupDate).getTime()) ||
                          dateTimeError
                            ? "not-allowed"
                            : "pointer",
                        display: "flex",
                        justifyContent: "center",
                        gap: "20px",
                        mt: 2,
                      }}
                    >
                      <Button
                        sx={{
                          pointerEvents:
                            isNaN(new Date(followupDate).getTime()) ||
                            dateTimeError
                              ? "none"
                              : "auto",
                          borderRadius: 50,
                        }}
                        type="submit"
                        variant="contained"
                        size="small"
                        color="info"
                        className="save-button-design"
                      >
                        Save
                      </Button>
                      <Button
                        sx={{
                          borderRadius: 50,
                        }}
                        variant="outlined"
                        size="small"
                        type="button"
                        color="info"
                        className="cancel-button-design"
                        onClick={() => props?.handleCloseDialogs()}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Tooltip>
                </form>
              </Box>
            </>
          )}
          {props?.timelineInternalServerError ||
          props?.somethingWentWrongInTimeline ? (
            <Box>
              {props?.timelineInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {props?.somethingWentWrongInTimeline && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </Box>
          ) : (
            <Box sx={{ display: props?.hideTimeline ? "none" : "block" }}>
              {props?.timeLineData?.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    pb: 2,
                  }}
                >
                  <BaseNotFoundLottieLoader
                    height={150}
                    width={150}
                  ></BaseNotFoundLottieLoader>
                </Box>
              ) : (
                <TimeLine
                  toggle={false}
                  timeLineData={props?.timeLineData}
                  timelineToggle={props?.timelineToggle}
                  handleClickEmailTemplateOpen={handleClickEmailTemplateOpen}
                  setSelectedEmailTemplateId={setSelectedEmailTemplateId}
                  clickEvent={true}
                ></TimeLine>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
      {openEmailTemplate && (
        <EmailTemplateDialogUserProfile
          handleEmailTemplateClose={handleEmailTemplateClose}
          openEmailTemplate={openEmailTemplate}
          selectedEmailTemplateId={selectedEmailTemplateId}
        />
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modalContainer">
          <IconButton sx={{ color: "black", marginLeft: "140px" }}>
            <ErrorOutlineIcon fontSize="large" />
          </IconButton>
          <Typography id="modal-modal-description" className="modalDescription">
            <b> Incomplete Followup Found</b> for <br></br>
            {(allIncompleteFollowups && allIncompleteFollowups[0]?.due) || ""}
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{ marginTop: "10px", marginLeft: "18px" }}
          >
            <Button
              onClick={handleModalButton}
              variant="contained"
              size="small"
              sx={{
                fontSize: " 12px",
                borderRadius: "30px",
                backgroundColor: "#008CE0",
              }}
            >
              Resolve & Update
            </Button>
            <Button
              onClick={handleModalButton}
              variant="outlined"
              size="small"
              sx={{
                color: "black",
                fontSize: "12px",
                borderRadius: "30px",
                borderColor: " #008CE0",
                fontWeight: "100",
              }}
            >
              Change Lead Stage
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};
export default ChangeLeadStage;
