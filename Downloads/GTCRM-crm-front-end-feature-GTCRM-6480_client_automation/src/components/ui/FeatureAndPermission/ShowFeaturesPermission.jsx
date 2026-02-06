import { Box } from "@mui/material";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  findAndDeleteFeatureByKeyName,
  getLayoutedElements,
  handleFeatureSelect,
  removeSubFeaturesFromNode,
  returnFeatureWithSubFeature,
  returnOnlyParentFeatures,
  transformTreeToFlow,
} from "../../../pages/StudentTotalQueries/helperFunction";
import "reactflow/dist/style.css";
import AddFeaturePermissionDialog from "./AddFeaturePermissionDialog";
import DeleteDialogue from "../../shared/Dialogs/DeleteDialogue";
import "../../../styles/clientOnboardingStyles.css";
import ReactFlow, { Background, Controls, ReactFlowProvider } from "reactflow";
import RenderPermissionTree from "./RenderPermissionTree";
import useToasterHook from "../../../hooks/useToasterHook";

const nodeTypes = { customNode: RenderPermissionTree };
const proOptions = { account: "paid-pro", hideAttribution: true };

function ShowFeaturesPermission({
  addedFeatures,
  setAddedFeatures,
  featureDashboard,
  showAddNestedFeature,
  showDelete,
  treeDirection,
  showCheckbox,
  selectedFeatures,
  setSelectedFeatures,
  handleEditFeature,
  loadingEditFeature,
  handleDeleteFeature,
  loadingDeleteFeature,
  hideExpand,
  from,
}) {
  const [listOfFeatures, setListOfFeatures] = useState([]);
  const [treeNodes, setTreeNodes] = useState([]);
  const [treeEdges, setTreeEdges] = useState([]);

  const [openEditFeatureDialog, setOpenEditFeatureDialog] = useState(false);
  const [editFeature, setEditFeature] = useState({});
  const [isAddingSubFeature, setIsAddingSubFeature] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const pushNotification = useToasterHook();

  const onEdit = (node) => {
    setEditFeature(node);

    setOpenEditFeatureDialog(true);
    setIsAddingSubFeature(false);
  };

  const onDelete = (node) => {
    setEditFeature(node);
    setOpenDeleteDialog(true);
  };

  const onAdd = (node) => {
    setEditFeature(node);
    setOpenEditFeatureDialog(true);
    setIsAddingSubFeature(true);
  };

  const onSelect = (node, index) => {
    handleFeatureSelect(
      addedFeatures[index],
      selectedFeatures,
      setSelectedFeatures
    );
  };

  const onExpand = (node) => {
    const updatedFeatureList = returnFeatureWithSubFeature({
      node,
      addedFeatures,
      listOfFeatures,
    });

    setListOfFeatures(updatedFeatureList);
  };

  const onCollapse = (node) => {
    const updatedFeatureList = removeSubFeaturesFromNode({
      node,
      listOfFeatures,
    });

    setListOfFeatures(updatedFeatureList);
  };

  useEffect(() => {
    if (!hideExpand) {
      const initialFeatureLists = returnOnlyParentFeatures(addedFeatures);
      setListOfFeatures(initialFeatureLists);
    }
  }, [addedFeatures]);

  useEffect(() => {
    const { nodes, edges } = transformTreeToFlow({
      tree: hideExpand ? addedFeatures : listOfFeatures,
      onEdit,
      onDelete,
      onAdd,
      showAddNestedFeature,
      showDelete,
      treeDirection,
      onSelect,
      showCheckbox,
      selectedFeatures,
      onExpand,
      onCollapse,
      hideExpand,
    });

    const nodesAndEdges = getLayoutedElements(nodes, edges, "TB");

    setTreeNodes(nodesAndEdges?.nodes);
    setTreeEdges(nodesAndEdges?.edges);
  }, [listOfFeatures, selectedFeatures, addedFeatures]);

  function deleteFeatureByKeyName() {
    try {
      const updatedFeature = findAndDeleteFeatureByKeyName({
        addedFeatures,
        targetKey: editFeature?.feature_id || editFeature.name,
      });

      setAddedFeatures(updatedFeature);
      pushNotification("success", "Feature is Deleted!");
      setOpenDeleteDialog(false);
    } catch (error) {
      pushNotification("error", error?.message);
    }
  }

  const memoizedNodes = useMemo(() => treeNodes, [treeNodes]);
  const memoizedEdges = useMemo(() => treeEdges, [treeEdges]);

  return (
    <Box
      sx={{
        my: 3,
      }}
    >
      <ReactFlowProvider>
        <div style={{ height: "80vh" }}>
          <ReactFlow
            nodes={memoizedNodes}
            edges={memoizedEdges}
            fitView
            nodesConnectable={false}
            nodesDraggable={true}
            zoomOnScroll={true}
            zoomOnDoubleClick={true}
            preventScrolling={true}
            panOnDrag={true}
            // panOnScroll={true}
            elementsSelectable={false}
            nodeTypes={nodeTypes}
            customNode={true}
            proOptions={proOptions}
            maxZoom={1.2}
          >
            <Background gap={12} size={1} />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>
      </ReactFlowProvider>

      {openEditFeatureDialog && (
        <AddFeaturePermissionDialog
          open={openEditFeatureDialog}
          setOpen={setOpenEditFeatureDialog}
          featureDashboard={featureDashboard}
          setAddedFeatures={setAddedFeatures}
          editFeature={editFeature}
          addedFeatures={addedFeatures}
          isAddingSubFeature={isAddingSubFeature}
          handleEditFeature={handleEditFeature}
          loadingEditFeature={loadingEditFeature}
          from={from}
        />
      )}
      <DeleteDialogue
        openDeleteModal={openDeleteDialog}
        handleDeleteSingleTemplate={() => {
          if (handleDeleteFeature) {
            handleDeleteFeature(editFeature?.feature_id, setOpenDeleteDialog);
          } else {
            deleteFeatureByKeyName();
          }
        }}
        handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
        loading={loadingDeleteFeature}
      />
    </Box>
  );
}

export default ShowFeaturesPermission;
