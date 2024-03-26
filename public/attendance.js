const EndVotingEvent = 'endVoting';
const SaveActualAttdEvent = 'saveActual';
const WillAttEvent = 'willAttEvent';
const WillNotAttEvent = 'willNotAttEvent';
const WasPresentEvent = 'wasPresentEvent';
const WasNotPresentEvent = 'wasNotPresentEvent';

class Attandance {
    currAttendList;
    currAbsentList;
    endVotingButton; 
    saveActualButton; 
    saveActual;
    socket;

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

        this.configureWebSocket();
    }

    async handlePresentCheck() {
        const presentCheckbox = document.getElementById('Present');
        const absentCheckbox = document.getElementById('notPresent');

        if (presentCheckbox.checked) {
            absentCheckbox.checked = false;
            await this.checkedAttend();
        }
        else {
            // absentCheckbox.checked = true;
            // await this.checkedAbsent();
        }
    }

    async handleAbsentCheck() {
        const presentCheckbox = document.getElementById('Present');
        const absentCheckbox = document.getElementById('notPresent');

        if (absentCheckbox.checked) {
            presentCheckbox.checked = false;
            await this.checkedAbsent();
        }else{
            // presentCheckbox.checked = true;
            // await this.checkedAttend();
        }
    }

    getUserName() {
        return localStorage.getItem('userName') ?? 'Mystery User';
    }

    getClubName() {
        return localStorage.getItem('clubName') ?? 'Mystery Club';
    }

    getUserEmail() {
        return localStorage.getItem('userEmail') ?? 'Mystery Email';
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
    }

    saveVoting() {
        let checkboxElements = document.querySelectorAll("input");

        checkboxElements.forEach(function(element){
            if (!element.disabled) {
                element.disabled = true;
            }
        });
    }

    async getClubMemberObjs() {
        try {
            let attendances = await this.loadAttendances(); // await 키워드 추가
            const clubName = this.getClubName();
            let clubMemberObjs = [];
    
            if (clubName !== 'Mystery Club') {
                if (Array.isArray(attendances)) {
                    clubMemberObjs = attendances.filter(obj => obj.club === clubName);
                } else {
                    console.log(attendances);
                }
            }
            return clubMemberObjs;
        } catch (error) {
            console.error(error); // 오류 처리
        }
    }
    
    async checkedAttend() {
        const userName = this.getUserName();
        const userEmail = this.getUserEmail();
        await this.saveAttend(true);
        // await this.loadLists();
        this.updateName(true, userName);
        if(this.saveActual){
            this.broadcastEvent(userName, userEmail, WasPresentEvent);
        }
        else {
            this.broadcastEvent(userName, userEmail, WillAttEvent);
        }
    }
       
        

    async checkedAbsent() {
        const userName = this.getUserName();
        const userEmail = this.getUserEmail();
        await this.saveAttend(false);
        // await this.loadLists();
        this.updateName(false, userName);
        if(this.saveActual){
            this.broadcastEvent(userName, userEmail, WasNotPresentEvent);
        }
        else {
            this.broadcastEvent(userName, userEmail, WillNotAttEvent);
        }
    }

    async saveAttend(att) {
        const userName = this.getUserName();
        const clubName = this.getClubName();
        let attendances = await this.loadAttendances();

        let currObj = attendances.filter(obj => obj.name === userName)[0];
        await this.updateAttendances(userName, clubName, att, currObj);
    }



    // 아마 현재 참석 횟수 , 불참 횟수, 참석하기로하고 불참 횟수 추가해야함
    async updateAttendances(userName, clubName, att,  currObj) {
        let newAttendance;
        if(this.saveActual){
            newAttendance = {
                name: userName ,
                club: clubName ,
                willAttend: currObj.willAttend,
                actualAtt: att,
                attNum: currObj.attNum,
                notAttNum: currObj.notAttNum,
                fakeAttNum: currObj.fakeAttNum,
                password: currObj.password,
                email: currObj.email,
                token: currObj.token
            };
        }else{
            newAttendance = {
                name: userName,
                club: clubName, 
                willAttend: att, 
                actualAtt: currObj.actualAtt, 
                attNum: currObj.attNum, 
                notAttNum: currObj.notAttNum,
                fakeAttNum: currObj.fakeAttNum,
                password: currObj.password,
                email: currObj.email,
                token: currObj.token
            };
            console.log(newAttendance);
        }

        try {
            const response = await fetch('/api/save-attendance', {
              method: 'POST',
              headers: {'content-type': 'application/json'},
              body: JSON.stringify(newAttendance),
            });
      
            // Store what the service gave us as the high scores
            const attendances = await response.json();
            localStorage.setItem('attendances', JSON.stringify(attendances));
          } catch {
            // If there was an error then just track scores locally
            this.updateAttendancesLocal(newAttendance);
          }
    }

    async loadLists() {
        let clubMemberObjs = await this.loadAttendances();
        if(clubMemberObjs !== null){
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

    async endVoting () {
        await this.toggleCheckBoxTexts();
        const userEmail = this.getUserEmail();
        const userName = this.getUserName();
        let clubMemberObjs = await this.getClubMemberObjs();
        
        const updatedClubMemberObjs = clubMemberObjs.map(member => {
            // 기존 객체를 복제하여 업데이트
            const updatedMember = { ...member };
    
            // 속성 업데이트         
            updatedMember.actualAtt = updatedMember.willAttend;
    
            // 업데이트된 객체 반환
            return updatedMember;
        });
        try {
            const response = await fetch('/api/replace-attendances', {
              method: 'POST',
              headers: {'content-type': 'application/json'},
              body: JSON.stringify(updatedClubMemberObjs),
            });
            
            this.broadcastEvent(userName, userEmail, EndVotingEvent);

            // Store what the service gave us as the high scores
            const attendances = await response.json();
            localStorage.setItem('attendances', JSON.stringify(attendances));
          } catch {
            // If there was an error then just track scores locally
            localStorage.setItem('attendances', JSON.stringify(updatedClubMemberObjs));
          }
        
        this.loadLists();
    }

    async toggleCheckBoxTexts() {
        const PresentTxtEl = document.getElementById("Present-text");
        const NotPresentTxtEl = document.getElementById("NotPresent-text");
        if(this.saveActual) {
            PresentTxtEl.textContent = "Will Present";
            PresentTxtEl.style.paddingLeft = "13.465px";
            PresentTxtEl.style.paddingRight = "13.465px";
            NotPresentTxtEl.textContent = "Will Not Present";
            this.endVotingButton.disabled = false;
            this.saveActualButton.disabled = true;
            this.saveActual = false;
        }else {
            PresentTxtEl.textContent = "Was Present";
            PresentTxtEl.style.paddingLeft = "15.76px";
            PresentTxtEl.style.paddingRight = "15.76px";
            NotPresentTxtEl.textContent = "Was Not Present";
            this.endVotingButton.disabled = true;
            this.saveActualButton.disabled = false;
            this.saveActual = true;
        }
        
    }

    async saveActualVoting() {
        await this.toggleCheckBoxTexts();
        const userEmail = this.getUserEmail();
        const userName = this.getUserName();
        let clubMemberObjs = await this.getClubMemberObjs() ;
        
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
        try {
            const response = await fetch('/api/replace-attendances', {
              method: 'POST',
              headers: {'content-type': 'application/json'},
              body: JSON.stringify(updatedClubMemberObjs),
            });
            
            this.broadcastEvent(userName, userEmail, SaveActualAttdEvent);
            // Store what the service gave us as the high scores
            const attendances = await response.json();
            localStorage.setItem('attendances', JSON.stringify(attendances));
          } catch {
            // If there was an error then just track scores locally
            localStorage.setItem('attendances', JSON.stringify(updatedClubMemberObjs));
          }
        this.loadLists();
        const presentCheckbox = document.getElementById('Present');
        const absentCheckbox = document.getElementById('notPresent');
        absentCheckbox.checked = true;
        presentCheckbox.checked = false;
    }

    truncateName(name) {
        let firstWord = name;
        if(name != null && this.isEnglish(name) && name.length > 15){
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

    updateName(att, userName) {
        const attendList = document.getElementById('attendList');
        const absentList = document.getElementById('absentList');
        const nameToRemove = this.truncateName(userName);
        if(att){
            this.currAbsentList = this.currAbsentList.filter(name => name !== userName);
            const listItemToRemove = [...absentList.querySelectorAll('li.list-group-item')]
                .find(li => li.textContent.trim() === nameToRemove);
            if (listItemToRemove) {
                listItemToRemove.remove();
            }
            const ItemToRemove = [...attendList.querySelectorAll('li.list-group-item')]
                .find(li => li.textContent.trim() === nameToRemove);
            if (ItemToRemove) {
                ItemToRemove.remove();
            }
    
            const listItem = document.createElement('li');
            listItem.textContent = this.truncateName(userName);
            listItem.setAttribute('data-name', userName);
            listItem.classList.add('list-group-item');
            attendList.appendChild(listItem);
            this.currAttendList.push(userName);
        } else {
            this.currAttendList = this.currAttendList.filter(name => name !== userName);
            const ItemToRemove = [...attendList.querySelectorAll('li.list-group-item')]
                .find(li => li.textContent.trim() === nameToRemove);
            if (ItemToRemove) {
                ItemToRemove.remove();
            }
            const listItemToRemove = [...absentList.querySelectorAll('li.list-group-item')]
                .find(li => li.textContent.trim() === nameToRemove);
            if (listItemToRemove) {
                listItemToRemove.remove();
            }
    
            const listItem = document.createElement('li');
            listItem.textContent = this.truncateName(userName);
            listItem.setAttribute('data-name', userName);
            listItem.classList.add('list-group-item');
            absentList.appendChild(listItem);
            this.currAbsentList.push(userName);
        }
    }


    async loadAttendances() {
        let attendances = [];
        const email = {
            email: this.getUserEmail()
        }
        try {
            const response = await fetch('/api/attendances', {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(email),
            });
          // Get the latest high scores from the service

          attendances = await response.json();
      
          // Save the scores in case we go offline in the future
          localStorage.setItem('attendances', JSON.stringify(attendances));
        } catch {
          // If there was an error then just use the last saved scores
          const attendancesText = localStorage.getItem('attendances');
          if (attendancesText) {
            attendances = JSON.parse(attendancesText);
          }
        }
        return attendances;
    }

    updateAttendancesLocal(newAttendance) {
        let attendances = [];
        const attendancesText = localStorage.getItem('attendances');
        if (attendancesText) {
            attendances = JSON.parse(attendancesText);
        }
    
        let found = false;
        for (let i = 0; i < attendances.length; i++) {
            let user = attendances[i];
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

    // Functionality for peer communication using WebSocket

    configureWebSocket() {
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
        this.socket.onopen = (event) => {
            this.displayMsg('system', 'game', 'connected');
        };
        this.socket.onclose = (event) => {
            this.displayMsg('system', 'game', 'disconnected');
        };
        this.socket.onmessage = async (event) => {
            const msg = JSON.parse(await event.data.text());
            if (msg.type === WillAttEvent) {
                this.displayMsg('user', msg.from, `will attend`);
            } else if (msg.type === WillNotAttEvent) {
                this.displayMsg('user', msg.from, `will not attend`);
            } else if (msg.type === WasPresentEvent) {
                this.displayMsg('user', msg.from, `was present`);
            } else if (msg.type === WasNotPresentEvent) {
                this.displayMsg('user', msg.from, `was not present`);
            } else if (msg.type === EndVotingEvent) {
                this.displayMsg('system', msg.from, 'clicked end voting');
                this.toggleCheckBoxTexts();
            } else if (msg.type === SaveActualAttdEvent) {
                this.displayMsg('system', msg.from, `clicked the save actual button`);
                this.toggleCheckBoxTexts();
            }
            this.loadLists();
        };
    }

    displayMsg(cls, from, msg) {
        const chatText = document.querySelector('#user-messages');
        chatText.innerHTML =
          `<div class="event"><span class="${cls}-event">${from}</span> ${msg}</div>` + chatText.innerHTML;
    }
    
    broadcastEvent(from, email, type) {
        const event = {
          from: from,
          email: email,
          type: type,
        };
        this.socket.send(JSON.stringify(event));
      }
    
}   

const att = new Attandance();


// setInterval(() => {
//     const willAttend = Math.random() > 0.5;
//     const chatText = document.querySelector('#user-messages');
//     if(willAttend) {
//         chatText.innerHTML =
//         `<div class="event"><span class="user-event">Kim</span> Will Attend</div>` 
//         + chatText.innerHTML;
//     }else {
//         chatText.innerHTML =
//         `<div class="event"><span class="user-event">Kim</span> Will Not Attend</div>` 
//         + chatText.innerHTML;
//     }}, 5000);
    
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
