@echo off
chcp 65001 > nul
echo ========================================================
echo   啟動 3D 病毒互動探索百科 (3D Virus Exploration Lab)
echo ========================================================
echo.
echo 正在開啟瀏覽器...
start http://localhost:8899/index.html
echo.
echo 正在本機啟動 Web 服務 (Port: 8899)...
python -m http.server 8899
pause
