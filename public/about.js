
const apiKey = '75f916f699ad49f79edba73078d9d347'; // 여기에 API 인증 키를 넣어주세요
const date = '2022-03-09';

class About {
    
    constructor() {
        const userNameEl = document.querySelector('.user-name');
        let userName = this.getUserName();
        let truncatedName = this.truncateName(userName);
        userNameEl.textContent = truncatedName;
        const clubNameEl = document.querySelector('.club-name');
        clubNameEl.textContent = this.getClubName().toUpperCase();
        displaySoccerResults();
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

const about = new About();

function displaySoccerResults() {
    fetch(`https://api.football-data.org/v4/competitions/PL/matches`, {
        headers: {
            'X-Auth-Token': apiKey
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        extractData(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    });
}

function getDateFromUTCString(utcString) {
    // UTC 문자열에서 날짜 부분만 추출합니다.
    const datePart = utcString.slice(0, 10);
    return datePart;
}

function extractData(PL) {
    const date = new Date();
    const today = date.toISOString().slice(0, 10);
    date.setDate(date.getDate() - 3); // 3일 전 날짜 계산
    const dateFrom = date.toISOString().slice(0, 10);
    date.setDate(date.getDate() + 7); // 4일 후 날짜 계산
    const dateTo = date.toISOString().slice(0, 10);

    // 테이블 요소 가져오기
    const table = document.getElementById('scores');

    // 7일 동안의 경기 정보를 테이블에 추가
    for (let i = 260; i < PL.matches.length; i++) {
        const matchDate = getDateFromUTCString(PL.matches[i].utcDate);
        if (matchDate >= dateFrom && matchDate <= dateTo) {
            const homeScore = PL.matches[i].score.fullTime.home;
            const awayScore = PL.matches[i].score.fullTime.away;
            
                const homeTeam = PL.matches[i].homeTeam.name;
                const awayTeam = PL.matches[i].awayTeam.name;
                const matchInfo = `${matchDate}-${homeTeam}-${awayTeam}-${homeScore}-${awayScore}`;

                // 이미 추가된 경기인지 확인
                if (!isMatchAlreadyAdded(table, matchInfo)) {
                    // 중복된 경기가 없는 경우 테이블에 추가
                    const row = table.insertRow();
                    const cell1 = row.insertCell();
                    const cell2 = row.insertCell();
                    const cell3 = row.insertCell();

                    // Date/Status 열에 날짜 정보 추가
                    cell1.textContent = matchDate;

                    // Opponents 열에 상대팀 정보 추가
                    cell2.textContent = `${homeTeam} vs ${awayTeam}`;
                if(homeScore !== null && awayScore !== null){
                    // Score 열에 점수 정보 추가
                    cell3.textContent = `${homeScore} - ${awayScore}`;
                }else {
                    cell3.textContent = `Scheduled Matches`;
                }
            }
        }
    }
}

function isMatchAlreadyAdded(table, matchInfo) {
    // 테이블의 모든 행을 확인하여 중복된 정보가 있는지 검사
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const existingMatchInfo = `${row.cells[0].textContent}-${row.cells[1].textContent}-${row.cells[2].textContent}`;
        if (existingMatchInfo === matchInfo) {
            return true; // 중복된 정보가 발견되면 true 반환
        }
    }
    return false; // 중복된 정보가 없으면 false 반환
}
