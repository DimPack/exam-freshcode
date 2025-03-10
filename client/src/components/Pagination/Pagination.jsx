import React from 'react';
<<<<<<< HEAD
import styles from './Pagination.module.sass';

const Pagination = ({ page, isNextPageAvailable, handlePrevPage, handleNextPage }) => {
  return (
    <div className={styles.pagination}>
      <button onClick={handlePrevPage} disabled={page === 1}>
        Previous page
      </button>
      <button onClick={handleNextPage} disabled={!isNextPageAvailable}>
        Next page
=======
import PropTypes from 'prop-types';
import styles from './Pagination.module.sass';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageButton}
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &#9668;
      </button>
      <span className={styles.pageInfo}>
        {currentPage}
      </span>
      <button
        className={styles.pageButton}
        onClick={() => handleClick(currentPage + 1)}
        disabled={!totalPages}
      >
        &#9658;
>>>>>>> moderator
      </button>
    </div>
  );
};

<<<<<<< HEAD
=======
Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

>>>>>>> moderator
export default Pagination;