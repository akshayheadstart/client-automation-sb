import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  TextField,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTheme } from "@mui/material/styles";
const ReportNameDialog = ({
  openReportNameDialog,
  setOpenReportNameDialog,
  handleGenerateReport,
  setReportName,
  setReportDescription,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Dialog
      open={openReportNameDialog}
      onClose={() => setOpenReportNameDialog(false)}
      fullScreen={fullScreen}
      fullWidth={true}
    >
      <DialogTitle className="filter-save-dialog-title">
        Report Details
        <CancelIcon
          onClick={() => setOpenReportNameDialog(false)}
          sx={{
            color: (theme) => theme.palette.grey[500],
            cursor: "pointer",
          }}
        ></CancelIcon>
      </DialogTitle>
      <Box sx={{ px: 2, pb: 2 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerateReport();
            setOpenReportNameDialog(false);
          }}
        >
          <Box>
            <TextField
              sx={{ width: "100%" }}
              label="Report name"
              type="text"
              required
              onChange={(event) => setReportName(event.target.value)}
              variant="outlined"
              color="info"
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              sx={{ width: "100%" }}
              label="Report description"
              size="small"
              type="text"
              onChange={(event) => setReportDescription(event.target.value)}
              variant="outlined"
              multiline
              rows={4}
              color="info"
            />
          </Box>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button type="submit" className="common-contained-button">
              Generate
            </Button>
          </Box>
        </form>
      </Box>
    </Dialog>
  );
};

export default ReportNameDialog;
