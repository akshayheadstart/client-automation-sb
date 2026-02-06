import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ScriptDetails = ({ onClose, data }) => {
  const handleCloseIconClick = () => {
    onClose();
  };

  const handleCanclebtn = () => {
    onClose();
  };

  return (
    <Box className="script-details-box">
      <Box className="align-row">
        <Typography className="script-details-text">
          {data?.script_name}
        </Typography>
        <Box className="tag-container">
          {data?.tag?.map((tag) => (
            <Box className="script-table-tag-btn">
              <Typography className="script-tag-table-values">{tag}</Typography>
            </Box>
          ))}
          <IconButton
            onClick={() => handleCloseIconClick()}
            className="close-icon"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <Box className="align-row">
        <Typography className="script-details-sub-text">
          {data?.edited_by}
        </Typography>

        <Typography className="script-details-date-value">
          {data?.last_updated_date}
        </Typography>
      </Box>
      <Box className="script-details-content-box">
        <Typography className="script-details-content-text">
          {data?.content}
        </Typography>
      </Box>

      <Box className="script-details-btn-wrapper">
        <Button
          onClick={() => handleCanclebtn()}
          className="script-details-btn-text"
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default ScriptDetails;
