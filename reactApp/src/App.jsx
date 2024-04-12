import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Attendance } from './attendance/attendance';
import { Report } from './report/report';
import { Matches } from './matches/matches';
import { AuthState } from './login/authState';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const [clubName, setClubName] = React.useState(localStorage.getItem('clubName') || '');
  const [userEmail, setUserEmail] = React.useState(localStorage.getItem('userEmail') || '');
  const currentAuthState = userEmail ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);

  return (
    <BrowserRouter>
      <header>
        <nav style={{backgroundColor: '#e3f2fd'}}
        className="container-fluid navbar border-top border-body ps-2">
          <div className="navbar-brand">
              MYC
          </div>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <NavLink className='nav-link' to=''>
                Login
              </NavLink>
            </li>
            {authState === AuthState.Authenticated && (
              <li className='nav-item'>
                <NavLink className='nav-link' to='attendance'>
                  Attendance
                </NavLink>
              </li>
            )}
            {authState === AuthState.Authenticated && (
              <li className='nav-item'>
                <NavLink className='nav-link' to='report'>
                  Report
                </NavLink>
              </li>
            )}
            <li className='nav-item'>
              <NavLink className='nav-link' to='matches'>
                PL-Match
              </NavLink>
            </li>
          </ul>
            {authState === AuthState.Authenticated && (
            <div className="navbar-text">
                    User: <span className="user-name">{truncateName(userName)}</span>
                    Club Name: <span className="club-name">{clubName}</span>
            </div>
            )}
          
        </nav>
      </header>

      <Routes>
        <Route
          path='/'
          element={
            <Login
              userName={userName}
              clubName={clubName} 
              userEmail={userEmail}
              authState={authState}
              onAuthChange={(userEmail, authState) => {
                setAuthState(authState);
                setUserEmail(userEmail);
              }}
            />
          }
          exact
        />
        <Route path='/attendance' element={<Attendance userName={userName} clubName={clubName} userEmail={userEmail} />} />
        <Route path='/report' element={<Report userEmail={userEmail}/>} />
        <Route path='/matches' element={<Matches />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

      <footer>
        <hr />
        <span className="text-reset">Author Name: Taehoon Kim</span>
        <br />
        <a href="https://github.com/taehk98/startup.git">GitHub</a>
      </footer>
    </BrowserRouter>
  )
}

function NotFound() {
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

const truncateName = (name) => {
  let firstWord = name;
  if(name != null && isEnglish(name) && name.length > 15){
      const words = name.split(' '); // 이름을 빈칸을 기준으로 나눔
      firstWord = words[0]; // 맨 앞에 있는 단어 저장
      if (firstWord.length > 15) { // 단어가 15자 이상인 경우
          firstWord = firstWord.slice(0, 10) + '...'; // 첫 10자만 유지하고 나머지는 생략
      }
  }
  return firstWord; 
}

function isEnglish(text) {
  return /^[a-zA-Z]+$/.test(text);
}


export default App
