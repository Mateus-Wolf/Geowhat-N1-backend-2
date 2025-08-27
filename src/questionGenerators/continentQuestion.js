function gerarPerguntaPorContinente(paises, helper) {
    const continentes = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
    const continenteSorteado = continentes[Math.floor(Math.random() * continentes.length)];

    const paisCorreto = helper.pegarNElementosAleatorios(
        paises.filter(p => p.continente === continenteSorteado), 1
    )[0];

    const paisesErrados = helper.pegarNElementosAleatorios(
        paises.filter(p => p.continente !== continenteSorteado), 3
    );

    const opcoes = [...paisesErrados.map(p => p.nome), paisCorreto.nome].sort();
    const nomeContinentePt = continenteSorteado === 'Americas' ? 'América' : continenteSorteado;

    return {
        tipo: "Continente",
        pergunta: `Qual destes países fica na ${nomeContinentePt}?`,
        opcoes: opcoes,
        resposta_correta: paisCorreto.nome,
    };
}

module.exports = gerarPerguntaPorContinente;