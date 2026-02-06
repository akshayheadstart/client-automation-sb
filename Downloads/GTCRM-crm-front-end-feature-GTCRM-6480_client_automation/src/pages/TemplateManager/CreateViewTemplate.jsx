/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Drawer,
} from "@mui/material";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import MultipleTabs from "../../components/shared/tab-panel/MultipleTabs";
import SearchIcon from "@rsuite/icons/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  TemplateManagerEmailTableColumn,
  TemplateManagerSmsTableColumn,
  TemplateManagerWhatsAppTableColumn,
} from "../../utils/TemplateManagerUtils";
import { handleChangePage } from "../../helperFunctions/pagination";
import Pagination from "../../components/shared/Pagination/Pagination";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import {
  useFetchTemplatesQuery,
  usePrefetch,
  useDeleteTemplateMutation,
} from "../../Redux/Slices/applicationDataApiSlice";
import "../../styles/CreateViewTemplate.css";
import "../../styles/activePanelistManager.css";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import useToasterHook from "../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import CreateEmailTemplate from "./CreateEmailTemplate";
import CreateSmsTemplate from "./CreateSmsTemplate";
import CreateWhatsAppTemplate from "./CreateWhatsAppTemplate";
import ConfirmationDialog from "../../components/shared/Dialogs/ConfirmationDialog";
import { handleDeleteSingleTemplate } from "../../hooks/useHandleDeleteTemplate";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import TagAutoComplete from "../../components/shared/forms/TagAutoComplete";
import { fetchTemplateTags, setTags } from "../../Redux/Slices/templateSlice";
import TemplateTagBox from "./TemplateTagBox";
import TemplateSentCountBox from "./TemplateSentCountBox";
import {
  getTemplateEmailParams,
  getTemplateSmsParams,
  getTemplateWhatsAppParams,
} from "../StudentTotalQueries/helperFunction";
import TemplateTableActionBox from "./TemplateTableActionBox";

const getStateValue = (val) => {
  if (val === 0) {
    return "email";
  } else if (val === 1) {
    return "whatsapp";
  }
  return "sms";
};

