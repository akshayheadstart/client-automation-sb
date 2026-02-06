import React from 'react';
import '../../../styles/documentLockerDrawer.css'
import { Box, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { removeUnderlineAndJoin } from '../../../helperFunctions/calendarHelperfunction';
import BaseNotFoundLottieLoader from '../Loader/BaseNotFoundLottieLoader';
import { isNumberOrStringCompare } from '../../../helperFunctions/filterHelperFunction';
import useTableCellDesign from '../../../hooks/useTableCellDesign';
import '../../../styles/sharedStyles.css'
const DocumentLockerInfoTable = ({document,documentToggle}) => {
      const StyledTableCell = useTableCellDesign();
    return (
        <Box>
            <TableContainer sx={{boxShadow:0,height:'500px'}} className='vertical-scrollbar' component={Paper}>
        <Table className='user-profile-info-table-width' aria-label="customized table">
          <TableHead>
            <TableRow sx={{borderBottom:'1px solid #EEE'}}>
              <StyledTableCell sx={{fontSize:'15px',color:'#7E92A2',fontWeight:'600 !important'}}>Fields</StyledTableCell>
              <StyledTableCell sx={{fontSize:'15px',whiteSpace:'nowrap',fontWeight:'600 !important'}} align="left"><span style={{color:'#092C4C'}}>User</span>/<span style={{color:'#008BE2'}}>OCR</span> Value</StyledTableCell>
              <StyledTableCell sx={{fontSize:'15px',color:'#7E92A2',fontWeight:'600 !important'}} align="left">Accuracy</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              Object.keys(document?.fields_name)?.length>0?
                  
                      <>
                      {Object.keys(document?.fields_name)?.map((row,index) => (
                  <>
                  
                <TableRow sx={{borderBottom:'1px solid #EEE'}} key={row.indexOf}>
                  <StyledTableCell  component="th" scope="row">
                    {removeUnderlineAndJoin(row)}
                  </StyledTableCell>
                  <StyledTableCell  component="th" scope="row">
                   <Typography sx={{fontSize:'14px', color:'#092C4C'}}> {((document?.user_value[row]) ===null ||(document?.user_value[row]) ==='') ? '---':isNumberOrStringCompare(document?.user_value[row])? `${document?.user_value[row]}%`:document?.user_value[row]}</Typography>
                   <Typography sx={{color:'#008BE2',fontSize:'14px'}}> {((document?.ocr_value[row]) ===null ||(document?.ocr_value[row]) ==='') ? '---':isNumberOrStringCompare(document?.ocr_value[row])? `${document?.ocr_value[row]}%`: document?.ocr_value[row]}</Typography>
                  </StyledTableCell>
                  <StyledTableCell sx={{color:'#7E92A2 !important'}} component="th" scope="row">
                  {`${(document?.accuracy[row] ===null ||document?.accuracy[row] ==='')?'---':isNumberOrStringCompare(document?.accuracy[row])? `${document?.accuracy[row]}%`:document?.accuracy[row]}`}
                  </StyledTableCell>
                </TableRow>
                  </>
                
              ))}
                      </>
                      :
                      <Box
                  sx={{
                    display: "grid",
                    placeItems:'center',
                    pb: 2,
                    marginLeft:'110%'
                  }}
                >
                  <BaseNotFoundLottieLoader
                    height={150}
                    width={100}
                  ></BaseNotFoundLottieLoader>
                </Box>
            }
          </TableBody>
        </Table>
      </TableContainer>
            
        </Box>
    );
};

export default DocumentLockerInfoTable;