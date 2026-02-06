import React, { useState } from "react";
import CommunicationDetailsDrawer from "./CommunicationDetailsDrawer";
function CommonTableName({ name, payload, tabValue, communicationDetails }) {
  const [openCommunicationDetailsDrawer, setOpenCommunicationDetailsDrawer] =
    useState(false);
  return (
    <>
      <span
        onClick={!communicationDetails && setOpenCommunicationDetailsDrawer}
        className={communicationDetails ? "" : "common-table-name-container"}
      >
        {name}{" "}
        {!communicationDetails && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.1387 7.00928C13.1387 3.86816 10.5923 1.32178 7.45117 1.32178C4.31005 1.32178 1.76367 3.86816 1.76367 7.00928C1.76367 10.1504 4.31005 12.6968 7.45117 12.6968C10.5923 12.6968 13.1387 10.1504 13.1387 7.00928ZM7.45117 0.509278C11.041 0.509278 13.9512 3.41943 13.9512 7.00928C13.9512 10.5991 11.041 13.5093 7.45117 13.5093C3.86132 13.5093 0.951173 10.5991 0.951173 7.00928C0.951172 3.41943 3.86132 0.509279 7.45117 0.509278Z"
              fill="#B3D2E2"
            />
            <path
              d="M9.95117 5.96151L7.45117 8.50928L4.95117 5.96151L5.39492 5.50928L7.45117 7.60482L9.50742 5.50928L9.95117 5.96151Z"
              fill="#0583D2"
            />
          </svg>
        )}
      </span>
      {openCommunicationDetailsDrawer && (
        <CommunicationDetailsDrawer
          open={openCommunicationDetailsDrawer}
          setOpen={setOpenCommunicationDetailsDrawer}
          tabValue={tabValue}
        />
      )}
    </>
  );
}

export default CommonTableName;
