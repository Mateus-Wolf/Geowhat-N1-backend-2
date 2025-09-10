const gameService = require('./gameService');
const dataLoader = require('./dataLoader');
const { buscarCotacaoMoeda } = require('./apiHelpers'); 
const gerarPerguntaPorCapital = require('../questionGenerators/capitalQuestion');
const gerarPerguntaPorMoeda = require('../questionGenerators/currencyQuestion');
const gerarPerguntaPorIdioma = require('../questionGenerators/languageQuestion');
const gerarPerguntaPorBandeira = require('../questionGenerators/flagQuestion');
const gerarPerguntaPorPopulacao = require('../questionGenerators/populationQuestion');
const gerarPerguntaPorFronteira = require('../questionGenerators/borderQuestion');
const gerarPerguntaPorArea = require('../questionGenerators/areaQuestion');
const gerarPerguntaPorAreaMinima = require('../questionGenerators/areaMinimaQuestion');
const gerarPerguntaPorPopulacaoMinima = require('../questionGenerators/populationMinimaQuestion');

const helpers = {
    pegarNElementosAleatorios: (lista, n) => {
        return lista.sort(() => 0.5 - Math.random()).slice(0, n);
    },
    buscarCotacaoMoeda: buscarCotacaoMoeda
};

async function obterPerguntaAleatoria(req) {
    gameService.iniciarJogo(req);
    const todosOsPaises = dataLoader.getPaises();

    let geradoresDisponiveis = [
        gerarPerguntaPorCapital,
        gerarPerguntaPorMoeda,
        gerarPerguntaPorIdioma,
        gerarPerguntaPorBandeira,
        gerarPerguntaPorPopulacao,
        gerarPerguntaPorFronteira,
        gerarPerguntaPorArea,
        gerarPerguntaPorAreaMinima,
        gerarPerguntaPorPopulacaoMinima
    ];

    const isFromSwagger = req.headers.referer && req.headers.referer.includes('/api-docs');
    
    if (isFromSwagger) {
        console.log("equisição do Swagger detectada. Removendo pergunta de bandeira.");
        geradoresDisponiveis = geradoresDisponiveis.filter(g => g !== gerarPerguntaPorBandeira);
    }
    
    const geradorAleatorio = geradoresDisponiveis[Math.floor(Math.random() * geradoresDisponiveis.length)];
    
    const perguntaCompleta = await geradorAleatorio(todosOsPaises, helpers);
    
    console.log(`Resposta Certa: ${perguntaCompleta.resposta_correta}`);
    
    req.session.respostaCorreta = perguntaCompleta.resposta_correta;
    delete perguntaCompleta.resposta_correta;
    return perguntaCompleta;
}

function verificarResposta(req, suaResposta) {
    const respostaCorreta = req.session.respostaCorreta;
    if (!respostaCorreta) {
        return { resultado: "erro", mensagem: "Nenhuma pergunta ativa. Peça uma nova pergunta." };
    }
    
    delete req.session.respostaCorreta; 

    return gameService.processarResposta(req, suaResposta, respostaCorreta);
}

module.exports = {
    obterPerguntaAleatoria,
    verificarResposta
};