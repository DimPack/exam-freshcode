import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Spinner from '../../Spinner/Spinner';

const PrivateRoute = (props) => {
  const { data, isFetching } = useSelector((state) => state.userStore);

  useEffect(() => {
    if (isFetching) return;
  }, [isFetching]);

  if (isFetching) {
    return <Spinner />;
  }
  if (!data) {
    return <Navigate to="/login" />;
  }

  return data ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

