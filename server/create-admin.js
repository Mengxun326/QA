const readline = require('readline');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

// 创建命令行交互界面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 颜色输出函数
function colorLog(color, message) {
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    bright: '\x1b[1m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[color] || ''}${message}${colors.reset}`);
}

// 询问用户输入
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// 创建数据库连接
async function createConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'qa_platform'
    });
    return connection;
  } catch (error) {
    throw new Error(`数据库连接失败: ${error.message}`);
  }
}

// 检查管理员是否已存在
async function checkAdminExists(connection, username) {
  try {
    const [rows] = await connection.execute(
      'SELECT id FROM admins WHERE username = ?',
      [username]
    );
    return rows.length > 0;
  } catch (error) {
    throw new Error(`检查管理员失败: ${error.message}`);
  }
}

// 创建管理员账号
async function createAdmin(connection, username, password) {
  try {
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 插入管理员记录
    const [result] = await connection.execute(
      'INSERT INTO admins (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    
    return result.insertId;
  } catch (error) {
    throw new Error(`创建管理员失败: ${error.message}`);
  }
}

// 主函数
async function main() {
  colorLog('cyan', '\n🔐 Q&A平台管理员账号创建工具\n');
  
  try {
    // 检查环境变量
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD) {
      colorLog('yellow', '⚠️  检测到环境变量配置不完整');
      colorLog('bright', '请确保 .env 文件已正确配置数据库信息');
      
      const continueAnyway = await askQuestion('是否继续尝试连接数据库？(y/n): ');
      if (continueAnyway.toLowerCase() !== 'y' && continueAnyway.toLowerCase() !== 'yes') {
        colorLog('yellow', '操作已取消');
        rl.close();
        return;
      }
    }
    
    // 连接数据库
    colorLog('blue', '📡 正在连接数据库...');
    const connection = await createConnection();
    colorLog('green', '✅ 数据库连接成功！');
    
    // 获取管理员信息
    colorLog('cyan', '\n📝 请输入管理员账号信息：');
    
    const username = await askQuestion('用户名 (默认: admin): ') || 'admin';
    
    // 检查用户名是否已存在
    const exists = await checkAdminExists(connection, username);
    if (exists) {
      colorLog('red', `❌ 用户名 "${username}" 已存在！`);
      const overwrite = await askQuestion('是否要覆盖现有账号？(y/n): ');
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        colorLog('yellow', '操作已取消');
        connection.end();
        rl.close();
        return;
      }
      
      // 删除现有账号
      await connection.execute('DELETE FROM admins WHERE username = ?', [username]);
      colorLog('yellow', '已删除现有账号');
    }
    
    const password = await askQuestion('密码 (默认: admin123): ') || 'admin123';
    
    // 确认密码
    const confirmPassword = await askQuestion('确认密码: ');
    if (password !== confirmPassword) {
      colorLog('red', '❌ 两次输入的密码不一致！');
      connection.end();
      rl.close();
      return;
    }
    
    // 验证密码强度
    if (password.length < 6) {
      colorLog('yellow', '⚠️  密码长度少于6位，建议使用更复杂的密码');
      const continueAnyway = await askQuestion('是否继续使用此密码？(y/n): ');
      if (continueAnyway.toLowerCase() !== 'y' && continueAnyway.toLowerCase() !== 'yes') {
        colorLog('yellow', '操作已取消');
        connection.end();
        rl.close();
        return;
      }
    }
    
    // 创建管理员账号
    colorLog('blue', '\n🔄 正在创建管理员账号...');
    const adminId = await createAdmin(connection, username, password);
    
    colorLog('green', '✅ 管理员账号创建成功！');
    colorLog('bright', `\n📋 账号信息：`);
    colorLog('cyan', `   用户名: ${username}`);
    colorLog('cyan', `   密码: ${password}`);
    colorLog('cyan', `   账号ID: ${adminId}`);
    
    colorLog('bright', '\n🔗 登录信息：');
    colorLog('cyan', `   登录地址: http://localhost:3000/login`);
    colorLog('cyan', `   或直接访问: http://localhost:3000/admin`);
    
    colorLog('yellow', '\n⚠️  安全提醒：');
    colorLog('bright', '   1. 请妥善保管您的密码');
    colorLog('bright', '   2. 建议定期更换密码');
    colorLog('bright', '   3. 不要在不安全的环境下使用默认密码');
    
    // 关闭数据库连接
    connection.end();
    
  } catch (error) {
    colorLog('red', `\n❌ 错误: ${error.message}`);
    
    if (error.message.includes('数据库连接失败')) {
      colorLog('yellow', '\n💡 解决方案：');
      colorLog('bright', '   1. 确保MySQL服务正在运行');
      colorLog('bright', '   2. 检查 .env 文件中的数据库配置');
      colorLog('bright', '   3. 确保数据库 qa_platform 已创建');
      colorLog('bright', '   4. 运行 mysql -u root -p < ../database.sql 创建数据库');
    }
  } finally {
    rl.close();
  }
}

// 运行主函数
main().catch(console.error); 