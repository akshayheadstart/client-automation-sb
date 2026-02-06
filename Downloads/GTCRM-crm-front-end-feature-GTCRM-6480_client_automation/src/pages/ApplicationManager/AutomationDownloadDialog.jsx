import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { useMemo } from 'react';


const AutomationDownloadDialog = ({ openDialog, handleCloseDialog, handleDownload, selectedItems, from }) => {

    const selectedEmailIds = useMemo(() => selectedItems?.map(item => item?.email_id), [selectedItems]);
    const selectedActionTypes = useMemo(() => selectedItems?.map(item => item?.action_type), [selectedItems]);

    return (
        <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle data-testid="download-dialog-title" id="alert-dialog-title">
                {"Download"}
            </DialogTitle>
            <DialogContent>
                {selectedItems?.length > 0 ? <Typography variant="subtitle1" >
                    Are you sure you want to download? <span style={{ color: "#0a5dc2" }}>({selectedItems?.length} item selected)</span>
                </Typography>
                    :
                    <Typography variant="subtitle1" > Are you sure you want to download <span style={{ color: "#0a5dc2" }}> all</span>?
                    </Typography>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>
                    Cancel
                </Button>
                <Button onClick={() => {
                    handleCloseDialog();
                    selectedItems?.length > 0 ? handleDownload(from === "communication-log-details" ? {
                        "email_id": selectedEmailIds,
                        "action_type": selectedActionTypes
                    } : selectedItems) : handleDownload(from === "communication-log-details" ? {
                        "email_id": [],
                        "action_type": []
                    } : []);
                }} autoFocus>
                    Download
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AutomationDownloadDialog