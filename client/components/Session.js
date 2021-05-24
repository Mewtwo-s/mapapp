import React from 'react';
import { Link } from 'react-router-dom';
import history from '../history';

function Session(props) {
  const { code, id } = props;

  function handleStart() {
    history.push('/map');
  }

  return (
    <div>
      <span>{code}</span>
      <span>
        <Link to={`/emailInvite/${id}`}>Send To Friend</Link>
      </span>
      <button onClick={handleStart}>Start Event</button>
    </div>
  );
}

export default Session;
