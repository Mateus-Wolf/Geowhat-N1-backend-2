function gerarPerguntaPorFronteira(paises, helper) {
    // Filtra para pegar apenas países que fazem fronteira com alguém
    const paisesComFronteira = paises.filter(p => p.borders.length > 0);
    const paisBase = helper.pegarNElementosAleatorios(paisesComFronteira, 1)[0];

    const codigoVizinho = paisBase.borders[Math.floor(Math.random() * paisBase.borders.length)];
    const paisCorreto = paises.find(p => p.cca3 === codigoVizinho);

    // Pega 3 países que NÃO fazem fronteira com o país base
    const paisesErrados = helper.pegarNElementosAleatorios(
        paises.filter(p => !paisBase.borders.includes(p.cca3) && p.cca3 !== paisBase.cca3), 3
    );

    const opcoes = [...paisesErrados.map(p => p.nome), paisCorreto.nome].sort();

    return {
        tipo: "Fronteira",
        pergunta: `Qual destes países faz fronteira com ${paisBase.nome}?`,
        opcoes: opcoes,
        resposta_correta: paisCorreto.nome,
    };
}

module.exports = gerarPerguntaPorFronteira;