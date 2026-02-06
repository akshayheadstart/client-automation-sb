import { Box, ClickAwayListener } from "@mui/material";
import React, { useState } from "react";

import darkBluePlusIcon from "../../../images/darkBluePlusIcon.svg";
import darkBlueSettingsIcon from "../../../images/darkBlueSettingsIcon.svg";
import { Handle, Position, getIncomers, useReactFlow } from "reactflow";
import { Dropdown, Popover, SelectPicker, Whisper } from "rsuite";
import BorderLineText from "./AutomationHelperComponent/BorderLineText";
import { automationNodesType } from "../../../constants/LeadStageList";
import useAddNodesAutomation from "../../../hooks/automations/addNodesAutomation";
import useRemoveNodesAutomation from "../../../hooks/automations/useRemoveNodesAutomation";
import AutomationCrossButton from "./Button/AutomationCrossButton";
import useFetchCommonApi from "../../../hooks/useFetchCommonApi";
const AutomationStageChangesNode = ({ data, id: sourceId }) => {
  const addNodesInAutomationList = useAddNodesAutomation();
  const { removeTreeOfOutGoers, removeDelay } = useRemoveNodesAutomation();
  const [showCross, setShowCross] = useState(false);
  const { leadStageObject, setSkipCallNameAndLabelApi, loadingLabelList } =
    useFetchCommonApi();
  const { setNodes, getNode, getNodes, getEdges } = useReactFlow();
  const nodesDetails = getNode(sourceId);
  const leadStages = Object.keys(leadStageObject).map((value) => ({
    label: value,
    value: value,
  }));
  const incomers = getIncomers({ id: sourceId }, getNodes(), getEdges());

  const [selectedLeadStageData, setSelectedLeadStageData] = useState(
    nodesDetails.lead_stage_data?.lead_stage
      ? nodesDetails.lead_stage_data?.lead_stage
      : null
  );
  const leadSubStageData =
    leadStageObject[selectedLeadStageData]?.length > 0
      ? leadStageObject[selectedLeadStageData].map((value) => ({
          label: value,
          value: value,
        }))
      : null;
  const [selectedLeadSubStageData, setSelectedLeadSubStageData] = useState(
    nodesDetails.lead_stage_data?.lead_stage_label
      ? nodesDetails.lead_stage_data?.lead_stage_label
      : null
  );

  const triggerRef = React.useRef();
  const open = () => triggerRef.current.open();
  const close = () => triggerRef.current.close();
  return (
    <Box
      className={`${
        selectedLeadStageData
          ? "automation-stage-node-after-select"
          : "automation-stage-node-before-select"
      } ${
        selectedLeadStageData
          ? "automation-lead-stage-node-background-color-dark-blue"
          : "automation-tag-node-background-color-blue"
      }
          `}
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
          {selectedLeadStageData ? "Lead Stage" : "Change Lead Stage"}
        </Box>
        <Box className="automation-right-align-icon-box-s">
          <Box className="communication-icon-design">
            <Dropdown
              disabled={
                incomers[0].delay_data?.delay_type !== "recurring"
                  ? false
                  : true
              }
              onSelect={(nodeType) =>
                addNodesInAutomationList(nodeType, sourceId)
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
                        incomers[0].delay_data?.delay_type !== "recurring"
                          ? "pointer"
                          : "not-allowed",
                    }}
                    src={darkBluePlusIcon}
                    alt="view-automation"
                  />
                );
              }}
            >
              {automationNodesType
                .filter((node) => node.value !== "ifElseNode")
                .map((value) => (
                  <Dropdown.Item eventKey={value.value} key={value.value}>
                    {value.label}
                  </Dropdown.Item>
                ))}
            </Dropdown>
          </Box>
          <Whisper
            placement="auto"
            ref={triggerRef}
            trigger="none"
            speaker={
              <Popover
                className={
                  selectedLeadStageData
                    ? "stage-popover-selected"
                    : "stage-popover"
                }
                arrow={false}
              >
                <ClickAwayListener onClickAway={() => close()}>
                  <Box className="automation-lead-stage-select-box-s">
                    <Box
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "36px",
                      }}
                    >
                      <SelectPicker
                        onOpen={() => setSkipCallNameAndLabelApi(false)}
                        loading={loadingLabelList}
                        className="stage-picker"
                        placeholder="Lead Stage"
                        data={leadStages}
                        value={selectedLeadStageData}
                        onChange={(value) => {
                          setSelectedLeadStageData(value);
                          setNodes((nds) =>
                            nds.map((node) => {
                              if (node?.id === sourceId) {
                                node.lead_stage_data = {
                                  lead_stage: value,
                                  lead_stage_label: "",
                                };
                              }

                              return node;
                            })
                          );
                          if (value === null) {
                            setSelectedLeadSubStageData(null);
                          }
                        }}
                        placement="bottomEnd"
                      />
                      {selectedLeadStageData && (
                        <BorderLineText
                          text={"Lead Stage"}
                          width={55}
                        ></BorderLineText>
                      )}
                    </Box>
                    {leadSubStageData && (
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          height: "36px",
                          marginTop: "10px",
                        }}
                      >
                        <SelectPicker
                          className="stage-picker"
                          placeholder="Sub Stage"
                          data={leadSubStageData}
                          value={selectedLeadSubStageData}
                          onChange={(value) => {
                            setSelectedLeadSubStageData(value);
                            setNodes((nds) =>
                              nds.map((node) => {
                                if (node?.id === sourceId) {
                                  node.lead_stage_data = {
                                    ...node.lead_stage_data,
                                    lead_stage_label: value,
                                  };
                                }

                                return node;
                              })
                            );
                          }}
                          placement="bottomEnd"
                        />
                        {selectedLeadSubStageData && (
                          <BorderLineText
                            text={"Sub Stage"}
                            width={50}
                          ></BorderLineText>
                        )}
                      </Box>
                    )}
                  </Box>
                </ClickAwayListener>
              </Popover>
            }
          >
            <Box
              onClick={() => {
                open();
              }}
              className="communication-icon-design"
            >
              <img
                style={{ width: "100%" }}
                src={darkBlueSettingsIcon}
                alt="view-automation"
              />
            </Box>
          </Whisper>
        </Box>
      </Box>

      <Handle type="source" position={Position.Bottom}></Handle>
    </Box>
  );
};

export default AutomationStageChangesNode;
