const axios = require('axios');
const { dicionarioCapitais } = require('../config/traducoes');

let todosOsPaises = [];

// --- Funções de Ajuda ---
function pegarNElementosAleatorios(lista, n) {
    return lista.sort(() => 0.5 - Math.random()).slice(0, n);
}

// --- Lógica Principal do Serviço ---
async function carregarDadosDosPaises() {
    try {
        console.log("Buscando e processando dados dos países...");
        const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,capital,continents,currencies,translations');
        
        todosOsPaises = response.data
            .map(pais => {
                const currencyObject = pais.currencies ? Object.values(pais.currencies)[0] : null;
                const nomeDaMoeda = currencyObject ? currencyObject.name : null;
                const codigoDaMoeda = pais.currencies ? Object.keys(pais.currencies)[0] : null;
                
                // Lógica de tradução da capital
                const capitalIngles = pais.capital ? pais.capital[0] : null;
                const capitalTraduzida = dicionarioCapitais[capitalIngles] || capitalIngles;

                return {
                    nome: (pais.translations.por && pais.translations.por.common) || pais.name.common,
                    capital: capitalTraduzida, // Usamos a capital já traduzida
                    continente: pais.continents ? pais.continents[0] : null,
                    moeda: nomeDaMoeda,
                    codigoMoeda: codigoDaMoeda,
                };
            })
            .filter(pais => pais.nome && pais.capital && pais.moeda && pais.continente);
        
        console.log(`${todosOsPaises.length} países válidos carregados.`);
        return true;
    } catch (error) {
        console.error("Falha ao carregar dados dos países:", error.message);
        throw new Error("Não foi possível inicializar o serviço de países.");
    }
}

// --- Geradores de Pergunta ---
function gerarPerguntaPorCapital() {
    const opcoesDePaises = pegarNElementosAleatorios(todosOsPaises, 4);
    const paisCorreto = opcoesDePaises[0];
    return {
        tipo: "Capital",
        pergunta: `A qual país pertence a capital: ${paisCorreto.capital}?`,
        opcoes: opcoesDePaises.map(p => p.nome).sort(),
        resposta_correta: paisCorreto.nome,
    };
}

// --- Função Principal para Sortear uma Pergunta (usando Sessão) ---
function obterPerguntaAleatoria(req) {
    const geradores = [gerarPerguntaPorCapital];
    const geradorAleatorio = geradores[Math.floor(Math.random() * geradores.length)];
    
    const perguntaCompleta = geradorAleatorio();
    
    req.session.respostaCorreta = perguntaCompleta.resposta_correta;

    delete perguntaCompleta.resposta_correta;

    return perguntaCompleta;
}

// --- Função para Verificar a Resposta (usando Sessão) ---
function verificarResposta(req, suaResposta) {
    const respostaCorreta = req.session.respostaCorreta;

    if (!respostaCorreta) {
        return { resultado: "erro", mensagem: "Nenhuma pergunta ativa. Peça uma nova pergunta." };
    }

    const acertou = String(suaResposta).toLowerCase() === String(respostaCorreta).toLowerCase();

    delete req.session.respostaCorreta; 

    if (acertou) {
        return { resultado: "correto" };
    } else {
        return { resultado: "incorreto", resposta_certa: respostaCorreta };
    }
}

// --- Exportamos as funções ---
module.exports = {
    carregarDadosDosPaises,
    obterPerguntaAleatoria,
    verificarResposta
};