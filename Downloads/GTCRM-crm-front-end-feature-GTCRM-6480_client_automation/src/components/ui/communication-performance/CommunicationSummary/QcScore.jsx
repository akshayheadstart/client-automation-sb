import { Drawer, Typography } from "@mui/material";
import React, { useState } from "react";
import CallReview from "../../../../pages/QA_Manager/CallReview";
import "../../../../styles/callList.css";
import { useSelector } from "react-redux";
const QcScore = ({ callDetails }) => {
  const [openCallReviewDrawer, setOpenCallReviewDrawer] = useState(false);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  return (
    <>
      <Typography onClick={setOpenCallReviewDrawer} className="call-score">
        {callDetails?.qc_score || "4.5/5"}
      </Typography>
      <Drawer
        anchor="right"
        open={openCallReviewDrawer}
        onClose={() => setOpenCallReviewDrawer(false)}
      >
        <CallReview
          collegeId={collegeId}
          data={callDetails}
          onClose={() => setOpenCallReviewDrawer(false)}
        />
      </Drawer>
    </>
  );
};

export default QcScore;
