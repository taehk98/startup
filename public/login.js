(async () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
    const welcomeMessage = document.createElement('h1');
    welcomeMessage.textContent = 'Welcome';
    
    const userNameElement = document.createElement('span');
    userNameElement.textContent = userName;
    
    const playerNameContainer = document.querySelector('#playerName');
    playerNameContainer.appendChild(welcomeMessage);
    playerNameContainer.appendChild(userNameElement);
      setDisplay('loginControls', 'none');
      setDisplay('playControls', 'block');
    } else {
      setDisplay('loginControls', 'block');
      setDisplay('playControls', 'none');
    }
  })();


async function loginUser() {
    loginOrCreate(`/api/auth/login`);
}

async function createUser() {
    loginOrCreate(`/api/auth/create`);
}

async function loginOrCreate(endpoint) {
    const email = document.querySelector('#email')?.value;
    const password = document.querySelector('#password')?.value;
    const name = document.querySelector('#name')?.value;
    const club = document.querySelector('#clubCode')?.value;

    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({ email: email, password: password, name: name, club: club }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  
    if (response.ok) {
      const user = await response.json();
          // Save the scores in case we go offline in the future
      localStorage.setItem('userName', user.name);
      localStorage.setItem('clubName', user.club);
      localStorage.setItem('userEmail', email);
      window.location.href = 'attendance.html';
    } else {
      const body = await response.json();
      const modalEl = document.querySelector('#msgModal');
      modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
      const msgModal = new bootstrap.Modal(modalEl, {});
      msgModal.show();
    }
  }

// function loginUser() {
//     const nameEl = document.querySelector("#name");
//     localStorage.setItem("userName", nameEl.value);

//     const clubEl = document.querySelector("#clubCode");
//     localStorage.setItem("clubName", clubEl.value);

//     window.location.href = "attendance.html";
// }

function logout() {
    localStorage.removeItem('userName');
    localStorage.removeItem('clubName');
    fetch(`/api/auth/logout`, {
      method: 'delete',
    }).then(() => (window.location.href = '/'));
  }


// async function createUser() {
//     const nameEl = document.querySelector("#name");
//     localStorage.setItem("userName", nameEl.value);

//     const clubEl = document.querySelector("#clubCode");
//     localStorage.setItem("clubName", clubEl.value);

//     const newAttendances = { name: localStorage.getItem('userName'), 
//         club: localStorage.getItem('clubName'), willAttend: null, actualAtt: null, 
//         attNum: 0, notAttNum: 0, fakeAttNum: 0};

//     try {
//             const response = await fetch('/api/save-attendances', {
//               method: 'POST',
//               headers: {'content-type': 'application/json'},
//               body: JSON.stringify(newAttendances),
//             });
      
//             // Store what the service gave us as the high scores
//             const attendances = await response.json();
//             localStorage.setItem('attendances', JSON.stringify(attendances));
//     } catch {
//             // If there was an error then just track scores locally
//             updateAttendancesLocal(newAttendances);
//     }

//     window.location.href = "attendance.html";
// }

function updateAttendancesLocal(newAttendance) {
    let attendances = [];
    const attendancesText = localStorage.getItem('attendances');
    if (attendancesText) {
        attendances = JSON.parse(attendancesText);
    }

    let found = false;
    for (let i = 0; i < attendances.length; i++) {
        user = attendances[i];
        if (user.name == newAttendance.name && user.club == newAttendance.club) {
            attendances[i] = newAttendance;
            found = true;
            break;
        }
    }

    if (!found) {
        attendances.push(newAttendance);
    }

    localStorage.setItem('attendances', JSON.stringify(attendances));
}

function play() {
    window.location.href = 'attendance.html';
}


  function setDisplay(controlId, display) {
    const playControlEl = document.querySelector(`#${controlId}`);
    if (playControlEl) {
      playControlEl.style.display = display;
    }
}