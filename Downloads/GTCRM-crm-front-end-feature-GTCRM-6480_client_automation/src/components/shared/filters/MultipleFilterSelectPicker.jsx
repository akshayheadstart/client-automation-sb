import React from "react";
import { Button, CheckPicker, Checkbox } from "rsuite";
import { addFilterOptionToCookies } from "../../../helperFunctions/advanceFilterHelperFunctions";
import "../../../styles/sharedStyles.css";

const footerStyles = {
  padding: "10px 2px",
  borderTop: "1px solid #e5e5e5",
  display: "flex",
  justifyContent: "space-between",
  marginRight: 10,
};

/*
    Overview of all the props
    
    1. searchedEmail > This is used to disable the CheckPicker. If the length of searchedEmail found then this CheckPicker will be disabled. It is used in lead manager. (optional)
    2. pickerData > It is the data (options) of the CheckPicker (required)
    3. pickerValue > It is the value of the CheckPicker (required)
    4. placeholder > It is the placeholder of the CheckPicker (required)
    5. handleFilterOption > It is a function for adding data to localStorage. If you need to add selected data to localStorage you can pass this function. (optional).
    6. setSelectedPicker > This props is setting value of the CheckPicker on change (required)
    7. filterOptionParams > This is required for lead manager and paid application to sync the key and value of localStorage filter object
    8. resetSelectedFilters > This is a function to reset all the filters. ex : if you want to reset all the filter with the change of a particular selectOption then you can pass this function. (optional).
    9. setSelectedFilter > This is used for lead manager and paid application to reset the saved filter once user change any of the filters. (optional)
    10. readOnly > If you want to make the CheckPicker readOnly, you can pass the value of this props as true. (optional)
    11. leadStageValue > This is only used in lead manager to store lead stage data to the localStorage. (optional).
    12. from > This is used for lead manager only. (optional for others)
    13. setPageNumber > If you want to change the page number on change of the filter, you can pass it. (optional).
    14. onChange > This is a function required for all the other places except lead manager and paid application to take full control of what should be happen onChange of the CheckPicker. What ever the changes you want to do onEvery changes you can define inside this onChange function. (required except lead manager and paid application)
    15. groupBy > This feature is needed if you want to group the options of the filter. (optional)
    16. setSelectedLeadStageLabel > This is used just for lead manager to reset the label once user change the name like (lead stage name). (optional)
    17. loading > This is required if you want to set a loader on the CheckPicker. (optional)
    18. placement > This is the placement like where this CheckPicker should open. ex (bottomEnd, leftStart ect. ) (optional)
    19. onOpen > If you want to call a api onOpen of the CheckPIcker you can use it. (optional)
    20. style > If you want to add your custom style you can pass the style through this props. (optional).
    21. className > If you want to add your custom className, you can pass the className props. (optional)
 */

const MultipleFilterSelectPicker = ({
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
  leadStageValue,
  from,
  setPageNumber,
  onChange,
  groupBy,
  setSelectedLeadStageLabel,
  loading,
  onOpen,
  placement,
  style,
  setSkipApiCall,
  className,
  callAPIAgain,
  onClean,
  appearance,
  disableField,
  maxHeight,
}) => {
  const picker = React.useRef();

  const allValue = pickerData?.map((item) => item.value);

  const handleCheckAll = (value, checked) => {
    setSelectedPicker(checked ? allValue : []);
    if (onChange) {
      handleFilterOption &&
        handleFilterOption(checked, allValue, leadStageValue);
      setSelectedLeadStageLabel && setSelectedLeadStageLabel([]);
    } else {
      const filterObj = filterOptionParams[2];
      filterObj[filterOptionParams[0]][filterOptionParams[1]] = checked
        ? allValue
        : [];
      handleFilterOption && handleFilterOption(filterObj);
    }
    setSkipApiCall && setSkipApiCall(true);

    // adding the selected filters in the cookies to show in the advance filter drawer
    addFilterOptionToCookies(
      from,
      placeholder,
      allValue,
      pickerData,
      "multiple-select"
    );
  };

  return (
    <CheckPicker
      menuMaxHeight={maxHeight}
      appearance={appearance}
      placement={placement}
      onOpen={onOpen}
      loading={loading}
      readOnly={readOnly}
      disabled={searchedEmail?.length || disableField ? true : false}
      groupBy={groupBy}
      style={style}
      onChange={(value) => {
        if (onChange) {
          onChange(value, leadStageValue);
          setSelectedLeadStageLabel && setSelectedLeadStageLabel([]);
        } else {
          if (filterOptionParams) {
            const filterObj = filterOptionParams[2];
            filterObj[filterOptionParams[0]][filterOptionParams[1]] = value;
            handleFilterOption && handleFilterOption(filterObj);
          }
          if (resetSelectedFilters) {
            resetSelectedFilters();
          }
          setSelectedPicker(value);
          setSelectedFilter && setSelectedFilter("");
          setPageNumber && setPageNumber(1);
          setSelectedLeadStageLabel && setSelectedLeadStageLabel([]);
          // this block of codes is used for lead manager
          if (from === "lead-stage") {
            const filterObj = { lead_stage_label: {} };
            filterObj["lead_stage_label"]["lead_stage_label_name"] = [];
            handleFilterOption && handleFilterOption(filterObj);
          }
        }
        setSkipApiCall && setSkipApiCall(true);

        // adding the selected filters in the cookies to show in the advance filter drawer
        addFilterOptionToCookies(
          from,
          placeholder,
          value,
          pickerData,
          "multiple-select"
        );
      }}
      data={pickerData}
      placeholder={
        <span className="multi-select-picker-placeholder">{placeholder}</span>
      }
      value={pickerValue}
      defaultValue={pickerValue}
      className={className}
      ref={picker}
      onClean={() => {
        onClean && onClean();
      }}
      renderExtraFooter={() => (
        <div style={footerStyles}>
          <Checkbox
            checked={
              pickerValue?.length === allValue?.length &&
              pickerValue?.length !== 0
            }
            onChange={handleCheckAll}
          >
            Select all
          </Checkbox>

          <Button
            appearance="primary"
            size="sm"
            onClick={() => {
              callAPIAgain && callAPIAgain();
              picker.current.close();
            }}
          >
            {callAPIAgain ? "Apply" : "Close"}
          </Button>
        </div>
      )}
    />
  );
};

export default MultipleFilterSelectPicker;
