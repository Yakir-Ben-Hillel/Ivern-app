import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Dashboard } from './components/dashboard';
import { Login } from './components/login';
import { Signup } from './components/signup';
// import PrimarySearchAppBar from './components/navbar';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Dashboard} />
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/login' component={Login} />
      </Switch>
    </Router>
  );
};
export default App;
