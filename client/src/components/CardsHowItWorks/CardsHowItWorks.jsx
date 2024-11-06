import React from 'react';
import styles from './CardHowItWorks.module.sass';
import constants from '../../constants';
import dataCardsHowItWorks from './dataCardsHowItWorks';

const CardHowItWorks = () => {
  return (
    <div className={styles.containerCard}>
      {dataCardsHowItWorks.map((card) => (
        <div key={card.id} className={styles.card}>
            <div className={styles.icon}>
              <img src={`${constants.STATIC_ICONS_PATH}${card.icon}.svg`} alt="icon" />
            </div>
            <h3 className={styles.title}>{card.title}</h3>
            <p className={styles.description}>{card.description}</p>
            <a href={card.link} className={styles.link}>{card.buttonText}
              <span className={styles.arrow}></span>
            </a>
        </div>
      ))}
    </div>
  );
};

export default CardHowItWorks;
