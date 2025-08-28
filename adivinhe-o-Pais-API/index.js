require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const session = require('express-session');
const paisService = require('./src/services/paisServices');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));

app.use(session({
    secret: 'pode_ser_qualquer_texto_super_secreto_aqui_ninguem_pode_saber',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// ---- Configuração do Swagger ----
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API do Jogo "Adivinhe o País"',
            version: '1.0.0',
            description: 'Uma API que usa sessões e cookies para gerenciar um jogo de perguntas e respostas sobre países.'
        },
        servers: [{ url: `http://localhost:${PORT}` }]
    },
    apis: ['./index.js'],
};
const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


// ---- Endpoints da API ----

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retorna o status da API
 *     responses:
 *       200:
 *         description: A API está funcionando.
 */
app.get('/', (req, res) => {
    res.json({ status: "API do Jogo de Países rodando!", versao: "1.0.0" });
});

/**
 * @swagger
 * /jogo/pergunta:
 *   get:
 *     summary: Obtém uma nova pergunta aleatória
 *     description: Retorna uma pergunta e inicia/usa uma sessão para o jogador via cookie.
 *     responses:
 *       200:
 *         description: Pergunta gerada com sucesso.
 *       500:
 *         description: Erro interno no servidor.
 */
app.get('/jogo/pergunta', async (req, res) => {
    try {
        const pergunta = await paisService.obterPerguntaAleatoria(req);
        res.json(pergunta);
    } catch (error) {
        console.error("ERRO NO ENDPOINT /jogo/pergunta:", error);
        res.status(500).json({ erro: "Ops, algo deu errado ao gerar a pergunta." });
    }
});

/**
 * @swagger
 * /jogo/responder:
 *   post:
 *     summary: Valida a resposta de uma pergunta
 *     description: Usa a sessão ativa (via cookie) para verificar se a resposta está correta.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sua_resposta:
 *                 type: string
 *                 example: "Brasil"
 *     responses:
 *       200:
 *         description: Retorna se a resposta está correta ou incorreta.
 *       400:
 *         description: Requisição mal formatada.
 *       404:
 *         description: Nenhuma pergunta ativa na sessão.
 */
app.post('/jogo/responder', (req, res) => {
    const { sua_resposta } = req.body;
    if (sua_resposta === undefined) {
        return res.status(400).json({ erro: "Requisição mal formatada. Forneça 'sua_resposta'." });
    }
    const resultado = paisService.verificarResposta(req, sua_resposta);
    if (resultado.resultado === 'erro') {
        return res.status(404).json({ erro: resultado.mensagem });
    }
    res.json(resultado);
});


// ---- Inicialização do Servidor ----
async function iniciarServidor() {
    try {
        await paisService.carregarDadosDosPaises();
        app.listen(PORT, () => {
            console.log(`O jogo está na porta ${PORT}! 🚀`);
            console.log(`URL para jogar: http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error("O servidor não pôde ser iniciado.", error.message);
    }
}

iniciarServidor();
