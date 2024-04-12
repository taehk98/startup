import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'react-bootstrap';

import './authenticated.css';

export function Authenticated(props) {
  const navigate = useNavigate();

  function logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    })
      .catch(() => {
        // Logout failed. Assuming offline
      })
      .finally(() => {
        localStorage.removeItem('userName');
        localStorage.removeItem('clubName');
        localStorage.removeItem('userEmail');
        props.onLogout();
      });
  }

  return (
    <div>
        <h1>Welcome</h1>
        <div className='playerName'>{props.userName}</div>
        <div className="login-button">
            <Button className="btn btn-primary"
            variant="primary" onClick={() => navigate('/attendance')}>
                Attendance
            </Button>
            <Button className="btn btn-primary"
            variant="primary" onClick={() => logout()}>
                Logout
            </Button>
        </div>
    </div>
  );
}
