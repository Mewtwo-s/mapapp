import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom';
import { createSessionThunkCreator, joinSessionThunkCreator } from '../store/session';

export class JoinRoom extends React.Component{
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleJoin = this.handleJoin.bind(this);
        this.state = {
            currentSession: null, 
            sessionAction: null
        };
        this.handleCreate = this.handleCreate.bind(this);
    }

    handleClick(action){
       this.setState({
           sessionAction: action});
    }

    async handleJoin(evt) {
        evt.preventDefault();
        await this.props.joinSession(this.props.user.id, evt.target.code.value);
    }

    async handleCreate(evt) {
        evt.preventDefault();
        this.setState({
            sessionAction: 'host'})
        await this.props.createSession(this.props.user.id);
    }

    render () {
    return (
        <div>
            {this.state.sessionAction === null && 
            <div>
                <button onClick={this.handleCreate}>Create A New Session</button>
                <button onClick={() => this.handleClick('join')}>Join A Session</button>
            </div>}
            {this.state.sessionAction === 'join' && 
            <div>
                <form onSubmit={this.handleJoin}>
                <div>
                <label htmlFor="code">
                    <small>Join Existing Room</small>
                </label>
                <input name="code" type="text" />
                <button type='submit'>Join</button>
                </div>
                <div>
 
        </div>    
      </form>
            </div>}
            {this.state.sessionAction === 'host' && 
            <div>
                <h3>Invite friends using the code: {this.props.session.code} </h3>
                <Link to={`/map/${this.props.session.code}`}>
                <button>Go to session</button>
                </Link>
            </div>}
        </div>
    )
}
}

const mapState = (state) => {
    return {
      user: state.auth,
      session: state.sessionReducer
    }
  }

  const mapDispatch = (dispatch, { history }) => {
      return {
          joinSession: (userId, code) => dispatch(joinSessionThunkCreator(userId, code, history)),
          createSession: (userId) => dispatch(createSessionThunkCreator(userId, history))
      }
  }
export default connect(mapState, mapDispatch)(JoinRoom)
