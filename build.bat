@echo off
chcp 65001 >nul
title Q&A平台前后端打包工具

echo 🚀 开始打包Q&A问答平台...
echo.

:: 设置变量
set "VERSION=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "VERSION=%VERSION: =0%"
set "PACKAGE_NAME=qa-platform-%VERSION%"
set "BUILD_DIR=build"
set "DIST_DIR=dist"

echo 📦 打包版本: %VERSION%
echo.

:: 清理旧的构建文件
echo 1. 清理旧的构建文件...
if exist %BUILD_DIR% rmdir /s /q %BUILD_DIR%
if exist %DIST_DIR% rmdir /s /q %DIST_DIR%
mkdir %BUILD_DIR%
mkdir %DIST_DIR%

:: 检查Node.js和npm
echo 2. 检查环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到npm，请先安装npm
    pause
    exit /b 1
)

echo Node.js版本:
node --version
echo npm版本:
npm --version
echo.

:: 安装后端依赖
echo 3. 安装后端依赖...
cd server
if not exist "package.json" (
    echo 错误: 未找到server/package.json
    pause
    exit /b 1
)

call npm install --production
if errorlevel 1 (
    echo 后端依赖安装失败
    pause
    exit /b 1
)
cd ..

:: 构建前端
echo 4. 构建前端项目...
cd client
if not exist "package.json" (
    echo 错误: 未找到client/package.json
    pause
    exit /b 1
)

:: 安装前端依赖
call npm install
if errorlevel 1 (
    echo 前端依赖安装失败
    pause
    exit /b 1
)

:: 设置生产环境变量
set "REACT_APP_API_URL=/api"
set "GENERATE_SOURCEMAP=false"

:: 构建前端
call npm run build
if errorlevel 1 (
    echo 前端构建失败
    pause
    exit /b 1
)
cd ..

:: 复制文件到构建目录
echo 5. 复制项目文件...

:: 复制后端文件
echo 复制后端文件...
mkdir %BUILD_DIR%\server
copy server\*.js %BUILD_DIR%\server\ >nul
copy server\package*.json %BUILD_DIR%\server\ >nul
xcopy server\routes %BUILD_DIR%\server\routes\ /e /i /q >nul
xcopy server\middleware %BUILD_DIR%\server\middleware\ /e /i /q >nul
xcopy server\config %BUILD_DIR%\server\config\ /e /i /q >nul
copy server\config.env.example %BUILD_DIR%\server\ >nul

:: 复制后端依赖
xcopy server\node_modules %BUILD_DIR%\server\node_modules\ /e /i /q >nul

:: 复制前端构建文件
echo 复制前端构建文件...
mkdir %BUILD_DIR%\client
xcopy client\build %BUILD_DIR%\client\build\ /e /i /q >nul
copy client\package.json %BUILD_DIR%\client\ >nul

:: 复制配置文件
echo 复制配置文件...
copy database.sql %BUILD_DIR%\ >nul
copy ecosystem.config.js %BUILD_DIR%\ >nul
copy nginx.conf.template %BUILD_DIR%\ >nul
copy 宝塔部署指南.md %BUILD_DIR%\ >nul
copy 宝塔部署快速指南.md %BUILD_DIR%\ >nul

