import React from "react";
import { Box, Card, Typography } from "@mui/material";

import QAIcon from '../../images/qaIcon.svg';

import "../../styles/inteviewList.css";

const CallListActions = ({
  selectedCallIds = "",
  isScrolledToPagination,
  onChangeQA = () => {},
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
                {selectedCallIds} selected
              </Typography>
            </Box>
            <Box
              className="lead-action-content"
              onClick={() => onChangeQA()}
            >
              <img src={QAIcon} alt="change-qa-icon" /> Change QA
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default CallListActions;
