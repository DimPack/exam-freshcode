import React from 'react';
import styles from './ContestContainer.module.sass';
import Spinner from '../Spinner/Spinner';

class ContestsContainer extends React.Component {
  componentDidMount () {
    window.addEventListener('scroll', this.scrollHandler);
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  scrollHandler = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      if (this.props.haveMore) {
        const childrenCount = React.Children.toArray(this.props.children).length;
        this.props.loadMore(childrenCount);
      }
    }
  };

  render () {
    const { isFetching } = this.props;
    const childrenArray = React.Children.toArray(this.props.children);

    if (!isFetching && childrenArray.length === 0) {
      return <div className={styles.notFound}>Nothing found</div>;
    }

    return (
      <div>
        {childrenArray}
        {isFetching && (
          <div className={styles.spinnerContainer}>
            <Spinner />
          </div>
        )}
      </div>
    );
  }
}

export default ContestsContainer;
