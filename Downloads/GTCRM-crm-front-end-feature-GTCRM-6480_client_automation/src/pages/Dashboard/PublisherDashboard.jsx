/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardHeader,
  Divider,
  Button,
  Typography,
} from "@mui/material";

// Icons
import { Error } from "@mui/icons-material";
import "../../styles/ApplicationManagerTable.css";
import PublisherDashboardTable from "../../components/ui/publisher-dashboard/publisher-dashboard";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { removeCookies } from "../../Redux/Slices/authSlice";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import { DateRangePicker, SelectPicker } from "rsuite";
import GetJsonDate, { GetFormatDate } from "../../hooks/GetJsonDate";
import {
  blankPayloadOfPublisherDashboard,
  formStatusList,
  leadType,
  paymentStatusList,
  publisherDashboardTourSteps,
} from "../../constants/LeadStageList";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import useToasterHook from "../../hooks/useToasterHook";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import {
  useGetPublisherApplicationsQuery,
  useGetPublisherQuickViewDataQuery,
  usePrefetch,
} from "../../Redux/Slices/applicationDataApiSlice";
import PublisherDashboardCard from "../../components/ui/publisher-dashboard/PublisherDashboardCard";
import Joyride, { STATUS } from "react-joyride";
import FilterHeader from "../../components/ui/application-manager/FIlterHeader";
import LeadActions from "../../components/ui/application-manager/LeadActions";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import { handleDataFilterOption } from "../../helperFunctions/handleDataFilterOption";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import TableTopPagination from "../../components/ui/application-manager/TableTopPagination";
import {
  customFetch,
  getPublishIndicatorPosition,
  getPublisherIndicatorPercentage,
  getPublisherValue,
} from "../StudentTotalQueries/helperFunction";
const PublisherDashboard = () => {
  const pushNotification = useToasterHook();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const state = useSelector((state) => state.authentication.token);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  // const userEmail = Cookies.get("userId");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (state.detail) {
    dispatch(removeCookies());
    navigate("/page401");
  }
  // const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [openCol, setOpenCol] = useState(false);

  const [showFilterOption, setShowFilterOption] = useState(false);

  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  // states for pagination
  const applicationPageNo = localStorage.getItem(
    `${Cookies.get("userId")}publisherApplicationSavePageNo`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}publisherApplicationSavePageNo`
        )
      )
    : 1;

  const tableRowPerPage = localStorage.getItem(
    `${Cookies.get("userId")}publisherTableRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}publisherTableRowPerPage`)
      )
    : 25;
  const [pageNumber, setPageNumber] = useState(applicationPageNo);
  const [rowsPerPage, setRowsPerPage] = useState(tableRowPerPage);
  const [rowCount, setRowCount] = useState();

  const [allLeadSummary, setAllLeadSummary] = useState([]);

  //states of download all application
  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [totalApplicationCount, setTotalApplicationCount] = useState(0);

  // states for application filter
  const [allApplicationDateRange, setAllApplicationDateRange] = useState([]);
  const [selectedLeadType, setSelectedLeadType] = useState("");
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [formStatus, setFormStatus] = useState("");
  const [selectedSummery, setSelectedSummery] = useState(0);
  const [calledAllApplicationApi, setCalledAllApplicationAPI] = useState(false);

  //state for internal server error
  const [
    somethingWentWrongInPublisherAllLeads,
    setSomethingWentWrongInPublisherAllLeads,
  ] = useState(false);
  const [hidePublisherLeadsTable, setHidePublisherLeadsTable] = useState(false);
  const [
    downloadApplicationsInternalServerError,
    setDownloadApplicationsInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInDownloadApplication,
    setSomethingWentWrongInDownloadApplication,
  ] = useState(false);
  const [somethingWentWrongInGetSummary, setSomethingWentWrongInGetSummary] =
    useState(false);
  const [internalServerErrorInGetSummary, setInternalServerErrorInGetSummary] =
    useState(false);
  const [sourceType, setSourceType] = useState("primary");
  const [allApplicationPayload, setAllApplicationPayload] = useState(
    blankPayloadOfPublisherDashboard
  );

  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);
  const [applicationDetails, setApplicationDetails] = useState("");

  /// react screen tour steps with joyride
  const [{ run, steps }, setScreenTourSteps] = useState({
    run: false,
    steps: publisherDashboardTourSteps,
  });

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setScreenTourSteps({ run: false });
    }
  };

  // checking if the user is for the first time or not
  useEffect(() => {
    const userIsFirstTime = localStorage.getItem(
      `${Cookies.get("userId")}userIsFirstTimeInPublisherDashboard`
    );
    if (!userIsFirstTime) {
      localStorage.setItem(
        `${Cookies.get("userId")}userIsFirstTimeInPublisherDashboard`,
        true
      );
      setScreenTourSteps((prev) => ({ ...prev, run: true }));
    }
  }, []);

  // const [showGenerateRequest, setShowGenerateRequest] = useState(false);

  // action button-----

  const payloadForAllApplication = {
    payload: {
      state: {
        state_b: false,
        state_code: [],
      },
      city: {
        city_b: false,
        city_name: [],
      },
      source: {
        source_b: false,
        source_name: [],
      },
      lead_stage: {
        lead_b: false,
        lead_name: [],
      },
      lead_type: {
        lead_type_b: true,
        lead_type_name: selectedLeadType,
      },
      counselor: {
        counselor_b: false,
        counselor_id: [],
      },
      application_stage: {
        application_stage_b: false,
        application_stage_name: formStatus,
      },
      utm_medium_b: true,
      utm_campaign_b: true,
    },
    payment_status: paymentStatus,
  };

  if (allApplicationDateRange?.length) {
    payloadForAllApplication.date_range = JSON.parse(
      GetJsonDate(allApplicationDateRange)
    );
  }

  const {
    data: applicationData,
    isSuccess,
    isLoading: isDataLoading,
    isFetching,
    error,
    isError,
  } = useGetPublisherApplicationsQuery({
    pageNumber: pageNumber,
    rowsPerPage: rowsPerPage,
    collegeId: collegeId,
    payloadForAllApplication: allApplicationPayload,
    sourceType,
    selectedSummery,
    applicationDetails,
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        setTotalApplicationCount(applicationData?.total);
        setApplications(applicationData?.data);
        setRowCount(applicationData?.total);
      } else if (isError) {
        setApplications([]);
        setTotalApplicationCount(0);
        if (error?.detail === "Could not validate credentials") {
          window.location.reload();
        } else {
          navigate("/page500");
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInPublisherAllLeads,
        setHidePublisherLeadsTable,
        10000
      );
    }
  }, [applicationData]);

  // use react hook for this
  const prefetchAllApplications = usePrefetch("getPublisherApplications");
  useEffect(() => {
    apiCallFrontAndBackPage(
      applicationData,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchAllApplications,
      {
        payloadForAllApplication: allApplicationPayload,
        sourceType,
        selectedSummery,
        applicationDetails,
      }
    );
  }, [applicationData, pageNumber, rowsPerPage, sourceType, selectedSummery]);

  useEffect(() => {
    setCalledAllApplicationAPI(!calledAllApplicationApi);
  }, []);

  const payloadForDownloadFilterData = {
    payload: {
      college_id: collegeId,
      lead_type_name: selectedLeadType ? selectedLeadType : "",
      application_stage_name: formStatus,
      date_range: allApplicationDateRange?.length
        ? JSON.parse(GetJsonDate(allApplicationDateRange))
        : {},
      payment_status: paymentStatus,
    },
  };

  //download all applications function
  const handleAllApplicationsDownload = (downloadButtonName) => {
    setIsLoading(true);
    if (downloadButtonName === "download all" && totalApplicationCount > 200) {
      setIsLoading(false);
      pushNotification("warning", "You can not download more than 200 data");
    } else if (totalApplicationCount === 0) {
      setIsLoading(false);
      pushNotification("warning", "No application found");
    } else if (
      downloadButtonName === "custom download" &&
      selectedApplications?.length === 0
    ) {
      setIsLoading(false);
      pushNotification("warning", "Please select applications");
    } else if (
      downloadButtonName === "custom download" &&
      selectedApplications?.length > 200
    ) {
      setIsLoading(false);
      pushNotification("warning", "You can not download more than 200 data");
    } else {
      const payloadOfDownloadingAllApplication = {
        application_ids: selectedApplications,
      };
      customFetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/admin/download_applications_data/${
          collegeId ? "?college_id=" + collegeId : ""
        }`,
        ApiCallHeaderAndBody(
          token,
          "POST",
          JSON.stringify(
            downloadButtonName === "custom download"
              ? payloadOfDownloadingAllApplication
              : payloadForDownloadFilterData
          )
        )
      )
        .then((res) =>
          res.json().then((result) => {
            if (result?.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (result?.message) {
              setIsLoading(false);
              const expectedData = result?.file_url;
              try {
                if (typeof expectedData === "string") {
                  window.open(result?.file_url);
                  setSelectedApplications([]);
                  localStorage.removeItem(
                    `${Cookies.get("userId")}publisherSelectedApplications`
                  );
                } else {
                  throw new Error(
                    "download_applications_data API response has changed"
                  );
                }
              } catch (error) {
                setApiResponseChangeMessage(error);
                handleSomethingWentWrong(
                  setSomethingWentWrongInDownloadApplication,
                  "",
                  5000
                );
              }
            } else if (result?.detail) {
              pushNotification("error", result?.detail);
              setIsLoading(false);
            }
          })
        )
        .catch((err) => {
          handleInternalServerError(
            setDownloadApplicationsInternalServerError,
            "",
            5000
          );
        })
        .finally(() => setIsLoading(false));
    }
  };

  // setting filter options from localStorage
  useEffect(() => {
    const filterOptions = JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}filterOptionsOfPublisher`)
    );

    if (filterOptions) {
      if (filterOptions.leadType) {
        setSelectedLeadType(filterOptions.leadType);
      }
      if (filterOptions.formStatus) {
        setFormStatus(filterOptions.formStatus);
      }
      if (filterOptions.paymentStatus) {
        setPaymentStatus(filterOptions.paymentStatus);
      }
      if (filterOptions.dateRange) {
        const date = filterOptions.dateRange.map((range) => new Date(range));
        setAllApplicationDateRange(date);
      }
      if (
        filterOptions.leadType ||
        filterOptions.formStatus ||
        filterOptions?.dateRange?.length ||
        filterOptions.paymentStatus?.length
      ) {
        setShowFilterOption(true);
      }
    }
  }, []);
  const [publisherApplicationType, setPublisherApplicationType] =
    useState("primary");
  const [publisherIndicator, setPublisherIndicator] = useState(null);
  const [publisherQuickViewDateRange, setPublisherQuickViewDateRange] =
    useState([]);
  // getting summary of all lead of publisher
  const {
    data: publisherQuickViewData,
    isSuccess: publisherQuickViewIsSuccess,
    isFetching: publisherQuickViewIsFetching,
    error: publisherQuickViewError,
    isError: publisherQuickViewIsError,
  } = useGetPublisherQuickViewDataQuery({
    collegeId: collegeId,
    publisherIndicator: publisherIndicator,
    payload: GetFormatDate(publisherQuickViewDateRange),
  });

  useEffect(() => {
    try {
      if (publisherQuickViewIsSuccess) {
        if (Array.isArray(publisherQuickViewData?.data)) {
          setAllLeadSummary(publisherQuickViewData?.data);
        } else {
          throw new Error("get all Event API response has changed");
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setInternalServerErrorInGetSummary,
            "",
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrongInGetSummary, "", 10000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    publisherQuickViewIsSuccess,
    publisherQuickViewData,
    publisherQuickViewError,
    publisherQuickViewIsError,
    publisherQuickViewData?.data,
  ]);

  const handleUpdatePageNumber = () => {
    setPageNumber(1);
    localStorage.setItem(
      `${Cookies.get("userId")}publisherApplicationSavePageNo`,
      1
    );
  };
  const handleFilterOption = (value) => {
    handleDataFilterOption(value, "filterOptionsOfPublisher");
  };

  const filterAndColumnOption = () => {
    return (
      <>
        {showFilterOption && (
          <>
            <SelectPicker
              onChange={(value) => {
                handleFilterOption({ leadType: value });
                if (value && pageNumber !== 1) {
                  handleUpdatePageNumber();
                }
                setSelectedLeadType(value);
              }}
              data={leadType}
              placeholder="Lead Type"
              value={selectedLeadType}
              className="select-picker"
              style={{ width: 180 }}
            />{" "}
            <MultipleFilterSelectPicker
              onChange={(value) => {
                handleFilterOption({ paymentStatus: value });
                if (value && pageNumber !== 1) {
                  handleUpdatePageNumber();
                }
                setPaymentStatus(value);
              }}
              pickerData={paymentStatusList}
              placeholder="Payment status"
              pickerValue={paymentStatus}
              className="select-picker"
              setSelectedPicker={setPaymentStatus}
              handleFilterOption={(checkAll, allValue) =>
                handleFilterOption({ paymentStatus: checkAll ? allValue : [] })
              }
              style={{ width: 180 }}
            />{" "}
            <SelectPicker
              onChange={(value) => {
                handleFilterOption({ formStatus: value });
                if (value && pageNumber !== 1) {
                  handleUpdatePageNumber();
                }
                setFormStatus(value);
              }}
              data={formStatusList}
              placeholder="Form status"
              value={formStatus}
              className="select-picker"
              style={{ width: 180 }}
            />{" "}
            <DateRangePicker
              placeholder="Date Range"
              value={
                allApplicationDateRange?.length ? allApplicationDateRange : null
              }
              onChange={(value) => {
                handleFilterOption({ dateRange: value });
                if (value && pageNumber !== 1) {
                  handleUpdatePageNumber();
                }
                setAllApplicationDateRange(value);
              }}
              placement="bottomEnd"
              className="date-range-btn select-picker"
              style={{ width: 180 }}
            />
            <Button
              sx={{ ml: 0.6 }}
              variant="contained"
              size="small"
              color="info"
              disabled={
                !localStorage.getItem(
                  `${Cookies.get("userId")}filterOptionsOfPublisher`
                )
                  ? true
                  : false
              }
              onClick={() => {
                if (pageNumber !== 1) {
                  handleUpdatePageNumber();
                }
                setSelectedSummery(0);
                setAllApplicationPayload(payloadForAllApplication);
                setApplicationDetails("");
              }}
            >
              Apply
            </Button>
          </>
        )}
      </>
    );
  };
  const handleResetFilter = () => {
    localStorage.removeItem(`${Cookies.get("userId")}filterOptionsOfPublisher`);
    setPaymentStatus([]);
    setSelectedLeadType("");
    setFormStatus("");
    setSelectedSummery(0);
    if (allApplicationDateRange?.length) {
      setAllApplicationDateRange([]);
    }
    setAllApplicationPayload(blankPayloadOfPublisherDashboard);
    setApplicationDetails("");
  };
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  useEffect(() => {
    setHeadTitle("Publisher Dashboard");
    document.title = "Publisher Dashboard";
  }, [headTitle]);
  const [quickViewData, setQuickViewData] = useState([]);
  useEffect(() => {
    if (allLeadSummary?.length > 0) {
      const commonPayload = ({ prev, leadStage, paymentStatus, dateRange }) => {
        // Create the new payload object
        const newPayload = {
          ...prev.payload,
          application_stage: {
            ...prev.payload.application_stage,
            application_stage_name: leadStage,
          },
        };

        const finalPayload = {
          ...prev,
          payload: newPayload,
          payment_status: paymentStatus?.length > 0 ? [paymentStatus] : [],
        };
        // Conditionally add date_range
        if (dateRange.length > 0) {
          finalPayload.date_range = GetFormatDate(dateRange);
        }
        return finalPayload;
      };

      const topStripCardDetails = [
        {
          title: "Applications",
          value: getPublisherValue(publisherApplicationType, allLeadSummary),
          indicatorPercentage: getPublisherIndicatorPercentage(
            publisherApplicationType,
            allLeadSummary
          ),

          indicaTorPosition: getPublishIndicatorPosition(
            publisherApplicationType,
            allLeadSummary
          ),
          indicatorTitle: `Applications`,
          indicatorTooltipPosition: "right",
          handleApplyFilter: (sourceTypeValue, selectedSummaryValue) => {
            handleResetFilter();
            setSelectedSummery(selectedSummaryValue);
            setSourceType(sourceTypeValue);
            setApplicationDetails("");
            setAllApplicationPayload((prev) =>
              commonPayload({
                prev,
                leadStage: "",
                paymentStatus: [],
                dateRange:
                  publisherQuickViewDateRange?.length > 0
                    ? publisherQuickViewDateRange
                    : [],
              })
            );
          },
          subHeading: "Total Application",
          sourceType:
            publisherApplicationType === "total"
              ? ""
              : publisherApplicationType === "primary"
              ? "primary"
              : publisherApplicationType === "secondary"
              ? "secondary"
              : "tertiary",
        },
        {
          title: "Paid Application",
          value: allLeadSummary[0]?.total_paid_application,
          indicatorPercentage: parseFloat(
            allLeadSummary[0]?.total_paid_application_change_indicator
              ?.total_paid_application_perc_indicator || 0
          ).toFixed(2),
          indicaTorPosition:
            allLeadSummary[0]?.total_paid_application_change_indicator
              ?.total_paid_application_pos_indicator,
          indicatorTitle: "Paid Application",
          indicatorTooltipPosition: "right",
          handleApplyFilter: (sourceTypeValue, selectedSummaryValue) => {
            handleResetFilter();
            setSelectedSummery(selectedSummaryValue);
            setSourceType("primary");
            setApplicationDetails("");
            setAllApplicationPayload((prev) =>
              commonPayload({
                prev,
                leadStage: "",
                paymentStatus: "captured",
                dateRange:
                  publisherQuickViewDateRange?.length > 0
                    ? publisherQuickViewDateRange
                    : [],
              })
            );
          },
          subHeading: "Paid",
          sourceType: "all",
        },
        {
          title: "Form Initiated",
          value: allLeadSummary[0]?.form_initiated_count,
          indicatorPercentage: parseFloat(
            allLeadSummary[0]?.form_initiated_count_change_indicator
              ?.form_initiated_count_perc_indicator || 0
          ).toFixed(2),
          indicaTorPosition:
            allLeadSummary[0]?.form_initiated_count_change_indicator
              ?.form_initiated_count_pos_indicator,
          indicatorTitle: "Form Initiated",
          indicatorTooltipPosition: "right",
          handleApplyFilter: (sourceTypeValue, selectedSummaryValue) => {
            handleResetFilter();
            setSelectedSummery(selectedSummaryValue);
            setSourceType("primary");
            setApplicationDetails("initiated");

            setAllApplicationPayload((prev) =>
              commonPayload({
                prev,
                leadStage: "",
                paymentStatus: [],
                dateRange:
                  publisherQuickViewDateRange?.length > 0
                    ? publisherQuickViewDateRange
                    : [],
              })
            );
          },
          subHeading: "Form Initiated",
          sourceType: "all",
        },
        {
          title: "Submitted Application",
          value: allLeadSummary[0]?.total_submitted_application,
          indicatorPercentage: parseFloat(
            allLeadSummary[0]?.total_submitted_application_change_indicator
              ?.total_submitted_application_perc_indicator || 0
          ).toFixed(2),
          indicaTorPosition:
            allLeadSummary[0]?.total_submitted_application_change_indicator
              ?.total_submitted_application_pos_indicator,
          indicatorTitle: "Submitted Application",
          indicatorTooltipPosition: "top",
          handleApplyFilter: (sourceTypeValue, selectedSummaryValue) => {
            handleResetFilter();
            setSelectedSummery(selectedSummaryValue);
            setSourceType("primary");
            setApplicationDetails("complete");
            setAllApplicationPayload((prev) =>
              commonPayload({
                prev,
                leadStage: "complete",
                paymentStatus: [],
                dateRange:
                  publisherQuickViewDateRange?.length > 0
                    ? publisherQuickViewDateRange
                    : [],
              })
            );
          },
          subHeading: "Submitted",
          sourceType: "all",
        },
      ];
      setQuickViewData(topStripCardDetails);
    }
  }, [allLeadSummary, publisherApplicationType, publisherQuickViewDateRange]);
  return (
    <>
      {isDataLoading || isLoading ? (
        <Box
          data-testid="loading-animation"
          className="loading-lottie-file-container"
        >
          <LeefLottieAnimationLoader
            height={150}
            width={180}
          ></LeefLottieAnimationLoader>
        </Box>
      ) : (
        <Box
          component="main"
          className="mainTable leads-header-box-container"
          sx={{ flexGrow: 1, py: 2 }}
        >
          <Container maxWidth={false}>
            <Joyride
              disableScrolling
              callback={handleJoyrideCallback}
              continuous
              hideCloseButton
              run={run}
              scrollToFirstStep
              showProgress
              showSkipButton
              steps={steps}
              styles={{
                options: {
                  zIndex: 10000,
                  primaryColor: "#3498DB",
                },
              }}
            />
            <Grid container>
              <Grid item md={12} sm={12} xs={12}>
                {internalServerErrorInGetSummary ||
                somethingWentWrongInGetSummary ? (
                  <Box>
                    {internalServerErrorInGetSummary && (
                      <Error500Animation
                        height={200}
                        width={200}
                      ></Error500Animation>
                    )}
                    {somethingWentWrongInGetSummary && (
                      <ErrorFallback
                        error={apiResponseChangeMessage}
                        resetErrorBoundary={() => window.location.reload()}
                      />
                    )}
                  </Box>
                ) : (
                  <PublisherDashboardCard
                    allLeadSummary={allLeadSummary}
                    isSummaryLoading={publisherQuickViewIsFetching}
                    publisherIndicator={publisherIndicator}
                    setPublisherIndicator={setPublisherIndicator}
                    setPublisherApplicationType={setPublisherApplicationType}
                    publisherApplicationType={publisherApplicationType}
                    publisherQuickViewDateRange={publisherQuickViewDateRange}
                    setPublisherQuickViewDateRange={
                      setPublisherQuickViewDateRange
                    }
                    quickViewData={quickViewData}
                  />
                )}

                <Card
                  className="common-box-shadow-for-publisher"
                  sx={{ my: 2 }}
                >
                  {somethingWentWrongInPublisherAllLeads ||
                  downloadApplicationsInternalServerError ||
                  somethingWentWrongInDownloadApplication ? (
                    <>
                      {(somethingWentWrongInPublisherAllLeads ||
                        somethingWentWrongInDownloadApplication) && (
                        <ErrorFallback
                          error={apiResponseChangeMessage}
                          resetErrorBoundary={() => window.location.reload()}
                        />
                      )}
                      {downloadApplicationsInternalServerError && (
                        <Error500Animation
                          height={400}
                          width={400}
                        ></Error500Animation>
                      )}
                    </>
                  ) : (
                    <Box
                      sx={{
                        visibility: hidePublisherLeadsTable
                          ? "hidden"
                          : "visible",
                      }}
                    >
                      <Box
                        sx={{ p: 2 }}
                        className="applicationManagerTableCard"
                      >
                        <Box className="publisher-table-headline-box">
                          <Typography className="publisher-table-headline-text">
                            Lead Details
                          </Typography>
                          <FilterHeader
                            publisher={true}
                            isActionDisable={true}
                            resetFilterOptions={handleResetFilter}
                            setShowFilterOption={setShowFilterOption}
                            showFilterOption={showFilterOption}
                          />
                        </Box>
                      </Box>
                      <Box className="filter-options-container1">
                        <Box>{filterAndColumnOption()}</Box>
                        <Box className="publisher-dashboard-lead-and-top-pagination-box">
                          <CardHeader
                            sx={{
                              py: "10px",
                              px: 0,
                              fontWeight: "500 !important",
                            }}
                            title={
                              <TableDataCount
                                totalCount={totalApplicationCount}
                                currentPageShowingCount={applications?.length}
                                pageNumber={pageNumber}
                                rowsPerPage={rowsPerPage}
                              />
                            }
                          ></CardHeader>
                          <TableTopPagination
                            pageNumber={pageNumber}
                            setPageNumber={setPageNumber}
                            localStoragePageNumberKey={"adminLeadSavePageNo"}
                            rowsPerPage={rowsPerPage}
                            totalCount={totalApplicationCount}
                          />
                        </Box>
                      </Box>
                      <Box>
                        {
                          <PublisherDashboardTable
                            setIsScrolledToPagination={
                              setIsScrolledToPagination
                            }
                            loading={isFetching}
                            setLoading={setIsLoading}
                            rowCount={rowCount}
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={setRowsPerPage}
                            applications={applications}
                            openCol={openCol}
                            setOpenCol={setOpenCol}
                            key={applications.application_id}
                            setSelectedApplications={setSelectedApplications}
                            selectedApplications={selectedApplications}
                            page={pageNumber}
                            setPage={setPageNumber}
                            setDownloadApplicationsInternalServerError={
                              setDownloadApplicationsInternalServerError
                            }
                            setSomethingWentWrongInDownloadApplication={
                              setSomethingWentWrongInDownloadApplication
                            }
                          />
                        }
                      </Box>
                    </Box>
                  )}
                </Card>
              </Grid>
            </Grid>
            {selectedApplications?.length > 0 && (
              <LeadActions
                isScrolledToPagination={isScrolledToPagination}
                handleDownload={() =>
                  handleAllApplicationsDownload(
                    "custom download",
                    selectedApplications?.length
                  )
                }
                handleAllApplicationsDownload={() =>
                  handleAllApplicationsDownload(
                    "download all",
                    totalApplicationCount
                  )
                }
                selectedApplications={selectedApplications?.length}
                setSelectedApplications={setSelectedApplications}
                localStorageKey={"publisherSelectedApplications"}
                publisher={true}
              />
            )}
          </Container>
        </Box>
      )}
    </>
  );
};

export default PublisherDashboard;
