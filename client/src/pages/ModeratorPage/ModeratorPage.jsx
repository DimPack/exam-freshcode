import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOffers } from '../../store/slices/moderatorSlice';
import style from './ModeratorPage.module.sass';
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

  const textContext = cx(style.creativeInfo, style.textContest);
  return (
    <div>
      <div className={style.moderatorBlock}>
        <h2 className={style.title}>List of all offers</h2>
        {offers.length === 0 ? (
          <p className={style.noOffers}>No offers available</p>
        ) : (
          <ul className={style.list}>
            {offers.map((offer) => (
              <li key={offer.id} className={style.item}>
                <div className={style.creativeInfo}>
                  <p className={style.creativeName}>created an offer</p>
                  <p className={style.titleCreative}>first name: <span className={style.infoCreative}>{offer.User.firstName}</span></p>
                  <p className={style.titleCreative}>last name: <span className={style.infoCreative}>{offer.User.lastName}</span></p>
                  <p className={style.titleCreative}>email: <span className={style.infoCreative}>{offer.User.email}</span></p>
                </div>
                <div className={textContext}>
                  <p className={style.creativeName}>offer text</p>
                  <p>{offer.text}</p>
                </div>
                <div className={style.creativeInfo}>
                  <p className={style.creativeName}>status</p>
                  <p>{offer.status}</p>
                </div>
                <div className={style.creativeInfo}>
                  <p className={style.creativeName}>created a contest</p>
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
        <button onClick={handleNextPage} disabled={!isNextPageAvailable}>
          Наступна сторінка
        </button>
      </div>
    </div>
  );
};

export default ModeratorPage;
