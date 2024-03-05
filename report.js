
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
    
    populateFakeAttTable () {
        let attendances = this.getClubMemberObjs();

        attendances.forEach((data, index) => {
            this.addRow(index + 1, data, 'fakeAttTb');
        });
    }

    populateAttRateTable() {
        let attendances = this.getClubMemberObjs();

        attendances.forEach((data, index) => {
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
        if(tableName === 'fakeAttTb'){
            newRow.innerHTML = `
                <td>${index}</td>
                <td>${truncatedName}</td>
                <td>${data.fakeAttNum} Time(s)</td>
            `;
        }else if (tableName === 'attRateTb'){
            let rate = (data.attNum + data.notAttNum) ? (data.attNum / (data.attNum + data.notAttNum) * 100).toFixed(2) : 0;
            let total = data.attNum + data.notAttNum;
            newRow.innerHTML = `
                <td>${index}</td>
                <td>${truncatedName}</td>
                <td>${data.attNum} / ${total}</td>
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
    
}


const list = new List();
