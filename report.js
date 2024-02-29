
class List {

    constructor() {
        const userNameEl = document.querySelector('.user-name');
        userNameEl.textContent = this.getUserName();
        const clubNameEl = document.querySelector('.club-name');
        clubNameEl.textContent = this.getClubName().toUpperCase();
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

    initializeFakeAttTable() {
        var table = document.getElementById("fakeAttTb");
        var tbody = table.querySelector("tbody");
        if (tbody) {
            table.removeChild(tbody);
        }
        populateTable();
    }
    
    populateFakeAttTable () {
        let attendances = this.getClubMemberObjs();

        attendances.forEach(data => {
            addRow(data.name, data.fakeAtt);
        });
    }

}


const list = new List();