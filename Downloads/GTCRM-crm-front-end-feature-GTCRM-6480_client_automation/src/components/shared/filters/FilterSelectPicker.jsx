import React from "react";
import { SelectPicker } from "rsuite";
import { addFilterOptionToCookies } from "../../../helperFunctions/advanceFilterHelperFunctions";
const FilterSelectPicker = ({
  size,
  searchedEmail,
  pickerData,
  pickerValue,
  placeholder,
  handleFilterOption,
  setSelectedPicker,
  filterOptionParams,
  resetSelectedFilters,
  setSelectedFilter,
  readOnly,
  setSelectedLeadStageLabel,
  from,
  setPageNumber,
  loading,
  onOpen,
  className,
  setSkipApiCall,
  style,
  placement,
  hideSearch,
  maxHeight,
}) => {
  return (
    <SelectPicker
      menuMaxHeight={maxHeight}
      searchable={hideSearch ? false : true}
      placement={placement ? placement : "auto"}
      size={size}
      loading={loading}
      onOpen={onOpen}
      readOnly={readOnly}
      style={style}
      disabled={searchedEmail?.length ? true : false}
      onChange={(value) => {
        if (filterOptionParams) {
          const filterObj = filterOptionParams[2];
          filterObj[filterOptionParams[0]][filterOptionParams[1]] = value;
          handleFilterOption(filterObj);
        }
        if (resetSelectedFilters) {
          resetSelectedFilters();
        }
        setSelectedPicker(value);
        setSelectedFilter && setSelectedFilter(null);
        setSelectedLeadStageLabel && setSelectedLeadStageLabel("");
        setPageNumber && setPageNumber(1);
        if (from === "lead-stage") {
          const filterObj = { lead_stage_label: {} };
          filterObj["lead_stage_label"]["lead_stage_label_name"] = "";
          handleFilterOption(filterObj);
        }
        setSkipApiCall && setSkipApiCall(true);

        // adding the selected filters in the cookies to show in the advance filter drawer
        addFilterOptionToCookies(
          from,
          placeholder,
          value,
          pickerData,
          "select"
        );
      }}
      data={pickerData}
      placeholder={placeholder}
      value={pickerValue}
      defaultValue={pickerValue}
      className={className ? className : "select-picker"}
    />
  );
};

export default FilterSelectPicker;
