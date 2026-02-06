import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import React from 'react'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const ClientFormEditDialog = ({ open, onClose, clientMainPageInfoPageFieldState, setFormStep, formStep, logoAndBg, children }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullScreen={fullScreen}>
            <DialogTitle >
                <Typography variant="h5"> Edit Form</Typography>
            </DialogTitle>
            <DialogContent>
                <Box className="client-registration">
                    {children}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} autoFocus variant="outlined" size="small" >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ClientFormEditDialog