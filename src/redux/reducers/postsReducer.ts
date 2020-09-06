import { PostsActionTypes } from '../../@types/action-types';
import { Post } from '../../@types/types';
const postsReducerDefaultState: { posts: Post[]; loading: boolean } = {
  posts: [],
  loading: false,
};
export default (state = postsReducerDefaultState, action: PostsActionTypes) => {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, ...action.posts };
    case 'ADD_POST': {
      return { ...state, posts: [action.post, ...state.posts] };
    }
    case 'UPDATE_POST': {
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.pid === action.post.pid)
            return {
              ...post,
              ...action.post,
            };
          else return post;
        }),
      };
    }
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter((post) => post.pid !== action.pid),
      };
    case 'LOADING_POSTS':
      return { ...state, loading: action.loading };
    default:
      return state;
  }
};
