import React from 'react'
import { SelectPicker } from 'rsuite'
import LoadingLottieFile from './LoadingLottieFile'
import ReleaseSourceCount from './ReleaseSourceCount'

const CommunicationRelease = ({ logos, setIndicator, data, indicatorValue, loading, heading }) => {

    const options = [
        {
            label: "Last 7 days (default)",
            value: "last_7_days"
        },
        {
            label: "Last 15 days",
            value: "last_15_days"
        },
        {
            label: "Last 30 days",
            value: "last_30_days"
        },

    ]
    return (
        <div className="release-source_panel">
            <div className="release-source_panel_body card">
                {loading ? <LoadingLottieFile height="60vh" /> : (
                    <>
                        <div className="release-source_panel_body_header">
                            <h3>{heading}</h3>

                            <SelectPicker
                                size="lg"
                                data={options} placeholder="Change indicator"
                                searchable={false}
                                style={{ width: "180px" }}
                                onChange={setIndicator}
                                value={indicatorValue}
                            />
                        </div>

                        <ReleaseSourceCount
                            logo={logos?.emailLogo}
                            details={data?.email_details}
                            heading="Email"
                        />

                        <ReleaseSourceCount
                            logo={logos?.smsLogo}
                            details={data?.sms_details}
                            heading="SMS"
                        />


                        <ReleaseSourceCount
                            logo={logos?.whatsappLogo}
                            details={data?.whatsapp_details}
                            heading="Whatsapp"
                        />
                    </>
                )}



            </div>
        </div>
    )
}

export default React.memo(CommunicationRelease);