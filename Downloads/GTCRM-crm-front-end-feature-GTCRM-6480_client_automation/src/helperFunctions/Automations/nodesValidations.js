export function validateDelayNode({ node }) {
  if (!node?.delay_data) {
    return true;
  }

  const { delay_type, date, days, releaseWindow, trigger_by } = node.delay_data;

  if (
    delay_type === "nurturing" &&
    (!("interval_value" in node.delay_data) ||
      !("trigger_by" in node.delay_data))
  ) {
    return true;
  } else if (
    delay_type === "recurring" &&
    (!date?.start_date ||
      !(days?.length > 0) ||
      !releaseWindow?.start_time ||
      !trigger_by)
  ) {
    return true;
  }
}

export function validateCommunicationNode({ node }) {
  const { communication_data } = node;

  if (
    !communication_data ||
    !communication_data.communication_type ||
    !communication_data.template_id
  ) {
    return true;
  }
}

export function validateTagNode({ node }) {
  if (!node?.tag_data) {
    return true;
  }
}

export function validateExitNode({ node }) {
  const { exit_condition_data } = node;

  if (!exit_condition_data || !exit_condition_data.length) {
    return true;
  }

  for (const exitCondition of exit_condition_data) {
    if (
      !exitCondition?.filterOptions.every(
        (opt) => opt?.fieldName && opt?.operator
      )
    ) {
      return true;
    }
  }
}

export function validateIfElseNode({ node }) {
  const { if_else_data } = node;

  if (!if_else_data || !if_else_data.length) {
    return true;
  }

  for (let i = 0; i < node.length; i++) {
    const currentObject = node[i];

    if (!currentObject.next_action) {
      return true;
    }

    if (
      i < node.length &&
      (!currentObject.filterOptions ||
        !currentObject.filterOptions.every(
          (option) => option.fieldName && option.operator
        ))
    ) {
      return true;
    }
  }
}

export function validateLeadStageNode({ node }) {
  const { lead_stage_data } = node;

  if (!lead_stage_data || !lead_stage_data.lead_stage) {
    return true;
  }
}

export function validateAllocationNode({ node }) {
  const { allocation_counsellor_data } = node;

  if (!allocation_counsellor_data || !allocation_counsellor_data.length) {
    return true;
  }
}