const CreateViewTemplate = ({ forDataValue }) => {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const templateTags = useSelector((state) => state?.template?.tags);
  const [tmTags, setTmTags] = useState([]);
  const [errorTagField, setErrorTagField] = React.useState("");
  const permissions = useSelector((state) => state.authentication.permissions);
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const [leftTabValue, setLeftTabValue] = React.useState(
    forDataValue === "sms" ? 2 : forDataValue === "whats-app" ? 1 : 0
  );
  const [tabsValue, setTabsValue] = React.useState(0);
  const [searchFieldToggle, setSearchFieldToggle] = React.useState(false);
  const [createTemplateBtnOpen, setCreateTemplateBtnOpen] = React.useState(
    forDataValue ? true : false
  );
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [tmData, setTmData] = React.useState(null);
  const dispatch = useDispatch();

  const [callAPI, setCallAPI] = useState(false);
  // pagination
  const [rowPerPageOptions, setRowsPerPageOptions] = useState([
    "5",
    "10",
    "15",
  ]);
  const [rowCount, setRowCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(0);
  const [page, setPage] = useState(0);
  const count = Math.ceil(rowCount / rowsPerPage);

  const [editData, setEditData] = React.useState(null);
  const state = {
    from: getStateValue(leftTabValue),
  };
  const pushNotification = useToasterHook();
  //internal server error states
  const [templatesInternalServerError, setTemplatesInternalServerError] =
    useState(false);
  const [hideTemplates, setHideTemplates] = useState(false);
  const [somethingWentWrongInTemplates, setSomethingWentWrongInTemplates] =
    useState(false);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);

  const [deleteTemplateItem, setDeleteTemplateItem] = React.useState("");
  const [templateDeleted, setTemplateDeleted] = React.useState(false);
  const [callPagination, setCallPagination] = useState(false);
  const [
    deleteTemplateInternalServerError,
    setDeleteTemplateInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInDeleteTemplate,
    setSomethingWentWrongInDeleteTemplate,
  ] = useState(false);

  const [openConfirmationDialog, setOpenConfirmationDialog] =
    React.useState(false);
  const [callTemplateTagApi, setCallTemplateTagApi] = useState(false);

  const [deleteTemplate] = useDeleteTemplateMutation();

  useEffect(() => {
    setHeadTitle("Template Manager");
    document.title = "Template Manager";
  }, [headTitle]);

  const handleCreateTemplateDialogOpen = () => {
    setCreateTemplateBtnOpen(true);
  };
  const handleCreateTemplateDialogClose = () => {
    setCreateTemplateBtnOpen(false);
    setEditData(null);
  };

  const handleEditClick = (selectedData, id) => {
    handleCreateTemplateDialogOpen();
    setEditData(selectedData);
    Cookies.set("templateId", id);
  };

  const handleDeleteClick = (item) => {
    setDeleteTemplateItem(item);
    setOpenConfirmationDialog(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteTemplateItem("");
    setOpenConfirmationDialog(false);
  };

  const setCurrentTab = (tab) => {
    setLeftTabValue(tab);
    setEditData(null);
    dispatch(setTags([]));
    setCallTemplateTagApi(false);
  };

  useEffect(() => {
    if (callTemplateTagApi) {
      dispatch(
        fetchTemplateTags({
          token: token,
          tagType: state?.from,
          collegeId: collegeId,
        })
      );
    }
  }, [collegeId, dispatch, token, state?.from, callTemplateTagApi]);

  const getCategory = (state) => {
    return tabsValue === 0
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
  };

  const draftTemplates = tabsValue === 1 ? true : false;

  const { data, error, isSuccess, isError, isFetching } =
    useFetchTemplatesQuery(
      {
        collegeId,
        rowsPerPage,
        pageNumber: page,
        draftTemplates,
        ownEmailTemplates: draftTemplates ? true : false,
        state,
        tabsValue: tabsValue,
        category: getCategory(state),
        payload: tmTags?.length ? tmTags : [],
      },
      {
        skip: !collegeId || page === 0,
      }
    );

  React.useEffect(() => {
    try {
      if (isSuccess) {
        if (data.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data.detail) {
          pushNotification("error", data.detail);
        } else if (data?.data) {
          if (Array.isArray(data.data)) {
            setRowCount(data?.total);
            setTmData(data.data);
          } else {
            throw new Error("templates API response has changed");
          }
        }
      } else if (isError) {
        if (error?.status === 500) {
          handleInternalServerError(
            setTemplatesInternalServerError,
            setHideTemplates,
            10000
          );
        }
      }
    } catch (err) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInTemplates,
        setHideTemplates,
        10000
      );
    }
    Cookies.remove("templateId");
  }, [data, error, isSuccess, isError]);

  const prefetchTemplates = usePrefetch("fetchTemplates");

  React.useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      page,
      collegeId,
      prefetchTemplates,
      {
        payload: tmTags?.length ? tmTags : [],
        draftTemplates,
        ownEmailTemplates: draftTemplates ? true : false,
        state,
        tabsValue,
        category: getCategory(state),
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    page,
    prefetchTemplates,
    rowsPerPage,
    collegeId,
    tmTags,
    state,
    tabsValue,
  ]);

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
  }, [tabsValue, state?.from, callPagination, callAPI]);

  const handleChangeTabsValue = (newValue) => {
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

  const getTabs = () => {
    let tabs = [{ tabName: "All" }, { tabName: "Draft" }];
    if (
      state?.from === "email" &&
      permissions?.menus?.template_manager?.manage_communication_template
        ?.features?.manage_category
    ) {
      tabs = [
        ...tabs,
        { tabName: "Saved" },
        { tabName: "Forget Password" },
        { tabName: "Login" },
        { tabName: "Payment" },
        { tabName: "OTP" },
      ];
    }

    if (
      state?.from === "sms" &&
      permissions?.menus?.template_manager?.manage_communication_template
        ?.features?.manage_category
    ) {
      tabs = [...tabs, { tabName: "OTP" }];
    }

    return tabs;
  };

  const getColumnDefs = () => {
    if (state.from === "email") {
      return TemplateManagerEmailTableColumn;
    } else if (state.from === "sms") {
      return TemplateManagerSmsTableColumn;
    }
    return TemplateManagerWhatsAppTableColumn;
  };
  //reset search tag field
  useEffect(() => {
    setTmTags([]);
  }, [leftTabValue]);
  const renderEmailBody = (item) => {
    return (
      <TableRow className='tm-table-row' key={item.template_id}>
        <TableCell>
          <Box>
            <Typography className='template-name-design-text'>
              {item?.template_name?.length > 20
                ? `${item?.template_name?.substring(0, 20)}...`
                : item?.template_name}
            </Typography>
            <Typography className='create-on-date-text-design'>
              {item?.created_on ? item?.created_on : "---"}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          {item?.sender_email_id ? item?.sender_email_id : "---"}
        </TableCell>
        <TableCell>
          <TemplateTagBox item={item} />
        </TableCell>
        <TableCell>
          {item?.email_category ? item?.email_category : "---"}
        </TableCell>
        <TableCell>{item?.email_type ? item?.email_type : "---"}</TableCell>
        <TableCell>
          {item?.email_provider ? item?.email_provider : "---"}
        </TableCell>
        <TableCell>
          <TemplateSentCountBox item={item} />
        </TableCell>

        <TableCell>
          <TemplateTableActionBox
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            getTemplateParams={getTemplateEmailParams}
            item={item}
          />
        </TableCell>
      </TableRow>
    );
  };

  const renderSmsBody = (item) => {
    return (
      <TableRow className='tm-table-row' key={item.template_id}>
        <TableCell>
          <Box>
            <Typography className='template-name-design-text'>
              {item?.template_name?.length > 20
                ? `${item?.template_name?.substring(0, 20)}...`
                : item?.template_name}
            </Typography>
            <Typography className='create-on-date-text-design'>
              {item?.created_on ? item?.created_on : "---"}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>{item?.sender ? item?.sender : "---"}</TableCell>
        <TableCell>{item?.sms_type ? item?.sms_type : "---"}</TableCell>
        <TableCell>
          <TemplateTagBox item={item} />
        </TableCell>
        <TableCell>
          {item?.dlt_content_id ? item?.dlt_content_id : "---"}
        </TableCell>
        <TableCell>
          {item?.content?.length > 30
            ? `${item?.content?.substring(0, 30)}...`
            : item?.content}
        </TableCell>
        <TableCell>
          <TemplateSentCountBox item={item} />
        </TableCell>
        <TableCell>
          <TemplateTableActionBox
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            getTemplateParams={getTemplateSmsParams}
            item={item}
          />
        </TableCell>
      </TableRow>
    );
  };

  const renderWhatsAppBody = (item) => {
    return (
      <TableRow className='tm-table-row' key={item.template_id}>
        <TableCell>
          <Box>
            <Typography className='template-name-design-text'>
              {item?.template_name?.length > 20
                ? `${item?.template_name?.substring(0, 20)}...`
                : item?.template_name}
            </Typography>
            <Typography className='create-on-date-text-design'>
              {item?.created_on ? item?.created_on : "---"}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <TemplateTagBox item={item} />
        </TableCell>
        <TableCell>{item?.template_id}</TableCell>
        <TableCell>{item?.template_type}</TableCell>
        <TableCell>
          {item?.content?.length > 30
            ? `${item?.content?.substring(0, 30)}...`
            : item?.content}
        </TableCell>
        <TableCell>
          <TemplateSentCountBox item={item} />
        </TableCell>
        <TableCell>
          <TemplateTableActionBox
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            getTemplateParams={getTemplateWhatsAppParams}
            item={item}
          />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box
      component='main'
      className='template-manager-view template-manager-header-box-container'
    >
      <Container
        classes={{
          root: "template-manager-view",
        }}
        sx={{ p: 0 }}
        maxWidth={false}
      >
        <Grid container className='tm-container'>
          <Grid item md={12} sm={12} xs={12}>
            <Box className='tm-tabs-wrapper'>
              <MultipleTabs
                tabArray={[
                  { tabName: "Email" },
                  { tabName: "WhatsApp" },
                  { tabName: "Sms" },
                ]}
                setMapTabValue={(tab) => {
                  setLeftTabValue(tab);
                  setTabsValue(0);
                  dispatch(setTags([]));
                  setCallTemplateTagApi(false);
                }}
                mapTabValue={leftTabValue}
                boxWidth='260px'
              ></MultipleTabs>
            </Box>
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Box className='tm-table-container'>
              <Box className='tm-header'>
                <MultipleTabs
                  tabArray={getTabs()}
                  setMapTabValue={handleChangeTabsValue}
                  mapTabValue={tabsValue}
                  boxWidth='260px'
                ></MultipleTabs>
                <Box className='align-row'>
                  <Box className='active-panelist-button-box-search'>
                    {!tmTags.length > 0 && !searchFieldToggle ? (
                      <Box
                        className='search-icon-btn-wrapper tm-search-wrapper'
                        data-testid='search-toggle'
                        onClick={() => setSearchFieldToggle(true)}
                      >
                        <SearchIcon className='search-icon' />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          width: 250,
                        }}
                      >
                        <TagAutoComplete
                          setCallTemplateTagApi={setCallTemplateTagApi}
                          label='Search Tags'
                          tags={templateTags}
                          allTags={tmTags}
                          setAllGetTags={setTmTags}
                          errorTagField={errorTagField}
                          setErrorTagField={setErrorTagField}
                          className='email-template-width'
                          width={"250px"}
                          from={"sms"}
                        ></TagAutoComplete>
                      </Box>
                    )}
                  </Box>
                  <Button
                    onClick={() => handleCreateTemplateDialogOpen()}
                    className='create-tm-btn'
                  >
                    <Typography className='create-tm-btn-label'>
                      Create Template
                    </Typography>
                  </Button>
                </Box>
              </Box>
              {templatesInternalServerError || somethingWentWrongInTemplates ? (
                <Box>
                  {templatesInternalServerError && (
                    <Error500Animation height={400} width={400} />
                  )}
                  {somethingWentWrongInTemplates && (
                    <ErrorFallback
                      error={apiResponseChangeMessage}
                      resetErrorBoundary={() => window.location.reload()}
                    />
                  )}
                </Box>
              ) : isFetching ? (
                <Box className='loader-wrapper'>
                  <LeefLottieAnimationLoader
                    height={100}
                    width={150}
                  ></LeefLottieAnimationLoader>{" "}
                </Box>
              ) : tmData?.length ? (
                <>
                  <Box
                    className='table-container'
                    sx={{ visibility: hideTemplates ? "hidden" : "visible" }}
                  >
                    <TableContainer className='custom-scrollbar'>
                      <Table
                        sx={{ minWidth: "500px" }}
                        size='small'
                        aria-label='simple table'
                      >
                        <TableHead className='tm-table-header'>
                          <TableRow>
                            {getColumnDefs()?.map((col) => (
                              <TableCell
                                key={col.value}
                                style={{ minWidth: col.width }}
                                // width={col.width}
                                className='tm-table-header-cell'
                              >
                                <Box className='sorting-option-with-header-content'>
                                  {col.label}
                                </Box>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tmData?.map((item) => {
                            if (state.from === "email") {
                              return renderEmailBody(item);
                            } else if (state.from === "sms") {
                              return renderSmsBody(item);
                            }
                            return renderWhatsAppBody(item);
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Pagination
                      className='script-pagination'
                      currentPage={page}
                      totalCount={rowCount}
                      pageSize={rowsPerPage}
                      onPageChange={(page) => {
                        handleChangePage(
                          page,
                          `templatePageNo`,
                          setPage,
                          setCallAPI
                        );
                      }}
                      count={count}
                    />
                    <AutoCompletePagination
                      rowsPerPage={rowsPerPage}
                      rowPerPageOptions={rowPerPageOptions}
                      setRowsPerPageOptions={setRowsPerPageOptions}
                      rowCount={rowCount}
                      page={page}
                      setPage={setPage}
                      localStorageChangeRowPerPage={`templateManagerTableRowPerPage`}
                      localStorageChangePage={`templateManagerSavePageNo`}
                      setRowsPerPage={setRowsPerPage}
                      setCallAPI={setCallAPI}
                    />
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "25vh",
                    alignItems: "center",
                  }}
                  data-testid='not-found-animation-container'
                >
                  <BaseNotFoundLottieLoader
                    height={250}
                    width={250}
                  ></BaseNotFoundLottieLoader>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Drawer
        anchor={"right"}
        open={createTemplateBtnOpen}
        onClose={handleCreateTemplateDialogClose}
        sx={{ width: "100%" }}
        PaperProps={{
          sx: {
            width: "100%",
          },
        }}
      >
        {state?.from === "email" ? (
          <CreateEmailTemplate
            onClose={handleCreateTemplateDialogClose}
            data={editData}
            currentTab={leftTabValue}
            setCurrentTab={setCurrentTab}
            callApiAgain={setCallAPI}
          />
        ) : state?.from === "sms" ? (
          <CreateSmsTemplate
            onClose={handleCreateTemplateDialogClose}
            data={editData}
            currentTab={leftTabValue}
            setCurrentTab={setCurrentTab}
            callApiAgain={setCallAPI}
          />
        ) : (
          <CreateWhatsAppTemplate
            collegeId={collegeId}
            onClose={handleCreateTemplateDialogClose}
            currentTab={leftTabValue}
            setCurrentTab={setCurrentTab}
            data={editData}
            callApiAgain={setCallAPI}
          />
        )}
      </Drawer>
      <ConfirmationDialog
        title={
          <Box className='info-icon-container'>
            <InfoOutlinedIcon />
          </Box>
        }
        message={
          <Typography component='p' textAlign='center'>
            {deleteTemplateItem?.template_name} will be deleted.
          </Typography>
        }
        handleClose={handleCloseDeleteModal}
        handleOk={() => {
          handleDeleteSingleTemplate(
            deleteTemplate,
            deleteTemplateItem?.template_id,
            handleCloseDeleteModal,
            setTemplateDeleted,
            templateDeleted,
            pushNotification,
            setCallAPI,
            tmData?.length,
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
            collegeId,
            setDeleteLoading
          );
        }}
        open={openConfirmationDialog}
        loading={deleteLoading}
        className='tm-confirmation-dialog'
        internalServerError={deleteTemplateInternalServerError}
        somethingWentWrong={somethingWentWrongInDeleteTemplate}
        apiResponseChangeMessage={apiResponseChangeMessage}
      />
    </Box>
  );
};

export default CreateViewTemplate;
