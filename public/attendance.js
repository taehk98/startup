class Attandance {
    currAttendList;
    currAbsentList;
    endVotingButton; 
    saveActualButton; 
    saveActual;

    constructor() {
        const userNameEl = document.querySelector('.user-name');
        let userName = this.getUserName();
        let truncatedName = this.truncateName(userName);
        userNameEl.textContent = truncatedName;
        const clubNameEl = document.querySelector('.club-name');
        clubNameEl.textContent = this.getClubName().toUpperCase();
        this.currAttendList = [];
        this.currAbsentList = [];
        this.saveActual = false;
        this.loadLists();
        hideUserDivOnMobile();

        const presentCheckbox = document.getElementById('Present');
        presentCheckbox.addEventListener('click', this.handlePresentCheck.bind(this));

        const absentCheckbox = document.getElementById('notPresent');
        absentCheckbox.addEventListener('click', this.handleAbsentCheck.bind(this));

        this.endVotingButton = document.getElementById('endButton');
        this.endVotingButton.addEventListener('click', this.endVoting.bind(this));

        this.saveActualButton = document.getElementById('SaveActualButton');
        this.saveActualButton.addEventListener('click', this.saveActualVoting.bind(this));

        window.addEventListener('resize', hideUserDivOnMobile);

    }

    handlePresentCheck() {
        const presentCheckbox = document.getElementById('Present');
        const absentCheckbox = document.getElementById('notPresent');

        if (presentCheckbox.checked) {
            absentCheckbox.checked = false;
            this.checkedAttend();
        }else {
            absentCheckbox.checked = true;
            this.checkedAbsent();
        }
    }

    handleAbsentCheck() {
        const presentCheckbox = document.getElementById('Present');
        const absentCheckbox = document.getElementById('notPresent');

        if (absentCheckbox.checked) {
            presentCheckbox.checked = false;
            this.checkedAbsent();
        }else{
            presentCheckbox.checked = true;
            this.checkedAttend();
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

    saveActualRecord() {
        let checkboxElements = document.querySelectorAll("input");

        checkboxElements.forEach(function(element){
            if (element.disabled) {
                element.disabled = false;
            }
        });

        const clubMemberObjs = this.getClubMemberObjs();
        
    }

    saveVoting() {
        let checkboxElements = document.querySelectorAll("input");

        checkboxElements.forEach(function(element){
            if (!element.disabled) {
                element.disabled = true;
            }
        });
    }


    checkedAttend() {
        this.saveAttend(true);
        this.loadLists();
    }

    checkedAbsent() {
        this.saveAttend(false);
        this.loadLists();
    }

    saveAttend(att) {
        const userName = this.getUserName();
        const clubName = this.getClubName();
        let attendances = [];
        const attendanceText = localStorage.getItem('attendances');
        
        if(attendanceText){
            attendances = JSON.parse(attendanceText);
        }
        let currObj = attendances.filter(obj => obj.name === userName)[0];
        attendances = this.updateAttendances(userName, clubName, att, currObj, attendances);

        localStorage.setItem('attendances' , JSON.stringify(attendances));
    }


    // 아마 현재 참석 횟수 , 불참 횟수, 참석하기로하고 불참 횟수 추가해야함
    updateAttendances(userName, clubName, att,  currObj , attendances) {
        let newAttendance;
        if(this.saveActual){
            newAttendance = {name: userName , club: clubName , willAttend: currObj.willAttend, actualAtt: att, attNum: currObj.attNum, notAttNum: currObj.notAttNum, fakeAttNum: currObj.fakeAttNum};
        }else{
            newAttendance = {name: userName , club: clubName , willAttend: att, actualAtt: currObj.actualAtt, attNum: currObj.attNum, notAttNum: currObj.notAttNum, fakeAttNum: currObj.fakeAttNum};
        }
        const updatedAttendances = attendances.map(attendance => {
            if (attendance.name === userName && attendance.club === clubName) {
                return newAttendance; 
            } else {
                return attendance; 
            }
        });
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
        return clubMemberObjs;
    }

    loadLists() {
        if(this.getClubMemberObjs() !== null){
            const clubMemberObjs = this.getClubMemberObjs();

            const attendList = document.getElementById('attendList');
            attendList.innerHTML = '';

            if(this.saveActual){
                this.currAttendList = clubMemberObjs
                    .filter(member => member.actualAtt)
                    .map(member => member.name);

                this.currAbsentList = clubMemberObjs
                    .filter(member => !member.actualAtt)
                    .map(member => member.name);
            }else {
                this.currAttendList = clubMemberObjs
                .filter(member => member.willAttend)
                .map(member => member.name);

                this.currAbsentList = clubMemberObjs
                .filter(member => !member.willAttend)
                .map(member => member.name);
            }
            // Adds items to 'attendList'
            this.currAttendList.forEach(name => {
                const listItem = document.createElement('li');
                let truncatedName = this.truncateName(name);
                listItem.textContent = truncatedName;
                listItem.classList.add('list-group-item');
                attendList.appendChild(listItem);
            })

            // Adds items to 'absentList'
            const absentList = document.getElementById('absentList');
            absentList.innerHTML = ''; 

            this.currAbsentList.forEach(name => {
                const listItem = document.createElement('li');
                let truncatedName = this.truncateName(name);
                listItem.textContent = truncatedName;
                listItem.classList.add('list-group-item');
                absentList.appendChild(listItem);
            });
        }
    }

    endVoting () {
        this.saveActual = true;
        const PresentTxtEl = document.getElementById("Present-text");
        PresentTxtEl.textContent = "Was Present";
        PresentTxtEl.style.paddingLeft = "15.76px";
        PresentTxtEl.style.paddingRight = "15.76px";
        const NotPresentTxtEl = document.getElementById("NotPresent-text");
        NotPresentTxtEl.textContent = "Was Not Present";
        this.endVotingButton.disabled = true;
        this.saveActualButton.disabled = false;

        let clubMemberObjs = this.getClubMemberObjs();
        
        const updatedClubMemberObjs = clubMemberObjs.map(member => {
            // 기존 객체를 복제하여 업데이트
            const updatedMember = { ...member };
    
            // 속성 업데이트         
            updatedMember.actualAtt = updatedMember.willAttend;
    
            // 업데이트된 객체 반환
            return updatedMember;
        });
        localStorage.setItem('attendances' , JSON.stringify(updatedClubMemberObjs));
        this.loadLists();
    }

    saveActualVoting() {
        this.saveActual = false;
        const PresentTxtEl = document.getElementById("Present-text");
        PresentTxtEl.textContent = "Will Present";
        PresentTxtEl.style.paddingLeft = "13.465px";
        PresentTxtEl.style.paddingRight = "13.465px";
        const NotPresentTxtEl = document.getElementById("NotPresent-text");
        NotPresentTxtEl.textContent = "Will Not Present";
        this.endVotingButton.disabled = false;
        this.saveActualButton.disabled = true;

        let clubMemberObjs = this.getClubMemberObjs() 
        
        const updatedClubMemberObjs = clubMemberObjs.map(member => {
            // 기존 객체를 복제하여 업데이트
            const updatedMember = { ...member };
    
            // 속성 업데이트
            if (updatedMember.willAttend && !updatedMember.actualAtt) {
                updatedMember.fakeAttNum = (updatedMember.fakeAttNum || 0) + 1;
                updatedMember.notAttNum = (updatedMember.notAttNum || 0) + 1;
            } else if (updatedMember.actualAtt) {
                updatedMember.attNum = (updatedMember.attNum || 0) + 1;
            } else if (!updatedMember.actualAtt) {
                updatedMember.notAttNum = (updatedMember.notAttNum || 0) + 1;
            }
            updatedMember.willAttend = null;
            updatedMember.actualAtt = null;
    
            // 업데이트된 객체 반환
            return updatedMember;
        });
        localStorage.setItem('attendances' , JSON.stringify(updatedClubMemberObjs));
        this.loadLists();
    }

    truncateName(name) {
        let firstWord = name;
        if(this.isEnglish(name) && name.length > 15){
            const words = name.split(' '); // 이름을 빈칸을 기준으로 나눔
            firstWord = words[0]; // 맨 앞에 있는 단어 저장
            if (firstWord.length > 15) { // 단어가 15자 이상인 경우
                firstWord = firstWord.slice(0, 10) + '...'; // 첫 10자만 유지하고 나머지는 생략
            }
        }
        return firstWord; 
    }

    isEnglish(text) {
        return /^[a-zA-Z]+$/.test(text);
    }
}

const att = new Attandance();

setInterval(() => {
    const willAttend = Math.random() > 0.5;
    const chatText = document.querySelector('#user-messages');
    if(willAttend) {
        chatText.innerHTML =
        `<div class="event"><span class="user-event">Kim</span> Will Attend</div>` 
        + chatText.innerHTML;
    }else {
        chatText.innerHTML =
        `<div class="event"><span class="user-event">Kim</span> Will Not Attend</div>` 
        + chatText.innerHTML;
    }}, 5000);
    
function isMobile() {
    return window.innerWidth <= 800; // 예시로 768px 이하를 모바일로 간주
}

function hideUserDivOnMobile() {
    const usersDiv = document.querySelector('.users');
    if (isMobile()) {
        usersDiv.style.display = 'none'; // 유저 디브 숨김
    } else {
        usersDiv.style.display = 'block'; // 유저 디브 보임
    }
}

