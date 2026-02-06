import React from "react";
import { Button, CheckPicker, Checkbox } from "rsuite";

const footerStyles = {
  padding: "10px 2px",
  borderTop: "1px solid #e5e5e5",
  display: "flex",
  justifyContent: "space-between",
  marginRight: 10,
};

const CustomRawDataSelectPicker = ({
  multiCascaderDefaultValue,
  placeholder,
  setMultiCascaderDefaultValue,
  columnOption,
  readOnly,
  loading,
  onOpen,
  style,
  placement,
  maxHeight,
}) => {
  const picker = React.useRef();

  const allValue = columnOption?.map((item) => item.value);

  const handleCheckAll = (_, checked) => {
    setMultiCascaderDefaultValue(checked ? allValue : []);
  };

  return (
    <CheckPicker
      menuMaxHeight={maxHeight}
      placement={placement}
      loading={loading}
      onOpen={onOpen}
      readOnly={readOnly}
      data={columnOption}
      value={multiCascaderDefaultValue ? multiCascaderDefaultValue : []}
      defaultValue={multiCascaderDefaultValue}
      placeholder={placeholder}
      className="select-picker"
      onChange={(values) => {
        setMultiCascaderDefaultValue(values);
      }}
      ref={picker}
      style={style}
      renderMenuItem={(label, value) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{label}</div>
          <div>{value?.value?.count}</div>
        </div>
      )}
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

export default CustomRawDataSelectPicker;
