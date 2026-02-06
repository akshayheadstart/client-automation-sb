import { Box, Button, Card } from "@mui/material";
import React, { useEffect, useState } from "react";
import FeatureConfigurationHeader from "./FeatureConfigurationHeader";
import ShowFeaturesPermission from "./ShowFeaturesPermission";
import { useGetCollegeListQuery } from "../../../Redux/Slices/applicationDataApiSlice";
import useToasterHook from "../../../hooks/useToasterHook";
import {
  useGetFeatureScreenQuery,
  useUpdateSpecificFeatureMutation,
} from "../../../Redux/Slices/clientOnboardingSlice";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";

function StudentDashboardFeatureConfiguration({ collegeLists }) {
  const [selectedCollege, setSelectedCollege] = useState({});
  const [configuredFeatures, setConfiguredFeatures] = useState([]);
  const [dashboardType, setDashboardType] = useState("");

  const [loadingEditFeature, setLoadingEditFeature] = useState(false);

  const pushNotification = useToasterHook();

  const {
    data: featureData,
    isSuccess: isFeatureSuccess,
    isError: isFeatureError,
    error: featureError,
    isFetching: isFeatureFetching,
  } = useGetFeatureScreenQuery(
    {
      collegeId: selectedCollege?.value,
      dashboardType: "student_dashboard",
    },
    { skip: selectedCollege?.value?.length ? false : true }
  );

  useEffect(() => {
    if (isFeatureSuccess) {
      setConfiguredFeatures(featureData?.data);
      setDashboardType(featureData?.dashboard_type);
    } else if (isFeatureError) {
      setConfiguredFeatures([]);
      if (featureError?.data?.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (featureError?.data?.detail) {
        pushNotification("error", featureError?.data?.detail);
      }
    }
  }, [isFeatureSuccess, featureData, isFeatureError, featureError]);

  const [updateSpecificFeature] = useUpdateSpecificFeatureMutation();

  const handleEditFeature = (updatedFeature, setOpenEditDialog) => {
    setLoadingEditFeature(true);
    updateSpecificFeature({
      dashboardType,
      collegeId: selectedCollege?.value,
      payload: updatedFeature,
    })
      .unwrap()
      .then((res) => {
        if (res?.message) {
          pushNotification("success", res.message);
          setOpenEditDialog(false);
        } else if (res?.detail) {
          if (res?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (res?.detail) {
            pushNotification("error", res?.detail);
          }
        }
      })
      .catch((err) => pushNotification("error", err?.data?.detail))
      .finally(() => setLoadingEditFeature(false));
  };

  return (
    <Card sx={{ p: 4 }} className="common-box-shadow">
      <FeatureConfigurationHeader
        title="Configure Student Dashboard Feature"
        autoCompleteLabel="Select College"
        autoCompleteValue={selectedCollege}
        setAutoCompleteValue={setSelectedCollege}
        autoCompleteOptions={collegeLists}
      />
      {isFeatureFetching ? (
        <Box className="common-not-found-container">
          <LeefLottieAnimationLoader width={200} height={200} />
        </Box>
      ) : (
        <Box>
          {configuredFeatures.length > 0 && selectedCollege?.value ? (
            <ShowFeaturesPermission
              addedFeatures={configuredFeatures}
              setAddedFeatures={setConfiguredFeatures}
              featureDashboard={dashboardType}
              handleEditFeature={handleEditFeature}
              loadingEditFeature={loadingEditFeature}
              from="feature-configuration-dashboard"
            />
          ) : (
            <Box className="common-not-found-container">
              <BaseNotFoundLottieLoader width={200} height={200} />
            </Box>
          )}
        </Box>
      )}
    </Card>
  );
}

export default StudentDashboardFeatureConfiguration;
