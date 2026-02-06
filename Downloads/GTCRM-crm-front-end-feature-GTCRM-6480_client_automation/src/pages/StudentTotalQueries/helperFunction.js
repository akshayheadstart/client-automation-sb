import dagre from "dagre";
import "reactflow/dist/style.css";
import Cookies from "js-cookie";

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export function formatDateRange(startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const startMonth = months[startDate.getMonth()];
  const endMonth = months[endDate.getMonth()];

  return `${startDate.getDate()} ${startMonth} ${startDate.getFullYear()} - ${endDate.getDate()} ${endMonth} ${endDate.getFullYear()}`;
}
export function getDefaultDateRange() {
  const currentDate = new Date();
  const endDate = new Date(currentDate);
  endDate.setMonth(endDate.getMonth() - 1);
  endDate.setDate(endDate.getDate() - 1); // Set to last day of the month

  const startDateString = `${currentDate.getDate()} ${
    months[currentDate.getMonth()]
  } ${currentDate.getFullYear()}`;
  const endDateString = `${endDate.getDate()} ${
    months[endDate.getMonth()]
  } ${endDate.getFullYear()}`;

  return `${endDateString} - ${startDateString}`;
}
export function secondsToMinutesAndSeconds(inputSeconds) {
  const value = inputSeconds.toString().split(".");
  const minutes = Math.floor(parseInt(value[1]) / 60);
  const seconds = parseInt(value[1]) % 60;
  return `${minutes}m ${seconds}s`;
}
export function extractToken(inputString) {
  const regex = /eyJ[^\s]+/;
  const match = inputString.match(regex);

  return match ? match[0] : null;
}
const dateTimeFormat = (date) => {
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate} ${formattedTime}`;
};
export function convertDatesAndTime(startDateForPeriod, endDateForPeriod) {
  const startDateForPeriodData = startDateForPeriod
    ? new Date(startDateForPeriod)
    : null;
  const endDateForPeriodData = endDateForPeriod
    ? new Date(endDateForPeriod)
    : null;

  return {
    start_date: startDateForPeriodData
      ? dateTimeFormat(startDateForPeriodData)
      : "",
    end_date: endDateForPeriodData ? dateTimeFormat(endDateForPeriodData) : "",
  };
}
export const extractDateRangeWithString = (dateString) => {
  const dataSlice = dateString.slice(12);
  const dataSplit = dataSlice.split("to");
  if (dataSplit) {
    return [new Date(dataSplit[0]), new Date(dataSplit[1])];
  } else {
    return [];
  }
};

export const dateWithOutTime = (input) => {
  const dateObj = new Date(input);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("default", { month: "short" });
  const year = dateObj.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;
  return formattedDate;
};
export function formatDatePromoCodePreview(inputDate) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
export function formatDatePromoCodePreviewForString(inputDate) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export const calculatePercentageOfValue = (singleValue, allProgressValues) => {
  if (Math.max(...allProgressValues)) {
    return (singleValue / Math.max(...allProgressValues)) * 100;
  } else {
    return singleValue;
  }
};

export const handleSetSectionVisibility = (
  isVisible,
  isScrolled,
  setIsScrolled
) => {
  if (isVisible) {
    if (!isScrolled) {
      setIsScrolled(true);
    }
  }
};
export const getPublisherValue = (publisherApplicationType, allLeadSummary) => {
  if (!allLeadSummary || allLeadSummary?.length === 0) {
    return 0;
  }

  switch (publisherApplicationType) {
    case "total":
      return allLeadSummary[0]?.total_application || 0;
    case "primary":
      return allLeadSummary[0]?.primary_application_count || 0;
    case "secondary":
      return allLeadSummary[0]?.secondary_application_count || 0;
    case "tertiary":
      return allLeadSummary[0]?.tertiary_application_count || 0;
    default:
      return 0;
  }
};
export const getPublisherIndicatorPercentage = (
  publisherApplicationType,
  allLeadSummary
) => {
  if (!allLeadSummary || allLeadSummary?.length === 0) {
    return "0.00";
  }

  let indicator = 0;

  switch (publisherApplicationType) {
    case "total":
      indicator = parseFloat(
        allLeadSummary[0]?.total_application_change_indicator
          ?.total_application_perc_indicator || 0
      );
      break;
    case "primary":
      indicator = parseFloat(
        allLeadSummary[0]?.primary_application_count_change_indicator
          ?.primary_application_count_perc_indicator || 0
      );
      break;
    case "secondary":
      indicator = parseFloat(
        allLeadSummary[0]?.secondary_application_count_change_indicator
          ?.secondary_application_count_perc_indicator || 0
      );
      break;
    case "tertiary":
      indicator = parseFloat(
        allLeadSummary[0]?.tertiary_application_count_change_indicator
          ?.tertiary_application_count_perc_indicator || 0
      );
      break;
    default:
      indicator = 0;
  }

  return indicator.toFixed(2);
};
export const getPublishIndicatorPosition = (
  publisherApplicationType,
  allLeadSummary
) => {
  if (!allLeadSummary || allLeadSummary?.length === 0) {
    return null;
  }

  let position;

  switch (publisherApplicationType) {
    case "total":
      position =
        allLeadSummary[0]?.total_application_change_indicator
          ?.total_application_pos_indicator;
      break;
    case "primary":
      position =
        allLeadSummary[0]?.primary_application_count_change_indicator
          ?.primary_application_count_pos_indicator;
      break;
    case "secondary":
      position =
        allLeadSummary[0]?.secondary_application_count_change_indicator
          ?.secondary_application_count_pos_indicator;
      break;
    case "tertiary":
      position =
        allLeadSummary[0]?.tertiary_application_count_change_indicator
          ?.tertiary_application_count_pos_indicator;
      break;
    default:
      position = null;
  }

  return position;
};
export const getPublisherClassName = (dataRow) => {
  if (dataRow?.payment_status?.length) {
    return dataRow?.payment_status?.toLowerCase() === "in-progress" ||
      dataRow?.payment_status?.toLowerCase() === "failed"
      ? "publisher-payment-status-in-progress"
      : "publisher-payment-status-box";
  }
  return "status";
};
export const getFormStatusClass = (dataRow) => {
  const formStatus = dataRow?.form_status?.toLowerCase();

  if (formStatus === "completed") {
    return "publisher-payment-status-in-progress";
  } else if (formStatus === "in progress") {
    return "publisher-payment-status-completed";
  } else {
    return "publisher-payment-status-in-progress";
  }
};
export const getPublisherLeadTypeClass = (dataRow) => {
  if (dataRow?.lead_type?.length > 0) {
    return dataRow.lead_type.toLowerCase() === "api"
      ? "publisher-payment-status-box"
      : "publisher-payment-status-completed";
  }
  return "status";
};
export const getTemplateEmailParams = (item, mood) => ({
  dataJson: item?.template_json,
  addedTags: item?.added_tags,
  individualTemplateName: item?.template_name,
  subject: item?.subject,
  email_type: item?.email_type,
  email_provider: item?.email_provider,
  email_category: item?.email_category,
  mood: mood,
  select_members: item?.selected_members,
  select_profile_role: item?.select_profile_role,
  sender_email_id: item?.sender_email_id,
  reply_to_email: item?.reply_to_email,
  attachment_document_link: item?.attachment_document_link,
});
export const getTemplateSmsParams = (item, mood) => ({
  content: item?.content,
  addedTags: item?.added_tags,
  individualTemplateName: item?.template_name,
  dltContentId: item?.dlt_content_id,
  smsType: item?.sms_type,
  senderName: item?.sender,
  smsCategory: item?.sms_category,
  mood: mood,
  select_members: item?.selected_members,
  select_profile_role: item?.select_profile_role,
});
export const getTemplateWhatsAppParams = (item, mood) => ({
  content: item?.content,
  addedTags: item?.added_tags,
  individualTemplateName: item?.template_name,
  templateId: item?.whatsapp_template_id,
  mood: mood,
  select_members: item?.selected_members,
  select_profile_role: item?.select_profile_role,
  add_template_option_url: item?.add_template_option_url,
  attachmentType: item?.attachment_type,
  attachmentURL: item?.attachment_url,
  template_type_option: item?.template_type_option,
});
export const updateTemplateMembersLabels = (arr) => {
  return arr?.map((item) => {
    if (item.label === null) {
      return { ...item, label: "NA" };
    }
    return item;
  });
};
export function createPreferenceList(count) {
  if (count === 0) {
    return [];
  }
  const arrayOfObjects = [
    {
      label: "Any Preference",
      value: "Any Preference",
    },
  ];

  for (let i = 0; i < count; i++) {
    arrayOfObjects.push({
      label: `Preference ${i + 1}`,
      value: `Preference ${i + 1}`,
    });
  }

  return arrayOfObjects;
}
export const safeJsonParse = (str) => {
  try {
    return JSON.parse(str)?.season_id;
  } catch (error) {
    return "";
  }
};
export function splitFullName(fullName) {
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const middleName =
    nameParts.length > 2
      ? nameParts.slice(1, nameParts.length - 1).join(" ")
      : "";

  return {
    firstName,
    middleName,
    lastName,
  };
}

export function addDynamicNestedDependentField({
  fields,
  targetKeyPath,
  selectedOption,
  selectedFields,
  pushNotification,
}) {
  const updatedFields = structuredClone(fields);

  function updateFields(fieldArray, path) {
    if (path.length === 0) return;

    let keyName = path[0];
    let remainingPath = path.slice(1);

    for (let field of fieldArray) {
      if (field.key_name === keyName) {
        if (remainingPath.length === 0) {
          // We are at the target field, add the dependent field

          const foundSameFieldInSelectedFields = selectedFields.find(
            (selectedField) => selectedField.key_name === field.key_name
          );
          if (foundSameFieldInSelectedFields) {
            // show error message if the parent field matches with any of the dependent fields
            pushNotification(
              "error",
              `${foundSameFieldInSelectedFields.field_name} can't be the dependent field of ${field.field_name} itself!`
            );
          } else {
            // Ensure dependent_fields structure exists
            if (!field.dependent_fields) {
              field.dependent_fields = { logical_fields: {} };
            }
            if (!field.dependent_fields.logical_fields[selectedOption]) {
              field.dependent_fields.logical_fields[selectedOption] = {
                fields: [],
              };
            }

            // Add the new dependent field
            field.dependent_fields.logical_fields[selectedOption].fields =
              selectedFields;
          }
        } else {
          // Recurse deeper
          if (field.dependent_fields?.logical_fields) {
            for (let option in field.dependent_fields.logical_fields) {
              updateFields(
                field.dependent_fields.logical_fields[option].fields,
                remainingPath
              );
            }
          }
        }
      }
    }
  }

  updateFields(updatedFields, targetKeyPath);
  return updatedFields;
}

