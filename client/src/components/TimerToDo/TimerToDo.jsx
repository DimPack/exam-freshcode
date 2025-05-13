import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import styles from './TimerToDo.module.sass';

function Timer({ dateTime, onExpire }) {
  const [timeLeft, setTimeLeft] = useState({});
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const targetDate = new Date(dateTime);
      const difference = targetDate - now;

      if (difference <= 0 && !hasExpired) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        setHasExpired(true);
        onExpire();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days: days < 10 ? `0${days}` : days,
        hours: hours < 10 ? `0${hours}` : hours,
        minutes: minutes < 10 ? `0${minutes}` : minutes,
        seconds: seconds < 10 ? `0${seconds}` : seconds,
      });
    };

    if (!hasExpired) {
      calculateTimeLeft();

      const interval = setInterval(calculateTimeLeft, 1000);

      return () => clearInterval(interval);
    }
  }, [dateTime, hasExpired, onExpire]);

  return (
    <div className={styles.timer}>
      {timeLeft.message ? (
        <p className={styles.message}>{timeLeft.message}</p>
      ) : (
        <div className={styles.time}>
          <div className={styles.date}>
            <span
              className={cx(styles.numbers, { [styles.expire]: hasExpired })}
            >
              {timeLeft.days}
            </span>
            <p>days</p>
          </div>
          <div className={styles.date}>
            <span
              className={cx(styles.numbers, { [styles.expire]: hasExpired })}
            >
              {timeLeft.hours}
            </span>
            <p>hours</p>
          </div>
          <div className={styles.date}>
            <span
              className={cx(styles.numbers, { [styles.expire]: hasExpired })}
            >
              {timeLeft.minutes}
            </span>
            <p>minutes</p>
          </div>
          <div className={styles.date}>
            <span
              className={cx(styles.numbers, { [styles.expire]: hasExpired })}
            >
              {timeLeft.seconds}
            </span>
            <p>seconds</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Timer;