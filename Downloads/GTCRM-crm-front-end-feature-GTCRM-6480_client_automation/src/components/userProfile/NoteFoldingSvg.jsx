import { Box } from "@mui/material";
import React from "react";

const NoteFoldingSvg = ({ type }) => {
  return (
    <Box className="note-folding-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="10"
        viewBox="0 0 13 10"
        fill="none"
      >
        <path
          d="M1.59048 0.0880373L21.7366 2.97927L0.793633 16.1963L1.59048 0.0880373Z"
          fill={
            type === "user"
              ? "#9DD2FF"
              : type === "system"
              ? "#00446E"
              : type === "counselor"
              ? "#1193A2"
              : ""
          }
        />
      </svg>
    </Box>
  );
};

export default NoteFoldingSvg;
