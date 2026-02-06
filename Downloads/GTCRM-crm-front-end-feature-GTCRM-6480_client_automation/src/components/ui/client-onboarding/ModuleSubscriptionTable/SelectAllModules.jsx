import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useMemo, useState } from "react";
import { Checkbox } from "rsuite";

function SelectAllModules({
  selectedModules,
  setSelectedModules,
  subscriptionModules,
}) {
  const [isPartialSelected, setIsPartialSelected] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    const filteredModules = subscriptionModules.filter((module) => {
      const foundModule = selectedModules.find(
        (selModule) => selModule.feature_id === module.id
      );
      return foundModule?.feature_id?.length > 0;
    });

    if (!filteredModules.length) {
      setIsPartialSelected(false);
      setIsAllSelected(false);
    } else {
      if (filteredModules.length === subscriptionModules.length) {
        setIsPartialSelected(false);
        setIsAllSelected(true);
      } else if (filteredModules.length !== subscriptionModules.length) {
        setIsPartialSelected(true);
        setIsAllSelected(false);
      }
    }
  }, [selectedModules, subscriptionModules]);

  const totalAddableModules = useMemo(() => {
    const addableModulesOnSelectAll = [];
    const remainingModulesOnDeselectAll = [];

    subscriptionModules.forEach((module) => {
      const prevSelectedModuleOfCurrentPage = selectedModules.findIndex(
        (selModule) => selModule.feature_id === module.id
      );
      if (prevSelectedModuleOfCurrentPage === -1) {
        addableModulesOnSelectAll.push({
          feature_id: module.id,
          amount: module.amount,
          features: module.features?.map((feature) => ({
            feature_id: feature?.id,
            amount: feature?.amount,
          })),
        });
      } else {
      }
    });
    selectedModules.forEach((module) => {
      const prevSelectedModuleOfCurrentPage = subscriptionModules.findIndex(
        (selModule) => selModule.id === module.feature_id
      );
      if (prevSelectedModuleOfCurrentPage === -1) {
        remainingModulesOnDeselectAll.push({
          feature_id: module.feature_id,
          amount: module.amount,
          features: module.features?.map((feature) => ({
            feature_id: feature?.feature_id,
            amount: feature?.amount,
          })),
        });
      }
    });

    return { addableModulesOnSelectAll, remainingModulesOnDeselectAll };
  }, [subscriptionModules, selectedModules]);

  const handleSelectAllModules = (_, checked) => {
    if (checked) {
      setSelectedModules((prev) => [
        ...prev,
        ...totalAddableModules.addableModulesOnSelectAll,
      ]);
    } else {
      setSelectedModules(totalAddableModules.remainingModulesOnDeselectAll);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Checkbox
        checked={isAllSelected}
        indeterminate={isPartialSelected}
        onChange={handleSelectAllModules}
      />
      <Typography>Select All</Typography>
    </Box>
  );
}

export default SelectAllModules;
