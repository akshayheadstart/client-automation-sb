import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

function ModuleNameAndDescription({ module,parent }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Typography variant="body1" sx={{fontWeight:parent? 600:400}}>{module?.module_name}</Typography>
      <Typography variant="caption">({module?.description})</Typography>
    </Box>
  );
}

export default ModuleNameAndDescription;
