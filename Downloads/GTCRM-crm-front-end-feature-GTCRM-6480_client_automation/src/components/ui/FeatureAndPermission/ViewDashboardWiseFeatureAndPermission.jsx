import React, { useEffect, useState } from "react";
import ShowFeaturesPermission from "./ShowFeaturesPermission";
import { Box, Button, Card, Typography } from "@mui/material";
import FeatureAndPermissionListAction from "./FeatureAndPermissionListAction";
import CreateGroupFeaturePermissionDialog from "./CreateGroupFeaturePermissionDialog";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import {
  useCreateFeatureGroupMutation,
  useDeleteFeatureGroupMutation,
  useDeleteMasterScreenMutation,
  useGetMasterScreenQuery,
  useUpdateMasterScreenMutation,
} from "../../../Redux/Slices/clientOnboardingSlice";
import useToasterHook from "../../../hooks/useToasterHook";
import { useLocation } from "react-router-dom";

const ViewDashboardWiseFeatureAndPermission = ({
  title,
  showCheckbox,
  selectedFeatures,
  setSelectedFeatures,
  actionTitle,
  dashboardType,
  actionTitleNew,
  handleClickOpen,
}) => {
  const { state } = useLocation();

  const pushNotification = useToasterHook();

  const [openCreateGroupFeatureDialog, setOpenCreateGroupFeatureDialog] =
    useState(false);
  const [loadingEditFeature, setLoadingEditFeature] = useState(false);
  const [loadingDeleteFeature, setLoadingDeleteFeature] = useState(false);

  const [addedFeatures, setAddedFeatures] = useState([]);

  const {
    data: featureData,
    isSuccess: isFeatureSuccess,
    isError: isFeatureError,
    error: featureError,
    isFetching: isFeatureFetching,
  } = useGetMasterScreenQuery({
    dashboardType: dashboardType,
  });

  useEffect(() => {
    if (isFeatureSuccess) {
      setAddedFeatures(featureData?.data?.data);
    } else if (isFeatureError) {
      setAddedFeatures([]);
      if (featureError?.data?.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (featureError?.data?.detail) {
        pushNotification("error", featureError?.data?.detail);
      }
    }
  }, [isFeatureSuccess, featureData, isFeatureError, featureError]);

  const [updateMasterScreen] = useUpdateMasterScreenMutation();

  const handleEditFeature = (updatedFeature, setOpenEditDialog) => {
    setLoadingEditFeature(true);
    updateMasterScreen({
      dashboardType: dashboardType,
      payload: { screen_details: [updatedFeature] },
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

  const [deleteMasterScreen] = useDeleteMasterScreenMutation();
  const [deleteFeatureGroup] = useDeleteFeatureGroupMutation();

  const handleDeleteFeature = (featureId, setOpenDeleteDialog) => {
    if (state?.groupDetails?.group_id) {
      setLoadingDeleteFeature(true);
      deleteFeatureGroup({
        groupId: state?.groupDetails?.group_id,
        featureId: featureId,
      })
        .unwrap()
        .then((res) => {
          if (res?.message) {
            pushNotification("success", res.message);
            setOpenDeleteDialog(false);
          } else if (res?.detail) {
            if (res?.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (res?.detail) {
              pushNotification("error", res?.detail);
            }
          }
        })
        .catch((err) => pushNotification("error", err?.data?.detail))
        .finally(() => setLoadingDeleteFeature(false));
    } else {
      setLoadingDeleteFeature(true);
      deleteMasterScreen({
        dashboardType: dashboardType,
        featureId: featureId,
      })
        .unwrap()
        .then((res) => {
          if (res?.message) {
            pushNotification("success", res.message);
            setOpenDeleteDialog(false);
          } else if (res?.detail) {
            if (res?.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (res?.detail) {
              pushNotification("error", res?.detail);
            }
          }
        })
        .catch((err) => pushNotification("error", err?.data?.detail))
        .finally(() => setLoadingDeleteFeature(false));
    }
  };

  return (
    <Card sx={{ p: 4 }} className="common-box-shadow">
      <Box sx={{ mb: 2 }} className="feature-permission-heading">
        <Typography variant="h6">{title}</Typography>
      </Box>
      {isFeatureFetching ? (
        <Box className="common-not-found-container">
          <LeefLottieAnimationLoader width={200} height={200} />
        </Box>
      ) : (
        <Box>
          {addedFeatures?.length > 0 && (
            <ShowFeaturesPermission
              addedFeatures={addedFeatures}
              setAddedFeatures={setAddedFeatures}
              showCheckbox={showCheckbox}
              selectedFeatures={selectedFeatures}
              setSelectedFeatures={setSelectedFeatures}
              handleEditFeature={handleEditFeature}
              loadingEditFeature={loadingEditFeature}
              showDelete={true}
              handleDeleteFeature={handleDeleteFeature}
              loadingDeleteFeature={loadingDeleteFeature}
              showAddNestedFeature={true}
              featureDashboard={dashboardType}
            />
          )}
        </Box>
      )}

      {selectedFeatures?.length > 0 && (
        <FeatureAndPermissionListAction
          actionTitle={actionTitle}
          selectedFeatures={selectedFeatures}
          setOpenCreateGroupFeatureDialog={setOpenCreateGroupFeatureDialog}
          actionTitleNew={actionTitleNew}
          handleClickOpen={handleClickOpen}
        />
      )}

      {openCreateGroupFeatureDialog && (
        <CreateGroupFeaturePermissionDialog
          open={openCreateGroupFeatureDialog}
          setOpen={setOpenCreateGroupFeatureDialog}
          title={actionTitle}
          selectedFeatures={selectedFeatures}
        />
      )}
    </Card>
  );
};

export default ViewDashboardWiseFeatureAndPermission;
