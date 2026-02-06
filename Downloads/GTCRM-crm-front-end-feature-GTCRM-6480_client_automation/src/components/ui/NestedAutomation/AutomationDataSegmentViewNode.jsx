import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { Dropdown } from "rsuite";
import "../../../styles/automationTreeDesign.css";
import viewImage from "../../../images/viewIcon.svg";
import plusIcon from "../../../images/plusIcon.svg";
import { automationNodesType } from "../../../constants/LeadStageList";
import useAddNodesAutomation from "../../../hooks/automations/addNodesAutomation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setOpenDataSegmentDialog } from "../../../Redux/Slices/authSlice";
import CreateDataSegmentDrawer from "../DataSegmentManager/CreateDataSegmentDrawer";

const AutomationDataSegmentViewNode = ({ data, id: sourceId }) => {
  const nestedAutomationPayload = useSelector(
    (state) => state.authentication.nestedAutomationPayload
  );
  const addNodesInAutomationList = useAddNodesAutomation();
  const dispatch = useDispatch();

  const [openCreateDataSegmentDrawer, setOpenCreateDataSegmentDrawer] =
    useState(false);
  const [selectedDataSegment, setSelectedDataSegment] = useState(null);

  return (
    <Box className="automation-tree-first-node-box">
      <Box className="automation-tree-first-node-data-segment-icon-box">
        <Box>
          {nestedAutomationPayload?.automation_details?.data_segment?.length >
          0 ? (
            <Dropdown
              id="data-segment-box"
              appearance="subtle"
              title="Data Segment Name"
            >
              {nestedAutomationPayload?.automation_details?.data_segment?.map(
                (data, index) => (
                  <Dropdown.Item
                    onClick={() => {
                      setOpenCreateDataSegmentDrawer(true);
                      setSelectedDataSegment(data);
                    }}
                    key={index}
                  >
                    {data?.data_segment_name}
                  </Dropdown.Item>
                )
              )}
            </Dropdown>
          ) : (
            <Typography
              sx={{ fontWeight: "bold", mb: 0.8 }}
              id="automation-tree-first-node-box-date"
            >
              Selected Filters
            </Typography>
          )}

          <Typography id="automation-tree-first-node-box-date">
            {`${nestedAutomationPayload?.automation_details?.date?.start_date} to ${nestedAutomationPayload?.automation_details?.date?.end_date}`}
          </Typography>
        </Box>

        <Box id="data-segment-icons-box">
          <Box
            onClick={() => dispatch(setOpenDataSegmentDialog(true))}
            id="communication-icon-design"
          >
            <img
              style={{ width: "100%", cursor: "pointer" }}
              src={viewImage}
              alt="view-automation"
            />
          </Box>
          <Box id="communication-icon-design">
            <Dropdown
              onSelect={(nodeType) =>
                addNodesInAutomationList(nodeType, sourceId)
              }
              renderToggle={(props, ref) => {
                return (
                  <img
                    {...props}
                    ref={ref}
                    style={{ width: "100%" }}
                    src={plusIcon}
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
        </Box>
      </Box>
      <Handle type="source" position={Position.Bottom} />

      {openCreateDataSegmentDrawer && (
        <CreateDataSegmentDrawer
          openCreateDataSegmentDrawer={openCreateDataSegmentDrawer}
          setOpenCreateDataSegmentDrawer={setOpenCreateDataSegmentDrawer}
          from="automation"
          selectedDataSegment={selectedDataSegment}
        />
      )}
    </Box>
  );
};

export default AutomationDataSegmentViewNode;
