@echo off
REM chcp 65001
setlocal enabledelayedexpansion

:menu
echo please choose:
echo 1. build service (default)
echo 2. build web
echo 3. build web + service
echo 4. make windows exe icon, ico.syso
set /p choice="please enter your choose: "

if "%choice%"=="" goto buildService
if "%choice%"=="1" (
  goto buildService
)
if "%choice%"=="2" (
  goto buildWeb
)
if "%choice%"=="3" (
  goto buildServiceWeb
)
if "%choice%"=="4" (
  cd service
  rsrc -ico="ico.ico" -o="ico.syso"
  goto menu
  exit
)

:buildWeb
cd web
call npm run build
cd ../
exit

:buildService
cd service
rmdir /S /Q .\webapp
xcopy /E /Y "..\web\dist\*" ".\webapp\"
@REM go env -w GOOS=linux
@REM go build -ldflags "-s -w" -o ./dist/
@REM echo "build linux success..."
@REM go env -w GOOS=linux GOARCH=arm  GOARM=7 
@REM go build -ldflags "-s -w" -o ./dist/dhttpc_v7
@REM echo "build linux-armv7 success..."
go env -w GOOS=linux GOARCH=arm64  GOARM= 
go build -ldflags "-s -w" -o ./dist/
echo "build linux-arm64 success..."
go env -w GOOS=windows GOARCH=amd64 GOARM=
@REM go build -o ./dist/dhttpc_debug.exe
go build -ldflags "-s -w -H=windowsgui" -o ./dist/
echo "build windows exe success..."
goto menu
exit

:buildServiceWeb
cd web
call npm run build
cd ../
goto buildService

timeout /t 1

goto menu
@REM pause
endlocal