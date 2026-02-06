import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React, { useState, useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import SearchApplicationInputField from "./SearchApplicationInputField";
import CustomLeadForm from "../../../../pages/ApplicationManager/CustomLeadForm";
import { useAssignCallToApplicationMutation } from "../../../../Redux/Slices/telephonySlice";
import { DashboradDataContext } from "../../../../store/contexts/DashboardDataContext";
import useToasterHook from "../../../../hooks/useToasterHook";
import { useSelector } from "react-redux";
import { handleSomethingWentWrong } from "../../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../../utils/handleInternalServerError";
import Error500Animation from "../../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../../hooks/ErrorFallback";

const AssignApplicationDialog = ({
  openDialog,
  setOpenDialog,
  callDetails,
  phoneNumber,
  missedCall,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [chosenOption, setChosenOption] = useState("select");
  const [selectedApplication, setSelectedApplication] = useState({});
  const [searchedApplication, setSearchedApplication] = useState([]);

  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

  const [assignCallLoading, setAssignCallLoading] = useState(false);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSearchedApplication([]);
    setSelectedApplication({});
  };

  const [assignCallToApplication] = useAssignCallToApplicationMutation();

  const handleAssignCallToApplication = (event) => {
    event.preventDefault();
    const payload = {
      call_id: callDetails?._id,
      application_id: selectedApplication?.application_id,
      phone_num: phoneNumber,
    };

    setAssignCallLoading(true);
    assignCallToApplication({
      payload,
      collegeId,
      missedCall,
    })
      .unwrap()
      .then((response) => {
        try {
          if (typeof response?.message === "string") {
            pushNotification("success", response?.message);
            handleCloseDialog();
          } else {
            throw new Error(
              "Assign call to application API response has been changed."
            );
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else {
          handleInternalServerError(setIsInternalServerError, "", 10000);
        }
      })
      .finally(() => {
        setAssignCallLoading(false);
      });
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={openDialog}
      onClose={handleCloseDialog}
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      {isInternalServerError || isSomethingWentWrong ? (
        <Box sx={{ minHeight: "20vh" }} className="common-not-found-container">
          {isInternalServerError && (
            <Error500Animation height={200} width={200}></Error500Animation>
          )}
          {isSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          <DialogContent sx={{ minWidth: 300 }}>
            <DialogContentText>
              <Box className="call-recording-container">
                <Typography>
                  {" "}
                  {chosenOption === "select"
                    ? " Assign Application"
                    : "Create Lead"}
                </Typography>

                <IconButton onClick={handleCloseDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box sx={{ my: 1 }}>
                <RadioGroup
                  className="assign-application-radio-option"
                  row
                  value={chosenOption}
                  onChange={(event) => setChosenOption(event.target.value)}
                >
                  <FormControlLabel
                    value="select"
                    control={<Radio color="info" />}
                    label="Select Application"
                  />
                  <FormControlLabel
                    value="create"
                    control={<Radio color="info" />}
                    label="Create Lead"
                  />
                </RadioGroup>
              </Box>
              {chosenOption === "select" ? (
                <Box sx={{ mb: "150px" }}>
                  <SearchApplicationInputField
                    searchedApplication={searchedApplication}
                    setSearchedApplication={setSearchedApplication}
                    selectedApplication={selectedApplication}
                    setSelectedApplication={setSelectedApplication}
                  />
                </Box>
              ) : (
                <Box>
                  <CustomLeadForm
                    showingInDialog={true}
                    setOpenDialog={setOpenDialog}
                    hideTitle={true}
                    callSource="Inbound Call"
                    phoneNumber={phoneNumber}
                  />
                </Box>
              )}
            </DialogContentText>
          </DialogContent>
          {chosenOption === "select" && (
            <Box className="assign-application-actions">
              <Button
                onClick={() => setOpenDialog(false)}
                className="common-outlined-button"
              >
                Cancel
              </Button>
              {assignCallLoading ? (
                <CircularProgress color="info" size={30} />
              ) : (
                <Button
                  onClick={handleAssignCallToApplication}
                  className="common-contained-button"
                  disabled={selectedApplication?.application_id ? false : true}
                >
                  Assign
                </Button>
              )}
            </Box>
          )}
        </>
      )}
    </Dialog>
  );
};

export default AssignApplicationDialog;
