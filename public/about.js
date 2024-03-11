
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
    const date = new Date();
    const today = date.toISOString().slice(0, 10);
    date.setDate(date.getDate() - 3); // 3일 전 날짜 계산
    const dateFrom = date.toISOString().slice(0, 10);
    date.setDate(date.getDate() - 7); // 10일 전 날짜 계산
    const dateTo = date.toISOString().slice(0, 10);

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
        console.log(data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

}