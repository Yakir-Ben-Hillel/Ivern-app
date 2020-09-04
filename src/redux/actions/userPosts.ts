import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { firebase } from '../../firebase';
import { AppState, Post } from '../../@types/types';
import axios from 'axios';
import {
  SetPostsAction,
  LoadingPostsAction,
  AddPostAction,
  UpdatePostAction,
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
export const startUpdatePost = (
  pid: string,
  updateData: {
    area: string;
    cover: string;
    description: string;
    platform: string;
    price: string;
    sell: boolean;
    exchange: boolean;
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
    dispatch(updatePost(res.data.post));
  };
};
export const startAddPost = (postData: {
  gameName: string;
  gid: string;
  artwork: string;
  cover: string;
  area: string;
  description: string;
  platform: string;
  price: string;
  sell: boolean;
  exchange: boolean;
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
    dispatch(addPost(res.data.post));
  };
};
const loadingPosts = (loading: boolean): LoadingPostsAction => {
  return {
    type: 'LOADING_POSTS',
    loading,
  };
};

export const startSetPosts = () => {
  return async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    getState: () => AppState
  ) => {
    const uid = getState().auth.user.uid;
    dispatch(loadingPosts(true));
    const posts = await axios.get(
      `https://europe-west3-ivern-app.cloudfunctions.net/api/posts/get/user/${uid}`
    );
    dispatch(loadingPosts(false));
    return dispatch(setPosts({ ...posts.data }));
  };
};
