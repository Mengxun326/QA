const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { initDatabase } = require('./config/database');
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const answerRoutes = require('./routes/answers');

const app = express();
const PORT = process.env.PORT || 5000;

// 未捕获的异常处理
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  // 记录错误但不退出进程
  console.error('错误堆栈:', err.stack);
});

// Promise 异常处理
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
  // 记录错误但不退出进程
  console.error('Promise:', promise);
});

// 中间件
app.use(cors({
  origin: ['http://localhost:3000', 'http://47.121.180.250:3000', 'https://47.121.180.250:3000'],
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 错误处理中间件 - 处理JSON解析错误
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: '无效的JSON格式' });
  }
  next(err);
});

// 静态文件服务（用于生产环境）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Q&A平台后端服务正常运行',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 生产环境下的前端路由处理
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// 错误处理中间件
app.use((err, req, res, next) => {
  // 记录详细错误信息
  console.error('服务器错误:', {
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  });

  // 返回适当的错误响应
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message,
    timestamp: new Date().toISOString()
  });
});

// 404处理
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: '接口不存在',
    path: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
async function startServer() {
  try {
    // 初始化数据库
    await initDatabase();
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 服务器运行在端口 ${PORT}`);
      console.log(`📊 健康检查: http://localhost:${PORT}/api/health`);
      console.log(`🔐 管理员登录: POST http://localhost:${PORT}/api/auth/login`);
      console.log(`❓ 问题API: http://localhost:${PORT}/api/questions`);
      console.log(`💬 回复API: http://localhost:${PORT}/api/answers`);
    });

    // 优雅关闭服务器
    process.on('SIGTERM', () => {
      console.log('收到 SIGTERM 信号，准备关闭服务器...');
      server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('服务器启动失败:', error);
    console.error('错误堆栈:', error.stack);
    process.exit(1);
  }
}

startServer(); 