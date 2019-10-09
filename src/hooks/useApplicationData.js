import { useEffect, useReducer} from "react";
import axios from "axios";
import reducer, {SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW} from "reducers/application"

export default function useApplicationData() {
  
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({type: SET_DAY, value: day });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, value: { days: all[0].data, appointments: all[1].data, interviewers: all[2].data } })
    })
  }, []);

  //WebSocket. When setting interview. WebSocket message sent and received with interview data. Dispatch new state.
  useEffect(() => {
    const socket = new WebSocket (process.env.REACT_APP_WEBSOCKET_URL)
    socket.onopen = function(event) {
      socket.onmessage = function(event) {

        const parsedData = JSON.parse(event.data)

          if (parsedData.type === "SET_INTERVIEW") {

            const id = parsedData.id
            const interview = parsedData.interview

            const appointment = {
              ...state.appointments[id],
              interview: interview ? { ...interview } : null
            }
            const appointments = {
              ...state.appointments,
              [id]: appointment
            };

            dispatch({type: SET_INTERVIEW, value: { appointments, days: updateSpots(appointments)}})
        }
      }
    };
    
  }, [])
  
  function updateSpots(appointments) {
    return state.days.map(day => {
      let result = 0
      day.appointments.forEach( id => {
        if (appointments[id].interview === null) {
          result += 1
        }
      })
      return {
        ...day,
        spots: result
      }
    });
  }

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
      .then(() => {
        dispatch({ type: SET_INTERVIEW, value: { appointments, days: updateSpots(appointments)}})
      })
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
        dispatch({ type: SET_INTERVIEW, value: { appointments, days: updateSpots(appointments)} })
      })
  };

  return { state, setDay, bookInterview, cancelInterview }
}