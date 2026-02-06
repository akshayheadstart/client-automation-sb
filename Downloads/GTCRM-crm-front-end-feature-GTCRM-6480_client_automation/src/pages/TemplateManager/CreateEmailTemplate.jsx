/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useContext, useMemo } from "react";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddIcon from "@mui/icons-material/Add";
import EmailEditor from "react-email-editor";
import CloseIcon from "@mui/icons-material/Close";
import "./../../styles/CreateEmailTemplate.css";
import "./../../styles/sharedStyles.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import useToasterHook from "../../hooks/useToasterHook";
import { useEffect } from "react";
import { fetchTemplateTags } from "../../Redux/Slices/templateSlice";
import {
  EmailCategoryList,
  EmailProviderList,
  EmailTypeList,
} from "../../constants/EmailList";
import TemplateCreateInfoDialog from "../../components/shared/Dialogs/TemplateCreateInfoDialog";
import {
  useGetTemplateMergeKaysQuery,
  useAddOrUpdateTemplateMutation,
  useGetSenderAndReceiverEmailIdDetailQuery,
} from "../../Redux/Slices/applicationDataApiSlice";
import AddMergeTagDialog from "./AddMergeTagDialog";
import { setTemplateMergeTag } from "../../utils/setTemplateMergeTag";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import MultipleTabs from "../../components/shared/tab-panel/MultipleTabs";
import { Input, InputGroup, SelectPicker, TagPicker } from "rsuite";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import UserRoleAndMembers from "./UserRoleAndMembers";
import {
  useCreateEmailTemplateCategoryMutation,
  useGetEmailTemplateCategoryQuery,
} from "../../Redux/Slices/filterDataSlice";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import { organizeEmailCategoryOption } from "../../helperFunctions/filterHelperFunction";
import FilterSelectPicker from "../../components/shared/filters/FilterSelectPicker";
import { getFeatureKeyFromCookie } from "../StudentTotalQueries/helperFunction";

