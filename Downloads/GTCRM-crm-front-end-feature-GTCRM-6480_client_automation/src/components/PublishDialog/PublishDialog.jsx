import { Box, CircularProgress, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import "../../styles/MODDesignPage.css";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
const PublishDialog = ({
  openPublish,
  handlePublishClose,
  apiResponseChangeMessage,
  somethingWentWrongInPublishedData,
  publishedDataInternalServerError,
  handlePublishData,
  selectedDate,
  title,
  loading,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={openPublish}
        onClose={handlePublishClose}
        aria-labelledby="responsive-dialog-title"
      >
        {publishedDataInternalServerError ||
        somethingWentWrongInPublishedData ? (
          <>
            {publishedDataInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {somethingWentWrongInPublishedData && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </>
        ) : (
          <DialogContent sx={{ p: 7, textAlign: "center", minWidth: 400 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress value={30} color="info" />
              </Box>
            ) : (
              <>
                {title ? (
                  <Typography sx={{ fontSize: "22px", fontWeight: 400 }}>
                    {title}
                  </Typography>
                ) : (
                  <>
                    <Typography sx={{ fontSize: "22px", fontWeight: 400 }}>
                      {" "}
                      All Slots and Panels of this{" "}
                    </Typography>
                    <Typography sx={{ fontSize: "22px", fontWeight: 400 }}>
                      <b>{selectedDate}</b> are being Published
                    </Typography>
                  </>
                )}
              </>
            )}
          </DialogContent>
        )}
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
            onClick={handlePublishClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ borderRadius: 30, paddingX: 3 }}
            color="info"
            onClick={() => {
              handlePublishData();
            }}
          >
            Confirm
          </Button>
        </Box>
      </Dialog>
    </div>
  );
};

export default PublishDialog;
