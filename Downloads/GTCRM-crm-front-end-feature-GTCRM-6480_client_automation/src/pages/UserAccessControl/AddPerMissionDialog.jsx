import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useContext, useState } from "react";
import "../../styles/UserManager.css";
import CloseIcon from "@mui/icons-material/Close";
import ViewGroupedFeatureAndPermission from "../FeatureAndPermission/ViewGroupedFeatureAndPermission";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import useToasterHook from "../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { useAddGroupPermissionForUserMutation, useRemoveGroupPermissionForUserMutation } from "../../Redux/Slices/clientOnboardingSlice";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import AddIcon from "@mui/icons-material/Add";
import PreviewGroupedFeatureAndPermission from "../FeatureAndPermission/PreviewGroupedFeatureAndPermission";
import UserManagerPermissionAction from "../FeatureAndPermission/UserManagerPermissionAction";
const AddPerMissionDialog = ({
  openAddPermission,
  handleAddPermissionClose,
  setSelectedUser,
  selectedUser,
}) => {
  const theme = useTheme();
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [
    somethingWentWrongInAllApplication,
    setSomethingWentWrongInAllApplication,
  ] = useState(false);
  const [
    allApplicationInternalServerError,
    setAllApplicationInternalServerError,
  ] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const pushNotification = useToasterHook();
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [addPermissionToggle, setAddPermissionToggle] = useState(false);
  //Particular user Assign feature permission APi implementation here
  const [addGroupPermissionForUser] = useAddGroupPermissionForUserMutation();
  const handleUserFeaturePermissionUpdate = () => {
    const payload = {
      group_ids: selectedApplications,
      user_id: selectedUser?._id,
    };
    setUpdateStatusLoading(true);
    addGroupPermissionForUser({
      payload: payload,
    })
      .unwrap()
      .then((response) => {
        try {
          if (response.message) {
            pushNotification("success", response.message);
            setAddPermissionToggle(false);
            setSelectedApplications([]);
          } else {
            throw new Error(
              "Update User feature permission API response has been changed."
            );
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInAllApplication,
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
            setAllApplicationInternalServerError,
            "",
            10000
          );
        }
      })
      .finally(() => {
        setUpdateStatusLoading(false);
      });
  };
  const [removeGroupPermissionForUser] = useRemoveGroupPermissionForUserMutation();
  const handleUserFeaturePermissionUnAssign = () => {
    setUpdateStatusLoading(true);
    removeGroupPermissionForUser({
      payload: selectedApplications,
      userId:selectedUser?._id
    })
      .unwrap()
      .then((response) => {
        try {
          if (response.message) {
            pushNotification("success", response.message);
            setAddPermissionToggle(false);
            setSelectedApplications([]);
          } else {
            throw new Error(
              "remove User feature permission API response has been changed."
            );
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInAllApplication,
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
            setAllApplicationInternalServerError,
            "",
            10000
          );
        }
      })
      .finally(() => {
        setUpdateStatusLoading(false);
      });
  };
  return (
    <React.Fragment>
      <Dialog
        fullWidth
        open={openAddPermission}
        onClose={() => {
          handleAddPermissionClose();
          setSelectedUser({});
        }}
        aria-labelledby="responsive-dialog-title"
        maxWidth="lg"
      >
        <Box className="user-manager-add-permission-container">
          <Typography className="user-manager-add-permission-text">
            {" "}
            {`${
              addPermissionToggle ? "Add" : "Preview"
            } Group Feature Permission`}
          </Typography>
          <IconButton
            onClick={() => {
              handleAddPermissionClose();
              setSelectedUser({});
            }}
          >
            <CloseIcon color="info" />
          </IconButton>
        </Box>
        {!addPermissionToggle && (
          <Box sx={{ display: "flex", justifyContent: "end", mr: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              color="info"
              size="small"
              onClick={() => {
                setAddPermissionToggle(true);
              }}
            >
              Add Permission
            </Button>
          </Box>
        )}
        {allApplicationInternalServerError ||
        somethingWentWrongInAllApplication ? (
          <Box>
            {allApplicationInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {somethingWentWrongInAllApplication && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </Box>
        ) : (
          <>
            {addPermissionToggle ? (
              <ViewGroupedFeatureAndPermission
                selectedApplications={selectedApplications}
                setSelectedApplications={setSelectedApplications}
                hideEditAndDeleteButton={true}
              />
            ) : (
              <PreviewGroupedFeatureAndPermission
                selectedUser={selectedUser}
                selectedApplications={selectedApplications}
                setSelectedApplications={setSelectedApplications}
              />
            )}
            {selectedApplications?.length > 0 && (
              <UserManagerPermissionAction
                selectedApplications={selectedApplications}
                addPermissionToggle={addPermissionToggle}
                handleUserFeaturePermissionUpdate={handleUserFeaturePermissionUpdate}
                updateStatusLoading={updateStatusLoading}
                handleUserFeaturePermissionUnAssign={handleUserFeaturePermissionUnAssign}
              />
            )}
            <Box className="user-manager-add-permission-dialog">
              <Button
                size="small"
                sx={{
                  ml: 1,
                  borderRadius: 50,
                }}
                type="button"
                variant="outlined"
                color="info"
                onClick={() => {
                  handleAddPermissionClose();
                  setSelectedUser({});
                }}
              >
                Cancel
              </Button>
            </Box>
          </>
        )}
      </Dialog>
    </React.Fragment>
  );
};

export default AddPerMissionDialog;
