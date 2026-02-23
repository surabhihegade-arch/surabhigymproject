@echo off
title Opening Surabhi Gym Admin Panel
echo Starting server...
cd /d "%~dp0"
start /B node server.js
timeout /t 3 /nobreak > nul
echo Opening admin panel...
start http://localhost:3001/admin.html
exit
