import { handleInternalServerError } from "../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../utils/handleSomethingWentWrong";

export const handleReportGenerate = (generateReport, collegeId, token, payloadForReportGeneration, pushNotification, setApiResponseChangeMessage, setSomethingWentWrong, setInternalServerError, resetAllReportGenerateFields, setGenerateReportLoading, setShowGenerateRequest) => {

    setGenerateReportLoading && setGenerateReportLoading(true);
    generateReport({ collegeId, payloadForReportGeneration }).unwrap().then(res => {
        if (res?.detail === "Could not validate credentials") {
            window.location.reload();
        } else if (res?.message) {
            try {
                if (typeof res?.message === "string") {
                    pushNotification("success", res?.message);
                    resetAllReportGenerateFields && resetAllReportGenerateFields()
                    setShowGenerateRequest && setShowGenerateRequest()
                } else {
                    throw new Error("enable_or_disable API response has changed")
                }
            } catch (error) {
                setApiResponseChangeMessage(error);
                handleSomethingWentWrong(setSomethingWentWrong, "", 5000)
            }
        } else if (res?.detail) {
            pushNotification("error", res?.detail);
        }
    }).catch((error) => {
        handleInternalServerError(setInternalServerError, "", 5000)
    }).finally(() => { setGenerateReportLoading && setGenerateReportLoading(false) })

}
