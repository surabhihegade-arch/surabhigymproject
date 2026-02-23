@echo off
title Opening Surabhi Gym User Site
echo Starting server...
cd /d "%~dp0"
start /B node server.js
timeout /t 3 /nobreak > nul
echo Opening user portal...
start http://localhost:3001
exit
