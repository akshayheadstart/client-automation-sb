/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Divider, Grid } from '@mui/material'
import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import Error500Animation from '../../../components/shared/ErrorAnimation/Error500Animation'
import BaseNotFoundLottieLoader from '../../../components/shared/Loader/BaseNotFoundLottieLoader'
import CommunicationRelease from '../../../components/ui/communicationPerformance/CommunicationRelease'
import CommunicationTrendsTable from '../../../components/ui/communicationPerformance/CommunicationTrendsTable'
import { getCommunicationData } from '../../../components/ui/communicationPerformance/GetCommunicationData'
import LoadingLottieFile from '../../../components/ui/communicationPerformance/LoadingLottieFile'
import PerformanceDetailsCard from '../../../components/ui/communicationPerformance/PerformanceDetailsCard'
import { ErrorFallback } from '../../../hooks/ErrorFallback'
import useToasterHook from '../../../hooks/useToasterHook'
import { useGetCommunicationTrendDataQuery } from '../../../Redux/Slices/applicationDataApiSlice'
import { DashboradDataContext } from '../../../store/contexts/DashboardDataContext'
import { handleInternalServerError } from '../../../utils/handleInternalServerError'
import { handleSomethingWentWrong } from '../../../utils/handleSomethingWentWrong'
import "../communicationPerformance/assets/css/style.css"
import '../../../styles/InAppCallLogs.css'

import emailLogo from "./assets/images/email.png"
import smsLogo from "./assets/images/small-sms.png"
import whatsappLogo from "./assets/images/whatsapp.png"
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { LayoutSettingContext } from '../../../store/contexts/LayoutSetting'

