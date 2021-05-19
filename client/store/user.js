import store from '../store';
import axios from 'axios'

const GET_FRIENDS = 'GET_FRIENDS'

export const getFriends = (friends) => {
    return { type: GET_FRIENDS, friends };
  };

export const getFriendsThunk = (userId) => {
 
    return async (dispatch) => {
    
        try {
        const { data } = await axios.get(`/api/users/friends/2`)
        console.log('in getFriend thunk', data)
        dispatch(getFriends(data));
        } catch (err) {
        console.error('Error getting Friends', err);
        }
    };
};

export default function (state = [], action) {
    switch (action.type) {
      case GET_FRIENDS:
        return action.friends
      default:
        return state;
    }
  }
  