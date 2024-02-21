class List {
    currAttendList;
    currAbsentList;

    constructor() {
        const userNameEl = document.querySelector('.user-name');
        userNameEl.textContent = this.getUserName();
        this.currAttendList = [];
        this.currAbsentList = [];
        this.loadLists();

        const presentCheckbox = document.getElementById('Present');
        presentCheckbox.addEventListener('click', this.handlePresentCheck.bind(this));

        const absentCheckbox = document.getElementById('notPresent');
        absentCheckbox.addEventListener('click', this.handleAbsentCheck.bind(this));
    }

    handlePresentCheck() {
        const presentCheckbox = document.getElementById('Present');
        const absentCheckbox = document.getElementById('notPresent');

        if (presentCheckbox.checked) {
            absentCheckbox.checked = false;
            this.checkedAttend();
        }
    }

    handleAbsentCheck() {
        const presentCheckbox = document.getElementById('Present');
        const absentCheckbox = document.getElementById('notPresent');

        if (absentCheckbox.checked) {
            presentCheckbox.checked = false;
            this.checkedAbsent();
        }
    }

    getUserName() {
        return localStorage.getItem('userName') ?? 'Mystery User';
    }

    getClubName() {
        return localStorage.getItem('clubName') ?? 'Mystery Club';
    }

    getUserID() {
        return localStorage.getItem('userID') ?? 'Mystery UserID';
    }
    


    checkedAttend() {
        this.saveAttend(true);
        this.loadLists();
        //이거 바로 윗줄 되는지 확실치 않음

    }

    checkedAbsent() {
        this.saveAttend(false);
        this.loadLists();
    }

    saveAttend(willAttend) {
        const userName = this.getUserName();
        const clubName = this.getClubName();
        let attendances = [];
        const attendanceText = localStorage.getItem('attendances');

        if(attendanceText){
            attendances = JSON.parse(attendanceText);
        }
        attendances = this.updateAttendances(userName, clubName, willAttend, attendances);

        localStorage.setItem('attendances' , JSON.stringify(attendances));
    }


    // 아마 현재 참석 횟수 , 불참 횟수, 참석하기로하고 불참 횟수 추가해야함
    updateAttendances(userName, clubName, Attend, attendances) {

        const newAttendance = {name: userName , club: clubName , willAttend: Attend};
        console.log(newAttendance);
        const updatedAttendances = attendances.map(attendance => {
            if (attendance.name === userName && attendance.club === clubName) {
                return newAttendance; // 해당하는 객체를 업데이트한 후 반환
            } else {
                return attendance; // 해당하지 않는 객체는 그대로 반환
            }
        });
        console.log(updatedAttendances);
        return updatedAttendances; // 새로운 배열 반환

    }

    getClubMemberObjs() {
        let attendances = [];
        let clubMemberObjs = [];
        const club = this.getClubName();
        const attendanceText = localStorage.getItem('attendances');

        if(attendanceText){
            attendances = JSON.parse(attendanceText);
        }
        if(club !== 'Mystery Club') {
            clubMemberObjs = attendances.filter(obj => obj.club === club);
        }
        console.log(club);
        console.log(clubMemberObjs);
        return clubMemberObjs;
    }

    loadLists() {
        if(this.getClubMemberObjs() !== null){
            const clubMemberObjs = this.getClubMemberObjs();

            const attendList = document.getElementById('attendList');
            attendList.innerHTML = '';

            this.currAttendList = clubMemberObjs
                .filter(member => member.willAttend)
                .map(member => member.name);
            
            this.currAttendList.forEach(name => {
                const listItem = document.createElement('li');
                listItem.textContent = name;
                listItem.classList.add('list-group-item');
                attendList.appendChild(listItem);
            })

            // 'absentList'에 아이템 추가

            const absentList = document.getElementById('absentList');
            absentList.innerHTML = ''; // 리스트 초기화

            this.currAbsentList = clubMemberObjs
                .filter(member => !member.willAttend)
                .map(member => member.name);

            this.currAbsentList.forEach(name => {
                const listItem = document.createElement('li');
                listItem.textContent = name;
                listItem.classList.add('list-group-item');
                absentList.appendChild(listItem);
            });
        }
    }
}

const list = new List();
