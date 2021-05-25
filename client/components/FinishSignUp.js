import React, { Component, useEffect, useState } from 'react';
import history from '../history';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { joinSessionThunkCreator } from '../store/session';
import { changeUserInfoThunk } from '../store/auth';
import { FormGroup, Label, Input, Button } from '../GlobalStyles';
import styled from 'styled-components';

function FinishSignUp(props) {
  function handleSubmit(evt) {
    evt.preventDefault();
    const userId = props.match.params.usercode;
    const email = evt.target.email.value;
    const password = evt.target.password.value;
    const firstName = evt.target.firstName.value;
    const lastName = evt.target.lastName.value;
    const photo = evt.target.photo.value;
    props.changeUserInfo(
      userId,
      email,
      password,
      firstName,
      lastName,
      photo,
      props.match.params.gamecode
    );
    // console.log(email, password, firstName, lastName , userId, photo)
  }
  console.log('FinishSignUp props', props.match.params.gamecode);

  return (
    <div>
      <h3>Please complete your signup to join your event</h3>
      <FormContainer>
        <form name="join" onSubmit={handleSubmit}>
          {
            <FormGroup>
              <div>
                <Label htmlFor="email">
                  <small>Email</small>
                </Label>
                <Input required name="email" type="text" />
              </div>
              <div>
                <Label htmlFor="password">
                  <small>Password</small>
                </Label>
                <Input required name="password" type="password" />
              </div>
              <div>
                <Label htmlFor="firstName">
                  <small>First Name</small>
                </Label>
                <Input required name="firstName" type="text" />
              </div>
              <div>
                <Label htmlFor="lastName">
                  <small>Last Name</small>
                </Label>
                <Input required name="lastName" type="text" />
              </div>
              <div>
                <Label htmlFor="photo">
                  <small>Photo</small>
                </Label>
                <Input name="photo" type="text" />
              </div>
            </FormGroup>
          }
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="submit">Submit And Join Event</Button>
          </div>
        </form>
      </FormContainer>
    </div>
  );
}

const FormContainer = styled.div`
  border-radius: 5px;
  background-color: #41adcf;
  justify-content: center;
  margin: 50px auto;
  padding: 20px;
  width: fit-content;
  @media screen and (max-width: 600px) {
    width: 90vw;
  }
`;

const mapState = (state) => {
  return {
    user: state.auth,
  };
};

const mapDispatch = (dispatch, { history }) => {
  return {
    changeUserInfo: (
      userId,
      email,
      password,
      firstName,
      lastName,
      photo,
      sessionCode
    ) => {
      dispatch(
        changeUserInfoThunk(
          userId,
          email,
          password,
          firstName,
          lastName,
          photo,
          sessionCode,
          history
        )
      );
    },
  };
};
export default connect(mapState, mapDispatch)(FinishSignUp);
