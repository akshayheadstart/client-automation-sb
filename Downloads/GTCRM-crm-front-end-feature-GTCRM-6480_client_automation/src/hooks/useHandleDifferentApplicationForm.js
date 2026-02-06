
const useHandleDifferentApplicationForm = () => {
    const handleUpdateNewField = (formFieldsStates, updatedField, index, fieldKey, freshData) => {
        const allExistingFields = structuredClone(formFieldsStates.differentCourseFormFields);

        if (fieldKey.length === 2) {
            if (freshData) {
                const existing = structuredClone(formFieldsStates.differentCourseFormFields[index][fieldKey[0]]);
                existing[fieldKey[1]].push(freshData);
                allExistingFields[index][fieldKey[0]] = existing;
            }
            else {
                const existing = structuredClone(formFieldsStates.differentCourseFormFields[index][fieldKey[0]]);
                existing[fieldKey[1]] = updatedField
                allExistingFields[index][fieldKey[0]] = existing;
            }

        } else if (fieldKey.length === 3) {
            if (freshData) {
                const existing = structuredClone(formFieldsStates.differentCourseFormFields[index][fieldKey[0]]);
                existing[fieldKey[1]][fieldKey[2]].push(freshData);
                allExistingFields[index][fieldKey[0]] = existing
            }
            else {
                const existing = structuredClone(formFieldsStates.differentCourseFormFields[index][fieldKey[0]]);
                existing[fieldKey[1]][fieldKey[2]] = updatedField
                allExistingFields[index][fieldKey[0]] = existing;
            }
        } else {
            if (freshData) {
                let existing = structuredClone(formFieldsStates.differentCourseFormFields[index][fieldKey[0]])
                existing.push(freshData);
                allExistingFields[index][fieldKey[0]] = existing
            }
            else allExistingFields[index][fieldKey[0]] = updatedField
        }

        formFieldsStates.setDifferentCourseFormFields(allExistingFields)
    }

    return handleUpdateNewField

}
export default useHandleDifferentApplicationForm