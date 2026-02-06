
export const ApiCallHeaderAndBody = (token, method, body) => {
    return {
        method: method,
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
        },
        body: body,
    }
}