import React from 'react';
import "../../styles/sharedStyles.css";
import "../../styles/voucherPromocodeManager.css";
import { Box } from '@mui/material';
import { DateRangePicker, Input, InputGroup } from 'rsuite';
import BorderLineText from '../../components/ui/NestedAutomation/AutomationHelperComponent/BorderLineText';
import { generalNumberValidation } from '../../components/shared/forms/Validation';
const PromoCodeInputComponent = ({promoCodeName,setPromoCodeName,selectedPromoCodeInfo,handleInputChange,promoCode,setDiscount,discount, setUnit,unit,setDuration,duration,beforeToday}) => {
    return (
        <>
        <Box className="input-field-placeholder-design">
                  <Input
                    placeholder={"Name*"}
                    size="md"
                    className="select-picker select-picker-design"
                    onChange={(event) => {
                      setPromoCodeName(event);
                    }}
                    value={promoCodeName}
                    readOnly={(selectedPromoCodeInfo && selectedPromoCodeInfo?.status !== "Upcoming")}
                  />
                  {promoCodeName && (
                    <BorderLineText text={"Name*"} width={30}></BorderLineText>
                  )}
                </Box>
                <Box className="input-field-placeholder-design">
                  <Input
                    placeholder={"Code*"}
                    size="md"
                    className="select-picker select-picker-design"
                    onChange={handleInputChange}
                    value={promoCode}
                    readOnly={(selectedPromoCodeInfo && selectedPromoCodeInfo?.status !== "Upcoming")}
                  />
                  {promoCode && (
                    <BorderLineText text={"Code*"} width={30}></BorderLineText>
                  )}
                </Box>
                <Box className="input-field-placeholder-design">
                  <InputGroup
                    className="create-inputGroup-content select-picker select-picker-design"
                    readOnly={(selectedPromoCodeInfo && selectedPromoCodeInfo?.status !== "Upcoming")}
                  >
                    <Input
                      min={0}
                      max={100}
                      type="number"
                      placeholder="50%"
                      onChange={(event) => {
                        setDiscount(event);
                      }}
                      value={discount}
                      readOnly={(selectedPromoCodeInfo && selectedPromoCodeInfo?.status !== "Upcoming")}
                      style={{paddingRight:0}}
                      onKeyDown={generalNumberValidation}
                    />
                    <Input
                      type="string"
                      value={discount?"%":""}
                      readOnly
                      style={{paddingLeft:0}}
                    />
                    <InputGroup.Addon>| of application fee</InputGroup.Addon>
                  </InputGroup>
                  {discount && (
                    <BorderLineText
                      text={"% Discount"}
                      width={60}
                    ></BorderLineText>
                  )}
                </Box>
                <Box className="input-field-placeholder-design">
                  <Input
                    placeholder={"Units*"}
                    size="md"
                    className="select-picker select-picker-design"
                    onChange={(event) => {
                      setUnit(event);
                    }}
                    value={unit}
                    readOnly={(selectedPromoCodeInfo && selectedPromoCodeInfo?.status === "Expired")}
                    onKeyDown={generalNumberValidation}
                  />
                  {unit && (
                    <BorderLineText text={"Units*"} width={30}></BorderLineText>
                  )}
                </Box>
                <Box>
                  <DateRangePicker
                    className="select-picker create-promoCode-voucher-date-range-picker-design select-picker-design"
                    placeholder={"Duration"}
                    onChange={(event) => {
                      setDuration(event);
                    }}
                    style={{ width: "100%", height: "34px !important" }}
                    value={duration?.length ? duration : null}
                    readOnly={(selectedPromoCodeInfo && selectedPromoCodeInfo?.status === "Expired")}
                    shouldDisableDate={(selectedPromoCodeInfo &&selectedPromoCodeInfo?.status === "Upcoming")?beforeToday():""}
                    placement='auto'
                  />
                  {duration?.length > 0 && (
                    <BorderLineText
                      text={"Duration*"}
                      width={50}
                    ></BorderLineText>
                  )}
                </Box>
            
        </>
    );
};

export default PromoCodeInputComponent;