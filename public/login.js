

function loginUser() {
    const nameEl = document.querySelector("#name");
    localStorage.setItem("userName", nameEl.value);

    const clubEl = document.querySelector("#clubCode");
    localStorage.setItem("clubName", clubEl.value);

    window.location.href = "attendance.html";
}

async function createUser() {
    const nameEl = document.querySelector("#name");
    localStorage.setItem("userName", nameEl.value);

    const clubEl = document.querySelector("#clubCode");
    localStorage.setItem("clubName", clubEl.value);

    const newAttendances = { name: localStorage.getItem('userName'), 
        club: localStorage.getItem('clubName'), willAttend: null, actualAtt: null, 
        attNum: 0, notAttNum: 0, fakeAttNum: 0};

    try {
            const response = await fetch('/api/save-attendances', {
              method: 'POST',
              headers: {'content-type': 'application/json'},
              body: JSON.stringify(newAttendances),
            });
      
            // Store what the service gave us as the high scores
            const attendances = await response.json();
            localStorage.setItem('attendances', JSON.stringify(attendances));
    } catch {
            // If there was an error then just track scores locally
            updateAttendancesLocal(newAttendances);
    }

    window.location.href = "attendance.html";
}


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