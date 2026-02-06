import { Box, Card, Typography } from "@mui/material";
import React, { useState } from "react";
import CreateGroupFeaturePermissionDialog from "./CreateGroupFeaturePermissionDialog";
import "../../../styles/ApplicationManagerTable.css";
import AssignFeatureToCollege from "./AssignFeatureToCollege";

const FeatureAndPermissionListAction = ({
  selectedFeatures,
  actionTitle,
  setOpenCreateGroupFeatureDialog,
  actionTitleNew,
  handleClickOpen,
}) => {
  return (
    <Box className="lead-action-container">
      <Box className="lead-action-wrapper">
        <Card className={"lead-action-card"}>
          <Box className="lead-action-content-container">
            <Box className="lead-action-content">
              <Typography variant="subtitle1">
                {selectedFeatures?.length > 0 && selectedFeatures?.length}{" "}
                features selected
              </Typography>
            </Box>
            <Box
              onClick={() => {
                setOpenCreateGroupFeatureDialog(true);
              }}
              className="lead-action-content"
            >
              {actionTitle}
            </Box>
            {actionTitleNew && (
              <Box
                onClick={() => {
                  const infoTrigger =
                    actionTitleNew === "Assign to College" ? true : false;
                  handleClickOpen(infoTrigger);
                }}
                className="lead-action-content"
              >
                {actionTitleNew}
              </Box>
            )}
            {actionTitle && (
              <AssignFeatureToCollege selectedFeatures={selectedFeatures} />
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default FeatureAndPermissionListAction;
