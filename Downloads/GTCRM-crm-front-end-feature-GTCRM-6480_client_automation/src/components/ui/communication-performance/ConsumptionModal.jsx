/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Modal } from "rsuite";
import { Box, IconButton, Typography } from "@mui/material";
import { CloseRounded, MailOutlineRounded } from "@mui/icons-material";
import { useState } from "react";
import { useContext } from "react";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { useSelector } from "react-redux";
import { useGetConsumptionInfoQuery } from "../../../Redux/Slices/applicationDataApiSlice";

function ConsumptionModal(props) {
  const { openModal, setOpenModal, modalType, pushNotification } = props;
  const [consumptionData, setConsumptionData] = useState({})
  const [viewData, setViewData] = useState({})
  const { setApiResponseChangeMessage, apiResponseChangeMessage } = useContext(DashboradDataContext);
  const [consumptionInfoInternalServerError, setConsumptionInfoInternalServerError] = useState(false);
  const [somethingWentWrongInConsumptionInfo, setSomethingWentWrongInConsumptionInfo] = useState(false);

  const collegeId = useSelector(state => state.authentication.currentUserInitialCollege?.id);

  const {
    data: consumptionList,
    isSuccess,
    error,
    isError,
  } = useGetConsumptionInfoQuery({ collegeId: collegeId });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof consumptionList?.data === "object") {
          setConsumptionData(consumptionList?.data);
        } else {
          throw new Error("Consumption Info API response has changed");
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setConsumptionInfoInternalServerError, "", 5000);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrongInConsumptionInfo, "", 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, isSuccess, consumptionList]);



  useEffect(() => {
    if (modalType === 'Email') {
      setViewData({
        allocated: consumptionData?.email_allocated,
        consumed: consumptionData?.email_consumed,
        creditLeft: consumptionData?.email_credit_left,
      })
    } else if (modalType === 'SMS') {
      setViewData({
        allocated: consumptionData?.sms_allocated,
        consumed: consumptionData?.sms_consumed,
        creditLeft: consumptionData?.sms_credit_left,
      })
    } else {
      setViewData({
        allocated: consumptionData?.whatsapp_allocated,
        consumed: consumptionData?.whatsapp_consumed,
        creditLeft: consumptionData?.whatsapp_credit_left
      })
    }
  }, [modalType])

  return (
    <Box className="modal-container">
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box className="modalHeader">
          <Typography variant="h6" className={modalType === "Email" ? "info_head" : (modalType === "SMS" ? "smsHead" : "whatsappHead")}>
            {modalType} Consumption Info
          </Typography>
          <Box>
            <IconButton>
              <CloseRounded onClick={() => setOpenModal(false)} />
            </IconButton>
          </Box>
        </Box>
        {(consumptionInfoInternalServerError || somethingWentWrongInConsumptionInfo) ? <Box
          className="error-animation-box"
          data-testid="error-animation-container"
        >
          {(consumptionInfoInternalServerError) && <Error500Animation height={400} width={400}></Error500Animation>}
          {(somethingWentWrongInConsumptionInfo) &&
            <ErrorFallback error={apiResponseChangeMessage} resetErrorBoundary={() => window.location.reload()} />
          }
        </Box>
          : <>

            <Modal.Body>
              <Box className="modalBody">
                <Box className="emailStatic" >{modalType} Statistics</Box>
                <Box className="emailMain">
                  <Box className="emailTotal">
                    <Box className="e_icon">
                      <MailOutlineRounded fontSize="small" />
                    </Box>
                    <Typography variant="subtitle2" className="emaiTxt">
                      {modalType} Allocated
                    </Typography>
                    <Typography variant="h6" className="total_email">
                      {viewData?.allocated}
                    </Typography>
                    <Box className="billable">Billable:  {viewData.allocated}</Box>
                  </Box>
                  <Box className="emailTotal consumed">
                    <Box className="e_icon con_icon">
                      <MailOutlineRounded fontSize="small" />
                    </Box>
                    <Typography variant="subtitle2" className="emaiTxt">
                      {modalType} Consumed
                    </Typography>
                    <Typography variant="h6" className="total_email consume_no">
                      {viewData?.consumed}
                    </Typography>
                    {/* <Box className="billable con_bill"></Box> */}
                  </Box>
                  <Box className="emailTotal credit">
                    <Box className="e_icon credit_icon">
                      <MailOutlineRounded fontSize="small" />
                    </Box>
                    <Typography variant="subtitle2" className="emaiTxt">
                      {modalType} Credit Left
                    </Typography>
                    <Typography variant="h6" className="total_email credit_no">
                      {viewData?.creditLeft}
                    </Typography>
                    {/* <Box className="billable con_bill"></Box> */}
                  </Box>
                </Box>
              </Box>
            </Modal.Body>
          </>}
      </Modal>
    </Box>
  );
}

export default ConsumptionModal;
