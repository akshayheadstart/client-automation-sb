import React from 'react'
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {TextField } from '@mui/material';
import { useState } from 'react';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import '../../../styles/sharedStyles.css'

const SelectFollowupDate = ({ setDateTimeError, setFollowUpDate, dateTimeError, followupDate }) => {
    const [open, setOpen] = useState(true);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDateTimePicker
                minDate={new Date()}
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                onError={(newError) => setDateTimeError(newError)}
                onChange={(newDate) => {
                    setFollowUpDate(newDate);
                }}
                label="Followup Date"
                sx={{
                    width: "100%",
                    '& label': {
                      color: '#018CE2 !important',
                    },
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#018CE2', 
                      },
                      '& fieldset': {
                        borderColor: '#018CE2 !important',
                        color: '#018CE2 !important',
                      },
                    },
                    
                  }}
                slotProps={{
                    textField: {
                        helperText: dateTimeError ? "Past date is not allowed." : "",
                    },
                    
                }}
                renderInput={(inputProps) => (
                    <TextField
                        onClick={(e) => setOpen(true)}
                        fullWidth
                        onKeyDown={(e) => e.preventDefault()}
                        {...inputProps}
                        color='info'
                    />
                )}
                value={followupDate}
            />
        </LocalizationProvider>
    )
}

export default SelectFollowupDate