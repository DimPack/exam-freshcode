import React from 'react';
import styles from './StepHowItWorks.module.sass';
import dataSteps from './dataStep';

const StepHowItWorks = () => {
    return (
        <div className={styles.container}>
            {dataSteps.map((step) => (
                <div key={step.id} className={styles.stepBlock}>
                    <span className={styles.name}>{step.step}</span>
                    <p className={styles.description}>{step.description}</p>
                </div>
            ))}
        </div>
    );
}

export default StepHowItWorks;
