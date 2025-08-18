#!/bin/bash
set -e

build_web() {
  cd web && npm run build && cd ..
}

build_service() {
  cd service
  if [ -d "../web/dist" ]; then
    rm -rf ./webapp
    cp -r ../web/dist/* ./webapp/
  else
    echo "Warning: ../web/dist directory not found. Skipping webapp copy."
  fi
  GOOS=linux GOARCH=arm64 GOARM= go build -ldflags "-s -w" -o ./dist/
  echo "Built for linux arm64 success..."
  GOOS=windows GOARCH=amd64 GOARM= go build -ldflags "-s -w -H=windowsgui" -o ./dist/
  echo "Built for windows amd64 success..."
  GOOS=linux GOARCH=amd64 GOARM= go build -ldflags "-s -w" -o ./dist/dmonitor_amd
  echo "Built for linux amd64 success..."
  
  cd ..
}

while true; do
  echo "Please choose:"
  echo "1. Build service (default)"
  echo "2. Build web"
  echo "3. Build web + service"
  read -p "Please enter your choice: " choice
  case "$choice" in
    1|"") build_service ;;
    2) build_web ;;
    3) build_web && build_service ;;
    *) echo "Invalid choice." ;;
  esac
  echo ""
done