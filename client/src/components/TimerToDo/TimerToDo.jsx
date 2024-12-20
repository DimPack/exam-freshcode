import React, { useState, useEffect } from 'react';
import styles from './TimerToDo.module.sass'; // Підключення стилів

function Timer({ dateTime }) {
  const [timeLeft, setTimeLeft] = useState({});
  const [createdDate] = useState(() => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('en-GB').replace(/\//g, '.'),
      time: now.toLocaleTimeString('en-GB', { hour12: false }),
    };
  });

  const formattedEventDate = new Date(dateTime);
  const eventDate = formattedEventDate
    .toLocaleDateString('en-GB')
    .replace(/\//g, '.');
  const eventTime = formattedEventDate.toLocaleTimeString('en-GB', {
    hour12: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const targetDate = new Date(dateTime);
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ message: 'The time has come!' });
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [dateTime]);

  return (
    <div className={styles.timer}>
      {timeLeft.message ? (
        <p className={styles.message}>{timeLeft.message}</p>
      ) : (
        <div className={styles.time}>
          <div className={styles.date}>
            <span>{timeLeft.days}</span>
            <p>days</p>
          </div>
          <div className={styles.date}>
            <span>{timeLeft.hours}</span>
            <p>hours</p>
          </div>
          <div className={styles.date}>
            <span>{timeLeft.minutes}</span>
            <p>minutes</p>
          </div>
          <div className={styles.date}>
            <span>{timeLeft.seconds}</span>
            <p>seconds</p>
          </div>
        </div>
      )}
      <div className={styles.dateEvent}>
        <div className={styles.createdDate}>
          <p className={styles.timeData}>{createdDate.date}</p>
          <p className={styles.timeData}>{createdDate.time}</p>
        </div>
        <div className={styles.endDate}>
          <p className={styles.timeData}>{eventDate}</p>
          <p className={styles.timeData}>{eventTime}</p>
        </div>
      </div>
    </div>
  );
}

export default Timer;
