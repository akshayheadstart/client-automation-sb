import React from "react";

import { gapBetweenSlotOptions } from "../../constants/LeadStageList";
import { Autocomplete, TextField } from "@mui/material";

const PanelEditOptions = ({
  gapBetweenSlots,
  setGapBetweenSlots,
  slotCountAndAvailableTime,
  panelOrSlotDetails,
}) => {
  return (
    <>
      <Autocomplete
        disableClearable={true}
        sx={{ width: 200 }}
        options={gapBetweenSlotOptions}
        getOptionLabel={(option) => option.label}
        onChange={(_, data) => setGapBetweenSlots(data)}
        size="small"
        value={gapBetweenSlots}
        renderInput={(params) => (
          <TextField {...params} label="Gap Between Slots" />
        )}
      />
      <TextField
        sx={{ width: 120, fontSize: "11px" }}
        value={slotCountAndAvailableTime.slotCount}
        label="Slot Count"
        readOnly={true}
        size="small"
        color="info"
      />
      <TextField
        sx={{ width: 120 }}
        value={slotCountAndAvailableTime.remainingTime}
        readOnly={true}
        label="Available time"
        size="small"
        color="info"
      />
      <TextField
        sx={{ width: 120 }}
        value={
          panelOrSlotDetails.slot_type === "PI"
            ? 1
            : slotCountAndAvailableTime.userLimit
        }
        readOnly={true}
        label="Slot User Limit"
        size="small"
        color="info"
      />
    </>
  );
};

export default PanelEditOptions;
