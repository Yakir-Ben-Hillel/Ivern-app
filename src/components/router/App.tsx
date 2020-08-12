import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Dashboard } from '../dashboard';
import Login from '../authPages/loginPage';
import { Signup } from '../signup';
import { Search } from '../search';
import FirstTimeLogin from '../authPages/firstTimeLogin';
// import PrimarySearchAppBar from './components/navbar';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Dashboard} />
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/login/confirm' component={FirstTimeLogin} />
        <Route path='/search' component={Search} />
      </Switch>
    </Router>
  );
};
export default AppRouter;
