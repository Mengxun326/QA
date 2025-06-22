#!/bin/bash

# Q&A平台前后端打包脚本
# 使用方法: bash build.sh

echo "🚀 开始打包Q&A问答平台..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取当前日期作为版本号
VERSION=$(date +"%Y%m%d_%H%M%S")
PACKAGE_NAME="qa-platform-${VERSION}"
BUILD_DIR="./build"
DIST_DIR="./dist"

echo -e "${BLUE}📦 打包版本: ${VERSION}${NC}"

# 清理旧的构建文件
echo -e "${YELLOW}1. 清理旧的构建文件...${NC}"
rm -rf $BUILD_DIR
rm -rf $DIST_DIR
mkdir -p $BUILD_DIR
mkdir -p $DIST_DIR

# 检查Node.js和npm
echo -e "${YELLOW}2. 检查环境...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: 未找到Node.js，请先安装Node.js${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}错误: 未找到npm，请先安装npm${NC}"
    exit 1
fi

echo "Node.js版本: $(node --version)"
echo "npm版本: $(npm --version)"

# 安装后端依赖
echo -e "${YELLOW}3. 安装后端依赖...${NC}"
cd server
if [ ! -f "package.json" ]; then
    echo -e "${RED}错误: 未找到server/package.json${NC}"
    exit 1
fi

npm install --production
if [ $? -ne 0 ]; then
    echo -e "${RED}后端依赖安装失败${NC}"
    exit 1
fi
cd ..

# 构建前端
echo -e "${YELLOW}4. 构建前端项目...${NC}"
cd client
if [ ! -f "package.json" ]; then
    echo -e "${RED}错误: 未找到client/package.json${NC}"
    exit 1
fi

# 安装前端依赖
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}前端依赖安装失败${NC}"
    exit 1
fi

# 设置生产环境变量
export REACT_APP_API_URL="/api"
export GENERATE_SOURCEMAP=false

# 构建前端
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}前端构建失败${NC}"
    exit 1
fi
cd ..

# 复制文件到构建目录
echo -e "${YELLOW}5. 复制项目文件...${NC}"

