import React from 'react';
import { motion } from 'framer-motion';
import styles from './TimerBar.module.css';

function TimerBar({ tempo, tempoMaximo }) {
    const percentual = (tempo / tempoMaximo) * 100;
    
    let corDaBarra;
    if (percentual > 50) {
        corDaBarra = '#28a745'; 
    } else if (percentual > 25) {
        corDaBarra = '#ffc107'; 
    } else {
        corDaBarra = '#dc3545'; 
    }

    return (
        <div className={styles.timerContainer}>
            <motion.div
                className={styles.timerBar}
                initial={{ width: '100%' }}
                animate={{ width: `${percentual}%`, backgroundColor: corDaBarra }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            />
        </div>
    );
}

export default TimerBar;