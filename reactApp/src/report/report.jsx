import React from 'react';

import './report.css';

export function Report(props) {
    const { userName, clubName, userEmail } = props;
    const [attendances, setAttendances] = React.useState([]);

    // Demonstrates calling a service asynchronously so that
    // React can properly update state objects with the results.
    React.useEffect(() => {
        fetch('/api/attendances', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(email)})
            .then((response) => response.json())
            .then((attendances) => {
                setAttendances(attendances);
                localStorage.setItem('attendances', JSON.stringify(attendances));
            })
            .catch(() => {
                const attendanceText = localStorage.getItem('attendances');
                if (attendanceText) {
                setAttendances(JSON.parse(attendanceText));
                }
            });
    }, []);

    function initializeTable(tableName) {
        let table = document.getElementById(tableName);
        let tbody = table.querySelector("tbody");
        if (tbody) {
            table.removeChild(tbody);
        }
        if(tableName === 'fakeAttTb'){
            populateFakeAttTable();
        }else if (tableName === 'attRateTb'){
            populateAttRateTable();
        }
    }
    
    async function populateFakeAttTable () {
        let clubMemberObjs = attendances;
        clubMemberObjs.forEach((data, index) => {
            this.addRow(index + 1, data, 'fakeAttTb');
        });
    }

    async function populateAttRateTable() {
        let clubMemberObjs = attendances;
        clubMemberObjs.forEach((data, index) => {
            this.addRow(index + 1, data, 'attRateTb');
        });
    }

    function addRow(index, data, tableName) {
        let table = document.getElementById(tableName);
        let tbody = table.querySelector("tbody");
        if (!tbody) {
            tbody = document.createElement("tbody");
            table.appendChild(tbody);
        }

        let newRow = document.createElement("tr");
        let truncatedName = truncateName(data.name);
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

    function truncateName(name) {
        let firstWord = name;
        if(isEnglish(name) && name.length > 15){
            const words = name.split(' '); // 이름을 빈칸을 기준으로 나눔
            firstWord = words[0]; // 맨 앞에 있는 단어 저장
            if (firstWord.length > 15) { // 단어가 15자 이상인 경우
                firstWord = firstWord.slice(0, 10) + '...'; // 첫 10자만 유지하고 나머지는 생략
            }
        }
        return firstWord; 
    }

    function isEnglish(text) {
        return /^[a-zA-Z]+$/.test(text);
    }
    // Demonstrates rendering an array with React
    const scoreRows = [];
    if (scores.length) {
        for (const [i, score] of scores.entries()) {
        scoreRows.push(
            <tr key={i}>
            <td>{i}</td>
            <td>{score.name.split('@')[0]}</td>
            <td>{score.score}</td>
            <td>{score.date}</td>
            </tr>
        );
        }
    } else {
        scoreRows.push(
        <tr key='0'>
            <td colSpan='4'>Be the first to score</td>
        </tr>
        );
    }

    return (
        <main>
            <div id="fakeAttendees">
                <div id="fakeAttendeesText">
                    People who voted for present but did not actually attended
                </div>
                <div class="table-container">
                    <table id="fakeAttTb">
                        <thead>
                            <tr>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Taehoon</td>
                                <td>2</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>태훈</td>
                                <td>4</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <hr />
            <div id="attdRate">
                <div id="attdRateText">
                    Attendance rate for each member
                </div>
                <div class="table-container">
                    <table id = "attRateTb" class="scrollable-list">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Attend/Total</th>
                                <th>Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Taehoon</td>
                                <td>1/5</td>
                                <td>20 %</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>태훈</td>
                                <td>1/4</td>
                                <td>25 %</td>
                            </tr>
                        </tbody>    
                    </table>
                </div>
                    
            </div>
        </main>
    );
}
