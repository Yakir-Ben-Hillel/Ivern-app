import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import authReducer from '../reducers/authReducer';
import thunk from 'redux-thunk';
// Store creation
export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
    }),
    composeWithDevTools(applyMiddleware(thunk))
  );
  return store;
};
