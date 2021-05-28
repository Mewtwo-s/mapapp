import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  createSessionThunkCreator,
  joinSessionThunkCreator,
  addTransitThunkCreator
} from '../store/session';
import { stopWatchingMyLocation } from '../store/location';
import { leaveRoom } from '../store/locationSharing';
import { Button, Label, SpecialButton, FriendButton, FormGroup, Input, Container, Select } from '../GlobalStyles';
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
      travelMode: 'DRIVING',
      createSessionDisplay: null, 
      friendAdded: null,
      friendsInvited: [],
      transitMessage: "Driving"
    };
    this.handleCreate = this.handleCreate.bind(this);
    this.handleAddFriendViaEmail = this.handleAddFriendViaEmail.bind(this)
    this.handleChangeMode = this.handleChangeMode.bind(this)
    this.createSessionDisplay=this.createSessionDisplay.bind(this)
    this.addAFriend=this.addAFriend.bind(this)
    this.goBack=this.goBack.bind(this);
    this.submitTravel=this.submitTravel.bind(this);
  }

  componentDidMount() {
    this.props.updateSessionAction(null);
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
  })
  }

  async handleAddFriendViaEmail (evt) {
    evt.preventDefault();
    this.props.inviteFriend( this.props.session.id, evt.target.email.value, this.props.user.firstName)
    this.setState({
      email: '',
      friendsInvited: [...this.state.friendsInvited, evt.target.email.value]
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
    e.preventDefault();
    this.setState({
      travelMode: e.target.value
    })
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
      createSessionDisplay: word,
      friendAdded: null,
      friendsInvited: []
    })
  }

  addAFriend (friendEmail, friendName) {
    if (this.state.friendAdded === friendName) {
      this.setState({
        friendAdded: null
      })
    } else {
      this.setState({
        friendAdded: friendName
      })
    }
    this.props.inviteFriend(this.props.session.id, friendEmail, this.props.user.firstName)
  }

  goBack() {
    this.setState({
      createSessionDisplay: null,
      friendAdded: null
    })
    this.props.updateSessionAction(null)
  }

  submitTravel () {
    let transitMessage
    let transitMode = this.state.travelMode
    if (transitMode === "DRIVING") {
      transitMessage = "Driving"
    } else if (transitMode === "WALKING") {
      transitMessage = "Walking"
    }  else if (transitMode === "BICYCLING") {
      transitMessage = "Cycling"
    } else if (transitMode === "TRANSIT") {
      transitMessage = "Transit"
    }
    this.props.addTransit(this.props.session.id, this.state.travelMode)
    this.setState({
      transitMessage: transitMessage
    })
  }
 
  render() {
    return (
      <div className="container">
        {this.props.sessionAction !== null &&
        <Button onClick={this.goBack}>Back</Button>
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
            <div className="clickToOpen">
            <Link to={`/map/${this.props.session.code}`}>
                <SpecialButton>Go to your event</SpecialButton>
              </Link> 
              </div>
            <Button onClick={() => this.createSessionDisplay("code")}>Invite friends by code</Button>
            {this.state.createSessionDisplay === "code" && 
            <div className="clickToOpen">
            <h3>Your custom event code is: 
            <span className="bold">{` ${this.props.session.code}`}</span> 
         </h3>
            </div>
            }
            <Button onClick={() => this.createSessionDisplay("email")}>Invite friends by email</Button>
            {this.state.createSessionDisplay === "email" && 
            <div className="clickToOpen">
            <form onSubmit={this.handleAddFriendViaEmail}>
              <h3>Invite a friend via email (one at a time)</h3>
              {this.state.friendsInvited.length > 0 && `Added ${this.state.friendsInvited.join(", ")}`}
              <p>{}</p>
              <div style={{ display: 'flex' }}>
                <Input name="email" type="email" 
                    value={this.state.email}
                    onChange = {this.handleChange}
                    placeholder="enter friend's email here"
                    />
                    <Button style={{margin: '0px'}}type="submit">Submit</Button>
              </div>
            </form>
            </div>
            }
            {(this.props.friends.length > 0) && 
            <Button onClick={() => this.createSessionDisplay("auto")}>Click to auto add friends</Button>}
            {this.state.createSessionDisplay === "auto" && 
            <div className="clickToOpen">
              <div className="clickToOpen">
              {this.state.friendAdded && <p>Added {this.state.friendAdded}</p>}
              </div>
              <div className="flexFriends">
              {this.props.friends.map(friend =>  (
        
              <FriendButton key={friend.id} onClick={() => this.addAFriend(friend.email, friend.firstName)}>
                  {friend.firstName} {friend.lastName}
              </FriendButton>
              ))}
              </div>
              </div>
            }
            <Button onClick={() => this.createSessionDisplay("transportation")}>Edit transportation</Button>
            {this.state.createSessionDisplay === "transportation" &&
            <div className="clickToOpen">
            <p> {this.state.transitMessage && `You group's travel method is set to ${this.state.transitMessage}. Submit a selection below to change it.`} 
         
            <span> 
              <Select name="travelMode" onChange={this.handleChangeMode} value={this.state.travelMode}>
              <option name="Driving" value="DRIVING">Driving</option>
              <option name="Walking" value="WALKING">Walking</option>
                <option name="Cycling" value="BICYCLING">Cycling</option>
                <option name="Transit" value="TRANSIT">Transit</option>
              </Select>
              <Button onClick={this.submitTravel}>Submit</Button>
            </span> 
            </p>
          
            </div>
            }
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
    updateSessionAction: (action)=> dispatch(updateSessionAction(action)),
    addTransit: (sessionId, transit) => dispatch(addTransitThunkCreator(sessionId, transit))
  };
};
export default connect(mapState, mapDispatch)(JoinRoom);
