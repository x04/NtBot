@echo off
cd frontend
call yarn build > nul
RD /S /Q "..\resources\app"
echo d | xcopy ".\build" "..\resources\app" /S /Y
cd ../
astilectron-bundler -v