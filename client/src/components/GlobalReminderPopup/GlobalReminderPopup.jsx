import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearActiveReminder } from '../../store/slices/reminderSlice';
import styles from './ReminderPopup.module.sass';

const GlobalReminderPopup = () => {
  const dispatch = useDispatch();
  const { activeReminder } = useSelector(state => state.reminder);
  
  useEffect(() => {
    if (activeReminder) {
      const bellSound = new Audio('/sounds/callBell.mp3');
      bellSound.play().catch(err => console.error('Audio playback error:', err));
    }
  }, [activeReminder]);
  
  if (!activeReminder) return null;
  
  const { event, minutes } = activeReminder;
  
  const handleClose = () => {
    dispatch(clearActiveReminder());
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>Event reminder</h3>
        <p className={styles.eventTitle}>{event.title}</p>
        <p className={styles.reminderText}>
          This event will occur in {minutes} minute.
        </p>
        <p className={styles.dateTime}>
          {new Date(event.dateTime).toLocaleString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        <button className={styles.closeButton} onClick={handleClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default GlobalReminderPopup;