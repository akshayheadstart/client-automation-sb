import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import BootstrapDialogTitle from "../../shared/Dialogs/BootsrapDialogsTitle";
import { Box } from "@mui/system";
import SingleReportFilterDetails from "./SingleReportFilterDetails";
import MultipleReportFilterDetails from "./MultipleReportFilterDetails";
import TextArea from "../../shared/forms/TextArea";
import ApplicationFillingStage from "./ApplicationFillingStage";

const ReportDetailsDialog = ({ open, setOpen, details }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={() => setOpen(false)}
      fullWidth={true}
    >
      <BootstrapDialogTitle onClose={() => setOpen(false)}>
        Report Details
      </BootstrapDialogTitle>
      <DialogContent sx={{ px: 2 }}>
        <Box>
          <Typography variant="subtitle1">Report Name</Typography>
          <TextArea value={details?.report_name} />
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle1">Event Description</Typography>
          <TextArea value={details?.report_details} />
        </Box>
        {details.payload && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle1">Selected Filters</Typography>

            <SingleReportFilterDetails
              filterName="Lead Type"
              filterValue={details.payload.lead_type_name}
            />
            <SingleReportFilterDetails
              filterName="Verify Status"
              filterValue={details.payload.is_verify}
            />
            <SingleReportFilterDetails
              filterName="Application Stage"
              filterValue={details.payload.application_stage_name}
            />
            <MultipleReportFilterDetails
              filterName="State"
              filterValue={details.payload.state_names}
            />
            <MultipleReportFilterDetails
              filterName="Payment Status"
              filterValue={details.payload.payment_status}
            />
            <MultipleReportFilterDetails
              filterName="Source"
              filterValue={details.payload.source_name}
            />
            <MultipleReportFilterDetails
              filterName="Counselor"
              filterValue={details.payload.counselor_names}
            />
            <MultipleReportFilterDetails
              filterName="Lead Stage"
              filterValue={details.payload.lead_name}
            />
            <ApplicationFillingStage
              filterName="Application filling stage"
              filterValue={details.payload.application_filling_stage}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          className="common-contained-button"
          onClick={() => setOpen(false)}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(ReportDetailsDialog);
