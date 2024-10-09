@echo off
start cmd /k "npm start"
timeout /t 5 /nobreak >nul
start http://localhost:3001 