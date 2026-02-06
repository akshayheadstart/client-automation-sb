import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import React from 'react'
import BootstrapDialogTitle from '../../components/shared/Dialogs/BootsrapDialogsTitle';

const TemplateDetailsDialog = ({ openDialog, handleCloseDialog, templateDetails, typeOfTemplate }) => {

    return (
        <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <BootstrapDialogTitle onClose={handleCloseDialog}>
                Template Details
            </BootstrapDialogTitle>
            <DialogContent>
                {(typeOfTemplate === "email") && (
                    <>
                        <iframe
                            style={{ pointerEvents: "none" }}
                            srcDoc={templateDetails?.email?.template_content}
                            title="3"
                            width="100%"
                            height={`${window.innerHeight * 0.4}px`}
                        ></iframe>
                    </>
                )}

                {(typeOfTemplate === "sms") && (
                    <TextField
                        data-testid="sms-template-content"
                        aria-readonly
                        defaultValue={templateDetails?.sms?.template_content}
                        value={templateDetails?.sms?.template_content}
                        sx={{ mt: 2 }}
                        fullWidth
                        multiline
                        rows={4}
                        color="info"
                    />
                )}

                {(typeOfTemplate === "whatsapp") && (
                    <TextField
                        aria-readonly
                        defaultValue={templateDetails?.whatsapp?.template_content}
                        value={templateDetails?.whatsapp?.template_content}
                        sx={{ mt: 2 }}
                        fullWidth
                        multiline
                        rows={4}
                        color="info"
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default TemplateDetailsDialog