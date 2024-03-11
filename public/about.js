class About {
    

    constructor() {
        const userNameEl = document.querySelector('.user-name');
        let userName = this.getUserName();
        let truncatedName = this.truncateName(userName);
        userNameEl.textContent = truncatedName;
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
