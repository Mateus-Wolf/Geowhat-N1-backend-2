import React, { useState } from 'react';
import './App.css';
import Jogo from './components/Jogo';
import Footer from './components/Footer';
import { useTheme } from './context/ThemeContext';

function App() {
    const { theme } = useTheme();
    const [modoDeJogo, setModoDeJogo] = useState('menu');

    if (modoDeJogo === 'menu') {
        return (
            <div className={`App ${theme}`}>
                <h1>Adivinhe o País!</h1>
                <div className="menu-container">
                    <h2>Escolha um modo de jogo</h2>
                    <button onClick={() => setModoDeJogo('classico')}>Modo Clássico</button>
                    <button onClick={() => setModoDeJogo('timeAttack')}>Time Attack</button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={`App ${theme}`}>
            <Jogo 
                modo={modoDeJogo} 
                voltarAoMenu={() => setModoDeJogo('menu')} 
            />
            <Footer />
        </div>
    );
}

export default App;