export const reportFilterExceptionHandling = (setError) => {
    setError(true)
    setTimeout(() => {
        setError(false)
    }, 5000)
}