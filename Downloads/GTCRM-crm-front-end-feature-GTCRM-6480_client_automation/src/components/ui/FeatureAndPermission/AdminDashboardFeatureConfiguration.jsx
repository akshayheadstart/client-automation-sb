import { Box, Button, Card } from "@mui/material";
import React, { useEffect, useState } from "react";
import FeatureConfigurationHeader from "./FeatureConfigurationHeader";
import ShowFeaturesPermission from "./ShowFeaturesPermission";

import { useSelector } from "react-redux";
import useToasterHook from "../../../hooks/useToasterHook";
import {
  useGetAssociatedPermissionsRoleQuery,
  useGetRoleWiseFeatureScreenQuery,
  useUpdateFeatureOfRoleMutation,
} from "../../../Redux/Slices/clientOnboardingSlice";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";

function AdminDashboardFeatureConfiguration({ collegeLists }) {
  const [selectedRole, setSelectedRole] = useState({});
  const [roleLists, setRoleLists] = useState([]);
  const [configuredFeatures, setConfiguredFeatures] = useState([]);
  const [loadingEditFeature, setLoadingEditFeature] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState({});
  const [skipFeatureDataApi, setSkipFeatureDataApi] = useState(true);
  const [appliedRole, setAppliedRole] = useState(null);
  const [appliedCollege, setAppliedCollege] = useState(null);

  const pushNotification = useToasterHook();

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  //User Role List API implementation here
  const { data, isSuccess, isError, error } =
    useGetAssociatedPermissionsRoleQuery({
      collegeId: collegeId,
    });

  const {
    data: featureData,
    isSuccess: isFeatureSuccess,
    isError: isFeatureError,
    error: featureError,
    isFetching: isFeatureFetching,
  } = useGetRoleWiseFeatureScreenQuery(
    {
      roleId: appliedRole?.value,
      collegeId: appliedCollege?.value,
    },
    { skip: skipFeatureDataApi }
  );

  useEffect(() => {
    if (isSuccess) {
      setRoleLists(
        data?.data?.map((role) => ({
          label: role?.name?.split("_")?.join(" "),
          value: role?.mongo_id,
        }))
      );
    } else if (isError) {
      if (error?.data?.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (error?.data?.detail) {
        pushNotification("error", error?.data?.detail);
      }
    }
  }, [data, isSuccess, isError, error]);

  useEffect(() => {
    if (isFeatureSuccess) {
      setConfiguredFeatures(featureData?.data);
    } else if (isFeatureError) {
      if (featureError?.data?.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (featureError?.data?.detail) {
        pushNotification("error", featureError?.data?.detail);
      }
    }
  }, [isFeatureSuccess, featureData, isFeatureError, featureError]);

  const [updateFeatureOfRole] = useUpdateFeatureOfRoleMutation();

  const handleEditFeature = (updatedFeature, setOpenEditDialog) => {
    setLoadingEditFeature(true);
    updateFeatureOfRole({
      roleId: selectedRole?.value,
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

  const handleApply = () => {
    setAppliedRole(selectedRole);
    setAppliedCollege(selectedCollege);
    setSkipFeatureDataApi(false);
  };

  return (
    <Card sx={{ p: 4 }} className="common-box-shadow">
      <FeatureConfigurationHeader
        title="Configure Admin Dashboard Feature"
        autoCompleteLabel="Select Role"
        autoCompleteValue={selectedRole}
        setAutoCompleteValue={setSelectedRole}
        autoCompleteOptions={roleLists}
        selectedCollege={selectedCollege}
        setSelectedCollege={setSelectedCollege}
        collegeLists={collegeLists}
        from="admin-dashboard"
        handleApply={handleApply}
      />

      {isFeatureFetching ? (
        <Box className="common-not-found-container">
          <LeefLottieAnimationLoader width={200} height={200} />
        </Box>
      ) : (
        <Box>
          {configuredFeatures.length > 0 ? (
            <ShowFeaturesPermission
              addedFeatures={configuredFeatures}
              setAddedFeatures={setConfiguredFeatures}
              featureDashboard={"admin_dashboard"}
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
      {/* <Box sx={{ textAlign: "center", mt: 2 }}>
        <Button variant="contained" color="info">
          Save
        </Button>
      </Box> */}
    </Card>
  );
}

export default AdminDashboardFeatureConfiguration;
