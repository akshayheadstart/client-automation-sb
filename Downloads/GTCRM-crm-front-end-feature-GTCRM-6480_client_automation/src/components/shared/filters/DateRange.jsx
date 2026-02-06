import React from "react";
import { DateRangePicker } from "rsuite";
const { allowedMaxDays } = DateRangePicker;

export default function DateRange(props) {
  const { dateRange, setDateRange, allowMaxThirtyDays, setSkipApiCall } = props;
  return (
    <DateRangePicker
      appearance="subtle"
      placeholder="Date Range"
      value={dateRange?.length ? dateRange : null}
      onChange={(value) => {
        setDateRange(value);
        props?.setPageNumber && props?.setPageNumber(1);
        setSkipApiCall && setSkipApiCall(true);
      }}
      placement="bottomEnd"
      style={{ background: "#f7f7f8", marginRight: "10px" }}
      className="date-range-btn"
      disabledDate={allowMaxThirtyDays && allowedMaxDays(30)}
    />
  );
}
