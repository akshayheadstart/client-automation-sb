/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

import yellowPlusIcon from "../../../images/cyanPlusIcon.svg";
import yellowSettingsIcon from "../../../images/cyanSettingsIcon.svg";
import { Handle, Position, getIncomers, useReactFlow } from "reactflow";
import { Dropdown } from "rsuite";
import useAddNodesAutomation from "../../../hooks/automations/addNodesAutomation";
import useRemoveNodesAutomation from "../../../hooks/automations/useRemoveNodesAutomation";
import { automationNodesType } from "../../../constants/LeadStageList";
import AutomationCrossButton from "./Button/AutomationCrossButton";
import {
  useGetCounselorListQuery
} from "../../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";
import { organizeCounselorFilterOption } from "../../../helperFunctions/filterHelperFunction";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";

const AutomationCounsellorAllocation = ({ id: sourceId }) => {
  const { setNodes, getNode, getNodes, getEdges } = useReactFlow();
  const nodesDetails = getNode(sourceId);
  const { handleFilterListApiCall } = useCommonApiCalls();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const incomers = getIncomers({ id: sourceId }, getNodes(), getEdges());
  const [counsellorList, setCounsellorList] = useState([]);
  const addNodesInAutomationList = useAddNodesAutomation();
  const { removeTreeOfOutGoers, removeDelay } = useRemoveNodesAutomation();
  const [showCross, setShowCross] = useState(false);

  const [showSelectField, setShowSelectField] = useState(
    nodesDetails?.allocation_counsellor_data?.length > 0 ? false : true
  );

  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId: collegeId },
    {
      skip: false,
    }
  );

  const [
    copySelectedApplicationStepsCounselor,
    setCopySelectedApplicationStepsCounselor,
  ] = useState(
    nodesDetails?.allocation_counsellor_data?.length > 0
      ? nodesDetails?.allocation_counsellor_data
      : []
  );
  const [
    selectedApplicationStepsCounselor,
    setSelectedApplicationStepsCounselor,
  ] = useState(
    nodesDetails?.allocation_counsellor_data?.length > 0
      ? nodesDetails?.allocation_counsellor_data
      : []
  );

  useEffect(() => {
    const counselorList = counselorListApiCallInfo.data?.data[0];
    handleFilterListApiCall(
      counselorList,
      counselorListApiCallInfo,
      setCounsellorList,
      "",
      organizeCounselorFilterOption
    );
  }, [counselorListApiCallInfo]);

  const setCounsellorToNodesFunction = (type) => {
    type === "clean" && setCopySelectedApplicationStepsCounselor([]);
    type === "clean"
      ? setSelectedApplicationStepsCounselor([])
      : setSelectedApplicationStepsCounselor([
          ...copySelectedApplicationStepsCounselor,
        ]);

    type === "clean" && setShowSelectField(true);
    type === "apply" &&
      copySelectedApplicationStepsCounselor?.length !== 0 &&
      setShowSelectField(false);
    setNodes((nds) =>
      nds.map((node) => {
        if (node?.id === sourceId) {
          node.allocation_counsellor_data =
            type === "clean" ? [] : [...copySelectedApplicationStepsCounselor];
        }

        return node;
      })
    );
  };

  return (
    <Box
      className={`automation-select-node ${
        selectedApplicationStepsCounselor.length > 0
          ? "automation-allocation-node-background-color-cyan"
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
          <MultipleFilterSelectPicker
            onChange={(value) => {
              setCopySelectedApplicationStepsCounselor(value);
              if (value?.length <= 0) {
                setCounsellorToNodesFunction("clean");
              }
            }}
            appearance="subtle"
            placement="auto"
            pickerData={counsellorList}
            placeholder="Select Counselor"
            pickerValue={copySelectedApplicationStepsCounselor}
            className="automation-select-picker"
            setSelectedPicker={setCopySelectedApplicationStepsCounselor}
            style={{ width: "170px", height: "35px" }}
            callAPIAgain={() => setCounsellorToNodesFunction("apply")}
            onClean={() => {
              setCounsellorToNodesFunction("clean");
            }}
          />
        </Box>
      )}
      {showSelectField || (
        <Box className="automation-communication-box-s">
          <Box className="automation-communication-node-text-style automation-communication-node-text-style-color">
            Counsellor Allocation
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
                {automationNodesType.map((value) => (
                  <Dropdown.Item eventKey={value?.value}>
                    {value?.label}
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

export default AutomationCounsellorAllocation;
