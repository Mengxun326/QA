# Q&A平台一键启动脚本 (PowerShell版本)
# 设置控制台编码为UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "            Q&A平台一键启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查Node.js环境
Write-Host "正在检查Node.js环境..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Node.js未安装"
    }
    Write-Host "Node.js版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "错误: 未找到Node.js，请先安装Node.js" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

# 检查npm环境
Write-Host "正在检查npm环境..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "npm未安装"
    }
    Write-Host "npm版本: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "错误: 未找到npm，请先安装npm" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host "环境检查完成！" -ForegroundColor Green
Write-Host ""

# 安装依赖包
Write-Host "正在安装依赖包..." -ForegroundColor Yellow

Write-Host "1. 安装根目录依赖..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "错误: 根目录依赖安装失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host "2. 安装服务器依赖..." -ForegroundColor Cyan
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "错误: 服务器依赖安装失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Set-Location ..

Write-Host "3. 安装客户端依赖..." -ForegroundColor Cyan
Set-Location client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "错误: 客户端依赖安装失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Set-Location ..

Write-Host "依赖安装完成！" -ForegroundColor Green
Write-Host ""

Write-Host "正在启动服务..." -ForegroundColor Yellow
Write-Host "注意: 服务器将在 http://localhost:5000 启动" -ForegroundColor Cyan
Write-Host "注意: 客户端将在 http://localhost:3000 启动" -ForegroundColor Cyan
Write-Host ""

$continue = Read-Host "按回车键开始启动服务"

Write-Host "正在启动服务器和客户端..." -ForegroundColor Yellow

# 启动服务器
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev" -WindowStyle Normal

# 等待3秒
Start-Sleep -Seconds 3

# 启动客户端
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "服务启动完成！" -ForegroundColor Green
Write-Host "服务器: http://localhost:5000" -ForegroundColor Cyan
Write-Host "客户端: http://localhost:3000" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Read-Host "按回车键退出启动脚本" 