function CreateEmailTemplate(props) {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const permissions = useSelector((state) => state.authentication.permissions);
  const pushNotification = useToasterHook();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const dispatch = useDispatch();
  const {
    dataJson,
    individualTemplateName,
    addedTags,
    subject,
    email_type,
    email_provider,
    email_category,
    mood,
    select_members,
    select_profile_role,
    sender_email_id,
    attachment_document_link,
    reply_to_email,
  } = props.data || {};

  const matches = useMediaQuery("(max-width:650px)");

  const templateId = Cookies.get("templateId");
  const [errorTagField, setErrorTagField] = React.useState("");
  const [addOrUpdateTemplate] = useAddOrUpdateTemplateMutation();
  const [callTemplateTagApi, setCallTemplateTagApi] = useState(
    addedTags?.length > 0 ? true : false
  );
  const templateTags = useSelector((state) => state?.template?.tags);
  const templateTagsLoading = useSelector((state) => state?.template?.loading);
  const templateTagsList = useMemo(() => {
    return templateTags?.map((item) => ({
      label: item,
      value: item,
    }));
  }, [templateTags]);
  useEffect(() => {
    if (callTemplateTagApi) {
      dispatch(
        fetchTemplateTags({
          token: token,
          tagType: "email",
          collegeId: collegeId,
        })
      );
    }
  }, [collegeId, dispatch, token, callTemplateTagApi]);

  //states for internal server error
  const [somethingWentWrongInUploadFile, setSomethingWentWrongInUploadFile] =
    useState(false);
  const [uploadFileInternalServerError, setUploadFileInternalServerError] =
    useState(false);

  const tags = () => {
    const onlyTags = [];
    addedTags.forEach((element) => {
      onlyTags.push(element?.tag_name);
    });
    return onlyTags;
  };

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [openMergeTagDialog, setOpenMergeTagDialog] = useState(false);
  const [emailTemplateDesign, setEmailTemplateDesign] = useState({});

  const [allTags, setAllGetTags] = useState(addedTags ? tags() : []);
  const [loadingState, setLoadingState] = useState(false);
  const emailEditorRef = useRef(null);
  const [templateName, setTemplateName] = useState(
    individualTemplateName ? individualTemplateName : ""
  );
  const [mailSubject, setMailSubject] = useState(subject ? subject : "");
  const [emailType, setEmailType] = useState(email_type ? email_type : null);
  const [emailProvider, setEmailProvider] = useState(
    email_provider ? email_provider : null
  );
  const [emailCategory, setEmailCategory] = useState(
    email_category ? email_category : null
  );
  const [senderEmailId, setSenderEmailId] = useState(
    sender_email_id ? sender_email_id : ""
  );
  const [senderEmailIDList, setSenderEmailIDList] = useState();
  const [replyEmailId, setReplyEmailId] = useState(
    reply_to_email ? reply_to_email : ""
  );
  const [replyEmailIDList, setReplyEmailIDList] = useState();
  const [openSenderId, setOpenSenderId] = useState(true);
  useEffect(() => {
    setOpenSenderId(sender_email_id ? false : true);
  }, []);
  const senderAndReceiverIdDetails = useGetSenderAndReceiverEmailIdDetailQuery(
    { collegeId },
    { skip: openSenderId }
  );
  useEffect(() => {
    try {
      if (senderAndReceiverIdDetails?.isSuccess && !openSenderId) {
        const senderData = senderAndReceiverIdDetails?.data?.data?.sender_email;
        const SenderIdData = senderData?.map((item) => ({
          label: item,
          value: item,
        }));
        setSenderEmailIDList(SenderIdData);
        const replyData =
          senderAndReceiverIdDetails?.data?.data?.reply_to_email;
        const ReplyIdData = replyData?.map((item) => ({
          label: item,
          value: item,
        }));
        setReplyEmailIDList(ReplyIdData);
      }
      if (senderAndReceiverIdDetails?.isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
    }
  }, [senderAndReceiverIdDetails, openSenderId]);
  const [templateMergeKaysList, setTemplateMergeKeysList] = useState([]);

  const { isError, isSuccess, data, error } = useGetTemplateMergeKaysQuery({
    collegeId,
  });
  const [selectedRoleType, setSelectedRoleType] = useState(
    select_profile_role?.length > 0 ? select_profile_role : []
  );
  const [selectedMembers, setSelectedMembers] = useState(
    select_members?.length > 0 ? select_members : []
  );
  const [userRoleList, setUserRoleList] = useState([]);
  const [membersList, setMembersList] = useState([]);

  useEffect(() => {
    try {
      setTemplateMergeTag({
        isSuccess,
        setTemplateMergeKeysList,
        data,
        isError,
        error,
        pushNotification,
      });
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrongInUploadFile, "", 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isError, isSuccess, error]);

  const onLoad = () => {
    setTimeout(() => {
      emailEditorRef?.current?.editor?.loadDesign(
        emailTemplateDesign?.body ? emailTemplateDesign : dataJson
      );
    }, 1000);
  };

  const onReady = () => {
    emailEditorRef?.current?.editor?.registerCallback(
      "image",
      function (file, done) {
        // Handled file upload here
        var data = new FormData();
        data.append("files", file.attachments[0]);

        const headers = {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        };
        setLoadingState(true);
        axios
          .post(
            `${import.meta.env.VITE_API_BASE_URL}/admin/upload_files/${
              collegeId ? "?college_id=" + collegeId : ""
            }&feature_key=${getFeatureKeyFromCookie()}`,
            data,
            {
              headers: headers,
            }
          )
          .then((response) => {
            try {
              if (
                Array.isArray(response?.data?.data[0]) &&
                response?.status === 200
              ) {
                response?.data?.data[0]?.map((data) =>
                  done({ progress: 100, url: data?.public_url })
                );
              } else {
                throw new Error("upload_files API response has changed");
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInUploadFile,
                "",
                5000
              );
            }
          })
          .catch((error) => {
            handleInternalServerError(
              setUploadFileInternalServerError,
              "",
              5000
            );
          })
          .finally(() => {
            setLoadingState(false);
          });
      }
    );
  };
  const [selectedCategory, setSelectedCategory] = useState(
    email_category ? email_category : null
  );
  const onSubmitTemplate = (e) => {
    e.preventDefault();
    emailEditorRef.current.editor.exportHtml((data) => {
      const { design, html } = data;
      const isDPublishTemplate =
        document.activeElement.name === "publishTemplate";

      const templateSubmitData = {
        template_type: "email",
        content: html,
        template_json: design,
        template_name: templateName,
        tags: allTags,
        is_published: isDPublishTemplate,
        subject: mailSubject,
        email_type: emailType?.toLowerCase(),
        email_provider: emailProvider?.toLowerCase(),
        email_category: selectedCategory ? selectedCategory : "default",
        //new payload
        select_profile_role: selectedRoleType,
        select_members: selectedMembers,
        sender_email_id: senderEmailId,
        attachment_document_link: attachmentDocumentsArray,
        reply_to_email: replyEmailId,
      };
      setLoadingState(true);

      addOrUpdateTemplate({
        collegeId,
        templateId,
        payload: templateSubmitData,
      })
        .unwrap()
        .then((data) => {
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data.data) {
            setLoadingState(false);
            const expectedData = data?.data?.template_id;
            try {
              if (typeof expectedData === "string") {
                Cookies.set("templateId", data?.data?.template_id);
                pushNotification("success", "Template successfully saved ");
                handleResetAll();
                props?.onClose();
                props?.callApiAgain(true);
              } else {
                throw new Error(
                  "email templates add_or_update API response has changed"
                );
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInUploadFile,
                "",
                5000
              );
            }
          } else if (data.message) {
            const expectedData = data.message;
            try {
              if (typeof expectedData === "string") {
                setLoadingState(false);
                pushNotification("success", "Template successfully saved ");
                handleResetAll();
                if (!props?.forDataValue) {
                  props?.onClose();
                  if (!props?.createMood) {
                    props?.callApiAgain(true);
                  }
                }
              } else {
                throw new Error(
                  "email templates add_or_update API response has changed"
                );
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInUploadFile,
                "",
                5000
              );
            }
          } else if (data?.detail) {
            setLoadingState(false);
            pushNotification("error", data?.detail);
          }
        })
        .catch((err) => {
          setLoadingState(false);
          handleInternalServerError(setUploadFileInternalServerError, "", 5000);
        })
        .finally(() => {
          setLoadingState(false);
        });
    });
  };

  const handleResetAll = () => {
    setAllGetTags([]);
    setTemplateName("");
    setMailSubject("");
    setEmailType(null);
    setEmailProvider(null);
    setEmailCategory(null);
    Cookies.remove("templateId");
    window.history.replaceState({}, document.title);
    emailEditorRef.current.editor.loadBlank();
  };

  const [openCreateTemplateInfoDialog, setOpenCreateTemplateInfoDialog] =
    useState(false);

  const handleClickOpenDialog = () => {
    setOpenCreateTemplateInfoDialog(true);
  };
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  useEffect(() => {
    setHeadTitle("Template Manager");
    document.title = "Template Manager";
  }, [headTitle]);
  const { handleFilterListApiCall } = useCommonApiCalls();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const [categoryLoading, setCategoryLoading] = useState(false);
  const [emailTemplateCategory] = useCreateEmailTemplateCategoryMutation();
  const handleCreateCategory = () => {
    setCategoryLoading(true);
    emailTemplateCategory({
      categoryName: newCategory,
      collegeId: collegeId,
    })
      .unwrap()
      .then((res) => {
        try {
          if (res?.message) {
            if (typeof res?.message === "string") {
              pushNotification("success", "Create Category Successful");
              setNewCategory("");
            } else {
              throw new Error("create category API response changed");
            }
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setSomethingWentWrongInUploadFile, "", 5000);
        }
        // }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setUploadFileInternalServerError,
            "",
            10000
          );
        }
      })
      .finally(() => {
        setCategoryLoading(false);
      });
  };
  const [skipCategoryListApi, setSkipCategoryListApi] = useState(
    email_category ? false : true
  );
  const getEmailTemplateCategory = useGetEmailTemplateCategoryQuery(
    { collegeId: collegeId },
    { skip: skipCategoryListApi }
  );
  useEffect(() => {
    if (!skipCategoryListApi) {
      const category = getEmailTemplateCategory?.data?.data;
      handleFilterListApiCall(
        category,
        getEmailTemplateCategory,
        setCategories,
        "",
        organizeEmailCategoryOption,
        "",
        setUploadFileInternalServerError,
        setSomethingWentWrongInUploadFile
      );
    }
  }, [getEmailTemplateCategory, skipCategoryListApi]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  useEffect(() => {
    if (
      selectedCategory?.length > 0 &&
      emailType?.length > 0 &&
      emailProvider?.length > 0 &&
      mailSubject?.length > 0 &&
      templateName?.length > 0 &&
      senderEmailId?.length > 0
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [
    selectedCategory,
    emailType,
    emailProvider,
    mailSubject,
    templateName,
    senderEmailId,
  ]);
  const [inputFields, setInputFields] = useState([]);

  useEffect(() => {
    setInputFields([{ id: 0, value: "" }]);
  }, []);
  const [attachmentDocumentsArray, setAttachmentDocumentsArray] = useState(
    attachment_document_link ? attachment_document_link : []
  );
  const handleInputChange = (id, event) => {
    const newInputFields = inputFields.map((field) =>
      field.id === id ? { ...field, value: event } : field
    );
    setInputFields(newInputFields);
  };
  const handleInputClear = (id) => {
    const newInputFields = inputFields.map((field) =>
      field.id === id ? { ...field, value: "" } : field
    );
    setInputFields(newInputFields);
  };
  useEffect(() => {
    if (attachment_document_link && attachment_document_link.length > 0) {
      const updatedFields = attachment_document_link.map((url, index) => ({
        id: index,
        value: url,
      }));
      setInputFields(updatedFields);
    }
  }, [attachment_document_link]);
  const handleAddField = () => {
    setInputFields([...inputFields, { id: inputFields.length, value: "" }]);
  };
  const handleRemoveField = (id) => {
    setInputFields(inputFields.filter((field) => field.id !== id));
  };
  useEffect(() => {
    setAttachmentDocumentsArray(inputFields.map((field) => field.value));
  }, [inputFields]);

  return (
    <Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingState}
      >
        <CircularProgress color="info" />
      </Backdrop>

      {somethingWentWrongInUploadFile || uploadFileInternalServerError ? (
        <Card>
          <Box
            className="align-row"
            sx={{ visibility: props?.forDataValue ? "hidden" : "visible" }}
          >
            <Typography className="create-tm-header">
              Create Template
            </Typography>
            <IconButton onClick={() => props.onClose()} className="close-icon">
              <CloseIcon />
            </IconButton>
          </Box>
          {somethingWentWrongInUploadFile && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
          {uploadFileInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
        </Card>
      ) : (
        <Card sx={{ p: 3 }}>
          <Box sx={{ display: props?.forDataValue ? "none" : "block" }}>
            <Box className="align-row">
              <Typography className="create-tm-header">
                Create Template
              </Typography>
              <IconButton
                onClick={() => props?.onClose()}
                className="close-icon"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: props?.forDataValue ? "none" : "block" }}>
            <Box sx={{ pt: 3 }} className="tm-tabs-wrapper">
              <MultipleTabs
                tabArray={[
                  { tabName: "Email" },
                  { tabName: "WhatsApp" },
                  { tabName: "Sms" },
                ]}
                setMapTabValue={props.setCurrentTab}
                mapTabValue={props.currentTab}
                boxWidth="260px"
              ></MultipleTabs>
            </Box>
          </Box>

          <form
            onSubmit={(e) => {
              onSubmitTemplate(e);
            }}
          >
            <Grid container spacing={2} sx={{ py: 3 }}>
              <Grid item md={2} sm={12} xs={12}>
                <FilterSelectPicker
                  className="dashboard-select-picker"
                  pickerData={senderEmailIDList}
                  onOpen={() => setOpenSenderId(false)}
                  hideSearch={true}
                  loading={senderAndReceiverIdDetails?.isLoading}
                  style={{ width: "100%" }}
                  placeholder="Sender Id*"
                  pickerValue={senderEmailId}
                  setSelectedPicker={setSenderEmailId}
                  readOnly={mood}
                />
              </Grid>
              <Grid item md={2} sm={12} xs={12}>
                <FilterSelectPicker
                  className="dashboard-select-picker"
                  pickerData={replyEmailIDList}
                  onOpen={() => setOpenSenderId(false)}
                  hideSearch={true}
                  loading={senderAndReceiverIdDetails?.isLoading}
                  style={{ width: "100%" }}
                  placeholder="Reply To Email Id"
                  pickerValue={replyEmailId}
                  setSelectedPicker={setReplyEmailId}
                  readOnly={mood}
                />
              </Grid>
              <Grid item md={2} sm={12} xs={12}>
                <Input
                  placeholder={"Enter Template Name*"}
                  size="md"
                  onChange={(event) => {
                    setTemplateName(event);
                  }}
                  value={templateName}
                  style={{ width: "100%", border: "1px solid #a9c9e5" }}
                  required
                  readOnly={mood}
                />
              </Grid>
              <Grid item md={2} sm={12} xs={12}>
                <Input
                  required
                  placeholder={"Enter Email Subject*"}
                  size="md"
                  onChange={(event) => {
                    setMailSubject(event);
                  }}
                  value={mailSubject}
                  style={{ width: "100%", border: "1px solid #a9c9e5" }}
                  readOnly={mood}
                />
              </Grid>
              <Grid item md={2} sm={12} xs={12}>
                <TagPicker
                  data={templateTagsList}
                  style={{ width: "100%", border: "1px solid #a9c9e5" }}
                  placeholder={"Add Tags"}
                  creatable
                  onChange={(event) => {
                    setAllGetTags(event);
                  }}
                  value={allTags}
                  readOnly={mood}
                  className="dashboard-select-picker"
                  onOpen={() => {
                    setCallTemplateTagApi(true);
                  }}
                  loading={templateTagsLoading}
                />
              </Grid>
              <Grid item md={2} sm={12} xs={12}>
                <SelectPicker
                  className="dashboard-select-picker"
                  data={categories}
                  loading={getEmailTemplateCategory?.isFetching}
                  style={{ width: "100%" }}
                  placeholder="Category*"
                  onChange={(e) => setSelectedCategory(e)}
                  value={selectedCategory}
                  menuStyle={{ zIndex: 1000 }}
                  renderMenu={(menu) => (
                    <>
                      {menu}
                      <div
                        style={{
                          padding: "8px 12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <Input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e)}
                          placeholder="Add Category"
                          style={{
                            width: "100%",
                            padding: "4px 8px",
                            boxSizing: "border-box",
                            border: "1px solid #a9c9e5",
                          }}
                        />
                        <Button
                          onClick={handleCreateCategory}
                          style={{ padding: "2px 0" }}
                          color="info"
                          variant="outlined"
                          disabled={!newCategory}
                        >
                          {categoryLoading ? (
                            <CircularProgress color="info" size={20} />
                          ) : (
                            <AddOutlinedIcon />
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                  onOpen={() => {
                    setSkipCategoryListApi(false);
                  }}
                  readOnly={mood}
                />
              </Grid>
              <Grid item md={2} sm={12} xs={12}>
                <SelectPicker
                  className="dashboard-select-picker"
                  data={EmailTypeList?.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  searchable={false}
                  style={{ width: "100%" }}
                  placeholder="Email Type*"
                  value={emailType}
                  onChange={(newValue) => {
                    setEmailType(newValue);
                  }}
                  readOnly={mood}
                />
              </Grid>
              <Grid item md={2} sm={12} xs={12}>
                <SelectPicker
                  className="dashboard-select-picker"
                  data={EmailProviderList?.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  searchable={false}
                  style={{ width: "100%" }}
                  placeholder="Email Provider*"
                  value={emailProvider}
                  onChange={(newValue) => {
                    setEmailProvider(newValue);
                  }}
                  readOnly={mood}
                />
              </Grid>
              <UserRoleAndMembers
                md={2}
                selectedRoleType={selectedRoleType}
                setSelectedRoleType={setSelectedRoleType}
                selectedMembers={selectedMembers}
                setSelectedMembers={setSelectedMembers}
                mood={mood}
                setSomethingWentWrongInUploadFile={
                  setSomethingWentWrongInUploadFile
                }
                setUploadFileInternalServerError={
                  setUploadFileInternalServerError
                }
                userRoleList={userRoleList}
                setUserRoleList={setUserRoleList}
                membersList={membersList}
                setMembersList={setMembersList}
                select_members={select_members}
                select_profile_role={select_profile_role}
              ></UserRoleAndMembers>
              {/* // Currently we are not use this code, if we need to use it in future we wll use it. */}
              {/* <Grid item md={3} sm={12} xs={12}>
                        {permissions?.menus?.template_manager
                ?.manage_communication_template?.features?.manage_category && (
                <>
                   <SelectPicker
      data={EmailCategoryList?.map(item=>({label:item,value:item}))}
      searchable={false}
      style={{ width: 200 }}
      placeholder="Email Category"
      value={emailCategory}
                  onChange={(newValue) => {
                    setEmailCategory(newValue);
                  }}
                  readOnly={mood}
    />
                </>
              )}
                        </Grid> */}
              {inputFields.map((field) => (
                <Grid item md={2} sm={12} xs={12}>
                  <Box sx={{ display: "flex" }}>
                    <InputGroup
                      style={{
                        marginRight: "8px",
                        height: "37px",
                        width: "100%",
                      }}
                    >
                      <Input
                        placeholder={"Paste Document URL"}
                        size="md"
                        onChange={(event) => handleInputChange(field.id, event)}
                        value={field.value}
                        style={{ width: "100%", marginRight: "8px" }}
                        readOnly={mood}
                      />
                      <IconButton
                        onClick={() => handleInputClear(field.id)}
                        sx={{ fontSize: "1px" }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </InputGroup>

                    {field.id !== 0 && (
                      <IconButton
                        onClick={() => handleRemoveField(field.id)}
                        readOnly={mood}
                        disabled={mood ? true : false}
                        sx={{ color: "#008be2 !important" }}
                        className="add-outlined-button"
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              ))}
              <Grid item md={1} sm={12} xs={12}>
                <Button
                  className="add-outlined-button"
                  onClick={handleAddField}
                  sx={{ color: "#008be2 !important" }}
                  readOnly={mood}
                  disabled={mood ? true : false}
                >
                  <AddIcon />
                </Button>
              </Grid>
            </Grid>
            <Box className="add-merge-tag-container">
              <Button
                className="common-outlined-button"
                onClick={() => {
                  setOpenMergeTagDialog(true);
                  emailEditorRef.current.editor.exportHtml((data) => {
                    setEmailTemplateDesign(data?.design);
                  });
                }}
                sx={{ color: "#008be2 !important" }}
                endIcon={<AddIcon />}
                disabled={mood}
              >
                Add Merge Tag
              </Button>
            </Box>

            <EmailEditor
              style={{ overflow: "scroll" }}
              ref={emailEditorRef}
              minHeight="85vh"
              onLoad={onLoad}
              onReady={onReady}
              id="editor"
              options={{
                id: "editor-container",
                displayMode: "email",
                appearance: {
                  theme: "dark",
                },
                mergeTags: templateMergeKaysList,
                mergeTagsConfig: {
                  autocompleteTriggerChar: "/",
                },
              }}
            />
            <Box className="publish-button">
              {!mood && (
                <>
                  <Button
                    type="submit"
                    name="draftTemplate"
                    className={
                      buttonDisabled
                        ? "common-contained-button"
                        : "common-contained-button-disabled"
                    }
                    disabled={!buttonDisabled}
                  >
                    Save
                  </Button>
                  <Button
                    name="publishTemplate"
                    className={
                      buttonDisabled
                        ? "common-contained-button"
                        : "common-contained-button-disabled"
                    }
                    disabled={!buttonDisabled}
                    type="submit"
                  >
                    Publish
                  </Button>
                </>
              )}
              {!props?.forDataValue && (
                <Button
                  type="submit"
                  name="cancelTemplate"
                  className="common-outlined-button"
                >
                  Cancel
                </Button>
              )}
            </Box>
          </form>
        </Card>
      )}

      <TemplateCreateInfoDialog
        openCreateTemplateInfoDialog={openCreateTemplateInfoDialog}
        setOpenCreateTemplateInfoDialog={setOpenCreateTemplateInfoDialog}
        emailCategory={emailCategory}
      />
      <AddMergeTagDialog
        open={openMergeTagDialog}
        handleClose={() => setOpenMergeTagDialog(false)}
      />
    </Box>
  );
}

export default CreateEmailTemplate;
