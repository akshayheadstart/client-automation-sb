import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import BillingDetails from './BillingDetails';

const BillingDialog = ({ open, handleClose, selectedBilling }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            fullWidth="sm"
        >
            <DialogTitle id="responsive-dialog-title">
                Billing Details
            </DialogTitle>
            <DialogContent>
                <BillingDetails title="Lead Charge" content={selectedBilling.lead} />
                <BillingDetails title="Raw Data Module Charge" content={selectedBilling.raw_data_module} />
                <BillingDetails title="Lead Management Charge" content={selectedBilling.lead_management_system} />
                <BillingDetails title="App Management Charge" content={selectedBilling.app_management_system} />
                <BillingDetails title="Counselor Account Charge" content={selectedBilling.counselor_account} />
                <BillingDetails title="Client Manager Account Charge" content={selectedBilling.client_manager_account} />
                <BillingDetails title="Publisher Account Charge" content={selectedBilling.publisher_account} />
                <BillingDetails title="Per SMS Release Charge" content={selectedBilling.per_sms_charge} />
                <BillingDetails title="Per Email Release Charge" content={selectedBilling.per_email_charge} />
                <BillingDetails title="Per Whatsapp Message Charge" content={selectedBilling.per_whatsapp_charge} />
                <BillingDetails title="Total Charge" content={selectedBilling.total_bill} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} size="small" variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default BillingDialog