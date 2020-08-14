import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Dashboard } from '../dashboard';
import Login from '../authPages/loginPage';
import { Signup } from '../signup';
import { Search } from '../search';
import FirstTimeLogin from '../authPages/firstTimeLogin';
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
        <Route exact path='/' component={Dashboard} />
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/login' component={Login} />
        {isAuthenticated && (
          <Route exact path='/login/confirm' component={FirstTimeLogin} />
        )}
        <Route path='/search' component={Search} />
      </Switch>
    </Router>
  );
};
const MapStateToProps = (state: AppState) => ({
  isAuthenticated: !!state.auth.user,
});

export default connect(MapStateToProps)(AppRouter);
