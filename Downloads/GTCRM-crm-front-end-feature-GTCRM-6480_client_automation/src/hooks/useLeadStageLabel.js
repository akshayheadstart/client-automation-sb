import { getLeadStageLabel } from "../helperFunctions/leadStageLabelData";

export const useLeadStageLabel = () => {
  const leadStageLabel = (
    leadStageObject,
    selectedLeadStage,
    setLeadStageLabelArray
  ) => {
    let allLabels = [];
    const selectedStageWhichHasLabels = {};

    selectedLeadStage?.forEach((key) => {
      if (leadStageObject[key]?.length) {
        selectedStageWhichHasLabels[key] = leadStageObject[key];
      }
    });

    Object.keys(selectedStageWhichHasLabels).forEach((key) => {
      const modifiedLabelWithRole = getLeadStageLabel(
        selectedStageWhichHasLabels[key],
        allLabels,
        key
      );
      allLabels = [...allLabels, ...modifiedLabelWithRole];
    });
    setLeadStageLabelArray(allLabels);
  };

  return leadStageLabel;
};
