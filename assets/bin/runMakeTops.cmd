@echo off
rem @echo %*
rem @echo %~dp0
node "%~dp0/../dist/src/index.js" %*
@pause