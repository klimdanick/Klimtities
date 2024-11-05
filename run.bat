@echo off
setlocal

:: Start the application
npm start
if errorlevel 1 (
    echo Failed to start the application.
    exit /b %errorlevel%
)

endlocal
