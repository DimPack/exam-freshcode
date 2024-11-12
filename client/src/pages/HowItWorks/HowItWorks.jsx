import { useRef } from 'react';
import styles from './HowItWorks.module.sass';
import cx from 'classnames';
import constants from '../../constants';
import CardsHowItWorks from '../../components/CardsHowItWorks/CardsHowItWorks';
import StepHowItWorks from '../../components/StepHowItWorks/StepHowItWorks';
import TabsFaq from '../../components/TabsFaqHowItWorks/TabsFaqHowItWorks';
import Accordion from '../../components/AccordionsHowItWork/AccordionsHowItWork';
import SearchFormHowItWork from '../../components/SearchFormHowItWork/SearchFormHowItWork';

const HowItWorks = () => {
  const sectionRefs = useRef([]);
  
  const titleCentry = cx(styles.titlehowItWorks, styles.centre);
  return (
    <>
      <section className={styles.howItWorks}>
        <div className={styles.howItWorksContainer}>
          <div className={styles.flexBlock}>
            <div className={styles.titlehowItWorks}>
              <h5 className={styles.titleHighlight}>
                World's #1 Naming Platform
              </h5>
              <h1 className={styles.title}>How Does Atom Work?</h1>
              <p className={styles.titleDescription}>
                Atom helps you come up with a great name for your business by
                combining the power of crowdsourcing with sophisticated
                technology and Agency-level validation services.
              </p>
            </div>
            <div className={styles.mediahowItWorks}>
              <div className={styles.videohowItWorks}>
                <iframe
                  src="https://iframe.mediadelivery.net/embed/239474/327efcdd-b1a2-4891-b274-974787ae8362?autoplay=false&amp;loop=false&amp;muted=false&amp;preload=true&amp;responsive=true"
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                  allowFullScreen={true}
                  title="How Atom Works Video"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.howItWorks} ${styles.colorManaged}`}>
        <div className={styles.howItWorksContainer}>
          <div className={titleCentry}>
            <h5 className={styles.titleHighlight}>Our Services</h5>
            <h2 className={styles.title}>3 Ways To Use Atom</h2>
            <p className={styles.titleDescription}>
              Atom offers 3 ways to get you a perfect name for your business.
            </p>
          </div>
          <CardsHowItWorks />
        </div>
      </section>

      <section className={`${styles.howItWorks} ${styles.colorStep}`}>
        <div className={styles.howItWorksContainer}>
          <div className={titleCentry}>
            <img
              className={styles.icon}
              src={`${constants.STATIC_ICONS_PATH}cup.svg`}
              alt="icon"
            />
            <h2 className={styles.title}>How Do Naming Contests Work?</h2>
          </div>
          <StepHowItWorks />
        </div>
      </section>

      <section className={styles.howItWorks}>
        <div className={titleCentry}>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
        </div>
        <TabsFaq sectionRefs={sectionRefs} />
        <Accordion sectionRefs={sectionRefs} />
      </section>

      <section className={styles.howItWorks}>
        <SearchFormHowItWork />
      </section>
    </>
  );
};

export default HowItWorks;
