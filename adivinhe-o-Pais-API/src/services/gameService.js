function iniciarJogo(req) {
    if (req.session.score === undefined) {
        req.session.score = 0;
        req.session.vidas = 3;
        console.log(`Novo jogo iniciado para a sessão ${req.session.id}!`);
    }
}

function processarResposta(req, suaResposta, respostaCorreta) {
    const acertou = String(suaResposta).toLowerCase() === String(respostaCorreta).toLowerCase();

    if (acertou) {
        req.session.score += 1;
    } else {
        req.session.vidas -= 1;
    }
    
    console.log(`Sessão ${req.session.id}: Placar atualizado - ${req.session.score} pontos, ${req.session.vidas} vidas.`);

    const respostaParaUsuario = {
        resultado: acertou ? "correto" : "incorreto",
        score: req.session.score,
        vidas: req.session.vidas,
        resposta_certa: acertou ? undefined : respostaCorreta
    };

    // Verifica se o jogo acabou (vitória ou derrota)
    if (req.session.score >= 5) {
        respostaParaUsuario.mensagem = "PARABÉNS, VOCÊ VENCEU O JOGO! 🎉";
        delete req.session.score;
        delete req.session.vidas;
    } else if (req.session.vidas <= 0) {
        respostaParaUsuario.mensagem = "GAME OVER! 😢 Você perdeu todas as suas vidas.";
        delete req.session.score;
        delete req.session.vidas;
    }
    
    return respostaParaUsuario;
}

module.exports = {
    iniciarJogo,
    processarResposta
};