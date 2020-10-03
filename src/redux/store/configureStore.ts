import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import chatReducer from '../reducers/chatReducer';
import postsReducer from '../reducers/postsReducer';
import userReducer from '../reducers/userReducer';
// Store creation
export default () => {
  const store = createStore(
    combineReducers({
      userInfo: userReducer,
      userPosts: postsReducer,
      userChats: chatReducer,
    }),
    composeWithDevTools(applyMiddleware(thunk))
  );
  return store;
};
