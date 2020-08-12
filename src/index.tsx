import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './components/router/App';
import 'normalize.css/normalize.css';
import { firebase } from './firebase';
import configureStore from './components/redux/store/configureStore';
import { Provider } from 'react-redux';
import { setUser } from './components/redux/actions/auth';
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
  if (user) store.dispatch(setUser(user));
  renderApp();
});
