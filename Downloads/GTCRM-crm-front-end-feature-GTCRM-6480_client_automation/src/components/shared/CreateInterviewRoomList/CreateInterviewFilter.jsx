import React from "react";
import { Button, CheckPicker, Checkbox } from "rsuite";

const footerStyles = {
  padding: "10px 2px",
  borderTop: "1px solid #e5e5e5",
  display: "flex",
  justifyContent: "space-between",
  marginRight: 10,
};

const MultipleFilterSelectionInterviewModule = ({
  data,
  placeholder,
  loading,
  onOpen,
  groupBy,
  value,
  setValue,
  className,
  size,
  placement,
  onClose,
}) => {
  const picker = React.useRef();

  const allValue = data?.map((item) => item.value);

  const handleCheckAll = (value, checked) => {
    setValue(checked ? allValue : []);
  };

  return (
    <CheckPicker
      onClose={onClose}
      size={size}
      className={className}
      loading={loading}
      onOpen={onOpen}
      groupBy={groupBy}
      data={data}
      value={value}
      appearance="default"
      placement={placement}
      placeholder={placeholder}
      onChange={(values) => {
        setValue(values);
      }}
      ref={picker}
      renderExtraFooter={() => (
        <div style={footerStyles}>
          <Checkbox
            checked={value?.length === allValue?.length && value?.length !== 0}
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

export default MultipleFilterSelectionInterviewModule;
