import Cookies from "js-cookie"

//with skip no
export const removeLocalStorageWithSkip = (skip, list, localStorageName) => {
    for (let firstItem = 0; firstItem < Object.keys(list[0])?.length; firstItem++) {
        if (firstItem === parseInt(skip)) {
            continue
        } else {
            localStorage.removeItem(`${Cookies.get("userId")}${localStorageName}${firstItem}`)
        }
    }
}
//without skip 
export const removeLocalStorageWithoutSkip = (list, localStorageName) => {
    for (let firstItem = 0; firstItem < Object.keys(list[0])?.length; firstItem++) {
        localStorage.removeItem(`${Cookies.get("userId")}${localStorageName}${firstItem}`)
    }
}
