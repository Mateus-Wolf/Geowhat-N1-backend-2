const axios = require('axios');
const { dicionarioCapitais } = require('../config/capitais');
const { dicionarioIdiomas } = require('../config/idiomas');

let todosOsPaises = [];

async function carregarDadosDosPaises() {
    if (todosOsPaises.length > 0) return todosOsPaises;

    try {
        console.log("Buscando e processando dados dos países...");
        const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,capital,currencies,translations,languages,flags,area,population,borders,cca3');
        
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
                    moeda: nomeDaMoeda,
                    codigoMoeda: codigoDaMoeda,
                    idioma: idiomaTraduzido,
                    flagUrl: pais.flags ? pais.flags.svg : null,
                    area: pais.area,
                    population: pais.population,
                    borders: pais.borders || [],
                    cca3: pais.cca3
                };
            })
            .filter(pais => pais.nome && pais.capital && pais.moeda && pais.idioma && pais.flagUrl && pais.cca3 && pais.area);
        
        console.log(`${todosOsPaises.length} países válidos carregados.`);
        return todosOsPaises;
    } catch (error) {
        console.error("Falha ao carregar dados dos países:", error.message);
        throw new Error("Não foi possível inicializar o serviço de dados.");
    }
}

function getPaises() {
    return todosOsPaises;
}

module.exports = {
    carregarDadosDosPaises,
    getPaises
};