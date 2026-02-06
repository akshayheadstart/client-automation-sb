import { Box, Button, Card, CircularProgress, Typography } from "@mui/material";
import React from "react";
import "../../styles/ApplicationManagerTable.css";

const UserManagerPermissionAction = ({
  selectedApplications,
  addPermissionToggle,
  handleUserFeaturePermissionUpdate,
  updateStatusLoading,
  handleUserFeaturePermissionUnAssign,
}) => {
  return (
    <Box className="lead-action-container">
      <Box className="lead-action-wrapper">
        <Card className={"lead-action-card"}>
          <Box className="lead-action-content-container">
            <Box className="lead-action-content">
              <Typography variant="subtitle1">
                {selectedApplications?.length > 0 &&
                  selectedApplications?.length}{" "}
                Groups selected
              </Typography>
            </Box>
            {addPermissionToggle ? (
              <Button
              size="small"
              type="text"
              variant="outlined"
              color="info"
              onClick={() => {
                handleUserFeaturePermissionUpdate();
              }}
            >
              {updateStatusLoading ? (
                  <CircularProgress size={25} color="info" />
                ) : (
                  "Update"
                )}
            </Button>
            ) : (
                <Button
                size="small"
                type="text"
                variant="outlined"
                color="info"
                onClick={() => {
                  handleUserFeaturePermissionUnAssign();
                }}
              >
                {updateStatusLoading ? (
                  <CircularProgress size={25} color="info" />
                ) : (
                  "UnAssign"
                )}
              </Button>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default UserManagerPermissionAction;
