import { Dialog } from "@mui/material";
import OnboardingStatusSteps from "./OnboardingStatusSteps";

const OnboardingStatusDialog = ({
  open,
  setOpen,
  selectedCollegeId,
  selectedClientId,
}) => {
  return (
    <Dialog
      PaperProps={{ sx: { borderRadius: "20px" } }}
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="xl"
      fullWidth
    >
      <OnboardingStatusSteps
        selectedCollegeId={selectedCollegeId}
        selectedClientId={selectedClientId}
        showCloseIcon={true}
        setOpen={setOpen}
      />
    </Dialog>
  );
};

export default OnboardingStatusDialog;
