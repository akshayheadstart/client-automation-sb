import React, { useContext, useEffect, useState } from "react";
import "../../../styles/leadDetails.css";
import "../../../styles/sharedStyles.css";
import "../../../styles/leadofflinePayment.css";
import { Box } from "@mui/material";
import OfflinePaymentTable from "./OfflinePaymentTable";
import LeadOfflinePaymentDetails from "./LeadOfflinePaymentDetails";
import { useGetAllOfflinePaymentListQuery } from "../../../Redux/Slices/filterDataSlice";
import { useSelector } from "react-redux";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import RPayOfflinePaymentDialog from "./RPayOfflinePaymentDialog";
import useToasterHook from "../../../hooks/useToasterHook";

const LeadOfflinePayment = ({programName,applicationId,tabValue,studentId}) => {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
  useContext(DashboradDataContext);
  const [paymentListData,setPaymentListData]=useState([])
  const [
    somethingWentWrongInPaymentOffline,
    setSomethingWentWrongInPaymentOffline,
  ] = useState(false);
  const [
    paymentOfflineInternalServerError,
    setPaymentOfflineInternalServerError,
  ] = useState(false);
  const { data, isSuccess, isFetching, error, isError } =
  useGetAllOfflinePaymentListQuery({
    applicationId:applicationId,
      collegeId: collegeId
    },{skip:tabValue?false:true});

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setPaymentListData(data?.data);

        } else {
          throw new Error("get all offline payment API response has changed");
        }
      }
      if (isError) {
        setPaymentListData([]);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setPaymentOfflineInternalServerError,
            "",
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInPaymentOffline,
        "",
        10000
      );
    } finally {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSuccess,
    data?.data,
    error,
    isError,
    error?.data?.detail,
    error?.status,
    applicationId
  ]);
  const [clickOnTransactionId,setClickOnTransactionId]=useState(false)
  const [selectedPaymentId,setSelectedPaymentId]=useState("")
  //Resorpay payment code here
  const [rPayDialogOpen, setRPayDialogOpen] = React.useState(false);
  const handleClickRPayDialogOpen = () => {
    setRPayDialogOpen(true);
  };

  const handleRPayDialogClose = () => {
    setRPayDialogOpen(false);
  };
  return (
    <>
    {
      clickOnTransactionId ?
      <Box className="lead-details-table-box">
      <LeadOfflinePaymentDetails
      setClickOnTransactionId={setClickOnTransactionId}
      applicationId={applicationId}
      clickOnTransactionId={clickOnTransactionId}
      selectedPaymentId={selectedPaymentId}
      />
     </Box>
     :
     <>
     {
       paymentOfflineInternalServerError ||
       somethingWentWrongInPaymentOffline ? (
         <>
           {paymentOfflineInternalServerError && (
             <Error500Animation
               height={400}
               width={400}
             ></Error500Animation>
           )}
           {somethingWentWrongInPaymentOffline && (
             <ErrorFallback
               error={apiResponseChangeMessage}
               resetErrorBoundary={() => window.location.reload()}
             />
           )}
         </>
       ):
       <>
       {
        isFetching ? (
          <Box
          className="lead-offline-leef-box"
            data-testid="loading-animation-container"
          >
            <LeefLottieAnimationLoader
              height={120}
              width={120}
            ></LeefLottieAnimationLoader>
          </Box>
        ):
      <Box className="lead-details-table-box">
       <OfflinePaymentTable 
       paymentData={paymentListData}
       setClickOnTransactionId={setClickOnTransactionId}
       programName={programName}
       applicationId={applicationId}
       setSelectedPaymentId={setSelectedPaymentId}
       handleClickRPayDialogOpen=
       {handleClickRPayDialogOpen}
       />
      </Box>
       }
      </>
     }
     </>
    }
    {
      rPayDialogOpen && 
      <RPayOfflinePaymentDialog 
      handleRPayDialogClose={handleRPayDialogClose}
      rPayDialogOpen={rPayDialogOpen}
      studentId={studentId}
       />
    }
    </>
  );
};

export default LeadOfflinePayment;
