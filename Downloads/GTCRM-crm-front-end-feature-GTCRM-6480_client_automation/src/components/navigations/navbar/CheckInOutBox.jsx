import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Toggle } from "rsuite";
import CustomTooltip from "../../shared/Popover/Tooltip";
import CheckOutReasonDialog from "./CheckOutReasonDialog";
import useCheckoutCheckInApiCall from "../../../hooks/apiCalls/useCheckoutCheckInApiCall";
import { useCheckInAndOutMutation } from "../../../Redux/Slices/telephonySlice";
const CheckInOutBox = ({ currentUserDetails }) => {
  const [openCheckoutReasonDialog, setOpenCheckoutReasonDialog] =
    useState(false);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [isStatusUpdateLoading, setIsStatusUpdateLoading] = useState(false);

  const checkoutCheckIn = useCheckoutCheckInApiCall();
  const [checkInAndOut] = useCheckInAndOutMutation();

  const handleCheckoutCheckIn = (payload) => {
    checkoutCheckIn({
      payload,
      setIsInternalServerError,
      setIsSomethingWentWrong,
      setIsStatusUpdateLoading,
      checkInAndOut,
      setOpenCheckoutReasonDialog,
    });
  };

  return (
    <Box className="user-check-in-out-option-container">
      <Typography>Dialer Check-in</Typography>

      <CustomTooltip
        description={
          currentUserDetails?.check_in_status
            ? "Check-out from the dialer to stop incoming calls"
            : "Check-in to dialer to receive incoming call"
        }
        component={<InfoOutlinedIcon />}
      />
      <Box
        className={
          currentUserDetails?.check_in_status ? "" : "user-check-in-out-switch"
        }
      >
        <Toggle
          onChange={(event) => {
            if (event) {
              handleCheckoutCheckIn({ check_in_status: true });
            } else {
              setOpenCheckoutReasonDialog(true);
            }
          }}
          checked={currentUserDetails?.check_in_status}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          loading={isStatusUpdateLoading}
        />
      </Box>
      <CheckOutReasonDialog
        open={openCheckoutReasonDialog}
        setOpen={setOpenCheckoutReasonDialog}
        isStatusUpdateLoading={isStatusUpdateLoading}
        isSomethingWentWrong={isSomethingWentWrong}
        isInternalServerError={isInternalServerError}
        setIsInternalServerError={setIsInternalServerError}
        setIsSomethingWentWrong={setIsSomethingWentWrong}
        handleCheckoutCheckIn={handleCheckoutCheckIn}
      />
    </Box>
  );
};

export default CheckInOutBox;
