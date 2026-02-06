import { Box, Button, Typography } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";

function AddLeadStageBtn({ handleAdd, title, btnText }) {
  return (
    <Box className="lead-stage-add-container">
      <Typography variant="h6">{title}</Typography>
      <Button
        endIcon={<AddIcon />}
        variant="contained"
        color="info"
        onClick={handleAdd}
      >
        {btnText}
      </Button>
    </Box>
  );
}

export default React.memo(AddLeadStageBtn);
