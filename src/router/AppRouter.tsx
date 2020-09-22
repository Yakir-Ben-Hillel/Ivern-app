import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppState } from '../@types/types';
import FirstTimeLogin from '../components/authPages/firstTimeLogin';
import Login from '../components/authPages/loginPage';
import Signup from '../components/authPages/signup';
import { Dashboard } from '../components/dashboard';
import PostsManager from '../components/posts/postsManager';
import { Search } from '../components/search';
import UserInfo from '../components/userInfo/userInfo';
interface IProps {
  isAuthenticated: boolean;
}
const AppRouter: React.FC<IProps> = ({ isAuthenticated }) => {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path='/' component={Dashboard} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path='/login' component={Login} />
        </Switch>
        {isAuthenticated && (
          <Switch>
            <Route exact path='/login/confirm' component={FirstTimeLogin} />
            <Route exact path='/user/post' component={PostsManager} />
            <Route exact path='/user' component={UserInfo} />
          </Switch>
        )}
        <Route path='/search' component={Search} />
      </Router>
    </div>
  );
};
const MapStateToProps = (state: AppState) => ({
  isAuthenticated: !!state.userInfo.user,
});

export default connect(MapStateToProps)(AppRouter);
