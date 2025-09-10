const axios = require('axios');

async function buscarCotacaoMoeda(codigoMoeda) {
    if (!codigoMoeda) return null;
    try {
        const apiKey = process.env.EXCHANGE_RATE_API_KEY;
        // Chamando a API ExchangeRate
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${codigoMoeda}`;
        const response = await axios.get(url);
        return response.data.conversion_rates.USD;
    } catch (error) {
        console.log(`(Aviso) Não foi possível buscar cotação para a moeda: ${codigoMoeda}`);
        return null;
    }
}

module.exports = {
    buscarCotacaoMoeda
};