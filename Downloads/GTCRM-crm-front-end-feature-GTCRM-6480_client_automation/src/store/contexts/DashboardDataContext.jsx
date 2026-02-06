import { createContext, useState } from "react";

export const DashboradDataContext = createContext();

export const DashboardDataProvider = ({ children }) => {
  // this state is to keep track of dynamic nested dependent fields in client onboarding
  const [targetKeyPath, setTargetKeyPath] = useState([]);

  const [whatsappTemplateObjectId, setWhatsappTemplateObjectId] = useState("");
  //API response change message state
  const [apiResponseChangeMessage, setApiResponseChangeMessage] = useState("");
  const [applicantSearchText, setApplicantSearchText] = useState("");
  const [panelistSearchText, setPanelistSearchText] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState({});
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);

  // admin dashboard internal and something went wrong states
  const [scoreBoardInternalServerError, setScoreBoardInternalServerError] =
    useState(false);
  const [somethingWentWrongInScoreBoard, setSomethingWentWrongInScoreBoard] =
    useState(false);

  const [
    topPerformingInternalServerError,
    setTopPerformingInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInTopPerformingChannel,
    setSomethingWentWrongInTopPerformingChannel,
  ] = useState(false);

  const [
    applicationFunnelInternalServerError,
    setApplicationFunnelInternalServerError,
  ] = useState(false);

  const [
    somethingWentWrongInApplicationFunnel,
    setSomethingWentWrongInApplicationFunnel,
  ] = useState(false);
  const [
    somethingWentWrongInFormWiseApplication,
    setSomethingWentWrongInFormWiseApplication,
  ] = useState(false);
  const [
    formWiseApplicationsInternalServerError,
    setFormWiseApplicationsInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInSourceWiseLeadDetail,
    setSomethingWentWrongInSourceWiseLeadDetail,
  ] = useState(false);

  const [
    sourceWiseLeadDetailInternalServerError,
    setSourceWiseLeadDetailInternalServerError,
  ] = useState(false);

  const data = {
    somethingWentWrongInSourceWiseLeadDetail,
    setSomethingWentWrongInSourceWiseLeadDetail,
    sourceWiseLeadDetailInternalServerError,
    setSourceWiseLeadDetailInternalServerError,
    somethingWentWrongInFormWiseApplication,
    setSomethingWentWrongInFormWiseApplication,
    formWiseApplicationsInternalServerError,
    setFormWiseApplicationsInternalServerError,
    applicationFunnelInternalServerError,
    setApplicationFunnelInternalServerError,
    somethingWentWrongInApplicationFunnel,
    setSomethingWentWrongInApplicationFunnel,
    topPerformingInternalServerError,
    setTopPerformingInternalServerError,
    somethingWentWrongInTopPerformingChannel,
    setSomethingWentWrongInTopPerformingChannel,
    scoreBoardInternalServerError,
    setScoreBoardInternalServerError,
    somethingWentWrongInScoreBoard,
    setSomethingWentWrongInScoreBoard,
    apiResponseChangeMessage,
    setApiResponseChangeMessage,
    applicantSearchText,
    setApplicantSearchText,
    setPanelistSearchText,
    panelistSearchText,
    selectedSlotId,
    setSelectedSlotId,
    selectedApplicant,
    setSelectedApplicant,
    setFaqDialogOpen,
    faqDialogOpen,
    whatsappTemplateObjectId,
    setWhatsappTemplateObjectId,
    targetKeyPath,
    setTargetKeyPath,
  };

  return (
    <DashboradDataContext.Provider value={data}>
      {children}
    </DashboradDataContext.Provider>
  );
};
