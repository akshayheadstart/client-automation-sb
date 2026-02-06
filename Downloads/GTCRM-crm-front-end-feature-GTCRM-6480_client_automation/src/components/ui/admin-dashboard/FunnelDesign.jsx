import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import FunnelSection from "./FunnelSection";

import "../../../styles/FunnelDesign.css";

const FunnelDesignV2 = ({ funnelData = {} }) => {
  const theme = useTheme();
  const isLessThanLg = useMediaQuery(theme.breakpoints.down("lg"));

  const funnelSectionData = React.useMemo(
    () => [
      {
        width: "306",
        height: "58",
        style: {
          transform: isLessThanLg ? "scale(0.65)" : "scale(1)",
          top: isLessThanLg ? "-22px" : "-10px",
        },
        className: "leads-section",
        path: (
          <path
            d="M152.991 15.1638C99.4229 15.1638 24.178 11.2084 0.335938 0.813374L20.5275 39.7387H20.5502C20.5502 39.7387 20.5615 39.792 20.5729 39.824L21.3665 41.3592C28.0441 48.4278 76.8732 57.1596 152.991 57.1596C229.109 57.1596 277.938 48.4278 284.616 41.3592L285.421 39.8133C285.421 39.8133 285.432 39.76 285.432 39.728H285.455L305.646 0.802734C281.793 11.1871 206.559 15.1532 152.991 15.1532V15.1638Z"
            fill="#008BE2"
          />
        ),
        value: funnelData?.total_leads || 0,
        label: "Leads",
        differentiator: (
          <Box
            style={{
              top: isLessThanLg ? "43px" : "58px",
              right: isLessThanLg ? "11px" : "-35px",
            }}
            className="lead-percentage-legend"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="15"
              viewBox="0 0 12 15"
              fill="none"
            >
              <path
                d="M4.97393 1.07302H7.91837V13.1307H0.365234V14.0582H9.07055V9.42065H11.7346V8.49314H9.07055L9.07055 0.145508H4.97393V1.07302Z"
                fill="#023E8A"
              />
            </svg>
            <span className="legend-text">
              {funnelData.verified_leads_perc || 0}%
            </span>
          </Box>
        ),
      },
      {
        width: "259",
        style: {
          top: isLessThanLg ? "-48px" : "-20px",
          transform: isLessThanLg ? "scale(0.65)" : "scale(1)",
        },
        height: "56",
        className: "verified-lead-section",
        path: (
          <path
            d="M129.47 13.5876C93.1034 13.5876 58.8907 11.5393 33.1343 7.82875C18.4213 5.70535 7.59453 3.20664 0.642578 0.354004L20.3131 38.3069H20.4385C20.4385 38.4249 20.4841 38.5536 20.5069 38.6716L21.2476 40.0872C27.1967 47.1759 67.2672 55.8303 129.481 55.8303C159.101 55.8303 186.921 53.8142 207.822 50.1465C226.706 46.8327 235.402 42.8969 237.795 39.9478L238.456 38.6609C238.479 38.5429 238.513 38.4249 238.513 38.3069H238.638L258.309 0.354004C251.357 3.20664 240.53 5.70535 225.817 7.82875C200.061 11.5393 165.848 13.5876 129.481 13.5876H129.47Z"
            fill="#0498DE"
          />
        ),
        value: funnelData?.verified_leads || 0,
        label: "Verified Lead",
        differentiator: (
          <Box
            style={{
              top: isLessThanLg ? "72px" : "105px",
              right: isLessThanLg ? "0px" : "-35px",
            }}
            className="verified-lead-percentage-legend"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="38"
              height="15"
              viewBox="0 0 38 15"
              fill="none"
            >
              <path
                d="M4.69659 1.62429H7.64103V13.682H0.0878906V14.6095H8.7932V9.97192H37.0363V9.04441H8.7932L8.7932 0.696777H4.69659V1.62429Z"
                fill="#0251A0"
              />
            </svg>
            <span className="legend-text">
              {funnelData.verified_paid_app_perc || 0}%
            </span>
          </Box>
        ),
      },
      {
        width: "210",
        height: "55",
        style: {
          transform: isLessThanLg ? "scale(0.65)" : "scale(1)",
          top: isLessThanLg ? "-73px" : "-28px",
        },
        className: "paid-application-section",
        path: (
          <path
            d="M0.960564 0.0249023L22.1154 40.6911C30.315 47.8322 62.2581 54.6207 105.48 54.6207C148.702 54.6207 180.656 47.8429 188.845 40.6911L209.999 0.0249023C191.137 8.18166 147.322 12.5113 105.469 12.5113C63.6153 12.5113 19.8004 8.19235 0.949219 0.0249023H0.960564Z"
            fill="#09A4DA"
          />
        ),
        value: funnelData?.paid_applications || 0,
        label: "Paid Application",
        differentiator: (
          <Box
            style={{
              top: isLessThanLg ? "104px" : "156px",
              right: isLessThanLg ? "-8px" : "-35px",
            }}
            className="paid-lead-percentage-legend"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="15"
              viewBox="0 0 64 15"
              fill="none"
            >
              <path
                d="M5.40948 1.53347H8.35392V13.5912H0.800781V14.5187H9.50609V9.8811H63.0297V8.95359H9.50609L9.5061 0.605957H5.40948V1.53347Z"
                fill="#0165B6"
              />
            </svg>
            <span className="legend-text">
              {funnelData.submitted_paid_app_perc || 0}%
            </span>
          </Box>
        ),
      },
      {
        width: "160",
        height: "55",
        style: {
          top: isLessThanLg ? "-97px" : "-35px",
          transform: isLessThanLg ? "scale(0.65)" : "scale(1)",
        },
        className: "submitted-section",
        path: (
          <path
            d="M0.259166 0.576172L1.32011 2.64378L18.7745 36.6028H18.7973C18.7973 36.6028 18.7973 36.6353 18.7973 36.6569L21.2728 41.485C29.3496 49.2251 55.8048 54.2914 79.9785 54.2914C104.152 54.2914 130.607 49.2251 138.684 41.485L141.16 36.6569C141.16 36.6569 141.16 36.6244 141.16 36.6136H141.183L158.637 2.65461L159.698 0.587008C143.396 7.83996 111.008 11.6721 79.9672 11.6721C48.9259 11.6721 16.5498 7.83996 0.236328 0.587008L0.259166 0.576172Z"
            fill="#0DB1D6"
          />
        ),
        value: funnelData?.submitted_applications || 0,
        label: "Submitted",
        differentiator: (
          <Box
            style={{
              top: isLessThanLg ? "136px" : "206px",
              right: isLessThanLg ? "-17px" : "-34px",
            }}
            className="submitted-percentage-legend"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="96"
              height="15"
              viewBox="0 0 96 15"
              fill="none"
            >
              <path
                d="M15.0527 1.20437H17.9971V13.2621H0.720703V14.1896H19.1493V9.552H95.0364V8.62449H19.1493L19.1493 0.276855H15.0527V1.20437Z"
                fill="#0178CC"
              />
            </svg>
            <span className="legend-text">
              {funnelData.submitted_enrolments_perc || 0}%
            </span>
          </Box>
        ),
      },
      {
        width: "109",
        height: "52",
        style: {
          transform: isLessThanLg ? "scale(0.65)" : "scale(1)",
          top: isLessThanLg ? "-119px" : "-40px",
        },
        className: "enrollment-section",
        path: (
          <path
            d="M0.513672 0.00732422L21.9063 41.4945C28.0458 47.121 40.4816 51.0808 54.4777 51.0808C68.4738 51.0808 80.9098 47.121 87.0493 41.5051L108.442 0.0179506C96.8253 5.64442 77.1835 9.28568 54.4777 9.28568C31.7719 9.28568 12.1303 5.65503 0.513672 0.0179506V0.00732422Z"
            fill="#11BED2"
          />
        ),
        value: funnelData?.enrollments || 0,
        label: "Enrollment",
        differentiator: null,
      },
    ],
    [funnelData, isLessThanLg]
  );

  return (
    <Box className="funnel-container">
      <div
        style={{
          transform: isLessThanLg ? "scale(.65)" : "scale(1)",
        }}
        className="circle"
      ></div>
      {funnelSectionData.map((item) => {
        return (
          <>
            <FunnelSection
              width={item.width}
              height={item.height}
              className={item.className}
              path={item.path}
              value={item.value}
              label={item.label}
              style={item.style}
            />
            {item.differentiator}
          </>
        );
      })}
    </Box>
  );
};
export default FunnelDesignV2;
