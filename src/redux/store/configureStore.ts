import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import authReducer from '../reducers/userReducer';
import thunk from 'redux-thunk';
import postsReducer from '../reducers/postsReducer';
// Store creation
export default () => {
  const store = createStore(
    combineReducers({
      userInfo: authReducer,
      userPosts:postsReducer,
    }),
    composeWithDevTools(applyMiddleware(thunk))
  );
  return store;
};
