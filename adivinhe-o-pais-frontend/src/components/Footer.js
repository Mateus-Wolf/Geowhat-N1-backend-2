import React from 'react';
import { FaUserGraduate, FaCog } from 'react-icons/fa';
import Swal from 'sweetalert2';
import styles from './Footer.module.css';
import { useTheme } from '../context/ThemeContext';

function Footer() {
    const { setTheme } = useTheme();

    const abrirModalCreditos = () => {
        Swal.fire({
            title: 'Créditos do Projeto',
            html: `
                <div style="text-align: left; color: white;">
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
            background: '#282c34',
            color: '#ffffff',
            confirmButtonColor: '#61dafb'
        });
    };

    const abrirModalConfig = () => {
        Swal.fire({
            title: 'Configurações de Tema',
            // Usamos a propriedade 'html' para criar nossos botões
            html: `
                <div class="theme-buttons-container">
                    <button id="light-mode-btn" class="theme-button">Modo Claro ☀️</button>
                    <button id="dark-mode-btn" class="theme-button">Modo Escuro 🌙</button>
                </div>
            `,
            background: '#282c34',
            showConfirmButton: false, 
            showCloseButton: true,  
            color: '#ffffff',
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
            <FaCog className={styles.footerIcon} onClick={abrirModalConfig} title="Configurações" />
        </footer>
    );
}

export default Footer;