import { Box } from "@mui/material";
import React, { useState } from "react";

import redPlusIcon from "../../../images/redPlusIcon.svg";
import bluePlusIcon from "../../../images/bluePlusIcon.svg";
import redSettingsIcon from "../../../images/redSettingsIcon.svg";
import blueSettingsIcon from "../../../images/blueSettingsIcon.svg";
import {
  Handle,
  Position,
  getIncomers,
  useNodeId,
  useReactFlow,
} from "reactflow";
import CommunicationDrawer from "./Automation-Drawer/CommunicationDrawer";
import { Dropdown } from "rsuite";
import { automationNodesType } from "../../../constants/LeadStageList";
import AutomationCrossButton from "./Button/AutomationCrossButton";
import useAddNodesAutomation from "../../../hooks/automations/addNodesAutomation";
import useRemoveNodesAutomation from "../../../hooks/automations/useRemoveNodesAutomation";
const AutomationCommunication = ({ id: sourceId }) => {
  const { getNodes, getNode, getEdges } = useReactFlow();
  const nodeId = useNodeId();
  const nodesDetails = getNode(nodeId);

  const [templateId, setTemplateId] = useState(
    nodesDetails?.communication_data?.template_id
  );
  const [templateType, setTemplateType] = useState(
    nodesDetails?.communication_data?.communication_type
  );

  const [emailProvider, setEmailProvider] = useState(
    nodesDetails?.communication_data?.email_provider
  );
  const [emailType, setEmailType] = useState(
    nodesDetails?.communication_data?.email_type
  );

  const [templateBody, setTemplateBody] = useState(
    nodesDetails?.communication_data?.template_content
  );
  const [smsDltContentId, setSmsDltContentId] = useState(
    nodesDetails?.communication_data?.sms_dlt_content_id
  );
  const [smsSenderId, setSmsSenderId] = useState(
    nodesDetails?.communication_data?.sender_id
  );
  const [smsType, setSmsType] = useState(
    nodesDetails?.communication_data?.sms_type
  );

  const addNodesInAutomationList = useAddNodesAutomation();
  const { removeTreeOfOutGoers, removeDelay } = useRemoveNodesAutomation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showCross, setShowCross] = useState(false);
  const incomers = getIncomers({ id: sourceId }, getNodes(), getEdges());

  return (
    <Box
      className={`automation-communication-node ${
        templateType
          ? "automation-communication-node-background-color-blue"
          : "automation-communication-node-background-color-red"
      } `}
      onMouseEnter={() => {
        setShowCross(true);
      }}
      onMouseLeave={() => {
        setShowCross(false);
      }}
    >
      <Handle type="target" position={Position.Top}></Handle>

      {showCross && incomers[0]?.type !== "ifElseNode" && (
        <AutomationCrossButton
          triggeredFunction={() => {
            removeTreeOfOutGoers(sourceId);
            removeDelay(sourceId);
          }}
        ></AutomationCrossButton>
      )}

      <Box className="automation-communication-box-s">
        <Box className="automation-communication-node-text-style automation-communication-node-text-style-color">
          {templateType ? templateType : "Communication"}
        </Box>
        <Box className="automation-right-align-icon-box-s">
          <Box className="communication-icon-design">
            <Dropdown
              onSelect={(nodeType) =>
                addNodesInAutomationList(nodeType, sourceId)
              }
              disabled={
                templateId && incomers[0].delay_data?.delay_type !== "recurring"
                  ? false
                  : true
              }
              renderToggle={(props, ref) => {
                return (
                  <img
                    {...props}
                    ref={ref}
                    style={{
                      width: "100%",
                      marginTop: "-5px",
                      marginRight: "1px",
                      cursor:
                        templateId &&
                        incomers[0].delay_data?.delay_type !== "recurring"
                          ? "pointer"
                          : "not-allowed",
                    }}
                    src={templateType ? bluePlusIcon : redPlusIcon}
                    alt="view-automation"
                  />
                );
              }}
            >
              {automationNodesType.map((value) => (
                <Dropdown.Item eventKey={value?.value}>
                  {value?.label}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </Box>
          <Box
            onClick={() => {
              setOpenDrawer(true);
            }}
            className="communication-icon-design"
          >
            <img
              style={{ width: "100%" }}
              src={templateType ? blueSettingsIcon : redSettingsIcon}
              alt="view-automation"
            />
          </Box>
        </Box>
      </Box>
      <CommunicationDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        templateId={templateId}
        setTemplateId={setTemplateId}
        templateType={templateType}
        setTemplateType={setTemplateType}
        emailProvider={emailProvider}
        setEmailProvider={setEmailProvider}
        emailType={emailType}
        setEmailType={setEmailType}
        templateBody={templateBody}
        setTemplateBody={setTemplateBody}
        smsDltContentId={smsDltContentId}
        setSmsDltContentId={setSmsDltContentId}
        smsSenderId={smsSenderId}
        setSmsSenderId={setSmsSenderId}
        smsType={smsType}
        setSmsType={setSmsType}
      ></CommunicationDrawer>
      <Handle type="source" position={Position.Bottom}></Handle>
    </Box>
  );
};

export default AutomationCommunication;
