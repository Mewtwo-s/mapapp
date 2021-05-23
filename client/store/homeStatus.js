
const UPDATE_SESSION_ACTION = 'UPDATE_SESSION_ACTION ';


//action creators
export const updateSessionAction = (sessionAction) => {
  return {
    type: UPDATE_SESSION_ACTION,
    sessionAction
  };
};


export default function sessionAction(sessionAction = null, action) {
  switch (action.type) {
    case UPDATE_SESSION_ACTION:
      return action.sessionAction;
    default:
      return sessionAction;
  }
}
