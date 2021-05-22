import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {getFriendsThunk} from '../store/user'
import { FormGroup, Label, Input , Button } from '../GlobalStyles'
import styled from 'styled-components'
import { Link, Redirect, useParams, useHistory } from 'react-router-dom';
import {joinSessionThunkCreator} from '../store/session'

function Test(props) {
 

   const [roomCode, setCode] = useState('')

   useEffect(() => {
    setCode( props.match.params.gamecode)
  }, [props.match.params.gamecode]);


   function handleSubmit(evt) {
     evt.preventDefault()
     props.userJoinSession(props.user.id, roomCode)
     }
   function handleChange(evt){
      setCode(evt.target.value)
   }
   
   return (
     <div>
    
      <FormContainer>
      <h1>Sup {props.user.firstName}</h1>
      <form onSubmit={handleSubmit} name={name}>
   
         <FormGroup>
           <div>
             <Label htmlFor="email">
               <small>Code</small>
             </Label>
             <Input name="code" required placeholder='required' onChange={handleChange} value={roomCode}/>
           </div> </FormGroup>

       <FormGroup>
         
         {/* <Link to={`/map/${roomCode}`}><Button type="submit">Meet Ya Friend</Button></Link> */}
         <Button type="submit">Meet Ya Friend</Button>
       </FormGroup>
       
     </form>
   </FormContainer>
   </div>
   )
}


const mapState = state => {
   return {
     user: state.auth
   }
 }

 const mapDispatch = (dispatch, {history}) => {
   return {
     fetchFriendsFromThunk: (userId) => {
       dispatch(getFriendsThunk(userId))
     },
     userJoinSession: (userId, roomCode) =>{
       dispatch(joinSessionThunkCreator(userId, roomCode, history))
     }
    }
 }

 const FormContainer = styled.div`
  width: 90%;
  border-radius: 5px;
  background-color:#51adcf;
  margin: 25px 25px;
  padding: 20px;`

export default connect(mapState, mapDispatch)(Test)