export const getDependentFieldsByTargetKeyPath = (
  fields,
  targetKeyPath,
  selectedOption
) => {
  let dependentFields = [];
  function findDependentFields(fieldArray, path) {
    if (path.length === 0) return;
    let keyName = path[0];
    let remainingPath = path.slice(1);
    for (let field of fieldArray) {
      if (field?.key_name === keyName) {
        if (field?.dependent_fields?.logical_fields?.[selectedOption]) {
          dependentFields =
            field?.dependent_fields?.logical_fields?.[selectedOption]?.fields ||
            [];
        } else {
          if (field.dependent_fields?.logical_fields) {
            for (let option in field.dependent_fields.logical_fields) {
              findDependentFields(
                field?.dependent_fields?.logical_fields?.[option]?.fields || [],
                remainingPath
              );
            }
          }
        }
      }
    }
  }
  findDependentFields(fields, targetKeyPath);
  return dependentFields;
};

export const deleteDynamicNestedDependentField = ({
  fields,
  targetKeyPath,
  selectedOption,
  startingIndex,
  updatedField,
}) => {
  const updatedFields = structuredClone(fields);
  function deleteFields(fieldArray, path) {
    if (path.length === 0) return;
    let keyName = path[0];
    let remainingPath = path.slice(1);
    for (let field of fieldArray) {
      if (field.key_name === keyName) {
        if (remainingPath.length === 0) {
          // We are at the target field, delete the dependent field
          if (field.dependent_fields?.logical_fields?.[selectedOption]) {
            if (updatedField) {
              // this is to update
              field.dependent_fields.logical_fields[selectedOption].fields[
                startingIndex
              ] = updatedField;
            } else {
              // this is to delete
              field.dependent_fields.logical_fields[
                selectedOption
              ].fields.splice(startingIndex, 1);
            }
          }
        } else {
          // Recurse deeper
          if (field.dependent_fields?.logical_fields) {
            for (let option in field.dependent_fields.logical_fields) {
              deleteFields(
                field.dependent_fields.logical_fields[option].fields,
                remainingPath
              );
            }
          }
        }
      }
    }
  }
  deleteFields(updatedFields, targetKeyPath);
  return updatedFields;
};
export function transformColorObject(input) {
  return {
    additional: {
      100: input.additional["100"],
      500: input.additional["500"],
      600: input.additional["600"],
    },
    background: {
      ...input.background,
    },
    divider: input.divider.default,
    button: {
      default: input.button.default,
      dark: input.button.dark,
      contrastText: input.button.contrastText,
    },
    primary: {
      main: input.primary.main,
      dark: input.primary.dark,
      contrastText: input.primary.contrastText,
      sidebarButton: input.primary.sidebarButton,
    },
    text: {
      default: input.text.Default || input.text.default,
      primary: input.text.primary,
      secondary: input.text.secondary,
      contrastText: input.text.contrastText,
    },
  };
}

