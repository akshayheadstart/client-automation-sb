import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import FeaturePermissionHeader from "./FeaturePermissionHeader";
import ShowFeaturesPermission from "./ShowFeaturesPermission";
import { useAddMasterFeatureAndPermissionMutation } from "../../../Redux/Slices/clientOnboardingSlice";
import useToasterHook from "../../../hooks/useToasterHook";

const CreateFeatureAndPermissionForm = ({ title }) => {
  const [featureDashboard, setFeatureDashboard] = useState({});
  const [addedFeatures, setAddedFeatures] = useState([]);
  const [loadingSaveFeature, setLoadingSaveFeature] = useState(false);

  const pushNotification = useToasterHook();

  // call the feature save api here
  const [addMasterFeatureAndPermission] =
    useAddMasterFeatureAndPermissionMutation();

  const handleAddFeature = () => {
    setLoadingSaveFeature(true);
    addMasterFeatureAndPermission({
      payload: { screen_details: addedFeatures },
      dashboardType: featureDashboard?.value,
    })
      .unwrap()
      .then((response) => {
        if (response.message) {
          pushNotification("success", response.message);
          setFeatureDashboard({});
          setAddedFeatures([]);
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
      })
      .finally(() => setLoadingSaveFeature(false));
  };

  return (
    <Box className="feature-permission-create-container">
      <FeaturePermissionHeader
        featureDashboard={featureDashboard}
        setFeatureDashboard={setFeatureDashboard}
        title={title}
        setAddedFeatures={setAddedFeatures}
        addedFeatures={addedFeatures}
      />

      {addedFeatures?.length > 0 && (
        <ShowFeaturesPermission
          addedFeatures={addedFeatures}
          setAddedFeatures={setAddedFeatures}
          featureDashboard={featureDashboard?.value}
          showAddNestedFeature={true}
          showDelete={true}
          hideExpand={true}
        />
      )}

      {addedFeatures?.length > 0 && (
        <Box sx={{ mb: 1, mt: 2.5, textAlign: "center" }}>
          {loadingSaveFeature ? (
            <CircularProgress size={30} color="info" />
          ) : (
            <Button onClick={handleAddFeature} color="info" variant="contained">
              Save
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CreateFeatureAndPermissionForm;
