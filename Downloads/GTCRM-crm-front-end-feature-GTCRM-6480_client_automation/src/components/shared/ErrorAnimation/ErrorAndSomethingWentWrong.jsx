import { Box } from "@mui/material";
import React, { useContext } from "react";
import Error500Animation from "./Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";

function ErrorAndSomethingWentWrong({
  isInternalServerError,
  isSomethingWentWrong,
  containerHeight,
}) {
  const { apiResponseChangeMessage } = useContext(DashboradDataContext);
  return (
    <>
      <Box
        sx={{ minHeight: containerHeight }}
        className="common-not-found-container"
      >
        {isInternalServerError && (
          <Error500Animation height={200} width={200}></Error500Animation>
        )}
        {isSomethingWentWrong && (
          <ErrorFallback
            error={apiResponseChangeMessage}
            resetErrorBoundary={() => window.location.reload()}
          />
        )}
      </Box>
    </>
  );
}

export default ErrorAndSomethingWentWrong;
