import React from 'react';
import { useDispatch } from 'react-redux';
import Catalog from '../Catalog/Catalog';
import styles from '../CatalogListContainer/CatalogListContainer.module.sass';
import {
  changeShowModeCatalog,
  deleteCatalog as deleteCatalogAction,
} from '../../../../store/slices/chatSlice';

const CatalogList = ({ catalogList }) => {
  const dispatch = useDispatch();

  const goToCatalog = (event, catalog) => {
    dispatch(changeShowModeCatalog(catalog));
    event.stopPropagation();
  };

  const deleteCatalog = (event, catalogId) => {
    if (!catalogId) return;
    dispatch(deleteCatalogAction(catalogId));
    event.stopPropagation();
  };

  const getListCatalog = () => {
    if (!catalogList || !catalogList.length) {
      return <span className={styles.notFound}>Not found</span>;
    }
    return catalogList.map((catalog) => (
      <Catalog
        catalog={catalog}
        key={catalog.id}
        deleteCatalog={deleteCatalog}
        goToCatalog={goToCatalog}
      />
    ));
  };

  return <div className={styles.listContainer}>{getListCatalog()}</div>;
};

export default CatalogList;