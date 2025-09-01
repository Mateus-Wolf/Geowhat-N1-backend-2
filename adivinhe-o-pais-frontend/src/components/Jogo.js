import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import styles from './Jogo.module.css';
import { useTheme } from '../context/ThemeContext';
import { useAchievements } from '../context/AchievementContext';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import TimerBar from './TimeBar';
import confetti from 'canvas-confetti';

function Jogo({ modo, voltarAoMenu }) {
    const { theme } = useTheme();
    const { desbloquearConquista } = useAchievements();
    const [pergunta, setPergunta] = useState(null);
    const [placar, setPlacar] = useState({ score: 0, vidas: 3 });
    const [feedback, setFeedback] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [statusResposta, setStatusResposta] = useState({ selecionada: null, correta: null });
    const [tempo, setTempo] = useState(60);
    const [acertosSeguidos, setAcertosSeguidos] = useState(0);

    const scoreControls = useAnimationControls();
    const vidasControls = useAnimationControls();
    const tempoControls = useAnimationControls();
    const tempoAnterior = useRef(tempo);
    const placarAnterior = useRef(placar);

    const buscarPergunta = useCallback(async () => {
        setCarregando(true);
        setFeedback('');
        setStatusResposta({ selecionada: null, correta: null });
        try {
            const response = await axios.get('http://localhost:3000/jogo/pergunta', { withCredentials: true });
            setPergunta(response.data);
        } catch (error) {
            console.error("Deu ruim pra buscar a pergunta!", error);
            setFeedback('Erro ao conectar com o servidor. Tente recarregar a página.');
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        setPlacar({ score: 0, vidas: 3 });
        setTempo(60);
        setAcertosSeguidos(0);
        buscarPergunta();
    }, [modo, buscarPergunta]);

    useEffect(() => {
        if (placar.score > placarAnterior.current.score) {
            scoreControls.start({
                scale: [1, 1.4, 1],
                transition: { duration: 0.4, times: [0, 0.2, 1] }
            });
        }
        if (placar.vidas < placarAnterior.current.vidas) {
            vidasControls.start({
                x: [0, -5, 5, -5, 0],
                transition: { duration: 0.4 }
            });
        }
        if (tempo > tempoAnterior.current) {
            tempoControls.start({
                scale: [1, 1.4, 1],
                color: ["#61dafb", "#28a745", "#61dafb"],
                transition: { duration: 0.8 }
            });
        }
        placarAnterior.current = placar;
        tempoAnterior.current = tempo;
    }, [placar, tempo, scoreControls, vidasControls, tempoControls]);

    useEffect(() => {
        if (modo === 'timeAttack' && !carregando && tempo > 0 && !statusResposta.selecionada) {
            const timerId = setInterval(() => {
                setTempo(t => t - 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [modo, carregando, tempo, statusResposta.selecionada]);

    useEffect(() => {
        if (modo === 'timeAttack' && tempo <= 0) {
            if(tempo < 0) setTempo(0); 
            
            if (placar.score >= 20) {
                desbloquearConquista('VELOZ_E_CURIOSO');
            }
            
            Swal.fire({
                title: 'Tempo Esgotado!',
                text: `Sua pontuação final foi: ${placar.score} pontos.`,
                icon: 'warning',
                confirmButtonText: 'Voltar ao Menu',
                customClass: {
                    popup: 'meu-modal-popup',
                    title: 'meu-modal-title',
                    htmlContainer: 'meu-modal-content',
                    confirmButton: 'meu-modal-confirm-button'
                }
            }).then(() => {
                voltarAoMenu();
            });
        }
    }, [modo, tempo, placar.score, voltarAoMenu, desbloquearConquista]);

    const handleResposta = async (respostaDoUsuario) => {
        if (carregando || statusResposta.selecionada) return;

        setCarregando(true);
        try {
            const response = await axios.post('http://localhost:3000/jogo/responder', 
                { sua_resposta: respostaDoUsuario }, { withCredentials: true }
            );

            const resultado = response.data;
            const respostaCorreta = resultado.resposta_certa || respostaDoUsuario;
            setStatusResposta({ selecionada: respostaDoUsuario, correta: respostaCorreta });

            if (resultado.resultado === 'correto') {
                setFeedback('Certa resposta! ✅');
                const novosAcertos = acertosSeguidos + 1;
                setAcertosSeguidos(novosAcertos);

                if (novosAcertos >= 5) {
                    desbloquearConquista('GENIO_GEOGRAFICO');
                }

                if (modo === 'timeAttack') {
                    const novoTempo = tempo + 2;
                    setTempo(novoTempo);
                    const novoPlacar = placar.score + 1;
                    setPlacar(p => ({ ...p, score: novoPlacar }));

                    if (novoPlacar >= 10 && novoTempo >= 50) {
                        desbloquearConquista('CONTRA_O_TEMPO');
                    }
                } else {
                    setPlacar({ score: resultado.score, vidas: resultado.vidas });
                }
            } else {
                setFeedback(`Errado! A resposta era ${respostaCorreta}. ❌`);
                setAcertosSeguidos(0);

                if (modo === 'timeAttack') {
                    setTempo(t => t - 10);
                } else {
                    setPlacar({ score: resultado.score, vidas: resultado.vidas });
                }
            }
            
            if (modo === 'classico' && resultado.mensagem) {
                if (resultado.score >= 5) {
                    desbloquearConquista('VITORIA_CLASSICA');
                    if (resultado.vidas === 3) {
                        desbloquearConquista('INTOCAVEL');
                    }
                    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
                }
                Swal.fire({
                    title: resultado.mensagem,
                    icon: resultado.score >= 5 ? 'success' : 'error',
                    confirmButtonText: 'Jogar Novamente',
                    customClass: {
                        popup: 'meu-modal-popup',
                        title: 'meu-modal-title',
                        confirmButton: 'meu-modal-confirm-button'
                    }
                }).then(() => {
                    setPlacar({ score: 0, vidas: 3 }); 
                    setAcertosSeguidos(0);
                    buscarPergunta();
                });
            } else {
                setTimeout(() => {
                    buscarPergunta();
                }, 2000);
            }

        } catch (error) {
            console.error("Deu ruim pra enviar a resposta!", error);
            setFeedback('Erro ao conectar com o servidor.');
            setCarregando(false);
        }
    };
    
    const getButtonClass = (opcao) => {
        if (!statusResposta.selecionada) { return styles.botaoOpcao; }
        if (opcao === statusResposta.correta) { return `${styles.botaoOpcao} ${styles.correto}`; }
        if (opcao === statusResposta.selecionada) { return `${styles.botaoOpcao} ${styles.incorreto}`; }
        return `${styles.botaoOpcao} ${styles.desabilitado}`;
    };

    if (!pergunta && carregando) { return <div>Carregando...</div>; }
    if (!pergunta) { return <div>Não foi possível carregar o jogo. Verifique se a API está no ar.</div>; }

    return (
        <div className={theme}> 
            <div className={styles.container}>
                <div className={styles.placar}>
                    <motion.p animate={scoreControls}>
                        <b>Pontos: {placar.score}</b>
                    </motion.p>
                    {modo === 'classico' ? (
                        <motion.div animate={vidasControls} className={styles.vidasContainer}>
                            <b>Vidas: </b>
                            <AnimatePresence>
                                {Array.from({ length: placar.vidas }).map((_, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >❤️</motion.span>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.p animate={tempoControls}>
                            <b>Tempo: {tempo < 0 ? 0 : tempo}s ⏳</b>
                        </motion.p>
                    )}
                </div>
                
                {modo === 'timeAttack' && <TimerBar tempo={tempo} tempoMaximo={60} />}
                
                <AnimatePresence mode="wait">
                    {!carregando && pergunta && (
                        <motion.div 
                            key={pergunta.pergunta}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.5 }}
                            className={styles.pergunta}
                        >
                            <h2>{pergunta.pergunta}</h2>
                            {pergunta.flagUrl && ( <img src={pergunta.flagUrl} alt="Bandeira do país" className={styles.bandeira} /> )}
                            {pergunta.dica_extra && <p><em>Dica: {pergunta.dica_extra}</em></p>}
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            key="feedback"
                            className={styles.feedback}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                        >
                            {feedback}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={styles.opcoes}>
                    {pergunta && pergunta.opcoes.map((opcao, index) => {
                        const hasAnswered = !!statusResposta.selecionada;
                        const isCorrect = opcao === statusResposta.correta;
                        const isSelected = opcao === statusResposta.selecionada;

                        return (
                            <motion.button 
                                key={index}
                                className={getButtonClass(opcao)}
                                onClick={() => handleResposta(opcao)}
                                disabled={carregando || hasAnswered}
                                whileHover={{ scale: hasAnswered ? 1 : 1.05 }}
                                whileTap={{ scale: hasAnswered ? 1 : 0.95 }}
                                animate={{
                                    opacity: hasAnswered && !isCorrect && !isSelected ? 0.5 : 1,
                                    scale: hasAnswered && !isCorrect && !isSelected ? 0.95 : 1
                                }}
                                initial={{ opacity: 0, x: -50 }}
                                transition={{ 
                                    delay: 0.5 + index * 0.1,
                                    duration: 0.3 
                                }}
                            >
                                {opcao}
                            </motion.button>
                        )
                    })}
                </div>
                <button onClick={voltarAoMenu} className={styles.menuButton}>Voltar ao Menu</button>
            </div>
        </div>
    );
}

export default Jogo;