# 复制后端文件
echo "复制后端文件..."
mkdir -p $BUILD_DIR/server
cp -r server/*.js $BUILD_DIR/server/
cp -r server/package*.json $BUILD_DIR/server/
cp -r server/routes $BUILD_DIR/server/
cp -r server/middleware $BUILD_DIR/server/
cp -r server/config $BUILD_DIR/server/
cp server/config.env.example $BUILD_DIR/server/

# 复制后端依赖
cp -r server/node_modules $BUILD_DIR/server/

# 复制前端构建文件
echo "复制前端构建文件..."
mkdir -p $BUILD_DIR/client
cp -r client/build $BUILD_DIR/client/
cp client/package.json $BUILD_DIR/client/

# 复制配置文件
echo "复制配置文件..."
cp database.sql $BUILD_DIR/
cp ecosystem.config.js $BUILD_DIR/
cp nginx.conf.template $BUILD_DIR/
cp 宝塔部署指南.md $BUILD_DIR/
cp 宝塔部署快速指南.md $BUILD_DIR/

# 创建部署脚本
echo -e "${YELLOW}6. 创建部署脚本...${NC}"
cat > $BUILD_DIR/install.sh << 'EOF'
#!/bin/bash

# Q&A平台安装脚本
echo "🚀 开始安装Q&A问答平台..."

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then 
    echo "请使用root权限运行此脚本"
    exit 1
fi

# 设置项目路径
PROJECT_PATH="/www/wwwroot/qa-platform"

echo "1. 创建项目目录..."
mkdir -p $PROJECT_PATH
cp -r ./* $PROJECT_PATH/

echo "2. 设置权限..."
chown -R www:www $PROJECT_PATH
chmod -R 755 $PROJECT_PATH

echo "3. 配置环境变量..."
if [ ! -f "$PROJECT_PATH/server/config.env" ]; then
    cp $PROJECT_PATH/server/config.env.example $PROJECT_PATH/server/config.env
    echo "请编辑 $PROJECT_PATH/server/config.env 配置数据库信息"
fi

echo "4. 导入数据库..."
echo "请在宝塔面板中创建数据库并导入 database.sql 文件"

echo "5. 配置PM2..."
cd $PROJECT_PATH
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

echo "✅ 安装完成！"
echo "请按照部署指南配置Nginx和SSL证书"
EOF

chmod +x $BUILD_DIR/install.sh

# 创建版本信息文件
echo -e "${YELLOW}7. 创建版本信息...${NC}"
cat > $BUILD_DIR/VERSION.txt << EOF
Q&A问答平台 - 生产版本

构建版本: ${VERSION}
构建时间: $(date)
Node.js版本: $(node --version)
npm版本: $(npm --version)

包含内容:
- 后端服务 (Node.js + Express)
- 前端应用 (React构建版本)
- 数据库脚本 (MySQL)
- 配置文件 (Nginx, PM2)
- 部署文档

安装说明:
1. 解压到服务器 /www/wwwroot/qa-platform
2. 运行 bash install.sh
3. 按照部署指南配置数据库和Nginx
4. 访问域名完成部署
EOF

# 创建README文件
cat > $BUILD_DIR/README.md << 'EOF'
# Q&A问答平台 - 生产部署包

## 📦 包含内容

- **server/**: 后端服务文件
- **client/build/**: 前端构建文件
- **database.sql**: 数据库初始化脚本
- **ecosystem.config.js**: PM2配置文件
- **nginx.conf.template**: Nginx配置模板
- **install.sh**: 自动安装脚本
- **宝塔部署指南.md**: 详细部署文档

## 🚀 快速安装

1. 上传此文件夹到服务器 `/www/wwwroot/qa-platform`
2. 运行安装脚本：`bash install.sh`
3. 按照部署指南配置数据库和Nginx

## 📋 系统要求

- Linux服务器 (CentOS 7+ / Ubuntu 18+)
- 宝塔面板 7.0+
- Node.js 16+
- MySQL 5.7+
- Nginx

## 📞 技术支持

详细部署说明请查看 `宝塔部署指南.md`
EOF

# 打包成压缩文件
echo -e "${YELLOW}8. 创建部署包...${NC}"

# 创建tar.gz压缩包
cd $BUILD_DIR
tar -czf "../${DIST_DIR}/${PACKAGE_NAME}.tar.gz" .
cd ..

# 创建zip压缩包（Windows兼容）
cd $BUILD_DIR
zip -r "../${DIST_DIR}/${PACKAGE_NAME}.zip" . > /dev/null 2>&1
cd ..

# 计算文件大小
TAR_SIZE=$(du -h "${DIST_DIR}/${PACKAGE_NAME}.tar.gz" | cut -f1)
ZIP_SIZE=$(du -h "${DIST_DIR}/${PACKAGE_NAME}.zip" | cut -f1)

# 清理临时构建目录
rm -rf $BUILD_DIR

echo -e "${GREEN}✅ 打包完成！${NC}"
echo ""
echo -e "${BLUE}📋 打包信息:${NC}"
echo "版本号: ${VERSION}"
echo "打包时间: $(date)"
echo ""
echo -e "${BLUE}📦 生成的文件:${NC}"
echo "tar.gz包: ${DIST_DIR}/${PACKAGE_NAME}.tar.gz (${TAR_SIZE})"
echo "zip包: ${DIST_DIR}/${PACKAGE_NAME}.zip (${ZIP_SIZE})"
echo ""
echo -e "${BLUE}🚀 部署说明:${NC}"
echo "1. 将压缩包上传到服务器并解压到 /www/wwwroot/qa-platform"
echo "2. 运行 bash install.sh 进行安装"
echo "3. 按照部署指南配置数据库和Nginx"
echo ""
echo -e "${GREEN}🎉 打包成功！可以开始部署了！${NC}" 