import React from 'react';
import styles from './ReminderPopup.module.sass';

function ReminderPopup({ event, reminderMinutes, onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>Reminder of the event</h3>
        <p className={styles.eventTitle}>{event.title}</p>
        <p className={styles.reminderText}>
          This event will take place in {reminderMinutes} minutes.
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
        <button className={styles.closeButton} onClick={onClose}>
          ok
        </button>
      </div>
    </div>
  );
}

export default ReminderPopup;