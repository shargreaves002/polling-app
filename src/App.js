import React, {Component} from 'react';
import './App.css';
import {
  Route,
  Switch
} from 'react-router-dom';
import {Router} from 'react-router';
import LoadingIndicator from './common/LoadingIndicator';
// import PrivateRoute from './common/PrivateRoute';
import { getCurrentUser } from './util/APIUtils';
import { ACCESS_TOKEN } from './constants/index';
import {AppHeader} from "./common/AppHeader";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import PollList from "./poll/PollList";
import Login from "./user/login/Login";
import Signup from "./user/signup/Signup";
import Profile from "./user/profile/Profile";
import history from "./util/history";
import NotFound from "./common/NotFound";
import PrivateRoute from "./common/PrivateRoute";
import NewPoll from "./poll/NewPoll";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
        .then(response => {
          this.setState({
            currentUser: response,
            isAuthenticated: true,
            isLoading: false
          });
        }).catch(() => {
      this.setState({
        isLoading: false
      });
    });
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !(nextState.currentUser === this.state.currentUser);
  }

  handleLogout(redirectTo="/") {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    history.push(redirectTo);
  }

  handleLogin() {
    this.loadCurrentUser();
    history.push("/");
  }

  render() {
    if(this.state.isLoading) {
      return <LoadingIndicator />
    }
    return (
        <div className="app-container">
          <Router history={history}>
            <Switch>
              <AppHeader isAuthenticated={this.state.isAuthenticated}
                         currentUser={this.state.currentUser}
                         handleLogout={this.handleLogout}> </AppHeader>
            </Switch>
          </Router>
          <div style={{minHeight: 65}} />
          <div className="app-content">
            <Router history={history}>
              <div className="container">
                <Switch>
                  <Route exact path="/" render={(props) =><PollList isAuthenticated={this.state.isAuthenticated}
                                                                         currentUser={this.state.currentUser} handleLogout={this.handleLogout} {...props} key={"pollList"} />}>
                  </Route>
                  <Route path="/login" render={(props) =><Login onLogin={this.handleLogin} {...props} />}/>
                  <Route path="/signup" render={() => <Signup/>}/>
                  <Route path="/users/:username"
                         render={(props) => <Profile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props} />}/>
                  <PrivateRoute authenticated={this.state.isAuthenticated} path="/poll/new" component={NewPoll} />
                  <Route render={() =><NotFound />}/>
                </Switch>
              </div>
            </Router>
          </div>
        </div>
    );
  }
}
