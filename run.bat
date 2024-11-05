@echo off
setlocal

cd /d %~dp0

git pull

:: Install npm dependencies
call npm install
if errorlevel 1 (
    echo npm install failed.
    exit /b %errorlevel%
)

:: Start the application
npm start
if errorlevel 1 (
    echo Failed to start the application.
    exit /b %errorlevel%
)

endlocal
@pause
