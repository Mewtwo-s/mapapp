import React, { Component, useEffect, useState } from 'react';
import history from '../history';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { joinSessionThunkCreator } from '../store/session';
import { changeUserInfoThunk } from '../store/auth';

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
      props.match.params.gameCode
    );
    // console.log(email, password, firstName, lastName , userId, photo)
  }
  console.log('FinishSignUp props', props);
  return (
    <div>
      <h3>Complete Ya Sign Up, Ya Badass Friends Are WAITING</h3>
      <form name="join" onSubmit={handleSubmit}>
        {
          <div>
            <div>
              <label htmlFor="email">
                <small>Email</small>
              </label>
              <input name="email" type="text" />
            </div>
            <div>
              <label htmlFor="password">
                <small>Password</small>
              </label>
              <input name="password" type="password" />
            </div>
            <div>
              <label htmlFor="firstName">
                <small>First Name</small>
              </label>
              <input name="firstName" type="text" />
            </div>
            <div>
              <label htmlFor="lastName">
                <small>Last Name</small>
              </label>
              <input name="lastName" type="text" />
            </div>
            <div>
              <label htmlFor="photo">
                <small>Photo</small>
              </label>
              <input name="photo" type="text" />
            </div>
          </div>
        }

        <button type="submit">Submit And Join Event</button>
      </form>
    </div>
  );
}

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
