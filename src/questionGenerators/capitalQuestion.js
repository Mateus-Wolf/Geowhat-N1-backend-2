function gerarPerguntaPorCapital(paises, helper) {
    const opcoesDePaises = helper.pegarNElementosAleatorios(paises, 4);
    const paisCorreto = opcoesDePaises[0];
    return {
        tipo: "Capital",
        pergunta: `A qual país pertence a capital: ${paisCorreto.capital}?`,
        opcoes: opcoesDePaises.map(p => p.nome).sort(),
        resposta_correta: paisCorreto.nome,
    };
}

module.exports = gerarPerguntaPorCapital;