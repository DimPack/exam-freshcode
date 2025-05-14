import React, { useState } from 'react';
import styles from './TodoForm.module.sass';

function TodoForm({ onAddEvent }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    reminder: '', // Додаємо поле для нагадування
  });
  const [error, setError] = useState('');

  // Опції для попередження
  const reminderOptions = [
    { value: '', label: 'not remind' },
    { value: '1', label: '1 minute' },
    { value: '5', label: '5 minute' },
    { value: '10', label: '10 minute' },
    { value: '30', label: '30 minute' },
    { value: '60', label: '60 minute' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'date' && value) {
      const [year, month, day] = value.split('-');
      const europeanDate = `${day}.${month}.${year}`;
      setFormData({
        ...formData,
        [name]: europeanDate,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (name === 'date' || name === 'time') setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const [day, month, year] = formData.date.split('.');
    const formattedDate = new Date(`${year}-${month}-${day}T${formData.time}`);

    if (formattedDate <= new Date()) {
      setError('The date and time are to be announced in the future!');
      return;
    }

    onAddEvent({
      title: formData.title,
      dateTime: formattedDate.toISOString(),
      reminderMinutes: formData.reminder
        ? parseInt(formData.reminder, 10)
        : null, // Додаємо час попередження
    });

    setFormData({ title: '', date: '', time: '', reminder: '' });
    setError('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.inputMain}
        type="text"
        name="title"
        placeholder="add Event"
        value={formData.title}
        onChange={handleChange}
        maxLength={100}
        required
      />
      <div className={styles.dateAndTimeContainer}>
        <div className={styles.dateAndTime}>
          <input
            className={styles.inputData}
            type="date"
            name="date"
            value={formData.date.split('.').reverse().join('-') || ''}
            onChange={handleChange}
            required
          />

          <div className={styles.timeAndReminder}>
            <input
              className={styles.inputData}
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />

            <div className={styles.selectContainer}>
              <select
                className={styles.reminderSelect}
                name="reminder"
                value={formData.reminder}
                onChange={handleChange}
              >
                {reminderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button className={styles.addButton} type="submit"></button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

export default TodoForm;
