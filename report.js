class List {

    constructor() {
        const userNameEl = document.querySelector('.user-name');
        userNameEl.textContent = this.getUserName();
    }

getUserName() {
    return localStorage.getItem('userName') ?? 'Mystery User';
}

}


const list = new List();