@echo off
chcp 65001 >nul
echo ========================================
echo         Q&A平台依赖修复工具
echo ========================================
echo.

echo 正在检查Node.js环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo 正在安装根目录依赖...
call npm install
if errorlevel 1 (
    echo 错误: 根目录依赖安装失败
    pause
    exit /b 1
)

echo 正在安装服务器依赖...
cd server
call npm install
if errorlevel 1 (
    echo 错误: 服务器依赖安装失败
    pause
    exit /b 1
)
cd ..

echo 正在安装客户端依赖...
cd client
call npm install
if errorlevel 1 (
    echo 错误: 客户端依赖安装失败
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo 依赖安装完成！
echo ========================================
echo.
echo 现在您可以运行以下命令：
echo 1. 创建管理员账号: npm run create-admin
echo 2. 启动开发服务器: npm run dev
echo 3. 快速启动: quick-start.bat
echo.
echo 按任意键退出...
pause >nul 