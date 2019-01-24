import { combineReducers } from 'redux'
import usersReducer from './userReducer.js'
// import spotReducer from './spotReducer.js'

const rootReducer = combineReducers({
  user: usersReducer,
  // spot: spotReducer,
})

export default rootReducer
