#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 创建读取行接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 颜色输出函数
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorLog(color, text) {
  console.log(colors[color] + text + colors.reset);
}

// 问题提示函数
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// 主设置函数
async function setup() {
  colorLog('cyan', '\n🚀 Q&A平台快速设置向导\n');
  
  try {
    // 检查环境变量文件
    const envExamplePath = path.join(__dirname, 'server', 'config.env.example');
    const envPath = path.join(__dirname, 'server', '.env');
    
    if (!fs.existsSync(envPath)) {
      colorLog('yellow', '📝 创建环境变量文件...');
      
      // 获取数据库配置
      const dbHost = await askQuestion('请输入数据库主机地址 (默认: localhost): ') || 'localhost';
      const dbUser = await askQuestion('请输入数据库用户名 (默认: root): ') || 'root';
      const dbPassword = await askQuestion('请输入数据库密码: ');
      const dbName = await askQuestion('请输入数据库名称 (默认: qa_platform): ') || 'qa_platform';
      const jwtSecret = await askQuestion('请输入JWT密钥 (默认: your_jwt_secret_key): ') || 'your_jwt_secret_key';
      const port = await askQuestion('请输入服务器端口 (默认: 5000): ') || '5000';
      
      // 创建.env文件
      const envContent = `# 数据库配置
DB_HOST=${dbHost}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_NAME=${dbName}

# JWT密钥
JWT_SECRET=${jwtSecret}

# 服务器端口
PORT=${port}

# 管理员默认账号
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
`;
      
      fs.writeFileSync(envPath, envContent);
      colorLog('green', '✅ 环境变量文件创建成功！');
    } else {
      colorLog('blue', '📋 环境变量文件已存在，跳过创建。');
    }
    
    // 询问是否创建管理员账户
    const createAdmin = await askQuestion('\n是否需要创建管理员账户？(y/n): ');
    
    if (createAdmin.toLowerCase() === 'y' || createAdmin.toLowerCase() === 'yes') {
      const adminUsername = await askQuestion('请输入管理员用户名 (默认: admin): ') || 'admin';
      const adminPassword = await askQuestion('请输入管理员密码 (默认: admin123): ') || 'admin123';
      
             const serverPort = port || '5000';
       colorLog('yellow', '\n⚠️  请在服务器启动后运行以下命令创建管理员账户：');
       colorLog('bright', `curl -X POST http://localhost:${serverPort}/api/auth/create-admin \\`);
       colorLog('bright', `  -H "Content-Type: application/json" \\`);
       colorLog('bright', `  -d '{"username":"${adminUsername}","password":"${adminPassword}"}'`);
    }
    
    // 显示安装指令
    colorLog('cyan', '\n📦 下一步操作：');
    colorLog('bright', '1. 确保MySQL数据库正在运行');
    colorLog('bright', '2. 运行以下命令安装依赖：');
    colorLog('green', '   npm run install-all');
    colorLog('bright', '3. 创建数据库（如果还没有）：');
    colorLog('green', '   mysql -u root -p < database.sql');
    colorLog('bright', '4. 启动开发服务器：');
    colorLog('green', '   npm run dev');
    colorLog('bright', '5. 访问 http://localhost:3000 查看前端');
    colorLog('bright', '6. 访问 http://localhost:5000/api/health 测试后端');
    
    colorLog('magenta', '\n🎉 设置完成！祝您使用愉快！');
    
  } catch (error) {
    colorLog('red', '\n❌ 设置过程中出现错误：');
    console.error(error);
  } finally {
    rl.close();
  }
}

// 运行设置
if (require.main === module) {
  setup();
}

module.exports = setup; 