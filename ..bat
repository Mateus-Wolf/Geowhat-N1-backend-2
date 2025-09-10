@echo off
title Iniciando o Jogo...

echo INICIANDO SERVIDOR BACK-END...
cd adivinhe-o-Pais-API
REM
start "Servidor Back-end" npm start

echo.
echo INICIANDO APLICACAO FRONT-END...
cd ../adivinhe-o-pais-frontend
start "Aplicacao Front-end" npm start

echo.
echo O jogo deve abrir no seu navegador em alguns instantes.
echo Pode fechar esta janela.
REM
timeout /t 5 >nul