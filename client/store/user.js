import store from '../store';
import axios from 'axios'

const GET_FRIENDS = 'GET_FRIENDS'

export const getFriends = (friends) => {
    return { type: GET_FRIENDS, friends };
  };

export const getFriendsThunk = (userId) => {
    return async (dispatch) => {
    
        try {
          const response = await axios.get(`/api/users/friends/${userId}`);
          const friends = response.data
          await dispatch(getFriends(friends));
        } catch (err) {
          console.error('Error getting Friends', err);
        }
    };
};

export default function friendReducer (state = [], action) {
    switch (action.type) {
      case GET_FRIENDS:
        return action.friends
      default:
        return state;
    }
  }
  