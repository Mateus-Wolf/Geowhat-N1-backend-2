function gerarPerguntaPorAreaMinima(paises, helper) {
    const opcoesDePaises = helper.pegarNElementosAleatorios(paises, 4);
    
    const paisCorreto = opcoesDePaises.reduce((menor, pais) => pais.area < menor.area ? pais : menor);
    
    return {
        tipo: "Território Mínimo",
        pergunta: "Qual destes países possui o menor território?",
        opcoes: opcoesDePaises.map(p => p.nome).sort(),
        resposta_correta: paisCorreto.nome,
    };
}

module.exports = gerarPerguntaPorAreaMinima;