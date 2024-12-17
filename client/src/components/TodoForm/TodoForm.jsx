import React, { useState } from 'react';
import styles from './TodoForm.module.sass';

function TodoForm({ onAddEvent }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === 'date' || name === 'time') setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const eventDateTime = new Date(`${formData.date}T${formData.time}`);
    if (eventDateTime <= new Date()) {
      setError('The date and time are to be announced in the future!');
      return;
    }

    onAddEvent({
      title: formData.title,
      dateTime: eventDateTime.toISOString(),
    });

    setFormData({ title: '', date: '', time: '' });
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
        <input
          className={styles.inputData}
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        
        <input
          className={styles.inputData}
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <button className={styles.addButton} type="submit"></button>

      </div>

    {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

export default TodoForm;
