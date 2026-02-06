import { Box, Button, Card, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useContext } from "react";
import Masonry from "react-masonry-css";

import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import { AddRounded } from "@mui/icons-material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useNavigate } from "react-router-dom";
import useBreakPointsEmailTemplates from "../../../hooks/breakPointsEmailTemplates";
import IframeManage from "./IframeManage";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { toTitleCase } from "../../../helperFunctions/makeStringTitleCase";
import "../../../styles/EmailTemplateBuilder.css";
import CheckIcon from "@mui/icons-material/Check";
import { useSelector } from "react-redux";

const Masonaries = ({
  loading,
  allTemplate,
  mailComponent,
  setMessageBody,
  setTemplateBody,
  handleClose,
  internalServerError,
  hideTemplates,
  somethingWentWrong,
  handleOpenDeleteModal,
  createTemplatesTutorial,
  from,
  handleClickOpenDialogsSms,
  setSmsType,
  setSenderName,
  setSmsDltContentId,
  setSubjectOfEmail,
  setTemplateId,
  tabsValue,
  handleTemplateActivation,
  setEmailType,
  setEmailProvider,
}) => {
  const { apiResponseChangeMessage, setWhatsappTemplateObjectId } =
    useContext(DashboradDataContext);
  const navigate = useNavigate();
  const breakpointColumnsObj = useBreakPointsEmailTemplates(
    allTemplate?.length
  );
  // const permissions = useSelector((state) => state.authentication.permissions);
  return (
    <>
      {internalServerError || somethingWentWrong ? (
        <Box sx={{ mt: 4 }}>
          {internalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box sx={{ visibility: hideTemplates ? "hidden" : "visible" }}>
          {loading ? (
            <Card
              sx={{
                width: "100%",
                minHeight: "62vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {" "}
              <LeefLottieAnimationLoader
                height={100}
                width={150}
              ></LeefLottieAnimationLoader>{" "}
            </Card>
          ) : allTemplate.length > 0 ? (
            <Box className="layout-mian-content">
              <Box className="create-layout-main">
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  <Box
                    id="create-from-scratch"
                    onClick={() => {
                      from === "email"
                        ? navigate("/email-template")
                        : from === "sms"
                        ? navigate("/sms-template")
                        : from === "whatsapp" && navigate("/whatsapp-template");
                    }}
                    className={`create-layout ${
                      createTemplatesTutorial
                        ? "search-by-tag-tutorial-selector"
                        : ""
                    }`}
                  >
                    <Box className="layout_content">
                      <AddRounded />
                      <Typography
                        variant="h6"
                        component="h4"
                        className="create-txt"
                      >
                        Create from scratch
                      </Typography>
                    </Box>
                  </Box>
                  {allTemplate.map((template, index) => (
                    <div data-testid="massonaries-per-div" key={index}>
                      <Box className="email-template-layout container">
                        <Box className="template-iframe ">
                          <IframeManage
                            index={index}
                            template={template}
                          ></IframeManage>
                        </Box>
                        <Box id="templates-top-mail-icon">
                          <MailOutlineIcon id="templates-top-icon" />
                        </Box>

                        {tabsValue > 2 && template?.active && (
                          <Box id="templates-top-check-icon">
                            <CheckIcon id="templates-top-icon" />
                          </Box>
                        )}

                        <Box className="template-editable-main middle">
                          <Typography
                            fontWeight={"bold"}
                            align="center"
                            className="temp_title"
                          >
                            {toTitleCase(template?.template_name)}
                          </Typography>
                          {/* {permissions?.menus?.template_manager
                            ?.manage_communication_template?.menu && ( */}
                          <Button
                            onClick={() => {
                              from === "email"
                                ? navigate("/email-template", {
                                    state: {
                                      dataJson: template?.template_json,
                                      addedTags: template?.added_tags,
                                      individualTemplateName:
                                        template?.template_name,
                                      subject: template?.subject,
                                      email_type: template?.email_type,
                                      email_provider: template?.email_provider,
                                      email_category: template?.email_category,
                                      select_members:
                                        template?.selected_members,
                                      select_profile_role:
                                        template?.select_profile_role,
                                      sender_email_id:
                                        template?.sender_email_id,
                                      reply_to_email: template?.reply_to_email,
                                      attachment_document_link:
                                        template?.attachment_document_link,
                                    },
                                  })
                                : from === "sms"
                                ? navigate("/sms-template", {
                                    state: {
                                      content: template?.content,
                                      addedTags: template?.added_tags,
                                      individualTemplateName:
                                        template?.template_name,
                                      dltContentId: template?.dlt_content_id,
                                      smsType: template?.sms_type,
                                      senderName: template?.sender,
                                      smsCategory: template?.sms_category,
                                      select_members:
                                        template?.selected_members,
                                      select_profile_role:
                                        template?.select_profile_role,
                                    },
                                  })
                                : from === "whatsapp" &&
                                  navigate("/whatsapp-template", {
                                    state: {
                                      content: template?.content,
                                      addedTags: template?.added_tags,
                                      individualTemplateName:
                                        template?.template_name,
                                      select_members:
                                        template?.selected_members,
                                      select_profile_role:
                                        template?.select_profile_role,
                                      add_template_option_url:
                                        template?.add_template_option_url,
                                      attachmentType: template?.attachment_type,
                                      attachmentURL: template?.attachment_url,
                                      template_type_option:
                                        template?.template_type_option,
                                    },
                                  });
                              Cookies.set("templateId", template?.template_id);
                            }}
                            id="template-button"
                            sx={{ mt: 1, width: "200px" }}
                            variant="contained"
                            size="sm"
                            color="info"
                          >
                            Use in Editor
                          </Button>
                          {/* )} */}

                          {mailComponent && (
                            <Button
                              onClick={() => {
                                from === "email" &&
                                  setSubjectOfEmail &&
                                  setSubjectOfEmail(template?.subject);
                                setMessageBody &&
                                  setMessageBody(template?.content);
                                setTemplateBody(template?.content);

                                handleClose();

                                if (from === "email") {
                                  setEmailType &&
                                    setEmailType(template?.email_type);
                                  setEmailProvider &&
                                    setEmailProvider(template?.email_provider);
                                  setTemplateId &&
                                    setTemplateId(template?.template_id);
                                }

                                from === "sms" &&
                                  handleClickOpenDialogsSms &&
                                  handleClickOpenDialogsSms();
                                setSmsDltContentId &&
                                  setSmsDltContentId(template?.dlt_content_id);
                                setTemplateId &&
                                  setTemplateId(
                                    from === "whatsapp"
                                      ? template?.whatsapp_template_id
                                      : template?.template_id
                                  );
                                setSmsType && setSmsType(template?.sms_type);
                                setSenderName &&
                                  setSenderName(template?.sender);
                                if (from === "whatsapp") {
                                  setWhatsappTemplateObjectId(
                                    template?.template_id
                                  );
                                }
                              }}
                              id="template-button"
                              sx={{ mt: 1, width: "200px" }}
                              variant="contained"
                              size="sm"
                              color="info"
                            >
                              Select Template
                            </Button>
                          )}
                          {!mailComponent && (
                            <Button
                              onClick={() => {
                                handleOpenDeleteModal(template?.template_id);
                              }}
                              id="template-button"
                              sx={{ mt: 1, width: "200px" }}
                              color="error"
                              variant="contained"
                              size="sm"
                            >
                              Delete Template
                            </Button>
                          )}

                          {tabsValue > 2 && !template?.active && (
                            <Button
                              onClick={() => {
                                handleTemplateActivation(template?.template_id);
                              }}
                              id="template-button"
                              sx={{ mt: 1, width: "200px" }}
                              color="success"
                              variant="contained"
                              size="sm"
                            >
                              Active
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </div>
                  ))}
                </Masonry>
              </Box>
            </Box>
          ) : (
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: "54vh",
                alignItems: "center",
              }}
            >
              <BaseNotFoundLottieLoader
                height={250}
                width={250}
              ></BaseNotFoundLottieLoader>
              {/* {permissions?.menus?.template_manager
                ?.manage_communication_template?.menu && ( */}
              <Button
                className={`${
                  createTemplatesTutorial
                    ? "search-by-tag-tutorial-selector"
                    : ""
                }`}
                onClick={() => {
                  from === "email"
                    ? navigate("/email-template")
                    : from === "sms"
                    ? navigate("/sms-template")
                    : from === "whatsapp" && navigate("/whatsapp-template");
                }}
                id="template-button"
                sx={{ width: "200px" }}
                variant="contained"
                size="sm"
              >
                Create{" "}
                {from === "email"
                  ? "Email"
                  : from === "sms"
                  ? "Sms"
                  : from === "whatsapp" && "Whatsapp"}{" "}
                Layout
              </Button>
              {/* )} */}
            </Card>
          )}
        </Box>
      )}
    </>
  );
};

export default Masonaries;
