import { Box, Button, CircularProgress } from "@mui/material";
import React from "react";

const NavigationButtons = ({
  currentSectionIndex,
  handleBack,
  handleNext,
  loading,
  hideBackBtn,
  hideNextBtn,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: hideBackBtn ? "flex-end" : "space-between",
        gap: 2,
        mt: 3,
      }}
    >
      {!hideBackBtn && (
        <Button
          variant="contained"
          color="info"
          onClick={handleBack}
          disabled={currentSectionIndex === 0}
        >
          Back
        </Button>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {!hideNextBtn && (
          <Button
            type="submit"
            variant="contained"
            color="info"
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} color="info" /> : "Next"}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default NavigationButtons;
