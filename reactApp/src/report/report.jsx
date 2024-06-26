import React, { useState, useEffect } from 'react';
import './report.css';

export function Report({ userEmail }) {
    const [attendances, setAttendances] = useState([]);

    // Demonstrates calling a service asynchronously so that
    // React can properly update state objects with the results.
    useEffect(() => {
        fetchData();
    }, []);
    async function fetchData() {
        try {
            const response = await fetch('/api/attendances', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email: userEmail }),
            });
            const newAttendances = await response.json();
            // console.log(newAttendances);
            setAttendances(newAttendances);
            // console.log(attendances);
            localStorage.setItem('attendances', JSON.stringify(newAttendances));
            
        } catch (error) {   
            const attendanceText = localStorage.getItem('attendances');
                if (attendanceText) {
                setAttendances(JSON.parse(attendanceText));
            }
        }
    }

    useEffect(() => {
        if(attendances) {
            initializeTable('fakeAttTb');
            initializeTable('attRateTb');
        }
    }, [attendances]);

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
        // console.log(clubMemberObjs);
        clubMemberObjs.forEach((data, index) => {
            addRow(index + 1, data, 'fakeAttTb');
        });
    }

    async function populateAttRateTable() {
        let clubMemberObjs = attendances;
        clubMemberObjs.forEach((data, index) => {
            addRow(index + 1, data, 'attRateTb');
        });
    }

    async function addRow(index, data, tableName) {
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

    return (
        <main>
            <div id="fakeAttendees">
                <div id="fakeAttendeesText">
                    People who voted for present but did not actually attended
                </div>
                <div className="table-container">
                    <table id="fakeAttTb" className="reportTable">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Total</th>
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
                <div className="table-container">
                    <table id = "attRateTb" className="scrollable-list reportTable">
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
