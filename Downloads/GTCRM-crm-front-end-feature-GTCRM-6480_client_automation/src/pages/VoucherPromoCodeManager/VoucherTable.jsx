import React, { useEffect, useState } from 'react';
import "../../styles/sharedStyles.css";
import "../../styles/voucherPromocodeManager.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
    Box,
    Button,
    Checkbox,
    IconButton,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
  } from "@mui/material";
  import Paper from "@mui/material/Paper";
import useTableCellDesign from '../../hooks/useTableCellDesign';
import { voucherTableHead } from '../../constants/LeadStageList';
import CustomTooltip from '../../components/shared/Popover/Tooltip';
import { dateWithOutTime } from '../StudentTotalQueries/helperFunction';
import Cookies from 'js-cookie';
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
const VoucherTable = ({voucherData,setVoucherDrawerOpen,setSelectedVoucherCode,setOpenConfirmStatusDialog,voucher,setSelectedVoucherInfo,selectedVoucherId,setSelectedVoucherId,setSelectedVoucherList,selectedVoucherList}) => {
    const StyledTableCell = useTableCellDesign();
    const localStorageKeyName = `${Cookies.get("userId")}selectedVoucherList`;
    //top checkbox handler function
 const handleAllCheckbox = (e) => {
  if (e.target.checked === true) {
    const adminSelectedApplications = JSON.parse(
      localStorage.getItem(localStorageKeyName)
    );

    if (adminSelectedApplications?.length > 0) {
      //applications
      const filteredApplications = voucherData?.filter(
        (voucherId) =>
          !selectedVoucherList.some(
            (element) =>
              element._id === voucherId._id
          )
      );

      setSelectedVoucherList((currentArray) => [
        ...currentArray,
        ...filteredApplications,
      ]);
      localStorage.setItem(
        localStorageKeyName,
        JSON.stringify([...selectedVoucherList, ...filteredApplications])
      );
    } else {
      setSelectedVoucherList(voucherData);
      localStorage.setItem(
        localStorageKeyName,
        JSON.stringify(voucherData)
      );
    }
  } else {
    //set selected applications
    const filteredApplications = selectedVoucherList.filter(
      (voucherId) =>
        !voucherData.some(
          (element) => element._id === voucherId._id
        )
    );
    setSelectedVoucherList(filteredApplications);
    localStorage.setItem(
      localStorageKeyName,
      JSON.stringify(filteredApplications)
    );
  }
};
 //top checkbox and indeterminate state
 const [selectTopCheckbox, setSelectTopCheckbox] = useState(false);
 const [showIndeterminate, setShowIndeterminate] = useState(false);
 //show top checkbox and indeterminate
useEffect(() => {
  let applicationCount = 0;
  const applicationIds = voucherData?.map(
    (voucherId) => voucherId._id
  );
  applicationIds?.forEach((item) => {
    if (selectedVoucherId?.indexOf(item) !== -1) applicationCount++;
  });

  if (
    applicationCount === voucherData?.length &&
    applicationCount > 0
  ) {
    setSelectTopCheckbox(true);
  } else {
    setSelectTopCheckbox(false);
  }

  if (applicationCount < voucherData?.length && applicationCount > 0) {
    setShowIndeterminate(true);
  } else {
    setShowIndeterminate(false);
  }
}, [voucherData, selectedVoucherId]);
  const handleApplicationCheckBox = (e, dataRow) => {
    const selectedApplicationIds = selectedVoucherList.map(
      (voucherId) => voucherId._id
    );
    if (e.target.checked === true) {
      if (selectedVoucherList.length < 1) {
        //applications
        setSelectedVoucherList([dataRow]);
        localStorage.setItem(localStorageKeyName, JSON.stringify([dataRow]));
      } else if (!selectedApplicationIds.includes(dataRow._id)) {
        //applications
        setSelectedVoucherList((currentArray) => [
          ...currentArray,
          dataRow,
        ]);

        localStorage.setItem(
          localStorageKeyName,
          JSON.stringify([...selectedVoucherList, dataRow])
        );
      }
    } else {
      const filteredApplications = selectedVoucherList.filter((object) => {
        return object._id !== dataRow._id;
      });

      setSelectedVoucherList(filteredApplications);
      localStorage.setItem(
        localStorageKeyName,
        JSON.stringify(filteredApplications)
      );
    }
  };
  useEffect(() => {
    if(selectedVoucherList){
      const selectedVoucherIds = selectedVoucherList?.map(
        (object) => object?._id
      );
      setSelectedVoucherId(selectedVoucherIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVoucherList]);
  
    return (
        <>
        <TableContainer
              sx={{ boxShadow: 0 }}
              component={Paper}
              className="custom-scrollbar"
            >
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow
                    sx={{ borderBottom: "1px solid rgba(238, 238, 238, 1)" }}
                  >
                    {
                      !voucher &&
                    <StyledTableCell>
                    <Checkbox
                            sx={{
                              "&.Mui-checked": {
                                color: "#008be2",
                              },
                              "&.MuiCheckbox-indeterminate": {
                                color: "#008be2",
                              },
                            }}
                            checked={selectTopCheckbox}
                            onChange={(e) => {
                              handleAllCheckbox(e);
                            }}
                            indeterminate={showIndeterminate}
                          />
                    </StyledTableCell>
                    }
                    {voucherTableHead?.map((item, index) => {
                      return (
                        <>
                        {
                            voucher?
                            <>
                            {
                                index !==1 &&
                                <StyledTableCell
                          key={index}
                          className={
                            index === 0
                              ? "table-cell-fixed student-queries-table-head-text"
                              : "student-queries-table-head-text"
                          }
                          sx={{ whiteSpace: "nowrap" }}
                          align={item?.align?"center":'left'}
                        >
                        {item?.label}
                        </StyledTableCell>
                            }
                            </>
                            :
                        <StyledTableCell
                          key={index}
                          className={
                            index === 0
                              ? "table-cell-fixed student-queries-table-head-text"
                              : "student-queries-table-head-text"
                          }
                          sx={{ whiteSpace: "nowrap" }}
                          align={item?.align?"center":'left'}
                        >
                        {item?.label}
                        </StyledTableCell>
                        }
                        </>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {voucherData?.map((row, index) => (
                    <TableRow
                      sx={{ borderBottom: "1px solid rgba(238, 238, 238, 1)" }}
                      key={index}
                    >
                      {
                        !voucher &&
                      <StyledTableCell>
                      {selectedVoucherId?.includes(
                                row?._id
                              ) ? (
                                <IconButton
                                  sx={{ p: "9px" }}
                                  onClick={() => {
                                    handleApplicationCheckBox(
                                      {
                                        target: {
                                          checked: false,
                                        },
                                      },
                                      row
                                    );
                                  }}
                                >
                                  <CheckBoxOutlinedIcon
                                    sx={{ color: "#008be2" }}
                                  />
                                </IconButton>
                              ) : (
                                <Checkbox
                                  sx={{
                                    "&.Mui-checked": {
                                      color: "#008be2",
                                    },
                                  }}
                                  checked={
                                    selectedVoucherId?.includes(
                                      row?._id
                                    )
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    handleApplicationCheckBox(e, row);
                                  }}
                                />
                              )}
                      </StyledTableCell>
                      }
                      <StyledTableCell
                        bodyCellPadding={"16px 18px !important"}
                        sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                        className="table-cell-fixed"
                        component="th"
                        scope="row"
                      >
                        <Button
                          onClick={() => {
                            setVoucherDrawerOpen(true);
                            setSelectedVoucherCode(row);
                          }}
                          className="promoCode-value-text-size"
                        >
                          {row?.name ? row?.name : "---"}
                        </Button>
                      </StyledTableCell>
                      {
                        !voucher &&
                      <StyledTableCell
                        bodyCellPadding={"16px 18px !important"}
                        sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                        align="left"
                      >
                        <Typography className="promoCode-value-text-size">{`${
                          row.assign_to
                           ? row.assign_to : "---"
                        }`}</Typography>
                      </StyledTableCell>
                      }
                      <StyledTableCell
                        bodyCellPadding={"16px 18px !important"}
                        sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                        align="left"
                      >
                        {row.start_date ? `${dateWithOutTime(row?.start_date)} - ${dateWithOutTime(row?.end_date)}` : "---"}
                      </StyledTableCell>
                      <StyledTableCell
                        bodyCellPadding={"16px 18px !important"}
                        sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                        align="left"
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
                          }}
                        >
                          {row?.program_name?.length > 0
                            ? row?.program_name
                                ?.slice(0, 1)
                                .map((specialization, index) => (
                                  <span
                                    className="counsellor-allocated-items"
                                    key={index}
                                  >
                                    {`${specialization.course_name} ${
                                      specialization.spec_name ? "in" : ""
                                    } ${
                                      specialization.spec_name
                                        ? specialization.spec_name
                                        : "(no specialization)"
                                    }`}
                                  </span>
                                ))
                            : `– –`}
                          {row?.program_name?.length > 1 && (
                            <CustomTooltip
                              color={true}
                              description={
                                <div>
                                  {" "}
                                  <ul className='items-data-align-design-tooltip'>
                                    {" "}
                                    {row?.program_name
                                      ?.slice(1)
                                      .map((specialization) => {
                                        return (
                                          <li className="custom-tooltip-text-design">{`${
                                            specialization.course_name
                                          } ${
                                            specialization.spec_name ? "in" : ""
                                          } ${
                                            specialization.spec_name
                                              ? specialization.spec_name
                                              : "(no specialization)"
                                          }`}</li>
                                        );
                                      })}
                                  </ul>
                                </div>
                              }
                              component={
                                <Box
                                  sx={{ borderRadius: 10 }}
                                  className="voucher-course-length-box"
                                >
                                  <Typography
                                    sx={{ fontSize: "10px", color: "white" }}
                                  >{`+${
                                    row?.program_name?.slice(1)?.length
                                  }`}</Typography>
                                </Box>
                              }
                              placement={'right'}
                            />
                          )}
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell
                        bodyCellPadding={"16px 18px !important"}
                        sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                        align="center"
                      >
                        <Typography className="promoCode-value-text-size">{`${
                          row?.used ? row?.used : "0"
                        } | ${
                          row?.created ? row?.created : "---"
                        }`}</Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        bodyCellPadding={"16px 18px !important"}
                        sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                        align="center"
                      >
                        <Typography className="promoCode-value-text-size">
                          {row.assigned_date ? dateWithOutTime(row.assigned_date) : "---"}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        bodyCellPadding={"16px 18px !important"}
                        sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                        align="left"
                      >
                        <Box
                          className={
                            row.status === "Upcoming" || row.status === "Active"
                              ? "promoCode-resolved-action"
                              : "promoCode-unResolved-action"
                          }
                          sx={{
                            cursor:
                              (row.status === "Inactive"&& !voucher) ||
                              (row.status === "Active" && !voucher)
                                ? "pointer"
                                : "",
                          }}
                          onClick={() => {
                            if (
                              (row.status === "Inactive" && !voucher) ||
                             ( row.status === "Active" && !voucher)
                            ) {
                              setOpenConfirmStatusDialog(true);
                              setSelectedVoucherInfo(row)
                            }
                          }}
                        >
                          <Typography className="status-text-promoCode">
                            <Typography className="status-text-promoCode-text-size">
                              {row.status}
                            </Typography>
                            {
                                !voucher &&
                             <>
                              {(row.status === "Inactive" ||
                              row.status === "Active") && (
                              <ArrowDropDownIcon sx={{ fontSize: "20px" }} />
                            )}
                             </>
                            }
                           
                          </Typography>
                        </Box>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
        </>
    );
};

export default VoucherTable;