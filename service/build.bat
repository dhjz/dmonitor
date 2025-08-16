:: 后台运行程序exe
::go build -ldflags "-s -w -H=windowsgui"
:: go build -o ddns.exe
::cp -Force -r ../web/dist/* ./webapp/
rmdir /S /Q .\webapp
xcopy /E /Y "..\web\dist\*" ".\webapp\"

go env -w GOOS=linux
go build -ldflags "-s -w" -o ./dist/dmonitor_amd64

go env -w GOOS=linux GOARCH=arm64
go build -ldflags "-s -w" -o ./dist/dmonitor_arm64

go env -w GOOS=windows GOARCH=amd64
go build -ldflags "-s -w -H=windowsgui" -o ./dist/
:: go build -o ddns.exe

::cp -r ./webapp ./dist/

pause