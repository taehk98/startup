import React from 'react';
import './unauthenticated.css';
import Button from 'react-bootstrap/Button';
import {MessageDialog} from './messageDialog';

export function Unauthenticated(props) {
  const [userName, setUserName] = React.useState(props.userName);
  const [password, setPassword] = React.useState('');
  const [userEmail, setUserEmail] = React.useState(props.userEmail);
  const [clubName, setClubName] = React.useState(props.clubName);
  const [displayError, setDisplayError] = React.useState(null);

  async function loginUser() {
    loginOrCreate(`/api/auth/login`);
  }

  async function createUser() {
    if(!userName || !password || !userEmail || !clubName) {
        setDisplayError(`⚠ Error: ${body.msg}`);
    }
    loginOrCreate(`/api/auth/create`);
  }

  async function loginOrCreate(endpoint) {
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({email: userEmail, password: password, name: userName, club: clubName}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
        const user = await response.json();
        localStorage.setItem('userName', user.name);
        localStorage.setItem('clubName', user.club);
        localStorage.setItem('userEmail', userEmail);
        window.dispatchEvent(new Event('storage'));
        props.onLogin(userEmail);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  return (
    <>
      <div>
        <div className='form-group'>
          <input
            className='form-control'
            type='text'
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder='Enter your@email.com'
          />
        </div>
        <div className='form-group'>
          <input
            className='form-control'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
          />
        </div>
        <div className='form-group'>
          <input
            className='form-control'
            type='text'
            onChange={(e) => setUserName(e.target.value)}
            placeholder='Enter Your Name Only For Sign Up'
          />
        </div>
        <div className='form-group'>
          <input
            className='form-control'
            type='text'
            onChange={(e) => setClubName(e.target.value)}
            placeholder='Enter Your Club Code Only For Sign Up'
          />
        </div>
        <div className="login-button">
            <Button type="login" className='btn btn-primary' variant="primary" onClick={() => loginUser()}>
            Login
            </Button>
            <Button type="sign-up" className='btn btn-primary' variant="primary" onClick={() => createUser()}>
            Sign Up
            </Button>
        </div>
        
      </div>

      <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    </>
  );
}
