import axios from 'axios'
import history from '../history'

const TOKEN = 'token'

/**
 * ACTION TYPES
 */
const SET_AUTH = 'SET_AUTH'
const SET_TEMP_USER = 'SET_TEMP_USER'

/**
 * ACTION CREATORS
 */
const setAuth = auth => ({type: SET_AUTH, auth})

const setTempUser = auth => ({type: SET_TEMP_USER, auth})

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  const token = window.localStorage.getItem(TOKEN)
  if (token) {
    const res = await axios.get('/auth/me', {
      headers: {
        authorization: token
      }
    })
    return dispatch(setAuth(res.data))
  }
}

export const getTempUserThunkCreator = (confirmationCode) => async dispatch => {
  try {
    console.log('the thunk is working');
    const result = await axios.get(`/api/users/${confirmationCode}`);
    dispatch(await setTempUser(result.data))
  } catch (err) {
    next(err)
  }
}

export const authenticate = (email, password, method, firstName,
  lastName, phoneNum,  street, city, state, country, zipCode, photo) => async dispatch => {
  try {
    const res = await axios.post(`/auth/${method}`, {email, password, firstName,
      lastName, phoneNum, street, city, state, country, zipCode, photo})
    window.localStorage.setItem(TOKEN, res.data.token)
    dispatch(me())
  } catch (authError) {
    return dispatch(setAuth({error: authError}))
  }
}

export const logout = () => {
  window.localStorage.removeItem(TOKEN)
  history.push('/login')
  return {
    type: SET_AUTH,
    auth: {}
  }
}

/**
 * REDUCER
 */
export default function(state = {}, action) {
  switch (action.type) {
    case SET_AUTH:
      return action.auth
    case SET_TEMP_USER:
      return action.auth
    default:
      return state
  }
}
