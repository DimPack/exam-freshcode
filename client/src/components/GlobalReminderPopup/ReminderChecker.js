import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showReminder } from '../../store/slices/reminderSlice';

const ReminderChecker = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      let events = JSON.parse(localStorage.getItem('events')) || [];
      let updated = false;

      events = events.map(event => {
        const eventDate = new Date(event.dateTime);

        if (!event.expired && now >= eventDate) {
          updated = true;
          return { ...event, expired: true };
        }

        if (
          event.reminderMinutes &&
          !event.expired &&
          !event.reminderShown
        ) {
          const reminderDate = new Date(eventDate.getTime() - event.reminderMinutes * 60000);
          if (now >= reminderDate && now < eventDate) {
            dispatch(showReminder({ event, minutes: event.reminderMinutes }));
            updated = true;
            return { ...event, reminderShown: true };
          }
        }

        return event;
      });

      if (updated) {
        localStorage.setItem('events', JSON.stringify(events));
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
};

export default ReminderChecker;