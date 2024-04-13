import React from 'react';

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';

export function Login({ userName, clubName, userEmail, authState, onAuthChange }) {
  return (
    <main>
      <div>
        <img className="logoimage" src="/logo_transparent.png" alt="logo" width="260px" height="260px"></img>
        {authState !== AuthState.Unknown}
        {authState === AuthState.Authenticated && (
          <Authenticated userName={userName} onLogout={() => onAuthChange(userEmail, AuthState.Unauthenticated)} />
        )}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            userName={userName}
            clubName={clubName}
            userEmail={userEmail}
            onLogin={(loginUserName) => {
              onAuthChange(loginUserName, AuthState.Authenticated);
            }}
          />
        )}
      </div>
    </main>
  );
}
