@echo off
title RBI Compliance Bot Launcher
echo ==========================================
echo    Starting RBI Compliance Bot Services
echo ==========================================

:: Set the root directory
set ROOT_DIR=%~dp0

:: Start Backend
echo [1/2] Launching FastAPI Backend...
start "RBI Backend" /D "%ROOT_DIR%" cmd /k "python backend/main.py"

:: Start Frontend
echo [2/2] Launching React (Vite) Frontend...
start "RBI Frontend" /D "%ROOT_DIR%frontend" cmd /k "npm run dev"

echo.
echo ------------------------------------------
echo Success! 
echo.
echo Backend API:  http://localhost:8000
echo Frontend UI: http://localhost:5173
echo.
echo Keep the new windows open to keep the services running.
echo ------------------------------------------
pause
