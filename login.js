function loginUser() {
    const nameEl = document.querySelector("#name");
    localStorage.setItem("userName", nameEl.value);

    const clubEl = document.querySelector("#clubCode");
    localStorage.setItem("clubName", clubEl.value);

    window.location.href = "attendance.html";
}

function createUser() {
    const nameEl = document.querySelector("#name");
    localStorage.setItem("userName", nameEl.value);

    const clubEl = document.querySelector("#clubCode");
    localStorage.setItem("clubName", clubEl.value);


    const attendancesText = localStorage.getItem('attendances');
    let attendances = [];
    if (attendancesText) {
        attendances = JSON.parse(attendancesText);
    }

    const newAttendances = { name: localStorage.getItem('userName'), club: localStorage.getItem('clubName'), numOfAttend: 0, numOfAbsence: 0, numOfFake: 0, willAttend: null}
    attendances.push(newAttendances);

    localStorage.setItem('attendances', JSON.stringify(attendances));

    window.location.href = "attendance.html";
}