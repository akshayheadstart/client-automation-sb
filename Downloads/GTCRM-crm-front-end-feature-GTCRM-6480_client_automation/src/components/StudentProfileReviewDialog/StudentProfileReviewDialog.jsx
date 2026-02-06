import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
const StudentProfileReviewDialog = ({handleClose,open,renderFile,setFileName,setFileUrl,setNumPages,setPageNumber}) => {
    const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <div>
        
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
            <Box sx={{ display: "flex", justifyContent: "end", p: 1 }}>
            <HighlightOffIcon
              onClick={() => {
                handleClose();
                setNumPages(null)
                setFileName(null);
                setFileUrl(null);
                setPageNumber(1);
              }}
              sx={{ cursor: "pointer" }}
            />
          </Box>
          <DialogContent sx={{ minWidth: 400}}>
            {
          renderFile()
            }
          </DialogContent>
        </Dialog>
      </div>
  
    );
};

export default StudentProfileReviewDialog;