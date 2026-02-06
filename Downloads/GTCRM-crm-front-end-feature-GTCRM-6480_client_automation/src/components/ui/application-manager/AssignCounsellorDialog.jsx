import React, { useContext, useState } from "react";
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
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import useToasterHook from "../../../hooks/useToasterHook";
import { useMultipleLeadAssignToCounselorMutation } from "../../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
import "../../../styles/sharedStyles.css";

const AssignCounsellorDialog = (props) => {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [isLoading, setIsLoading] = useState(false);

  //counsellor state
  const [selectedCounsellorId, setSelectedCounsellorId] = useState("");
  const [
    assignCounsellorInternalServerError,
    setAssignCounsellorInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInAssignCounsellor,
    setSomethingWentWrongInAssignCounsellor,
  ] = useState(false);

  const pushNotification = useToasterHook();
  const [multipleLeadAssignToCounselor] =
    useMultipleLeadAssignToCounselorMutation();
  //  assign multiple leads to counsellor function
  const handleMultipleLeadAssignToCounsellor = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const selectedApplicationsToAssign = {
      application_id: props?.selectedApplicationIds,
    };

    multipleLeadAssignToCounselor({
      selectedCounsellorId,
      selectedApplicationsToAssign,
      collegeId,
    })
      .unwrap()
      .then((result) => {
        if (result?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result?.code === 200) {
          try {
            setIsLoading(false);
            pushNotification("success", "Counsellor assigned successfully");
            props?.handleCloseDialogs();
            props?.setSelectedApplications &&
              props?.setSelectedApplications([]);
            localStorage &&
              localStorage.removeItem(
                `${Cookies.get("userId")}${props?.localStorageKey}`
              );
            props?.setSelectedEmails && props?.setSelectedEmails([]);
            props?.setShouldCallLeadProfileHeader &&
              props?.setShouldCallLeadProfileHeader((prevState) => !prevState);
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInAssignCounsellor,
              props?.handleCloseDialogs,
              5000
            );
          }
        } else if (result?.detail) {
          setIsLoading(false);
          pushNotification("error", result?.detail);
          props?.handleCloseDialogs();
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setAssignCounsellorInternalServerError,
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
        }}
        aria-labelledby="customized-dialog-title"
        open={props?.openDialogs}
        maxWidth={false}
        className="change-dialog-box-container"
      >
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
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
            }}
          >
            Change Counsellor
          </BootstrapDialogTitle>
          {assignCounsellorInternalServerError ||
          somethingWentWrongInAssignCounsellor ? (
            <Box>
              {assignCounsellorInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrongInAssignCounsellor && (
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
                <form onSubmit={handleMultipleLeadAssignToCounsellor}>
                  <Autocomplete
                    onOpen={() => {
                      props?.setCallFilterOptionApi &&
                        props.setCallFilterOptionApi((prev) => ({
                          ...prev,
                          skipCounselorApiCall: false,
                        }));
                      props?.setSkipCounselorApiCall &&
                        props.setSkipCounselorApiCall(false);
                    }}
                    getOptionLabel={(option) =>
                      option?.label ? option?.label : option?.name
                    }
                    options={props?.counsellorList}
                    onChange={(event, newValue) => {
                      setSelectedCounsellorId(
                        newValue?.value ? newValue?.value : newValue?.id
                      );
                    }}
                    id="combo-box-demo"
                    loading={props.loading ? props.loading : false}
                    renderInput={(params) => (
                      <TextField
                        color="info"
                        fullWidth
                        required
                        {...params}
                        label="Select Counselor"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {props.loading ? (
                                <CircularProgress color="info" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />

                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "center",
                      gap: "15px",
                    }}
                  >
                    <Button type="submit" className="common-contained-button">
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        props?.handleCloseDialogs();
                      }}
                      className="common-outlined-button"
                    >
                      Cancel
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

export default AssignCounsellorDialog;
