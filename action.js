import deviceStorage from './deviceStorage.js'
import environment from './environment.js'


export const createUser = (username, password, first_name, last_name, email, photo) => {
  let objData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      user: {
        username: username,
        password: password,
        first_name: first_name,
        last_name: last_name,
        email: email,
        photo: photo
      }
    })
  }

  return(dispatch) => {
    dispatch({ type: 'AUTHENTICATING_USER'})
    fetch(`http://${environment['BASE_URL']}/api/v1/users`, objData)
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw response
      }
    })
      .then(JSONResponse => {
        console.log(JSONResponse);
        deviceStorage.saveItem("jwt", JSONResponse.jwt)
        dispatch({ type: 'SET_CURRENT_USER', payload: JSONResponse.user })
      })
      // .catch( res => {res.json().then(e => dispatch({ type: 'FAILED_LOGIN', payload: e.message }))})
      .catch( res => console.log('res ',res))
    }
}

export const loginUser = (username, password) => {
  return (dispatch) => {
    dispatch({ type: 'AUTHENTICATING_USER'})
    fetch(`http://${environment['BASE_URL']}/api/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         Accept: 'application/json'
      },
      body: JSON.stringify({
        user: {
          username: username,
          password: password
        }
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw response
        }
      })
      .then(JSONResponse => {
        deviceStorage.saveItem("jwt", JSONResponse.jwt)
        dispatch({ type: 'SET_CURRENT_USER', payload: JSONResponse.user })
      })
      .catch( res => {
        res.json().then(e => dispatch({ type: 'FAILED_LOGIN', payload: e.message }))})
    }
}

export const fetchCurrentUser = () => {
  return (dispatch) => {
    dispatch(authenticatingUser())
    fetch(`http://${environment['BASE_URL']}/api/v1/profile`, {
      method: 'GET',
      headers: {Authorization: `Bearer ${deviceStorage.loadJWT('jwt')}`}
    })
      .then(response => response.json())
      .then((JSONResponse) => dispatch(setCurrentUser(JSONResponse.user)))
  }
}

export const setCurrentUser = (userData) => ({
  type: 'SET_CURRENT_USER',
  payload: userData
})

export const failedLogin = (errorMsg) => ({
  type: 'FAILED_LOGIN',
  payload: errorMsg
})

export const logoutUser = () => ({type: 'LOGOUT_USER' })

export const authenticatingUser = () => ({ type: 'AUTHENTICATING_USER' })


export function fetchKeyForSkateSpots() {
  return function action(dispatch) {
    dispatch({ type: "GET_SKATE_SPOTS" })
      deviceStorage.loadJWT("jwt")
      .then(jwtKey => dispatch(fetchSkateSpots(jwtKey)))
      .catch((error) => {
        console.log('Action.js line 131 error: ', error)
      })
  }
}

export function fetchSkateSpots(val){
      return (dispatch) =>{
        return fetch(`http://${environment['BASE_URL']}/api/v1/skate_spots`,{
          method: 'GET',
          headers: {
            Authorization: `Bearer ${val}`
          }
        })
        .then(r=>r.json())
        .then(data=>dispatch({type:'GET_SKATE_SPOTS', payload:data}))
      }
    }


// export function fetchKeyForUserData(userID) {
//   return function action(dispatch) {
//     dispatch({ type: "LOADING_DATA" })
//       deviceStorage.loadJWT("jwt")
//       .then(jwtKey => dispatch(fetchUserData(jwtKey, userID)))
//       .catch((error) => {
//         console.log('Action.js line 131 error: ', error)
//       })
//   }
// }
//
// export function fetchUserData(key, userID) {
//     return (dispatch) =>{
//       dispatch({type: 'LOADING_DATA'})
//       return fetch(`http://${environment['BASE_URL']}/api/v1/users/${userID}`, {
//         method:'GET',
//         headers:{
//           Authorization: `Bearer ${key}`
//         }
//       })
//         .then(r=>r.json()).then(data=>{
//         dispatch({type:'GET_USER_DATA', payload:data})
//       })
//     }
// }

export function bookmarkSpot(){
  console.log('GETTING TO BOOKMARKS SPOT IN ACTIONS')
}

export function getGeolocation() {
  return (dispatch) => {
    console.log('got here line 27 action.js');
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log('got here line 29 action.js');
      let data = {latitude: position.coords.latitude, longitude:position.coords.longitude}
      console.log('got here line 31 action.js');
      console.log(data)
      dispatch({type: 'GET_USER_GEOLOCATION', payload:data})
      return data
    })
  }
}

export function logSearchTerm(e) {
  return (dispatch) =>{
    dispatch({type: 'LOG_SEARCH_TERM', payload:e.target.value})
    return e.target.value
  }
}