export function formatInput(input) {
  const withoutUnderscore = input.replace(/_/g, " ");
  return withoutUnderscore.charAt(0).toUpperCase() + withoutUnderscore.slice(1);
}
export function convertToLabelValueArray(data) {
  return data?.map((item) => ({
    label: item.name,
    value: item.monthly_total,
  }));
}
export function updateThemeColors(allColorObject, existingColorThemesObject) {
  const updatedTheme = {};

  for (const section in existingColorThemesObject) {
    updatedTheme[section] = existingColorThemesObject[section].map((item) => {
      const key = item.label;
      const colorFromSource =
        allColorObject[section]?.[key] || allColorObject[section] || item.color;
      return {
        ...item,
        color: colorFromSource,
      };
    });
  }

  return updatedTheme;
}

// this function is to delete a feature depending on the target key (feature_id | name)
export function findAndDeleteFeatureByKeyName({ addedFeatures, targetKey }) {
  return addedFeatures
    .filter((item) =>
      item?.feature_id
        ? item?.feature_id === targetKey
        : item.name !== targetKey
    )
    .map((item) => ({
      ...item,
      features: item.features
        ? findAndDeleteFeatureByKeyName({
            addedFeatures: item.features,
            targetKey,
          })
        : [],
    }));
}

// this function is to find and edit an existing feature
export function findAndEditFeature({
  editedValues,
  targetKey,
  features,
  isAddingSubFeature,
}) {
  return features.map((item) => {
    let updatedItem = {};

    if (
      item?.feature_id
        ? item?.feature_id === targetKey
        : item?.name === targetKey
    ) {
      if (isAddingSubFeature) {
        updatedItem = {
          ...item,
          features: item?.features?.length ? item.features : [],
        };
        updatedItem.features.push(editedValues);
      } else {
        updatedItem = { ...editedValues, features: item.features || [] };
      }
    } else {
      updatedItem = {
        ...item,
        features: findAndEditFeature({
          features: item?.features?.length ? item.features : [],
          targetKey,
          editedValues,
          isAddingSubFeature,
        }),
      };
    }
    return updatedItem;
  });
}

