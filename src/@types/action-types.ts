import { User, Post } from './types';

const SET_USER = 'SET_USER';
const UPDATE_USER = 'UPDATE_USER';
const LOADING_USER = 'LOADING_USER';
const SET_POSTS = 'SET_POSTS';
const ADD_POST = 'ADD_POST';
const UPDATE_POST = 'UPDATE_POST';
const DELETE_POST = 'DELETE_POST';
const LOADING_POSTS = 'LOADING_POSTS';

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
export interface SetPostsAction {
  type: typeof SET_POSTS;
  posts: Post[];
}
export interface AddPostAction {
  type: typeof ADD_POST;
  post: Post;
}
export interface UpdatePostAction {
  type: typeof UPDATE_POST;
  post: Post;
}
export interface DeletePostAction {
  type: typeof DELETE_POST;
  pid: string;
}
export interface LoadingPostsAction {
  type: typeof LOADING_POSTS;
  loading: boolean;
}

export type AuthActionTypes =
  | SetUserAction
  | UpdateUserAction
  | LoadingUserAction;
export type PostsActionTypes =
  | AddPostAction
  | UpdatePostAction
  | DeletePostAction
  | SetPostsAction
  | LoadingPostsAction;
