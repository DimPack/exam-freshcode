import React, { useState } from 'react';
import styles from './TabsFaqHowItWorks.module.sass';

const TabsFaq = () => {
  const [active, setActive] = useState(0);

  const handleItemClick = (index) => {
    setActive(index);
  };

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        {[
          'Launching A Contest',
          'Buying From Marketplace',
          'Managed Contests',
          'For Creatives',
        ].map((item, index) => (
          <span
            key={index}
            className={
              index === active
                ? `${styles.item} ${styles.active}`
                : styles.item
            }
            onClick={() => handleItemClick(index)} 
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TabsFaq;
