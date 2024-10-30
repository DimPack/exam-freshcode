import classNames from 'classnames';
import { useField } from 'formik';
import { useState } from 'react';

const ImageUpload = props => {
  const [field, meta, helpers] = useField(props.name);
  const { uploadContainer, inputContainer, imgStyle } = props.classes;
  const [preview, setPreview] = useState(null);

  const onChange = e => {
    // const node = window.document.getElementById('imagePreview');
    const file = e.target.files[0];
    const imageType = /image.*/;
    if(!file) {
      e.target.value = '';
      return;
    }

    if (!file.type.match(imageType)) {
      e.target.value = '';
      return;
    }

    helpers.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    // if (!file.type.match(imageType)) {
    //   e.target.value = '';
    // } else {
    //   field.onChange(file);
    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     node.src = reader.result;
    //   };
    //   reader.readAsDataURL(file);
    // }
  };
  return (
    <div className={uploadContainer}>
      <div className={inputContainer}>
        <span>Support only images (*.png, *.gif, *.jpeg)</span>
        <input
          id="fileInput"
          type="file"
          accept=".jpg, .png, .jpeg"
          onChange={onChange}
        />
        <label htmlFor="fileInput">Chose file</label>
      </div>
      {
        preview && (
          <img
            src={preview}
            className={classNames({ [imgStyle]: !!field.value })}
            alt="user"
          />
        )
      }
      {/* <img
        id="imagePreview"
        className={classNames({ [imgStyle]: !!field.value })}
        alt="user"
      /> */}
    </div>
  );
};

export default ImageUpload;
