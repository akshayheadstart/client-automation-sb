import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Handle, Position } from "reactflow";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const RenderPermissionTree = ({ data, id }) => {
  const {
    onEdit,
    onDelete,
    onAdd,
    showAddNestedFeature,
    showDelete,
    treeDirection,
    onSelect,
    showCheckbox,
    selectedFeatures,
    isParent,
    node,
    onExpand,
    onCollapse,
    hideExpand,
    index,
  } = data;

  return (
    <Box className="feature-permission-card">
      <Handle
        type="target"
        position={treeDirection ? Position.Top : Position.Left}
      />
      <Typography variant="body2">
        <b>Feature Name :</b> {node?.name}
      </Typography>
      <Typography variant="body2">
        <b>Feature Default Visibility :</b> {node?.visibility ? "Yes" : "No"}
      </Typography>

      <Box className="feature-action-container">
        {showCheckbox && isParent && (
          <Tooltip arrow title="">
            <Checkbox
              onClick={() => {
                onSelect(data?.node, index);
              }}
              color="info"
              checked={selectedFeatures?.some(
                (feature) => feature?.feature_id === data?.node?.feature_id
              )}
            />
          </Tooltip>
        )}
        <Tooltip arrow title="Click to Edit/View this Feature">
          <Button
            onClick={() => onEdit(node)}
            size="small"
            color="info"
            endIcon={<Edit />}
          >
            Edit
          </Button>
        </Tooltip>
        {showDelete && (
          <Tooltip arrow title="Click to Delete this Feature">
            <Button
              onClick={() => onDelete(node)}
              size="small"
              color="info"
              endIcon={<Delete />}
            >
              Delete
            </Button>
          </Tooltip>
        )}
        {showAddNestedFeature && (
          <Tooltip arrow title="Click to Add Sub Feature">
            <Button
              onClick={() => onAdd(node)}
              size="small"
              color="info"
              endIcon={<Add />}
            >
              Feature
            </Button>
          </Tooltip>
        )}
        <>
          {!hideExpand && (
            <>
              {node?.expandable && (
                <Tooltip
                  arrow
                  title={node?.features ? "Collapse" : "Expand More"}
                >
                  <IconButton
                    onClick={() =>
                      node?.features ? onCollapse(node) : onExpand(node)
                    }
                    size="small"
                    color="info"
                  >
                    {node?.features ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
        </>
      </Box>

      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {/* <Tooltip arrow title="Expand Less">
          <Button
            size="small"
            color="info"
            endIcon={<ExpandLessIcon />}
          ></Button>
        </Tooltip> */}
        {
          // <Tooltip arrow title="Expand More">
          //   <IconButton size="small" color="info">
          //     <ExpandMoreIcon />
          //   </IconButton>
          // </Tooltip>
        }
      </Box>
      <Handle
        type="source"
        position={treeDirection ? Position.Bottom : Position.Right}
      />
    </Box>
  );
};

export default RenderPermissionTree;
