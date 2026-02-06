import React from 'react';
import "../../styles/dataSegmentUserProfile.css";
import "../../styles/sharedStyles.css";
import "../../styles/voucherPromocodeManager.css";
import { Box} from '@mui/material';
import { DateRangePicker, Input, SelectPicker } from 'rsuite';
import BorderLineText from '../../components/ui/NestedAutomation/AutomationHelperComponent/BorderLineText';
import accessAvatar from "../../images/accessAvatar.png";
import MultipleFilterSelectPicker from '../../components/shared/filters/MultipleFilterSelectPicker';
import { generalNumberValidation } from '../../components/shared/forms/Validation';
const VoucherInputComponent = ({voucherName,setVoucherName,selectedVoucherList,hidePublisherList,assignedPublisher,publisherList,publisherListApiCallInfo,setSkipPublisherApiCall,setAssignedPublisher,hideCourseList,setSelectedCourseId,courseDetails,selectedCourseId,courseListInfo,setSkipCourseApiCall,quantity, setQuantity, costPerVoucher, setCostPerVoucher, voucherDuration,setVoucherDuration,beforeToday}) => {
    return (
        <>
            <Box className="input-field-placeholder-design">
                  <Input
                    placeholder={"Name*"}
                    size="md"
                    className="select-picker select-picker-design"
                    onChange={(event) => {
                      setVoucherName(event);
                    }}
                    value={voucherName}
                    readOnly={(selectedVoucherList &&selectedVoucherList?.status !== "Upcoming")}
                  />
                  {voucherName && (
                    <BorderLineText text={"Name*"} width={30}></BorderLineText>
                  )}
                </Box>
                <Box className="input-field-placeholder-design">
                  {hidePublisherList || (
                    <SelectPicker
                    menuMaxHeight={170}
                      placement="bottomEnd"
                      value={assignedPublisher}
                      size="md"
                      placeholder="Assigned to*"
                      data={publisherList}
                      style={{ width: "100%" }}
                      className="select-picker select-picker-design input-field-for-select-picker"
                      loading={publisherListApiCallInfo?.isFetching}
                      onOpen={() => setSkipPublisherApiCall(false)}
                      onChange={(newValue) => {
                        setAssignedPublisher(newValue);
                      }}
                      renderMenuItem={(label, item) => (
                        <div
                          key={item.value}
                          className="assigned-publisher-div-container"
                        >
                          <div>
                            <img
                              src={accessAvatar}
                              alt="profile icon"
                              width={"30px"}
                              height={"30px"}
                            />
                          </div>
                          <div>
                            <div style={{ fontSize: "14px" }}>{label}</div>
                            <div style={{ fontSize: "12px", color: "#888" }}>
                              {item.email}
                            </div>
                          </div>
                        </div>
                      )}
                      readOnly={(selectedVoucherList &&selectedVoucherList?.status !== "Upcoming")}
                    />
                  )}
                  {assignedPublisher && (
                    <BorderLineText
                      text={"Assigned to*"}
                      width={60}
                    ></BorderLineText>
                  )}
                </Box>
                <Box>
                  {hideCourseList || (
                    <MultipleFilterSelectPicker
                      style={{ width: "200px" }}
                      placement="bottomEnd"
                      placeholder="Program Name*"
                      className="dashboard-select-picker input-field-placeholder-color-for-check-picker"
                      onChange={(value) => {
                        setSelectedCourseId(value);
                      }}
                      pickerData={courseDetails}
                      setSelectedPicker={setSelectedCourseId}
                      pickerValue={selectedCourseId}
                      loading={courseListInfo?.isFetching}
                      onOpen={() => setSkipCourseApiCall(false)}
                      readOnly={(selectedVoucherList &&selectedVoucherList?.status !== "Upcoming")}
                      maxHeight={170}
                    />
                  )}
                  {selectedCourseId?.length > 0 && (
                    <BorderLineText
                      text={"Program Name*"}
                      width={80}
                    ></BorderLineText>
                  )}
                </Box>
                <Box className="input-field-placeholder-design">
                  <Input
                    placeholder={"Quantity*"}
                    size="md"
                    className="select-picker select-picker-design"
                    type="number"
                    value={quantity}
                    onChange={(value) => {
                            setQuantity(value);
                    }}
                    onKeyDown={generalNumberValidation}
                    readOnly={(selectedVoucherList &&selectedVoucherList?.status === "Expired")}
                  />
                  {quantity && (
                    <BorderLineText
                      text={"Quantity*"}
                      width={50}
                    ></BorderLineText>
                  )}
                </Box>
                <Box className="input-field-placeholder-design">
                  <Input
                    placeholder={"Cost per Voucher*"}
                    size="md"
                    className="select-picker select-picker-design"
                    type="number"
                    value={costPerVoucher}
                    onChange={(value) => {
                      setCostPerVoucher(value);
                    }}
                    readOnly={(selectedVoucherList &&selectedVoucherList?.status !== "Upcoming")}
                    onKeyDown={generalNumberValidation}
                  />
                  {costPerVoucher && (
                    <BorderLineText
                      text={"Cost per Voucher*"}
                      width={90}
                    ></BorderLineText>
                  )}
                </Box>
                <Box>
                  <DateRangePicker
                    className="select-picker create-promoCode-voucher-date-range-picker-design select-picker-design input-field-placeholder-design"
                    placeholder={"Duration*"}
                    value={voucherDuration}
                    onChange={(value) => {
                      setVoucherDuration(value);
                    }}
                    style={{ width: "200px" }}
                    placement="auto"
                    readOnly={(selectedVoucherList &&selectedVoucherList?.status === "Expired")}
                    shouldDisableDate={
                     (selectedVoucherList && selectedVoucherList?.status === "Upcoming")
                        ? beforeToday()
                        : ""
                    }
                  />
                  {voucherDuration?.length > 0 && (
                    <BorderLineText
                      text={"Duration*"}
                      width={60}
                    ></BorderLineText>
                  )}
                </Box>
        </>
    );
};

export default VoucherInputComponent;