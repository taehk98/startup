import React, { useEffect, useState } from 'react';
import './matches.css';

export function Matches() {
    const [error, setError] = useState(null);

    useEffect(() => {
        displaySoccerResults();
    }, []);

    async function displaySoccerResults() {
        try {
            const response = await fetch(`/soccer-results`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            extractData(data);
        } catch (error) {
            setError(error);
        }
    }

    function extractData(PL) {
        const date = new Date();
        const today = date.toISOString().slice(0, 10);
        date.setDate(date.getDate() - 7); 
        const dateFrom = date.toISOString().slice(0, 10);
        date.setDate(date.getDate() + 14); 
        const dateTo = date.toISOString().slice(0, 10);
        // 테이블 요소 가져오기
        const table = document.getElementById('scores');
    
        // 7일 동안의 경기 정보를 테이블에 추가
        for (let i = 260; i < PL.matches.length; i++) {
            const matchDate = getDateFromUTCString(PL.matches[i].utcDate);
            if (matchDate >= dateFrom && matchDate <= dateTo) {
                const homeScore = PL.matches[i].score.fullTime.home;
                const awayScore = PL.matches[i].score.fullTime.away;
                const utcDate = new Date(PL.matches[i].utcDate);
                const hours = utcDate.getHours();
                const minutes = utcDate.getMinutes();
                const formattedHours = String(hours).padStart(2, '0');
                const formattedMinutes = String(minutes).padStart(2, '0');
    
    
                    const homeTeam = PL.matches[i].homeTeam.name;
                    const awayTeam = PL.matches[i].awayTeam.name;
                    const matchInfo = `${matchDate} ${formattedHours}:${formattedMinutes}-${homeTeam}-${awayTeam}-${homeScore}-${awayScore}`;
    
                    // 이미 추가된 경기인지 확인
                    if (!isMatchAlreadyAdded(table, matchInfo)) {
                        // 중복된 경기가 없는 경우 테이블에 추가
                        const row = table.insertRow();
                        const cell1 = row.insertCell();
                        const cell2 = row.insertCell();
                        const cell3 = row.insertCell();
    
                        // Date/Status 열에 날짜 정보 추가
                        cell1.textContent = `${matchDate} ${formattedHours}:${formattedMinutes}`;
    
                        // Opponents 열에 상대팀 정보 추가
                        cell2.textContent = `${homeTeam} vs ${awayTeam}`;
                    if(homeScore !== null && awayScore !== null){
                        // Score 열에 점수 정보 추가
                        cell3.textContent = `${homeScore} - ${awayScore}`;
                    }else if (PL.matches[i].status == "POSTPONED"){
                        cell3.textContent = `POSTPONED`;
                    }
                    else {
                        cell3.textContent = `TIMED`;
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

    function getDateFromUTCString(utcString) {
        // UTC 문자열에서 날짜 부분만 추출합니다.
        const datePart = utcString.slice(0, 10);
        return datePart;
    }

    return (
        <main>
            {error && (
                <div className="error">
                    There was a problem with the fetch operation: {error.message}
                </div>
            )}
            <table id="scores" className="matches">
                <thead className="scoresheader">
                    <tr>
                        <th>Date/Status</th>
                        <th>Opponents</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {/* 여기에 데이터가 들어갈 부분 */}
                </tbody>
            </table>   
            <div className="p">
                I always believe in myself. Even when things are tough, I work hard and try to improve every day. 
                <p>- Son Heung Min</p>
            </div>
    </main>
    );
}
