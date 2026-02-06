import React, { useContext, useEffect, useState } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { conventionCheck, phoneNumberValidation } from "../../utils/validation";
import SharedManageAccountTextField from "../AccountManagerDashBoard/SharedManageAccountTextField";
import "../../styles/managementDashboard.css";
import "../../styles/UserSession.css";
import { splitFullName } from "../StudentTotalQueries/helperFunction";
import { useSelector } from "react-redux";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { useCreateSuperAccountManagerMutation } from "../../Redux/Slices/clientOnboardingSlice";
const CreateSuperAccountManager = () => {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  const [errorTextName, setErrorTextName] = useState("");
  const [errorTextEmailRegistration, setErrorTextEmailRegistration] =
    useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [errorTextMobileNumber, setErrorTextMobileNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const pushNotification = useToasterHook();
  //create Account api implementation here
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [
    somethingWentWrongInCreateAccount,
    setSomethingWentWrongInCreateAccount,
  ] = useState(false);
  const [
    createAccountInternalServerError,
    setCreateAccountInternalServerError,
  ] = useState(false);
  const [createAccountLoading, setCreateAccountLoading] = useState(false);
  const [createAccountList] = useCreateSuperAccountManagerMutation();
  //Create Manager account Head Title add
  useEffect(() => {
    setHeadTitle("");
    document.title = "Create Super Account Manager";
  }, [headTitle]);
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
    },
    onSubmit: (values) => {
      const { firstName, middleName, lastName } = splitFullName(fullName);
      const payload = {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        email,
        mobile_number: mobileNumber,
      };
      setCreateAccountLoading(true);
      createAccountList({ payload })
        .unwrap()
        .then((response) => {
          try {
            if (response.message) {
              pushNotification("success", response.message);
              formik.resetForm();
              setFullName("");
              setEmail("");
              setMobileNumber("");
            } else {
              throw new Error("Create Account API response has been changed.");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInCreateAccount,
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
          } else {
            handleInternalServerError(
              setCreateAccountInternalServerError,
              "",
              10000
            );
          }
        })
        .finally(() => {
          setCreateAccountLoading(false);
        });
    },
  });
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, py: 2 }}
      className="user-session-header-box-container"
    >
      <Container maxWidth={false} sx={{ pt: 2 }}>
        <Grid container sx={{ justifyContent: "center" }}>
          <Grid item md={6} xs={12}>
            <Card className="create-account-from-card">
              <>
                {somethingWentWrongInCreateAccount ||
                createAccountInternalServerError ? (
                  <Box>
                    {createAccountInternalServerError && (
                      <Error500Animation
                        height={400}
                        width={400}
                      ></Error500Animation>
                    )}
                    {somethingWentWrongInCreateAccount && (
                      <ErrorFallback
                        error={apiResponseChangeMessage}
                        resetErrorBoundary={() => window.location.reload()}
                      />
                    )}
                  </Box>
                ) : (
                  <>
                    <Box className="create-account-title-box">
                      <Typography variant="h5">
                        Create Super Account Manager
                      </Typography>
                    </Box>
                    <Box
                      component="form"
                      onSubmit={formik.handleSubmit}
                      className="create-account-form-box"
                    >
                      <SharedManageAccountTextField
                        label="Enter Full Name"
                        name="Enter Full Name"
                        value={formik.values.name}
                        onChange={(e) => {
                          const val = e.target.value;

                          if (val.length < 2) {
                            setErrorTextName("At least 2 characters");
                          } else if (conventionCheck(e, "alphabetRegex")) {
                            setErrorTextName("");
                            setFullName(val);
                          } else {
                            setErrorTextName(
                              "Numbers and special characters aren't allowed"
                            );
                          }
                          formik.setFieldValue("name", val);
                        }}
                        onBlur={formik.handleBlur}
                        error={!!errorTextName}
                        helperText={errorTextName}
                        required={true}
                      />
                      <SharedManageAccountTextField
                        label="Enter Email Address"
                        name="Enter Email Address"
                        value={formik.values.email}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (conventionCheck(e, "emailRegex")) {
                            setErrorTextEmailRegistration("");
                            setEmail(val);
                          } else {
                            setErrorTextEmailRegistration("Invalid Email");
                          }
                          formik.setFieldValue("email", val);
                        }}
                        onBlur={formik.handleBlur}
                        error={!!errorTextEmailRegistration}
                        helperText={errorTextEmailRegistration}
                        required={true}
                      />
                      <SharedManageAccountTextField
                        label="Enter Mobile Number"
                        name="Enter Mobile Number"
                        type="tel"
                        value={formik.values.phone}
                        onKeyDown={phoneNumberValidation}
                        onChange={(e) => {
                          const val = e.target.value;

                          if (val.length === 10) {
                            setErrorTextMobileNumber("");
                            setMobileNumber(val);
                          } else {
                            setErrorTextMobileNumber("Must be 10 digits");
                          }
                          formik.setFieldValue("phone", val);
                        }}
                        error={!!errorTextMobileNumber}
                        helperText={errorTextMobileNumber}
                        required={true}
                        inputProps={{ maxLength: 10 }}
                      />
                      <Box sx={{ display: "grid", placeItems: "center" }}>
                        <Button
                          variant="contained"
                          color="info"
                          type="submit"
                          sx={{ borderRadius: 50 }}
                          disabled={
                            !!errorTextName ||
                            !!errorTextEmailRegistration ||
                            !!errorTextMobileNumber ||
                            !formik.values.name.trim() ||
                            !formik.values.email.trim() ||
                            !formik.values.phone.trim()
                          }
                        >
                          {createAccountLoading ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: "white" }}
                            />
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </Box>
                    </Box>
                  </>
                )}
              </>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreateSuperAccountManager;
