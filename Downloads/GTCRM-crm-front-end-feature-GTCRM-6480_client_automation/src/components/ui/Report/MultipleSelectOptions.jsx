import React from "react";
import { Button, CheckPicker, Checkbox } from "rsuite";
import { addFilterOptionToCookies } from "../../../helperFunctions/advanceFilterHelperFunctions";

const footerStyles = {
  padding: "10px 2px",
  borderTop: "1px solid #e5e5e5",
  display: "flex",
  justifyContent: "space-between",
  marginRight: 10,
};

const MultipleSelectOptions = ({
  searchedEmail,
  multiCascaderDefaultValue,
  placeholder,
  handleCustomizeColumn,
  setMultiCascaderDefaultValue,
  columnOption,
  readOnly,
  setSelectedLeadStageLabel,
  groupBy,
  loading,
  onOpen,
  style,
  from,
}) => {
  const picker = React.useRef();

  const allValue = columnOption.map((item) => item.value);

  const handleCheckAll = (value, checked) => {
    setMultiCascaderDefaultValue(checked ? allValue : []);

    //setting the selected filter in the cookie to show in advance filter
    addFilterOptionToCookies(
      from,
      placeholder,
      allValue,
      columnOption,
      "multiple-select"
    );
  };

  return (
    <CheckPicker
      placement="auto"
      loading={loading}
      onOpen={onOpen}
      groupBy={groupBy}
      readOnly={readOnly}
      disabled={searchedEmail?.length ? true : false}
      data={columnOption}
      value={multiCascaderDefaultValue ? multiCascaderDefaultValue : []}
      defaultValue={multiCascaderDefaultValue}
      appearance="default"
      placeholder={placeholder}
      className="select-picker"
      onChange={(values) => {
        handleCustomizeColumn && handleCustomizeColumn(values);
        setMultiCascaderDefaultValue(values);
        setSelectedLeadStageLabel && setSelectedLeadStageLabel([]);

        //setting the selected filter in the cookie to show in advance filter
        addFilterOptionToCookies(
          from,
          placeholder,
          values,
          columnOption,
          "multiple-select"
        );
      }}
      ref={picker}
      style={style}
      renderExtraFooter={() => (
        <div style={footerStyles}>
          <Checkbox
            checked={
              multiCascaderDefaultValue?.length === allValue?.length &&
              multiCascaderDefaultValue?.length !== 0
            }
            onChange={handleCheckAll}
          >
            Select all
          </Checkbox>

          <Button
            appearance="primary"
            size="sm"
            onClick={() => {
              picker.current.close();
            }}
          >
            Close
          </Button>
        </div>
      )}
    />
  );
};

export default MultipleSelectOptions;
