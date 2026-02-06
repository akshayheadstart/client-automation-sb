import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Box, CircularProgress, Typography } from '@mui/material';
import "../../styles/Resources.css";
import "../../styles/sharedStyles.css";
const SaveConfirmDialog = ({saveConfirmOpen,handleSaveConfirmClose,handleOnCreateQuestionFormSubmit,onCancel,loading,saveButtonActive}) => {
    const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Dialog
        fullScreen={fullScreen}
        open={saveConfirmOpen}
        onClose={handleSaveConfirmClose}
        aria-labelledby="responsive-dialog-title"
      >
        <form onSubmit={handleOnCreateQuestionFormSubmit}>
        <DialogContent>
          <Box className='save-text-content-box-container'>
            <ErrorOutlineIcon/>
            <Typography className='save-confirm-dialog-text-content'>You have some Un-saved changes to save <br/>them click save.</Typography>
          </Box>
        </DialogContent>
        <Box className='save-confirm-dialog-button-box'>
        {loading ? (
          <CircularProgress size={22} color="info" />
        ) : (
          <Button
            className="resource-form-submit-btn center-align-items"
            type="submit"
            disabled={!saveButtonActive}
            classes={{
              disabled: "save-btn-disabled",
            }}
            onClick={()=>{
              handleOnCreateQuestionFormSubmit()
            }}
          >
            Save
          </Button>
        )}
        <Button
          className="resource-form-cancel-btn center-align-items"
          type="button"
          onClick={()=>{
            handleSaveConfirmClose()
            onCancel()
          }}
        >
          Cancel
        </Button>
        </Box>
        </form>
      </Dialog>
    );
};

export default SaveConfirmDialog;