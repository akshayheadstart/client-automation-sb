import React, { useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import BootstrapDialogTitle from "../../shared/Dialogs/BootsrapDialogsTitle";
import { useState } from "react";
import {
  useAddTagToStudentMutation,
  useGetTagListsQuery,
} from "../../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
import useToasterHook from "../../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { useContext } from "react";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { Box } from "@mui/system";
const AddTagDialog = ({
  openDialog,
  setOpenDialog,
  studentId,
  setShouldCallLeadHeaderApiAgain,
}) => {
  const [selectedTag, setSelectedTag] = useState("");
  const [tagList, setTagList] = useState([]);
  const [skipCallTagList, setSkipCallTagList] = useState(true);
  const [loadingAddTag, setLoadingAddTag] = useState(false);
  const [internalServerError, setInternalServerError] = useState(false);
  const [somethingWentWrong, setSomethingWentWrong] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const { data, isError, error, loading, isSuccess } = useGetTagListsQuery(
    { collegeId },
    { skip: skipCallTagList }
  );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setTagList(data.data);
        } else {
          throw new Error("Tag list API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error.status === 500) {
          setInternalServerError(true);
        }
      }
    } catch (error) {
      somethingWentWrong(true);
      setApiResponseChangeMessage(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error, data]);

  const [addTagToStudent] = useAddTagToStudentMutation();
  const handleAddTagToStudent = (e) => {
    e.preventDefault();
    setLoadingAddTag(true);
    const addTagPayload = {
      student_ids: studentId,
      tags: [selectedTag],
    };

    addTagToStudent({
      payload: addTagPayload,
      collegeId,
    })
      .unwrap()
      .then((result) => {
        if (result?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result?.message) {
          try {
            pushNotification("success", result.message);
            setShouldCallLeadHeaderApiAgain &&
              setShouldCallLeadHeaderApiAgain((prev) => !prev);
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setSomethingWentWrong, "", 5000);
          }
        } else if (result?.detail) {
          pushNotification("error", result?.detail);
        }
      })
      .catch(() => {
        handleInternalServerError(setInternalServerError, "", 5000);
      })
      .finally(() => {
        setLoadingAddTag(false);
        handleCloseDialog();
      });
  };
  return (
    <Dialog
      fullScreen={fullScreen}
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="responsive-dialog-title"
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={handleCloseDialog}
      >
        Add Tag
      </BootstrapDialogTitle>
      {internalServerError || somethingWentWrong ? (
        <Box>
          {internalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <form onSubmit={(e) => handleAddTagToStudent(e)}>
          <DialogContent sx={{ py: 1.5 }}>
            <Autocomplete
              required
              sx={{ width: 300, mb: 2 }}
              onOpen={() => {
                setSkipCallTagList(false);
              }}
              getOptionLabel={(option) => option}
              options={tagList}
              onChange={(_, newValue) => {
                setSelectedTag(newValue);
              }}
              id="combo-box-demo"
              loading={loading}
              renderInput={(params) => (
                <TextField
                  color="info"
                  fullWidth
                  required
                  {...params}
                  label="Select Tag"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? (
                          <CircularProgress color="info" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
            {loadingAddTag ? (
              <CircularProgress sx={{ mr: 1 }} size={35} color="info" />
            ) : (
              <Button className="common-contained-button" type="submit">
                Save
              </Button>
            )}
            <Button
              className="common-outlined-button"
              onClick={handleCloseDialog}
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
};

export default AddTagDialog;
