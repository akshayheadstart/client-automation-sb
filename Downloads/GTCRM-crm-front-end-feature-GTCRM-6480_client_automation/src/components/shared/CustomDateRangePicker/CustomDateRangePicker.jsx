import React from "react";
import { DateRangePicker } from "rsuite";
const CustomDateRangePicker = ({
  filterDateValue,
  searchFieldToggle,
  setFilterDateValue,
  handleFilterOption,
}) => {
  return (
    <>
      <DateRangePicker
        appearance="subtle"
        placeholder="Date Range"
        value={filterDateValue?.length ? filterDateValue : null}
        defaultOpen={searchFieldToggle}
        onChange={(value) => {
          setFilterDateValue(value ? value : {});
          if (value?.length > 0) {
            handleFilterOption({
              date_range: {
                start_date: value[0],
                end_date: value[1],
              },
            });
          } else {
            handleFilterOption({
              date_range: { start_date: "", end_date: "" },
            });
          }
        }}
        placement="bottomEnd"
        className="date-range-btn select-picker"
      />
    </>
  );
};

export default CustomDateRangePicker;
