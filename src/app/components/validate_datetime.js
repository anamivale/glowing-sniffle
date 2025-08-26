export  function validateEventDate(date) {
    const current_year = new Date(Date.now())
    const event_year = new Date(date)
    if (event_year < current_year) {
        return new Error("The event date cannot be before now")
    }

}

export  function validateEventDuration(startTime, endTime) {
    const [sh, sm] = startTime.split(":").map(Number)
    const [eh, em] = endTime.split(":").map(Number)

    const startTimeInMinutes = (sh * 60) + sm
    const EndTimeInMinutes = (eh * 60) + em

    if (startTimeInMinutes + 30 > EndTimeInMinutes) {
        return new Error("invalid duration")
    }

}