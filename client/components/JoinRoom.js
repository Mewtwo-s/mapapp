import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  createSessionThunkCreator,
  joinSessionThunkCreator,
} from '../store/session';
import { stopWatchingMyLocation } from '../store/location';
import { leaveRoom } from '../store/locationSharing';
import { Button, Label, FormGroup, Input, Container, Select } from '../GlobalStyles';
import { getFriendsThunk } from '../store/user';
import { inviteSessionUsersThunkCreator } from '../store/userSessions';
import TravelMode from './TravelMode'

export class JoinRoom extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.state = {
      currentSession: null,
      sessionAction: null,
      travelMode: 'WALKING'
    };
    this.handleCreate = this.handleCreate.bind(this);
    this.handleAddFriendViaEmail = this.handleAddFriendViaEmail.bind(this)
    this.handleChangeMode = this.handleChangeMode.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
  })
  }

  handleClick(action) {
    this.setState({
      sessionAction: action,
    });
  }

  async handleAddFriendViaEmail (evt) {
    evt.preventDefault();
    this.props.inviteFriend( this.props.session.id, evt.target.email.value, this.props.user.firstName)
    this.setState({
      email: ''
    })
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

   handleChangeMode(e){
    this.setState({travelMode: e.target.value})
    console.log('mode->', this.state.travelMode)
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
    await this.props.createSession(this.props.user.id, this.state.travelMode);
  }
 
  render() {
    return (
      <div>
        
        <h4>{`Hello ${this.props.user.firstName} !`}</h4>
     
        {this.state.sessionAction === null && (
          <div>
            <h4> In the mood to hang out today? </h4>  
            {/* Travel Mode component?? */}
            <Select name="travelMode" onChange={this.handleChangeMode}>
                <option value="BICYCLING">Cycling</option>
                <option value="DRIVING">Driving</option>
                <option value="TRANSIT">Transit</option>
                <option value="WALKING">Walking</option>
            </Select>

            <Container style={{display: 'flex', justifyItems:'stretch'}}>
              <Button onClick={this.handleCreate}>Create New Session</Button>
              <Button onClick={() => this.handleClick('join')}>
                Join a Session
              </Button>
            </Container>
          </div>
        )}
        {this.state.sessionAction === 'join' && (
          <div>
            <form onSubmit={this.handleJoin}>
              <div>
                <Label style={{ color: '#0f3057'}} htmlFor="code">
                  Join Existing Session
                </Label>
                <Input required placeholder='enter code here' style={{ boder: "solid 10px #51adcf", backgroundColor: '#e4efe5', width: 'fit-content'}}name="code" type="text" />
                <Button type="submit">Join</Button>
              </div>
              <div></div>
            </form>
          </div>
        )}
        {this.state.sessionAction === 'host' && (
          <div>
            <h3>Invite friends using the code: {this.props.session.code} </h3>
       
            <h1>Your session is ready! Join now</h1>
            <Link to={`/map/${this.props.session.code}`}>
              <Button>Go to session</Button>
            </Link>
            <h1>Invite Friends</h1>
            <h5>Invite via code: {this.props.session.code} </h5>
            <h5>Add previous friends</h5>
            {this.props.friends && this.props.friends.map(friend =>  (
              <button key={friend.id} onClick={() => this.props.inviteFriend( this.props.session.id, friend.email, this.props.user.firstName)}>
                <p>{friend.firstName} {friend.lastName}</p>
              </button>
            ))}
            <h5>Invite a friend via email (one at a time)</h5>
            <form onSubmit={this.handleAddFriendViaEmail}>
              <input name="email" type="email" value={this.state.email}
            onChange = {this.handleChange}/>
              <button type="submit">Submit</button>
            </form>
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
    createSession: (userId, travelMode) =>
      dispatch(createSessionThunkCreator(userId, travelMode, history)),
    stopWatchingMyLocation: () => dispatch(stopWatchingMyLocation()),
    leaveRoom: (userId, sessionId) => dispatch(leaveRoom(userId, sessionId)),
    getFriends: (userId) => dispatch(getFriendsThunk(userId)),
    inviteFriend: (sessionId, email, hostName) => dispatch(inviteSessionUsersThunkCreator(sessionId, email, hostName))
  };
};
export default connect(mapState, mapDispatch)(JoinRoom);
