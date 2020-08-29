import { firebase } from '../../firebase';
import { SetUserAction } from '../../@types/action-types';
export const setUser = (user: firebase.User): SetUserAction => {
  return {
    type: 'SET_USER',
    user,
  };
};
