import React from 'react'
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import EastIcon from '@mui/icons-material/East';

const ReleaseSourceCount = ({ logo, details, heading }) => {
    return (
        <div className="release-source_panel_body_part">
            <div className="release-source_panel_body_part-report">
                <div className="report-type">
                    <img src={logo} alt="email" />
                    <p>{heading}</p>
                </div>
                <div>
                    <p>{details?.sent}<small>Sent</small></p>
                </div>
                <div className={`report-clickrate ${details?.open_rate_position === "down" ? "downtrend" : "uptrend"}`}>
                    <p>{details?.open_rate}%<small>Open Rate</small></p>
                    {details?.open_rate_percentage >= 0 && <div className="trend">
                        <span>

                            {details?.open_rate_position === "equal" ? <EastIcon /> : details?.open_rate_position === "up" ? <NorthIcon /> : <SouthIcon />}
                        </span>
                        <span>{details?.open_rate_percentage}%</span>
                    </div>}
                </div>
                <div className={`report-clickrate ${details?.click_rate_position === "down" ? "downtrend" : "uptrend"}`}>
                    <p>{details?.click_rate}%<small>Click Rate</small></p>
                    {details?.click_rate_percentage >= 0 && <div className="trend">
                        <span>

                            {details?.click_rate_position === "equal" ? <EastIcon /> : details?.click_rate_position === "up" ? <NorthIcon /> : <SouthIcon />}
                        </span>
                        <span>{details?.click_rate_percentage}%</span>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default ReleaseSourceCount