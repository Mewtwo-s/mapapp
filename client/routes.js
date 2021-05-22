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
import {AcceptWithAccount, AcceptWithoutAccount} from './components/CompleteJoinForm';
import InviteForm from './components/InviteForm'
import Navbar from './components/Navbar'
import PastSessions from './components/PastSessions';
import GlobalStyles from './GlobalStyles';
import TravelMode from './components/TravelMode'
import UserJoinSession from './components/UserJoinSession'
import Test from './components/Test'
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
      <div>

          <GlobalStyles/>
          <Navbar />
          {isLoggedIn ? (
            <Switch>
              <Route exact path='/test/:gamecode' component={Test}></Route>
              <Route exact path="/test" component={UserJoinSession} />
              <Route path="/map/:code" component={MapContainer} />
              <Route path="/pastSessions" component={PastSessions} />
              <Route path='/emailInvite' component={InviteForm} />
              <Route path="/accept/:userCode/:gameCode" component={AcceptWithAccount}/>
              <Route exact path="/home" component={Home} />
              
            </Switch>
          ) : (
            <Switch>
              {/* <Route path="/map" component={MapContainer} /> */}
              <Route path='/test/:id' component={Test}></Route>
              <Route exact path="/test" component={UserJoinSession} />
              <Route exact path="/" component={Login} />
              <Route exact path="/home" component={Login} />
              <Route path="/login" component={Login} />
              <Route exact path="/signup/:gamecode" component={Signup} />
              <Route exact path="/signup" component={Signup} />
              <Redirect to="/" />
            </Switch>
          )}
      </div>
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
