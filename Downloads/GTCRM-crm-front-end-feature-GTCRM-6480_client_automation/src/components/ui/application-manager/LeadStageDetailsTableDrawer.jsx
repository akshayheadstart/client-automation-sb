import { CloseOutlined } from "@mui/icons-material";
import { Box, Card, Drawer, IconButton, Typography } from "@mui/material";
import React, { useCallback, useEffect } from "react";
// import { Drawer } from "rsuite";
import LaunchIcon from "@mui/icons-material/Launch";
import SharedLeadDetailsTable from "./SharedLeadDetailsTable";
import TableDataCount from "./TableDataCount";
import TableTopPagination from "./TableTopPagination";
import { useState } from "react";
import {
  useGetCounselorListQuery,
  useGetLeadAndApplicationStageDetailsQuery,
  usePrefetch,
} from "../../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
import useToasterHook from "../../../hooks/useToasterHook";
import { useContext } from "react";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import AutoCompletePagination from "../../shared/forms/AutoCompletePagination";
import Pagination from "../../shared/Pagination/Pagination";
import { handleChangePage } from "../../../helperFunctions/pagination";
import { defaultRowsPerPageOptions } from "../../Calendar/utils";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import ChangeMultipleLeadStage from "../counsellor-dashboard/ChangeMultipleLeadStage";
import LeadActions from "./LeadActions";
import { Link, useNavigate } from "react-router-dom";
import { removeCookies } from "../../../Redux/Slices/authSlice";
import { useDispatch } from "react-redux";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import Cookies from "js-cookie";
import SendEmailVerificationDialog from "../../shared/Dialogs/SendEmailVerificationDialog";
import SmsAndWhatsapp from "../../userProfile/SmsAndWhatsapp";
import SelectTemplateDialog from "../../../pages/TemplateManager/SelectTemplateDialog";
import Mail from "../../userProfile/Mail";
import AssignCounsellorDialog from "./AssignCounsellorDialog";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useFetchCommonApi from "../../../hooks/useFetchCommonApi";
import { apiCallFrontAndBackPage } from "../../../helperFunctions/apiCallFrontAndBackPage";
import { customFetch } from "../../../pages/StudentTotalQueries/helperFunction";
const LeadStageDetailsTableDrawer = ({
  setOpenLeadStageDrawer,
  openLeadStageDrawer,
  clickedLeadStage,
  setClickedLeadStage,
  fromApplication,
  handleOpenUserProfileDrawer,
  setUserDetailsStateData,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [studentId, setStudentId] = useState([]);
  useEffect(() => {
    localStorage.setItem(
      `${Cookies.get("userId")}adminApplicationSavePageNo`,
      JSON.stringify(1)
    );
  }, []);
  // states for pagination
  const applicationPageNo = localStorage.getItem(
    `${Cookies.get("userId")}adminApplicationSavePageNo`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}adminApplicationSavePageNo`
        )
      )
    : 1;

  const tableRowPerPage = localStorage.getItem(
    `${Cookies.get("userId")}adminTableRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}adminTableRowPerPage`)
      )
    : 25;
  const [pageNumber, setPageNumber] = useState(applicationPageNo);
  const [rowsPerPage, setRowsPerPage] = useState(tableRowPerPage);
  const [leadDetailsPayload, setLeadDetailsPayload] = useState({});
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [selectedVerificationStatus, setSelectedVerificationStatus] =
    useState("");
  const [selectedLeadStage, setSelectedLeadStage] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [leadStageDetails, setLeadStageDetails] = useState([]);
  const [totalLeadStageCount, setTotalLeadStageCount] = useState(0);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const pushNotification = useToasterHook();

  const handleCloseDrawer = () => {
    setClickedLeadStage({});
    setOpenLeadStageDrawer(false);
  };

  const [listOfCourses, setListOfCourses] = useState([]);

  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedMobileNumbers, setSelectedMobileNumbers] = useState([]);

  //send verification email dialog state
  const [openSendVerificationEmailDialog, setOpenSendVerificationEmailDialog] =
    useState(false);

  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);
  const [paginationRef, { entry: paginationEntry }] = useIntersectionObserver();
  const isPaginationVisible =
    paginationEntry && paginationEntry?.isIntersecting;

  const [
    openDialogsAssignCounsellorForUser,
    setOpenDialogsAssignCounsellorForUser,
  ] = useState(false);

  //states of user scope
  const [collegeHeadCounsellor, setCollegeHeadCounsellor] = useState(false);
  const [collegeCounsellor, setCollegeCounsellor] = useState(false);
  const [collegeSuperAdmin, setCollegeSuperAdmin] = useState(false);
  const [collegeAdmin, setCollegeAdmin] = useState(false);

  //mail component states
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [emailPayload, setEmailPayload] = useState(false);
  const handleComposeClick = useCallback(
    (mailType) => {
      if (mailType === "selected email") {
        if (selectedApplications?.length === 0) {
          // setIsLoading(false);
          pushNotification("warning", "Please select applications");
        } else {
          setEmailPayload(false);
          setIsComposeOpen(true);
        }
      } else {
        setEmailPayload(true);
        setIsComposeOpen(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedApplications]
  );

  const handleComposerClose = () => {
    setIsComposeOpen(false);
  };

  //select sms template component
  const [openSelectTemplateDialog, setOpenSelectTemplateDialog] =
    React.useState(false);
  const [templateBody, setTemplateBody] = React.useState("");
  const [templateId, setTemplateId] = useState("");
  const [smsDltContentId, setSmsDltContentId] = React.useState("");
  const [smsType, setSmsType] = React.useState("");
  const [smsSenderName, setSenderName] = React.useState("");
  const [templateType, setTemplateType] = React.useState("");

  const handleClickOpenSelectTemplate = useCallback(
    (type) => {
      if (selectedApplications?.length === 0) {
        pushNotification("warning", "Please select applications");
      } else {
        setOpenSelectTemplateDialog(true);
        setTemplateType(type);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedApplications]
  );

  const handleCloseSelectTemplate = () => {
    setOpenSelectTemplateDialog(false);
  };

  //sms
  const [openDialogsSms, setOpenDialogsSms] = React.useState(false);
  const handleClickOpenDialogsSms = useCallback(() => {
    setOpenDialogsSms(true);
  }, []);
  const handleCloseDialogsSms = useCallback(() => {
    setOpenDialogsSms(false);
  }, []);
  //sms
  const [openDialogsWhatsApp, setOpenDialogsWhatsApp] = React.useState(false);
  const handleClickOpenDialogsWhatsApp = useCallback(() => {
    if (selectedApplications?.length === 0) {
      pushNotification("warning", "Please select applications");
    } else {
      setOpenDialogsWhatsApp(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedApplications]);

  const handleCloseDialogsWhatsApp = useCallback(() => {
    setOpenDialogsWhatsApp(false);
  }, []);

  //dialogs to change multiple lead stage
  const [openDialogsLead, setOpenDialogsLead] = useState(false);
  const handleClickOpenDialogsLead = useCallback(() => {
    setOpenDialogsLead(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedApplications]);

  const handleCloseDialogsLead = useCallback(() => {
    setOpenDialogsLead(false);
  }, []);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const { leadStageLabelList, setSkipCallNameAndLabelApi, loadingLabelList } =
    useFetchCommonApi();

  const isActionDisable = useSelector(
    (state) => state.authentication.isActionDisable
  );

  const tokenState = useSelector((state) => state.authentication.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  if (tokenState.detail) {
    dispatch(removeCookies());
    navigate("/page401");
  }
  const { handleFilterListApiCall } = useCommonApiCalls();

  const [skipCounselorApiCall, setSkipCounselorApiCall] = useState(false);
  const [counsellorList, setCounsellorList] = useState([]);

  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId },
    {
      skip: skipCounselorApiCall,
    }
  );

  //get counsellor list
  useEffect(() => {
    if (!skipCounselorApiCall) {
      const counselorList = counselorListApiCallInfo.data?.data[0];
      handleFilterListApiCall(
        counselorList,
        counselorListApiCallInfo,
        setCounsellorList,
        () => {}
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCounselorApiCall, counselorListApiCallInfo]);

  //according to user scope set the value
  useEffect(() => {
    if (tokenState?.scopes?.[0] === "college_head_counselor") {
      setCollegeHeadCounsellor(true);
    } else if (tokenState?.scopes?.[0] === "college_counselor") {
      setCollegeCounsellor(true);
    } else if (tokenState?.scopes?.[0] === "college_super_admin") {
      setCollegeSuperAdmin(true);
    } else if (tokenState?.scopes?.[0] === "college_admin") {
      setCollegeAdmin(true);
    }
  }, [tokenState?.scopes]);

  useEffect(() => {
    if (isPaginationVisible) {
      setIsScrolledToPagination(true);
    } else {
      setIsScrolledToPagination(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginationVisible]);
  const selectedSeason = useSelector(
    (state) => state.authentication.selectedSeason
  );
  const seasonId = selectedSeason?.length
    ? JSON.parse(selectedSeason)?.season_id
    : "";

  const { isSuccess, isError, error, isFetching, data } =
    useGetLeadAndApplicationStageDetailsQuery(
      {
        collegeId,
        pageNumber,
        rowsPerPage,
        payload: leadDetailsPayload,
        clickedLeadStage,
        fromApplication,
        seasonId,
      },
      { skip: clickedLeadStage?.title ? false : true }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setLeadStageDetails(data.data);
          setTotalLeadStageCount(data.total);
          const applications = [...data?.data];
          const applicationsWithPageNumber = applications.map((application) => {
            const updatedApplication = { ...application };
            updatedApplication.pageNo = pageNumber;
            return updatedApplication;
          });
          localStorage.setItem(
            `${Cookies.get("userId")}applications`,
            JSON.stringify(applicationsWithPageNumber)
          );
          localStorage.setItem(
            `${Cookies.get("userId")}applicationsTotalCount`,
            JSON.stringify(data?.total)
          );
        } else {
          throw new Error(
            "Lead Stage details API's response has been changed."
          );
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setIsInternalServerError, "", 10000);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error, data]);

  const prefetchAllApplications = usePrefetch(
    "getLeadAndApplicationStageDetails"
  );
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchAllApplications,
      {
        clickedLeadStage,
        fromApplication,
        payload: leadDetailsPayload,
        seasonId,
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, prefetchAllApplications, rowsPerPage, collegeId]);

  const payloadForAllApplication = {
    lead_stage: selectedLeadStage,
    course_wise: selectedCourse,
    payment_status: paymentStatus,
    is_verify: selectedVerificationStatus,
  };

  const handleApplyQuickFilters = useCallback(
    (clearedKay) => {
      const updatedPayload = { ...payloadForAllApplication };
      if (clearedKay) {
        updatedPayload[clearedKay] = [];
      }
      setLeadDetailsPayload(updatedPayload);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedLeadStage,
      paymentStatus,
      selectedVerificationStatus,
      selectedCourse,
    ]
  );

  const count = Math.ceil(totalLeadStageCount / rowsPerPage);
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const payloadOfDownloadingAllApplication = {
    application_ids: selectedApplications,
  };
  //download all applications function
  const handleAllApplicationsDownload = useCallback(
    (_, application) => {
      // setIsLoading(true);
      if (application > 200) {
        // setIsLoading(false);
        pushNotification(
          "warning",
          "Selected data is more than 200 kindly select data less than 200 and request again "
        );
      } else {
        customFetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/admin/download_applications_data/?form_initiated=false&college_id=${collegeId}`,
          ApiCallHeaderAndBody(
            token,
            "POST",
            JSON.stringify(payloadOfDownloadingAllApplication)
          )
        )
          .then((res) =>
            res.json().then((result) => {
              if (result?.detail === "Could not validate credentials") {
                window.location.reload();
              } else if (result?.message) {
                const expectedData = result?.file_url;
                try {
                  if (typeof expectedData === "string") {
                    window.open(result?.file_url);
                    setSelectedApplications([]);
                  } else {
                    throw new Error(
                      "download_applications_data API response has changed"
                    );
                  }
                } catch (error) {
                  setApiResponseChangeMessage(error);
                  handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
                }
              } else if (result?.detail) {
                pushNotification("error", result?.detail);
              }
            })
          )
          .catch((err) => {
            handleInternalServerError(setIsInternalServerError, "", 5000);
          })
          .finally(() => {
            // setIsLoading(false)
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [payloadOfDownloadingAllApplication]
  );

  const quickFilterList = [
    {
      label: "Fresh Lead",
      color: "#00B087",
      value: ["Fresh Lead"],
      stateValue: selectedLeadStage,
      setStateValue: setSelectedLeadStage,
      isChecked: selectedLeadStage?.includes("Fresh Lead"),
    },
    {
      label: "Verified",
      color: "#008BE2",
      value: "verified",
      stateValue: selectedVerificationStatus,
      setStateValue: setSelectedVerificationStatus,
      isChecked: selectedVerificationStatus === "verified",
    },
    {
      label: "Paid lead",
      color: "#1D8F00",
      value: "captured",
      stateValue: paymentStatus,
      setStateValue: setPaymentStatus,
      isChecked: paymentStatus?.includes("captured"),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Drawer
        disableEnforceFocus={true}
        PaperProps={{
          sx: {
            width: fullScreen ? "100%" : "70%",
          },
        }}
        open={openLeadStageDrawer}
        onClose={handleCloseDrawer}
        anchor="right"
      >
        <Box sx={{ p: 3 }}>
          <Box className="lead-stage-details-drawer-header">
            <Box>
              <Typography sx={{ textTransform: "capitalize" }} variant="h6">
                {clickedLeadStage.title?.split("_").join(" ")}{" "}
              </Typography>
              <Link
                to={{
                  pathname: "/stageDetailsTable",
                  search: `?title=${clickedLeadStage?.title}&fromApplication=${
                    fromApplication || ""
                  }`,
                }}
                target="_blank"
              >
                <IconButton sx={{ p: 0.4 }}>
                  <LaunchIcon />{" "}
                </IconButton>
              </Link>
            </Box>
            <IconButton onClick={handleCloseDrawer}>
              <CloseOutlined />
            </IconButton>
          </Box>
          <Box>
            <Card
              sx={{ my: 2, p: 2, borderRadius: 3 }}
              className="common-box-shadow"
            >
              {isInternalServerError || isSomethingWentWrong ? (
                <Box>
                  {isInternalServerError && (
                    <Error500Animation
                      height={400}
                      width={400}
                    ></Error500Animation>
                  )}
                  {isSomethingWentWrong && (
                    <ErrorFallback
                      error={apiResponseChangeMessage}
                      resetErrorBoundary={() => window.location.reload()}
                    />
                  )}
                </Box>
              ) : (
                <>
                  {isFetching ? (
                    <Box className="loading-lottie-file-container">
                      <LeefLottieAnimationLoader width={150} height={150} />
                    </Box>
                  ) : (
                    <>
                      <Box
                        className="table-data-count-container"
                        sx={{ justifyContent: "space-between", my: 1 }}
                      >
                        <TableDataCount
                          totalCount={totalLeadStageCount}
                          currentPageShowingCount={leadStageDetails.length}
                          pageNumber={pageNumber}
                          rowsPerPage={rowsPerPage}
                        />
                        <TableTopPagination
                          pageNumber={pageNumber}
                          setPageNumber={setPageNumber}
                          localStoragePageNumberKey={
                            "adminApplicationSavePageNo"
                          }
                          totalCount={totalLeadStageCount}
                          rowsPerPage={rowsPerPage}
                        />
                      </Box>

                      <>
                        <SharedLeadDetailsTable
                          quickFilterList={quickFilterList}
                          studentId={studentId}
                          setStudentId={setStudentId}
                          setSelectedApplications={setSelectedApplications}
                          selectedApplications={selectedApplications}
                          handleApplyQuickFilters={handleApplyQuickFilters}
                          showPaymentStatus={false}
                          setSelectedLeadStage={setSelectedLeadStage}
                          selectedLeadStage={selectedLeadStage}
                          setSelectedCourse={setSelectedCourse}
                          selectedCourse={selectedCourse}
                          leadStageDetails={leadStageDetails}
                          listOfCourses={listOfCourses}
                          setListOfCourses={setListOfCourses}
                          leadStageLabelList={leadStageLabelList}
                          loadingLabelList={loadingLabelList}
                          setSkipCallNameAndLabelApi={
                            setSkipCallNameAndLabelApi
                          }
                          setSelectedMobileNumbers={setSelectedMobileNumbers}
                          selectedMobileNumbers={selectedMobileNumbers}
                          selectedEmails={selectedEmails}
                          setSelectedEmails={setSelectedEmails}
                          handleOpenUserProfileDrawer={
                            handleOpenUserProfileDrawer
                          }
                          setUserDetailsStateData={setUserDetailsStateData}
                        />
                        {leadStageDetails?.length > 0 && (
                          <Box
                            ref={paginationRef}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Pagination
                              className="pagination-bar"
                              currentPage={pageNumber}
                              totalCount={totalLeadStageCount}
                              pageSize={rowsPerPage}
                              onPageChange={(page) =>
                                handleChangePage(
                                  page,
                                  "adminApplicationSavePageNo",
                                  setPageNumber
                                )
                              }
                              count={count}
                            />
                            <AutoCompletePagination
                              rowsPerPage={rowsPerPage}
                              rowPerPageOptions={rowPerPageOptions}
                              setRowsPerPageOptions={setRowsPerPageOptions}
                              rowCount={totalLeadStageCount}
                              page={pageNumber}
                              localStorageChangeRowPerPage={`adminTableRowPerPage`}
                              localStorageChangePage={`adminApplicationSavePageNo`}
                              setPage={setPageNumber}
                              setRowsPerPage={setRowsPerPage}
                            ></AutoCompletePagination>
                          </Box>
                        )}
                      </>
                    </>
                  )}
                </>
              )}
            </Card>
          </Box>
        </Box>
      </Drawer>
      <Box sx={{ width: "100%", zIndex: 1290, position: "relative" }}>
        {selectedApplications?.length > 0 && !isActionDisable && (
          <LeadActions
            handleAssignCounselor={() =>
              setOpenDialogsAssignCounsellorForUser(true)
            }
            assignCounselorPermission={true}
            studentId={studentId}
            showMergeLead={true}
            handleClickOpenSelectTemplate={handleClickOpenSelectTemplate}
            isScrolledToPagination={isScrolledToPagination}
            handleDownload={handleAllApplicationsDownload}
            handleSentWhatsapp={handleClickOpenDialogsWhatsApp}
            handleSendSms={handleClickOpenSelectTemplate}
            handleSentEmail={handleComposeClick}
            smsEmailWhatsappPermission={
              collegeHeadCounsellor ||
              collegeSuperAdmin ||
              collegeAdmin ||
              collegeCounsellor
            }
            handleChangeLeadStage={handleClickOpenDialogsLead}
            changeLeadStagePermission={true}
            selectedApplications={selectedApplications?.length}
            setSelectedApplications={setSelectedApplications}
            setSelectedEmails={setSelectedEmails}
            handleSendVerificationEmail={() =>
              setOpenSendVerificationEmailDialog(true)
            }
          />
        )}
      </Box>
      {openSendVerificationEmailDialog && (
        <SendEmailVerificationDialog
          open={openSendVerificationEmailDialog}
          handleClose={() => setOpenSendVerificationEmailDialog(false)}
          selectedEmails={selectedEmails}
          setSelectedApplications={setSelectedApplications}
        />
      )}
      {/* select sms template component  */}
      {openSelectTemplateDialog && (
        <SelectTemplateDialog
          setTemplateId={setTemplateId}
          handleClickOpenDialogsSms={handleClickOpenDialogsSms}
          openDialoge={openSelectTemplateDialog}
          handleClose={handleCloseSelectTemplate}
          setTemplateBody={setTemplateBody}
          setSenderName={setSenderName}
          setSmsType={setSmsType}
          setSmsDltContentId={setSmsDltContentId}
          from={templateType}
        ></SelectTemplateDialog>
      )}
      {/* Send Sms  */}
      <Box>
        <SmsAndWhatsapp
          templateId={templateId}
          color="#25D366"
          name={"WhatsApp"}
          handleClickOpenDialogs={handleClickOpenDialogsWhatsApp}
          handleCloseDialogs={handleCloseDialogsWhatsApp}
          openDialogs={openDialogsWhatsApp}
          setOpenDialogs={setOpenDialogsWhatsApp}
          selecteMobileNumber={selectedMobileNumbers}
          templateBody={templateBody}
          setTemplateBody={setTemplateBody}
          handleClickOpenSelectTemplate={handleClickOpenSelectTemplate}
          from={"lead-manager"}
          setSelectedApplications={setSelectedApplications}
          setSelectedEmails={setSelectedEmails}
          setSelectedMobileNumbers={setSelectedMobileNumbers}
        ></SmsAndWhatsapp>
      </Box>
      <Box>
        <SmsAndWhatsapp
          color="#DD34B8"
          name={"SMS"}
          handleClickOpenDialogs={handleClickOpenDialogsSms}
          handleCloseDialogs={handleCloseDialogsSms}
          openDialogs={openDialogsSms}
          setOpenDialogs={setOpenDialogsSms}
          selecteMobileNumber={selectedMobileNumbers}
          templateBody={templateBody}
          setTemplateBody={setTemplateBody}
          smsDltContentId={smsDltContentId}
          smsType={smsType}
          smsSenderName={smsSenderName}
          from={"lead-manager"}
          setSelectedApplications={setSelectedApplications}
          setSelectedEmails={setSelectedEmails}
          setSelectedMobileNumbers={setSelectedMobileNumbers}
        ></SmsAndWhatsapp>
      </Box>
      {/* send email */}
      <Box>
        <Mail
          emailPayload={emailPayload}
          // payloadForEmail={payloadForEmail}
          open={isComposeOpen}
          hideToInputField={true}
          sendBulkEmail={true}
          onClose={handleComposerClose}
          selectedEmails={selectedEmails}
          setSelectedApplications={setSelectedApplications}
          setSelectedEmails={setSelectedEmails}
          localStorageKey={""}
          formInitiated={true}
        ></Mail>
      </Box>
      <ChangeMultipleLeadStage
        color={"application"}
        handleCloseDialogs={handleCloseDialogsLead}
        openDialogs={openDialogsLead}
        selectedApplicationIds={selectedApplications}
        setSelectedApplications={setSelectedApplications}
        setSelectedEmails={setSelectedEmails}
      ></ChangeMultipleLeadStage>
      {openDialogsAssignCounsellorForUser && (
        <AssignCounsellorDialog
          color={"application"}
          handleCloseDialogs={() =>
            setOpenDialogsAssignCounsellorForUser(false)
          }
          openDialogs={openDialogsAssignCounsellorForUser}
          selectedApplicationIds={selectedApplications}
          counsellorList={counsellorList}
          loading={counselorListApiCallInfo?.isFetching}
          setSkipCounselorApiCall={setSkipCounselorApiCall}
        ></AssignCounsellorDialog>
      )}
    </Box>
  );
};

export default React.memo(LeadStageDetailsTableDrawer);
