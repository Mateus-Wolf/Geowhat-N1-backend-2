function gerarPerguntaPorBandeira(paises, helper) {
    const opcoesDePaises = helper.pegarNElementosAleatorios(paises, 4);
    const paisCorreto = opcoesDePaises[0];
    
    return {
        tipo: "Bandeira",
        pergunta: "A qual país pertence esta bandeira?",
        opcoes: opcoesDePaises.map(p => p.nome).sort(),
        resposta_correta: paisCorreto.nome,
        flagUrl: paisCorreto.flagUrl 
    };
}

module.exports = gerarPerguntaPorBandeira;