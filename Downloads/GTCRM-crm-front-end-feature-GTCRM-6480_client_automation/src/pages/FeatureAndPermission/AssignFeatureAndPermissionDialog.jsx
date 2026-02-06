import React, { useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
const AssignFeatureAndPermissionDialog = ({
  openAssignFeaturesAndPermission,
  handleClose,
  infoData,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { apiResponseChangeMessage } = useContext(DashboradDataContext);
  return (
    <React.Fragment>
      <Dialog
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
        fullScreen={fullScreen}
        open={openAssignFeaturesAndPermission}
        onClose={() => {
          handleClose();
          infoData?.setSelectedOption({});
        }}
        aria-labelledby="responsive-dialog-title"
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Assign</Typography>
            <IconButton
              onClick={() => {
                handleClose();
                infoData?.setSelectedOption({});
              }}
            >
              <Close />
            </IconButton>
          </Box>
          {infoData?.isInternalServerError || infoData?.isSomethingWentWrong ? (
            <Box>
              {infoData?.isInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {infoData?.isSomethingWentWrong && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </Box>
          ) : (
            <>
             <form
             onSubmit={(e) => {
              e.preventDefault();
              infoData?.handleFunction();
            }}
             >
              <DialogContent sx={{ px: 0 }}>
                {infoData?.optionsList?.map((section) => {
                  return (
                    <Autocomplete
                      sx={{ mb: 2 }}
                      getOptionLabel={(option) => option?.label}
                      onChange={(_, value) => {
                        section?.setSelectedOption(value);
                      }}
                      options={section?.options}
                      renderInput={(params) => (
                        <TextField
                          color="info"
                          {...params}
                          label={section?.label}
                          required={section?.required}
                        />
                      )}
                    />
                  );
                })}
              </DialogContent>
              <Box
                sx={{
                  textAlign: "center",
                  mt: 1,
                }}
              >
                <Button
                  variant="contained"
                  color="info"
                  type="submit"
                  size="small"
                >
                  {infoData?.loading ? (
                    <CircularProgress
                      color="info"
                      size={25}
                      sx={{ color: "white" }}
                    />
                  ) : (
                    "Save"
                  )}
                </Button>
              </Box>
              </form>
            </>
          )}
        </Box>
      </Dialog>
    </React.Fragment>
  );
};

export default AssignFeatureAndPermissionDialog;
