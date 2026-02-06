import { Box } from "@mui/material";
import React, { useState } from "react";

import bluePlusIcon from "../../../images/bluePlusIcon.svg";
import blueSettingsIcon from "../../../images/blueSettingsIcon.svg";
import { Handle, Position, useNodeId, useReactFlow } from "reactflow";
import IfElseDrawer from "./Automation-Drawer/IfElseDrawer";
import { Dropdown } from "rsuite";
import { automationNodesType } from "../../../constants/LeadStageList";
import useAddNodesAutomation from "../../../hooks/automations/addNodesAutomation";
import useRemoveNodesAutomation from "../../../hooks/automations/useRemoveNodesAutomation";
import AutomationCrossButton from "./Button/AutomationCrossButton";
const AutomationIfElseNode = ({
  data,
  id: sourceId,
  type: currentNodeType,
}) => {
  const addNodesInAutomationList = useAddNodesAutomation();
  const { removeTreeOfOutGoers, removeDelay } = useRemoveNodesAutomation();
  const { setNodes, setEdges, getNode } = useReactFlow();
  const nodeId = useNodeId();
  const nodesDetails = getNode(nodeId);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [showCross, setShowCross] = useState(false);
  const [ifElseData, setIfElseData] = useState(
    nodesDetails?.if_else_data
      ? nodesDetails?.if_else_data
      : [
          {
            id: 1,
            blockCondition: "If",
            filterOptions: [
              {
                fieldName: "",
                operator: "",
                value: "",
                operators: "",
                selectOption: "",
                fieldType: "select",
              },
            ],
            next_action: "",
          },
          {
            id: 2,
            blockCondition: "Else",
            next_action: "",
          },
        ]
  );

  const addConditionalNodesFromElseIf = (data) => {
    addNodesInAutomationList(
      data,
      sourceId,
      currentNodeType,
      setNodes,
      setEdges
    );
  };
  return (
    <Box
      className={`automation-if-else-node  automation-communication-node-background-color-blue
          `}
      onMouseEnter={() => {
        setShowCross(true);
      }}
      onMouseLeave={() => {
        setShowCross(false);
      }}
    >
      <Handle type="target" position={Position.Top}></Handle>
      {showCross && (
        <AutomationCrossButton
          triggeredFunction={() => {
            removeTreeOfOutGoers(sourceId);
            removeDelay(sourceId);
          }}
        ></AutomationCrossButton>
      )}
      <Box className="automation-communication-box-s">
        <Box className="automation-communication-node-text-style automation-communication-node-text-style-color">
          If/Else
        </Box>
        <Box className="automation-right-align-icon-box-s">
          <Box className="communication-icon-design">
            <Dropdown
              disabled={true}
              onSelect={(nodeType) =>
                addNodesInAutomationList(
                  nodeType,
                  sourceId,
                  setNodes,
                  setEdges,
                  currentNodeType
                )
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
                      cursor: "not-allowed",
                    }}
                    src={bluePlusIcon}
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
              src={blueSettingsIcon}
              alt="view-automation"
            />
          </Box>
        </Box>
      </Box>
      <IfElseDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        ifElseData={ifElseData}
        setIfElseData={setIfElseData}
        addConditionalNodesFromElseIf={addConditionalNodesFromElseIf}
      ></IfElseDrawer>
      <Handle type="source" position={Position.Bottom}></Handle>
    </Box>
  );
};

export default AutomationIfElseNode;
