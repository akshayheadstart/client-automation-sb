import { Button } from "@mui/material";
import advanceFilterIcon from "../../../icons/advance-filter-icon.svg";
import "../../../styles/AdvanceFilter.css";

const AdvanceFilterButton = ({
  setOpenAdvanceFilter,
  setAdvanceFilterBlocks,
  selectedReport,
  advFilterLocalStorageKey,
}) => {
  return (
    <Button
      id="advance-filter-button"
      variant="outlined"
      endIcon={<img src={advanceFilterIcon} alt="advance-filter-icon" />}
      onClick={() => {
        setOpenAdvanceFilter(true);
        //set advance filter Blocks for template and preview report
        if (selectedReport?.advance_filter?.length > 0) {
          setAdvanceFilterBlocks(selectedReport?.advance_filter);
          localStorage.setItem(
            advFilterLocalStorageKey,
            JSON.stringify(selectedReport?.advance_filter)
          );
        }
      }}
    >
      Advance Filter
    </Button>
  );
};

export default AdvanceFilterButton;
