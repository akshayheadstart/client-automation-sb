import { Card, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import "../../../styles/ApplicationManagerTable.css";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
function AutomationManagerActions({
  isScrolledToPagination,
  selectedAutomationCount,
  setOpenDeleteModal,
  setDeleteModalTitle,
  handleEdit,
}) {
  return (
    <Box className="lead-action-container">
      <Box className="lead-action-wrapper">
        <Card
          className={`lead-action-card ${
            isScrolledToPagination ? "move-up-create-list" : "move-down"
          }`}
        >
          <Box sx={{ gap: 3 }} className="lead-action-content-container">
            <Box className="lead-action-content">
              <Typography variant="subtitle1">
                {selectedAutomationCount} selected
              </Typography>
            </Box>
            {selectedAutomationCount === 1 && (
              <Box
                onClick={() => {
                  handleEdit();
                }}
                className="lead-action-content"
              >
                {" "}
                <EditOutlinedIcon /> Edit
              </Box>
            )}
            <Box
              onClick={() => {
                setDeleteModalTitle("Are you sure you want to delete?");
                setOpenDeleteModal(true);
              }}
              className="lead-action-content"
            >
              {" "}
              <DeleteOutlineIcon /> Delete
            </Box>
            <Box
              onClick={() => {
                setDeleteModalTitle("Are you sure you want to stop?");
                setOpenDeleteModal(true);
              }}
              className="lead-action-content"
            >
              {" "}
              <DoNotDisturbAltIcon /> Stop
            </Box>
            <Box
              style={{ cursor: "not-allowed" }}
              className="lead-action-content"
            >
              {" "}
              <VisibilityIcon /> View
            </Box>
            {selectedAutomationCount === 1 && (
              <Box
                onClick={() => {
                  setDeleteModalTitle("Are you sure you want to copy?");
                  setOpenDeleteModal(true);
                }}
                className="lead-action-content"
              >
                {" "}
                <ContentCopyOutlinedIcon /> Create Copy
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

export default AutomationManagerActions;
