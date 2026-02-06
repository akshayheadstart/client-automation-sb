import { CloseOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const PanelTooltip = ({ list, handleUnassign }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {list?.map((details) => (
        <Typography
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
          variant="caption"
        >
          {details?.name || details?.student_name}{" "}
          <CloseOutlined
            onClick={(e) => {
              e.stopPropagation();
              handleUnassign(details?._id || details?.application_id);
            }}
            sx={{ fontSize: 15, cursor: "pointer" }}
          />
        </Typography>
      ))}
    </Box>
  );
};

export default PanelTooltip;
