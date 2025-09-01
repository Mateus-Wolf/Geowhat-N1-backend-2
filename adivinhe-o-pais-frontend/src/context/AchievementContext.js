import React, { createContext, useState, useEffect, useContext } from 'react';
import { conquistas as conquistasIniciais } from '../config/conquistas';
import Swal from 'sweetalert2'; // A linha que faltava está aqui!

const AchievementContext = createContext();

export function AchievementProvider({ children }) {
    const [conquistas, setConquistas] = useState(conquistasIniciais);

    useEffect(() => {
        const conquistasSalvas = localStorage.getItem('conquistasDoJogo');
        if (conquistasSalvas) {
            setConquistas(JSON.parse(conquistasSalvas));
        }
    }, []);

    const desbloquearConquista = (id) => {
        setConquistas(prevConquistas => {
            if (prevConquistas[id]?.desbloqueada) return prevConquistas;

            const novasConquistas = {
                ...prevConquistas,
                [id]: { ...prevConquistas[id], desbloqueada: true }
            };
            localStorage.setItem('conquistasDoJogo', JSON.stringify(novasConquistas));
            
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `Conquista Desbloqueada: ${novasConquistas[id].titulo}`,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#282c34',
                color: '#ffffff'
            });
            return novasConquistas;
        });
    };
    
    const registrarProgresso = (id, paisesAcertados, totalDePaises) => {
        // Lógica futura aqui
    };

    return (
        <AchievementContext.Provider value={{ conquistas, desbloquearConquista, registrarProgresso }}>
            {children}
        </AchievementContext.Provider>
    );
}

export const useAchievements = () => useContext(AchievementContext);