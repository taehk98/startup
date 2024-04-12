import React from 'react';

import { Users } from './users';
import { AttdCol } from './attdCol';

export function Attendance(props) {
  return (
    <main>
      <Users userName={props.userName} clubName={props.clubName} userEmail={props.userEmail} />
      <AttdCol userName={props.userName} clubName={props.clubName} userEmail={props.userEmail}/>
    </main>
  );
}
