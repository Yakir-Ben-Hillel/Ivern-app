import {
  SetUserAction,
  UpdateUserAction,
  LoadingUserAction,
} from '../../@types/action-types';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { firebase } from '../../firebase';
import { AppState, User } from '../../@types/types';
import axios from 'axios';
const setUser = (user: User): SetUserAction => {
  return {
    type: 'SET_USER',
    user,
  };
};
const loadingUser = (loading: boolean): LoadingUserAction => {
  return {
    type: 'LOADING_USER',
    loading,
  };
};
const updateUser = (
  currentData: User,
  data: {
    displayName: string;
    phoneNumber: string;
    imageURL: string;
  }
): UpdateUserAction => {
  return {
    type: 'UPDATE_USER',
    currentData,
    data,
  };
};
export const startSetUser = (uid: string) => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    getState: () => AppState
  ) => {
    dispatch(loadingUser(true));
    const user = await axios.get(
      `https://europe-west3-ivern-app.cloudfunctions.net/api/user/${uid}`
    );
    dispatch(loadingUser(false));
    return dispatch(setUser({ ...user.data }));
  };
};
export const startUpdateUser = (data: {
  displayName: string;
  phoneNumber: string;
  imageURL: string;
}) => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    getState: () => AppState
  ) => {
    const currentData = getState().auth.user;
    const idToken = await firebase.auth().currentUser?.getIdToken();
    await axios.post(
      'https://europe-west3-ivern-app.cloudfunctions.net/api/user',
      {
        displayName: data.displayName,
        phoneNumber: data.phoneNumber,
        imageURL: data.imageURL,
      },
      {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      }
    );
    return dispatch(updateUser(currentData, data));
  };
};
