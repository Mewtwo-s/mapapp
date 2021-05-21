import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {getFriendsThunk} from '../store/user'
import { FormGroup, Label, Input , Button } from '../GlobalStyles'
import styled from 'styled-components'
import { Link, Redirect, } from 'react-router-dom';
import history from '../history'

function Test() {
   const [code, setCode] = useState()

   function handleSubmit() {
   alert('submit')
     }
   function handleChange(evt){
      setCode(evt.target.value)
   }
   return (
     <div>
     <Link to='/test/sdjasdkj/2312'>hi</Link>
      <FormContainer>
      <form onSubmit={handleSubmit} name={name}>
   
         <FormGroup>
           <div>
             <Label htmlFor="email">
               <small>Code</small>
             </Label>
             <Input name="code" required placeholder='required' onChange={handleChange}/>
           </div> </FormGroup>

       <FormGroup>
         
         <Link to={`/map/${code}`}><Button type="submit">Submit</Button></Link>
        
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

 const mapDispatch = dispatch => {
   return {
     fetchFriendsFromThunk: (userId) => {
       dispatch(getFriendsThunk(userId))
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
