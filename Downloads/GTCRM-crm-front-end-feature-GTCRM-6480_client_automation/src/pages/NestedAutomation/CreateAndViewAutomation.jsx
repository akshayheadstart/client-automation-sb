/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Dialog, DialogContent, Grid, Typography } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Panel,
  MarkerType,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import TimeRoundIcon from "@rsuite/icons/TimeRound";
import AutomationDataSegmentViewNode from "../../components/ui/NestedAutomation/AutomationDataSegmentViewNode";
import "../../styles/automationTreeDesign.css";
import AutomationDelayNode from "../../components/ui/NestedAutomation/AutomationDelayNode";
import AutomationCommunication from "../../components/ui/NestedAutomation/AutomationCommunication";
import AutomationIfElseNode from "../../components/ui/NestedAutomation/AutomationIfElseNode";
import AutomationTagNode from "../../components/ui/NestedAutomation/AutomationTagNode";
import AutomationStageChangesNode from "../../components/ui/NestedAutomation/AutomationStageChangesNode";
import AutomationExitConditionNode from "../../components/ui/NestedAutomation/AutomationExitConditionNode";

import useLayout from "../../hooks/automations/useLayOutD3";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setAutomationType,
  setAutomationValue,
  setNestedAutomationInitialPayload,
  setOpenDataSegmentDialog,
  updateLastNodeValue,
} from "../../Redux/Slices/authSlice";
import { useSelector } from "react-redux";
import CloseSVG from "../../icons/close.svg";
import BorderLineText from "../../components/ui/NestedAutomation/AutomationHelperComponent/BorderLineText";
import { DateRangePicker, Dropdown, Input, InputGroup } from "rsuite";
import AutomationCreationTimer from "../../components/ui/NestedAutomation/AutomationCreationTimer";
import CheckBoxGroupWeeks from "../../components/ui/NestedAutomation/AutomationHelperComponent/CheckBoxGroup";
import CreateDataSegmentDrawer from "../../components/ui/DataSegmentManager/CreateDataSegmentDrawer";
import AutomationCounsellorAllocation from "../../components/ui/NestedAutomation/AutomationCounsellorAllocation";
import { useAddAutomationDataMutation } from "../../Redux/Slices/applicationDataApiSlice";
import useToasterHook from "../../hooks/useToasterHook";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import {
  validateAllocationNode,
  validateCommunicationNode,
  validateDelayNode,
  validateExitNode,
  validateIfElseNode,
  validateLeadStageNode,
  validateTagNode,
} from "../../helperFunctions/Automations/nodesValidations";

const proOptions = { account: "paid-pro", hideAttribution: true };

const nodeTypes = {
  dataSegmentNode: AutomationDataSegmentViewNode,
  delayNode: AutomationDelayNode,
  communicationNode: AutomationCommunication,
  ifElseNode: AutomationIfElseNode,
  tagNode: AutomationTagNode,
  leadStageNode: AutomationStageChangesNode,
  exitNode: AutomationExitConditionNode,
  allocationNode: AutomationCounsellorAllocation,
};

