import { Box } from "@mui/system";
import React, { useEffect, useMemo, useState } from "react";
import { Checkbox, CheckboxGroup } from "rsuite";
import ModuleNameAndDescription from "./ModuleNameAndDescription";
import { TextField } from "@mui/material";

function ShowSubModules({
  module,
  selectedModules,
  setSelectedModules,
  hideCheckBoxAndAmountFieldShow,
}) {
  const [subModuleIds, setSubModuleIds] = useState([]);

  const parentSelectedIndex = useMemo(() => {
    return selectedModules.findIndex(
      (selectedModule) => selectedModule.feature_id === module.id
    );
  }, [selectedModules, module]);

  const allSubModuleIds = useMemo(() => {
    const arrayOfStringIds = [];
    const arrayOfObjectId = [];

    module?.features?.map((subModule) => {
      arrayOfStringIds.push(subModule.id);
      arrayOfObjectId.push({
        feature_id: subModule.id,
        amount: subModule?.amount,
      });
    });

    return { arrayOfStringIds, arrayOfObjectId };
  }, [module]);

  useEffect(() => {
    if (parentSelectedIndex !== -1) {
      const ids = [];
      selectedModules[parentSelectedIndex]?.features?.map((subFeature) => {
        if (subFeature?.feature_id) {
          ids.push(subFeature?.feature_id);
        }
      });
      setSubModuleIds(ids);
    } else {
      setSubModuleIds([]);
    }
  }, [module, selectedModules]);

  const handleCheckAll = (_, checked) => {
    const modifiedSelectedModule = structuredClone(selectedModules);

    if (checked) {
      setSubModuleIds(allSubModuleIds.arrayOfStringIds);
      if (parentSelectedIndex === -1) {
        setSelectedModules((prev) => [
          ...prev,
          {
            feature_id: module.id,
            amount: module?.amount,
            features: allSubModuleIds.arrayOfObjectId,
          },
        ]);
      } else {
        modifiedSelectedModule[parentSelectedIndex].features =
          allSubModuleIds.arrayOfObjectId;
        setSelectedModules(modifiedSelectedModule);
      }
    } else {
      setSubModuleIds([]);
      modifiedSelectedModule.splice(parentSelectedIndex, 1);
      setSelectedModules(modifiedSelectedModule);
    }
  };

  const handleChange = (values) => {
    setSubModuleIds(values);

    // const modifiedValues = values.map((value) => ({ feature_id: value }));
    const modifiedValues = module?.features?.map((feature) => {
      if (values.includes(feature?.id)) {
        return { feature_id: feature?.id, amount: feature?.amount };
      }
    });

    if (parentSelectedIndex === -1) {
      setSelectedModules((prev) => [
        ...prev,
        {
          feature_id: module.id,
          amount: module.amount,
          features: modifiedValues,
        },
      ]);
    } else {
      const modifiedSelectedModule = structuredClone(selectedModules);
      if (values?.length) {
        modifiedSelectedModule[parentSelectedIndex].features = modifiedValues;
        setSelectedModules(modifiedSelectedModule);
      } else {
        modifiedSelectedModule.splice(parentSelectedIndex, 1);
        setSelectedModules(modifiedSelectedModule);
      }
    }
  };

  const handleChangeField = (e, featureId, moduleId) => {
    const amount = Number(e.target.value);
    setSelectedModules((prev) => {
      const moduleIndex = prev.findIndex(
        (item) => item.feature_id === moduleId
      );
      if (moduleIndex !== -1) {
        const existingFeatures = [...prev[moduleIndex].features];
        const featureIndex = existingFeatures.findIndex(
          (f) => f.feature_id === featureId
        );

        if (featureIndex !== -1) {
          existingFeatures[featureIndex] = {
            ...existingFeatures[featureIndex],
            amount,
          };
        } else {
          existingFeatures.push({ feature_id: featureId, amount });
        }
        const updated = [...prev];
        updated[moduleIndex] = {
          ...updated[moduleIndex],
          features: existingFeatures,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            feature_id: moduleId,
            features: [{ feature_id: featureId, amount }],
          },
        ];
      }
    });
  };

  return (
    <Box sx={{ my: 1 }}>
      <Box className="module-subscription-checkbox-container">
        {!hideCheckBoxAndAmountFieldShow && (
          <Checkbox
          indeterminate={
            subModuleIds?.length > 0 &&
            subModuleIds?.length < allSubModuleIds?.arrayOfStringIds.length
          }
          checked={
            allSubModuleIds?.arrayOfStringIds?.length
              ? subModuleIds?.length ===
                allSubModuleIds?.arrayOfStringIds?.length
              : parentSelectedIndex !== -1
          }
          onChange={handleCheckAll}
          style={{ display: "flex", alignItems: "center" }}
        ></Checkbox>
        )}
        <ModuleNameAndDescription module={module} parent={true} />
      </Box>
      <CheckboxGroup
        name="checkboxList"
        value={subModuleIds}
        onChange={handleChange}
        style={{ marginLeft: 36 }}
      >
        {module?.features?.map((feature) => (
          <Box
            sx={{ my: 1 }}
            className="module-subscription-checkbox-container"
          >
            {!hideCheckBoxAndAmountFieldShow && (
              <Checkbox key={feature.id} value={feature.id}></Checkbox>
            )}
            <ModuleNameAndDescription module={feature} />
            {hideCheckBoxAndAmountFieldShow && (
              <TextField
                size="small"
                id={`feature-${feature.id}`}
                onChange={(e) => handleChangeField(e, feature.id, module?.id)}
                placeholder="Enter Amount"
                sx={{
                  borderRadius: 1,
                  width: 150,
                  fontWeight: 800,
                }}
                color="info"
                variant="outlined"
                type="number"
              />
            )}
          </Box>
        ))}
      </CheckboxGroup>
    </Box>
  );
}

export default ShowSubModules;
