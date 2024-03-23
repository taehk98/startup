
class List {

    constructor() {
        const userNameEl = document.querySelector('.user-name');
        let userName = this.getUserName();
        let truncatedName = this.truncateName(userName);
        userNameEl.textContent = truncatedName;
        const clubNameEl = document.querySelector('.club-name');
        clubNameEl.textContent = this.getClubName().toUpperCase();
        this.initializeTable('fakeAttTb');
        this.initializeTable('attRateTb');
        this.clubMemberObjs = [];
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

    initializeTable(tableName) {
        let table = document.getElementById(tableName);
        let tbody = table.querySelector("tbody");
        if (tbody) {
            table.removeChild(tbody);
        }
        if(tableName === 'fakeAttTb'){
            this.populateFakeAttTable();
        }else if (tableName === 'attRateTb'){
            this.populateAttRateTable();
        }
    }
    
    async populateFakeAttTable () {
        let clubMemberObjs = await this.getClubMemberObjs();
        clubMemberObjs.forEach((data, index) => {
            this.addRow(index + 1, data, 'fakeAttTb');
        });
    }

    async populateAttRateTable() {
        let clubMemberObjs = await this.getClubMemberObjs();
        clubMemberObjs.forEach((data, index) => {
            this.addRow(index + 1, data, 'attRateTb');
        });
    }

    addRow(index, data, tableName) {
        let table = document.getElementById(tableName);
        let tbody = table.querySelector("tbody");
        if (!tbody) {
            tbody = document.createElement("tbody");
            table.appendChild(tbody);
        }

        let newRow = document.createElement("tr");
        let truncatedName = this.truncateName(data.name);
        let fak = data.fakeAttNum ? data.fakeAttNum : 0
        if(tableName === 'fakeAttTb'){
            newRow.innerHTML = `
                <td>${index}</td>
                <td>${truncatedName}</td>
                <td>${fak} Time(s)</td>
            `;
        }else if (tableName === 'attRateTb'){
            let rate = (data.attNum + data.notAttNum) ? (data.attNum / (data.attNum + data.notAttNum) * 100).toFixed(2) : 0;
            let total = data.attNum + data.notAttNum;
            let attend = data.attNum ? data.attNum : 0
            newRow.innerHTML = `
                <td>${index}</td>
                <td>${truncatedName}</td>
                <td>${attend} / ${total}</td>
                <td>${rate} %</td>
            `;
        }
        
        tbody.appendChild(newRow);
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
}


const list = new List();

