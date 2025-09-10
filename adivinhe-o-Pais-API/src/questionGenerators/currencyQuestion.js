async function gerarPerguntaPorMoeda(paises, helpers) {
    const opcoesDePaises = helpers.pegarNElementosAleatorios(
        paises.filter(p => p.codigoMoeda), 4
    );
    
    const paisCorreto = opcoesDePaises[0];
    const moeda = paisCorreto.moeda;
    const opcoes = opcoesDePaises.map(p => p.nome).sort();
    
    const cotacao = await helpers.buscarCotacaoMoeda(paisCorreto.codigoMoeda);
    
    let dicaExtra = "Não foi possível obter a cotação desta moeda em tempo real.";
    if (cotacao) {
        dicaExtra = `Cotação atual: 1 ${paisCorreto.codigoMoeda} vale aproximadamente ${cotacao.toFixed(4)} USD.`;
    }
    // --------------------------------------------------

    return {
        tipo: "Moeda",
        pergunta: `A qual país pertence a moeda: "${moeda}"?`,
        opcoes: opcoes,
        resposta_correta: paisCorreto.nome,
        dica_extra: dicaExtra 
    };
}

module.exports = gerarPerguntaPorMoeda;