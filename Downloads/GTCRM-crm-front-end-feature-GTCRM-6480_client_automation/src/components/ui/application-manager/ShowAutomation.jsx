import { Typography } from "@mui/material";
import React from "react";
import CustomTooltip from "../../shared/Popover/Tooltip";

function ShowAutomation({ automationDetails }) {
  return (
    <>
      {automationDetails?.count ? (
        <CustomTooltip
          placement="left"
          color
          description={
            <>
              {automationDetails?.names?.map((name) => (
                <div>{name}</div>
              ))}
            </>
          }
          component={
            <Typography sx={{ cursor: "pointer" }}>
              {automationDetails?.count || `– –`}
            </Typography>
          }
        />
      ) : (
        <Typography>{automationDetails?.count || `– –`}</Typography>
      )}
    </>
  );
}

export default ShowAutomation;
