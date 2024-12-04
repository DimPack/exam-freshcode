import React, { useState, useEffect } from "react";

function Timer({ dateTime }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const targetDate = new Date(dateTime);
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft("Час настав!");
        clearInterval(interval);
        alert(`Подія "${dateTime}" розпочалася!`);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${days}д ${hours}г ${minutes}хв ${seconds}с`);
      }
    };

    calculateTimeLeft(); // Розрахунок одразу після рендера
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval); // Очищення таймера при демонтажі компонента
  }, [dateTime]);

  return <p>Час до події: {timeLeft}</p>;
}

export default Timer;
