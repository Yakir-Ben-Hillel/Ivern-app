import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Dashboard } from '../dashboard';
import Login from '../authPages/loginPage';
import Signup from '../authPages/signup';
import { Search } from '../search';
import FirstTimeLogin from '../authPages/firstTimeLogin';
import UserInfo from '../userInfo';
// import PrimarySearchAppBar from './components/navbar';
import { connect } from 'react-redux';
import { AppState } from '../@types/types';
interface IProps {
  isAuthenticated: boolean;
}
const AppRouter: React.FC<IProps> = ({ isAuthenticated }) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
      </Switch>
      {isAuthenticated && (
        <Switch>
          <Route exact path="/login/confirm" component={FirstTimeLogin} />
          <Route exact path="/user" component={UserInfo} />
        </Switch>
      )}
      <Route path="/search" component={Search} />
    </Router>
  );
};
const MapStateToProps = (state: AppState) => ({
  isAuthenticated: !!state.auth.user,
});

export default connect(MapStateToProps)(AppRouter);
