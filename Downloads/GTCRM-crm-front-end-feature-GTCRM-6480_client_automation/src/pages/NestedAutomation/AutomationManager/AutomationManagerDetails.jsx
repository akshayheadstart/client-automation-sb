import React from "react";
import AutomationManagerDetailsHeader from "./AutomationManagerDetailsHeader";
import AutomationManagerDetailsTable from "./AutomationManagerDetailsTable";

function AutomationManagerDetails({ setShowDetailsPage, detailsId }) {
  return (
    <>
      <AutomationManagerDetailsHeader
        detailsId={detailsId}
        setShowDetailsPage={setShowDetailsPage}
      />
      <AutomationManagerDetailsTable detailsId={detailsId} />
    </>
  );
}

export default AutomationManagerDetails;
