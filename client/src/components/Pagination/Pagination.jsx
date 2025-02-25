import React from 'react';
import styles from './Pagination.module.sass';

const Pagination = ({ page, isNextPageAvailable, handlePrevPage, handleNextPage }) => {
  return (
    <div className={styles.pagination}>
      <button onClick={handlePrevPage} disabled={page === 1}>
        Previous page
      </button>
      <button onClick={handleNextPage} disabled={!isNextPageAvailable}>
        Next page
      </button>
    </div>
  );
};

export default Pagination;