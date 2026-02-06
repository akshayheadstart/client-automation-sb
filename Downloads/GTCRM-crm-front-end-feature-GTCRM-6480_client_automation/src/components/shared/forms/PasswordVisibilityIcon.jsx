import React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordVisibilityIcon = (props) => {
  const { value } = props;
  return (
    <>
      {value ? (
        <VisibilityOff data-testid="visibility-off-icon" />
      ) : (
        <Visibility data-testid="visibility-icon" />
      )}
    </>
  );
};

export default PasswordVisibilityIcon;
