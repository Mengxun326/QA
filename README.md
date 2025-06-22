# Q&A 问答平台

一个现代化的问答平台，基于 React 和 Node.js 构建。用户可以免登录提问，管理员登录后可以回复问题。所有问题和回复都公开显示。

## 功能特点

- 📝 **用户功能**
  - 免登录提问
  - 实时查看所有问题和回复
  - 响应式设计，移动端友好

- 👨‍💼 **管理员功能**
  - 安全的登录系统
  - 回复用户问题
  - 编辑和删除自己的回复
  - 删除不当问题
  - 管理面板统计

- 🎨 **界面设计**
  - 现代化UI设计
  - Tailwind CSS样式
  - 优雅的交互体验

## 快速开始

### 环境要求
- Node.js (v14+)
- MySQL数据库
- npm 或 yarn

### 安装步骤

1. 克隆仓库
```bash
git clone <repository-url>
cd Q&A
```

2. 安装依赖
```bash
npm run install-all
```

3. 配置环境变量
```bash
cp server/config.env.example server/.env
```
编辑 `.env` 文件，设置数据库连接信息。

4. 创建数据库
```sql
CREATE DATABASE qa_platform;
```

5. 启动应用
```bash
# 开发环境
npm run dev

# 生产环境
npm run build
npm start
```

详细的安装和配置说明请参考 [开发指南](docs/开发指南.md)。

## 项目文档

- [项目说明](docs/项目说明.md) - 详细的项目介绍和架构说明
- [开发指南](docs/开发指南.md) - 开发环境配置和开发流程
- [API文档](docs/API文档.md) - 接口说明和使用方法
- [部署指南](docs/部署指南.md) - 生产环境部署说明

## 技术栈

### 后端
- Node.js + Express
- MySQL数据库
- JWT认证
- bcryptjs密码加密
- 输入验证

### 前端
- React 18
- React Router
- Axios HTTP客户端
- Tailwind CSS
- 响应式设计

## 贡献指南

我们欢迎所有形式的贡献，无论是新功能、bug修复还是文档改进。请遵循以下步骤：

1. Fork 本仓库
2. 创建新的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m '添加一些新功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 开源协议

本项目采用 MIT 协议开源，详情请参见 [LICENSE](LICENSE) 文件。

## 联系方式

如有问题或建议，请提交 [Issue](../../issues) 或 [Pull Request](../../pulls)。

## 致谢

感谢所有为这个项目做出贡献的开发者们！

## 更新日志

### v1.0.0 (2024-03-20)
- 初始版本发布
- 基础问答功能
- 管理员系统
- 响应式设计

## API接口

### 认证接口
- `POST /api/auth/login` - 管理员登录
- `POST /api/auth/create-admin` - 创建管理员账户

### 问题接口
- `GET /api/questions` - 获取所有问题
- `GET /api/questions/:id` - 获取单个问题
- `POST /api/questions` - 用户提交问题
- `POST /api/questions/:id/answers` - 管理员回复问题（需要认证）
- `DELETE /api/questions/:id` - 删除问题（需要认证）

### 回复接口
- `PUT /api/answers/:answerId` - 管理员修改回复（需要认证）
- `DELETE /api/answers/:answerId` - 管理员删除回复（需要认证）

## 项目结构

```
Q&A/
├── client/                 # 前端React应用
│   ├── public/
│   │   ├── components/     # 组件
│   │   ├── context/        # React Context
│   │   ├── pages/          # 页面组件
│   │   ├── services/       # API服务
│   │   └── ...
│   └── package.json
├── server/                 # 后端Express应用
│   ├── config/             # 配置文件
│   ├── middleware/         # 中间件
│   ├── routes/             # 路由
│   └── package.json
├── package.json           # 主项目配置
└── README.md
```

## 数据库设计

### 表结构

#### admins（管理员表）
- id: 主键
- username: 用户名（唯一）
- password: 加密密码
- created_at: 创建时间

#### questions（问题表）
- id: 主键
- title: 问题标题
- content: 问题内容
- author_name: 提问者姓名
- author_email: 提问者邮箱（可选）
- created_at: 创建时间
- updated_at: 更新时间

#### answers（回答表）
- id: 主键
- question_id: 问题ID（外键）
- content: 回答内容
- admin_id: 管理员ID（外键）
- created_at: 创建时间
- updated_at: 更新时间

## 开发注意事项

1. **安全性**
   - 所有API输入都经过验证
   - 密码使用bcrypt加密
   - JWT用于管理员认证
   - SQL注入防护

2. **性能优化**
   - 数据库连接池
   - 前端懒加载
   - 图片优化

3. **用户体验**
   - 响应式设计
   - 加载状态提示
   - 错误处理
   - 表单验证