import React, { useEffect, useState } from "react";
import { Box, IconButton, Typography, Button, Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import "../../../styles/AdvanceFilter.css";
import AdvanceFilterBlock from "./AdvanceFilterBlock";
import ToggleSwitch from "./ToggleSwitch";
import {
  checkAdvFilterConditions,
  convertKeysToCamelCase,
} from "../../../helperFunctions/advanceFilterHelperFunctions";
import useToasterHook from "../../../hooks/useToasterHook";

const AdvanceFilterDrawer = ({
  openAdvanceFilter,
  setOpenAdvanceFilter,
  regularFilter,
  advanceFilterBlocks,
  setAdvanceFilterBlocks,
  handleApplyFilters,
  preview,
}) => {
  const pushNotification = useToasterHook();

  const [selectedCategoriesFields, setSelectedCategoriesFields] = useState([]);

  const handleCloseDrawer = () => {
    setOpenAdvanceFilter(false);
    setAdvanceFilterBlocks([]);
  };

  const addFilterBlock = () => {
    const newBlockId = advanceFilterBlocks?.length + 1;
    setAdvanceFilterBlocks([
      ...advanceFilterBlocks,
      {
        id: newBlockId,
        blockCondition: "AND",
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
        conditionBetweenBlock: "AND",
      },
    ]);
  };

  const deleteFilterBlock = (blockId) => {
    const updatedBlocks = advanceFilterBlocks?.filter(
      (block) => block.id !== blockId
    );
    setAdvanceFilterBlocks(updatedBlocks);
  };

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
    const updatedFilterBlocks = advanceFilterBlocks?.map((block) => {
      if (block.id === blockId) {
        const updatedFilterOptions = [...block.filterOptions];

        if (action === "delete") {
          updatedFilterOptions.splice(index, 1);
        } else {
          if (action === "field-name") {
            // Check the specific condition inside the "field-name" block
            if (
              (updatedFilterOptions.length === 5 &&
                dependentFields?.length > 0) ||
              (updatedFilterOptions.length === 4 &&
                dependentFields?.length === 2)
            ) {
              pushNotification(
                "warning",
                "You can't add in this block. This field has dependent field."
              );
              return block;
            }

            updatedFilterOptions[index].fieldName = newValue;
            updatedFilterOptions[index].fieldType = fieldType;
            updatedFilterOptions[index].collection_field_name =
              collectionFieldName;
            updatedFilterOptions[index].collection_name = collectionName;
            updatedFilterOptions[index].value = "";
            updatedFilterOptions[index].selectOption = "";
            updatedFilterOptions[index].dependentFields = dependentFields;
          } else if (action === "operator-list") {
            updatedFilterOptions[index].operators = newValue;
          } else if (action === "value-list") {
            // Check the specific condition inside the "field-name" block
            if (
              (updatedFilterOptions.length === 5 &&
                dependentFields?.length > 0) ||
              (updatedFilterOptions.length === 4 &&
                dependentFields?.length === 2)
            ) {
              return block;
            }

            // updatedFilterOptions[index].dependentFields = dependentFields;
            if (Array.isArray(newValue)) {
              updatedFilterOptions[index].selectOption = newValue;
            } else if (newValue?.length === 0) {
              updatedFilterOptions[index].selectOption = "";
            } else {
              updatedFilterOptions[index].selectOptionFunction = newValue;
            }
          } else if (action === "operator") {
            updatedFilterOptions[index].operator = newValue;

            if (
              newValue?.toLowerCase() === "is blank" ||
              newValue?.toLowerCase() === "is not blank" ||
              newValue?.toLowerCase() === "is null"
            ) {
              updatedFilterOptions[index].value = "";
            }
          } else if (action === "value") {
            updatedFilterOptions[index].value = newValue;
          } else if (action === "alert") {
            // Check the specific condition inside the "field-name" block
            if (
              (updatedFilterOptions.length === 5 &&
                dependentFields?.length > 0) ||
              (updatedFilterOptions.length === 4 &&
                dependentFields?.length === 2)
            ) {
              return block;
            }
            updatedFilterOptions[index].alert = newValue;

            if (dependentFields?.length > 0) {
              const dependentField = dependentFields?.[0];

              const dependentFieldExist = updatedFilterOptions?.find(
                (filter) => filter.fieldName === dependentField
              );

              if (!dependentFieldExist) {
                const findDependentFilter = selectedCategoriesFields?.find(
                  (field) => field.field_name === dependentField
                );

                if (findDependentFilter?.dependent_fields?.[0]?.length > 0) {
                  const findNextDependentField = selectedCategoriesFields?.find(
                    (field) =>
                      field.field_name ===
                      findDependentFilter?.dependent_fields?.[0]
                  );

                  updatedFilterOptions.splice(
                    updatedFilterOptions.length - 1,
                    0,
                    convertKeysToCamelCase(findNextDependentField)
                  );
                }

                updatedFilterOptions.splice(
                  updatedFilterOptions.length - 1,
                  0,
                  convertKeysToCamelCase(findDependentFilter)
                );
              }
            }
          }
        }

        return { ...block, filterOptions: updatedFilterOptions };
      }
      return block;
    });

    setAdvanceFilterBlocks(updatedFilterBlocks);

    const hasFilled = updatedFilterBlocks?.find(
      (filter) => filter?.filterOptions?.[0]?.fieldName?.length > 0
    );
    if (hasFilled) {
      localStorage.setItem(regularFilter, JSON.stringify(updatedFilterBlocks));
    }
  };

  useEffect(() => {
    const filterOptionsFromLocalStorage =
      JSON.parse(localStorage.getItem(regularFilter)) || [];

    if (filterOptionsFromLocalStorage?.length > 0) {
      const filteredArray = filterOptionsFromLocalStorage.map((block) => ({
        ...block,
        filterOptions: block.filterOptions,
      }));
      setAdvanceFilterBlocks(filteredArray);
    } else {
      setAdvanceFilterBlocks([
        {
          id: 1,
          blockCondition: "AND",
          color: "#039bdc !important",
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regularFilter]);

  const resetAdvFilter = () => {
    setAdvanceFilterBlocks([
      {
        id: 1,
        blockCondition: "AND",
        color: "#039bdc !important",
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
    localStorage.removeItem(regularFilter);
  };

  return (
    <>
      <Drawer
        anchor="right"
        onClose={handleCloseDrawer}
        open={openAdvanceFilter}
        PaperProps={{ sx: { width: "430px" } }}
      >
        <Box className="advance-filter-background">
          <Box sx={{ p: { md: 3, xs: 2 } }} className="advance-filter-box">
            <Box className="advance-filter-header">
              <Typography variant="h6">Advance Filter</Typography>
              <IconButton onClick={handleCloseDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>

            {advanceFilterBlocks?.map((block) => (
              <Box key={block.id}>
                {block?.id !== 1 &&
                  block?.conditionBetweenBlock?.length > 0 && (
                    <Box className="adv-filter-add-condition-btn-box">
                      <ToggleSwitch
                        filterBlocks={advanceFilterBlocks}
                        setFilterBlocks={setAdvanceFilterBlocks}
                        blockId={block?.id}
                        from="conditionBetweenBlock"
                        localStorageKey={regularFilter}
                        preview={preview}
                      />
                    </Box>
                  )}
                <AdvanceFilterBlock
                  block={block}
                  filterBlocks={advanceFilterBlocks}
                  setFilterBlocks={setAdvanceFilterBlocks}
                  deleteFilterBlock={deleteFilterBlock}
                  handleFilterOptionUpdate={handleFilterOptionUpdate}
                  selectedCategoriesFields={selectedCategoriesFields}
                  setSelectedCategoriesFields={setSelectedCategoriesFields}
                  localStorageKey={regularFilter}
                  preview={preview}
                />
              </Box>
            ))}

            {!preview && (
              <>
                {advanceFilterBlocks?.length < 5 && (
                  <Box className="adv-filter-add-condition-btn-box">
                    <Button
                      id="advance-filter-add-condition-button"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={addFilterBlock}
                    >
                      Add Condition
                    </Button>
                  </Box>
                )}
                <Box
                  className="adv-filter-bottom-btn-box"
                  sx={{
                    marginTop: advanceFilterBlocks?.length > 1 ? "20%" : "62%",
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
                    onClick={() => {
                      if (checkAdvFilterConditions(advanceFilterBlocks)) {
                        handleApplyFilters(true);
                        setOpenAdvanceFilter(false);
                      } else {
                        pushNotification("warning", "Please select filter");
                      }
                    }}
                    id="adv-filter-apply-btn"
                    variant="contained"
                  >
                    Apply
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default AdvanceFilterDrawer;
