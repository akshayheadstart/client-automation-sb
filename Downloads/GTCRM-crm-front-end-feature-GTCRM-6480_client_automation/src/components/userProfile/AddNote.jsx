import { Box, Button, CircularProgress, DialogContent } from "@mui/material";
import React, { useContext, useState } from "react";
import Dialog from "@mui/material/Dialog";
import TimeLine from "./TimeLine";
import BootstrapDialogTitle from "../shared/Dialogs/BootsrapDialogsTitle";
import BaseNotFoundLottieLoader from "../shared/Loader/BaseNotFoundLottieLoader";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import NoteTextField from "../shared/NoteTextField/NoteTextField";
import useToasterHook from "../../hooks/useToasterHook";
import { useSelector } from "react-redux";
import "../../styles/sharedStyles.css";
import { useUpdateFollowupMutation } from "../../Redux/Slices/applicationDataApiSlice";

const AddNote = (props) => {
  const pushNotification = useToasterHook();
  const [noteText, setNoteText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [addNoteInternalServerError, setAddNoteInternalServerError] =
    useState(false);
  const [somethingWentWrongInAddNote, setSomethingWentWrongInAddNote] =
    useState(false);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [updateFollowupList] = useUpdateFollowupMutation();

  const handleAddNote = (event) => {
    event.preventDefault();
    const updatedNote = { note: noteText };

    setIsLoading(true);
    updateFollowupList({
      applicationId: props?.applicationId,
      followupData: updatedNote,
      collegeId: collegeId,
    })
      .unwrap()
      .then((res) => {
        if (res.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.code === 200) {
          try {
            setIsLoading(false);
            pushNotification("success", "Note is added successfully.");
            setNoteText("");
            props?.handleCloseDialogs();
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInAddNote,
              props?.handleCloseDialogs,
              5000
            );
          }
        } else if (res.detail) {
          setIsLoading(false);
          pushNotification("error", res.detail);
          setNoteText("");
          props?.handleCloseDialogs();
        }
      })
      .catch(() => {
        handleInternalServerError(
          setAddNoteInternalServerError,
          props?.handleCloseDialogs,
          5000
        );
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Box>
      <Dialog
        onClose={() => {
          props?.handleCloseDialogs();
          setNoteText("");
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
            color={"black"}
            id="customized-dialog-title"
            onClose={() => {
              props?.handleCloseDialogs();
              setNoteText("");
            }}
          >
            Add Note
          </BootstrapDialogTitle>
          {addNoteInternalServerError || somethingWentWrongInAddNote ? (
            <Box>
              {addNoteInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrongInAddNote && (
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
                <form onSubmit={handleAddNote}>
                  <NoteTextField
                    style={{ mt: 0 }}
                    setNoteFieldValue={setNoteText}
                  />
                  <Box sx={{ display: "grid", placeItems: "center" }}>
                    <Button
                      sx={{ mt: 2, borderRadius: 50 }}
                      type="submit"
                      variant="contained"
                      size="small"
                      color="info"
                      className="save-button-design"
                    >
                      Save
                    </Button>
                  </Box>
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
              {props?.followUpData?.length === 0 ? (
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
                  timeLineData={props?.followUpData}
                ></TimeLine>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AddNote;
