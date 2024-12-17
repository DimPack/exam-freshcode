import React, { useState, useEffect } from "react";

function Timer({ dateTime }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [createdDate] = useState(new Date().toLocaleString()); // Зберігаємо поточну дату при створенні компонента

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const targetDate = new Date(dateTime);
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft("The time has come!");
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [dateTime]);

  return (
    <div>
      <p>Time before the event: {timeLeft}</p>
      <p>Event created on: {createdDate}</p> {/* Відображаємо дату створення */}
    </div>
  );
}

export default Timer;
