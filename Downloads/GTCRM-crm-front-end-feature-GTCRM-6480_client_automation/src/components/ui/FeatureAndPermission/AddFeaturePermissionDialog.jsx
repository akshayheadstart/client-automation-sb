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
import React, { useMemo } from "react";
import { returnFeaturePermissionCreateFields } from "../../../utils/FormErrorValidationSchema";
import FormDetailsFieldLogic from "../../shared/forms/ClientOnboardingForms/FormDetailsFieldLogic";
import ConfigurationFormLogic from "../client-onboarding/ConfigurationDetails/ConfigurationFormLogic";
import {
  addFeatureAndGetParent,
  findAndEditFeature,
  findAndEditFeatureEnhanced,
} from "../../../pages/StudentTotalQueries/helperFunction";
import useToasterHook from "../../../hooks/useToasterHook";

const AddFeaturePermissionDialog = ({
  open,
  setOpen,
  featureDashboard,
  setAddedFeatures,
  editFeature,
  addedFeatures,
  isAddingSubFeature,
  handleEditFeature,
  loadingEditFeature,
  from,
}) => {
  const pushNotification = useToasterHook();

  const permissionFields = useMemo(() => {
    // We have two dashboard,  student and admin, we are getting the feature setting form fields based on the dashboard in the below function
    return returnFeaturePermissionCreateFields(
      editFeature?.dashboard_type || featureDashboard
    );
  }, [featureDashboard]);

  const formik = useFormik({
    // We are setting the initial value as the default value if the user is adding a new sub feature or creating a brand new (parent) feature other wise we are setting the editing feature's as default value of the form.
    initialValues:
      isAddingSubFeature || !editFeature?.name
        ? permissionFields.defaultValue
        : editFeature,
    validationSchema: permissionFields.validationSchema,
    onSubmit: (values) => {
      try {
        if (handleEditFeature) {
          if (isAddingSubFeature) {
            const { topLevelParent } = addFeatureAndGetParent(
              addedFeatures,
              editFeature.feature_id,
              values
            );

            handleEditFeature(topLevelParent, setOpen);
          } else {
            const { topLevelParent } = findAndEditFeatureEnhanced(
              addedFeatures,
              editFeature.feature_id,
              values
            );

            // Delete the features property
            delete values.features;

            const editedFeatures =
              from === "feature-configuration-dashboard"
                ? values
                : topLevelParent;

            handleEditFeature(editedFeatures, setOpen);
          }
        } else {
          if (editFeature) {
            const updatedFeatures = findAndEditFeature({
              editedValues: values,
              targetKey: editFeature?.feature_id || editFeature.name,
              features: addedFeatures,
              isAddingSubFeature,
            });

            setAddedFeatures(updatedFeatures);
          } else {
            setAddedFeatures((prev) => [...prev, values]);
          }
          formik.handleReset();
          pushNotification(
            "success",
            `Feature is ${
              isAddingSubFeature || !editFeature?.name ? "Added" : "Updated"
            }`
          );
          setOpen(false);
        }
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
  return (
    <Dialog
      disableAutoFocus
      disableRestoreFocus
      PaperProps={{ sx: { borderRadius: 2.5 } }}
      maxWidth="lg"
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
              <Typography variant="h6">Add Feature and Permission</Typography>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Box>
            <Box sx={{ my: 2 }}>
              <Grid container spacing={3}>
                {permissionFields.fields.map((field) => (
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
              {loadingEditFeature ? (
                <CircularProgress color="info" size={30} />
              ) : (
                <Button type="submit" color="info" variant="contained">
                  {isAddingSubFeature || !editFeature?.name ? "Add" : "Update"}
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </FormikProvider>
    </Dialog>
  );
};

export default AddFeaturePermissionDialog;
