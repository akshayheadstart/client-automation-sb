import { Checkbox, IconButton } from "@mui/material";
import React from "react";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
const IndividualCheckBox = ({
  id,
  handleOnChange,
  selectedStudent,
  padding,
}) => {
  return (
    <>
      {selectedStudent?.includes(id) ? (
        <IconButton
          sx={{ p: "9px", pl: padding }}
          onClick={() => {
            handleOnChange(false);
          }}
        >
          <CheckBoxOutlinedIcon sx={{ color: "#008be2" }} />
        </IconButton>
      ) : (
        <Checkbox
          sx={{ pl: padding }}
          checked={selectedStudent?.includes(id)}
          onChange={(e) => {
            handleOnChange(e.target.checked);
          }}
        />
      )}
    </>
  );
};

export default React.memo(IndividualCheckBox);
