import React, { useState } from 'react';
import './App.css';
import Jogo from './components/Jogo';
import Footer from './components/Footer';
import { useTheme } from './context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'react-tooltip';

function App() {
    const { theme } = useTheme();
    const [modoDeJogo, setModoDeJogo] = useState('menu');

    // Configurações da animação de transição de tela
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
            {/* AnimatePresence vai cuidar da transição */}
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
                        <h1>Questões de Geografia!</h1>
                        <div className="menu-container">
                            <h2>Escolha um modo de jogo</h2>

                            <button 
                                onClick={() => setModoDeJogo('classico')}
                                data-tooltip-id="menu-tooltip" 
                                data-tooltip-content="Faça 5 pontos para vencer, mas cuidado, você só tem 3 vidas!"
                            >
                                Modo Clássico
                            </button>

                            <button 
                                onClick={() => setModoDeJogo('timeAttack')}
                                data-tooltip-id="menu-tooltip" 
                                data-tooltip-content="Faça o máximo de pontos em 60 segundos. Cada acerto te dá +2 segundos de vantagem, porém cada erro te tira 10!"
                            >
                                Time Attack
                            </button>
                        </div>

                        {/* Tooltip compartilhado */}
                        <Tooltip 
                            id="menu-tooltip" 
                            style={{ 
                                backgroundColor: "#14161aff", 
                                color: "#76e0fdff",
                                borderRadius: "8px",
                                maxWidth: "250px",
                                textAlign: "center"
                            }}
                        />
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
        </div>
    );
}

export default App;
