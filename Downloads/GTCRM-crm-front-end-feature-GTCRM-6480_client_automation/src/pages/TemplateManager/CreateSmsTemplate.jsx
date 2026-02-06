/* eslint-disable react-hooks/exhaustive-deps */
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Button as MuiButton,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, SelectPicker, TagPicker } from "rsuite";
import {
  useAddOrUpdateTemplateMutation,
  useGetTemplateMergeKaysQuery,
} from "../../Redux/Slices/applicationDataApiSlice";
import { fetchTemplateTags } from "../../Redux/Slices/templateSlice";
import { parseTemplateText } from "../../components/Calendar/utils";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import MultipleTabs from "../../components/shared/tab-panel/MultipleTabs";
import { smsCategoryList } from "../../constants/EmailList";
import { smsTypeList } from "../../constants/LeadStageList";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { setTemplateMergeTag } from "../../utils/setTemplateMergeTag";
import "./../../styles/CreateWhatsAppTemplate.css";
import "./../../styles/sharedStyles.css";
import SmsAndWhatsappContentEditor from "./SmsAndWhatsappContentEditor";
import UserRoleAndMembers from "./UserRoleAndMembers";

function CreateSmsTemplate(props) {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const permissions = useSelector((state) => state.authentication.permissions);
  const state = props.data;
  const pushNotification = useToasterHook();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const [isLoading, setIsLoading] = useState(false);
  const [templateNameError, setTemplateNameError] = useState("");
  const dispatch = useDispatch();
  const [addOrUpdateTemplate] = useAddOrUpdateTemplateMutation();
  const [errorTagField, setErrorTagField] = React.useState();
  const [callTemplateTagApi, setCallTemplateTagApi] = useState(
    state?.addedTags?.length > 0 ? true : false
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
          tagType: "sms",
          collegeId: collegeId,
        })
      );
    }
  }, [collegeId, dispatch, token, callTemplateTagApi]);

  const tags = () => {
    const onlyTags = [];
    state?.addedTags.forEach((element) => {
      onlyTags.push(element?.tag_name);
    });
    return onlyTags;
  };

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [smsTemplateTags, setSmsTemplateTags] = useState(
    state?.addedTags ? tags() : []
  );
  const [templateMergeKaysList, setTemplateMergeKeysList] = useState([]);
  const [templateContentHTML, setTemplateContentHTML] = useState("");
  const [templateContentText, setTemplateContentText] = useState(
    state?.content || ""
  );

  const [smsTemplateName, setSmsTemplateName] = useState(
    state?.individualTemplateName ? state?.individualTemplateName : ""
  );
  const [dltContentId, setDltContentId] = useState(
    state?.dltContentId ? state?.dltContentId : ""
  );

  //internal server error state
  const [
    addSmsTemplateInternalServerError,
    setAddSmsTemplateInternalServerError,
  ] = useState(false);
  const [somethingWentWrongInSmsTemplate, setSomethingWentWrongInSmsTemplate] =
    useState(false);

  const templateId = Cookies.get("templateId");

  const [smsType, setSmsType] = React.useState(
    state?.smsType ? state?.smsType : ""
  );
  const [senderName, setSenderName] = React.useState(
    state?.senderName ? state?.senderName : ""
  );
  const [smsCategory, setSmsCategory] = useState(
    state?.smsCategory ? state?.smsCategory : null
  );
  const [selectedRoleType, setSelectedRoleType] = useState(
    state?.select_profile_role?.length > 0 ? state?.select_profile_role : []
  );
  const [selectedMembers, setSelectedMembers] = useState(
    state?.select_members?.length > 0 ? state?.select_members : []
  );
  const [userRoleList, setUserRoleList] = useState([]);
  const [membersList, setMembersList] = useState([]);

  const handleChange = (event) => {
    setSmsType(event.target.value);
  };
  const { isError, isSuccess, data, error, isFetching } =
    useGetTemplateMergeKaysQuery({
      collegeId,
    });

  useEffect(() => {
    setTemplateMergeTag({
      isSuccess,
      setTemplateMergeKeysList,
      data,
      isError,
      error,
      pushNotification,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isError, isSuccess, error]);

  useEffect(() => {
    let content = state?.content;
    if (content?.length) {
      // parsing the found tags and replacing into HTML
      content = parseTemplateText(content, templateMergeKaysList, true);
      setTemplateContentHTML(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateMergeKaysList, state?.content]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!templateContentText?.length) {
      pushNotification("warning", "Please provide content.");
      return;
    }

    const isPublishTemplate = document.activeElement.name === "publishTemplate";
    const smsTemplateInputData = {
      template_type: "sms",
      template_name: smsTemplateName,
      content: templateContentHTML?.toString().includes("span")
        ? parseTemplateText(templateContentText, templateMergeKaysList)
        : templateContentText, // parsing the texts and replacing the tags into ex. First Name to {First Name}
      tags: smsTemplateTags,
      is_published: isPublishTemplate,
      dlt_content_id: dltContentId,
      sms_type: smsType,
      sender: senderName,
      sms_category: permissions?.menus?.template_manager
        ?.manage_communication_template?.features?.manage_category
        ? smsCategory?.toLowerCase()
        : "default",
      //new payload
      select_profile_role: selectedRoleType,
      select_members: selectedMembers,
    };

    setIsLoading(true);
    setTemplateNameError("");

    addOrUpdateTemplate({
      collegeId,
      templateId,
      payload: smsTemplateInputData,
    })
      .unwrap()
      .then((result) => {
        if (result?.detail?.includes("Could not validate credentials")) {
          window.location.reload();
        } else if (result?.detail) {
          setIsLoading(false);
          pushNotification("error", result?.detail);
        } else if (result?.message) {
          const expectedData = result?.message;
          try {
            if (typeof expectedData === "string") {
              setIsLoading(false);
              pushNotification("success", result?.message);
              if (!props?.forDataValue) {
                if (!props?.createMood) {
                  props?.callApiAgain(true);
                }
                props?.onClose();
              }
            } else {
              throw new Error(
                "sms templates add_or_update API response has changed"
              );
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInSmsTemplate,
              "",
              5000
            );
          }
        }
      })
      .catch(() => {
        handleInternalServerError(
          setAddSmsTemplateInternalServerError,
          "",
          5000
        );
      })
      .finally(() => setIsLoading(false));

    event.target.reset();
    setSmsTemplateTags([]);
    setTemplateContentHTML("");
    setTemplateContentText("");
    setSmsTemplateName("");
    setDltContentId("");
    setSmsType("");
    setSenderName("");
    Cookies.remove("templateId");
    setSelectedRoleType([]);
    setSelectedMembers([]);
  };
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  useEffect(() => {
    setHeadTitle("Template Manager");
    document.title = "Template Manager";
  }, [headTitle]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  useEffect(() => {
    if (
      smsType?.length > 0 &&
      smsTemplateName?.length > 0 &&
      senderName?.length > 0 &&
      dltContentId?.length > 0 &&
      templateContentText?.length > 0
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [smsType, smsTemplateName, senderName, dltContentId, templateContentText]);
  return (
    <Box
      component="main"
      className=" custom-component-container-box"
      sx={{
        py: 0,
        mt: 0,
        width: "100%",
        pb: 4,
      }}
    >
      <Container maxWidth={true}>
        <Grid container>
          <Grid item md={12} sm={12} xs={12}>
            <Box sx={{ py: 3 }}>
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
                <Box sx={{ mt: 3 }} className="tm-tabs-wrapper">
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
              {addSmsTemplateInternalServerError ||
              somethingWentWrongInSmsTemplate ? (
                <>
                  {addSmsTemplateInternalServerError && (
                    <Error500Animation
                      height={400}
                      width={400}
                    ></Error500Animation>
                  )}
                  {somethingWentWrongInSmsTemplate && (
                    <ErrorFallback
                      error={apiResponseChangeMessage}
                      resetErrorBoundary={() => window.location.reload()}
                    />
                  )}
                </>
              ) : (
                <Box className="Basic-information-wrapper">
                  {isLoading || isFetching ? (
                    <Box className="leef-lottie-animation-loader">
                      <LeefLottieAnimationLoader
                        height={100}
                        width={100}
                      ></LeefLottieAnimationLoader>
                    </Box>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={2} sx={{ py: 3 }}>
                        <Grid item md={3} sm={12} xs={12}>
                          <>
                            <Input
                              placeholder={"Template Name*"}
                              size="md"
                              onChange={(event) => {
                                setSmsTemplateName(event);
                              }}
                              value={smsTemplateName}
                              style={{
                                width: "100%",
                                border: "1px solid #a9c9e5",
                              }}
                              required
                              readOnly={state?.mood}
                            />
                          </>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <Input
                            placeholder={"Sender ID*"}
                            required
                            size="md"
                            onChange={(event) => {
                              setSenderName(event);
                            }}
                            value={senderName}
                            style={{
                              width: "100%",
                              border: "1px solid #a9c9e5",
                            }}
                            readOnly={state?.mood}
                          />
                        </Grid>

                        <Grid item md={3} sm={12} xs={12}>
                          <SelectPicker
                            className="dashboard-select-picker"
                            data={smsTypeList}
                            searchable={false}
                            style={{ width: "100%" }}
                            placeholder="SMS Type*"
                            value={smsType}
                            onChange={(newValue) => {
                              setSmsType(newValue);
                            }}
                            readOnly={state?.mood}
                          />
                        </Grid>

                        <Grid item md={3} sm={12} xs={12}>
                          <TagPicker
                            data={templateTagsList}
                            style={{
                              width: "100%",
                              border: "1px solid #a9c9e5",
                            }}
                            placeholder={"Add Tags"}
                            creatable
                            onChange={(event) => {
                              setSmsTemplateTags(event);
                            }}
                            className="dashboard-select-picker"
                            value={smsTemplateTags}
                            readOnly={state?.mood}
                            onOpen={() => {
                              setCallTemplateTagApi(true);
                            }}
                            loading={templateTagsLoading}
                          />
                        </Grid>

                        <Grid item md={3} sm={12} xs={12}>
                          <Input
                            placeholder={"Dlt Content Id*"}
                            size="md"
                            onChange={(event) => {
                              setDltContentId(event);
                            }}
                            value={dltContentId}
                            style={{
                              width: "100%",
                              border: "1px solid #a9c9e5",
                            }}
                            required
                            readOnly={state?.mood}
                          />
                        </Grid>
                        <UserRoleAndMembers
                          md={4}
                          selectedRoleType={selectedRoleType}
                          setSelectedRoleType={setSelectedRoleType}
                          selectedMembers={selectedMembers}
                          setSelectedMembers={setSelectedMembers}
                          mood={state?.mood}
                          setSomethingWentWrongInUploadFile={
                            setSomethingWentWrongInSmsTemplate
                          }
                          setUploadFileInternalServerError={
                            setAddSmsTemplateInternalServerError
                          }
                          userRoleList={userRoleList}
                          setUserRoleList={setUserRoleList}
                          membersList={membersList}
                          setMembersList={setMembersList}
                          select_members={state?.select_members}
                          select_profile_role={state?.select_profile_role}
                        ></UserRoleAndMembers>
                        <Grid item md={4} sm={12} xs={12}>
                          {permissions?.menus?.template_manager
                            ?.manage_communication_template?.features
                            ?.manage_category?.menu && (
                            <>
                              <SelectPicker
                                data={smsCategoryList?.map((item) => ({
                                  label: item,
                                  value: item,
                                }))}
                                searchable={false}
                                style={{ width: "100%" }}
                                placeholder="SMS Category"
                                value={smsCategory}
                                onChange={(newValue) => {
                                  setSmsCategory(newValue);
                                }}
                                readOnly={state?.mood}
                              />
                            </>
                          )}
                        </Grid>

                        <Grid item md={12} sm={12} xs={12}>
                          <Box>
                            <SmsAndWhatsappContentEditor
                              editorContent={templateContentHTML}
                              setEditorContent={setTemplateContentHTML}
                              contentLimit={1500}
                              setTextContent={setTemplateContentText}
                              templateMergeKaysList={templateMergeKaysList}
                            />
                          </Box>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Box className="save-next">
                            {!state?.mood && (
                              <>
                                <MuiButton
                                  name="draftTemplate"
                                  type="submit"
                                  variant="contained"
                                  className={`tem-button ${
                                    buttonDisabled ? "save-btn" : "disabled-btn"
                                  }`}
                                  disabled={!buttonDisabled}
                                >
                                  Save
                                </MuiButton>
                                <MuiButton
                                  name="publishTemplate"
                                  type="submit"
                                  variant="contained"
                                  className={`tem-button ${
                                    buttonDisabled ? "save-btn" : "disabled-btn"
                                  }`}
                                  disabled={!buttonDisabled}
                                >
                                  Publish
                                </MuiButton>
                              </>
                            )}
                            {!props?.forDataValue && (
                              <MuiButton
                                name="CancelTemplate"
                                variant="outlined"
                                className="tem-button publish-btn"
                                onClick={() => props?.onClose()}
                              >
                                Cancel
                              </MuiButton>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </form>
                  )}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default CreateSmsTemplate;
