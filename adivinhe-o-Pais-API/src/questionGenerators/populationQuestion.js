function gerarPerguntaPorPopulacao(paises, helper) {
    const opcoesDePaises = helper.pegarNElementosAleatorios(paises, 4);
    
    const paisCorreto = opcoesDePaises.reduce((maior, pais) => pais.population > maior.population ? pais : maior);
    
    return {
        tipo: "População",
        pergunta: "Qual destes países possui a maior população?",
        opcoes: opcoesDePaises.map(p => p.nome).sort(),
        resposta_correta: paisCorreto.nome,
    };
}

module.exports = gerarPerguntaPorPopulacao;