import { InfoOutlined } from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';

const CommunicationStatusStats = ({ item, status }) => {
    return (
        <Box style={{ backgroundColor: item === 'email' ? '#fffde7' : (item === 'sms' ? '#e3f2fd' : '#e0f2f1'), paddingBottom: '15px' }} className="emailStats_reports" >
            <Box className="status_box">
                <Box className="stats_info">
                    <Typography component="span" className="info_txt">
                        Sent
                    </Typography>
                    <Tooltip
                        className="tooltipInfo"
                        title={`Total number of ${item} sent, It includes both Activity & Engagement ${item}`}
                        placement="top"
                        arrow
                    >
                        <IconButton sx={{ p: 0.6, mt: -0.3 }}>
                            <InfoOutlined sx={{ fontSize: 17 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Typography className="stats_count">{status?.sent}</Typography>
            </Box>
            {
                (item === "email" || item === "sms") && <Box className="status_box">
                    <Box className="stats_info">
                        <Typography component="span" className="info_txt">
                            Delivered
                        </Typography>
                        <Tooltip
                            className="tooltipInfo"
                            title={`Total number of ${item} delivered, In case of server error, Inbox full or any other network issue ${item} can be delayed upto 72 hours`}
                            placement="top"
                            arrow
                        >
                            <IconButton sx={{ p: 0.6, mt: -0.3 }}>
                                <InfoOutlined sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Typography className="stats_count">{status?.unique_delivered?.[0].toLowerCase() === 'na' ? 'NA' : `${status?.unique_delivered?.[0]}%`}</Typography>
                    <Typography className="stats_totCount e-deliver">
                        {status?.unique_delivered?.[1]}
                    </Typography>
                </Box>
            }
            {
                (item === "email" || item === "whatsapp") &&
                <Box className="status_box">
                    <Box className="stats_info">
                        <Typography component="span" className="info_txt">
                            Unique Open
                        </Typography>
                        <Tooltip
                            className="tooltipInfo"
                            title={`Number of ${item} Open. It includes open count only against one lead from one campaign.`}
                            placement="top"
                            arrow
                        >
                            <IconButton sx={{ p: 0.6, mt: -0.3 }}>
                                <InfoOutlined sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Typography className="stats_count">{status?.unique_open?.[0].toLowerCase() === 'na' ? 'NA' : `${status?.unique_open?.[0]}%`}</Typography>
                    <Typography className="stats_totCount e-uniqeOpen">
                        {status?.unique_open?.[1]}
                    </Typography>
                </Box>
            }

            {(item === "email") &&
                <Box className="status_box">
                    <Box className="stats_info">
                        <Typography component="span" className="info_txt">
                            Unique Click
                        </Typography>
                        <Tooltip
                            className="tooltipInfo"
                            title="Number of unique link click from email. It includes link click count only once against one lead from one campaign."
                            placement="top"
                            arrow
                        >
                            <IconButton sx={{ p: 0.6, mt: -0.3 }}>
                                <InfoOutlined sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Typography className="stats_count">{status?.unique_click?.[0].toLowerCase() === 'na' ? 'NA' : `${status?.unique_click?.[0]}%`}</Typography>
                    <Typography className="stats_totCount e-uniqeClick">
                        {status?.unique_click?.[1]}
                    </Typography>
                </Box>
            }
            {
                item === "whatsapp" &&
                <>
                    <Box className="status_box">
                        <Box className="stats_info">
                            <Typography component="span" className="info_txt">
                                Dropped
                            </Typography>
                            <Tooltip
                                className="tooltipInfo"
                                title="Total number of whatsapp dropped, In case of server error, Inbox full or any other network issue whatsapp can be delayed upto 72 hours"
                                placement="top"
                                arrow
                            >
                                <IconButton sx={{ p: 0.6, mt: -0.3 }}>
                                    <InfoOutlined sx={{ fontSize: 17 }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Typography className="stats_count">{status?.invalid?.[0].toLowerCase() === 'na' ? 'NA' : `${status?.invalid?.[0]}%`}</Typography>
                        <Typography className="stats_totCount e-deliver">
                            {status?.invalid?.[1]}
                        </Typography>
                    </Box>
                </>
            }
        </Box >
    );
};

export default CommunicationStatusStats;