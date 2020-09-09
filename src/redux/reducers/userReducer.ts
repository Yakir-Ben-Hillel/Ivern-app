import { AuthActionTypes } from '../../@types/action-types';

export default (state = {}, action: AuthActionTypes) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.user };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...action.currentData, ...action.data, isNew: false },
      };
    case 'LOADING_USER':
      return { loading: action.loading };
    default:
      return state;
  }
};
