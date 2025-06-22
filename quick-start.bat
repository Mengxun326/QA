@echo off
chcp 65001 >nul
echo ========================================
echo         Q&A平台快速启动脚本
echo ========================================
echo.

echo 正在启动服务...
echo 服务器: http://localhost:5000
echo 客户端: http://localhost:3000
echo.

echo 正在启动服务器和客户端...
start "Q&A服务器" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul
start "Q&A客户端" cmd /k "cd client && npm start"

echo 服务启动完成！
echo 请等待浏览器自动打开... 