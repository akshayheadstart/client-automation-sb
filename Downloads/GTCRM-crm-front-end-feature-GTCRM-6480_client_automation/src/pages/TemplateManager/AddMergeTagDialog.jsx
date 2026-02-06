import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useState } from "react";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import ClientRegTextField from "../../components/shared/ClientRegistration/ClientRegTextField";
import { useAddMergeTagMutation } from "../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
import useToasterHook from "../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";

function AddMergeTagDialog({ open, handleClose }) {
  const [isLoading, setIsLoading] = useState(false);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();

  const [internalServerError, setInternalServerError] = useState(false);
  const [somethingWentWrong, setSomethingWentWrong] = useState(false);
  const [tagValue, setTagValue] = useState("");
  const [tagName, setTagName] = useState("");

  const [addMergeTag] = useAddMergeTagMutation();
  const handleAddMergeTag = (e) => {
    e.preventDefault();
    setIsLoading(true);
    addMergeTag({
      collegeId,
      payload: { field_name: tagName, value: tagValue },
    })
      .unwrap()
      .then((response) => {
        try {
          if (response?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (response?.detail) {
            pushNotification("error", response?.detail);
          }
          if (response?.message) {
            pushNotification("success", response?.message);
            handleClose();
            setTagName("");
            setTagValue("");
          } else {
            throw new Error("Add merge tag API's response has been changed.");
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setSomethingWentWrong, handleClose, 5000);
        }
      })
      .catch(() => {
        handleInternalServerError(setInternalServerError, handleClose, 5000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Dialog maxWidth={"md"} open={open} onClose={handleClose}>
      {internalServerError || somethingWentWrong ? (
        <Box>
          {internalServerError && (
            <Error500Animation height={400} width={400} />
          )}
          {somethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <form onSubmit={handleAddMergeTag}>
          <DialogTitle sx={{ pb: 0, color: "rgb(79, 79, 79)" }}>
            Add Merge Tag
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <ClientRegTextField
                label="Tag Name"
                size="small"
                value={tagName}
                setValue={setTagName}
              />
              <ClientRegTextField
                label="Tag Value"
                multiline={true}
                rows={4}
                value={tagValue}
                setValue={setTagValue}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: "center" }}>
            <Button className="common-outlined-button" onClick={handleClose}>
              Cancel
            </Button>
            {isLoading ? (
              <Box>
                <CircularProgress value={25} color="info" />
              </Box>
            ) : (
              <Button className="common-contained-button" type="submit">
                Save
              </Button>
            )}
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}

export default AddMergeTagDialog;
