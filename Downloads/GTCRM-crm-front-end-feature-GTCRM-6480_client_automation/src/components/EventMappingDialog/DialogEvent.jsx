import DeleteIcon from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useDeleteEventMutation } from "../../Redux/Slices/applicationDataApiSlice";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/dialogEvent.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { nameValidation } from "../../utils/validation";
import DeleteDialogue from "../shared/Dialogs/DeleteDialogue";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { useSelector } from "react-redux";
import "../../styles/sharedStyles.css";
import { customFetch } from "../../pages/StudentTotalQueries/helperFunction";
const DialogEvent = ({
  dialogOpen,
  handleDialogClose,
  toggle,
  event,
  handleFromFunction,
  setEventName,
  setEventType,
  setEventStartDate,
  setEventEndDate,
  setEventDescription,
  eventStartDate,
  eventEndDate,
  somethingWentWrongInCreateEvent,
  createEventInternalServerError,
  loading,
  event_description,
  eventType,
  eventName,
  deleteIcon,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const [errorEventName, setErrorEventName] = useState("");
  const [errorEventDes, setErrorEventDes] = useState("");
  const [eventTypes, setEventTypes] = useState([]);
  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [
    eventDeleteInternalServerError,
    setEventDeleteInternalServerErrorInternalServerError,
  ] = useState(false);
  const [somethingWentWrongInEventDelete, setSomethingWentWrongInEventDelete] =
    useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [eventId, setEventId] = useState("");
  const [
    somethingWentWrongInEventTypesApi,
    setSomethingWentWrongInEventTypesApi,
  ] = useState(false);
  const [
    eventTypesApiInternalServerError,
    setEventTypesApiInternalServerError,
  ] = useState(false);

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/event/types${
      collegeId ? "?college_id=" + collegeId : ""
    }`;
    customFetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else if (result.data) {
          try {
            if (Array.isArray(result?.data)) {
              setEventTypes(result?.data);
            } else {
              throw new Error("search Event Types API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInEventTypesApi,
              "",
              10000
            );
          }
        }
      })
      .catch(() => {
        handleInternalServerError(
          setEventTypesApiInternalServerError,
          "",
          5000
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const [deleteEvent] = useDeleteEventMutation();

  const handleDeleteEvent = () => {
    deleteEvent({ eventId, collegeId })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              pushNotification("success", res?.message);
              handleDialogClose();
            } else {
              throw new Error(
                "update status of event API response has changed"
              );
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInEventDelete,
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
          setEventDeleteInternalServerErrorInternalServerError,
          "",
          5000
        );
      });
  };
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        {loading === true ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "5px",
            }}
          >
            <CircularProgress color="info" />
          </Box>
        ) : (
          ""
        )}

        {toggle === false ? (
          <>
            {createEventInternalServerError ||
            somethingWentWrongInCreateEvent ||
            somethingWentWrongInEventTypesApi ||
            eventTypesApiInternalServerError ? (
              <>
                {createEventInternalServerError && (
                  <Error500Animation
                    height={400}
                    width={400}
                  ></Error500Animation>
                )}
                {somethingWentWrongInCreateEvent && (
                  <ErrorFallback
                    error={apiResponseChangeMessage}
                    resetErrorBoundary={() => window.location.reload()}
                  />
                )}
              </>
            ) : (
              <>
                <Box
                  sx={{ display: "grid", placeItems: "end", padding: "10px" }}
                >
                  {deleteIcon === true ? (
                    <Tooltip title="Delete" placement="bottom">
                      <DeleteIcon
                        onClick={() => {
                          handleOpenDeleteModal();
                          setEventId(event?._id);
                        }}
                        sx={{ color: "red", cursor: "pointer" }}
                      />
                    </Tooltip>
                  ) : (
                    ""
                  )}
                </Box>
                <form onSubmit={handleFromFunction}>
                  <DialogContent
                    sx={{ textAlign: "center", p: "30px !important" }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12} md={6}>
                        <TextField
                          required
                          defaultValue={eventName}
                          fullWidth="50%"
                          placeholder="Event Name"
                          id="filled-size-normal"
                          helperText={errorEventName}
                          error={errorEventName}
                          color="info"
                          onChange={(e) => {
                            const isCharValid = nameValidation(e.target.value);
                            if (e.target.value.length < 2) {
                              setErrorEventName("At least 2 characters ");
                            } else if (isCharValid) {
                              setErrorEventName("");
                              setEventName(e.target.value);
                            } else {
                              setErrorEventName(
                                "Numbers and Special characters aren't allowed"
                              );
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6}>
                        <Autocomplete
                          disablePortal
                          defaultValue={eventType}
                          id="combo-box-demo"
                          options={eventTypes}
                          isOptionEqualToValue={(option, value) =>
                            option?.label === value?.label
                          }
                          onChange={(event, value) => {
                            setEventType(value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              required
                              color="info"
                              className="event-type-label-container"
                              {...params}
                              label="Event type"
                            />
                          )}
                        />
                      </Grid>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid item xs={12} sm={12} md={6}>
                          <DesktopDatePicker
                            value={eventStartDate ? eventStartDate : null}
                            label="Start Date"
                            format="dd/MM/yyyy"
                            sx={{ width: "100%" }}
                            onChange={(date) => setEventStartDate(date)}
                            renderInput={(params) => (
                              <TextField
                                required
                                color="info"
                                onKeyDown={(e) => e.preventDefault()}
                                fullWidth
                                {...params}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                          <DesktopDatePicker
                            required
                            label="End Date"
                            value={eventEndDate ? eventEndDate : null}
                            format="dd/MM/yyyy"
                            sx={{ width: "100%" }}
                            onChange={(date) => setEventEndDate(date)}
                            renderInput={(params) => (
                              <TextField
                                color="info"
                                onKeyDown={(e) => e.preventDefault()}
                                fullWidth
                                required
                                {...params}
                              />
                            )}
                          />
                        </Grid>
                      </LocalizationProvider>
                      <Grid item xs={12} sm={12} md={12}>
                        <TextField
                          defaultValue={event_description}
                          required
                          fullWidth="100%"
                          placeholder="Description"
                          id="filled-size-normal"
                          multiline
                          color="info"
                          rows={4}
                          helperText={errorEventDes}
                          error={errorEventDes}
                          onChange={(e) => {
                            const isCharValid = nameValidation(e.target.value);
                            if (e.target.value.length < 2) {
                              setErrorEventDes("At least 2 characters ");
                            } else if (isCharValid) {
                              setErrorEventDes("");
                              setEventDescription(e.target.value);
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </DialogContent>

                  <Box className="event-button-container">
                    <Button
                      sx={{ borderRadius: 50 }}
                      data-testid="cancelBtnModal"
                      autoFocus
                      onClick={handleDialogClose}
                      variant="outlined"
                      size="medium"
                      color="info"
                      className="cancel-button-design"
                    >
                      Cancel
                    </Button>
                    <Button
                      sx={{ bgcolor: "#3498db", borderRadius: 50 }}
                      autoFocus
                      className="save-button-design"
                      variant="contained"
                      size="medium"
                      type="submit"
                    >
                      {deleteIcon === true ? "Update" : "Create"}
                    </Button>
                  </Box>
                </form>
              </>
            )}
          </>
        ) : (
          ""
        )}
        {toggle === true ? (
          <>
            <div>
              <Dialog
                fullScreen={fullScreen}
                open={dialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogContent
                  sx={{ margin: "20px" }}
                  className="vertical-scrollbar"
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12}>
                      <Box>
                        <Typography
                          sx={{ textAlign: "center", mb: 1 }}
                          variant="h5"
                        >
                          Event Details
                        </Typography>
                        <Typography variant="subtitle1">Event Name</Typography>
                        <Box className="dialogEvent-details-desc">
                          <Typography variant="body1">
                            {event?.event_name ? event.event_name : "N/A"}
                          </Typography>
                        </Box>
                        <Typography variant="subtitle1">Event Date</Typography>
                        <Box className="dialogEvent-details-desc">
                          <Typography variant="body1">
                            Start Date :{" "}
                            {event?.event_start_date
                              ? event.event_start_date
                              : "N/A"}
                          </Typography>
                        </Box>
                        <Box className="dialogEvent-details-desc">
                          <Typography variant="body1">
                            End Date :{" "}
                            {event?.event_end_date
                              ? event?.event_end_date
                              : "N/A"}
                          </Typography>
                        </Box>
                        <Typography variant="subtitle1">Event Type</Typography>
                        <Box className="dialogEvent-details-desc">
                          <Typography variant="body1">
                            {event?.event_type ? event?.event_type : "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle1">
                          Event Description
                        </Typography>
                        <Box>
                          <TextField
                            InputProps={{
                              readOnly: true,
                            }}
                            sx={{ width: "300px" }}
                            id="filled-multiline-static"
                            multiline
                            rows={4}
                            defaultValue={
                              event?.event_description
                                ? event?.event_description
                                : "N/A"
                            }
                            color="info"
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </DialogContent>
                <Box className="event-button-container">
                  <Button
                    sx={{ bgcolor: "#3498db", borderRadius: 50 }}
                    data-testid="cancelBtnDialog"
                    autoFocus
                    onClick={handleDialogClose}
                    className="button-custom-design"
                    variant="contained"
                    size="small"
                  >
                    Close
                  </Button>
                </Box>
              </Dialog>
            </div>
          </>
        ) : (
          ""
        )}
      </Dialog>
      <DeleteDialogue
        openDeleteModal={openDeleteModal}
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleDeleteSingleTemplate={handleDeleteEvent}
        internalServerError={eventDeleteInternalServerError}
        somethingWentWrong={somethingWentWrongInEventDelete}
        apiResponseChangeMessage={apiResponseChangeMessage}
      />
    </div>
  );
};

export default DialogEvent;
