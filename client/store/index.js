import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import auth from './auth';
import allLocations from './locationSharing';
import myLocation from './location';
import friendReducer from './user';
import sessionReducer from './session';
import userSessionsReducer from './userSessions';
import sessionAction from './homeStatus';
import allSessionsReducer from './allSessions';
import directionsFailedReducer from './directionsFailure';
import errorMessage from './error';

const reducer = combineReducers({ 
  auth, 
  myLocation, 
  allLocations, 
  sessionReducer,
  userSessionsReducer,
  friendReducer,
  sessionAction,
  allSessionsReducer,
  directionsFailedReducer,
  errorMessage
 });

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;
export * from './auth';
