import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import "../../styles/MODDesignPage.css";

const UnAssigneeDialog = ({
  openDialog,
  handleClose,
  handleUnAssignee,
  unAssigneeStudentInfo,
  dataSet,
  loading,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent sx={{ p: 7, textAlign: "center", minWidth: 400 }}>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress value={30} color="info" />
            </Box>
          )}
          <Typography sx={{ fontSize: "22px", fontWeight: 400 }}>
            {" "}
            {unAssigneeStudentInfo?.name} will be{" "}
          </Typography>
          <Typography sx={{ fontSize: "22px", fontWeight: 400 }}>
            removed from Slot
          </Typography>
          <Typography sx={{ fontSize: "13px", fontWeight: 400, mt: 3 }}>
            Applied For: {dataSet?.course_Name} in{" "}
            {dataSet?.specialization_name}{" "}
          </Typography>
        </DialogContent>
        <Box className="unAssignee-button-design-container">
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
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ borderRadius: 30, paddingX: 3 }}
            color="info"
            onClick={() => {
              handleUnAssignee();
            }}
          >
            Confirm
          </Button>
        </Box>
      </Dialog>
    </div>
  );
};

export default UnAssigneeDialog;
