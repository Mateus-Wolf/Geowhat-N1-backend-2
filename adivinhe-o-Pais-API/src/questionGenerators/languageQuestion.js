function gerarPerguntaPorIdioma(paises, helper) {
    const paisesComIdioma = paises.filter(p => p.idioma);
    const opcoesDePaises = helper.pegarNElementosAleatorios(paisesComIdioma, 4);
    const paisCorreto = opcoesDePaises[0];
    
    return {
        tipo: "Idioma",
        pergunta: `Qual destes países tem "${paisCorreto.idioma}" como um dos idiomas oficiais?`,
        opcoes: opcoesDePaises.map(p => p.nome).sort(),
        resposta_correta: paisCorreto.nome,
    };
}

module.exports = gerarPerguntaPorIdioma;