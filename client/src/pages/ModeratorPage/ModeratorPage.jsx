import React, { useEffect } from 'react';
import CONSTANTS from '../../constants';
import styles from './ModeratorPage.module.sass';
import { Link, useNavigate } from 'react-router-dom';
import { clearUserStore, getUser } from '../../store/slices/userSlice';

const ModeratorPage = ({data}) => {
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

            <div className={styles.userInfo}>
            <img
                src={
                data.avatar === 'anon.png'
                    ? CONSTANTS.ANONYM_IMAGE_PATH
                    : `${CONSTANTS.publicURL}${data.avatar}`
                }
                alt="user"
            />
            <span>{`Hi, ${data.displayName}`}</span>
            <img
                src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                alt="menu"
            />
            <ul>
                <li>
                <Link to="/account" style={{ textDecoration: 'none' }}>
                    <span>My Account</span>
                </Link>
                </li>
                <li>
                <span onClick={logOut}>Logout</span>
                </li>
            </ul>
            </div>
        </div>
    );
}

export default ModeratorPage;
