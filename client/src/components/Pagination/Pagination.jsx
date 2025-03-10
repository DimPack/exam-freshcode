import React from 'react';
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
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;