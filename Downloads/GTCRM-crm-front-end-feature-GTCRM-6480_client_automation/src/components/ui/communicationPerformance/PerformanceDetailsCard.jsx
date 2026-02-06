import { Box, Grid } from '@mui/material'
import React from 'react'

const PerformanceDetailsCard = ({ color, heading, image, data }) => {

    return (
        <>
            <Grid item md={3} sm={6} xs={12} sx={{ p: { md: 2, sm: 0 } }}>
                <Box className="comm_panel_card card">

                    <div className="comm_panel_card-front">
                        <p>{heading}</p>
                        <div className="comm_panel_card_numbers">
                            <h2 className="text-blu">{data?.sent}</h2>

                            {image && <img src={image} alt="icon" className="img-fluid" />}

                        </div>
                    </div>

                    <div className="comm_panel_card-back card" style={{ "--value": data?.manual_releases, "--bg": "#0f476b", "--fg": color }}>
                        <p>{heading}</p>
                        <div className="chart-wrap">
                            <div className="auto-r">
                                <p>{data?.automated_releases}</p>
                                <small
                                >Automated <br />
                                    Releases</small>
                            </div>
                            <div role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                                <div>
                                    <p>{data?.sent}</p>
                                    <p><span>{data?.automated_releases_percentage}%</span> | <span>{data?.manual_releases_percentage}%</span></p>
                                </div>
                            </div>
                            <div className="manual-r">
                                <p>{data?.manual_releases}</p>
                                <small
                                >Manual <br />
                                    Releases</small>
                            </div>
                        </div>
                    </div>
                </Box>

            </Grid>
        </>
    )
}

export default React.memo(PerformanceDetailsCard);