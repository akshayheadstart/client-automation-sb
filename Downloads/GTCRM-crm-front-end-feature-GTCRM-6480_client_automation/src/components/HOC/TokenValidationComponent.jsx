import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackDrop from "../shared/Backdrop/Backdrop";
import {
  useCheckTokenValidityQuery,
  useGetAccessTokenQuery,
} from "../../Redux/Slices/refreshTokenSlice";
import { useDispatch } from "react-redux";
import {
  removeCookies,
  setLoadTokenVerify,
  setTokenInfo,
  setUserEmail,
} from "../../Redux/Slices/authSlice";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

export const WithTokenValidation = ({ children }) => {
  const [tokenStatus, setTokenStatus] = useState(null);
  const navigate = useNavigate();
  const [skipToCallAccessTokenQuery, setSkipToCallAccessTokenQuery] =
    useState(true);
  const [skipToCallGetTokenInfoQuery, setSkipToCallGetTokenInfoQuery] =
    useState(true);
  const dispatch = useDispatch();
  const {
    data: tokenValidityInfo,
    isSuccess: isSuccessTokenInfoAPI,
    error: errorTokenInfoAPI,
    isError: isErrorTokenInfoAPI,
  } = useCheckTokenValidityQuery({}, { skip: skipToCallGetTokenInfoQuery });

  useEffect(() => {
    try {
      if (isSuccessTokenInfoAPI) {
        setTokenStatus("valid");
        dispatch(setTokenInfo(tokenValidityInfo));
      }
      if (isErrorTokenInfoAPI) {
        if (errorTokenInfoAPI?.status === 500) {
          navigate("/page500");
        } else {
          setSkipToCallAccessTokenQuery(false);
        }
      }
    } catch (error) {
      navigate("/page500");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorTokenInfoAPI, isSuccessTokenInfoAPI, tokenValidityInfo]);

  const {
    data: accessToken,
    isSuccess: isSuccessAccessTokenAPI,
    error: errorAccessTokenAPI,
    isError: isErrorAccessTokenAPI,
  } = useGetAccessTokenQuery(
    {},
    {
      skip: skipToCallAccessTokenQuery,
    }
  );

  useEffect(() => {
    try {
      if (isSuccessAccessTokenAPI) {
        const decodeAccessToken = jwt_decode(accessToken?.access_token);
        dispatch(setTokenInfo(decodeAccessToken));
        setTokenStatus("valid");
        const decoded = jwt_decode(accessToken?.access_token);

        Cookies.set(
          "jwtTokenCredentialsAccessToken",
          accessToken?.access_token,
          { expires: 1 }
        );
        Cookies.set("userId", decoded.sub);
        Cookies.set("season", "");
        dispatch(setLoadTokenVerify(true));
        dispatch(setUserEmail({ userId: decoded.sub, authenticated: true }));
        localStorage.clear();
      }
      if (isErrorAccessTokenAPI) {
        setTokenStatus("invalid");
        if (errorAccessTokenAPI?.data?.detail === "Token is not valid") {
          dispatch(setTokenInfo(errorAccessTokenAPI?.data));
          dispatch(removeCookies());
        }
        if (errorAccessTokenAPI?.status === 500) {
          navigate("/page500");
        }
      }
    } catch (error) {
      navigate("/page500");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorAccessTokenAPI, isSuccessAccessTokenAPI, accessToken]);

  useEffect(() => {
    Cookies.get("jwtTokenCredentialsRefreshToken")
      ? setSkipToCallGetTokenInfoQuery(false)
      : setSkipToCallGetTokenInfoQuery(true);
    // Check the token status and perform navigation here
    if (tokenStatus === "invalid" && isErrorAccessTokenAPI === true) {
      navigate("/page401");
    }
  }, [navigate, tokenStatus, isErrorAccessTokenAPI]);

  useEffect(() => {
    setTimeout(() => {
      Cookies.get("jwtTokenCredentialsRefreshToken")
        ? setSkipToCallGetTokenInfoQuery(false)
        : setTokenStatus("invalid");
    }, 1000);
  }, []);

  if (tokenStatus === null) {
    // Display loading spinner or placeholder while fetching tokenInfo API
    return <BackDrop openBackdrop={true} text={"Checking.."} />;
  } else if (tokenStatus === "valid") {
    return children;
  } else {
    return null;
  }

  // Default case, handle other scenarios as needed
};
