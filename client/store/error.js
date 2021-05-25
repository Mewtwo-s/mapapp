
const ERROR_MESSAGE = 'ERROR_MESSAGE';


//action creators
export const emitErrorMessage = (error) => {
  return {
    type: ERROR_MESSAGE,
    error
  };
};


export default function errorMessage(errorMessage = null, action) {
  switch (action.type) {
    case ERROR_MESSAGE:
      return action.error;
    default:
      return errorMessage;
  }
}
