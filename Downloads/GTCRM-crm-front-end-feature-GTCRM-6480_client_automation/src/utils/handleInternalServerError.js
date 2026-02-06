export const handleInternalServerError = (internalServerError, hideComponent, time) => {

  internalServerError(true)
  setTimeout(() => {
    internalServerError(false)
    hideComponent && hideComponent(true)
  }, time)
}