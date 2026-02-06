import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import React, { forwardRef, useImperativeHandle } from "react";
import CardHeader from "@mui/material/CardHeader";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

function FilterByWrapper(props, ref) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  useImperativeHandle(
    ref,
    () => ({
      openDrawer(anchor, open) {
        setState({ ...state, [anchor]: open });
      },
    })
  );

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <Drawer
      anchor="right"
      open={state["right"]}
      onClose={toggleDrawer("right", false)}
    >
      <Card sx={{ minWidth: 300, maxWidth: 300 }}>
        <CardHeader
          action={
            <IconButton>
              <CloseIcon onClick={toggleDrawer("right", false)} />
            </IconButton>
          }
          title={props.title}
        />

        <CardContent sx={{ minHeight: "75vh" }}>{props.children}</CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            size="small"
            variant="outlined"
            color="success"
            startIcon={<RestartAltIcon />}
            sx={{
              flexGrow: 1,
              maxWidth: 100,
            }}
            onClick={() => props.onFilterReset()}
          >
            Reset
          </Button>
          <Button
            color="primary"
            size="small"
            variant="contained"
            sx={{
              flexGrow: 1,
              maxWidth: 100,
            }}
            onClick={() => props.onFilterApply()}
          >
            Apply
          </Button>
        </CardActions>
      </Card>
    </Drawer>
  );
}

export default forwardRef(FilterByWrapper);
