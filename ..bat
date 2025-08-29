@echo off
title Iniciando o Jogo...

echo INICIANDO SERVIDOR BACK-END...
cd adivinhe-o-Pais-API
REM O comando 'start' abre uma nova janela de terminal para nao travar o script
start "Servidor Back-end" npm start

echo.
echo INICIANDO APLICACAO FRONT-END...
cd ../adivinhe-o-pais-frontend
start "Aplicacao Front-end" npm start

echo.
echo O jogo deve abrir no seu navegador em alguns instantes.
echo Pode fechar esta janela.
REM Pausa por 5 segundos antes de fechar
timeout /t 5 >nul