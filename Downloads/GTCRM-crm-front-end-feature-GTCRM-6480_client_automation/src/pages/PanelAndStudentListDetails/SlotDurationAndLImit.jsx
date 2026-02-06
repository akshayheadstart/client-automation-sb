import { Checkbox, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CustomTooltip from "../../components/shared/Popover/Tooltip";
const SlotDurationAndLImit = ({
  list,
  setSelectedSlots,
  selectedSlots,
  slotType,
}) => {
  const handleCheckSlots = (event, id) => {
    if (event.target.checked) {
      setSelectedSlots((prev) => [...prev, id]);
    } else {
      setSelectedSlots((prev) => prev.filter((slotId) => slotId !== id));
    }
  };
  return (
    <Box className="duration-and-checkbox">
      <Typography variant="body2">{list?.time}</Typography>
      <Box className="badge-and-checkbox">
        {slotType !== "PI" && (
          <Box className="slot-badge">
            {list?.user_limit}/{list?.application_details?.length}
          </Box>
        )}
        {list?.status === "published" && list?.application_details?.length ? (
          <CustomTooltip
            title="Published and Booked"
            description="This slot has been published and booked by applicants so Unassign, publish and delete ect. actions are not available for this slot."
            component={<InfoOutlinedIcon />}
          />
        ) : (
          <Checkbox
            checked={selectedSlots.includes(list?._id)}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={(event) => handleCheckSlots(event, list._id)}
          />
        )}
      </Box>
    </Box>
  );
};

export default SlotDurationAndLImit;
