import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

import yellowPlusIcon from "../../../images/yellowPlusIcon.svg";
import yellowSettingsIcon from "../../../images/yellowSettingsIcons.svg";
import { Handle, Position, getIncomers, useReactFlow } from "reactflow";
import { Dropdown, SelectPicker } from "rsuite";
import useAddNodesAutomation from "../../../hooks/automations/addNodesAutomation";
import useRemoveNodesAutomation from "../../../hooks/automations/useRemoveNodesAutomation";
import { automationNodesType } from "../../../constants/LeadStageList";
import AutomationCrossButton from "./Button/AutomationCrossButton";
import { useGetTagListsQuery } from "../../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
const AutomationTagNode = ({ id: sourceId }) => {
  const { setNodes, getNodes, getEdges, getNode } = useReactFlow();
  const nodesDetails = getNode(sourceId);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { data, isError, error, isSuccess } = useGetTagListsQuery(
    { collegeId },
    { skip: false }
  );
  const [tagList, setTagList] = useState([]);

  const addNodesInAutomationList = useAddNodesAutomation();
  const { removeTreeOfOutGoers, removeDelay } = useRemoveNodesAutomation();
  const [showCross, setShowCross] = useState(false);

  const [tagData, setTagData] = useState(
    nodesDetails.tag_data ? nodesDetails.tag_data : null
  );
  const [showSelectField, setShowSelectField] = useState(
    tagData ? false : true
  );
  const incomers = getIncomers({ id: sourceId }, getNodes(), getEdges());

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          const convertTo = data?.data.map((data) => ({
            label: data,
            value: data,
          }));
          setTagList(convertTo);
        } else {
          throw new Error("Tag list API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
        }
        if (error.status === 500) {
        }
      }
    } catch (error) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error, data]);
  return (
    <Box
      className={`automation-tag-node ${
        tagData
          ? "automation-tag-node-background-color-yellow"
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
      {showSelectField && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <SelectPicker
            className="tag-picker"
            placeholder="Select Tag"
            appearance="subtle"
            data={tagList}
            value={tagData}
            onChange={(value) => {
              setTagData(value);

              setNodes((nds) =>
                nds.map((node) => {
                  if (node?.id === sourceId) {
                    node.tag_data = value;
                  }

                  return node;
                })
              );
              if (value) {
                setShowSelectField(false);
              }
            }}
          />
        </Box>
      )}
      {tagData && !showSelectField && (
        <Box className="automation-communication-box-s">
          <Box className="automation-communication-node-text-style automation-communication-node-text-style-color">
            {tagData}
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
                      src={yellowPlusIcon}
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
                setShowSelectField(true);
                setNodes((nds) =>
                  nds.map((node) => {
                    if (node?.id === sourceId) {
                      node.tag_data = null;
                    }

                    return node;
                  })
                );
                setTagData(null);
              }}
              className="communication-icon-design"
            >
              <img
                style={{ width: "100%" }}
                src={yellowSettingsIcon}
                alt="view-automation"
              />
            </Box>
          </Box>
        </Box>
      )}

      <Handle type="source" position={Position.Bottom}></Handle>
    </Box>
  );
};

export default AutomationTagNode;
