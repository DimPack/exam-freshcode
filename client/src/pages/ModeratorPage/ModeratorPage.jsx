import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllOffers,
  makeOfferVisible,
  deleteOffer,
} from '../../store/slices/moderatorSlice';
import styles from './ModeratorPage.module.sass';
import { statusIcons } from './statusIcons';
import cx from 'classnames';
import Pagination from '../../components/Pagination/Pagination';

const ModeratorPage = () => {
  const dispatch = useDispatch();
  const { offers, loading, error, totalOffers } = useSelector(
    (state) => state.moderator
  );
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [offerToDelete, setOfferToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAllOffers({ page, limit }));
  }, [dispatch, page, limit]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleShowToCustomer = async (offerId) => {
    await dispatch(makeOfferVisible({ offerId }));
  };

  const handleDeleteOffer = async (offerId) => {
    await dispatch(deleteOffer({ offerId }));
    setOfferToDelete(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const totalPages = Math.ceil(totalOffers / limit);
  const textContext = cx(styles.creativeInfo, styles.textContest);

  const sortOffersByStatus = (offers) => {
    const statusOrder = { pending: 1, visible: 2, won: 3, rejected: 4 };
    return [...offers].sort(
      (a, b) => statusOrder[a.status] - statusOrder[b.status]
    );
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
                  <p className={styles.titleCreative}>
                    <strong>Task title:</strong>{' '}
                    <span className={styles.infoCreative}>
                      {offer.Contest?.title || 'No title'}
                    </span>
                  </p>
                  <p className={styles.titleCreative}>
                    <strong>Industry:</strong>{' '}
                    <span className={styles.infoCreative}>
                      {offer.Contest?.industry || 'No industry'}
                    </span>
                  </p>
                  <p className={styles.titleCreative}>
                    <strong>Type:</strong>{' '}
                    <span className={styles.infoCreative}>
                      {offer.Contest?.styleName || 'No type'}
                    </span>
                  </p>
                </div>
                <div className={textContext}>
                  <p className={styles.creativeName}>Offer text</p>
                  <p>{offer.text}</p>
                </div>
                <div className={styles.creativeInfo}>
                  <p className={styles.creativeName}>Status</p>
                  <img
                    src={statusIcons[offer.status]}
                    alt={offer.status}
                    className={styles.statusIcon}
                  />
                </div>
                <div className={styles.creativeInfo}>
                  <p className={styles.creativeName}>Task created by</p>
                  <p>{offer.Contest?.User?.email || 'No user'}</p>
                </div>
                <div className={styles.buttons}>
                  <button
                    onClick={() => handleShowToCustomer(offer.id)}
                    disabled={offer.status === 'visible'}
                    className={styles.button}
                  >
                    Show to customer
                  </button>
                  <button
                    onClick={() => setOfferToDelete(offer.id)}
                    className={styles.button}
                  >
                    Delete
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

      {offerToDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              className={styles.closeBtn}
              onClick={() => setOfferToDelete(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className={styles.modalTitle}>Delete offer</h3>
            <p className={styles.modalText}>Are you sure you want to delete this offer?</p>
            <div className={styles.modalButtons}>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDeleteOffer(offerToDelete)}
              >
                Yes, delete
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setOfferToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorPage;