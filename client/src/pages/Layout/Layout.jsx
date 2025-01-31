import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import RegistrationFooter from '../../components/Layout/RegistrationFooter';
import AuthHeader from '../../components/Layout/AuthHeader';
import styles from './Layout.module.sass';
import ModeratorPage from '../ModeratorPage/ModeratorPage';

const Layout = ({completedEventsCount}) => {
  const { pathname } = useLocation();
  const { data } = useSelector((state) => state.userStore);
  const isRegisterPathname = pathname === '/registration';
  const isAuthPathname = pathname === '/login' || isRegisterPathname;
  

  if (data?.role === 'moderator' && pathname !== '/moderator' && pathname !== '/account') {
    return <Navigate to="/moderator" replace />;
  }

  return (
    <div className={styles.container}>
      {isAuthPathname && <AuthHeader />}
      {!isAuthPathname && <Header completedEventsCount={completedEventsCount}/>}
      <div className={styles.content}>
        <Outlet />
      </div>
      {!isAuthPathname && <Footer />}
      {isRegisterPathname && <RegistrationFooter />}
    </div>
  );
};

export default Layout;
