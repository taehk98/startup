import React, { useState, useEffect } from 'react';

import { GameEvent, GameNotifier } from './notifier';
import './users.css';

export function Users(props) {
  const userName = props.userName;

  const [events, setEvent] = React.useState([]);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    GameNotifier.addHandler(handleGameEvent);

    return () => {
      GameNotifier.removeHandler(handleGameEvent);
    };
  });

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 800);
    }

    handleResize(); // 초기 렌더링 시 실행
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function handleGameEvent(event) {
    setEvent([...events, event]);
  }

  function createMessageArray() {
    const messageArray = [];
    for (const [i, event] of events.entries()) {
      let message = 'unknown';
      if (event.type === GameEvent.WillAttEvent) {
        message = `${event.from} will attend`;
      } else if (event.type === GameEvent.WillNotAttEvent) {
        message = `${event.from} will not attend`;
      } else if (event.type === GameEvent.WillNotAttEvent) {
        message = `${event.from} will not attend`;
      } else if (event.type === GameEvent.WasPresentEvent) {
        message = `${event.from} was present`;
      } else if (event.type === GameEvent.WasNotPresentEvent) {
        message = `${event.from} was not present`;
      } else if (event.type === GameEvent.SaveActualAttdEvent) {
        message = `${event.from} clicked the save actual button`;
      } else if (event.type === GameEvent.System) {
        message = '';
      }

      messageArray.push(
        <div key={i} className='event'>
          <span className={'user-event'}>{event.from}&nbsp;</span>
          {message}
        </div>
      );
    }
    return messageArray;
  }

  return (
    <div className={isMobile ? 'users hidden' : 'users visible'}>
        <div id='user-messages'>
            {createMessageArray()}
        </div>
    </div>
  );
}
