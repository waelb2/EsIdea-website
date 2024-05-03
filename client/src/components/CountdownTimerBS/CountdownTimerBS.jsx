import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ initialMinutes, initialSeconds, onCountdownEnd }) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    let timer;
    if (minutes > 0 || seconds > 0) {
      timer = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prevSeconds => prevSeconds - 1);
        } else if (minutes > 0) {
          setMinutes(prevMinutes => prevMinutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else {
      clearInterval(timer);
      onCountdownEnd();
    }

    return () => clearInterval(timer);
  }, [minutes, seconds, onCountdownEnd]);

  return (
    <div>
      {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
};

export default CountdownTimer;
