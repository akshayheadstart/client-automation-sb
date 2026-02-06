import { Box, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import "../../../styles/ApplicationManagerTable.css";
import CheckinIcon from "../../../icons/CheckinIcon";
import CheckoutIcon from "../../../icons/CheckoutIcon";
import useCheckoutCheckInApiCall from "../../../hooks/apiCalls/useCheckoutCheckInApiCall";
import { useMultipleCheckInAndOutMutation } from "../../../Redux/Slices/telephonySlice";
import CheckOutReasonDialog from "../../navigations/navbar/CheckOutReasonDialog";
import DeleteDialogue from "../../shared/Dialogs/DeleteDialogue";
import { useContext } from "react";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";

const CounsellorActivityActions = ({
  selectedCounsellorID,
  counsellorCallActivityList,
  setSelectedCounsellorID,
}) => {
  const [inactiveList, setInactiveList] = useState([]);
  const [activeList, setActiveList] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCheckoutReasonDialog, setOpenCheckoutReasonDialog] =
    useState(false);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [isStatusUpdateLoading, setIsStatusUpdateLoading] = useState(false);
  const { apiResponseChangeMessage } = useContext(DashboradDataContext);
  const checkoutCheckIn = useCheckoutCheckInApiCall();
  const [multipleCheckInAndOut] = useMultipleCheckInAndOutMutation();
  const resetSelectedCounsellorId = (close) => {
    if (!close) {
      setSelectedCounsellorID([]);
      setOpenDeleteDialog(close);
      setOpenCheckoutReasonDialog(close);
    }
  };
  const handleCheckoutCheckIn = (check_in_out) => {
    const payload = {
      counsellor_ids: selectedCounsellorID,
      check_in_out,
    };
    checkoutCheckIn({
      payload,
      setIsInternalServerError,
      setIsSomethingWentWrong,
      setIsStatusUpdateLoading,
      checkInAndOut: multipleCheckInAndOut,
      setOpenCheckoutReasonDialog: resetSelectedCounsellorId,
    });
  };

  useEffect(() => {
    const inactive = [];
    const active = [];
    counsellorCallActivityList.forEach((list) => {
      const matchedIndex = selectedCounsellorID.indexOf(list?.id);
      if (matchedIndex !== -1) {
        if (list?.counsellor_status?.toLowerCase() === "inactive") {
          inactive.push(list);
        } else {
          active.push(list);
        }
      }
    });
    setInactiveList(inactive);
    setActiveList(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCounsellorID]);

  const activeAndInactiveBothPresent =
    inactiveList?.length && activeList?.length;
  return (
    <Box className="lead-action-container">
      <Box className="lead-action-wrapper">
        <Card className={`lead-action-card move-down`}>
          <Box className="lead-action-content-container">
            <Box className="lead-action-content">
              <Typography variant="subtitle1">
                {selectedCounsellorID?.length} selected
              </Typography>
            </Box>

            <Box
              sx={{
                opacity:
                  activeAndInactiveBothPresent || activeList?.length ? 0.4 : 1,
                pointerEvents:
                  activeAndInactiveBothPresent || activeList?.length
                    ? "none"
                    : "default",
              }}
              className="lead-action-content"
              onClick={() => setOpenDeleteDialog(true)}
            >
              <CheckinIcon /> Check-In
            </Box>
            <Box
              sx={{
                opacity:
                  activeAndInactiveBothPresent || inactiveList?.length
                    ? 0.4
                    : 1,
                pointerEvents:
                  activeAndInactiveBothPresent || inactiveList?.length
                    ? "none"
                    : "default",
              }}
              className="lead-action-content"
              onClick={() => setOpenCheckoutReasonDialog(true)}
            >
              <CheckoutIcon /> Check-Out
            </Box>
          </Box>
        </Card>
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
      <DeleteDialogue
        openDeleteModal={openDeleteDialog}
        handleDeleteSingleTemplate={() =>
          handleCheckoutCheckIn({ check_in_status: true })
        }
        handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
        title="Are you sure, you want to update the status?"
        loading={isStatusUpdateLoading}
        internalServerError={isInternalServerError}
        somethingWentWrong={isSomethingWentWrong}
        apiResponseChangeMessage={apiResponseChangeMessage}
      />
    </Box>
  );
};

export default CounsellorActivityActions;
