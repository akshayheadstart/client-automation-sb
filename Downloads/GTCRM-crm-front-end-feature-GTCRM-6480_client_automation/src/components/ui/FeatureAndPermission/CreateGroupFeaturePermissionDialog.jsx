import { Close } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { FormikProvider, useFormik } from "formik";
import React, { useMemo, useState } from "react";
import { returnGroupCreationFields } from "../../../utils/FormErrorValidationSchema";
import FormDetailsFieldLogic from "../../shared/forms/ClientOnboardingForms/FormDetailsFieldLogic";
import ConfigurationFormLogic from "../client-onboarding/ConfigurationDetails/ConfigurationFormLogic";
import { findAndEditFeature } from "../../../pages/StudentTotalQueries/helperFunction";
import useToasterHook from "../../../hooks/useToasterHook";
import { useLocation } from "react-router-dom";
import {
  useCreateFeatureGroupMutation,
  useUpdateFeatureGroupsMutation,
} from "../../../Redux/Slices/clientOnboardingSlice";

const CreateGroupFeaturePermissionDialog = ({
  open,
  setOpen,
  title,
  selectedFeatures,
}) => {
  const pushNotification = useToasterHook();

  const [loadingCreateFeatureGroup, setLoadingCreateFeatureGroup] =
    useState(false);

  const { state } = useLocation();

  const groupCreationFields = useMemo(() => {
    // Here we are getting the form fields in the below function
    return returnGroupCreationFields();
  }, []);

  const formik = useFormik({
    // We are setting the initial value as the default value if the user is adding a new sub feature or creating a brand new (parent) feature other wise we are setting the editing feature's as default value of the form.
    initialValues: state?.groupDetails?.group_name
      ? state?.groupDetails
      : groupCreationFields.defaultValue,
    validationSchema: groupCreationFields.validationSchema,
    onSubmit: (values) => {
      try {
        const payload = {
          group_description: values.group_description,
          screen_details: selectedFeatures,
        };

        const groupName = values.group_name;

        // if (state?.groupDetails?.group_name) {
        //   handleUpdateFeatureGroup(state?.groupDetails?.group_id, payload);
        // } else {
        handleCreateFeatureGroup(groupName, payload);
        // }
      } catch (error) {
        pushNotification("error", error?.message);
      }
    },
  });

  // memoizing the values and functions to prevent unnecessary re-renderings
  const formikValues = useMemo(() => formik.values, [formik.values]);
  const handleChange = useMemo(() => formik.handleChange, []);
  const setFieldValue = useMemo(() => formik.setFieldValue, []);
  const handleBlur = useMemo(() => formik.handleBlur, []);

  const handleClose = () => {
    setOpen(false);
  };

  const [createFeatureGroup] = useCreateFeatureGroupMutation();
  const handleCreateFeatureGroup = (groupName, payload) => {
    setLoadingCreateFeatureGroup(true);
    createFeatureGroup({
      groupName: groupName,
      payload: payload,
      update: state?.groupDetails?.group_name ? true : false,
    })
      .unwrap()
      .then((res) => {
        if (res?.message) {
          pushNotification("success", res.message);
          formik.handleReset();
          // pushNotification(
          //   "success",
          //   `Group is ${
          //     state?.groupDetails?.group_name ? "Updated" : "Created"
          //   }`
          // );
          setOpen(false);
        } else if (res?.detail) {
          if (res?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (res?.detail) {
            pushNotification("error", res?.detail);
          }
        }
      })
      .catch((err) => pushNotification("error", err?.data?.detail))
      .finally(() => setLoadingCreateFeatureGroup(false));
  };

  const [updateFeatureGroups] = useUpdateFeatureGroupsMutation();
  const handleUpdateFeatureGroup = (groupId, payload) => {
    setLoadingCreateFeatureGroup(true);
    updateFeatureGroups({
      groupId: groupId,
      payload: payload,
    })
      .unwrap()
      .then((res) => {
        if (res?.message) {
          pushNotification("success", res.message);
          formik.handleReset();
          // pushNotification(
          //   "success",
          //   `Group is ${
          //     state?.groupDetails?.group_name ? "Updated" : "Created"
          //   }`
          // );
          setOpen(false);
        } else if (res?.detail) {
          if (res?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (res?.detail) {
            pushNotification("error", res?.detail);
          }
        }
      })
      .catch((err) => pushNotification("error", err?.data?.detail))
      .finally(() => setLoadingCreateFeatureGroup(false));
  };

  return (
    <Dialog
      disableAutoFocus
      disableRestoreFocus
      PaperProps={{ sx: { borderRadius: 2.5 } }}
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      fullWidth
    >
      <FormikProvider value={formik}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box className="feature-permission-heading">
              <Typography variant="h6">{title}</Typography>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Box>
            <Box sx={{ my: 2 }}>
              <Grid container spacing={3}>
                {groupCreationFields?.fields.map((field) => (
                  <>
                    <FormDetailsFieldLogic
                      key={field.name}
                      field={field}
                      formikValue={formikValues[field?.name]}
                      handleChange={handleChange}
                      setFieldValue={setFieldValue}
                      handleBlur={handleBlur}
                      isFieldTouched={formik.touched[field?.name]}
                      isFieldError={formik.errors[field?.name]}
                    />
                    {field.dependentFields &&
                      field.dependentFields[formikValues[field?.name]].map(
                        (field) => (
                          <ConfigurationFormLogic
                            key={field.name}
                            field={field}
                            formikValues={formikValues}
                            handleChange={handleChange}
                            setFieldValue={setFieldValue}
                            handleBlur={handleBlur}
                            formik={formik}
                          />
                        )
                      )}
                  </>
                ))}
              </Grid>
            </Box>
            <Box sx={{ textAlign: "right", mt: 3 }}>
              <Button
                onClick={handleClose}
                sx={{ mr: 1.5 }}
                color="info"
                variant="outlined"
              >
                Cancel
              </Button>

              {loadingCreateFeatureGroup ? (
                <CircularProgress color="info" size={30} />
              ) : (
                <Button type="submit" color="info" variant="contained">
                  {title}
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </FormikProvider>
    </Dialog>
  );
};

export default CreateGroupFeaturePermissionDialog;
