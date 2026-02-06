import { Box, Card, Typography } from "@mui/material";
import React from "react";
import "../../styles/ApplicationManagerTable.css";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
const SlotActions = ({
  selectedSlot,
  handleUnassignApplicantsFromSlotsApiCall,
  handleDeleteSlotAndPanel,
  handlePublishSlotsOrPanel,
}) => {
  return (
    <Box className="lead-action-container">
      <Box className="lead-action-wrapper">
        <Card className={`lead-action-card`}>
          <Box className="lead-action-content-container">
            <Box className="lead-action-content">
              <Typography variant="subtitle1">
                {selectedSlot} slot selected
              </Typography>
            </Box>
            <Box
              onClick={() => handleDeleteSlotAndPanel(true)}
              className="lead-action-content"
            >
              <DeleteOutlineOutlinedIcon sx={{ color: "#008be2" }} /> Delete
            </Box>
            <Box
              onClick={handlePublishSlotsOrPanel}
              className="lead-action-content"
            >
              <img
                src="https://devassestssb.s3.ap-south-1.amazonaws.com/7941943c2ab142879ceaf129abc965b9.png"
                alt="publish icon"
              />
              Publish
            </Box>
            <Box
              onClick={handleUnassignApplicantsFromSlotsApiCall}
              className="lead-action-content"
            >
              <DoNotDisturbAltIcon sx={{ color: "#008be2" }} /> Un Assign
              Applicants
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default SlotActions;
