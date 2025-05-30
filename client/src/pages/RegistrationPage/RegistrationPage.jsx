import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm';
import styles from './RegistrationPage.module.sass';
import { clearAuthError } from '../../store/slices/authSlice';

const RegistrationPage = props => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return (
    <div className={styles.signUpPage}>
      <div className={styles.signUpContainer}>
        <RegistrationForm navigate={navigate} />
      </div>
    </div>
  );
};

export default RegistrationPage;