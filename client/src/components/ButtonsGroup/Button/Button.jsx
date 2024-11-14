import styles from './Button.module.sass';

const Button = ({ index, is, text, recommended, active, setActive }) => {
    const handleItemClick = () => {
        setActive(index);        
      };

  return (
    <div
      className={
        index === active
          ? `${styles.buttonBlock} ${styles.active}`
          : styles.buttonBlock
      }
      data-recommended={recommended ? 'true' : 'false'}
      onClick={handleItemClick}
    >
      <span>{is}</span>
      <p>{text}</p>
    </div>
  );
};

export default Button;
