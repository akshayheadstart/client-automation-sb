import { Tooltip } from "@mui/material";
import React from "react";

function ShowLeadSubStage({ userProfileHeader }) {
  const subStage = userProfileHeader?.basic_info?.lead_sub_stage;
  return (
    <Tooltip
      title={subStage?.length > 15 ? subStage : ""}
      placement="top"
      arrow
    >
      <span onClick={(e) => e.stopPropagation()}>
        {subStage?.substring(0, 15)} {subStage?.length > 15 ? "..." : ""}
      </span>
    </Tooltip>
  );
}

export default ShowLeadSubStage;
