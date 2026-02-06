/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Container,
  Card,
  Grid,
  Typography,
  Tabs,
  Tab,
  IconButton,
  CardHeader,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import "./../../styles/EmailTemplateBuilder.css";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import Masonaries from "../../components/ui/template-manager/Masonaries";
import { handleChangePage } from "../../helperFunctions/pagination";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import DeleteDialogue from "../../components/shared/Dialogs/DeleteDialogue";
import { handleDeleteSingleTemplate } from "../../hooks/useHandleDeleteTemplate";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import TagAutoComplete from "../../components/shared/forms/TagAutoComplete";
import { fetchTemplateTags } from "../../Redux/Slices/templateSlice";
import useToasterHook from "../../hooks/useToasterHook";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import Pagination from "../../components/shared/Pagination/Pagination";
import Joyride, { STATUS } from "react-joyride";
import {
  emailTemplateTourSteps,
  smsTemplateTourSteps,
  whatsappTemplateTourSteps,
} from "../../constants/EmailList";
import PropTypes from "prop-types";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { customFetch } from "../StudentTotalQueries/helperFunction";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function BasicLayout() {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState([
    "5",
    "10",
    "15",
  ]);

  const { state } = useLocation();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allGetTags, setAllGetTags] = useState([]);
  const TAB_PANEL_NUMBER = [0, 1, 2, 3, 4, 5, 6];

  const permissions = useSelector((state) => state.authentication.permissions);

  const [errorTagField, setErrorTagField] = React.useState();
  const [loading, setLoading] = useState(false);
  const [allTemplate, setAllTemplate] = useState([]);
  const tags = useSelector((state) => state?.template?.tags);
  const pushNotification = useToasterHook();
  //internal server error states
  const [templatesInternalServerError, setTemplatesInternalServerError] =
    useState(false);
  const [hideTemplates, setHideTemplates] = useState(false);
  const [somethingWentWrongInTemplates, setSomethingWentWrongInTemplates] =
    useState(false);
  const [callTemplateTagApi, setCallTemplateTagApi] = useState(false);

  const [tabsValue, setTabsValue] = React.useState(0);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const [
    deleteTemplateInternalServerError,
    setDeleteTemplateInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInDeleteTemplate,
    setSomethingWentWrongInDeleteTemplate,
  ] = useState(false);

  // pagination
  const [rowCount, setRowCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(0);
  const [page, setPage] = useState(0);
  const count = Math.ceil(rowCount / rowsPerPage);

  const handleChangeTabsValue = (event, newValue) => {
    setTabsValue(newValue);
    localStorage.setItem(
      state?.from === "email"
        ? `${Cookies.get("userId")}EmailTemplateTabNo`
        : state?.from === "whatsapp"
        ? `${Cookies.get("userId")}WhatsAppTemplateTabNo`
        : `${Cookies.get("userId")}SmsTemplateTabNo`,
      newValue
    );
  };

  useEffect(() => {
    if (
      permissions?.menus?.template_manager?.manage_communication_template
        ?.features?.manage_category === false &&
      tabsValue > 2
    ) {
      setTabsValue(0);

      localStorage.setItem(
        state?.from === "email"
          ? `${Cookies.get("userId")}EmailTemplateTabNo`
          : state?.from === "whatsapp"
          ? `${Cookies.get("userId")}WhatsAppTemplateTabNo`
          : `${Cookies.get("userId")}SmsTemplateTabNo`,
        0
      );
    }
  }, [
    permissions?.menus?.template_manager?.manage_communication_template
      ?.features?.manage_category,
    state?.from,
    tabsValue,
  ]);

  const [callAPI, setCallAPI] = useState(false);
  const [callPagination, setCallPagination] = useState(false);
  useEffect(() => {
    setPage(
      localStorage.getItem(
        state?.from === "email"
          ? `${Cookies.get("userId")}allEmailTemplateSavePageNo${tabsValue}`
          : state?.from === "whatsapp"
          ? `${Cookies.get("userId")}allWhatsAppTemplateSavePageNo${tabsValue}`
          : `${Cookies.get("userId")}allSmsTemplateSavePageNo${tabsValue}`
      )
        ? parseInt(
            localStorage.getItem(
              state?.from === "email"
                ? `${Cookies.get(
                    "userId"
                  )}allEmailTemplateSavePageNo${tabsValue}`
                : state?.from === "whatsapp"
                ? `${Cookies.get(
                    "userId"
                  )}allWhatsAppTemplateSavePageNo${tabsValue}`
                : `${Cookies.get("userId")}allSmsTemplateSavePageNo${tabsValue}`
            )
          )
        : 1
    );

    setRowsPerPage(
      localStorage.getItem(
        state?.from === "email"
          ? `${Cookies.get(
              "userId"
            )}allEmailTemplateTableRowPerPage${tabsValue}`
          : state?.from === "whatsapp"
          ? `${Cookies.get(
              "userId"
            )}allWhatsAppTemplateTableRowPerPage${tabsValue}`
          : `${Cookies.get("userId")}allSmsTemplateTableRowPerPage${tabsValue}`
      )
        ? parseInt(
            localStorage.getItem(
              state?.from === "email"
                ? `${Cookies.get(
                    "userId"
                  )}allEmailTemplateTableRowPerPage${tabsValue}`
                : state?.from === "whatsapp"
                ? `${Cookies.get(
                    "userId"
                  )}allWhatsAppTemplateTableRowPerPage${tabsValue}`
                : `${Cookies.get(
                    "userId"
                  )}allSmsTemplateTableRowPerPage${tabsValue}`
            )
          )
        : 5
    );
    setCallAPI(true);

    setTabsValue(
      localStorage.getItem(
        state?.from === "email"
          ? `${Cookies.get("userId")}EmailTemplateTabNo`
          : state?.from === "whatsapp"
          ? `${Cookies.get("userId")}WhatsAppTemplateTabNo`
          : `${Cookies.get("userId")}SmsTemplateTabNo`
      )
        ? parseInt(
            localStorage.getItem(
              state?.from === "email"
                ? `${Cookies.get("userId")}EmailTemplateTabNo`
                : state?.from === "whatsapp"
                ? `${Cookies.get("userId")}WhatsAppTemplateTabNo`
                : `${Cookies.get("userId")}SmsTemplateTabNo`
            )
          )
        : 0
    );
  }, [tabsValue, callPagination, state?.from]);

  useEffect(() => {
    if (callAPI) {
      setCallAPI(false);
      const draftTemplates = tabsValue === 2 ? true : false;
      const ownEmailTemplates = tabsValue === 1 ? true : false;
      const category =
        tabsValue === 0
          ? "default"
          : tabsValue === 3
          ? state?.from === "email"
            ? "forget_password"
            : "otp"
          : tabsValue === 4
          ? "login"
          : tabsValue === 5
          ? "payment"
          : tabsValue === 6 && "otp";
      setLoading(true);
      Cookies.remove("templateId");
      customFetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/templates/?draft_whatsapp_templates=${
          state?.from === "whatsapp" ? draftTemplates : false
        }&draft_email_templates=${
          state?.from === "email" ? draftTemplates : false
        }&email_templates=${
          state?.from === "email" ? true : false
        }&own_templates=${ownEmailTemplates}&sms_templates=${
          state?.from === "sms" ? true : false
        }&whatsapp_templates=${
          state?.from === "whatsapp" ? true : false
        }&draft_sms_template=${
          state?.from === "sms" ? draftTemplates : false
        }&page_num=${page}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }${
          tabsValue !== 1 && tabsValue !== 2
            ? state?.from === "email"
              ? "&email_category=" + category
              : state?.from === "sms"
              ? "&sms_category=" + category
              : ""
            : ""
        }`,
        ApiCallHeaderAndBody(token, "POST", JSON.stringify(allGetTags))
      )
        .then((res) =>
          res.json().then((data) => {
            if (data?.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (data?.data) {
              setLoading(false);
              try {
                if (Array.isArray(data.data)) {
                  setRowCount(data?.total);
                  setAllTemplate(data.data);
                } else {
                  throw new Error("templates API response has changed");
                }
              } catch (error) {
                setApiResponseChangeMessage(error);
                handleSomethingWentWrong(
                  setSomethingWentWrongInTemplates,
                  setHideTemplates,
                  10000
                );
              }
            } else if (data?.detail) {
              setLoading(false);
              pushNotification("error", data?.detail);
              setRowCount(0);
              setAllTemplate([]);
            }
          })
        )
        .catch((err) => {
          setLoading(false);
          handleInternalServerError(
            setTemplatesInternalServerError,
            setHideTemplates,
            10000
          );
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, tabsValue, callAPI, allGetTags]);

  useEffect(() => {
    if (callTemplateTagApi) {
      dispatch(
        fetchTemplateTags({
          token: token,
          tagType:
            state?.from === "email"
              ? "email"
              : state?.from === "whatsapp"
              ? "whatsapp"
              : "sms",
          collegeId: collegeId,
        })
      );
    }
  }, [collegeId, dispatch, state?.from, token, callTemplateTagApi]);

  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [templateDeleted, setTemplateDeleted] = React.useState(false);
  const [deleteTemplateID, setDeleteTemplateID] = React.useState("");
  const handleOpenDeleteModal = (id) => {
    setDeleteTemplateID(id);
    setOpenDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setDeleteTemplateID("");
    setOpenDeleteModal(false);
  };

  const handleTemplateActivation = (templateId) => {
    setLoading(true);
    customFetch(
      `${import.meta.env.VITE_API_BASE_URL}/templates/set_active/${
        collegeId ? "?college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(
        token,
        "PUT",
        JSON.stringify({
          template_id: templateId,
        })
      )
    )
      .then((res) =>
        res.json().then((data) => {
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data?.message) {
            const expectedData = data?.message;
            try {
              if (typeof expectedData === "string") {
                pushNotification("success", data?.message);
                setCallAPI(true);
              } else {
                throw new Error(
                  "templates/set_active API response has changed"
                );
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInTemplates,
                "",
                5000
              );
            }
          } else if (data?.detail) {
            pushNotification("error", data?.detail);
          }
        })
      )
      .catch((err) => {
        handleInternalServerError(setTemplatesInternalServerError, "", 5000);
      })
      .finally(() => setLoading(false));
  };

  /// react screen tour steps with joyride
  const [{ run, steps }, setScreenTourSteps] = useState({
    run: false,
    steps:
      state?.from === "email"
        ? emailTemplateTourSteps
        : state?.from === "sms"
        ? smsTemplateTourSteps
        : state?.from === "whatsapp" && whatsappTemplateTourSteps,
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
      `${Cookies.get("userId")}userIsFirstTimeInTemplateLayout`
    );
    if (!userIsFirstTime) {
      localStorage.setItem(
        `${Cookies.get("userId")}userIsFirstTimeInTemplateLayout`,
        true
      );
      setScreenTourSteps((prev) => ({ ...prev, run: true }));
    }
  }, []);
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Template Manager Head Title add
  useEffect(() => {
    setHeadTitle("Template Manager");
    document.title = "Template Manager";
  }, [headTitle]);
  return (
    <Box
      component="main"
      className="emailTemplateWrapper template-manager-header-box-container"
      sx={{ pb: 2 }}
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
        <Grid container sx={{ justifyContent: "center" }}>
          <Grid item md={12} sm={12} xs={12}>
            <Card elevation={16} sx={{ py: 4, px: 1.3 }}>
              <Box sx={{ display: "flex", alignItems: "center", pt: 2 }}>
                <IconButton onClick={() => navigate(-1)} aria-label="Example">
                  <ArrowBackIcon />
                </IconButton>
                <CardHeader
                  sx={{ flexWrap: "wrap", p: 0 }}
                  titleTypographyProps={{ fontSize: "22px" }}
                  title={`${
                    state?.from === "email"
                      ? "Email"
                      : state?.from === "whatsapp"
                      ? "WhatsApp"
                      : "Sms"
                  } Layouts`}
                />
              </Box>

              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3} md={2}>
                    <Tabs
                      orientation="vertical"
                      variant="scrollable"
                      value={tabsValue}
                      onChange={handleChangeTabsValue}
                      aria-label="Vertical tabs example"
                      sx={{ borderRight: 1, borderColor: "divider", mt: 2 }}
                      TabIndicatorProps={{
                        style: {
                          left: "0px",
                          width: "8px",
                          background: "#1E5CFC",
                          boxShadow:
                            "2px 0px 15px 10px rgba(30, 92, 252, 0.22)",
                          borderRadius: "5px",
                        },
                      }}
                    >
                      <Tab
                        iconPosition="end"
                        data-testid="all-template-tab"
                        label="All Templates"
                        {...a11yProps(0)}
                        id="all-template-tab"
                        className={`${
                          tabsValue === 0
                            ? "template-manager-tab"
                            : "template-manager-tab-default"
                        }`}
                      />

                      <Tab
                        iconPosition="end"
                        data-testid="your-template-tab"
                        label="Your Templates"
                        {...a11yProps(1)}
                        id="your-template-tab"
                        className={`${
                          tabsValue === 1
                            ? "template-manager-tab"
                            : "template-manager-tab-default"
                        }`}
                      />

                      <Tab
                        iconPosition="end"
                        data-testid="draft-template-tab"
                        label="Draft Templates"
                        {...a11yProps(2)}
                        id="draft-template-tab"
                        className={`${
                          tabsValue === 2
                            ? "template-manager-tab"
                            : "template-manager-tab-default"
                        }`}
                      />

                      {state?.from === "email" &&
                        permissions?.menus?.template_manager
                          ?.manage_communication_template?.features
                          ?.manage_category && (
                          <Tab
                            iconPosition="end"
                            data-testid="draft-template-tab"
                            label="Forget Password"
                            {...a11yProps(3)}
                            id="forget-password-template-tab"
                            className={`${
                              tabsValue === 3
                                ? "template-manager-tab"
                                : "template-manager-tab-default"
                            }`}
                          />
                        )}

                      {state?.from === "email" &&
                        permissions?.menus?.template_manager
                          ?.manage_communication_template?.features
                          ?.manage_category && (
                          <Tab
                            iconPosition="end"
                            data-testid="draft-template-tab"
                            label="Login"
                            {...a11yProps(4)}
                            id="login-email-template-tab"
                            className={`${
                              tabsValue === 4
                                ? "template-manager-tab"
                                : "template-manager-tab-default"
                            }`}
                          />
                        )}

                      {state?.from === "email" &&
                        permissions?.menus?.template_manager
                          ?.manage_communication_template?.features
                          ?.manage_category && (
                          <Tab
                            iconPosition="end"
                            data-testid="draft-template-tab"
                            label="Payment"
                            {...a11yProps(5)}
                            id="payment-receipt-template-tab"
                            className={`${
                              tabsValue === 5
                                ? "template-manager-tab"
                                : "template-manager-tab-default"
                            }`}
                          />
                        )}

                      {(state?.from === "email" || state?.from === "sms") &&
                        permissions?.menus?.template_manager
                          ?.manage_communication_template?.features
                          ?.manage_category && (
                          <Tab
                            iconPosition="end"
                            data-testid="draft-template-tab"
                            label={`OTP`}
                            {...a11yProps(6)}
                            id="otp-template-tab"
                            className={`${
                              state?.from === "sms"
                                ? tabsValue === 3
                                  ? "template-manager-tab"
                                  : "template-manager-tab-default"
                                : tabsValue === 6
                                ? "template-manager-tab"
                                : "template-manager-tab-default"
                            }`}
                          />
                        )}
                    </Tabs>
                  </Grid>

                  <Grid item xs={12} sm={9} md={10}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <TagAutoComplete
                        setCallTemplateTagApi={setCallTemplateTagApi}
                        label="Search By Tags"
                        tags={tags}
                        allTags={allGetTags}
                        setAllGetTags={setAllGetTags}
                        errorTagField={errorTagField}
                        setErrorTagField={setErrorTagField}
                        setCallAPI={setCallAPI}
                        width={"150px"}
                      ></TagAutoComplete>
                    </Box>

                    {!loading && allTemplate.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                        }}
                      >
                        <TableDataCount
                          totalCount={rowCount}
                          currentPageShowingCount={allTemplate.length}
                          pageNumber={page}
                          rowsPerPage={rowsPerPage}
                        />

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mt: 2,
                          }}
                        >
                          <Pagination
                            className="pagination-bar"
                            currentPage={page}
                            totalCount={rowCount}
                            pageSize={rowsPerPage}
                            onPageChange={(page) =>
                              handleChangePage(
                                page,
                                state?.from === "email"
                                  ? `allEmailTemplateSavePageNo${tabsValue}`
                                  : state?.from === "whatsapp"
                                  ? `allWhatsAppTemplateSavePageNo${tabsValue}`
                                  : `allSmsTemplateSavePageNo${tabsValue}`,
                                setPage,
                                setCallAPI
                              )
                            }
                            count={count}
                          />

                          <AutoCompletePagination
                            rowsPerPage={rowsPerPage}
                            rowPerPageOptions={rowPerPageOptions}
                            setRowsPerPageOptions={setRowsPerPageOptions}
                            rowCount={rowCount}
                            page={page}
                            setPage={setPage}
                            localStorageChangeRowPerPage={
                              state?.from === "email"
                                ? `allEmailTemplateTableRowPerPage${tabsValue}`
                                : state?.from === "whatsapp"
                                ? `allWhatsAppTemplateTableRowPerPage${tabsValue}`
                                : `allSmsTemplateTableRowPerPage${tabsValue}`
                            }
                            localStorageChangePage={
                              state?.from === "email"
                                ? `allEmailTemplateSavePageNo${tabsValue}`
                                : state?.from === "whatsapp"
                                ? `allWhatsAppTemplateTableRowPerPage${tabsValue}`
                                : `allSmsTemplateTableRowPerPage${tabsValue}`
                            }
                            setRowsPerPage={setRowsPerPage}
                            setCallAPI={setCallAPI}
                          ></AutoCompletePagination>
                        </Box>
                      </Box>
                    )}
                    {TAB_PANEL_NUMBER.map((tabPanel) => (
                      <TabPanel value={tabsValue} index={tabPanel}>
                        <Masonaries
                          internalServerError={templatesInternalServerError}
                          hideTemplates={hideTemplates}
                          somethingWentWrong={somethingWentWrongInTemplates}
                          loading={loading}
                          allTemplate={allTemplate}
                          handleOpenDeleteModal={handleOpenDeleteModal}
                          from={state?.from}
                          setSubjectOfEmail={undefined}
                          tabsValue={tabsValue}
                          handleTemplateActivation={handleTemplateActivation}
                        ></Masonaries>
                      </TabPanel>
                    ))}
                  </Grid>
                </Grid>

                <DeleteDialogue
                  internalServerError={deleteTemplateInternalServerError}
                  somethingWentWrong={somethingWentWrongInDeleteTemplate}
                  apiResponseChangeMessage={apiResponseChangeMessage}
                  openDeleteModal={openDeleteModal}
                  handleDeleteSingleTemplate={() =>
                    handleDeleteSingleTemplate(
                      deleteTemplateID,
                      token,
                      handleCloseDeleteModal,
                      setTemplateDeleted,
                      templateDeleted,
                      pushNotification,
                      setCallAPI,
                      allTemplate?.length,
                      page,
                      setPage,
                      state?.from === "email"
                        ? `allEmailTemplateSavePageNo${tabsValue}`
                        : state?.from === "whatsapp"
                        ? `allWhatsAppTemplateSavePageNo${tabsValue}`
                        : `allSmsTemplateSavePageNo${tabsValue}`,
                      setCallPagination,
                      setDeleteTemplateInternalServerError,
                      setApiResponseChangeMessage,
                      setSomethingWentWrongInDeleteTemplate,
                      collegeId
                    )
                  }
                  handleCloseDeleteModal={handleCloseDeleteModal}
                ></DeleteDialogue>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default BasicLayout;
