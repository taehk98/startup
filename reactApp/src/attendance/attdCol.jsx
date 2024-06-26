import React, { useState, useEffect } from 'react';

import { Button } from 'react-bootstrap';
import { GameEvent, GameNotifier } from './notifier';
import './attdCol.css';

export function AttdCol(props) {
    const { userName, clubName, userEmail } = props;
    const [currAttendList, setCurrAttendList] = React.useState([]);
    const [currAbsentList, setCurrAbsentList] = React.useState([]);
    const [clubMemberObjs, setClubMemberObjs] = React.useState([]);
    const [saveActual, setSaveActual] = useState(false);
    const [endVotingDisabled, setEndVotingDisabled] = useState(false);
    const [saveActualDisabled, setSaveActualDisabled] = useState(true);
    const [updated, setUpdatedNotif] = useState(false);
    
    useEffect(() => {
        fetchData();
    }, [updated]);

    async function fetchData() {
        try {
            const response = await fetch('/api/attendances', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email: userEmail }),
            });
            const data = await response.json();
            const newAttendList = data
                .filter(member => (saveActual ? member.actualAtt : member.willAttend))
                .map(member => member.name);
            const newAbsentList = data
                .filter(member => (saveActual ? !member.actualAtt : !member.willAttend))
                .map(member => member.name);

            localStorage.setItem('attendances', JSON.stringify(data));
            setCurrAttendList(newAttendList);
            setCurrAbsentList(newAbsentList);
            setClubMemberObjs(data);
        } catch (error) {   
        }
    }

    async function handlePresentCheck() {
        const presentCheckbox = document.getElementById('Present');
        const absentCheckbox = document.getElementById('notPresent');

        if (presentCheckbox.checked) {
            absentCheckbox.checked = false;
            await checkedAttend();
        }
    }

    async function handleAbsentCheck() {
        const presentCheckbox = document.getElementById('Present');
        const absentCheckbox = document.getElementById('notPresent');

        if (absentCheckbox.checked) {
            presentCheckbox.checked = false;
            await checkedAbsent();
        }
    }

    async function checkedAttend() {
        await saveAttend(true);

        if(saveActual){
            GameNotifier.broadcastEvent(userName, userEmail, GameEvent.WasPresentEvent);
        }
        else {
            GameNotifier.broadcastEvent(userName, userEmail, GameEvent.WillAttEvent);
        }
    }

    async function checkedAbsent() {
        await saveAttend(false);

        if(saveActual){
            GameNotifier.broadcastEvent(userName, userEmail, GameEvent.WasNotPresentEvent);
        }
        else {
            GameNotifier.broadcastEvent(userName, userEmail, GameEvent.WillNotAttEvent);
        }
    }

    async function saveAttend(att) {
        let attendances = clubMemberObjs;
        let currObj = attendances.filter(obj => obj.name === userName)[0];
        await updateAttendances(userName, clubName, att, currObj);
    }

    // 아마 현재 참석 횟수 , 불참 횟수, 참석하기로하고 불참 횟수 추가해야함
    async function updateAttendances(userName, clubName, att,  currObj) {
        let newAttendance;
        if(saveActual){
            newAttendance = {
                name: userName ,
                club: clubName ,
                willAttend: currObj.willAttend,
                actualAtt: att,
                attNum: currObj.attNum,
                notAttNum: currObj.notAttNum,
                fakeAttNum: currObj.fakeAttNum,
                password: currObj.password,
                email: currObj.email,
                token: currObj.token
            };
        }else{
            newAttendance = {
                name: userName,
                club: clubName, 
                willAttend: att, 
                actualAtt: currObj.actualAtt, 
                attNum: currObj.attNum, 
                notAttNum: currObj.notAttNum,
                fakeAttNum: currObj.fakeAttNum,
                password: currObj.password,
                email: currObj.email,
                token: currObj.token
            };
        }

        try {
            const response = await fetch('/api/save-attendance', {
              method: 'POST',
              headers: {'content-type': 'application/json'},
              body: JSON.stringify(newAttendance),
            });
      
            // Store what the service gave us as the high scores
            const attendances = await response.json();
            localStorage.setItem('attendances', JSON.stringify(attendances));
          } catch {
            // If there was an error then just track scores locally
            updateAttendancesLocal(newAttendance);
          }
          setUpdatedNotif(!updated);
    }

    async function endVoting () {
        await toggleCheckBoxTexts();
        let newClubMemberObjs = clubMemberObjs;
        
        const updatedClubMemberObjs = newClubMemberObjs.map(member => {
            // 기존 객체를 복제하여 업데이트
            const updatedMember = { ...member };
    
            // 속성 업데이트         
            updatedMember.actualAtt = updatedMember.willAttend;
    
            // 업데이트된 객체 반환
            return updatedMember;
        });
        try {
            const response = await fetch('/api/replace-attendances', {
              method: 'POST',
              headers: {'content-type': 'application/json'},
              body: JSON.stringify(updatedClubMemberObjs),
            });
            
            GameNotifier.broadcastEvent(userName, userEmail, EndVotingEvent);

            // Store what the service gave us as the high scores
            const attendances = await response.json();
            localStorage.setItem('attendances', JSON.stringify(attendances));
          } catch {
            // If there was an error then just track scores locally
            localStorage.setItem('attendances', JSON.stringify(updatedClubMemberObjs));
          }
        toggleCheckBoxTexts();
        setUpdatedNotif(!updated);
    }

    async function toggleCheckBoxTexts() {
        const PresentTxtEl = document.getElementById("Present-text");
        const NotPresentTxtEl = document.getElementById("NotPresent-text");
        if(saveActual) {
            PresentTxtEl.textContent = "Will Present";
            PresentTxtEl.style.paddingLeft = "13.465px";
            PresentTxtEl.style.paddingRight = "13.465px";
            NotPresentTxtEl.textContent = "Will Not Present";
            setEndVotingDisabled(false);
            setSaveActualDisabled(true);
            setSaveActual(false);
        }else {
            PresentTxtEl.textContent = "Was Present";
            PresentTxtEl.style.paddingLeft = "15.76px";
            PresentTxtEl.style.paddingRight = "15.76px";
            NotPresentTxtEl.textContent = "Was Not Present";
            setEndVotingDisabled(true);
            setSaveActualDisabled(false);
            setSaveActual(true);
        }
    }

    async function saveActualVoting() {
        await toggleCheckBoxTexts();
        let newClubMemberObjs = clubMemberObjs;
        
        const updatedClubMemberObjs = newClubMemberObjs.map(member => {
            // 기존 객체를 복제하여 업데이트
            const updatedMember = { ...member };
    
            // 속성 업데이트
            if (updatedMember.willAttend && !updatedMember.actualAtt) {
                updatedMember.fakeAttNum = (updatedMember.fakeAttNum || 0) + 1;
                updatedMember.notAttNum = (updatedMember.notAttNum || 0) + 1;
            } else if (updatedMember.actualAtt) {
                updatedMember.attNum = (updatedMember.attNum || 0) + 1;
            } else if (!updatedMember.actualAtt) {
                updatedMember.notAttNum = (updatedMember.notAttNum || 0) + 1;
            }
            updatedMember.willAttend = null;
            updatedMember.actualAtt = null;
    
            // 업데이트된 객체 반환
            return updatedMember;
        });
        try {
            const response = await fetch('/api/replace-attendances', {
              method: 'POST',
              headers: {'content-type': 'application/json'},
              body: JSON.stringify(updatedClubMemberObjs),
            });
            
            GameNotifierme.broadcastEvent(userName, userEmail, SaveActualAttdEvent);
            // Store what the service gave us as the high scores
            const attendances = await response.json();
            localStorage.setItem('attendances', JSON.stringify(attendances));
          } catch {
            // If there was an error then just track scores locally
            localStorage.setItem('attendances', JSON.stringify(updatedClubMemberObjs));
          }
        toggleCheckBoxTexts();
        setUpdatedNotif(!updated);
        const presentCheckbox = document.getElementById('Present');
        const absentCheckbox = document.getElementById('notPresent');
        absentCheckbox.checked = true;
        presentCheckbox.checked = false;
        
    }

    const truncateName = (name) => {
        let firstWord = name;
        if(name != null && isEnglish(name) && name.length > 15){
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

    function updateAttendancesLocal(newAttendance) {
        let attendances = [];
        const attendancesText = localStorage.getItem('attendances');
        if (attendancesText) {
            attendances = JSON.parse(attendancesText);
        }
    
        let found = false;
        for (let i = 0; i < attendances.length; i++) {
            let user = attendances[i];
            if (user.name == newAttendance.name && user.club == newAttendance.club) {
                attendances[i] = newAttendance;
                found = true;
                break;
            }
        }
    
        if (!found) {
            attendances.push(newAttendance);
        }
    
        localStorage.setItem('attendances', JSON.stringify(attendances));
    }

    return (
        <div>
        <div className="two-column-list">
          <div id="column">
            <label id="Present-text">Will Present</label>
            <input type="checkbox" id="Present" name="Present" onChange={handlePresentCheck} />
            <br />
            <ol id="attendList" className="list-group list-group-numbered scrollable-list">
              {/* Attendee list items will be rendered here */}
              {currAttendList.map((name, index) => (
                <li key={index} className="list-group-item">
                    {truncateName(name)}
                </li>
                ))}
            </ol>
          </div>
          <br />
          <div id="column">
            <label id="NotPresent-text">Will Not Present</label>
            <input type="checkbox" id="notPresent" name="notPresent" onChange={handleAbsentCheck} />
            <br />
            <ol id="absentList" className="list-group list-group-numbered scrollable-list">
              {/* Absentee list items will be rendered here */}
              {currAbsentList.map((name, index) => (
                <li key={index} className="list-group-item">
                    {truncateName(name)}
                </li>
                ))}
            </ol>
          </div>
        </div>
        <br />
    
        <div className="buttons">
          <Button type="button"
            className="btn btn-primary"
            variant="primary" 
            id="SaveActualButton" 
            onClick={saveActualVoting} 
            disabled={saveActualDisabled}>Save Actual Attendance Records</Button>
          <Button type="button" className="btn btn-primary" variant="primary" id="endButton" onClick={endVoting} disabled={endVotingDisabled}>End Voting</Button>
        </div>
        <br />
      </div>
    );
}   