export const allCheckboxHandlerFunction = (
  e,
  localStorageKeyName,
  allIds,
  selectedItems,
  setSelectedItems
) => {
  if (e.target.checked === true) {
    const selectedAutomationJobs = JSON.parse(
      localStorage.getItem(localStorageKeyName)
    );
    if (selectedAutomationJobs?.length > 0) {
      const filteredApplications = allIds.filter(
        (element) => !selectedAutomationJobs.includes(element)
      );

      setSelectedItems((currentArray) => [
        ...currentArray,
        ...filteredApplications,
      ]);
      localStorage.setItem(
        localStorageKeyName,
        JSON.stringify([...selectedAutomationJobs, ...filteredApplications])
      );
    } else {
      setSelectedItems(allIds);
      localStorage.setItem(localStorageKeyName, JSON.stringify(allIds));
    }
  } else {
    const filteredApplications = selectedItems?.filter(
      (element) => !allIds.includes(element)
    );
    setSelectedItems(filteredApplications);
    localStorage.setItem(
      localStorageKeyName,
      JSON.stringify(filteredApplications)
    );
  }
};

export const singleCheckboxHandlerFunction = (
  e,
  selectedId,
  localStorageKeyName,
  selectedItems,
  setSelectedItems
) => {
  if (e.target.checked === true) {
    if (selectedItems?.length < 1) {
      setSelectedItems([selectedId]);
      localStorage.setItem(localStorageKeyName, JSON.stringify([selectedId]));
    } else if (!selectedItems?.includes(selectedId)) {
      setSelectedItems((currentArray) => [...currentArray, selectedId]);

      localStorage.setItem(
        localStorageKeyName,
        JSON.stringify([...selectedItems, selectedId])
      );
    }
  } else {
    var index = selectedItems?.indexOf(selectedId);
    if (index !== -1) selectedItems.splice(index, 1);
    setSelectedItems((currentArray) => [...currentArray]);
    localStorage.setItem(
      localStorageKeyName,
      JSON.stringify([...selectedItems])
    );
  }
};

export const showCheckboxAndIndeterminate = (
  allIds,
  selectedItems,
  setSelectTopCheckbox,
  setShowIndeterminate
) => {
  let itemCount = 0;
  allIds.forEach((item) => {
    if (selectedItems?.indexOf(item) !== -1) itemCount++;
  });

  if (itemCount === allIds.length && itemCount > 0) {
    setSelectTopCheckbox(true);
  } else {
    setSelectTopCheckbox(false);
  }

  if (itemCount < allIds.length && itemCount > 0) {
    setShowIndeterminate(true);
  } else {
    setShowIndeterminate(false);
  }
};

export const handleLocalStorageForCheckbox = (
  localStorageKeyName,
  setSelectedItems
) => {
  const selectedItems = JSON.parse(localStorage.getItem(localStorageKeyName));
  if (selectedItems?.length > 0) {
    setSelectedItems(selectedItems);
  }
};
