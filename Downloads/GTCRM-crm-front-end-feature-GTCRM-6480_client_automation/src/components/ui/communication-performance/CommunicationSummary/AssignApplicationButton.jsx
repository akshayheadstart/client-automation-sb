import React, { useState } from "react";
import AssignApplicationDialog from "./AssignApplicationDialog";

function AssignApplicationButton({ callDetails }) {
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  return (
    <>
      <button
        onClick={setOpenAssignDialog}
        className="assign-application-button"
      >
        Assign Application
      </button>
      <AssignApplicationDialog
        openDialog={openAssignDialog}
        setOpenDialog={setOpenAssignDialog}
        callDetails={callDetails}
      />
    </>
  );
}

export default AssignApplicationButton;
