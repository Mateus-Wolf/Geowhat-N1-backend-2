import React, { useState } from 'react';
import './App.css';
import Jogo from './components/Jogo';
import Footer from './components/Footer';
import { useTheme } from './context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import logo from './logo.png';

function App() {
    const { theme } = useTheme();
    const [modoDeJogo, setModoDeJogo] = useState('menu');

    const pageVariants = {
        initial: { opacity: 0, x: "-100vw" },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: "100vw" }
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.8
    };

    return (
        <div className={`App ${theme}`}>
            <AnimatePresence mode="wait">
                {modoDeJogo === 'menu' ? (
                    <motion.div
                        key="menu"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <img src={logo} className="App-logo" alt="logo do jogo" />
                        <h1>Geowhat?!</h1>
                        <div className="menu-container">
                            <h2>Escolha um modo de jogo</h2>
                            <button
                                onClick={() => setModoDeJogo('classico')}
                                data-tooltip-id="global-tooltip"
                                data-tooltip-content="Faça 5 pontos para vencer, mas cuidado, você só tem 3 vidas!"
                            >
                                Modo Clássico
                            </button>
                            <button
                                onClick={() => setModoDeJogo('timeAttack')}
                                data-tooltip-id="global-tooltip"
                                data-tooltip-content="Faça o máximo de pontos em 60 segundos. Cada acerto te dá +2 segundos, mas cada erro tira 10!"
                            >
                                Time Attack
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="jogo"
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                    >
                        <Jogo
                            modo={modoDeJogo}
                            voltarAoMenu={() => setModoDeJogo('menu')}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <Footer />

            {/* O Tooltip "mestre" fica aqui, no final, para gerenciar tudo */}
            <Tooltip
                id="global-tooltip"
                style={{
                    backgroundColor: "#282c34",
                    color: "#61dafb",
                    borderRadius: "8px",
                    maxWidth: "250px",
                    textAlign: "center",
                    zIndex: 9999
                }}
            />
        </div>
    );
}

export default App;