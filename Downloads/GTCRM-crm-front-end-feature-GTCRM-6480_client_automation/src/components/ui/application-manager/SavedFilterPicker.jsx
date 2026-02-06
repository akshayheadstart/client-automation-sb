import { Box, Radio } from "@mui/material";
import React, { useState } from "react";
import { SelectPicker } from "rsuite";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const SavedFilterPicker = (props) => {
  const {
    savedFilterLoading,
    listOfFilters,
    setFilterPayload,
    filterPayload,
    setCallFilterSaveApi,
    setOpenDeleteFilterDialog,
    resetFilterOptions,
    handleFilterOption,
    settingFilterOptions,
    setDeleteFilterName,
  } = props?.savedFilterProps || {};
  const [selectedValue, setSelectedValue] = useState(null);
  return (
    <SelectPicker
      className={`saved-filter-picker ${
        filterPayload ? "saved-filter-picker-active" : "select-picker"
      }`}
      searchable={false}
      loading={savedFilterLoading}
      placeholder="Select saved filter"
      data={listOfFilters}
      onChange={(value) => {
        setFilterPayload(value);
        resetFilterOptions();

        settingFilterOptions(value ? JSON.parse(value)?.payload : {}, "filter");
        handleFilterOption(value ? JSON.parse(value)?.payload : {});
        setSelectedValue(value);
      }}
      value={filterPayload}
      onOpen={() => {
        setCallFilterSaveApi(true);
      }}
      menuStyle={{ border: '1px solid #007ECC' }}
      renderMenuItem={(label,item) => (
        <>
          <Box className="saved-filter-options">
            {label}{" "}
            <Box sx={{display:"flex",alignItems:'center'}}>
            <Radio  size="small" checked={item.value === selectedValue} color="info" />
            <CloseOutlinedIcon
              onClick={(e) => {
                e.stopPropagation();
                setOpenDeleteFilterDialog(true);
                setDeleteFilterName(label);
              }}
            />
            </Box>
          </Box>
        </>
      )}
    />
  );
};

export default SavedFilterPicker;
