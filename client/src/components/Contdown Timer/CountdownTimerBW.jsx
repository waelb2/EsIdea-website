import React, { useState, useEffect } from 'react';

const CountdownTimerBW = ({ initialMinutes, initialSeconds, onCountdownEnd, countdownEnded }) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    let timer;
    if (!countdownEnded) {
      timer = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prevSeconds => prevSeconds - 1);
        } else if (minutes > 0) {
          setMinutes(prevMinutes => prevMinutes - 1);
          setSeconds(59);
        } else {
          clearInterval(timer);
          setMinutes(initialMinutes);
          setSeconds(initialSeconds);
          onCountdownEnd();
        }
      }, 1000);
    } else {
      setMinutes(0);
      setSeconds(0);
    }

    return () => clearInterval(timer);
  }, [minutes, seconds, countdownEnded]);

  return (
    <div>
      {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
};

export default CountdownTimerBW; 
