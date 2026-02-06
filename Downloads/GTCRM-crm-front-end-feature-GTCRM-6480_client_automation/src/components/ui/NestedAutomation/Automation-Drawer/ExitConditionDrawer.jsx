import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  checkAdvFilterConditions,
  convertKeysToCamelCase,
} from "../../../../helperFunctions/advanceFilterHelperFunctions";
import AdvanceFilterBlock from "../../../shared/AdvanceFilter/AdvanceFilterBlock";
import { useNodeId, useReactFlow } from "reactflow";
import useRemoveNodesAutomation from "../../../../hooks/automations/useRemoveNodesAutomation";

const ExitConditionDrawer = ({
  openDrawer,
  setOpenDrawer,
  exitConditions,
  setExitConditions,
}) => {
  const { setNodes } = useReactFlow();
  const { removeTreeOfOutGoers, removeDelay } = useRemoveNodesAutomation();
  const nodeId = useNodeId();
  const [selectedCategoriesFields, setSelectedCategoriesFields] = useState([]);

  const handleFilterOptionUpdate = (
    action,
    newValue,
    index,
    blockId,
    fieldType,
    dependentFields,
    collectionFieldName,
    collectionName
  ) => {
    setExitConditions((prevExitConditions) => {
      const updatedFilterBlocks = prevExitConditions?.map((block) => {
        if (block.id === blockId) {
          const dependentArray = [];

          const updatedFilterOptions = block.filterOptions
            .map((option, i) => {
              if (i === index) {
                switch (action) {
                  case "delete":
                    return null;
                  case "field-name":
                    return {
                      ...option,
                      fieldName: newValue,
                      fieldType,
                      collection_field_name: collectionFieldName,
                      collection_name: collectionName,
                      value: "",
                      selectOption: "",
                      dependentFields: dependentFields,
                    };
                  case "operator-list":
                    return { ...option, operators: newValue };
                  case "value-list":
                    if (
                      (block.filterOptions.length === 5 &&
                        dependentFields?.length > 0) ||
                      (block.filterOptions.length === 4 &&
                        dependentFields?.length === 2)
                    ) {
                      return option;
                    }
                    if (Array.isArray(newValue)) {
                      return {
                        ...option,
                        selectOption: newValue,
                      };
                    } else {
                      return {
                        ...option,
                        selectOptionFunction: newValue,
                      };
                    }
                  case "operator":
                    return {
                      ...option,
                      operator: newValue,
                      value: ["is blank", "is not blank", "is null"].includes(
                        newValue.toLowerCase()
                      )
                        ? ""
                        : option.value,
                    };
                  case "value":
                    return { ...option, value: newValue };
                  case "alert":
                    if (dependentFields?.length > 0) {
                      const dependentField = dependentFields?.[0];
                      const dependentFieldExist = block?.filterOptions?.find(
                        (filter) => filter?.fieldName === dependentField
                      );

                      if (!dependentFieldExist) {
                        const findDependentFilter =
                          selectedCategoriesFields?.find(
                            (field) => field?.field_name === dependentField
                          );

                        dependentArray.splice(
                          dependentArray.length - 1,
                          0,
                          convertKeysToCamelCase(findDependentFilter)
                        );

                        if (
                          findDependentFilter?.dependent_fields?.[0]?.length > 0
                        ) {
                          const findNextDependentField =
                            selectedCategoriesFields?.find(
                              (field) =>
                                field.field_name ===
                                findDependentFilter?.dependent_fields?.[0]
                            );

                          dependentArray.splice(
                            dependentArray.length - 1,
                            0,
                            convertKeysToCamelCase(findNextDependentField)
                          );
                        }
                      }
                    }

                    return { ...option, alert: newValue };
                  default:
                    return option;
                }
              }
              return option;
            })
            .filter((option) => option !== null);

          return {
            ...block,
            filterOptions: [...dependentArray, ...updatedFilterOptions],
          };
        }
        return block;
      });

      return updatedFilterBlocks;
    });
  };

  const deleteFilterBlock = (blockId) => {
    const updatedBlocks = exitConditions.filter(
      (block) => block.id !== blockId
    );
    setExitConditions(updatedBlocks);
  };

  const resetExitCondition = () => {
    setExitConditions([
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
    ]);
  };

  return (
    <Drawer
      anchor="right"
      onClose={() => setOpenDrawer(false)}
      open={openDrawer}
      PaperProps={{
        sx: {
          width: "445px",
        },
      }}
    >
      <Box className="advance-filter-background">
        <Box sx={{ p: { md: 3, xs: 2 } }} className="advance-filter-box">
          <Box className="advance-filter-header">
            <Typography className="automation-if-else-drawer-title">
              Edit Exit Condition
            </Typography>
            <IconButton onClick={() => setOpenDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box>
            {exitConditions?.map((block) => (
              <Box key={block.id}>
                <AdvanceFilterBlock
                  block={block}
                  filterBlocks={exitConditions}
                  setFilterBlocks={setExitConditions}
                  deleteFilterBlock={deleteFilterBlock}
                  handleFilterOptionUpdate={handleFilterOptionUpdate}
                  selectedCategoriesFields={selectedCategoriesFields}
                  setSelectedCategoriesFields={setSelectedCategoriesFields}
                  from="automation-exit-condition-drawer"
                />
              </Box>
            ))}
            <Box
              className="adv-filter-bottom-btn-box"
              sx={{
                marginTop: "100%",
              }}
            >
              <Button
                id="adv-filter-reset-btn"
                variant="outlined"
                onClick={() => resetExitCondition()}
              >
                Reset
              </Button>
              <Button
                onClick={() => {
                  const result = checkAdvFilterConditions(exitConditions);

                  if (result) {
                    setNodes((nds) =>
                      nds.map((node) => {
                        if (node?.id === nodeId) {
                          node.exit_condition_data = exitConditions;
                        }

                        return node;
                      })
                    );
                    setOpenDrawer(false);
                  }
                }}
                id="adv-filter-apply-btn"
                variant="contained"
                style={{
                  cursor: checkAdvFilterConditions(exitConditions)
                    ? "pointer"
                    : "not-allowed",
                }}
              >
                Apply
              </Button>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mt: "15px" }}>
              <Button
                sx={{
                  color: "#E06259 !important",
                  border: "1px solid #E06259 !important",
                }}
                className="common-outlined-button"
                onClick={() => {
                  removeTreeOfOutGoers(nodeId);
                  removeDelay(nodeId);
                  setOpenDrawer(false);
                }}
              >
                Remove Exit Condition
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ExitConditionDrawer;