:: 创建安装脚本
echo 6. 创建部署脚本...
(
echo #!/bin/bash
echo.
echo # Q&A平台安装脚本
echo echo "🚀 开始安装Q&A问答平台..."
echo.
echo # 检查是否为root用户
echo if [ "$EUID" -ne 0 ]; then 
echo     echo "请使用root权限运行此脚本"
echo     exit 1
echo fi
echo.
echo # 设置项目路径
echo PROJECT_PATH="/www/wwwroot/qa-platform"
echo.
echo echo "1. 创建项目目录..."
echo mkdir -p $PROJECT_PATH
echo cp -r ./* $PROJECT_PATH/
echo.
echo echo "2. 设置权限..."
echo chown -R www:www $PROJECT_PATH
echo chmod -R 755 $PROJECT_PATH
echo.
echo echo "3. 配置环境变量..."
echo if [ ! -f "$PROJECT_PATH/server/config.env" ]; then
echo     cp $PROJECT_PATH/server/config.env.example $PROJECT_PATH/server/config.env
echo     echo "请编辑 $PROJECT_PATH/server/config.env 配置数据库信息"
echo fi
echo.
echo echo "4. 导入数据库..."
echo echo "请在宝塔面板中创建数据库并导入 database.sql 文件"
echo.
echo echo "5. 配置PM2..."
echo cd $PROJECT_PATH
echo pm2 start ecosystem.config.js --env production
echo pm2 save
echo pm2 startup
echo.
echo echo "✅ 安装完成！"
echo echo "请按照部署指南配置Nginx和SSL证书"
) > %BUILD_DIR%\install.sh

:: 创建版本信息文件
echo 7. 创建版本信息...
(
echo Q&A问答平台 - 生产版本
echo.
echo 构建版本: %VERSION%
echo 构建时间: %date% %time%
echo 构建平台: Windows
echo.
echo 包含内容:
echo - 后端服务 ^(Node.js + Express^)
echo - 前端应用 ^(React构建版本^)
echo - 数据库脚本 ^(MySQL^)
echo - 配置文件 ^(Nginx, PM2^)
echo - 部署文档
echo.
echo 安装说明:
echo 1. 解压到服务器 /www/wwwroot/qa-platform
echo 2. 运行 bash install.sh
echo 3. 按照部署指南配置数据库和Nginx
echo 4. 访问域名完成部署
) > %BUILD_DIR%\VERSION.txt

:: 创建README文件
(
echo # Q&A问答平台 - 生产部署包
echo.
echo ## 📦 包含内容
echo.
echo - **server/**: 后端服务文件
echo - **client/build/**: 前端构建文件
echo - **database.sql**: 数据库初始化脚本
echo - **ecosystem.config.js**: PM2配置文件
echo - **nginx.conf.template**: Nginx配置模板
echo - **install.sh**: 自动安装脚本
echo - **宝塔部署指南.md**: 详细部署文档
echo.
echo ## 🚀 快速安装
echo.
echo 1. 上传此文件夹到服务器 `/www/wwwroot/qa-platform`
echo 2. 运行安装脚本：`bash install.sh`
echo 3. 按照部署指南配置数据库和Nginx
echo.
echo ## 📋 系统要求
echo.
echo - Linux服务器 ^(CentOS 7+ / Ubuntu 18+^)
echo - 宝塔面板 7.0+
echo - Node.js 16+
echo - MySQL 5.7+
echo - Nginx
echo.
echo ## 📞 技术支持
echo.
echo 详细部署说明请查看 `宝塔部署指南.md`
) > %BUILD_DIR%\README.md

:: 打包成压缩文件
echo 8. 创建部署包...

:: 检查是否有7zip或WinRAR
where 7z >nul 2>&1
if not errorlevel 1 (
    echo 使用7zip压缩...
    7z a -tzip %DIST_DIR%\%PACKAGE_NAME%.zip %BUILD_DIR%\* >nul
) else (
    where winrar >nul 2>&1
    if not errorlevel 1 (
        echo 使用WinRAR压缩...
        winrar a -afzip %DIST_DIR%\%PACKAGE_NAME%.zip %BUILD_DIR%\* >nul
    ) else (
        echo 警告: 未找到7zip或WinRAR，无法创建压缩包
        echo 请手动压缩 %BUILD_DIR% 文件夹
    )
)

:: 清理临时构建目录
rmdir /s /q %BUILD_DIR%

echo.
echo ✅ 打包完成！
echo.
echo 📋 打包信息:
echo 版本号: %VERSION%
echo 打包时间: %date% %time%
echo.
echo 📦 生成的文件:
if exist %DIST_DIR%\%PACKAGE_NAME%.zip (
    echo zip包: %DIST_DIR%\%PACKAGE_NAME%.zip
) else (
    echo 构建文件夹: %BUILD_DIR%\ ^(需要手动压缩^)
)
echo.
echo 🚀 部署说明:
echo 1. 将压缩包上传到服务器并解压到 /www/wwwroot/qa-platform
echo 2. 运行 bash install.sh 进行安装
echo 3. 按照部署指南配置数据库和Nginx
echo.
echo 🎉 打包成功！可以开始部署了！
echo.
pause 