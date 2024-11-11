import { useRef, useState } from 'react';
import styles from './AccordionsHowItWork.module.sass';
import dataFaq from './dataFaq';

const AccordionsHowItWork = ({ sectionRefs }) => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (sectionIndex, itemIndex) => {
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [sectionIndex]: {
        ...prevOpenItems[sectionIndex],
        [itemIndex]: !prevOpenItems[sectionIndex]?.[itemIndex],
      },
    }));
  };

  return (
    <div className={styles.container}>
      {dataFaq.map((faqSection, sectionIndex) => (
        <div
          className={styles.block}
          key={sectionIndex}
          ref={(el) => (sectionRefs.current[sectionIndex] = el)}
        >
          <h4 className={styles.title}>{faqSection.title}</h4>
          {faqSection.content.map((faqItem, itemIndex) => (
            <div
              key={itemIndex}
              className={`${styles.faqItem} ${
                openItems[sectionIndex] && openItems[sectionIndex][itemIndex]
                  ? styles.active
                  : ''
              }`}
              onClick={() => toggleItem(sectionIndex, itemIndex)}
            >
              <p className={styles.question}>
                {faqItem.question} <div className={styles.close}></div>
              </p>
              {openItems[sectionIndex]?.[itemIndex] && (
                <p
                  className={`${styles.answer} ${
                    openItems[sectionIndex]?.[itemIndex] ? styles.open : ''
                  }`}
                >
                  {faqItem.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AccordionsHowItWork;
