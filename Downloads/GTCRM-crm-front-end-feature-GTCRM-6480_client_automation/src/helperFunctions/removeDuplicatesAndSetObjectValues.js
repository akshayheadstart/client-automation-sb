//remove duplicates objects from array and set object value in an array
export const removeDuplicatesAndSetObjectValues = (keyName, selectedApplications) => {
    const filteredObjects = selectedApplications?.filter((selectedApplication, index, self) =>
        index === self.findIndex((item) => (
            item[keyName] === selectedApplication[keyName]
        )) && selectedApplication[keyName] !== ""
    )
    return filteredObjects?.map(object => object[keyName])
}
