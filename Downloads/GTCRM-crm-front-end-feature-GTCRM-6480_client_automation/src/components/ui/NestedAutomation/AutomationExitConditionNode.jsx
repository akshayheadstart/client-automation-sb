import { Box } from "@mui/material";
import React, { useState } from "react";

import redPlusIcon from "../../../images/redPlusIcon.svg";
import redSettingsIcon from "../../../images/redSettingsIcon.svg";
import { Handle, Position, getIncomers, useReactFlow } from "reactflow";
import ExitConditionDrawer from "./Automation-Drawer/ExitConditionDrawer";
import { Dropdown } from "rsuite";
import { automationNodesType } from "../../../constants/LeadStageList";
import useAddNodesAutomation from "../../../hooks/automations/addNodesAutomation";
import useRemoveNodesAutomation from "../../../hooks/automations/useRemoveNodesAutomation";
import AutomationCrossButton from "./Button/AutomationCrossButton";
const AutomationExitConditionNode = ({ data, id: sourceId }) => {
  const addNodesInAutomationList = useAddNodesAutomation();

  const { removeTreeOfOutGoers, removeDelay } = useRemoveNodesAutomation();
  const [showCross, setShowCross] = useState(false);
  const { getEdges, getNodes, getNode } = useReactFlow();
  const nodesDetails = getNode(sourceId);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [exitConditions, setExitConditions] = useState(
    nodesDetails?.exit_condition_data
      ? nodesDetails?.exit_condition_data
      : [
          {
            id: 1,
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
          },
        ]
  );
  const incomers = getIncomers({ id: sourceId }, getNodes(), getEdges());
  return (
    <Box
      className={`automation-exit-node  automation-communication-node-background-color-red
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
          Exit
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
                    src={redPlusIcon}
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
          <Box
            onClick={() => {
              setOpenDrawer(true);
            }}
            className="communication-icon-design"
          >
            <img
              style={{ width: "100%" }}
              src={redSettingsIcon}
              alt="view-automation"
            />
          </Box>
        </Box>
      </Box>
      <ExitConditionDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        exitConditions={exitConditions}
        setExitConditions={setExitConditions}
      ></ExitConditionDrawer>
      <Handle type="source" position={Position.Bottom}></Handle>
    </Box>
  );
};

export default AutomationExitConditionNode;
