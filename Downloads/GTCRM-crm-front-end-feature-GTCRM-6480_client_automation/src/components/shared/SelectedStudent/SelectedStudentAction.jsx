import { Box, Card, Typography } from "@mui/material";
import React from "react";
import "../../../styles/ApplicationManagerTable.css";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
const SelectedStudentAction = ({
  isScrolledToPagination,
  selectedStudent,
  setOpenDeleteModal,
}) => {
  return (
    <Box className="lead-action-container">
      <Box className="lead-action-wrapper">
        <Card
          className={`lead-action-card ${
            isScrolledToPagination ? "move-up" : "move-down"
          }`}
        >
          <Box className="lead-action-content-container">
            <Box className="lead-action-content">
              <Typography variant="subtitle1">
                {selectedStudent} student selected
              </Typography>
            </Box>
            <Box onClick={setOpenDeleteModal} className="lead-action-content">
              <DeleteOutlineOutlinedIcon color="primary" /> Archive
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default SelectedStudentAction;
