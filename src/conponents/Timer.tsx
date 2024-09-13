import React, { useState, useEffect } from 'react';

const Timer = () => {
  
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    
    if (seconds <= 0) return;

    
    const intervalId = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds - 1);
    }, 1000);

    
    return () => clearInterval(intervalId);
  }, [seconds]);

  return (
    <div>
      <h1 style={{color:"red", fontSize:"16px", textAlign:"center", fontWeight:"500"}}>Wait for Resend: {seconds} seconds</h1>
    </div>
  );
};

export default Timer;
