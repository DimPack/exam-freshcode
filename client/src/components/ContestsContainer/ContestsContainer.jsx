import React, { useEffect, useCallback } from 'react';
import styles from './ContestContainer.module.sass';
import Spinner from '../Spinner/Spinner';

const ContestsContainer = ({ isFetching, haveMore, loadMore, children }) => {
  const scrollHandler = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      if (haveMore) {
        const childrenCount = React.Children.toArray(children).length;
        loadMore(childrenCount);
      }
    }
  }, [haveMore, loadMore, children]);

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [scrollHandler]);

  const childrenArray = React.Children.toArray(children);

  if (!isFetching && childrenArray.length === 0) {
    return <div className={styles.notFound}>Nothing found</div>;
  }

  return (
    <div>
      {childrenArray}
      {isFetching && (
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default ContestsContainer;