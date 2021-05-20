import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import auth from './auth';
import allLocations from './locationSharing';
import myLocation from './location';

import sessionReducer from './session';
import userSessionsReducer from './userSessions';

const reducer = combineReducers({ 
  auth, 
  myLocation, 
  allLocations, 
  sessionReducer,
  userSessions : userSessionsReducer
 });

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;
export * from './auth';
