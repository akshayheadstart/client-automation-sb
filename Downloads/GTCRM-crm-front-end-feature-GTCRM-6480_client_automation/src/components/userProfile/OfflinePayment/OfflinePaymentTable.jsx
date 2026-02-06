import React, { useContext, useState } from 'react';
import "../../../styles/leadDetails.css";
import "../../../styles/sharedStyles.css";
import "../../../styles/leadofflinePayment.css";
import { Box, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import addOfflinePaymentIcon from "../../../icons/addOfflinePaymentIcon.svg"
import paymentIcon from "../../../icons/paymentIcon.svg"
import useTableCellDesign from '../../../hooks/useTableCellDesign';
import AddPaymentDialog from './AddPaymentDialog';
import BaseNotFoundLottieLoader from '../../shared/Loader/BaseNotFoundLottieLoader';
import { LayoutSettingContext } from '../../../store/contexts/LayoutSetting';
const OfflinePaymentTable = ({paymentData,setClickOnTransactionId,programName,applicationId,setSelectedPaymentId,handleClickRPayDialogOpen}) => {
    const StyledTableCell = useTableCellDesign();
    const [openAddPaymentOffline,setOpenAddPaymentOffline]=useState(false)
    const handleAddPaymentOfflineClose =()=>{
        setOpenAddPaymentOffline(false)
    }
    const handleAddPaymentOfflineOpen =()=>{
        setOpenAddPaymentOffline(true)
    }
    const { studentInfoDetails} =
    useContext(LayoutSettingContext);
    return (
        <>
         <Box className="lead-payment-Icon-box">
          <img src={addOfflinePaymentIcon} alt="add payment Icon" style={{cursor:'pointer'}} onClick={()=>{
            if(studentInfoDetails?.paymentStatus?.toLowerCase()!=="captured"){
              handleAddPaymentOfflineOpen()
            }
          }}/>
          <img src={paymentIcon} alt="payment Icon" style={{cursor:'pointer'}} onClick={()=>{
            handleClickRPayDialogOpen()
          }}/>
        </Box>
            <Box>
              {
                paymentData?.length>0?
        <TableContainer
                    sx={{ boxShadow: 0 }}
                    component={Paper}
                    className="custom-scrollbar"
                  >
                    <Table sx={{ minWidth: 360 }} aria-label="customized table">
                      <TableHead>
                        <TableRow
                          sx={{
                            borderBottom: "1px solid rgba(238, 238, 238, 1)",
                          }}
                        >
                              <StyledTableCell
                                sx={{ whiteSpace: "nowrap" }}
                                className='lead-offline-payment-table-head'
                                align="left"
                              >
                                Transaction ID
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{ whiteSpace: "nowrap" }}
                                className='lead-offline-payment-table-head'
                                align="left"
                              >
                                Order ID
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{ whiteSpace: "nowrap" }}
                                className='lead-offline-payment-table-head'
                                align="left"
                              >
                                Date
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{ whiteSpace: "nowrap" }}
                                className='lead-offline-payment-table-head'
                                align="left"
                              >
                                Status
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{ whiteSpace: "nowrap" }}
                                className='lead-offline-payment-table-head'
                                align="left"
                              >
                               Payment Method
                              </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paymentData?.map((row, index) => (
                          <TableRow
                            sx={{
                              borderBottom: "1px solid rgba(238, 238, 238, 1)",
                            }}
                            key={index}
                          >
                            <StyledTableCell
                              bodyCellPadding={"16px 10px !important"}
                              sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                              align="left"
                            >
                                <Typography className={row?.payment_id?"lead-offline-payment-value-text-size lead-offline-payment-value-text":"lead-offline-payment-value-text-size"}
                                onClick={()=>{
                                    if(row?.payment_id ){
                                        setClickOnTransactionId(true)
                                        setSelectedPaymentId(row?.payment_id)
                                    }
                                }}
                                >
                                  {`${row?.payment_id ? row.payment_id : "---"}`}
                                </Typography>
                            </StyledTableCell>
                            <StyledTableCell
                              bodyCellPadding={"16px 10px !important"}
                              sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                              align="left"
                            >
                              <Typography className="lead-offline-payment-value-text-size">
                                  {`${row?.order_id ? row?.order_id : "---"}`}
                                </Typography>
                            </StyledTableCell>
                            <StyledTableCell
                              bodyCellPadding={"16px 10px !important"}
                              sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                              align="left"
                            >
                              <Typography className="lead-offline-payment-value-text-size">
                                  {`${row.date ? row.date : "---"}`}
                                </Typography>
                            </StyledTableCell>
                            <StyledTableCell
                              bodyCellPadding={"16px 10px !important"}
                              sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                              align="left"
                            >
                              <Box
                                className={
                                  row?.status === "captured"
                                    ? "lead-offline-payment-captured-status"
                                    : "lead-offline-payment-failed-status"
                                }
                                sx={{borderRadius:50}}
                              >
                                <Typography  className='lead-offline-payment-status-text'>
                                {row?.status}
                                </Typography>
                                    
                              </Box>
                            </StyledTableCell>
                            <StyledTableCell
                              bodyCellPadding={"16px 10px !important"}
                              sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                              align="left"
                            >
                              <Box
                                className={"lead-offline-payment-method"}
                                sx={{borderRadius:50}}
                              >
                                <Typography  className='lead-offline-payment-status-text'>
                                {row?.payment_method}
                                </Typography>
                                    
                              </Box>
                            </StyledTableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  :
                  <BaseNotFoundLottieLoader
                  height={250}
                  width={250}
                ></BaseNotFoundLottieLoader>
              }
        </Box>
        {
            openAddPaymentOffline &&
            <AddPaymentDialog
            openAddPaymentOffline={openAddPaymentOffline}
            handleAddPaymentOfflineClose={handleAddPaymentOfflineClose}
            programName={programName}
            applicationId={applicationId}
            />
        }
        </>
    );
};

export default OfflinePaymentTable;