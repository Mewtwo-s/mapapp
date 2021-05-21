import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  createSessionThunkCreator,
  joinSessionThunkCreator,
} from '../store/session';
import { stopWatchingMyLocation } from '../store/location';
import { leaveRoom } from '../store/locationSharing';
import { Button, Label, FormGroup, Input } from '../GlobalStyles';
import { getFriendsThunk } from '../store/user';


export class JoinRoom extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.state = {
      currentSession: null,
      sessionAction: null,
    };
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleClick(action) {
    this.setState({
      sessionAction: action,
    });
  }

  async handleJoin (evt) {
    evt.preventDefault();
    const session = this.props.session;
    if (session && session.id) {
      this.props.leaveRoom(this.props.user.id, session.id);
      this.props.stopWatchingMyLocation();
    }

    await this.props.joinSession(this.props.user.id, evt.target.code.value);
  }

  async handleCreate(evt) {
    evt.preventDefault();

    await this.props.getFriends(this.props.user.id);
    const session = this.props.session;
    if (session && session.id) {
      this.props.leaveRoom(this.props.user.id, session.id);
      this.props.stopWatchingMyLocation();
    }

    this.setState({
      sessionAction: 'host',
    });
    await this.props.createSession(this.props.user.id);
  }
 
  render() {
     const capFirstName = this.props.user.firstName.slice(0,1).toUpperCase() + this.props.user.firstName.slice(1).toLowerCase()
console.log(this.props);
    return (
      <div>
        <h4>{`Hello ${capFirstName} !`}</h4>
        {this.state.sessionAction === null && (
          <div>
            <h4> In the mood to hang out today ? </h4>
            <Button onClick={this.handleCreate}>Create New Session</Button>
            <Button onClick={() => this.handleClick('join')}>
              Join a Session
            </Button>

          </div>
        )}
        {this.state.sessionAction === 'join' && (
          <div>
            <form onSubmit={this.handleJoin}>
              <div>
                <Label style={{ color: '#0f3057'}} htmlFor="code">
                  Join Existing Session
                </Label>
                <Input style={{ boder: "solid 10px #51adcf", backgroundColor: '#e4efe7'}}name="code" type="text" />
                <Button type="submit">Join</Button>
              </div>
              <div></div>
            </form>
          </div>
        )}
        {this.state.sessionAction === 'host' && (
          <div>
            <h1>Your session is ready! Join now</h1>
            <Link to={`/map/${this.props.session.code}`}>
              <Button>Go to session</Button>
            </Link>
            <h1>Invite Friends</h1>
            <h5>Invite via code: {this.props.session.code} </h5>
            <h5>Add previous friends</h5>
            {this.props.friends && this.props.friends.map(friend =>  (
              <button key={friend.id}>
                <p>{friend.firstName} {friend.lastName}</p>
              </button>
            ))}
            <h5>Invite via email</h5>
            <input value="test"/>
            <button type="submit">Submit</button>
          </div>
        )}
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    user: state.auth,
    session: state.sessionReducer,
    friends: state.friendReducer
  };
};

const mapDispatch = (dispatch, { history }) => {
  return {
    joinSession: (userId, code) =>
      dispatch(joinSessionThunkCreator(userId, code, history)),
    createSession: (userId) =>
      dispatch(createSessionThunkCreator(userId, history)),
    stopWatchingMyLocation: () => dispatch(stopWatchingMyLocation()),
    leaveRoom: (userId, sessionId) => dispatch(leaveRoom(userId, sessionId)),
    getFriends: (userId) => dispatch(getFriendsThunk(userId))
  };
};
export default connect(mapState, mapDispatch)(JoinRoom);
