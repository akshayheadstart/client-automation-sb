import { ListItemButton, ListItemText } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const SidebarLink = ({
  onClose,
  link,
  content,
  contentClass = "",
  linkClass = "",
  linkProps = {},
  selectedMenu = "",
  state,
}) => {
  const handleOnClick = React.useCallback(() => {
    localStorage.setItem("selectedMenu", selectedMenu);
  }, [selectedMenu]);

  return (
    <Link
      state={state}
      to={link}
      onClick={onClose}
      className={linkClass}
      {...linkProps}
    >
      <ListItemButton
        sx={{
          // pl: 4,
          color: "#FFF",
          "&:hover": {
            backgroundColor: "rgba(255,255,255, 0.08)",
            color: "#FFF",
          },
        }}
        onClick={handleOnClick}
      >
        <ListItemText
          primaryTypographyProps={{
            fontSize: "12px",
            className: contentClass,
            // paddingLeft: "28px",
          }}
          primary={content}
        />
      </ListItemButton>
    </Link>
  );
};

export default SidebarLink;
