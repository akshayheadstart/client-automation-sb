import { Avatar, Box, Card, IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import WalletIcon from '@mui/icons-material/Wallet';
import PhoneMissedIcon from '@mui/icons-material/PhoneMissed';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
const QuickStatsCard = ({ title, callsVAlue, icon, backgroundColor, toolTipInfoText }) => {

    return (
        <Card
            sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                p: 3,
                backgroundColor: backgroundColor,
            }}
        >
            <Box sx={{ flexGrow: 1 }}>
                <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="overline"
                >
                    {title}
                    <Tooltip
                        title={toolTipInfoText}
                        arrow
                        placement="top"
                    >
                        <IconButton sx={{ p: 0.6, mt: -0.5 }}>
                            <InfoOutlinedIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                    </Tooltip>
                </Typography>
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexWrap: 'wrap'
                    }}
                >
                    <Typography
                        sx={{ mr: 1 }}
                        variant="h5"
                    >
                        {callsVAlue}
                    </Typography>

                </Box>
            </Box>
            <Avatar
                sx={{
                    backgroundColor: icon === 'dialed' ? '#fd947c' : (icon === 'missed' ? '#ffcc80' : (icon === 'talkTime' ? '#6fdb60' : '#fd947c')),
                    color: 'primary.contrastText',
                    height: 48,
                    width: 48
                }}
            >
                {icon === 'dialed' && <PhoneForwardedIcon fontSize="small" />}
                {icon === 'missed' && <PhoneMissedIcon fontSize="small" />}
                {icon === 'talkTime' && <WalletIcon fontSize="small" />}
                {icon === 'incoming' && <PhoneCallbackIcon fontSize="small" />}
            </Avatar>
        </Card>
    );
};

export default React.memo(QuickStatsCard);