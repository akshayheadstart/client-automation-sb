import { Box } from "@mui/system";
import React, { useState } from "react";
import ReorderTabDialog from "./ReorderTabDialog";
import FilterHeaderIcon from "../application-manager/FilterHeaderIcon";
import ColumnReorderIcon from "../../../icons/suffle-icon.svg";
import useToasterHook from "../../../hooks/useToasterHook";
const ReorderTab = ({ tabs, setTabs }) => {
  const [openReorderTab, setOpenReorderTab] = useState(false);
  const pushNotification = useToasterHook();

  const handleTabDragEnd = (result) => {
    const allTabs = Array.from(tabs);

    if (!result.destination) return;

    if (allTabs[result.source.index].not_draggable) {
      pushNotification(
        "warning",
        `${allTabs[result.source.index].step_name} tab can't be reordered.`
      );
      return;
    }
    const destinationIndex = result.destination?.index;
    if (destinationIndex === 0 || destinationIndex === allTabs.length - 1) {
      pushNotification(
        "warning",
        `Tabs can't be moved outside of the allowed range.`
      );
      return;
    }
    const [reorderedItem] = allTabs.splice(result.source.index, 1);
    allTabs.splice(result.destination.index, 0, reorderedItem);

    setTabs(allTabs);
  };
  return (
    <Box>
      <FilterHeaderIcon
        icon={ColumnReorderIcon}
        action={() => setOpenReorderTab(true)}
      />
      {openReorderTab && (
        <ReorderTabDialog
          open={openReorderTab}
          setOpen={setOpenReorderTab}
          tabs={tabs}
          handleTabDragEnd={handleTabDragEnd}
        />
      )}
    </Box>
  );
};

export default ReorderTab;