const CommunicationPerformanceDetails = () => {
    const [activated, setActivated] = useState("email");
    const [segmentRowPerPage, setSegmentRowPerPage] = useState(5);

    const [summaryData, setSummaryData] = useState({});
    const [automationReleaseData, setAutomationReleaseData] = useState({})
    const [manualReleaseData, setManualReleaseData] = useState({})
    const [trendData, setTrendData] = useState([])

    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingManualReleaseCount, setLoadingManualReleaseCount] = useState(false);
    const [loadingAutomatedReleaseCount, setLoadingAutomatedReleaseCount] = useState(false);

    const [summaryInternalServerError, setSummaryInternalServerError] = useState(false);
    const [releaseInternalServerError, setReleaseInternalServerError] = useState(false);
    const [trendInternalServerError, setTrendInternalServerError] = useState(false);
    const [trendSomethingWentWrong, setTrendSomethingWentWrong] = useState(false);

    const [summaryHide, setSummaryHide] = useState(false)
    const [releaseHide, setReleaseHide] = useState(false)
    const [trendHide, setTrendHide] = useState(false)

    const [automatedIndicator, setAutomatedIndicator] = useState("");
    const [manualIndicator, setManualIndicator] = useState("");

    const logos = useMemo(() => {
        return {
            emailLogo,
            whatsappLogo,
            smsLogo
        }
    }, [emailLogo, whatsappLogo, smsLogo])

    const collegeId = useSelector(state => state.authentication.currentUserInitialCollege?.id);
    const pushNotification = useToasterHook();
    const {
        apiResponseChangeMessage,
        setApiResponseChangeMessage
    } = useContext(DashboradDataContext);

    const commonActions = {
        pushNotification
    }
    useEffect(() => {

        getCommunicationData(collegeId, setSummaryData, setLoadingSummary, commonActions, setSummaryHide, setSummaryInternalServerError)

    }, [])


    useEffect(() => {
        getCommunicationData(collegeId, setAutomationReleaseData, setLoadingAutomatedReleaseCount, commonActions, setReleaseHide, setReleaseInternalServerError, "automated", automatedIndicator ? automatedIndicator : "last_7_days")
    }, [automatedIndicator])


    useEffect(() => {
        getCommunicationData(collegeId, setManualReleaseData, setLoadingManualReleaseCount, commonActions, setReleaseHide, setReleaseInternalServerError, "manual", manualIndicator ? manualIndicator : "last_7_days")
    }, [manualIndicator])

    const { data: communicationTrendData, isSuccess, isFetching, error, isError } = useGetCommunicationTrendDataQuery({ type: activated, segmentRowPerPage, collegeId });

    useEffect(() => {
        try {
            if (isSuccess) {
                if (Array.isArray(communicationTrendData?.data)) {
                    setTrendData(communicationTrendData?.data)
                } else {
                    throw new Error("Communication trend API response has been changed.")
                }
            } else if (isError) {
                if (error?.data?.detail === "Could not validate credentials") {
                    window.location.reload();
                } else if (error?.data.detail) {
                    pushNotification("error", error?.data.detail);
                }
                if (error?.status === "500") {
                    handleInternalServerError(setTrendInternalServerError, setTrendHide, 10000)
                }
            }
        } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setTrendSomethingWentWrong, setTrendHide, 10000)
        }
    }, [communicationTrendData, isSuccess, error, isError])

    const emailTableHeading = useMemo(() => ["segment name", "sent", "opened", "open rate", "clicked", "clicked rate"], []);
    const smsAndWhatsappHeading = useMemo(() => ["segment name", "sent", "delivered", "delivered rate"], [])

    const handleViewMore = () => {
        if (trendData?.length < segmentRowPerPage) {
            pushNotification("warning", "Nothing to view more.")
        } else {
            setSegmentRowPerPage((prev) => prev + 5)
        }
    }
    const {
        setHeadTitle,
        headTitle
      } = useContext(LayoutSettingContext);
      //Admin dashboard Head Title add
      useEffect(()=>{
        setHeadTitle('Communication Performance')
        document.title = 'Communication Performance';
      },[headTitle])
    return (
        <Box sx={{ px:3,pb:3 }} className='communication-performance-header-box-container'>
            <main className="communication-performance-container">
                {summaryInternalServerError ? (
                    <Error500Animation height={400} width={400}></Error500Animation>
                ) : (
                    <Box>
                        {loadingSummary ? (
                            <LoadingLottieFile height="30vh" />
                        ) : (
                            <Grid container className="comm_panel card" sx={{ display: summaryHide ? "none" : "block" }}>

                                <PerformanceDetailsCard
                                    color="#39a1d1"
                                    heading="Total Communication sent"
                                    data={summaryData?.total_communication_details}

                                />
                                <Divider orientation="vertical" flexItem variant="middle" className="comm_panel_card_vr" sx={{ mt: 5, mb: 5 }} />
                                <PerformanceDetailsCard
                                    color="#f79b30"
                                    heading="Total Email Sent"
                                    image={emailLogo}
                                    data={summaryData?.email_details}
                                />
                                <Divider orientation="vertical" flexItem variant="middle" className="comm_panel_card_vr" sx={{ mt: 5, mb: 5, mr: "-1px" }} />
                                <PerformanceDetailsCard
                                    color="#90d4f3"
                                    heading="Total SMS Sent"
                                    image={smsLogo}
                                    data={summaryData?.sms_details}
                                />
                                <Divider orientation="vertical" flexItem variant="middle" className="comm_panel_card_vr" sx={{ mt: 5, mb: 5, mr: "-1px" }} />
                                <PerformanceDetailsCard
                                    color="#83bb4c"
                                    heading="Total Whatsapp Sent"
                                    image={whatsappLogo}
                                    data={summaryData?.whatsapp_details}
                                />
                            </Grid>
                        )

                        }
                    </Box>
                )
                }

                {releaseInternalServerError ? (
                    <Error500Animation height={400} width={400}></Error500Animation>
                ) : <Box className="comm-release-source" sx={{ display: releaseHide ? "none" : "block" }}>
                    <CommunicationRelease
                        heading="Automated Releases"
                        loading={loadingAutomatedReleaseCount}
                        logos={logos}
                        setIndicator={setAutomatedIndicator}
                        indicatorValue={automatedIndicator}
                        data={automationReleaseData}
                    />
                    <CommunicationRelease
                        heading="Manual Releases"
                        loading={loadingManualReleaseCount}
                        logos={logos}
                        setIndicator={setManualIndicator}
                        indicatorValue={manualIndicator}
                        data={manualReleaseData}
                    />

                </Box>}


                <div className="segment_panel card">
                    <div className="segment_panel_header">
                        <div className="segment_panel_header-headings">
                            <h2>Data Segment Communication Trend</h2>
                            <p>Most used data segments</p>
                        </div>
                        <div className="segment_panel_header-buttons">
                            {
                                ["Email", "SMS", "Whatsapp"].map((item) => (
                                    <button
                                        className={activated === item?.toLowerCase() ? "active" : ""}
                                        onClick={() => setActivated(item?.toLowerCase())}
                                        key={item}>{item}
                                    </button>))
                            }
                        </div>
                    </div>
                    {trendSomethingWentWrong ? (
                        <ErrorFallback error={apiResponseChangeMessage} resetErrorBoundary={() => window.location.reload()} />
                    ) : trendInternalServerError ? (
                        <Error500Animation height={400} width={400}></Error500Animation>
                    ) : (
                        <Box className="segment_panel_table" sx={{ display: trendHide ? "none" : "block" }} >
                            {/* <!-- Please Toggle the className to change the theme of table ([sms-data,email-data,whatsapp-data]) --> */}
                            {isFetching ? (
                                <LoadingLottieFile height="40vh" />
                            ) : <div className="table-wrap">
                                {trendData?.length === 0 ? (
                                    <BaseNotFoundLottieLoader height={200} width={200}></BaseNotFoundLottieLoader>
                                ) : (
                                    <CommunicationTrendsTable
                                        activated={activated}
                                        heading={activated === "email" ? emailTableHeading : smsAndWhatsappHeading}
                                        tableData={trendData}
                                    />
                                )
                                }
                            </div>}

                            <div className="view-more-cta">
                                <button onClick={handleViewMore} className="btn btn-white btn-animate">View More</button>
                            </div>
                        </Box>
                    )}
                </div>
            </main>
        </Box>
    )
}

export default CommunicationPerformanceDetails