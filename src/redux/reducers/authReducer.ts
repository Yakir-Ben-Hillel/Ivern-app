import { AuthActionTypes } from '../../@types/action-types';
export default (state = {}, action: AuthActionTypes) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        user: action.user,
      };
    default:
      return state;
  }
};
