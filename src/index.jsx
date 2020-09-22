import 'normalize.css/normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { firebase } from './firebase';
import { startSetUser } from './redux/actions/userInfo';
import { startSetPosts } from './redux/actions/userPosts';
import configureStore from './redux/store/configureStore';
import AppRouter from './router/AppRouter';
const store = configureStore();
const Application = () => (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);
let hasRendered = false;
const renderApp = () => {
  if (!hasRendered) {
    ReactDOM.render(<Application />, document.getElementById('root'));
    hasRendered = true;
  }
};
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch(startSetUser(user.uid));
    store.dispatch(startSetPosts());
  }
  renderApp();
});
