const axios = require('axios');
const { dicionarioCapitais } = require('../config/capitais');
const { dicionarioIdiomas } = require('../config/idiomas');
const gameService = require('./gameService');

const gerarPerguntaPorCapital = require('../questionGenerators/capitalQuestion');
const gerarPerguntaPorContinente = require('../questionGenerators/continentQuestion');
const gerarPerguntaPorMoeda = require('../questionGenerators/currencyQuestion');
const gerarPerguntaPorIdioma = require('../questionGenerators/languageQuestion');
const gerarPerguntaPorBandeira = require('../questionGenerators/flagQuestion');

let todosOsPaises = [];

async function buscarCotacaoMoeda(codigoMoeda) {
    if (!codigoMoeda) return null;
    try {
        const apiKey = process.env.EXCHANGE_RATE_API_KEY;
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${codigoMoeda}`;
        const response = await axios.get(url);
        return response.data.conversion_rates.USD;
    } catch (error) {
        console.log(`(Aviso) Não foi possível buscar cotação para a moeda: ${codigoMoeda}`);
        return null;
    }
}

const helpers = {
    pegarNElementosAleatorios: (lista, n) => {
        return lista.sort(() => 0.5 - Math.random()).slice(0, n);
    },
    buscarCotacaoMoeda: buscarCotacaoMoeda
};

// --- Lógica Principal ---
async function carregarDadosDosPaises() {
    try {
        console.log("Buscando e processando dados dos países...");
        const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,capital,continents,currencies,translations,languages,flags');
        
        todosOsPaises = response.data
            .map(pais => {
                const currencyObject = pais.currencies ? Object.values(pais.currencies)[0] : null;
                const nomeDaMoeda = currencyObject ? currencyObject.name : null;
                const codigoDaMoeda = pais.currencies ? Object.keys(pais.currencies)[0] : null;
                const capitalIngles = pais.capital ? pais.capital[0] : null;
                const capitalTraduzida = dicionarioCapitais[capitalIngles] || capitalIngles;
                const idiomaIngles = pais.languages ? Object.values(pais.languages)[0] : null;
                const idiomaTraduzido = dicionarioIdiomas[idiomaIngles] || idiomaIngles;

                return {
                    nome: (pais.translations.por && pais.translations.por.common) || pais.name.common,
                    capital: capitalTraduzida,
                    continente: pais.continents ? pais.continents[0] : null,
                    moeda: nomeDaMoeda,
                    codigoMoeda: codigoDaMoeda,
                    idioma: idiomaTraduzido,
                    flagUrl: pais.flags ? pais.flags.svg : null
                };
            })
            .filter(pais => pais.nome && pais.capital && pais.moeda && pais.continente && pais.idioma && pais.flagUrl);
        
        console.log(`${todosOsPaises.length} países válidos carregados.`);
        return true;
    } catch (error) {
        console.error("Falha ao carregar dados dos países:", error.message);
        throw new Error("Não foi possível inicializar o serviço de países.");
    }
}

// --- Orquestração das Perguntas ---
async function obterPerguntaAleatoria(req) {
    gameService.iniciarJogo(req);

    const geradores = [
        gerarPerguntaPorCapital,
        gerarPerguntaPorContinente,
        gerarPerguntaPorMoeda,
        gerarPerguntaPorIdioma,
        gerarPerguntaPorBandeira
    ];
    const geradorAleatorio = geradores[Math.floor(Math.random() * geradores.length)];
    
    const perguntaCompleta = await geradorAleatorio(todosOsPaises, helpers);
    
    req.session.respostaCorreta = perguntaCompleta.resposta_correta;
    delete perguntaCompleta.resposta_correta;
    return perguntaCompleta;
}

// --- Verificação de Resposta ---
function verificarResposta(req, suaResposta) {
    const respostaCorreta = req.session.respostaCorreta;
    if (!respostaCorreta) {
        return { resultado: "erro", mensagem: "Nenhuma pergunta ativa. Peça uma nova pergunta." };
    }
    
    delete req.session.respostaCorreta; 

    return gameService.processarResposta(req, suaResposta, respostaCorreta);
}

// --- Exports ---
module.exports = {
    carregarDadosDosPaises,
    obterPerguntaAleatoria,
    verificarResposta
};