function gerarPerguntaPorPopulacaoMinima(paises, helper) {
    const opcoesDePaises = helper.pegarNElementosAleatorios(paises, 4);
    
    const paisCorreto = opcoesDePaises.reduce((menor, pais) => pais.population < menor.population ? pais : menor);
    
    return {
        tipo: "População Mínima",
        pergunta: "Qual destes países possui a menor população?",
        opcoes: opcoesDePaises.map(p => p.nome).sort(),
        resposta_correta: paisCorreto.nome,
    };
}

module.exports = gerarPerguntaPorPopulacaoMinima;