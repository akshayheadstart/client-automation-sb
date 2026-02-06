import React, { useMemo } from "react";
import "../../../../styles/ApplicationManagerTable.css";
import { Box, Button, Card, CircularProgress, Typography } from "@mui/material";

function ModuleSubscriptionActions({
  isScrolledToPagination,
  selectedModules,
  handleSubmitFeatures,
  isLoading,
}) {
  const moduleAmount = useMemo(() => {
    let totalAmount = 0;
    selectedModules.forEach((module) => {
      if (module.features?.length) {
        module.features.forEach((feature) => (totalAmount += feature?.amount));
      } else {
        totalAmount += module?.amount;
      }
    });
    return totalAmount;
  }, [selectedModules]);

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
                {selectedModules?.length} Selected
              </Typography>
            </Box>
            {moduleAmount >= 0 && (
              <Box className="lead-action-content">
                <Typography variant="subtitle1">
                  Price : {moduleAmount}
                </Typography>
              </Box>
            )}
            {isLoading ? (
              <CircularProgress size={30} color="info" />
            ) : (
              <Box
                className="lead-action-content"
                onClick={handleSubmitFeatures}
              >
                <Button className="common-outlined-button">Save</Button>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

export default ModuleSubscriptionActions;
