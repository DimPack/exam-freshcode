import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.sass';
import CONSTANTS from '../../constants';
import { clearUserStore, getUser } from '../../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';

const Header = ({
  data,
  isFetching,
  getUser,
  clearUserStore,
  completedEventsCount,
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const [localCompletedCount, setLocalCompletedCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation(); // Додано для відстеження змін маршруту
  const bellSound = new Audio('/sounds/callBell.mp3');
  // Додаємо useRef для відстеження останнього значення лічильника
  const previousCountRef = useRef(0);
  // Додаємо useRef для перевірки монтування компонента
  const firstMountRef = useRef(true);

  // Завантаження кількості завершених подій при монтуванні компонента
  useEffect(() => {
    try {
      // Спочатку перевіряємо, чи є значення у localStorage
      const storedCount = localStorage.getItem('completedEventsCount');
      
      if (storedCount !== null) {
        // Якщо є збережене значення, використовуємо його
        const count = parseInt(storedCount, 10);
        setLocalCompletedCount(count);
        // Також зберігаємо поточне значення у ref
        previousCountRef.current = count;
      } else {
        // Якщо немає збереженого значення, розраховуємо на основі подій
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const count = events.filter(event => event.expired).length;
        setLocalCompletedCount(count);
        previousCountRef.current = count;
        localStorage.setItem('completedEventsCount', count.toString());
      }
    } catch (error) {
      console.error('Error loading completed events count:', error);
    }
  }, []);

  // Оновлення локального стану, коли змінюється проп completedEventsCount
  useEffect(() => {
    if (completedEventsCount !== undefined) {
      setLocalCompletedCount(completedEventsCount);
      localStorage.setItem('completedEventsCount', completedEventsCount.toString());
    }
  }, [completedEventsCount]);

  // НОВЕ: Оновлення лічильника при зміні URL
  useEffect(() => {
    try {
      const storedCount = localStorage.getItem('completedEventsCount');
      if (storedCount !== null) {
        const count = parseInt(storedCount, 10);
        setLocalCompletedCount(count);
      }
    } catch (error) {
      console.error('Error updating count after route change:', error);
    }
  }, [location.pathname]);

  // Додаємо слухач для змін у localStorage від інших вкладок/компонентів
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'events') {
        try {
          const events = JSON.parse(e.newValue) || [];
          const count = events.filter(event => event.expired).length;
          setLocalCompletedCount(count);
          localStorage.setItem('completedEventsCount', count.toString());
        } catch (error) {
          console.error('Error parsing events from storage:', error);
        }
      } else if (e.key === 'completedEventsCount') {
        try {
          const count = parseInt(e.newValue, 10);
          if (!isNaN(count)) {
            setLocalCompletedCount(count);
          }
        } catch (error) {
          console.error('Error parsing completedEventsCount from storage:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!data) {
      getUser().catch(() => {});    
    }
  }, [data, getUser]);

  // Ефект анімації дзвінка при зміні кількості завершених подій
  useEffect(() => {
    // Перевіряємо, чи це перше монтування компонента
    if (firstMountRef.current) {
      // При першому монтуванні просто зберігаємо значення без анімації
      firstMountRef.current = false;
      previousCountRef.current = localCompletedCount;
      return;
    }
    
    // Запускаємо анімацію тільки якщо кількість зросла
    if (localCompletedCount > 0 && localCompletedCount > previousCountRef.current) {
      console.log('Bell animation triggered!', {
        previous: previousCountRef.current,
        current: localCompletedCount
      });
      
      setIsShaking(true);

      bellSound.play().catch((error) => {
        console.error('Error playing sound:', error);
      });

      const timeout = setTimeout(() => {
        setIsShaking(false);
      }, 500);

      // Оновлюємо попереднє значення
      previousCountRef.current = localCompletedCount;
      
      return () => clearTimeout(timeout);
    }
    
    // Оновлюємо збережене значення навіть якщо не запускаємо анімацію
    previousCountRef.current = localCompletedCount;
  }, [localCompletedCount, bellSound]);

  const logOut = () => {
    const completedCount = localStorage.getItem('completedEventsCount');
    localStorage.clear();
    if (completedCount) {
      localStorage.setItem('completedEventsCount', completedCount);
    }
    clearUserStore();
    navigate('/login', { replace: true });
  };

  const startContests = () => {
    navigate('/startContest');
  };

  const toDoButtonHandler = () => {
    localStorage.setItem('completedEventsCount', localCompletedCount.toString());
    navigate('/todo-events');
  };

  const renderLoginButtons = () => {
    if (data) {
      return (
        <>
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
              {data && data.role !== CONSTANTS.MODERATOR && (
                <>
                  <li>
                    <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                      <span>View Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="http:/www.google.com"
                      style={{ textDecoration: 'none' }}
                    >
                      <span>Messages</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="http:/www.google.com"
                      style={{ textDecoration: 'none' }}
                    >
                      <span>Affiliate Dashboard</span>
                    </Link>
                  </li>
                </>
              )}

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
          <img
            src={`${CONSTANTS.STATIC_IMAGES_PATH}email.png`}
            className={styles.emailIcon}
            alt="email"
          />
        </>
      );
    }
    return (
      <>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <span className={styles.btn}>LOGIN</span>
        </Link>
        <Link to="/registration" style={{ textDecoration: 'none' }}>
          <span className={styles.btn}>SIGN UP</span>
        </Link>
      </>
    );
  };

  if (isFetching) {
    return null;
  }

  return (
    <div className={styles.headerContainer}>
      <div className={styles.fixedHeader}>
        <span className={styles.info}>
          Squadhelp recognized as one of the Most Innovative Companies by Inc
          Magazine.
        </span>
        <a href="http://www.google.com">Read Announcement</a>
      </div>
      <div className={styles.loginSignnUpHeaders}>
        <div className={styles.numberContainer}>
          <img src={`${CONSTANTS.STATIC_IMAGES_PATH}phone.png`} alt="phone" />
          <span>(877)&nbsp;355-3585</span>
        </div>
        <div className={styles.userButtonsContainer}>
          {renderLoginButtons()}
        </div>
      </div>
      <div className={styles.navContainer}>
        {/* ЗМІНЕНО: Замінено <a href="/"> на <Link to="/"> */}
        <Link to="/">
          <img
            src={`${CONSTANTS.STATIC_IMAGES_PATH}blue-logo.png`}
            className={styles.logo}
            alt="blue_logo"
          />
        </Link>
        {data && data?.role !== CONSTANTS.MODERATOR && (
          <div className={styles.leftNav}>
            <div className={styles.nav}>
              <ul>
                <li>
                  <span>NAME IDEAS</span>
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                    alt="menu"
                  />
                  <ul>
                    <li>
                      <a href="http://www.google.com">Beauty</a>
                    </li>
                    <li>
                      <a href="http://www.google.com">Consulting</a>
                    </li>
                    <li>
                      <a href="http://www.google.com">E-Commerce</a>
                    </li>
                    <li>
                      <a href="http://www.google.com">Fashion & Clothing</a>
                    </li>
                    <li>
                      <a href="http://www.google.com">Finance</a>
                    </li>
                    <li>
                      <a href="http://www.google.com">Real Estate</a>
                    </li>
                    <li>
                      <a href="http://www.google.com">Tech</a>
                    </li>
                    <li className={styles.last}>
                      <a href="http://www.google.com">More Categories</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <span>CONTESTS</span>
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                    alt="menu"
                  />
                  <ul>
                    <li>
                      <Link to="/how-it-works">HOW IT WORKS</Link>
                    </li>

                    <li>
                      <a href="http://www.google.com">PRICING</a>
                    </li>
                    <li>
                      <a href="http://www.google.com">AGENCY SERVICE</a>
                    </li>
                    <li>
                      <a href="http://www.google.com">ACTIVE CONTESTS</a>
                    </li>
                    <li>
                      <a href="http://www.google.com">WINNERS</a>
                    </li>
                    <li>
                      <a href="http://www.google.com">LEADERBOARD</a>
                    </li>
                    <li className={styles.last}>
                      <a href="http://www.google.com">BECOME A CREATIVE</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <span>Our Work</span>
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                    alt="menu"
                  />
                  <ul>
                    <li>
                      <a href="http://www.google.com">NAMES</a>
                    </li>
                    <li>
                      <a href="http://www.google.com">TAGLINES</a>
                    </li>
                    <li>
                      <a href="http://www.google.com">LOGOS</a>
                    </li>
                    <li className={styles.last}>
                      <a href="http://www.google.com">TESTIMONIALS</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <span>Names For Sale</span>
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                    alt="menu"
                  />
                  <ul>
                    <li>
                      <a href="http://www.google.com">POPULAR NAMES</a>
                    </li>
                    <li>
                      <a href="http://www.google.com">SHORT NAMES</a>
                    </li>
                    <li>
                      <a href="http://www.google.com">INTRIGUING NAMES</a>
                    </li>
                    <li>
                      <a href="http://www.google.com">NAMES BY CATEGORY</a>
                    </li>
                    <li>
                      <a href="http://www.google.com">VISUAL NAME SEARCH</a>
                    </li>
                    <li className={styles.last}>
                      <a href="http://www.google.com">SELL YOUR DOMAINS</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <span>Blog</span>
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                    alt="menu"
                  />
                  <ul>
                    <li>
                      <a href="http://www.google.com">ULTIMATE NAMING GUIDE</a>
                    </li>
                    <li>
                      <a href="http://www.google.com">
                        POETIC DEVICES IN BUSINESS NAMING
                      </a>
                    </li>
                    <li>
                      <a href="http://www.google.com">CROWDED BAR THEORY</a>
                    </li>
                    <li className={styles.last}>
                      <a href="http://www.google.com">ALL ARTICLES</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            {data && data.role !== CONSTANTS.CREATOR && (
              <div className={styles.buttonContainer}>
                <button
                  className={styles.startContestBtn}
                  onClick={startContests}
                >
                  START CONTEST
                </button>
                <button
                  className={styles.toDoButton}
                  onClick={toDoButtonHandler}
                >
                  <p>Events</p>
                  <div
                    className={`${styles.bell} ${
                      isShaking ? styles.shake : ''
                    }`}
                  >
                    <img
                      src={`${CONSTANTS.STATIC_ICONS_PATH}bell-ring.svg`}
                      alt="bell"
                    />
                    <p>{localCompletedCount}</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => state.userStore;
const mapDispatchToProps = {
  getUser,
  clearUserStore,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);