
const DIRECTIONS_FAILED = 'DIRECTIONS_FAILED';


//action creators
export const directionsFailed = (directionsFailed) => {
  return {
    type: DIRECTIONS_FAILED,
    directionsFailed
  };
};


export default function directionsFailedReducer(directionsFailed = false, action) {
  switch (action.type) {
    case DIRECTIONS_FAILED:
      return action.directionsFailed;
    default:
      return directionsFailed;
  }
}
