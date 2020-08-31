import { User } from './types';

const SET_USER = 'SET_USER';
const UPDATE_USER = 'UPDATE_USER';
const LOADING_USER = 'LOADING_USER';
export interface SetUserAction {
  type: typeof SET_USER;
  user: User;
}
export interface LoadingUserAction {
  type: typeof LOADING_USER;
  loading: boolean;
}
export interface UpdateUserAction {
  type: typeof UPDATE_USER;
  currentData: User;
  data: {
    displayName?: string;
    phoneNumber?: string;
    imageURL?: string;
  };
}
export type AuthActionTypes =
  | SetUserAction
  | UpdateUserAction
  | LoadingUserAction;
