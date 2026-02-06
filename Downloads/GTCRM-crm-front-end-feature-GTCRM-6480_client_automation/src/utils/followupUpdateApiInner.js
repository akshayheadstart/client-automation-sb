export const followupUpdateApiInner = (res, pushNotification, props, setFollowupNote, setApiResponseChangeMessage, handleSomethingWentWrong, setSomethingWentWrongInFollowUpListUpdate) => {
    if (res.detail === "Could not validate credentials") {
        window.location.reload();
    } else if (res.code === 200) {
        try {
            if (typeof res.message === "string") {
                pushNotification("success", res?.message);
                props?.handleCloseDialogs();
                setFollowupNote("");
            } else {
                throw new Error("Followup update api response is changed")
            }
        } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setSomethingWentWrongInFollowUpListUpdate, props?.handleCloseDialogs, 5000)
        }
    } else if (res.detail) {
        pushNotification("error", res?.detail);
    }
}