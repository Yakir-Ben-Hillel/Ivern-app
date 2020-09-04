import { PostsActionTypes } from '../../@types/action-types';
import { Post } from '../../@types/types';
const postsReducerDefaultState: Post[] = [];
export default (state = postsReducerDefaultState, action: PostsActionTypes) => {
  switch (action.type) {
    case 'SET_POSTS':
        return action.posts;
    case 'ADD_POST': {
      return {
        posts: [action.post, ...state],
      };
    }
    case 'UPDATE_POST':{
        posts:return state.map(post=>{
            if(post.pid===)
        })
    }
    case 'LOADING_POSTS': {
      return {
        loading: action.loading,
      };
    }
    default:
      return state;
  }
};
