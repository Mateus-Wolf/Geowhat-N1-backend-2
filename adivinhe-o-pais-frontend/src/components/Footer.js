import React from 'react';
import { FaUserGraduate, FaCog, FaTrophy } from 'react-icons/fa';
import Swal from 'sweetalert2';
import styles from './Footer.module.css';
import { useTheme } from '../context/ThemeContext';
import { useAchievements } from '../context/AchievementContext';

function Footer() {
    // Hooks são chamados aqui, no topo do componente
    const { theme, setTheme } = useTheme();
    const { conquistas } = useAchievements();

    const getSwalThemeClasses = () => {
        const isDark = theme === 'dark';
        return {
            popup: `meu-modal-popup ${isDark ? 'meu-modal-dark' : 'meu-modal-light'}`,
            title: `meu-modal-title ${isDark ? 'meu-modal-title-dark' : 'meu-modal-title-light'}`,
            htmlContainer: `meu-modal-content ${isDark ? 'meu-modal-content-dark' : 'meu-modal-content-light'}`,
            confirmButton: `meu-modal-confirm-button ${isDark ? 'meu-modal-confirm-button-dark' : 'meu-modal-confirm-button-light'}`,
            closeButton: `meu-modal-close-button ${isDark ? 'meu-modal-close-button-dark' : 'meu-modal-close-button-light'}`,
        };
    };

    const abrirModalCreditos = () => {
        Swal.fire({
            title: 'Créditos do Projeto',
            html: `
                <div style="text-align: left;">
                    <p><strong>Desenvolvido por:</strong></p>
                    <p>Mateus Pedrini Wolf</p>
                    <br>
                    <p><strong>APIs Utilizadas:</strong></p>
                    <ul>
                        <li>REST Countries</li>
                        <li>ExchangeRate-API</li>
                    </ul>
                    <br>
                    <p><strong>Tecnologias:</strong></p>
                    <ul>
                        <li>React.js</li>
                        <li>Node.js / Express.js</li>
                    </ul>
                </div>
            `,
            icon: 'info',
            customClass: getSwalThemeClasses()
        });
    };

    const abrirModalConquistas = () => {
        const conquistasHtml = Object.entries(conquistas).map(([id, conquista]) => `
            <div 
                class="conquista-item ${conquista.desbloqueada ? 'desbloqueada' : ''}" 
                data-tooltip-id="global-tooltip" 
                data-tooltip-content="${conquista.descricao}"
            >
                <div class="conquista-icon">${conquista.desbloqueada ? '🏆' : '🔒'}</div>
                <div class="conquista-text">
                    <strong>${conquista.titulo}</strong>
                </div>
            </div>
        `).join('');

        Swal.fire({
            title: 'Sala de Troféus',
            html: `<div class="conquistas-container">${conquistasHtml}</div>`,
            customClass: getSwalThemeClasses()
        });
    };

    const abrirModalConfig = () => {
        Swal.fire({
            title: 'Configurações de Tema',
            html: `
                <div class="theme-buttons-container">
                    <button id="light-mode-btn" class="theme-button">Modo Claro ☀️</button>
                    <button id="dark-mode-btn" class="theme-button">Modo Escuro 🌙</button>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            customClass: getSwalThemeClasses(),
            didOpen: () => {
                const lightBtn = document.getElementById('light-mode-btn');
                const darkBtn = document.getElementById('dark-mode-btn');

                lightBtn.addEventListener('click', () => {
                    setTheme('light');
                    Swal.close();
                });

                darkBtn.addEventListener('click', () => {
                    setTheme('dark');
                    Swal.close();
                });
            }
        });
    };

    return (
        <footer className={styles.footer}>
            <FaUserGraduate className={styles.footerIcon} onClick={abrirModalCreditos} title="Créditos" />
            <FaTrophy className={styles.footerIcon} onClick={abrirModalConquistas} title="Conquistas" />
            <FaCog className={styles.footerIcon} onClick={abrirModalConfig} title="Configurações" />
        </footer>
    );
}

export default Footer;