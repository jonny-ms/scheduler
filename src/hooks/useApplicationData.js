import { useEffect, useReducer} from "react";
import axios from "axios";

const SET_DAY = "SET_DAY"
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW"

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  function reducer(state, action) {

    switch(action.type) {
      case SET_DAY:
        return { ...state, day: action.value }
      case SET_APPLICATION_DATA:
        return { ...state, days: action.value.days, appointments: action.value.appointments, interviewers: action.value.interviewers }
      case SET_INTERVIEW:
        // console.log("in switch", action.value.days)
        return { ...state, appointments: action.value.appointments, days: action.value.days }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const setDay = day => dispatch({type: SET_DAY, value: day });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, value: { days: all[0].data, appointments: all[1].data, interviewers: all[2].data } }
        // prev => ({
        // ...prev,
        // days: all[0].data,
        // appointments: all[1].data,
        // interviewers: all[2].data
      // })
      )
    })
  }, []);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
 
    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => dispatch({ type: SET_INTERVIEW, value: { appointments, days: updatedDays(state.days, id, true)}}))
  };

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };



    return axios.delete(`/api/appointments/${id}`, state.appointments[id])
      .then(() => {
        dispatch({ type: SET_INTERVIEW, value: { appointments, days: updatedDays(state.days, id)} })
      })
  };

  function updateSpots(spots, add = false) {

    return add ? spots -= 1 : spots += 1
  }
  
  function updatedDays(days, id, add = false) {
    return days.map(day => {
      if (!day.appointments.includes(id)) {
        return day
      }
      return {
        ...day,
        spots: updateSpots(day.spots, add)
      }

    })
  }

  return { state, setDay, bookInterview, cancelInterview }
}