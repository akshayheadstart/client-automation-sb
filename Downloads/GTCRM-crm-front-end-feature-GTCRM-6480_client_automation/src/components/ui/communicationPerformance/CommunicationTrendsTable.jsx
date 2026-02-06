import React from 'react'

const CommunicationTrendsTable = ({ activated, heading, tableData }) => {

    return (
        <table className={`${activated === "email" ? "email-data" : activated === "sms" ? "sms-data" : "whatsapp-data"} card`}>
            <thead>
                <tr>
                    {heading.map(item => <th key={item}>{item}</th>)}

                </tr>
            </thead>
            <tbody>
                {activated === "email" ? (
                    <>
                        {
                            tableData?.map((segment => (
                                <tr key={segment?.data_segment_id}>
                                    <td>{segment?.data_segment_name}</td>
                                    <td>{segment?.email_sent}</td>
                                    <td>{segment?.email_opened}</td>
                                    <td>{segment?.open_rate}</td>
                                    <td>{segment?.email_clicked}</td>
                                    <td>{segment?.click_rate}</td>
                                </tr>
                            )))
                        }
                    </>
                ) : (
                    <>
                        {
                            tableData?.map(segment => (
                                <tr key={segment?.data_segment_id}>
                                    <td>{segment?.data_segment_name}</td>
                                    <td>{segment?.sent}</td>
                                    <td>{segment?.delivered}</td>
                                    <td>{segment?.delivery_rate}</td>
                                </tr>
                            ))
                        }
                    </>
                )}

            </tbody>
        </table>
    )
}

export default React.memo(CommunicationTrendsTable);