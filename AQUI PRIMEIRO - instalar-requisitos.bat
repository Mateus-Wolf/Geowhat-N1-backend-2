@echo off
REM Define o titulo da janela do console
title Instalador de Requisitos - Jogo Adivinhe o Pais

echo ================================================
echo == INSTALANDO DEPENDENCIAS DO BACK-END...    ==
echo == Isso pode demorar alguns minutos.         ==
echo ================================================
cd adivinhe-o-Pais-API
call npm install

echo.
echo ================================================
echo == INSTALANDO DEPENDENCIAS DO FRONT-END...   ==
echo ================================================
cd ../adivinhe-o-pais-frontend
call npm install

echo.
echo ================================================
echo == TUDO PRONTO! INSTALACAO CONCLUIDA!       ==
echo ================================================
echo.
echo Agora voce pode fechar esta janela e rodar o arquivo 'iniciar-jogo.bat'.
pause