// this function is used to transform the original data into tree format that reactFlow accepts. Like creating nodes and edges from the original data
export const transformTreeToFlow = ({
  tree,
  onEdit,
  onDelete,
  onAdd,
  showAddNestedFeature,
  showDelete,
  onSelect,
  showCheckbox,
  selectedFeatures,
  onExpand,
  onCollapse,
  hideExpand,
}) => {
  const nodes = [];
  const edges = [];

  const traverse = (nodesTree, parentId = null) => {
    nodesTree.forEach((node, index) => {
      const nodeId = node?.feature_id || node?.name;

      nodes.push({
        id: nodeId,
        data: {
          node,
          onEdit,
          onDelete,
          onAdd,
          showAddNestedFeature,
          showDelete,
          treeDirection: "TB",
          onSelect,
          showCheckbox,
          selectedFeatures,
          isParent: parentId === null ? true : false,
          parentId,
          onExpand,
          onCollapse,
          index,
        },
        position: { x: 0, y: 0 },
        type: "customNode",
      });

      if (parentId) {
        edges.push({
          source: parentId,
          target: nodeId,
          animated: true,
          type: "step",
        });
      } else {
      }

      if (node.features && node.features.length) {
        traverse(node.features, nodeId);
      }
    });
  };

  traverse(tree);

  return { nodes, edges };
};

