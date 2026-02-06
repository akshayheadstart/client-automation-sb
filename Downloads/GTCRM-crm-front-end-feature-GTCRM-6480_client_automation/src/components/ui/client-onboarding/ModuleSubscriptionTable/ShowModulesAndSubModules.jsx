import React, { useEffect, useState } from "react";
import ShowSubModules from "./ShowSubModules";
import { Box } from "@mui/system";
import { Checkbox } from "rsuite";
import { Typography } from "@mui/material";
import SelectAllModules from "./SelectAllModules";

function ShowModulesAndSubModules({
  selectedModules,
  setSelectedModules,
  subscriptionModules,
  hideCheckBoxAndAmountFieldShow,
}) {
  return (
    <Box>
      {!hideCheckBoxAndAmountFieldShow && (
        <SelectAllModules
          setSelectedModules={setSelectedModules}
          selectedModules={selectedModules}
          subscriptionModules={subscriptionModules}
          hideCheckBoxAndAmountFieldShow={hideCheckBoxAndAmountFieldShow}
        />
      )}
      {subscriptionModules.map((module) => (
        <ShowSubModules
          key={module.id}
          module={module}
          selectedModules={selectedModules}
          setSelectedModules={setSelectedModules}
          hideCheckBoxAndAmountFieldShow={hideCheckBoxAndAmountFieldShow}
        />
      ))}
    </Box>
  );
}

export default ShowModulesAndSubModules;
