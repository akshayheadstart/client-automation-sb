import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useUpdateAndEditUserInfoMutation } from "../../Redux/Slices/applicationDataApiSlice";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/userManagerEditInfoDialog.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { isValidEmail, isValidPhoneNumber } from "../../utils/validation";
import { SharedTextField } from "./CreateUser";

const UserManagerEditInfoDialog = ({
  handleEditInfoDialogClose,
  openEditInfoDialog,
  selectedUserInfo,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [updateEmail, setUpdateEmail] = useState(
    selectedUserInfo?.user_email ? selectedUserInfo?.user_email : ""
  );
  const [errorUpdateEmail, setErrorUpdateEmail] = useState("");
  const [updatePhoneNumber, setUpdatePhoneNumber] = useState(
    selectedUserInfo?.mobile_number ? selectedUserInfo?.mobile_number : ""
  );
  const [updateDailyLimit, setUpdateDailyLimit] = useState(
    selectedUserInfo?.daily_limit ? selectedUserInfo?.daily_limit : ""
  );
  const [updateBulkLimit, setUpdateBulkLimit] = useState(
    selectedUserInfo?.bulk_limit ? selectedUserInfo?.bulk_limit : ""
  );
  const source = selectedUserInfo?.source ? selectedUserInfo?.source : "";
  const name =  selectedUserInfo?.user_name ? selectedUserInfo?.user_name : "";
  const [errorUpdatePhoneNumber, setErrorUpdatePhoneNumber] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);
  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [updateAndEditUser] = useUpdateAndEditUserInfoMutation();
  const [userInfoEditInternalServerError, setUserInfoEditInternalServerError] =
    useState(false);
  const [
    somethingWentWrongInuserInfoEditUpdate,
    setSomethingWentWrongInUserInfoEditUpdate,
  ] = useState(false);
  const payload = {
    email: updateEmail,
    mobile_number: updatePhoneNumber,
    daily_limit: updateDailyLimit,
    bulk_limit: updateBulkLimit,
  };
  const [loading, setLoading] = useState(false);
  const handleUserUpdateAndEditUserInfo = () => {
    setLoading(true);
    updateAndEditUser({ userId: selectedUserInfo?.user_id, payload, collegeId })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              pushNotification("success", res?.message);
              handleEditInfoDialogClose();
            } else {
              throw new Error("enable_or_disable API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInUserInfoEditUpdate,
              "",
              5000
            );
          }
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        }
      })
      .catch((error) => {
        handleInternalServerError(setUserInfoEditInternalServerError, "", 5000);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div>
      <Dialog
       
        open={openEditInfoDialog}
        onClose={handleEditInfoDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        {somethingWentWrongInuserInfoEditUpdate ||
        userInfoEditInternalServerError ? (
          <>
            {userInfoEditInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {somethingWentWrongInuserInfoEditUpdate && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </>
        ) : (
          <>
            <Box className="user-manager-edit-info-head-container">
              <Typography className="user-manager-edit-info-head-text" >
                {" "}
                Update User Details
              </Typography>
            </Box>
            {loading && (
              <Box sx={{ display: "grid", placeItems: "center" }}>
                <CircularProgress color="info" />
              </Box>
            )}
            <Box className="user-manager-edit-info-box-data-container">
             <Grid container spacing={2}>
                <Grid item sm={6} xs={12}>
                 <TextField
                 fullWidth 
                   label="Name"
                   size="small"
                   defaultValue={name} 
                   InputProps={{
                    readOnly: true,
                  }}/>
              </Grid>
              {selectedUserInfo?.source ? (
                  <Grid item sm={6} xs={12}>
                   <TextField
                   fullWidth 
                   label="Source"
                   size="small"
                   defaultValue={source} 
                   InputProps={{
                    readOnly: true,
                  }}/>
                </Grid>
              ) : (
                ""
              )}
              <Grid item sm={6} xs={12}>
              <SharedTextField
                      id="filled-size-normal"
                      label="Enter email address" 
                      defaultValue={updateEmail}
                      helperText={errorUpdateEmail}
                      error={errorUpdateEmail}
                      onChange={(e) => {
                        const validEmail = isValidEmail(e.target.value);
                        if (validEmail) {
                          setUpdateEmail(e.target.value);
                          setErrorUpdateEmail("");
                          setEmailValid(true);
                        } else {
                          setEmailValid(false);
                          setUpdateEmail(e.target.value);
                          setErrorUpdateEmail("Email Incorrect");
                        }
                      }}
                      type="Email"
                      placeholder="Email"
                      InputProps={{
                        readOnly: true,
                      }}
                            />
              </Grid>
              <Grid item sm={6} xs={12} >
              <SharedTextField
                      id="filled-size-normal"
                      label="PhoneNumber" 
                      type="number"
                      placeholder="Mobile Number"
                      defaultValue={updatePhoneNumber}
                      helperText={errorUpdatePhoneNumber}
                      error={errorUpdatePhoneNumber}
                      onChange={(e) => {
                        const isCharValid = isValidPhoneNumber(e.target.value);
                        if (isCharValid) {
                          setUpdatePhoneNumber(e.target.value);
                          setErrorUpdatePhoneNumber("");
                          setPhoneValid(true);
                        } else {
                          setPhoneValid(false);
                          setUpdatePhoneNumber(e.target.value);
                          setErrorUpdatePhoneNumber(
                            "Phone number must be valid and 10 digit"
                          );
                        }
                      }}
                            />
                
              </Grid>
              {selectedUserInfo?.user_role=== "Publisher console" && (
                <>
                <Grid item sm={6} xs={12}>
                <SharedTextField
                id="filled-size-normal"
                label="Daily Limit"
                defaultValue={updateDailyLimit}
                onChange={(e) => {
                  setUpdateDailyLimit(e.target.value);
                }}
                type="number"
                />
                
                </Grid>
                <Grid item sm={6} xs={12} >
                <SharedTextField
                id="filled-size-normal"
                label="Bulk Limit"
                defaultValue={updateBulkLimit}
                onChange={(e) => {
                  setUpdateBulkLimit(e.target.value);
                }}
                type="number"
                />
               
              </Grid>
                </>
              )}
              </Grid>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  mt: "30px",
                  ml:'-60px'
                }}
              >
                <Button
                  size="small"
                  sx={{
                    ml: 1,
                    borderRadius: 50,
                  }}
                  type="button"
                  variant="outlined"
                  color="info"
                  onClick={() => handleEditInfoDialogClose()}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  sx={{
                    ml: 1,
                    borderRadius: 50,
                  }}
                  type="submit"
                  variant="contained"
                  color="info"
                  disabled={!emailValid || !phoneValid}
                  onClick={() => {
                    handleUserUpdateAndEditUserInfo();
                  }}
                >
                  Update
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default UserManagerEditInfoDialog;
