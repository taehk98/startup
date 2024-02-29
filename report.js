
class List {
    

    constructor() {
        const userNameEl = document.querySelector('.user-name');
        userNameEl.textContent = this.getUserName();
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
        if(tableName === 'fakeAttTb'){
            newRow.innerHTML = `
                <th>${index}</th>
                <th>${data.name}</th>
                <th>${data.fakeAttNum} Time(s)</th>
            `;
        }else if (tableName === 'attRateTb'){
            let rate = data.attNum / (data.attNum + data.notAttNum) * 100;
            let total = data.attNum + data.notAttNum;
            newRow.innerHTML = `
                <th>${index}</th>
                <th>${data.name}</th>
                <th>${data.attNum}/${total}</th>
                <th>${rate} %</th>
            `;
        }
        
        tbody.appendChild(newRow);
    }


    
}


const list = new List();
