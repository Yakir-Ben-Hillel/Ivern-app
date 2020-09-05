import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Dashboard } from '../components/dashboard';
import Login from '../components/authPages/loginPage';
import Signup from '../components/authPages/signup';
import { Search } from '../components/search';
import FirstTimeLogin from '../components/authPages/firstTimeLogin';
import UserInfo from '../components/userInfo/userInfo';
import { connect } from 'react-redux';
import { AppState } from '../@types/types';
import PostsManager from '../components/posts/postsManager';
interface IProps {
  isAuthenticated: boolean;
}
const AppRouter: React.FC<IProps> = ({ isAuthenticated }) => {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
        </Switch>
        {isAuthenticated && (
          <Switch>
            <Route exact path="/login/confirm" component={FirstTimeLogin} />
            <Route exact path="/user/post" component={PostsManager} />
            <Route exact path="/user" component={UserInfo} />
          </Switch>
        )}
        <Route path="/search" component={Search} />
      </Router>
    </div>
  );
};
const MapStateToProps = (state: AppState) => ({
  isAuthenticated: !!state.userInfo.user,
});

export default connect(MapStateToProps)(AppRouter);
