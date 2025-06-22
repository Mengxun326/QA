#!/bin/bash

# Q&A平台自动部署脚本
# 使用方法: bash deploy.sh

echo "🚀 开始部署Q&A问答平台..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}请使用root权限运行此脚本${NC}"
    exit 1
fi

# 设置项目路径
PROJECT_PATH="/www/wwwroot/qa-platform"
SERVER_PATH="$PROJECT_PATH/server"
CLIENT_PATH="$PROJECT_PATH/client"

echo -e "${YELLOW}1. 检查项目目录...${NC}"
if [ ! -d "$PROJECT_PATH" ]; then
    echo -e "${RED}项目目录不存在: $PROJECT_PATH${NC}"
    echo "请先将项目文件上传到服务器"
    exit 1
fi

echo -e "${YELLOW}2. 设置目录权限...${NC}"
chown -R www:www $PROJECT_PATH
chmod -R 755 $PROJECT_PATH

echo -e "${YELLOW}3. 安装后端依赖...${NC}"
cd $SERVER_PATH
if [ ! -f "package.json" ]; then
    echo -e "${RED}未找到后端package.json文件${NC}"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}后端依赖安装失败${NC}"
    exit 1
fi

echo -e "${YELLOW}4. 检查环境变量配置...${NC}"
if [ ! -f "$SERVER_PATH/config.env" ]; then
    echo -e "${YELLOW}创建环境变量配置文件...${NC}"
    cp $SERVER_PATH/config.env.example $SERVER_PATH/config.env
    echo -e "${RED}请编辑 $SERVER_PATH/config.env 文件，配置数据库信息${NC}"
    echo "配置完成后，请重新运行此脚本"
    exit 1
fi

echo -e "${YELLOW}5. 安装前端依赖...${NC}"
cd $CLIENT_PATH
if [ ! -f "package.json" ]; then
    echo -e "${RED}未找到前端package.json文件${NC}"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}前端依赖安装失败${NC}"
    exit 1
fi

echo -e "${YELLOW}6. 构建前端项目...${NC}"
# 设置生产环境变量
export REACT_APP_API_URL="/api"
export GENERATE_SOURCEMAP=false

npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}前端构建失败${NC}"
    exit 1
fi

echo -e "${YELLOW}7. 配置PM2...${NC}"
cd $PROJECT_PATH

# 检查PM2是否安装
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}安装PM2...${NC}"
    npm install -g pm2
fi

# 停止旧的应用（如果存在）
pm2 stop qa-platform-server 2>/dev/null || true
pm2 delete qa-platform-server 2>/dev/null || true

# 创建日志目录
mkdir -p $PROJECT_PATH/logs

# 启动应用
pm2 start ecosystem.config.js --env production
if [ $? -ne 0 ]; then
    echo -e "${RED}PM2启动失败${NC}"
    exit 1
fi

# 保存PM2配置
pm2 save
pm2 startup

echo -e "${YELLOW}8. 检查应用状态...${NC}"
sleep 3
pm2 status

echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""
echo -e "${YELLOW}📋 部署信息:${NC}"
echo "项目路径: $PROJECT_PATH"
echo "前端构建目录: $CLIENT_PATH/build"
echo "后端服务端口: 5000"
echo ""
echo -e "${YELLOW}🔧 下一步操作:${NC}"
echo "1. 在宝塔面板中添加网站，根目录设置为: $CLIENT_PATH/build"
echo "2. 配置Nginx反向代理，将 /api 请求转发到 http://127.0.0.1:5000"
echo "3. 配置SSL证书（推荐）"
echo "4. 创建管理员账户: cd $SERVER_PATH && npm run create-admin"
echo ""
echo -e "${YELLOW}📊 监控命令:${NC}"
echo "查看应用状态: pm2 status"
echo "查看应用日志: pm2 logs qa-platform-server"
echo "重启应用: pm2 restart qa-platform-server"
echo ""
echo -e "${GREEN}🎉 祝您部署成功！${NC}" 