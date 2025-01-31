import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Spinner from '../../Spinner/Spinner';

const ModeratorRouter = () => {
  const { data, isFetching } = useSelector((state) => state.userStore);
  console.log(data);

  useEffect(() => {
    if (isFetching) return;
  }, [isFetching]);

  if (isFetching) {
    return <Spinner />;
  }
  if (!data) {
    return <Navigate to="/login" replace />;
  }

  
  if (data.role !== 'moderator') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
export default ModeratorRouter;