const CreateAndViewAutomation = () => {
  // this hook handles the computation of the layout once the elements or the direction changes
  // const { fitView } = useReactFlow();
  // useAutoLayout({ direction: "TB" });
  const pushNotification = useToasterHook();
  const [addAutomationData] = useAddAutomationDataMutation();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const lastNodeId = useSelector(
    (state) => state.authentication.lastNodesValue
  );

  const [openCreateDataSegmentDrawer, setOpenCreateDataSegmentDrawer] =
    useState(false);
  const [selectedDataSegment, setSelectedDataSegment] = useState(null);

  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();

  const openDataSegmentDialog = useSelector(
    (state) => state.authentication.openDataSegmentDialog
  );

  if (state === null) {
    navigate(-1);
  }
  useLayout();

  const edgeOptions = {
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed },
    pathOptions: { offset: 5 },
  };
  const { setNodes, getNodes, getEdges } = useReactFlow();
  const [nodesArray, setNodesArray] = useState(
    state?.automationPayload?.automation_node_edge_details?.nodes
  );
  const [edgesArray, setEdgesArray] = useState(
    state?.automationPayload?.automation_node_edge_details?.edges
  );
  const [loading, setLoading] = useState(false);
  const [clickedStartAutomation, setClickedStartAutomation] = useState(false);
  const [actionCount, setActionCount] = useState({
    email: 0,
    whatsapp: 0,
    sms: 0,
  });

  useEffect(() => {
    dispatch(setAutomationValue(state?.automationPayload));
    dispatch(setAutomationType(state?.template));

    if (
      state?.automationPayload?.automation_node_edge_details?.lastNodesCount
    ) {
      if (
        lastNodeId <
        state?.automationPayload?.automation_node_edge_details?.lastNodesCount
      ) {
        dispatch(
          updateLastNodeValue(
            state?.automationPayload?.automation_node_edge_details
              ?.lastNodesCount
          )
        );
      }
    }
  }, []);

  const onNodesChange = useCallback(
    (changes) => setNodesArray((nds) => applyNodeChanges(changes, nds)),
    [setNodesArray]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdgesArray((eds) => applyEdgeChanges(changes, eds)),
    [setEdgesArray]
  );

  const onConnect = useCallback(
    (params) => setEdgesArray((eds) => addEdge(params, eds)),
    []
  );
  // every time our nodes change, we want to center the graph again
  // useEffect(() => {
  //   fitView({ duration: 400 });
  // }, [nodes, fitView]);

  const updatedReleaseWIndowShowcase =
    state?.automationPayload?.automation_details?.days?.map((data) =>
      data?.includes("TH") ? data?.slice(0, 2) : data?.slice(0, 1)
    );

  const callAutomationPAyload = (status) => {
    if (collegeId) {
      setLoading(true);
      addAutomationData({
        collegeId,
        payload: {
          automation_details: state?.automationPayload?.automation_details,
          automation_node_edge_details: {
            nodes: getNodes(),
            edges: getEdges(),
            lastNodesCount: lastNodeId,
          },
          template: state?.template,
          automation_status: status,
        },
      })
        .unwrap()
        .then((data) => {
          try {
            if (data.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (data.detail) {
              pushNotification("error", data.detail);
            } else if (data?.message) {
              pushNotification("success", data?.message);
              navigate("/automation-manager");
              dispatch(setNestedAutomationInitialPayload({}));
            }
          } catch (error) {
            pushNotification("error", "Something Went Wrong");
          }
        })
        .catch((error) => {
          pushNotification("error", "Something Went Wrong");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const getCommunicationTypeCount = (array) => {
    return array.reduce((countMap, item) => {
      if (item?.type === "communicationNode" && item?.communication_data) {
        const communicationType = item.communication_data?.communication_type;
        countMap[communicationType] = (countMap[communicationType] || 0) + 1;
      }
      return countMap;
    }, {});
  };

  function validateNodes(nodes) {
    if (nodes.length === 1) {
      return { error: true, errorText: "Nodes should be greater than one" };
    }

    const currNodes = nodes.map((node) => {
      let width, height;
      if (node.type === "dataSegmentNode") {
        width = 308;
        height = 90;
      } else if (node.type === "delayNode") {
        width = 58;
        height = 20;
      } else {
        width = 125;
        height = 41;
      }
      return {
        ...node,
        width: width,
        height: height,
      };
    });

    setNodes(currNodes);

    for (const node of nodes) {
      if (node.type === "delayNode") {
        const DelayValue = validateDelayNode({ node });
        if (DelayValue) {
          return {
            error: true,
            errorText: "Delay Information is required for delayNode",
          };
        }
      } else if (node.type === "communicationNode") {
        const communicationValue = validateCommunicationNode({ node });
        if (communicationValue) {
          return {
            error: true,
            errorText:
              "Communication Type and template are required for Communication Node",
          };
        }
      } else if (node.type === "ifElseNode") {
        const communicationIfElseNode = validateIfElseNode({ node });
        if (communicationIfElseNode) {
          return {
            error: true,
            errorText: "If else conditions are required for if/Else Node",
          };
        }
      } else if (node.type === "tagNode") {
        const tagData = validateTagNode({ node });
        if (tagData) {
          return {
            error: true,
            errorText: "Tag Value is required for Tag Node",
          };
        }
      } else if (node.type === "leadStageNode") {
        const LeadStage = validateLeadStageNode({ node });
        if (LeadStage) {
          return {
            error: true,
            errorText:
              "Lead stage and lead stage label are required for Lead Stage Node",
          };
        }
      } else if (node.type === "exitNode") {
        const exitConditions = validateExitNode({ node });
        if (exitConditions) {
          return {
            error: true,
            errorText: "Exit Condition is required for Exit Condition Node",
          };
        }
      } else if (node.type === "allocationNode") {
        const allocations = validateAllocationNode({ node });
        if (allocations) {
          return {
            error: true,
            errorText: "Counsellor List is required for Allocation Node",
          };
        }
      }
    }

    return {
      error: false,
    };
  }

  return (
    <Box
      sx={{
        marginTop: "70px",
        boxShadow: "0px 10px 60px 0px rgba(226, 236, 249, 0.50)",
      }}
      id="automation-create-home-page"
    >
      <Box
        sx={{
          height: "86vh",
          paddingInline: "30px",
        }}
      >
        <div style={{ height: "100%" }}>
          <ReactFlow
            nodes={nodesArray}
            onNodesChange={onNodesChange}
            edges={edgesArray}
            onEdgesChange={onEdgesChange}
            defaultEdgeOptions={edgeOptions}
            onConnect={onConnect}
            fitView
            nodesDraggable={false}
            zoomOnDoubleClick={false}
            nodeTypes={nodeTypes}
            proOptions={proOptions}
            maxZoom={1.2}
            style={{
              background: "#FFF",
              boxShadow: " 0px 10px 60px 0px rgba(226, 236, 249, 0.50)",
              borderRadius: "20px",
            }}
            // connectionLineStyle={connectionLineStyle}
            deleteKeyCode={null}
          >
            <Panel position="top-left">
              <Box className="top-left-box">
                <Box className="top-left-box-first-row">
                  <span style={{ fontWeight: 400 }}>Automation</span>
                  <span style={{ fontWeight: 700 }}> : </span>
                  <span style={{ fontWeight: 600 }}>
                    {state?.automationPayload?.automation_details
                      ?.automation_name
                      ? state?.automationPayload?.automation_details
                          ?.automation_name
                      : "N/A"}
                  </span>
                </Box>
                <Box className="top-left-box-second-row">
                  <span style={{ fontWeight: 400 }}>Data Count : </span>
                  <span style={{ fontWeight: 600 }}>
                    {state?.automationPayload?.automation_details?.data_count}
                  </span>
                </Box>
                <Box className="top-left-box-third-row">
                  <span style={{ fontWeight: 400 }}>
                    Communication release window : <br />
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {`${
                      state?.automationPayload?.automation_details?.releaseWindow?.start_time.split(
                        " "
                      )[1]
                    }

                    ${
                      state?.automationPayload?.automation_details?.releaseWindow?.start_time.split(
                        " "
                      )[2]
                    }
                    to ${
                      state?.automationPayload?.automation_details?.releaseWindow?.end_time.split(
                        " "
                      )[1]
                    }
                    ${
                      state?.automationPayload?.automation_details?.releaseWindow?.end_time.split(
                        " "
                      )[2]
                    }
                    
                    ( ${updatedReleaseWIndowShowcase?.join(", ")} )`}
                  </span>
                </Box>
              </Box>
            </Panel>

            <Panel position="top-right">
              <Box
                onClick={() => {
                  setClickedStartAutomation(true);
                  dispatch(setOpenDataSegmentDialog(true));

                  const data = getCommunicationTypeCount(nodesArray);
                  setActionCount(
                    Object.keys(data).length > 0
                      ? data
                      : { email: 0, whatsapp: 0, sms: 0 }
                  );
                }}
                className="start-automation-button"
                style={{ cursor: "pointer" }}
              >
                Start Automation
              </Box>
            </Panel>

            <Background variant="line" />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>
      </Box>
      <Dialog
        maxWidth={"sm"}
        open={openDataSegmentDialog}
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            return;
          } else {
            dispatch(setOpenDataSegmentDialog(false));
            setClickedStartAutomation(false);
          }
        }}
        // disableBackdropClick={true}
      >
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <LeefLottieAnimationLoader
              height={50}
              width={50}
            ></LeefLottieAnimationLoader>
          </Box>
        )}
        <Box className="automation-main-dialog-header ">
          <Box className="automation-main-dialog-title ">Create Automation</Box>
          <Box
            onClick={() => {
              dispatch(setOpenDataSegmentDialog(false));
              setClickedStartAutomation(false);
            }}
            className="automation-drawer-close-icon"
          >
            <img src={CloseSVG} alt="settingsImage" style={{ width: "100%" }} />
          </Box>
        </Box>
        <DialogContent>
          <Grid
            rowGap={2.5}
            width={480}
            container
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={12} md={6}>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "36px",
                }}
              >
                <Input
                  className="create-automation-input"
                  placeholder="Name*"
                  value={
                    state?.automationPayload?.automation_details
                      ?.automation_name
                  }
                  readOnly
                />
                <BorderLineText text={"Name*"} width={32}></BorderLineText>
              </Box>{" "}
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              {" "}
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "36px",
                }}
              >
                <DateRangePicker
                  appearance="subtle"
                  placeholder="Start Date & End Date*"
                  value={
                    state?.automationPayload?.automation_details?.date
                      ?.start_date
                      ? [
                          new Date(
                            state?.automationPayload?.automation_details?.date?.start_date
                          ),
                          new Date(
                            state?.automationPayload?.automation_details?.date?.end_date
                          ),
                        ]
                      : []
                  }
                  placement="bottomEnd"
                  className="date-range-btn-automation"
                  readOnly
                  //   shouldDisableDate={allowedRange(
                  //     new Date("12-11-2023"),
                  //     new Date("12-20-2023")
                  //   )}
                />

                <BorderLineText
                  text={"Start Date & End Date*"}
                  width={105}
                ></BorderLineText>
              </Box>{" "}
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "36px",
                }}
              >
                <Input
                  className="create-automation-input"
                  value={
                    state?.automationPayload?.automation_details?.data_type
                  }
                  readOnly
                />
                <BorderLineText
                  text={"Select Data Type*"}
                  width={80}
                ></BorderLineText>
              </Box>{" "}
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
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
                      state?.automationPayload?.automation_details?.releaseWindow?.start_time.split(
                        " "
                      )[1]
                    } ${
                      state?.automationPayload?.automation_details?.releaseWindow?.start_time.split(
                        " "
                      )[2]
                    } to ${
                      state?.automationPayload?.automation_details?.releaseWindow?.end_time.split(
                        " "
                      )[1]
                    } ${
                      state?.automationPayload?.automation_details?.releaseWindow?.end_time.split(
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
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              {" "}
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "36px",
                }}
              >
                <Input
                  className="create-automation-input"
                  value={
                    state?.automationPayload?.automation_details?.data_count
                  }
                  readOnly
                />
                <BorderLineText text={"Data count"} width={50}></BorderLineText>
              </Box>{" "}
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Box
                id="data-segment-box-automation"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "36px",
                }}
              >
                <Dropdown
                  id="data-segment-box-automation-button"
                  title="Data Segment Name"
                >
                  {state?.automationPayload?.automation_details?.data_segment?.map(
                    (data, index) => (
                      <Dropdown.Item
                        onClick={() => {
                          setOpenCreateDataSegmentDrawer(true);
                          setSelectedDataSegment(data);
                          dispatch(setOpenDataSegmentDialog(false));
                        }}
                        key={index}
                      >
                        {data?.data_segment_name}
                      </Dropdown.Item>
                    )
                  )}
                </Dropdown>
                <BorderLineText
                  text={"Data Segment Name"}
                  width={95}
                ></BorderLineText>
              </Box>{" "}
            </Grid>
            {clickedStartAutomation && (
              <Grid item xs={12} sm={12} md={12}>
                <Typography sx={{ mb: 2 }} id="daysSelection">
                  Count of Actions
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    gap: 1,
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "36px",
                    }}
                  >
                    <Input
                      className="automation-action-count-field"
                      placeholder="Whatsapp*"
                      value={actionCount?.whatsapp ? actionCount?.whatsapp : 0}
                      readOnly
                    />
                    <BorderLineText
                      text={"Whatsapp*"}
                      width={45}
                    ></BorderLineText>
                  </Box>{" "}
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "36px",
                    }}
                  >
                    <Input
                      className="automation-action-count-field"
                      placeholder="Email"
                      value={actionCount?.email ? actionCount?.email : 0}
                      readOnly
                    />
                    <BorderLineText text={"Email*"} width={32}></BorderLineText>
                  </Box>{" "}
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "36px",
                    }}
                  >
                    <Input
                      className="automation-action-count-field"
                      placeholder="SMS*"
                      value={actionCount?.sms ? actionCount?.sms : 0}
                      readOnly
                    />
                    <BorderLineText text={"SMS*"} width={32}></BorderLineText>
                  </Box>{" "}
                </Box>
              </Grid>
            )}
            <Grid item xs={12} sm={12} md={12}>
              <Box>
                <CheckBoxGroupWeeks
                  // handleSetData={handleWeekDays}
                  readOnlyBoxes={true}
                  daysRange={state?.automationPayload?.automation_details?.days}
                  validation={true}
                  allowedDays={
                    state?.automationPayload?.automation_details?.days
                  }
                ></CheckBoxGroupWeeks>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Box>
                <AutomationCreationTimer
                  time={{
                    start_time:
                      state?.automationPayload?.automation_details
                        ?.releaseWindow?.start_time,
                    end_time:
                      state?.automationPayload?.automation_details
                        ?.releaseWindow?.end_time,
                  }}
                />
              </Box>
            </Grid>

            {clickedStartAutomation && (
              <Grid item xs={12} sm={12} md={12}>
                <Box>
                  <Box sx={{}} className="automation-window-buttons">
                    {state?.template || (
                      <Box
                        onClick={() => {
                          const validations = validateNodes(nodesArray);

                          if (validations?.error === true) {
                            pushNotification("warning", validations.errorText);
                          } else {
                            callAutomationPAyload("saved");
                          }
                        }}
                        className="automation-Continue-button"
                      >
                        Save
                      </Box>
                    )}

                    {state?.template && (
                      <Box
                        onClick={() => {
                          const validations = validateNodes(nodesArray);

                          if (validations?.error === true) {
                            pushNotification("warning", validations.errorText);
                          } else {
                            callAutomationPAyload("saved");
                          }
                        }}
                        className="automation-create-template-button"
                      >
                        Create Template
                      </Box>
                    )}

                    {state?.template || (
                      <Box
                        onClick={() => {
                          const validations = validateNodes(nodesArray);

                          if (validations?.error === true) {
                            pushNotification("warning", validations.errorText);
                          } else {
                            callAutomationPAyload("active");
                          }
                        }}
                        className="automation-Continue-button"
                      >
                        Start
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
      </Dialog>
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

export default CreateAndViewAutomation;