// this function is to set the layout of nodes and edges so that the tree can render in the UI perfectly, the Default direction is LR (left to right). We are using darge package to makes it easy to lay out directed graphs on the client-side
export const getLayoutedElements = (nodes, edges, direction = "LR") => {
  const nodeWidth = 200;
  const nodeHeight = 100;
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction, ranksep: 250, nodesep: 150 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? "left" : "top";
    node.sourcePosition = isHorizontal ? "right" : "bottom";

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export const handleFeatureSelect = (
  node,
  selectedFeatures,
  setSelectedFeatures
) => {
  const isAlreadySelected = selectedFeatures?.some(
    (feature) => feature.feature_id === node.feature_id
  );

  if (isAlreadySelected) {
    // Remove the feature
    setSelectedFeatures(
      selectedFeatures?.filter(
        (feature) => feature.feature_id !== node.feature_id
      )
    );
  } else {
    // Add the feature
    setSelectedFeatures([...selectedFeatures, node]);
  }
};

//Find the parent feature and add sub feature
export const addFeatureAndGetParent = (features, parentId, newFeature) => {
  const updatedFeatures = JSON.parse(JSON.stringify(features));
  let topLevelParent = null;

  const findAndUpdate = (featureList, currentParent = null) => {
    for (let i = 0; i < featureList.length; i++) {
      const feature = featureList[i];

      if (feature.feature_id === parentId) {
        feature.features = feature.features || [];
        feature.features.push({
          ...newFeature,
        });

        // Return the top-most parent in the hierarchy
        return currentParent || feature;
      }

      if (feature.features) {
        const result = findAndUpdate(
          feature.features,
          currentParent || feature
        );
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  topLevelParent = findAndUpdate(updatedFeatures);
  return { updatedFeatures, topLevelParent };
};

//Find the parent feature and edit feature
export const findAndEditFeatureEnhanced = (features, targetId, updates) => {
  const updatedFeatures = JSON.parse(JSON.stringify(features));
  let result = {
    updatedFeatures,
    editedFeature: null,
    topLevelParent: null,
    parentFeatures: [], // All parents in hierarchy (bottom-up)
  };

  const recursiveEdit = (featureList, currentHierarchy = []) => {
    for (let i = 0; i < featureList.length; i++) {
      const feature = featureList[i];
      const newHierarchy = [...currentHierarchy, feature];

      if (feature.feature_id === targetId) {
        Object.assign(feature, updates);
        result.editedFeature = feature;
        result.topLevelParent = currentHierarchy[0] || feature;
        result.parentFeatures = currentHierarchy;
        return true;
      }

      if (feature.features) {
        if (recursiveEdit(feature.features, newHierarchy)) {
          return true;
        }
      }
    }
    return false;
  };

  recursiveEdit(updatedFeatures);
  return result;
};

export const returnOnlyParentFeatures = (features) => {
  return features.map((feature) => {
    const updatedFeature = { ...feature };
    if (feature?.features?.length) {
      updatedFeature.expandable = true;
      delete updatedFeature.features;
    } else {
      updatedFeature.expandable = false;
    }
    return updatedFeature;
  });
  // .sort((a, b) => b.expandable - a.expandable); // expandable at first the end
};

export const returnFeatureWithSubFeature = ({
  addedFeatures,
  listOfFeatures,
  node,
}) => {
  const updatedListOfFeature = structuredClone(listOfFeatures);
  const getFoundSubFeatures = (features) => {
    for (const feature of features || []) {
      if (
        feature?.feature_id === node?.feature_id ||
        feature?.name === node?.name
      ) {
        return feature?.features;
      }
      const result = getFoundSubFeatures(feature?.features);
      if (result) return result;
    }
    return null;
  };

  const findAndAddSubFeatures = (features, subFeatures) => {
    for (const feature of features || []) {
      if (
        feature?.feature_id === node?.feature_id ||
        feature?.name === node?.name
      ) {
        feature.features = subFeatures;
        return feature;
      }
      const result = findAndAddSubFeatures(feature?.features, subFeatures);
      if (result) return result;
    }
    return null;
  };

  const subFeatures = getFoundSubFeatures(addedFeatures);
  const reduceChildren = returnOnlyParentFeatures(subFeatures);

  findAndAddSubFeatures(updatedListOfFeature, reduceChildren);

  return updatedListOfFeature;
};

export const removeSubFeaturesFromNode = ({ listOfFeatures, node }) => {
  const updatedList = structuredClone(listOfFeatures);

  const stack = [...updatedList];

  while (stack.length > 0) {
    const feature = stack.pop();

    // Check if it's the target node
    if (
      feature?.feature_id === node?.feature_id ||
      feature?.name === node?.name
    ) {
      delete feature.features;
      break; // Stop after first match
    }

    if (feature?.features?.length) {
      stack.push(...feature.features);
    }
  }

  return updatedList;
};
export function convertStringBooleans(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertStringBooleans);
  } else if (obj !== null && typeof obj === "object") {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = convertStringBooleans(obj[key]);
      }
    }
    return newObj;
  } else if (obj === "true") {
    return true;
  } else if (obj === "false") {
    return false;
  }
  return obj;
}
export function formatLabel(input) {
  return input
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
export function convertBooleansToStrings(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertBooleansToStrings);
  } else if (obj !== null && typeof obj === "object") {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = convertBooleansToStrings(obj[key]);
      }
    }
    return newObj;
  } else if (obj === true) {
    return "true";
  } else if (obj === false) {
    return "false";
  }
  return obj;
}

export const setFeatureKeyInCookie = (featureKey) => {
  Cookies.set("feature_key", featureKey);
};

export const getFeatureKeyFromCookie = () => {
  return Cookies.get("feature_key");
};

export const customFetch = (url, header, questionMark) => {
  return fetch(
    `${url}${questionMark ? `?` : "&"}feature_key=${getFeatureKeyFromCookie()}`,
    header
  );
};
