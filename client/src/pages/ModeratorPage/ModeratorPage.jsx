import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOffers } from '../../store/slices/moderatorSlice';
import styles from './ModeratorPage.module.sass';
import cx from 'classnames';

const ModeratorPage = () => {
  const dispatch = useDispatch();
  const { offers, loading, error } = useSelector((state) => state.moderator);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  
  useEffect(() => {
    dispatch(fetchAllOffers({ page, limit }));
  }, [dispatch, page, limit]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const isNextPageAvailable = offers.length === limit;

  const textContext = cx(styles.creativeInfo, styles.textContest);
  return (
    <div>
      <div className={styles.moderatorBlock}>
        <h2 className={styles.title}>List of all offers</h2>
        {offers.length === 0 ? (
          <p className={styles.noOffers}>No offers available</p>
        ) : (
          <ul className={styles.list}>
            {offers.map((offer) => (
              
              <li key={offer.id} className={styles.item}>
                <div className={styles.creativeInfo}>
                  <p className={styles.creativeName}>created an offer</p>
                  <p className={styles.titleCreative}>first name: <span className={styles.infoCreative}> {offer.User.firstName}</span></p>
                  <p className={styles.titleCreative}>last name: <span className={styles.infoCreative}>{offer.User.lastName}</span></p>
                  <p className={styles.titleCreative}>email: <span className={styles.infoCreative}>{offer.User.email}</span></p>
                </div>
                <div className={textContext}>
                  <p className={styles.creativeName}>offer text</p>
                  <p>{offer.text}</p>
                </div>
                <div className={styles.creativeInfo}>
                  <p className={styles.creativeName}>status</p>
                  <p>{offer.status}</p>
                </div>
                <div className={styles.creativeInfo}>
                  <p className={styles.creativeName}>created a contest</p>
                  <p>{offer.Contest.User.email}</p>
                </div>

              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <button onClick={handlePrevPage} disabled={page === 1}>
          Попередня сторінка
        </button>
        <button onClick={()=> handleNextPage} disabled={!isNextPageAvailable}>
          Наступна сторінка
        </button>
      </div>
    </div>
  );
};

export default ModeratorPage;
