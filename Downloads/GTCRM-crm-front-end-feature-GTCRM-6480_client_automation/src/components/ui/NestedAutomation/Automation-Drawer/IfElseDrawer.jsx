import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import AdvanceFilterBlock from "../../../shared/AdvanceFilter/AdvanceFilterBlock";
import { convertKeysToCamelCase } from "../../../../helperFunctions/advanceFilterHelperFunctions";
import CloseIcon from "@mui/icons-material/Close";
import { useNodeId, useReactFlow } from "reactflow";
import useRemoveNodesAutomation from "../../../../hooks/automations/useRemoveNodesAutomation";

const IfElseDrawer = ({
  openDrawer,
  setOpenDrawer,
  ifElseData,
  setIfElseData,
  addConditionalNodesFromElseIf,
}) => {
  const { removeTreeOfOutGoersofIOutGoers } = useRemoveNodesAutomation();
  const { setNodes } = useReactFlow();
  const nodeId = useNodeId();

  const [selectedCategoriesFields, setSelectedCategoriesFields] = useState([]);

  function checkConditions(array) {
    for (let i = 0; i < array.length; i++) {
      const currentObject = array[i];

      // Check if next_action is selected
      if (!currentObject.next_action) {
        return false;
      }

      // Check if filterOptions are selected except for the last object
      if (
        i < array.length - 1 &&
        (!currentObject.filterOptions ||
          !currentObject.filterOptions.every(
            (option) => option.fieldName && option.operator
          ))
      ) {
        return false;
      }
    }

    return true;
  }

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
    setIfElseData((prevIfElseData) => {
      const updatedFilterBlocks = prevIfElseData?.map((block) => {
        if (block.id === blockId) {
          const dependentArray = [];

          if (action === "next-action-value") {
            return { ...block, next_action: newValue };
          }

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
                        // dependentFields,
                        selectOption: newValue,
                      };
                    } else {
                      return {
                        ...option,
                        // dependentFields,
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
    const updatedBlocks = ifElseData.filter((block) => block.id !== blockId);
    setIfElseData(updatedBlocks);
  };

  const addIfBlock = () => {
    const newBlockId = ifElseData.length + 1;

    // Create a copy of the array
    const newArray = [...ifElseData];

    // Find the index of the last block
    const lastIndex = newArray.length - 1;

    // Insert the new object before the last block
    newArray.splice(lastIndex, 0, {
      id: newBlockId,
      blockCondition: "if",
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
    });

    // Update the state with the new array
    setIfElseData(newArray);
  };

  const resetAdvFilter = () => {
    setIfElseData([
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
              Preview If/Else
            </Typography>
            <IconButton onClick={() => setOpenDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box>
            {ifElseData?.map((block) => (
              <Box key={block.id}>
                <AdvanceFilterBlock
                  block={block}
                  filterBlocks={ifElseData}
                  setFilterBlocks={setIfElseData}
                  deleteFilterBlock={deleteFilterBlock}
                  handleFilterOptionUpdate={handleFilterOptionUpdate}
                  selectedCategoriesFields={selectedCategoriesFields}
                  setSelectedCategoriesFields={setSelectedCategoriesFields}
                  from="automation-if-else-drawer"
                  addFilterBlock={addIfBlock}
                />
              </Box>
            ))}
            <Box
              className="adv-filter-bottom-btn-box"
              sx={{
                marginTop: "60%",
              }}
            >
              <Button
                id="adv-filter-reset-btn"
                variant="outlined"
                onClick={() => resetAdvFilter()}
              >
                Reset
              </Button>
              <Button
                onClick={async () => {
                  await removeTreeOfOutGoersofIOutGoers(nodeId);
                  const result = await checkConditions(ifElseData);

                  if (result) {
                    await setNodes((nds) =>
                      nds.map((node) => {
                        if (node?.id === nodeId) {
                          node.if_else_data = ifElseData;
                        }

                        return node;
                      })
                    );
                    await addConditionalNodesFromElseIf(ifElseData);
                    await setOpenDrawer(false);
                  }
                }}
                id="adv-filter-apply-btn"
                variant="contained"
                style={{
                  cursor: checkConditions(ifElseData)
                    ? "pointer"
                    : "not-allowed",
                }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default IfElseDrawer;
