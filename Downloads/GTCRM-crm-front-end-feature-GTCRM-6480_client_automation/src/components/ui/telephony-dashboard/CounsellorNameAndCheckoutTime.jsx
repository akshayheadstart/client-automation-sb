import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { lastCheckoutDuration } from "../../../helperFunctions/telephonyHelperFunction";
import CustomTooltip from "../../shared/Popover/Tooltip";

function CounsellorNameAndCheckoutTime({ details, callActivityDateRange }) {
  return (
    <Box className="counsellor-name-and-checkout-time">
      {details?.reason?.icon && (
        <CustomTooltip
          description={<div>{details?.reason?.title}</div>}
          component={<img src={details?.reason?.icon} alt="reason-icon" />}
          color={true}
          placement={"right"}
        />
      )}
      <Typography>{details?.caller_name}</Typography>
      {details?.last_check_out?.length &&
        details?.counsellor_status === "Inactive" &&
        callActivityDateRange?.length === 0 && (
          <Typography className="checkout-time">
            {lastCheckoutDuration(details?.last_check_out)}
          </Typography>
        )}
    </Box>
  );
}

export default CounsellorNameAndCheckoutTime;