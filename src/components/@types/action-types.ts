import { firebase } from '../../firebase';
const SET_USER = 'SET_USER';
export interface SetUserAction {
  type: typeof SET_USER;
  user: firebase.User;
}
export type AuthActionTypes = SetUserAction;
