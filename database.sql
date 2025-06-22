-- Q&A平台数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS qa_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE qa_platform;

-- 创建管理员表
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '管理员用户名',
    password VARCHAR(255) NOT NULL COMMENT '加密后的密码',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';

-- 创建问题表
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT '问题标题',
    content TEXT NOT NULL COMMENT '问题内容',
    author_name VARCHAR(100) NOT NULL COMMENT '提问者姓名',
    author_email VARCHAR(100) NULL COMMENT '提问者邮箱（可选）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='问题表';

-- 创建回答表
CREATE TABLE IF NOT EXISTS answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL COMMENT '问题ID',
    content TEXT NOT NULL COMMENT '回答内容',
    admin_id INT NOT NULL COMMENT '管理员ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='回答表';

-- 创建索引以提高查询性能
CREATE INDEX idx_questions_created_at ON questions(created_at);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_answers_admin_id ON answers(admin_id);

-- 插入示例数据（可选）
-- 注意：密码是 'admin123' 经过bcrypt加密后的结果
-- 您需要使用API创建管理员账户，或者使用bcrypt工具生成密码哈希

-- 示例问题数据
INSERT INTO questions (title, content, author_name, author_email) VALUES
('如何学习JavaScript？', '我是编程新手，想学习JavaScript，请问有什么好的学习资源和建议吗？', '小明', 'xiaoming@example.com'),
('React和Vue.js哪个更好？', '我在选择前端框架，请问React和Vue.js各有什么优缺点？应该选择哪个？', '小红', 'xiaohong@example.com'),
('如何提高网站性能？', '我的网站加载速度很慢，请问有什么方法可以提高网站性能？', '小王', null);

-- 显示创建的表
SHOW TABLES;

-- 显示表结构
DESCRIBE admins;
DESCRIBE questions;
DESCRIBE answers; 