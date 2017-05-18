@echo off
rem @echo %*
rem @echo %~dp0
node "%~dp0/../dist/tops-bundle.js" %*
@pause