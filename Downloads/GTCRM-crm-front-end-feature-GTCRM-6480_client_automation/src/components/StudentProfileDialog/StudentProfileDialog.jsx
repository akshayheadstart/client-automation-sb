import { Box, CircularProgress, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import "../../styles/StudentProfilePageDesign.css";
const StudentProfileDialog = ({
  open,
  handleClose,
  selectedStudentName,
  status,
  handleChangeStatus,
  loadingChangeStatus,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent sx={{ p: 10 }}>
          <Typography sx={{ fontSize: "20px", fontWeight: 400 }}>
            {selectedStudentName} Is being {status?.title}
          </Typography>
        </DialogContent>
        <Box className="button-design-container">
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
          {loadingChangeStatus ? (
            <CircularProgress size={25} color="info" />
          ) : (
            <Button
              variant="contained"
              size="small"
              sx={{ borderRadius: 30, paddingX: 3 }}
              color="info"
              onClick={() => handleChangeStatus(status?.name)}
            >
              Confirm
            </Button>
          )}
        </Box>
      </Dialog>
    </div>
  );
};

export default StudentProfileDialog;
