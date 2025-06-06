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
  const navigate = useNavigate();
  const previousCountRef = useRef(completedEventsCount);

  useEffect(() => {
    if (completedEventsCount > previousCountRef.current) {
      setIsShaking(true);
      const bellSound = new Audio('/sounds/callBell.mp3');
      bellSound.play().catch(() => {});
      setTimeout(() => setIsShaking(false), 500);
    }
    previousCountRef.current = completedEventsCount;
  }, [completedEventsCount]);

  useEffect(() => {
    if (!data) {
      getUser().catch(() => {});    
    }
  }, [data, getUser]);

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
                    <p>{completedEventsCount}</p>
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