function getAppointmentsForDay(state, day) {
  const filteredDay = state.days.filter((res) => res.name === day)[0];
  if (!filteredDay || !filteredDay.appointments) {
    return []
  }

  const result = filteredDay.appointments.map(appointment => {
      return state.appointments[appointment]
  })

  return result
}

function getInterview(state, interview) {
  if (interview === null) {
    return null
  }
  const id = interview.interviewer
  const result = {student: interview.student, interviewer: state.interviewers[id]}
  return result
  


}

export{ getAppointmentsForDay, getInterview }