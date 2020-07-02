@echo off
yarn build
xcopy ".\build" "..\resources\app" /D /E /Y
