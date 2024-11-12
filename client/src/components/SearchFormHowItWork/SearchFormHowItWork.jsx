import styles from './SearchFormHowItWork.module.sass';

const SearchFormHowItWork = () => {
  return (
    <>
      <div className={styles.search}>
        <span className={styles.icon}></span>
        <input className={styles.searchInput} name="search" type="text" placeholder="Search Over 200,000+ Premium Names"/>
        <button className={styles.button} type="submit">
            <span></span>
        </button>
      </div>
      <div className={styles.categories}>
        <a className={styles.link} href="https://www.atom.com/premium-domains-for-sale/for/technology">Tech</a>
        <a className={styles.link} href="https://www.atom.com/premium-domains-for-sale/for/fashion-clothing">Clothing</a>
        <a className={styles.link} href="https://www.atom.com/premium-domains-for-sale/for/finance">Finance</a>
        <a className={styles.link} href="https://www.atom.com/premium-domains-for-sale/for/real-estate">Real Estate</a>
        <a className={styles.link} href="https://www.atom.com/premium-domains-for-sale/for/cryptocurrency-blockchain">Crypto</a>
        <a className={styles.link} href="https://www.atom.com/premium-domains-for-sale/all/length/Short">Short</a>
        <a className={styles.link} href="https://www.atom.com/premium-domains-for-sale/all/type_of_name/One%20Word">One Word</a>
      </div>
    </>
  );
};

export default SearchFormHowItWork;
