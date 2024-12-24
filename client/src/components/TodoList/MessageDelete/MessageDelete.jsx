import styles from './MessageDelete.module.sass';

function MessageDelete({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <p>Are you sure you want to delete this item?</p>
        <div className={styles.buttons}>
          <button className={styles.confirm} onClick={onConfirm}>Yes</button>
          <button className={styles.cancel} onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}

export default MessageDelete;
