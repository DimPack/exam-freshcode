import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import styles from './TimerToDo.module.sass';

function Timer({ dateTime, onExpire }) {
  const [timeLeft, setTimeLeft] = useState({});
  const [hasExpired, setHasExpired] = useState(false);
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
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (!hasExpired) {
          setHasExpired(true);
          onExpire();
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [dateTime, onExpire]);

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
      <div className={styles.dateEvent}>
        <div
          className={cx(styles.createdDate, { [styles.expire]: hasExpired })}
        >
          <p className={cx(styles.timeData, { [styles.expire]: hasExpired })}>
            {createdDate.date}
          </p>
          <p className={cx(styles.timeData, { [styles.expire]: hasExpired })}>
            {createdDate.time}
          </p>
        </div>
        <div className={cx(styles.endDate, { [styles.expire]: hasExpired })}>
          <p className={cx(styles.timeData, { [styles.expire]: hasExpired })}>
            {eventDate}
          </p>
          <p className={cx(styles.timeData, { [styles.expire]: hasExpired })}>
            {eventTime}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Timer;
