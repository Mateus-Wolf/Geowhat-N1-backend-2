import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import styles from './Jogo.module.css';
import { useTheme } from '../context/ThemeContext';

function Jogo({ modo, voltarAoMenu }) {
    const { theme } = useTheme();
    const [pergunta, setPergunta] = useState(null);
    const [placar, setPlacar] = useState({ score: 0, vidas: 3 });
    const [feedback, setFeedback] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [statusResposta, setStatusResposta] = useState({ selecionada: null, correta: null });
    const [tempo, setTempo] = useState(60);

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
        // Zera o placar e o tempo ao iniciar um novo modo de jogo
        setPlacar({ score: 0, vidas: 3 });
        setTempo(60);
        buscarPergunta();
    }, [modo, buscarPergunta]);

    // useEffect para controlar o timer do Time Attack
    useEffect(() => {
        if (modo === 'timeAttack' && !carregando && tempo > 0 && !statusResposta.selecionada) {
            const timerId = setInterval(() => {
                setTempo(t => t - 1);
            }, 1000);
            return () => clearInterval(timerId); // Limpa o timer
        }
    }, [modo, carregando, tempo, statusResposta.selecionada]);

    // useEffect para verificar se o tempo acabou no Time Attack
    useEffect(() => {
        if (modo === 'timeAttack' && tempo === 0) {
            Swal.fire({
                title: 'Tempo Esgotado!',
                text: `Sua pontuação final foi: ${placar.score} pontos.`,
                icon: 'warning',
                confirmButtonText: 'Voltar ao Menu',
                background: '#282c34', color: '#ffffff'
            }).then(() => {
                voltarAoMenu();
            });
        }
    }, [modo, tempo, placar.score, voltarAoMenu]);

    const handleResposta = async (respostaDoUsuario) => {
        if (carregando || statusResposta.selecionada) return;

        setCarregando(true);
        try {
            const response = await axios.post('http://localhost:3000/jogo/responder', 
                { sua_resposta: respostaDoUsuario },
                { withCredentials: true }
            );

            const resultado = response.data;
            const respostaCorreta = resultado.resposta_certa || respostaDoUsuario;
            setStatusResposta({ selecionada: respostaDoUsuario, correta: respostaCorreta });

            if (resultado.resultado === 'correto') {
                setFeedback('Certa resposta! ✅');
                if (modo === 'timeAttack') {
                    setTempo(t => t + 2); // Adiciona 2 segundos por acerto
                    setPlacar(p => ({ ...p, score: p.score + 1 })); // Só atualiza os pontos
                } else {
                    setPlacar({ score: resultado.score, vidas: resultado.vidas });
                }
            } else {
                setFeedback(`Errado! A resposta era ${respostaCorreta}. ❌`);
                if (modo !== 'timeAttack') {
                    setPlacar({ score: resultado.score, vidas: resultado.vidas });
                }
            }
            
            if (modo === 'classico' && resultado.mensagem) {
                Swal.fire({
                    title: resultado.mensagem,
                    icon: resultado.score >= 5 ? 'success' : 'error',
                    confirmButtonText: 'Jogar Novamente',
                    background: '#282c34', color: '#ffffff', confirmButtonColor: '#61dafb'
                }).then(() => {
                    setPlacar({ score: 0, vidas: 3 }); 
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
        if (!statusResposta.selecionada) {
            return styles.botaoOpcao;
        }
        if (opcao === statusResposta.correta) {
            return `${styles.botaoOpcao} ${styles.correto}`;
        }
        if (opcao === statusResposta.selecionada) {
            return `${styles.botaoOpcao} ${styles.incorreto}`;
        }
        return `${styles.botaoOpcao} ${styles.desabilitado}`;
    };

    if (!pergunta && carregando) { return <div>Carregando...</div>; }
    if (!pergunta) { return <div>Não foi possível carregar o jogo. Verifique se a API está no ar.</div>; }

    return (
        <div className={theme}> 
            <div className={styles.container}>
                <div className={styles.placar}>
                    <p><b>Pontos: {placar.score}</b></p>
                    {modo === 'classico' ? (
                        <p><b>Vidas: {placar.vidas} ❤️</b></p>
                    ) : (
                        <p><b>Tempo: {tempo}s ⏳</b></p>
                    )}
                </div>
                <div className={styles.pergunta}>
                    <h2>{pergunta.pergunta}</h2>
                    {pergunta.flagUrl && (
                        <img src={pergunta.flagUrl} alt="Bandeira do país" className={styles.bandeira} />
                    )}
                    {pergunta.dica_extra && <p><em>Dica: {pergunta.dica_extra}</em></p>}
                </div>
                
                {feedback && <div className={styles.feedback}>{feedback}</div>}

                <div className={styles.opcoes}>
                    {pergunta.opcoes.map((opcao, index) => (
                        <button 
                            key={index}
                            className={getButtonClass(opcao)}
                            onClick={() => handleResposta(opcao)}
                            disabled={carregando || statusResposta.selecionada}
                        >
                            {opcao}
                        </button>
                    ))}
                </div>
                <button onClick={voltarAoMenu} className={styles.menuButton}>Voltar ao Menu</button>
            </div>
        </div>
    );
}

export default Jogo;