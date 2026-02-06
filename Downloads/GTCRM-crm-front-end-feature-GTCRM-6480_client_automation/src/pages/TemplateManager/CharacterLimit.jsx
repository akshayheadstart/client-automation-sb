import { Box } from "@mui/system";
import React from "react";

function CharacterLimit({
  editorInputCount,
  contentLimit,
  textFillPercentage,
}) {
  return (
    <Box
      className={`character-count ${
        editorInputCount === contentLimit
          ? "character-count--danger"
          : editorInputCount > contentLimit - 25
          ? "character-count--warning"
          : ""
      }`}
    >
      {/* <svg
        height="20"
        width="20"
        viewBox="0 0 20 20"
        className="character-count--graph"
      >
        <circle r="10" cx="10" cy="10" fill="#e9ecef" />
        <circle
          r="5"
          cx="10"
          cy="10"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray={`calc(${textFillPercentage} * 31.4 / 100) 31.4`}
          transform="rotate(-90) translate(-20)"
        />
        <circle r="6" cx="10" cy="10" fill="white" />
      </svg> */}

      <div className="character-count--text">
        {editorInputCount}/{contentLimit} words
      </div>
    </Box>
  );
}

export default CharacterLimit;
