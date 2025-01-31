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
  // if (data.role === 'moderator') {
  //   return <Navigate to="/moderator" />;
  // }

  return data ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

// https://chatgpt.com/c/67969f98-b7a0-800e-a890-4e9d5f7c8115