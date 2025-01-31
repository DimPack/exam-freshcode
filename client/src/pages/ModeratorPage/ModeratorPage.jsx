import React, { useEffect } from 'react';
import CONSTANTS from '../../constants';
import styles from './ModeratorPage.module.sass';
import { Link, useNavigate } from 'react-router-dom';
import { clearUserStore, getUser } from '../../store/slices/userSlice';
import { useSelector } from 'react-redux';

const ModeratorPage = () => {
    const { data } = useSelector((state) => state.userStore);
      const navigate = useNavigate();
      useEffect(() => {
        if (!data) {
          getUser();
        }
      }, [data]);
    const logOut = () => {
        localStorage.clear();
        clearUserStore();
        navigate('/login', { replace: true });
      };
    return (
        <div>
            <h1>Moderator Page</h1>
        </div>
    );
}

export default ModeratorPage;
