import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { Login, Signup } from './components/AuthForm';
import Home from './components/Home';
import { me } from './store';
import MapContainer from './components/MapContainer';
import InviteForm from './components/InviteForm'
import Navbar from './components/Navbar'
import PastSessions from './components/PastSessions';
import GlobalStyles from './Globalstyles';

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const { isLoggedIn } = this.props;
    return (
      <Router>
          <GlobalStyles/>
          <Navbar />
          {isLoggedIn ? (
            <Switch>
              <Route path="/map/:code" component={MapContainer} />
              <Route path="/pastSessions" component={PastSessions} />
              <Route exact path="/home" component={Home} />
              <Route path='/emailInvite' component={InviteForm} />
              <Redirect to="/home" />
            </Switch>
          ) : (
            <Switch>
              {/* <Route path="/map" component={MapContainer} /> */}
              <Route exact path="/" component={Login} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
            </Switch>
          )}
        
      </Router>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(me());
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default connect(mapState, mapDispatch)(Routes);
