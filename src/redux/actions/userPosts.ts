import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { firebase } from '../../firebase';
import { Post } from '../../@types/types';
import axios from 'axios';
import {
  SetPostsAction,
  LoadingPostsAction,
  AddPostAction,
  UpdatePostAction,
  DeletePostAction,
} from '../../@types/action-types';
const setPosts = (posts: Post[]): SetPostsAction => {
  return {
    type: 'SET_POSTS',
    posts,
  };
};
const addPost = (post: Post): AddPostAction => {
  return {
    type: 'ADD_POST',
    post,
  };
};
const updatePost = (post: Post): UpdatePostAction => {
  return {
    type: 'UPDATE_POST',
    post,
  };
};
const deletePost = (pid: string): DeletePostAction => {
  return {
    type: 'DELETE_POST',
    pid,
  };
};
const loadingPosts = (loading: boolean): LoadingPostsAction => {
  return {
    type: 'LOADING_POSTS',
    loading,
  };
};
export const startUpdatePost = (
  pid: string,
  updateData: {
    area: string;
    exchange: boolean;
    sell: boolean;
    cover: string | undefined;
    price: string;
    description: string;
    platform: 'playstation' | 'xbox' | 'switch';
  }
) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const idToken = await firebase.auth().currentUser?.getIdToken();
    const res = await axios.post(
      `https://europe-west3-ivern-app.cloudfunctions.net/api/posts/edit/${pid}`,
      {
        ...updateData,
      },
      {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      }
    );
    return dispatch(updatePost(res.data.post));
  };
};
export const startAddPost = (postData: {
  gameName: string;
  gid: string;
  artwork: string | null;
  cover: string;
  area: string;
  sell: boolean;
  exchange: boolean;
  description: string;
  platform: 'playstation' | 'xbox' | 'switch';
  price: string;
}) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const idToken = await firebase.auth().currentUser?.getIdToken();
    const res = await axios.post(
      'https://europe-west3-ivern-app.cloudfunctions.net/api/posts/add',
      {
        ...postData,
      },
      {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      }
    );
    return dispatch(addPost(res.data.data));
  };
};
export const startDeletePost = (pid: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const idToken = await firebase.auth().currentUser?.getIdToken();
    await axios.delete(
      `https://europe-west3-ivern-app.cloudfunctions.net/api/posts/delete/${pid}`,
      {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      }
    );
    return dispatch(deletePost(pid));
  };
};
export const startSetPosts = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const uid = firebase.auth().currentUser?.uid;
    dispatch(loadingPosts(true));
    const posts = await axios.get(
      `https://europe-west3-ivern-app.cloudfunctions.net/api/posts/get/user/${uid}`
    );
    dispatch(loadingPosts(false));
    return dispatch(setPosts({ ...posts.data }));
  };
};
