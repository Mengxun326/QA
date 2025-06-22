@echo off
chcp 65001 >nul
echo ========================================
echo         Q&A平台管理员账号创建工具
echo ========================================
echo.

echo 正在检查Node.js环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo 正在检查依赖包...
if not exist "server\node_modules" (
    echo 正在安装服务器依赖包...
    cd server
    call npm install
    if errorlevel 1 (
        echo 错误: 服务器依赖包安装失败
        pause
        exit /b 1
    )
    cd ..
)

echo 正在启动管理员账号创建工具...
cd server
node create-admin.js
cd ..

echo.
echo 按任意键退出...
pause >nul 