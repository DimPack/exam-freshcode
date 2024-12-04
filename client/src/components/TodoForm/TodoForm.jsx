import React, { useState } from "react";
import styles from "./TodoForm.module.scss";

function TodoForm({ onAddEvent }) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
  });
  const [error, setError] = useState(""); // Для збереження тексту помилки

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "date" || name === "time") setError(""); // Очищуємо помилку при зміні дати чи часу
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Створюємо об'єднаний об'єкт Date із дати та часу
    const eventDateTime = new Date(`${formData.date}T${formData.time}`);
    if (eventDateTime <= new Date()) {
      setError("Дата та час мають бути в майбутньому!");
      return;
    }

    // Передаємо дані на батьківський компонент
    onAddEvent({
      title: formData.title,
      dateTime: eventDateTime.toISOString(),
    });

    // Скидаємо форму
    setFormData({ title: "", date: "", time: "" });
    setError("");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          name="title"
          placeholder="Додайте подію"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <button className={styles.addButton} type="submit"></button>
      </div>


      <div>
        <label>Дата:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Час:</label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
      </div>
      {/* Відображення тексту помилки */}
      {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
    </form>
  );
}

export default TodoForm;
