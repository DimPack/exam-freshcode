import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOffers, updateOfferStatus } from '../../store/slices/moderatorSlice';
import styles from './ModeratorPage.module.sass';
import { statusIcons } from './statusIcons'; 
import cx from 'classnames';
import Pagination from '../../components/Pagination/Pagination';

const ModeratorPage = () => {
  const dispatch = useDispatch();
  const { offers, loading, error, totalOffers } = useSelector((state) => state.moderator);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    dispatch(fetchAllOffers({ page, limit }));
  }, [dispatch, page, limit]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleStatusChange = async (offerId, status) => {
    await dispatch(updateOfferStatus({ offerId, status }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const totalPages = offers.length === limit;
  const textContext = cx(styles.creativeInfo, styles.textContest);

  const sortOffersByStatus = (offers) => {
    const statusOrder = { pending: 1, rejected: 2, won: 3 };
    return [...offers].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  };

  const sortedOffers = sortOffersByStatus(offers);

  return (
    <div>
      <div className={styles.moderatorBlock}>
        <h2 className={styles.title}>List of all offers</h2>
        {sortedOffers.length === 0 ? (
          <p className={styles.noOffers}>No offers available</p>
        ) : (
          <ul className={styles.list}>
            {sortedOffers.map((offer) => (
              <li key={offer.id} className={styles.item}>
                <div className={styles.creativeInfo}>
                  <p className={styles.creativeName}>User created an offer {offer.id}</p>
                  <p className={styles.titleCreative}>
                    First name: <span className={styles.infoCreative}>{offer.User.firstName}</span>
                  </p>
                  <p className={styles.titleCreative}>
                    Last name: <span className={styles.infoCreative}>{offer.User.lastName}</span>
                  </p>
                  <p className={styles.titleCreative}>
                    Email: <span className={styles.infoCreative}>{offer.User.email}</span>
                  </p>
                </div>
                <div className={textContext}>
                  <p className={styles.creativeName}>Offer text</p>
                  <p>{offer.text}</p>
                </div>
                <div className={styles.creativeInfo}>
                    <p className={styles.creativeName}>Status</p>
                    <img src={statusIcons[offer.status]} alt={offer.status} className={styles.statusIcon} />
                </div>
                <div className={styles.creativeInfo}>
                  <p className={styles.creativeName}>Created a contest</p>
                  <p>{offer.Contest.User.email}</p>
                </div>
                <div className={styles.buttons}>
                  <button 
                    onClick={() => handleStatusChange(offer.id, 'won')} 
                    disabled={offer.status === 'won'}
                    className={styles.button}
                  >
                    Yes
                  </button>
                  <button 
                    onClick={() => handleStatusChange(offer.id, 'rejected')} 
                    disabled={offer.status === 'rejected'}
                    className={styles.button}
                  >
                    No
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
};

export default ModeratorPage;