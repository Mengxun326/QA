@echo off
chcp 65001 >nul
echo ========================================
echo            Q&A平台一键启动脚本
echo ========================================
echo.

echo 正在检查Node.js环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo 正在检查npm环境...
npm --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到npm，请先安装npm
    pause
    exit /b 1
)

echo 环境检查完成！
echo.

echo 正在安装依赖包...
echo 1. 安装根目录依赖...
call npm install
if errorlevel 1 (
    echo 错误: 根目录依赖安装失败
    pause
    exit /b 1
)

echo 2. 安装服务器依赖...
cd server
call npm install
if errorlevel 1 (
    echo 错误: 服务器依赖安装失败
    pause
    exit /b 1
)
cd ..

echo 3. 安装客户端依赖...
cd client
call npm install
if errorlevel 1 (
    echo 错误: 客户端依赖安装失败
    pause
    exit /b 1
)
cd ..

echo 依赖安装完成！
echo.

echo 正在启动服务...
echo 注意: 服务器将在 http://localhost:5000 启动
echo 注意: 客户端将在 http://localhost:3000 启动
echo.

echo 按任意键开始启动服务...
pause >nul

echo 正在启动服务器和客户端...
start "Q&A服务器" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul
start "Q&A客户端" cmd /k "cd client && npm start"

echo.
echo ========================================
echo 服务启动完成！
echo 服务器: http://localhost:5000
echo 客户端: http://localhost:3000
echo ========================================
echo.
echo 按任意键退出启动脚本...
pause >nul 