function gerarPerguntaPorArea(paises, helper) {
    const opcoesDePaises = helper.pegarNElementosAleatorios(paises, 4);
    
    const paisCorreto = opcoesDePaises.reduce((maior, pais) => pais.area > maior.area ? pais : maior);
    
    return {
        tipo: "Território",
        pergunta: "Qual destes países possui o maior território?",
        opcoes: opcoesDePaises.map(p => p.nome).sort(),
        resposta_correta: paisCorreto.nome,
    };
}

module.exports = gerarPerguntaPorArea;