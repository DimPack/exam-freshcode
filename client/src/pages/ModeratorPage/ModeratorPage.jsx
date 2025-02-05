import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOffers } from '../../store/slices/moderatorSlice';

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

  const isNextPageAvailable = offers.length === limit; // Перевірка для наступної сторінки

  return (
    <div>
      <h1>Moderator Page</h1>
      <div>
        <h2>Список всіх оферів</h2>
        {offers.length === 0 ? (
          <p>Оферів немає</p>
        ) : (
          <ul>
            {offers.map((offer) => (
              <li key={offer.id}>
                Хто подав Офер: == first name creative:*{offer.User.firstName}*last name creative:*{offer.User.lastName} = {offer.text} status — {offer.status} Хто створив контест — {offer.Contest.User.email}
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
