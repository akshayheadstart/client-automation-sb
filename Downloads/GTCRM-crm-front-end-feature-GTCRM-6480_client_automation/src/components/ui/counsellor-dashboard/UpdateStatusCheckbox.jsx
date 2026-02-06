import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomTooltip from "../../shared/Popover/Tooltip";
import { Checkbox } from "rsuite";

const UpdateStatusCheckbox = ({
  status,
  handleCompleteAndIncompleteFollowup,
  applicationId,
  index,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    setIsChecked(status === "completed" ? true : false);
  }, [status]);

  return (
    <CustomTooltip
      description={
        status === "completed" ? "Uncheck to incomplete" : "Check to complete"
      }
      component={
        <IconButton>
          <Checkbox
            color="info"
            checked={isChecked}
            onChange={(event, checked) => {
              setIsChecked(checked);
              handleCompleteAndIncompleteFollowup(
                checked,
                applicationId,
                index
              );
            }}
          />
        </IconButton>
      }
    ></CustomTooltip>
  );
};

export default UpdateStatusCheckbox;
