/* eslint-disable react-hooks/exhaustive-deps */
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Button as MuiButton,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import React, { useContext, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import MultipleTabs from "../../components/shared/tab-panel/MultipleTabs";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import "./../../styles/CreateWhatsAppTemplate.css";
import "./../../styles/sharedStyles.css";

import AddIcon from "@mui/icons-material/Add";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Input, SelectPicker, TagPicker } from "rsuite";
import {
  useAddOrUpdateTemplateMutation,
  useGetTemplateMergeKaysQuery,
} from "../../Redux/Slices/applicationDataApiSlice";
import { fetchTemplateTags } from "../../Redux/Slices/templateSlice";
import { parseTemplateText } from "../../components/Calendar/utils";
import {
  whatsAppAttachmentTypeList,
  whatsAppInteractiveNatureList,
  whatsAppInteractiveTypeList,
  whatsAppTypeList,
} from "../../constants/LeadStageList";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { setTemplateMergeTag } from "../../utils/setTemplateMergeTag";
import SmsAndWhatsappContentEditor from "./SmsAndWhatsappContentEditor";
import UserRoleAndMembers from "./UserRoleAndMembers";
function CreateWhatsAppTemplate(props) {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
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
          tagType: "whatsapp",
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

  const [whatsAppTemplateTags, setWhatsAppTemplateTags] = useState(
    state?.addedTags ? tags() : []
  );
  const [whatsappTemplateId, setWhatsappTemplateId] = useState(
    state?.templateId ? state?.templateId : ""
  );
  const [templateMergeKaysList, setTemplateMergeKeysList] = useState([]);
  const [templateContentHTML, setTemplateContentHTML] = useState("");
  const [templateContentText, setTemplateContentText] = useState(
    state?.content || ""
  );
  const [whatsAppTemplateName, setWhatsAppTemplateName] = useState(
    state?.individualTemplateName ? state?.individualTemplateName : ""
  );
  const [selectedTemplateType, setSelectedTemplateType] = useState(
    state?.template_type_option?.length > 0 ? state?.template_type_option : ""
  );
  const [whatsAppAttachmentURL, setWhatsAppAttachmentURL] = useState(
    state?.attachmentURL?.length > 0 ? state?.attachmentURL : ""
  );
  const [selectedAttachmentTemplateType, setSelectedAttachmentTemplateType] =
    useState(state?.attachmentType?.length > 0 ? state?.attachmentType : "");

  //internal server error state
  const [
    addWhatsAppTemplateInternalServerError,
    setAddWhatsAppTemplateInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInWhatsAppTemplate,
    setSomethingWentWrongInWhatsAppTemplate,
  ] = useState(false);

  const templateId = Cookies?.get("templateId");

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
  const [interactiveComponents, setInteractiveComponents] = useState(
    state?.add_template_option_url?.length > 0
      ? state?.add_template_option_url
      : [{ type: "", nature: "", url: "" }]
  );
  const [selectedRoleType, setSelectedRoleType] = useState(
    state?.select_profile_role?.length > 0 ? state?.select_profile_role : []
  );
  const [selectedMembers, setSelectedMembers] = useState(
    state?.select_members?.length > 0 ? state?.select_members : []
  );
  const [userRoleList, setUserRoleList] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const handleReset = () => {
    setTemplateContentHTML("");
    setTemplateContentText("");
    setWhatsAppTemplateTags([]);
    setWhatsAppTemplateName("");
    Cookies.remove("templateId");
    setWhatsappTemplateId("");
    setSelectedTemplateType("");
    setSelectedAttachmentTemplateType("");
    setWhatsAppAttachmentURL("");
    setInteractiveComponents([{ type: "", nature: "", url: "" }]);
    setSelectedRoleType([]);
    setSelectedMembers([]);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!templateContentText?.length) {
      pushNotification("warning", "Please provide content.");
      return;
    }

    const isPublishTemplate = document.activeElement.name === "publishTemplate";
    const whatsAppTemplateInputData = {
      template_type: "whatsapp",
      template_name: whatsAppTemplateName,
      content: templateContentHTML?.toString().includes("span")
        ? parseTemplateText(templateContentText, templateMergeKaysList)
        : templateContentText, // parsing the texts and replacing the tags into ex. First Name to {First Name}
      tags: whatsAppTemplateTags,
      is_published: isPublishTemplate,
      template_id: whatsappTemplateId,
      //new option list
      template_type_option: selectedTemplateType,
      add_template_option_url: interactiveComponents,
      select_profile_role: selectedRoleType,
      select_members: selectedMembers,
      attachmentType: selectedAttachmentTemplateType
        ? selectedAttachmentTemplateType
        : "",
      attachmentURL: whatsAppAttachmentURL ? whatsAppAttachmentURL : "",
    };
    setIsLoading(true);
    setTemplateNameError("");
    addOrUpdateTemplate({
      collegeId,
      templateId,
      payload: whatsAppTemplateInputData,
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
                props?.onClose();
                if (!props?.createMood) {
                  props?.callApiAgain(true);
                }
              }
            } else {
              throw new Error(
                "WhatsApp templates add_or_update API response has changed"
              );
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInWhatsAppTemplate,
              "",
              5000
            );
          }
        }
      })
      .catch(() => {
        handleInternalServerError(
          setAddWhatsAppTemplateInternalServerError,
          "",
          5000
        );
      })
      .finally(() => setIsLoading(false));

    event.target.reset();
    handleReset();
  };

  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  useEffect(() => {
    setHeadTitle("Template Manager");
    document.title = "Template Manager";
  }, [headTitle]);

  const handleAddClick = () => {
    if (interactiveComponents?.length === 2) {
      pushNotification("warning", "A maximum of two components can be created");
    } else {
      setInteractiveComponents([
        ...interactiveComponents,
        { type: "", nature: "", url: "" },
      ]);
    }
  };

  const handleRemoveClick = (index) => {
    const updatedComponents = interactiveComponents.filter(
      (_, i) => i !== index
    );
    setInteractiveComponents(updatedComponents);
  };

  const handleTypeChange = (index, newValue) => {
    const updatedComponents = [...interactiveComponents];
    updatedComponents[index].type = newValue;
    setInteractiveComponents(updatedComponents);
  };

  const handleNatureChange = (index, newValue) => {
    const updatedComponents = [...interactiveComponents];
    updatedComponents[index].nature = newValue;
    setInteractiveComponents(updatedComponents);
  };

  const handleURLChange = (index, event) => {
    const updatedComponents = [...interactiveComponents];
    updatedComponents[index].url = event;
    setInteractiveComponents(updatedComponents);
  };
  const [buttonDisabled, setButtonDisabled] = useState(false);
  useEffect(() => {
    if (
      selectedTemplateType?.length > 0 &&
      whatsAppTemplateName?.length > 0 &&
      whatsappTemplateId?.length > 0 &&
      templateContentText?.length > 0
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [
    selectedTemplateType,
    whatsAppTemplateName,
    whatsappTemplateId,
    templateContentText,
  ]);
  return (
    <Box
      component="main"
      className="custom-component-container-box"
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
                    <CloseIcon/>
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
              {addWhatsAppTemplateInternalServerError ||
              somethingWentWrongInWhatsAppTemplate ? (
                <>
                  {addWhatsAppTemplateInternalServerError && (
                    <Error500Animation
                      height={400}
                      width={400}
                    ></Error500Animation>
                  )}
                  {somethingWentWrongInWhatsAppTemplate && (
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
                      <Grid container spacing={2} sx={{py:3}}>
                        <Grid item md={3} sm={12} xs={12}>
                          <Input
                            placeholder={"Template Name*"}
                            size="md"
                            onChange={(event) => {
                              setWhatsAppTemplateName(event);
                            }}
                            value={whatsAppTemplateName}
                            style={{
                              width: "100%",
                              border: "1px solid #a9c9e5",
                            }}
                            required
                            readOnly={state?.mood}
                          />
                        </Grid>

                        <Grid item md={3} sm={12} xs={12}>
                          <Input
                            placeholder={"Template ID*"}
                            size="md"
                            onChange={(event) => {
                              setWhatsappTemplateId(event);
                            }}
                            value={whatsappTemplateId}
                            style={{
                              width: "100%",
                              border: "1px solid #a9c9e5",
                            }}
                            required
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
                              setWhatsAppTemplateTags(event);
                            }}
                            value={whatsAppTemplateTags}
                            readOnly={state?.mood}
                            className="dashboard-select-picker"
                            onOpen={() => {
                              setCallTemplateTagApi(true);
                            }}
                            loading={templateTagsLoading}
                          />
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <SelectPicker
                            className="dashboard-select-picker"
                            data={whatsAppTypeList}
                            searchable={false}
                            style={{ width: "100%" }}
                            placeholder="Template Type*"
                            value={selectedTemplateType}
                            onChange={(newValue) => {
                              setSelectedTemplateType(newValue);
                              setSelectedAttachmentTemplateType("");
                              setWhatsAppAttachmentURL("");
                              setInteractiveComponents([
                                { type: "", nature: "", url: "" },
                              ]);
                            }}
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
                            setSomethingWentWrongInWhatsAppTemplate
                          }
                          setUploadFileInternalServerError={
                            setAddWhatsAppTemplateInternalServerError
                          }
                          userRoleList={userRoleList}
                          setUserRoleList={setUserRoleList}
                          membersList={membersList}
                          setMembersList={setMembersList}
                          select_members={state?.select_members}
                          select_profile_role={state?.select_profile_role}
                        ></UserRoleAndMembers>

                        <Grid item md={12} sm={12} xs={12}>
                          <SmsAndWhatsappContentEditor
                            editorContent={templateContentHTML}
                            setEditorContent={setTemplateContentHTML}
                            contentLimit={65536}
                            setTextContent={setTemplateContentText}
                            templateMergeKaysList={templateMergeKaysList}
                          />
                        </Grid>
                        {["media_attachments", "interactive_button"].includes(selectedTemplateType?.toLocaleLowerCase()) && (
                          <>
                            <Grid item md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                              <SelectPicker
                                className="dashboard-select-picker"
                                data={whatsAppAttachmentTypeList}
                                searchable={false}
                                style={{ width: "100%" }}
                                placeholder="Attachment Type"
                                value={selectedAttachmentTemplateType}
                                onChange={(newValue) => {
                                  setSelectedAttachmentTemplateType(newValue);
                                  setWhatsAppAttachmentURL("");
                                }}
                                readOnly={state?.mood}
                              />
                            </Grid>
                            <Grid item md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                              <Input
                                placeholder={"Attachment URL"}
                                size="md"
                                onChange={(event) => {
                                  setWhatsAppAttachmentURL(event);
                                }}
                                value={whatsAppAttachmentURL}
                                style={{
                                  width: "100%",
                                  border: "1px solid #a9c9e5",
                                }}
                                required
                                readOnly={state?.mood}
                              />
                            </Grid>
                          </>
                        )}
                        {selectedTemplateType?.toLocaleLowerCase() ===
                          "interactive_button" &&
                          interactiveComponents?.map((component, index) => (
                            <React.Fragment key={index}>
                              
                              <Grid item md={3} sm={12} xs={12} sx={{ mt: 2 }}>
                                <SelectPicker
                                  className="dashboard-select-picker"
                                  data={whatsAppInteractiveTypeList}
                                  searchable={false}
                                  style={{ width: "100%" }}
                                  placeholder="Type"
                                  value={component.type}
                                  onChange={(newValue) =>
                                    handleTypeChange(index, newValue)
                                  }
                                  readOnly={state?.mood}
                                />
                              </Grid>
                              <Grid item md={3} sm={12} xs={12} sx={{ mt: 2 }}>
                                <SelectPicker
                                  className="dashboard-select-picker"
                                  data={whatsAppInteractiveNatureList}
                                  searchable={false}
                                  style={{ width: "100%" }}
                                  placeholder="Nature"
                                  value={component.nature}
                                  onChange={(newValue) =>
                                    handleNatureChange(index, newValue)
                                  }
                                  readOnly={state?.mood}
                                />
                              </Grid>
                              <Grid item md={3} sm={12} xs={12} sx={{ mt: 2 }}>
                                <Input
                                  placeholder={"URL"}
                                  size="md"
                                  onChange={(event) =>
                                    handleURLChange(index, event)
                                  }
                                  value={component.url}
                                  style={{
                                    width: "100%",
                                    border: "1px solid #a9c9e5",
                                  }}
                                  required
                                  readOnly={state?.mood}
                                />
                              </Grid>
                              
                              <Grid item md={3} sm={12} xs={12} sx={{ mt: 2 }}>
                                {index === interactiveComponents.length - 1 &&
                                interactiveComponents.length !== 2 ? (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="info"
                                    className="add-more-item-button"
                                    onClick={handleAddClick}
                                    disabled={state?.mood}
                                  >
                                    <AddIcon />
                                  </Button>
                                ) : (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="info"
                                    className="add-more-item-button"
                                    onClick={() => handleRemoveClick(index)}
                                    disabled={state?.mood}
                                  >
                                    <CloseIcon />
                                  </Button>
                                )}
                              </Grid>
                                
                            </React.Fragment>
                          ))}
                        
                        <Grid item md={12} sm={12} xs={12}>
                          <Box className="save-next">
                            {!state?.mood && (
                              <>
                                <MuiButton
                                  color="success"
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
                                variant="contained"
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

export default CreateWhatsAppTemplate;
