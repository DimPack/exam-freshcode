import { useEffect } from 'react';

const CompletedEventsWatcher = ({ onChange }) => {
  useEffect(() => {
    const checkCompleted = () => {
      const events = JSON.parse(localStorage.getItem('events')) || [];
      const count = events.filter(event => event.expired).length;
      onChange(count);
    };

    checkCompleted();
    const interval = setInterval(checkCompleted, 10000);

    return () => clearInterval(interval);
  }, [onChange]);

  return null;
};

export default CompletedEventsWatcher;