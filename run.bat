@echo off
setlocal

cd /d %~dp0

:: Start the application
npm start
if errorlevel 1 (
    echo Failed to start the application.
    exit /b %errorlevel%
)

endlocal
@pause
