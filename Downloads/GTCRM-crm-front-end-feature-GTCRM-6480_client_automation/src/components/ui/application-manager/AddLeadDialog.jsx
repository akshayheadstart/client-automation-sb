import { Dialog } from "@mui/material";
import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CustomLeadForm from "../../../pages/ApplicationManager/CustomLeadForm";
const AddLeadDialog = ({
  openAddLeadDialog,
  setOpenLeadDialog,
  callSource,
  utmMedium,
  phoneNumber,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Dialog
      fullScreen={fullScreen}
      open={openAddLeadDialog}
      onClose={() => setOpenLeadDialog(false)}
    >
      <CustomLeadForm
        showingInDialog={true}
        setOpenDialog={setOpenLeadDialog}
        callSource={callSource}
        utmMedium={utmMedium}
        phoneNumber={phoneNumber}
      />
    </Dialog>
  );
};

export default AddLeadDialog;
