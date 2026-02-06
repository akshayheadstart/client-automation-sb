import * as React from "react";
import PropTypes from "prop-types";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";

const BootstrapDialogTitle = (props) => {
  const { color, children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{
        p: 2,
        fontSize: "20px",
        color: `${(color === "application" && "#347EDD") ||
          (color === "followup" && "#FF6347") ||
          (color === "note" && "#34DD8E") ||
          (color === "sms" && "#DD34B8") ||
          (color === "whatsapp" && "#25D366")
          }`,
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center'
      }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            // position: "absolute",
            // right: 8,
            // top: 25,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CancelIcon></CancelIcon>
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default BootstrapDialogTitle;
