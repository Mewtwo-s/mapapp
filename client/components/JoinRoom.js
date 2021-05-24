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
import { updateSessionAction } from '../store/homeStatus';

export class JoinRoom extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
    this.state = {
      currentSession: null,
      travelMode: 'WALKING',
      createSessionDisplay: null
    };
    this.handleCreate = this.handleCreate.bind(this);
    this.handleAddFriendViaEmail = this.handleAddFriendViaEmail.bind(this)
    this.handleChangeMode = this.handleChangeMode.bind(this)
    this.createSessionDisplay=this.createSessionDisplay.bind(this)
  }

  componentDidMount() {
    this.props.updateSessionAction(null);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
  })
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
  }

  async handleCreate(evt) {
    evt.preventDefault();
    await this.props.getFriends(this.props.user.id);
    const session = this.props.session;
    if (session && session.id) {
      this.props.leaveRoom(this.props.user.id, session.id);
      this.props.stopWatchingMyLocation();
    }


    this.props.updateSessionAction('host');
    await this.props.createSession(this.props.user.id, this.state.travelMode);
  }

  createSessionDisplay(word) {
    this.setState({
      createSessionDisplay: word
    })
  }
 
  render() {
    return (
      <div className="container">
        {this.props.sessionAction !== null &&
        <Button onClick={() => this.props.updateSessionAction(null)}>Back</Button>
        }
        {this.props.sessionAction === null && (
          <div>
            <h1>{`Hello, ${this.props.user.firstName}!`}</h1>
            <p>How would you like to get started?</p>  
            
            <Container className="flex">
              <Button onClick={this.handleCreate}>Create New Event</Button>
              <Button onClick={() => this.props.updateSessionAction('join')}>
                Join an Event
              </Button>
              <Button onClick={() => this.props.updateSessionAction('all')}>
                View your events
              </Button>
            </Container>
          </div>
        )}
        {this.props.sessionAction === 'join' && (
          <div>
            <form onSubmit={this.handleJoin}>
              <div>
                <Label style={{ color: '#0f3057'}} htmlFor="code">
                  Enter your event code
                </Label>
                <Input required placeholder='enter code here' style={{ boder: "solid 10px #51adcf", backgroundColor: '#e4efe5', width: 'fit-content'}}name="code" type="text" />
                <Button type="submit">Join</Button>
              </div>
              <div></div>
            </form>
          </div>
        )}
        {this.props.sessionAction === 'host' && (
          <div>
            <Link to={`/map/${this.props.session.code}`}>
                <h1>You're almost there...</h1>
            </Link>
            <div className="flexFriends">
            {/* need to add functionality here */}
            <Button className="specialButton">Go to your event</Button>
            <Button onClick={() => this.createSessionDisplay("code")}>Invite friends by code</Button>
            {this.state.createSessionDisplay === "code" && 
            <h3>Your custom event code is: 
            <span className="bold">{` ${this.props.session.code}`}</span> 
         </h3>
            
            }
            <Button onClick={() => this.createSessionDisplay("email")}>Invite friends by email</Button>
            {this.state.createSessionDisplay === "email" && 
            <form onSubmit={this.handleAddFriendViaEmail}>
              <h3>Invite a friend via email (one at a time)</h3>
              <div style={{ display: 'flex' }}>
                <Input name="email" type="email" 
                    value={this.state.email}
                    onChange = {this.handleChange}
                    placeholder="enter friend's email here"
                    />
                    <Button style={{margin: '0px'}}type="submit">Submit</Button>
              </div>
            </form>
            }
            {(this.props.friends.length > 0) && 
            <Button onClick={() => this.createSessionDisplay("auto")}>Click to auto add friends</Button>}
            {this.state.createSessionDisplay === "auto" && 
              <div className="flexFriends">
      
              {this.props.friends.map(friend =>  (
        
              <Button key={friend.id} onClick={() => this.props.inviteFriend( this.props.session.id, friend.email, this.props.user.firstName)}>
                  {friend.firstName} {friend.lastName}
              </Button>
              ))}
              </div>
            }
            <Button onClick={() => this.createSessionDisplay("transportation")}>Edit transportation</Button>
            {this.state.createSessionDisplay === "transportation" &&
            <p> Choose your group's method of transportation:  
            <span> 
              <Select name="travelMode" onChange={this.handleChangeMode} value={this.state.travelMode}>
              <option value="WALKING">Walking</option>
                <option value="BICYCLING">Cycling</option>
                <option value="DRIVING">Driving</option>
                <option value="TRANSIT">Transit</option>
              </Select>
            </span> 
          </p>
            
            }
            </div>
            <div>
      
            
          </div>
          <div>
  
              
              
            {/* <Link to={`/map/${this.props.session.code}`}>
                <span style={{ textDecoration: 'underline' }}>Join now</span>
                </Link> */}
             
            </div>
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
    friends: state.friendReducer, 
    sessionAction: state.sessionAction
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
    inviteFriend: (sessionId, email, hostName) => dispatch(inviteSessionUsersThunkCreator(sessionId, email, hostName)),
    updateSessionAction: (action)=> dispatch(updateSessionAction(action))
  };
};
export default connect(mapState, mapDispatch)(JoinRoom);
