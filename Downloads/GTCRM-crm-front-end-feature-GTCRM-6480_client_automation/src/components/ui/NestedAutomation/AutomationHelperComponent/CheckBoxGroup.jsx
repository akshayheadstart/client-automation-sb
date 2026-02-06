import React from "react";
import { Checkbox, CheckboxGroup } from "rsuite";
import "../../../../styles/automationTreeDesign.css";

const CheckBoxGroupWeeks = ({
  readOnlyBoxes,
  daysRange,
  handleSetData,
  validation,
  allowedDays,
}) => {
  const weekValue = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  return (
    <CheckboxGroup
      value={daysRange}
      id="automation-checkboxes"
      inline
      name="checkboxList"
      onChange={(value) => {
        handleSetData(value);
      }}
      readOnly={readOnlyBoxes === true ? true : false}
    >
      {weekValue.map((checkbox, index) => (
        <Checkbox
          disabled={validation ? !allowedDays?.includes(checkbox) : false}
          key={index}
          value={checkbox}
        >
          <p id="weekend-days-title">{checkbox?.slice(0, 3)}</p>
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
};

export default CheckBoxGroupWeeks;
