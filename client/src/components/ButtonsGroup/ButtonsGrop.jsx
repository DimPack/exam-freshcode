import { useState } from 'react';
import styles from './ButtonsGroup.module.sass';
import Button from './Button/Button';

const buttonsData = [
  {
    is: 'Yes',
    text: 'But minor variations are allowed',
    recommended: true,
  },
  {
    is: 'Yes',
    text: 'The Domain should exactly match the name',
    recommended: false,
  },
  {
    is: 'No',
    text: 'I am only looking for a name, not a Domain',
    recommended: false,
  },
];

const ButtonsGroup = () => {
    const [active, setActive] = useState(0);

  return (
    <div className={styles.buttonsGrop}>
      {buttonsData.map((button, index) => (
        <Button
          key={index}
          index={index}
          is={button.is}
          text={button.text}
          recommended={button.recommended}
          active={active}
          setActive={setActive}
        />
      ))}
    </div>
  );
};

export default ButtonsGroup;
