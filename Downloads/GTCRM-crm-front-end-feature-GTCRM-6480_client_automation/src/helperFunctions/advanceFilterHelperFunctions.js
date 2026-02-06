import Cookies from "js-cookie";

export const addFilterOptionToCookies = (
  localStorageKey,
  fieldName,
  value,
  pickerData,
  fieldType
) => {
  const maxOptionsPerBlock = 5;
  const userId = Cookies.get("userId");
  const storageKey = `${userId}${localStorageKey}AdvanceFilterOptions`;

  let existingFilterBlocks = localStorage.getItem(storageKey)
    ? JSON.parse(localStorage.getItem(storageKey))
    : [];

  // Find the last block or add a new block if needed
  let lastBlock;
  if (
    existingFilterBlocks.length === 0 ||
    existingFilterBlocks[existingFilterBlocks.length - 1].filterOptions
      .length === maxOptionsPerBlock
  ) {
    const newBlock = {
      id: existingFilterBlocks.length + 1,
      blockCondition: "AND",
      color: "#039bdc !important",
      filterOptions: [],
      conditionBetweenBlock: "AND",
    };
    existingFilterBlocks.push(newBlock);
    lastBlock = newBlock;
  } else {
    lastBlock = existingFilterBlocks[existingFilterBlocks.length - 1];
  }

  // Remove the existing option with an empty fieldName
  const emptyFieldNameIndex = lastBlock.filterOptions.findIndex(
    (option) => option.fieldName === ""
  );
  if (emptyFieldNameIndex !== -1) {
    lastBlock.filterOptions.splice(emptyFieldNameIndex, 1);
  }

  // Check if the field already exists in the last block
  const existingOptionIndex = lastBlock.filterOptions.findIndex(
    (option) => option.fieldName === fieldName
  );

  if (value != null && value.length > 0) {
    // Add a new option or update the existing one
    const newFilterOption = {
      fieldName: fieldName,
      operator: "Equal",
      value: value,
      operators: ["Equal"],
      selectOption: pickerData,
      fieldType: fieldType,
    };

    if (existingOptionIndex !== -1) {
      // Update the existing option
      lastBlock.filterOptions[existingOptionIndex] = {
        ...lastBlock.filterOptions[existingOptionIndex],
        ...newFilterOption,
      };
    } else {
      // Add a new option
      lastBlock.filterOptions.push(newFilterOption);
    }
  } else {
    // Remove the matching filter option from all blocks
    existingFilterBlocks.forEach((block, blockIndex) => {
      const matchingIndex = block.filterOptions.findIndex(
        (option) => option.fieldName === fieldName
      );
      if (matchingIndex !== -1) {
        block.filterOptions.splice(matchingIndex, 1);
        // Remove the whole block if there are no other objects
        if (
          block.filterOptions.length === 0 &&
          existingFilterBlocks.length > 1
        ) {
          existingFilterBlocks.splice(blockIndex, 1);
        }
      }
    });
  }

  // Ensure there is at least one filter option in the last block
  if (lastBlock.filterOptions.length === 0) {
    lastBlock.filterOptions.push({
      fieldName: "",
      operator: "",
      value: "",
      operators: "",
      selectOption: "",
      fieldType: "select",
    });
  }

  // Save the updated filter blocks to local storage
  localStorage.setItem(storageKey, JSON.stringify(existingFilterBlocks));
};

export function convertKeysToCamelCase(obj) {
  const camelCaseObj = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Exclude certain keys from camelCase conversion
      if (key === "collection_field_name" || key === "collection_name") {
        camelCaseObj[key] = obj[key];
      } else {
        const camelCaseKey = key.replace(/_([a-z])/g, (match, group1) =>
          group1.toUpperCase()
        );

        if (camelCaseKey === "selectOption" && Array.isArray(obj[key])) {
          // Transform the array into an array of objects with label and value
          if (camelCaseObj?.fieldName === "Country") {
            camelCaseObj[camelCaseKey] = obj[key].map((option) => ({
              label: "India",
              value: "IN",
            }));
          } else {
            camelCaseObj[camelCaseKey] = obj[key].map((option) => ({
              label: option,
              value: option,
            }));
          }
        } else {
          camelCaseObj[camelCaseKey] = obj[key];
        }
      }
    }
  }

  return camelCaseObj;
}

export const findDependentField = (fieldName, filterBlocks) => {
  for (const block of filterBlocks) {
    for (const filterOption of block?.filterOptions) {
      if (filterOption.fieldName === fieldName) {
        return filterOption;
      }
    }
  }
  return null;
};

export const advFilterFieldsAPICall = (
  filterBlocks,
  filterOption,
  functions,
  setAdvFilterAPICallFunc
) => {
  setAdvFilterAPICallFunc("");

  if (filterOption?.dependentFields?.length > 0) {
    const dependentFieldName = filterOption?.dependentFields?.[0];
    const dependentField = findDependentField(dependentFieldName, filterBlocks);

    if (dependentField?.value?.length > 0) {
      const functionName = filterOption?.selectOptionFunction;

      const dependentFieldValue =
        functionName === "handleStateAPI" ? "IN" : dependentField.value;

      if (
        functions[functionName] &&
        typeof functions[functionName] === "function"
      ) {
        // Dynamically call the function
        functions[functionName](dependentFieldValue);

        setAdvFilterAPICallFunc(functionName);
      }
    }
  } else if (filterOption?.selectOptionFunction) {
    const functionName = filterOption?.selectOptionFunction;

    if (
      functions[functionName] &&
      typeof functions[functionName] === "function"
    ) {
      // Dynamically call the function
      functions[functionName]();
      setAdvFilterAPICallFunc(functionName);
    }
  }
};

export function checkAdvFilterConditions(array) {
  for (let i = 0; i < array.length; i++) {
    const currentObject = array[i];

    // Check if filterOptions fieldName and operator are selected
    if (
      i < array.length &&
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
