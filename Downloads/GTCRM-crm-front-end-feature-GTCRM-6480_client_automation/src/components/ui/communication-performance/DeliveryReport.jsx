import React from "react";
import { Modal } from "rsuite";
import { Box, IconButton, Typography } from "@mui/material";
import {
  CloseRounded,
  SendRounded,
  CheckCircleOutlineRounded,
  PinDropRounded,
  DraftsOutlined,
  ArrowRightOutlined,
} from "@mui/icons-material";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { useState } from "react";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


function DeliveryReport({ deliveryReport, setDeliveryReport, ruleDeliveryDetailsData, ruleDetailsDeliveryInternalServerError, somethingWentWrongInRuleDetailsDelivery, apiResponseChangeMessage }) {

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="modal-container">
      <Modal open={deliveryReport} onClose={() => setDeliveryReport(false)}>
        <Box className="modalHeader">
          <Typography variant="h6" className="">
            Delivery Report
          </Typography>
          <Box>
            <IconButton>
              <CloseRounded onClick={() => setDeliveryReport(false)} />
            </IconButton>
          </Box>
        </Box>
        {ruleDetailsDeliveryInternalServerError || somethingWentWrongInRuleDetailsDelivery ? <>
          {ruleDetailsDeliveryInternalServerError && <Error500Animation height={400} width={400}></Error500Animation>}
          {somethingWentWrongInRuleDetailsDelivery && <ErrorFallback error={apiResponseChangeMessage} resetErrorBoundary={() => window.location.reload()} />}
        </> : <Modal.Body>
          <Box className="report_body">
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={value || (ruleDeliveryDetailsData?.email && "1") || (ruleDeliveryDetailsData?.sms && "2") || (ruleDeliveryDetailsData?.whatsapp && "3")}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange} aria-label="lab API tabs example">
                    {ruleDeliveryDetailsData?.email && <Tab label="Email" value="1" />}
                    {ruleDeliveryDetailsData?.sms && <Tab label="Sms" value="2" />}
                    {ruleDeliveryDetailsData?.whatsapp && <Tab label="Whatsapp" value="3" />}
                  </TabList>
                </Box>
                {ruleDeliveryDetailsData?.email && <TabPanel value="1" sx={{ p: 0 }}>
                  <Box>
                    <Box className="report_main">
                      <Box className="rpt_icon">
                        <SendRounded size="small" />
                      </Box>
                      <Box className="rpt_report">
                        <Typography variant="body1" className="report_txt">
                          Sent To
                        </Typography>
                      </Box>
                      <Box className="rpt_total">
                        <Typography variant="body1" className="report_txt">
                          {ruleDeliveryDetailsData?.email?.sent}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="report_main">
                      <Box className="rpt_icon deliv_icon">
                        <CheckCircleOutlineRounded size="small" />
                      </Box>
                      <Box className="rpt_report">
                        <Typography variant="body1" className="report_txt">
                          Delivered
                        </Typography>
                      </Box>
                      <Box className="rpt_total">
                        <Typography variant="body1" className="report_txt">
                          {ruleDeliveryDetailsData?.email?.delivered}
                        </Typography>
                      </Box>
                    </Box>

                    <Box className="report_main">
                      <Box className="rpt_icon open_icon">
                        <DraftsOutlined size="small" />
                      </Box>
                      <Box className="rpt_report">
                        <Typography variant="body1" className="report_txt">
                          Opened
                        </Typography>
                      </Box>
                      <Box className="rpt_total">
                        <Typography variant="body1" className="report_txt">
                          {ruleDeliveryDetailsData?.email?.opened}
                        </Typography>
                      </Box>
                    </Box>

                    <Box className="report_main">
                      <Box className="rpt_icon clk_icon">
                        <ArrowRightOutlined size="small" />
                      </Box>
                      <Box className="rpt_report">
                        <Typography variant="body1" className="report_txt">
                          Clicked
                        </Typography>
                      </Box>
                      <Box className="rpt_total">
                        <Typography variant="body1" className="report_txt">
                          {ruleDeliveryDetailsData?.email?.clicked}
                        </Typography>
                      </Box>
                    </Box>

                  </Box>
                </TabPanel>}
                {ruleDeliveryDetailsData?.sms && <TabPanel value="2" sx={{ p: 0 }}>
                  <Box>
                    <Box className="report_main">
                      <Box className="rpt_icon">
                        <SendRounded size="small" />
                      </Box>
                      <Box className="rpt_report">
                        <Typography variant="body1" className="report_txt">
                          Sent To
                        </Typography>
                      </Box>
                      <Box className="rpt_total">
                        <Typography variant="body1" className="report_txt">
                          {ruleDeliveryDetailsData?.sms?.sent}
                        </Typography>
                      </Box>
                    </Box>

                    <Box className="report_main">
                      <Box className="rpt_icon deliv_icon">
                        <CheckCircleOutlineRounded size="small" />
                      </Box>
                      <Box className="rpt_report">
                        <Typography variant="body1" className="report_txt">
                          Delivered
                        </Typography>
                      </Box>
                      <Box className="rpt_total">
                        <Typography variant="body1" className="report_txt">
                          {ruleDeliveryDetailsData?.sms?.delivered}
                        </Typography>
                      </Box>
                    </Box>

                  </Box>
                </TabPanel>}
                {ruleDeliveryDetailsData?.whatsapp && <TabPanel value="3" sx={{ p: 0 }}>
                  <Box>

                    <Box className="report_main">
                      <Box className="rpt_icon">
                        <SendRounded size="small" />
                      </Box>
                      <Box className="rpt_report">
                        <Typography variant="body1" className="report_txt">
                          Sent To
                        </Typography>
                      </Box>
                      <Box className="rpt_total">
                        <Typography variant="body1" className="report_txt">
                          {ruleDeliveryDetailsData?.whatsapp?.sent}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="report_main">
                      <Box className="rpt_icon deliv_icon">
                        <CheckCircleOutlineRounded size="small" />
                      </Box>
                      <Box className="rpt_report">
                        <Typography variant="body1" className="report_txt">
                          Opened
                        </Typography>
                      </Box>
                      <Box className="rpt_total">
                        <Typography variant="body1" className="report_txt">
                          {ruleDeliveryDetailsData?.whatsapp?.opened}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="report_main">
                      <Box className="rpt_icon drop_icon">
                        <PinDropRounded size="small" />
                      </Box>
                      <Box className="rpt_report">
                        <Typography variant="body1" className="report_txt">
                          Dropped
                        </Typography>
                      </Box>
                      <Box className="rpt_total">
                        <Typography variant="body1" className="report_txt">
                          {ruleDeliveryDetailsData?.whatsapp?.invalid}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </TabPanel>}
              </TabContext>
            </Box>
          </Box>
        </Modal.Body>}
      </Modal>
    </Box>
  );
}

export default DeliveryReport;
