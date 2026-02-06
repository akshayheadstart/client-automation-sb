export const getLeadStageLabel = (leadStageData, allLabel, role) => {
  const option = [];
  leadStageData?.forEach((data) => {
    if (data && allLabel.indexOf(data) === allLabel.lastIndexOf(data)) {
      option.push({
        label: data,
        value: data,
        role: role,
      });
    }
  });

  return option;
};
