import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './router/AppRouter';
import 'normalize.css/normalize.css';
import { firebase } from './firebase';
import configureStore from './redux/store/configureStore';
import { Provider } from 'react-redux';
import { startSetUser } from './redux/actions/auth';
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
  if (user) store.dispatch(startSetUser(user.uid));
  renderApp();
});
