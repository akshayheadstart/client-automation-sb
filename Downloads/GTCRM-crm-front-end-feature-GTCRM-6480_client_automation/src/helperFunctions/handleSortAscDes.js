// sort array of object
export const handleSortingAScDes = (sortField, sortOrder, listOfUsers, setLoading, setListOfUsers) => {

    const sorted = [...listOfUsers].sort((first_item, second_item) => {

        if (typeof first_item[sortField] !== 'number' && !isNaN(Date.parse(first_item[sortField]))) {
            if (sortOrder === "asc") {
                return new Date(first_item[sortField]) - new Date(second_item[sortField])
            }
            else {
                return new Date(second_item[sortField]) - new Date(first_item[sortField])
            }

        }
        else {
            return (
                first_item[sortField].toString().localeCompare(second_item[sortField].toString(), "en", {
                    numeric: true,
                }) * (sortOrder === "asc" ? 1 : -1)
            );
        }

    });
    setLoading(true)
    setListOfUsers(sorted)
    setTimeout(() => {
        setLoading(false)
    }, 100)
        ;
};