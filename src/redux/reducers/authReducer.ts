import { AuthActionTypes } from '../../@types/action-types';
export default (state = {}, action: AuthActionTypes) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        user: action.user,
      };
    case 'UPDATE_USER':
      return {
        user: { ...action.currentData, ...action.data },
      };
    case 'LOADING_USER':
      return {
        loading: action.loading,
      };
    default:
      return state;
  }
};
