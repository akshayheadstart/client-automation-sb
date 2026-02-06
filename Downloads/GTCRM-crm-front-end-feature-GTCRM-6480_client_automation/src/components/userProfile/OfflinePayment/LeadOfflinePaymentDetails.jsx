import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Box,
  Drawer,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import useTableCellDesign from "../../../hooks/useTableCellDesign";
import arrowInvoiceIcon from "../../../icons/arrowInVoiceIcon.svg";
import invoiceIcon from "../../../icons/invoiceIcon.svg";
import "../../../styles/leadDetails.css";
import "../../../styles/leadofflinePayment.css";
import "../../../styles/sharedStyles.css";
import InVoiceCardDrawer from "./InVoiceCardDrawer";
import { useSelector } from "react-redux";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { useGetParticularPaymentDetailsQuery } from "../../../Redux/Slices/filterDataSlice";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import useToasterHook from "../../../hooks/useToasterHook";
const LeadOfflinePaymentDetails = ({ setClickOnTransactionId,applicationId,clickOnTransactionId,selectedPaymentId }) => {
  const StyledTableCell = useTableCellDesign();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
  useContext(DashboradDataContext);
  const [paymentDetailsListData,setPaymentDetailsListData]=useState([])
  const [paymentDetailsInfo,setPaymentDetailsInfo]=useState({})
  const [
    somethingWentWrongInPaymentOfflineDetails,
    setSomethingWentWrongInPaymentOfflineDetails,
  ] = useState(false);
  const [
    paymentOfflineDetailsInternalServerError,
    setPaymentOfflineDetailsInternalServerError,
  ] = useState(false);
  const { data, isSuccess, isFetching, error, isError } =
  useGetParticularPaymentDetailsQuery({
    paymentId:selectedPaymentId,
      collegeId: collegeId
    },{skip:clickOnTransactionId?false:true});

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          const dataDetails=data?.data[0]
          const paymentDetails = [
            {
              menuName: "Transactions details",
              value: "",
              subMenuList: [
                {
                  name: "Transaction id",
                  value: dataDetails?.payment_id?dataDetails?.payment_id:"N/A",
                },
                {
                  name: "Gateway id",
                  value: dataDetails?.transaction_details?.gateway_id?dataDetails?.transaction_details?.gateway_id:"N/A",
                },
                {
                  name: "Reference No.",
                  value: dataDetails?.transaction_details?.reference_number?dataDetails?.transaction_details?.reference_number :"N/A",
                },
                {
                  name: "Order ID",
                  value: dataDetails?.order_id
                  ?dataDetails?.order_id :"N/A",
                },
                {
                  name: "Payment Device",
                  value: dataDetails?.transaction_details?.payment_device?dataDetails?.transaction_details?.payment_device:"N/A",
                },
                {
                  name: "Device OS",
                  value: dataDetails?.transaction_details?.device_os
                  ?dataDetails?.transaction_details?.device_os :"N/A",
                },
              ],
            },
            {
              menuName: "Mode of payment",
              value: "",
              subMenuList: [
                {
                  name: "Card No.",
                  value: dataDetails?.mode_of_payment_info
                  ?.card_id?dataDetails?.mode_of_payment_info
                  ?.card_id:"N/A",
                },
                {
                  name: "Card holder Name",
                  value: dataDetails?.mode_of_payment_info
                  ?.card?.name?dataDetails?.mode_of_payment_info
                  ?.card?.name:"N/A",
                },
                {
                  name: "Location",
                  value: dataDetails?.mode_of_payment_info
                  ?.payment_location?dataDetails?.mode_of_payment_info
                  ?.payment_location :"N/A",
                },
                {
                  name: "IP",
                  value: dataDetails?.mode_of_payment_info
                  ?.ip_address?dataDetails?.mode_of_payment_info
                  ?.ip_address :"N/A",
                },
              ],
            },
            {
              menuName: "Amount Received",
              value: dataDetails?.amount_received
              ?dataDetails?.amount_received :"N/A",
            },
            {
              menuName: "Payment status",
              value: dataDetails?.status
              ?dataDetails?.status :"N/A",
            },
            {
              menuName: "Voucher Promocode Status",
              value: dataDetails?.voucher_promocode_status
              ?dataDetails?.voucher_promocode_status :"N/A",
              code: dataDetails?.voucher_promocode
              ?dataDetails?.voucher_promocode :"N/A",
            },
            {
              menuName: "Payment Date",
              value: dataDetails?.created_at
              ?dataDetails?.created_at :"N/A",
            },
          ];
          setPaymentDetailsListData(paymentDetails);
          setPaymentDetailsInfo(dataDetails)

        } else {
          throw new Error("get all offline payment API response has changed");
        }
      }
      if (isError) {
        setPaymentDetailsListData([]);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setPaymentOfflineDetailsInternalServerError,
            "",
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInPaymentOfflineDetails,
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
  ]);
  const [expandedIndices, setExpandedIndices] = useState([]);
  const handleToggle = (index) => {
    setExpandedIndices((prevIndices) =>
    prevIndices.includes(index) ? prevIndices.filter((i) => i !== index) : [...prevIndices, index]
  );
  };
  const [inVoiceOpen,setInVoiceOpen]=useState(false)
  return (
    <>
      <Box className="lead-payment-Icon-box">
      <IconButton
      onClick={()=>{
        if(paymentDetailsInfo?.invoice_document && paymentDetailsInfo?.invoice_document !=="N/A"){
          setInVoiceOpen(true);
        }
      }} 
      disabled={!paymentDetailsInfo?.invoice_document || paymentDetailsInfo?.invoice_document ==="N/A"}
      >
        <img src={invoiceIcon} alt="In Voice Icon" />
      </IconButton>
      </Box>
      <Box className="lead-offline-payment-invoice-table-box">
        <img
          src={arrowInvoiceIcon}
          alt="arrowInvoice Icon"
          className="arrow-invoice-icon"
          onClick={() => {
            setClickOnTransactionId(false);
          }}
        />
        {
          paymentOfflineDetailsInternalServerError ||
          somethingWentWrongInPaymentOfflineDetails ? (
            <>
              {paymentOfflineDetailsInternalServerError && (
                <Error500Animation
                  height={400}
                  width={400}
                ></Error500Animation>
              )}
              {somethingWentWrongInPaymentOfflineDetails && (
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
                )
              :
        <TableContainer
          sx={{ boxShadow: 0, height: "430px" }}
          component={Paper}
          className="custom-scrollbar vertical-scrollbar"
        >
          <Table
            sx={{ minWidth: 200, overflowX: "scroll" }}
            aria-label="customized table"
          >
            <TableHead></TableHead>
            <TableBody>
              {paymentDetailsListData?.map((row,index) => {
                return (
                    <>
                  <TableRow sx={{ pl: "20px", borderBottom: "1px solid #EEE" }}>
                    <StyledTableCell
                      sx={{ p: "0px !important" }}
                      className="lead-details-label-cell"
                    >
                      <Box
                        className="lead-offline-details-table-box"
                      >
                        <Typography className="lead-offline-payment-menu-text-name">
                          {row?.menuName}
                        </Typography>
                        {
                            row?.menuName ==="Transactions details" || row?.menuName ==="Mode of payment" ?

                            <ArrowDropDownIcon
                              sx={{
                                color: "rgba(0, 139, 226, 1)",
                                mt: "-3px",
                                cursor: "pointer",
                              }}
                              onClick={()=>{
                                handleToggle(index)
                              }}
                            />
                            :""
                        }
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ p: "0px !important" }}
                      className="lead-details-label-cell"
                    >
                      <Typography className="lead-offline-payment-menu-text">
                        {row?.value}{row?.code?` | ${row?.code }`:''}
                      </Typography>
                    </StyledTableCell>
                  </TableRow>
                  {
                    ((row?.menuName ==="Transactions details" && expandedIndices.includes(index)) || (row?.menuName ==="Mode of payment" && expandedIndices.includes(index)) )&&
                    <>
                    {
                        paymentDetailsListData[index]?.subMenuList?.map((subMenu)=>{
                            return(
                                <TableRow sx={{ pl: "20px", borderBottom: "1px solid #EEE",backgroundColor: "rgba(250, 250, 250, 0.95)" }}>
                                <StyledTableCell
                                  sx={{ p: "0px !important" }}
                                  className="lead-details-label-cell"
                                >
                                    <Typography className="lead-offline-payment-menu-text-name">
                                      {subMenu?.name}
                                    </Typography>
                                </StyledTableCell>
                                <StyledTableCell
                                  sx={{ p: "0px !important" }}
                                  className="lead-details-label-cell"
                                >
                                  <Typography className="lead-offline-payment-menu-text">
                                    {subMenu?.value}
                                  </Typography>
                                </StyledTableCell>
                              </TableRow>

                            )
                        })
                    }
                 
                    </>
                  }
                    </>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
          
          }
          </>
        }
      </Box>
      <Drawer
            anchor={"right"}
            open={inVoiceOpen}
            disableEnforceFocus={true}
            onClose={() => {
              setInVoiceOpen(false);
            }}
            className="vertical-scrollbar-drawer"
          >
            <Box className="in-voice-control-drawer-box-container">
           <InVoiceCardDrawer setInVoiceOpen={setInVoiceOpen}
           applicationId={applicationId}
           paymentDetailsInfo={paymentDetailsInfo}
           />
            </Box>
             </Drawer>
    </>
  );
};

export default LeadOfflinePaymentDetails;
