export const handleSomethingWentWrong = (somethingWentWrong, hideComponent, time) => {
    somethingWentWrong(true)
    setTimeout(() => {
        somethingWentWrong(false)
        hideComponent && hideComponent(true)
    }, time)
}