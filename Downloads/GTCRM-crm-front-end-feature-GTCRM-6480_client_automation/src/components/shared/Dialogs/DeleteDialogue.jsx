import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import React from "react";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import Error500Animation from "../ErrorAnimation/Error500Animation";
const DeleteDialogue = ({
  openDeleteModal,
  handleDeleteSingleTemplate,
  handleCloseDeleteModal,
  internalServerError,
  somethingWentWrong,
  apiResponseChangeMessage,
  loading,
  title,
}) => {
  return (
    <Dialog
      sx={{
        zIndex: 2001,
      }}
      maxWidth={"md"}
      open={openDeleteModal}
    >
      {internalServerError || somethingWentWrong ? (
        <Box>
          {internalServerError && (
            <Error500Animation height={400} width={400} />
          )}
          {somethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          <DialogContent>
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress value={30} color="info" />
              </Box>
            )}
            <DialogContentText
              sx={{ fontSize: "18px" }}
              id="alert-dialog-description"
            >
              {title ? title : "Are you sure , you want to delete?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDeleteSingleTemplate}
              className="common-contained-button"
              sx={{ padding: "5px 18px !important", height: "auto" }}
            >
              Confirm
            </Button>
            <Button
              onClick={handleCloseDeleteModal}
              className="common-outlined-button"
              sx={{ padding: "5px 18px !important", height: "auto" }}
            >
              Cancel
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default DeleteDialogue;
