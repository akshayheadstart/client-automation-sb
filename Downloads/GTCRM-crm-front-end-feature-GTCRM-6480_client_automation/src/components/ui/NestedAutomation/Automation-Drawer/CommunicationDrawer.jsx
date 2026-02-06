import { Box, Button, FormHelperText, Drawer } from "@mui/material";
import React from "react";
import { Input, InputGroup, SelectPicker } from "rsuite";
import CloseSVG from "../../../../icons/close.svg";
import BorderLineText from "../AutomationHelperComponent/BorderLineText";
import { useNodeId, useReactFlow } from "reactflow";
import { useState } from "react";
import SelectTemplateDialog from "../../../../pages/TemplateManager/SelectTemplateDialog";
import TimeRoundIcon from "@rsuite/icons/TimeRound";
import { useSelector } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { convertToSingleCustomFormat } from "../../../../hooks/GetJsonDate";
import FilterHeaderIcon from "../../application-manager/FilterHeaderIcon";
import ResetIcon from "../../../../icons/reset-icon.svg";
const CommunicationDrawer = ({
  openDrawer,
  setOpenDrawer,

  templateId,
  setTemplateId,
  templateType,
  setTemplateType,
  emailProvider,
  setEmailProvider,
  emailType,
  setEmailType,
  templateBody,
  setTemplateBody,
  smsDltContentId,
  setSmsDltContentId,
  smsSenderId,
  setSmsSenderId,
  smsType,
  setSmsType,
}) => {
  const nestedAutomationPayload = useSelector(
    (state) => state.authentication.nestedAutomationPayload
  );
  const { setNodes } = useReactFlow();
  const nodeId = useNodeId();

  const [openSelectTemplateDialog, setOpenSelectTemplateDialog] =
    React.useState(false);
  const handleClickOpenSelectTemplate = (type) => {
    setOpenSelectTemplateDialog(true);
    setTemplateType(type);
  };
  const handleCloseSelectTemplate = () => {
    setOpenSelectTemplateDialog(false);
  };

  const [startTimeError, setStartTimeError] = useState("");

  const [panelDurationBoxClicked, setPanelDurationBoxClicked] = useState(false);
  const [executionTime, setExecutionTime] = useState();

  const updateCommunicationData = () => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node?.id === nodeId) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.communication_data = {
            ...node?.communication_data,
            communication_type: templateType,
            template_id: templateId,
            email_provider: emailProvider,
            email_type: emailType,
            execution_time: executionTime,
            template_content: templateBody,
            sms_type: smsType,
            sender_id: smsSenderId,
          };
        }

        return node;
      })
    );
    setOpenDrawer(false);
  };

  return (
    <Box>
      <Drawer
        anchor="right"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        PaperProps={{
          sx: {
            width: "542px",
          },
        }}
      >
        <Box className="automation-communication-drawer-header">
          <Box className="automation-communication-drawer-title">
            Configure Action
          </Box>
          <Box
            onClick={() => setOpenDrawer(false)}
            className="automation-drawer-close-icon"
          >
            <img src={CloseSVG} alt="settingsImage" style={{ width: "100%" }} />
          </Box>
        </Box>

        <Box className="automation-drawer-selection-box">
          <Box
            style={{ display: "flex", flexDirection: "column", height: "36px" }}
          >
            <SelectPicker
              className="communication-picker"
              placeholder="Select Communication"
              data={[
                {
                  label: "Email",
                  value: "email",
                },
                {
                  label: "SMS",
                  value: "sms",
                },
                {
                  label: "WhatsApp",
                  value: "whatsapp",
                },
              ]}
              value={templateType}
              onChange={(value) => {
                setTemplateType(value);
                setEmailProvider("");
                setEmailType("");
                setSmsSenderId("");
                setSmsType("");
                setTemplateBody("");
                setTemplateId("");
                setExecutionTime(null);
                if (value === null) {
                  setNodes((nds) =>
                    nds.map((node) => {
                      if (node?.id === nodeId) {
                        node.communication_data = null;
                      }
                      return node;
                    })
                  );
                }
              }}
            />
            {templateType?.length > 0 && (
              <BorderLineText
                text={"Select Communication"}
                width={110}
              ></BorderLineText>
            )}
          </Box>{" "}
          <Box
            style={{ display: "flex", flexDirection: "column", height: "36px" }}
          >
            <Input
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleClickOpenSelectTemplate(templateType);
                setEmailProvider("");
                setEmailType("");
                setSmsSenderId("");
                setSmsType("");
                setTemplateBody("");
                setTemplateId("");
                setExecutionTime(null);
              }}
              className="create-automation-input"
              value={`Select ${templateType || ""} template`}
              readOnly
              disabled={templateType ? false : true}
            />
          </Box>
          {templateId?.length > 0 && emailProvider?.length > 0 && (
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                height: "36px",
              }}
            >
              <Input
                style={{ cursor: "pointer" }}
                className="create-automation-input"
                value={emailProvider}
                readOnly
                disabled={templateType ? false : true}
              />

              <BorderLineText
                text={"Email Provider*"}
                width={70}
              ></BorderLineText>
            </Box>
          )}{" "}
          {templateId?.length > 0 && emailType?.length > 0 && (
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                height: "36px",
              }}
            >
              <Input
                style={{ cursor: "pointer" }}
                className="create-automation-input"
                value={emailType}
                readOnly
                disabled={templateType ? false : true}
              />

              <BorderLineText text={"Email Type*"} width={55}></BorderLineText>
            </Box>
          )}
          {templateId && smsType > 0 && (
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                height: "36px",
              }}
            >
              <Input
                style={{ cursor: "pointer" }}
                className="create-automation-input"
                value={smsType}
                readOnly
                disabled={templateType ? false : true}
              />

              <BorderLineText text={"Sms Type*"} width={50}></BorderLineText>
            </Box>
          )}
          {templateId && smsSenderId && (
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                height: "36px",
              }}
            >
              <Input
                style={{ cursor: "pointer" }}
                className="create-automation-input"
                value={smsSenderId}
                readOnly
                disabled={templateType ? false : true}
              />

              <BorderLineText text={"Sender ID*"} width={50}></BorderLineText>
            </Box>
          )}
          {templateId && (
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                height: "36px",
              }}
            >
              <Box>
                <InputGroup
                  className="create-automation-input"
                  inside
                  style={{ width: "230px" }}
                  onClick={() => {
                    if (!startTimeError) {
                      setPanelDurationBoxClicked((prev) => !prev);
                    }
                  }}
                >
                  <Input
                    className="create-automation-input"
                    placeholder="Execution time*"
                    style={{ pointerEvents: "none" }}
                    value={`${
                      executionTime
                        ? `${executionTime.split(" ")[1]} ${
                            executionTime.split(" ")[2]
                          }`
                        : ""
                    }`}
                  />
                  <InputGroup.Addon>
                    <TimeRoundIcon className="communication-release-window-icon" />
                  </InputGroup.Addon>
                </InputGroup>

                {panelDurationBoxClicked && (
                  <Box
                    className="panel-duration-time-selection-box"
                    sx={{
                      position: "relative",
                      top: "0px !important",
                      minWidth: "230px !important",
                      zIndex: 12,
                      paddingTop: "6px !important",
                      paddingBottom: "6px !important",
                    }}
                  >
                    <Box className="panel-duration-time-selection-inner-box">
                      <Box>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <MobileTimePicker
                            ampmInClock={true}
                            onError={(error) => {
                              if (error) {
                                setStartTimeError("Time is not valid");
                              } else {
                                setStartTimeError("");
                              }
                            }}
                            sx={{ width: 130 }}
                            value={executionTime ? dayjs(executionTime) : null}
                            minTime={dayjs(
                              nestedAutomationPayload?.automation_details
                                ?.releaseWindow?.start_time
                            )}
                            maxTime={dayjs(
                              nestedAutomationPayload?.automation_details
                                ?.releaseWindow?.end_time
                            )}
                            onChange={(value) => {
                              const convertDate =
                                convertToSingleCustomFormat(value);

                              setExecutionTime(
                                `${convertDate.date} ${convertDate.time}`
                              );
                            }}
                            slotProps={{ textField: { size: "small" } }}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Box>

                    <Box className="time-picker-error-box" sx={{ px: 2 }}>
                      {startTimeError && (
                        <FormHelperText
                          sx={{ color: "#ffa117" }}
                          variant="subtitle1"
                        >
                          {startTimeError}
                        </FormHelperText>
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 2,
                      }}
                    >
                      <FilterHeaderIcon
                        icon={ResetIcon}
                        action={() => {
                          setExecutionTime("");
                          setPanelDurationBoxClicked(false);
                        }}
                      />

                      <Button
                        disabled={startTimeError ? true : false}
                        size="sm"
                        variant="contained"
                        color="info"
                        onClick={() => setPanelDurationBoxClicked(false)}
                        sx={{ ml: 2 }}
                      >
                        Ok
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>

              {executionTime && (
                <BorderLineText
                  text={"Execution time"}
                  width={70}
                ></BorderLineText>
              )}
            </Box>
          )}
          {templateId && (
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                height: "36px",
              }}
            >
              <InputGroup
                className="create-automation-input"
                inside
                style={{ width: "230px" }}
                readOnly
              >
                <Input
                  className="create-automation-input"
                  placeholder="Release window*"
                  style={{ pointerEvents: "none" }}
                  value={`${
                    nestedAutomationPayload?.automation_details?.releaseWindow?.start_time?.split(
                      " "
                    )[1]
                  } ${
                    nestedAutomationPayload?.automation_details?.releaseWindow?.start_time?.split(
                      " "
                    )[2]
                  } to ${
                    nestedAutomationPayload?.automation_details?.releaseWindow?.end_time?.split(
                      " "
                    )[1]
                  } ${
                    nestedAutomationPayload?.automation_details?.releaseWindow?.end_time?.split(
                      " "
                    )[2]
                  }`}
                />
                <InputGroup.Addon>
                  <TimeRoundIcon className="communication-release-window-icon" />
                </InputGroup.Addon>
              </InputGroup>
              <BorderLineText
                text={"Communication Release window*"}
                width={150}
              ></BorderLineText>
            </Box>
          )}
          <Box
            style={{
              border: "1px solid #B3D2E2",
              borderRadius: "8px",
              width: "483px",
              height: "421px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box>
              {templateType === "email" && (
                <>
                  {templateBody && (
                    <>
                      <iframe
                        srcDoc={templateBody}
                        title="3"
                        width="470px"
                        height="410px"
                        style={{
                          border: "none",
                          borderRadius: "8px",
                          marginTop: "5px",
                        }}
                      ></iframe>
                    </>
                  )}
                </>
              )}
              {(templateType === "sms" || templateType === "whatsapp") && (
                <>
                  {templateBody && (
                    <>
                      <Box
                        dangerouslySetInnerHTML={{ __html: templateBody }}
                        style={{ width: "410px" }}
                      ></Box>
                    </>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",

            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Box className="automation-window-buttons">
            <Box
              onClick={() => setOpenDrawer(false)}
              className="automation-back-button"
            >
              Close
            </Box>
            <Box
              onClick={() => {
                if (templateType && templateId) {
                  updateCommunicationData();
                }
              }}
              style={{
                cursor: templateType && templateId ? "pointer" : "not-allowed",
              }}
              className="automation-Continue-button"
            >
              Continue
            </Box>
          </Box>
        </Box>

        {openSelectTemplateDialog && (
          <SelectTemplateDialog
            setTemplateId={setTemplateId}
            openDialoge={openSelectTemplateDialog}
            handleClose={handleCloseSelectTemplate}
            setTemplateBody={setTemplateBody}
            setSmsDltContentId={setSmsDltContentId}
            setSmsType={setSmsType}
            from={templateType}
            setSenderName={setSmsSenderId}
            setEmailType={setEmailType}
            setEmailProvider={setEmailProvider}
          ></SelectTemplateDialog>
        )}
      </Drawer>
    </Box>
  );
};

export default CommunicationDrawer;
