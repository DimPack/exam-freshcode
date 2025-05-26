import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import {
  changeShowModeCatalog,
  changeRenameCatalogMode,
  changeCatalogName,
} from '../../../../store/slices/chatSlice';
import styles from './CatalogHeader.module.sass';
import FormInput from '../../../FormInput/FormInput';
import Schems from '../../../../utils/validators/validationSchems';

const CatalogListHeader = () => {
  const dispatch = useDispatch();
  const { isRenameCatalog, currentCatalog } = useSelector((state) => state.chatStore);
  const { catalogName, id } = currentCatalog || {};

  const handleChangeCatalogName = (values) => {
    if (!id) return;
    dispatch(changeCatalogName({ catalogId: id, catalogName: values.catalogName }));
  };

  return (
    <div className={styles.headerContainer}>
      <i
        className="fas fa-long-arrow-alt-left"
        onClick={() => dispatch(changeShowModeCatalog())}
      />
      {!isRenameCatalog && (
        <div className={styles.infoContainer}>
          <span>{catalogName}</span>
          <i
            className="fas fa-edit"
            onClick={() => dispatch(changeRenameCatalogMode())}
          />
        </div>
      )}
      {isRenameCatalog && (
        <div className={styles.changeContainer}>
          <Formik
            onSubmit={handleChangeCatalogName}
            initialValues={{ catalogName }}
            validationSchema={Schems.CatalogSchema}
          >
            <Form>
              <FormInput
                name="catalogName"
                classes={{
                  container: styles.inputContainer,
                  input: styles.input,
                  warning: styles.fieldWarning,
                  notValid: styles.notValid,
                }}
                type="text"
                label="Catalog Name"
              />
              <button type="submit">Change</button>
            </Form>
          </Formik>
        </div>
      )}
    </div>
  );
};

export default CatalogListHeader;