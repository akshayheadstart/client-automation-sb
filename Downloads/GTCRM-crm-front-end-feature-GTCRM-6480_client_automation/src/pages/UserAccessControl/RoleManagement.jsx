import React, { useContext, useEffect, useState } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import "../../styles/UserSession.css";
import "../../styles/managementDashboard.css";
import { useFormik } from "formik";
import SharedManageAccountTextField from "../AccountManagerDashBoard/SharedManageAccountTextField";
import { conventionCheck } from "../../utils/validation";
import {
  useCreateUserRoleMutation,
  useGetAssociatedPermissionsRoleQuery,
} from "../../Redux/Slices/clientOnboardingSlice";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import useToasterHook from "../../hooks/useToasterHook";
import { formatLabel } from "../StudentTotalQueries/helperFunction";
const RoleManagement = () => {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  const [errorTextRoleName, setErrorTextRoleName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [selectedScope, setSelectedScope] = React.useState("global");
  const [createRoleLoading, setCreateRoleLoading] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const pushNotification = useToasterHook();
  const [somethingWentWrongInCreateRole, setSomethingWentWrongInCreateRole] =
    useState(false);
  const [createRoleInternalServerError, setCreateRoleInternalServerError] =
    useState(false);
  const [createUserRoleList] = useCreateUserRoleMutation();
  const formik = useFormik({
    initialValues: {
      role: "",
      description: "",
    },
    onSubmit: (values) => {
      const payload = {
        name: roleName,
        description,
        scope: selectedScope,
        parent_id: selectedUser?.value ? selectedUser?.value : "",
      };
      setCreateRoleLoading(true);
      createUserRoleList({ payload })
        .unwrap()
        .then((response) => {
          try {
            if (response.message) {
              pushNotification("success", response.message);
              formik.resetForm();
              setSelectedUser(null);
            } else {
              throw new Error("Create New Role API response has been changed.");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInCreateRole,
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
              setCreateRoleInternalServerError,
              "",
              10000
            );
          }
        })
        .finally(() => {
          setCreateRoleLoading(false);
        });
    },
  });
  //User Manager permission Head Title add
  useEffect(() => {
    setHeadTitle("Role Management");
    document.title = "Role Management";
  }, [headTitle]);

  //Get Associated Permissions Role List API implementation here
  const { data, isSuccess, isError, error } =
    useGetAssociatedPermissionsRoleQuery({
      scope: selectedScope,
      featureKey: "a82a95b6",
    });
  useEffect(() => {
    if (isSuccess) {
      const updatedUserList = data?.data?.map((user) => {
        return {
          label: formatLabel(user?.name),
          value: user?.mongo_id,
        };
      });
      setUserList(updatedUserList);
    } else if (isError) {
      if (isError?.data?.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (error?.data?.detail) {
        setUserList([]);
        pushNotification("error", error?.data?.detail);
      }
    }
  }, [data, isSuccess, isError, error, selectedScope]);

  const handleChange = (event) => {
    setSelectedUser(null);
    setSelectedScope(event.target.value);
  };
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
              <Box className="create-account-title-box">
                <Typography variant="h5">Create User Role</Typography>
              </Box>
              {somethingWentWrongInCreateRole ||
              createRoleInternalServerError ? (
                <Box>
                  {createRoleInternalServerError && (
                    <Error500Animation
                      height={400}
                      width={400}
                    ></Error500Animation>
                  )}
                  {somethingWentWrongInCreateRole && (
                    <ErrorFallback
                      error={apiResponseChangeMessage}
                      resetErrorBoundary={() => window.location.reload()}
                    />
                  )}
                </Box>
              ) : (
                <Box
                  component="form"
                  onSubmit={formik.handleSubmit}
                  className="create-account-form-box"
                >
                  <SharedManageAccountTextField
                    label="Enter Role Name"
                    name="Enter Role Name"
                    value={formik.values.role}
                    onChange={(e) => {
                      const val = e.target.value;

                      if (val.length < 2) {
                        setErrorTextRoleName("At least 2 characters");
                      } else if (conventionCheck(e, "alphabetRegex")) {
                        setErrorTextRoleName("");
                        setRoleName(val);
                      } else {
                        setErrorTextRoleName(
                          "Numbers and special characters aren't allowed"
                        );
                      }
                      formik.setFieldValue("role", val);
                    }}
                    onBlur={formik.handleBlur}
                    error={!!errorTextRoleName}
                    helperText={errorTextRoleName}
                    required={true}
                  />
                  <Grid container>
                    <Grid item md={6} xs={12}>
                      <FormControl
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          Select Scope
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          value={selectedScope}
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            value="global"
                            control={<Radio color="info" />}
                            label="Global"
                            required
                          />
                          <FormControlLabel
                            value="college"
                            control={<Radio color="info" />}
                            label="College"
                            required
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <Autocomplete
                        value={selectedUser}
                        getOptionLabel={(option) => option?.label}
                        onChange={(_, value) => {
                          setSelectedUser(value);
                        }}
                        fullWidth
                        options={userList}
                        renderInput={(params) => (
                          <TextField
                            color="info"
                            {...params}
                            label="Select Parent Role"
                            size="small"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <SharedManageAccountTextField
                    label="Enter your Description"
                    name="Enter your Description"
                    value={formik.values.description}
                    onChange={(e) => {
                      const val = e.target.value;

                      if (val.length < 2) {
                        setErrorDescription("At least 2 characters");
                      } else if (conventionCheck(e, "alphabetRegex")) {
                        setErrorDescription("");
                        setDescription(val);
                      } else {
                        setErrorDescription(
                          "Numbers and special characters aren't allowed"
                        );
                      }
                      formik.setFieldValue("description", val);
                    }}
                    onBlur={formik.handleBlur}
                    error={!!errorDescription}
                    helperText={errorDescription}
                    required={true}
                    multiline={true}
                    rows={3}
                  />
                  <Box sx={{ display: "grid", placeItems: "center" }}>
                    <Button
                      variant="contained"
                      color="info"
                      type="submit"
                      sx={{ borderRadius: 50 }}
                      disabled={
                        !!errorTextRoleName || !formik.values.role.trim()
                      }
                    >
                      {createRoleLoading ? (
                        <CircularProgress size={20} sx={{ color: "white" }} />
                      ) : (
                        "Create Role"
                      )}
                    </Button>
                  </Box>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RoleManagement;
