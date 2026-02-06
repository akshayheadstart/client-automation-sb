import React from "react";

function ShowDropDownIcon({ Icon, onClick }) {
  return (
    <Icon
      onClick={onClick}
      color="info"
      sx={{ mt: "-3px", cursor: "pointer" }}
    ></Icon>
  );
}

export default ShowDropDownIcon;
