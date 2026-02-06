import { Box, CircularProgress, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import "../../styles/takeSlotdialog.css";
const TakeSlotDialog = ({
  openTakeSlotDialog,
  handleClose,
  handleTakeSlot,
  selectedDate,
  slotDetails,
  loading,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={openTakeSlotDialog}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent sx={{ p: 7, textAlign: "center" }}>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress value={30} color="info" />
            </Box>
          )}
          <Typography sx={{ fontSize: "22px", fontWeight: 400 }}>
            You are taking this slot
          </Typography>
          <Typography
            sx={{ fontSize: "22px", fontWeight: 400, color: "#0B79D0" }}
          >
            {selectedDate} & {slotDetails?.time}
          </Typography>
        </DialogContent>
        <Box className="take-slot-button-design-container">
          <Button
            size="small"
            sx={{
              borderRadius: 30,
              paddingX: 3,
              bgcolor: "white",
              color: "#008BE2",
              border: "1px solid #008BE2",
            }}
            onClick={handleClose}
            className="button-cancel-design"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ borderRadius: 30, paddingX: 3 }}
            color="info"
            onClick={() => {
              handleTakeSlot();
            }}
          >
            Confirm
          </Button>
        </Box>
      </Dialog>
    </div>
  );
};

export default TakeSlotDialog;
