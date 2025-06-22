# API 文档

## 接口说明

所有接口均使用 JSON 格式进行数据交换，基础URL为 `http://localhost:5000/api`。

## 认证接口

### 管理员登录
- 请求方式：`POST /auth/login`
- 请求体：
```json
{
    "username": "admin",
    "password": "password"
}
```
- 响应：
```json
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": {
        "id": 1,
        "username": "admin"
    }
}
```

### 创建管理员账户
- 请求方式：`POST /auth/create-admin`
- 请求体：
```json
{
    "username": "newadmin",
    "password": "password"
}
```
- 响应：
```json
{
    "message": "管理员账户创建成功",
    "admin": {
        "id": 2,
        "username": "newadmin"
    }
}
```

## 问题接口

### 获取所有问题
- 请求方式：`GET /questions`
- 查询参数：
  - `page`: 页码（默认1）
  - `limit`: 每页数量（默认10）
- 响应：
```json
{
    "questions": [
        {
            "id": 1,
            "title": "问题标题",
            "content": "问题内容",
            "author_name": "张三",
            "created_at": "2024-03-20T12:00:00Z",
            "answers": []
        }
    ],
    "total": 100,
    "page": 1,
    "limit": 10
}
```

### 获取单个问题
- 请求方式：`GET /questions/:id`
- 响应：
```json
{
    "id": 1,
    "title": "问题标题",
    "content": "问题内容",
    "author_name": "张三",
    "created_at": "2024-03-20T12:00:00Z",
    "answers": [
        {
            "id": 1,
            "content": "回答内容",
            "admin_id": 1,
            "admin_name": "admin",
            "created_at": "2024-03-20T13:00:00Z"
        }
    ]
}
```

### 提交问题
- 请求方式：`POST /questions`
- 请求体：
```json
{
    "title": "问题标题",
    "content": "问题内容",
    "author_name": "张三",
    "author_email": "zhangsan@example.com"
}
```
- 响应：
```json
{
    "message": "问题提交成功",
    "question": {
        "id": 1,
        "title": "问题标题",
        "content": "问题内容",
        "author_name": "张三"
    }
}
```

### 删除问题（需要管理员权限）
- 请求方式：`DELETE /questions/:id`
- 请求头：
```
Authorization: Bearer <token>
```
- 响应：
```json
{
    "message": "问题删除成功"
}
```

## 回答接口

### 提交回答（需要管理员权限）
- 请求方式：`POST /questions/:id/answers`
- 请求头：
```
Authorization: Bearer <token>
```
- 请求体：
```json
{
    "content": "回答内容"
}
```
- 响应：
```json
{
    "message": "回答提交成功",
    "answer": {
        "id": 1,
        "content": "回答内容",
        "admin_id": 1,
        "question_id": 1
    }
}
```

### 修改回答（需要管理员权限）
- 请求方式：`PUT /answers/:answerId`
- 请求头：
```
Authorization: Bearer <token>
```
- 请求体：
```json
{
    "content": "修改后的回答内容"
}
```
- 响应：
```json
{
    "message": "回答修改成功",
    "answer": {
        "id": 1,
        "content": "修改后的回答内容",
        "admin_id": 1,
        "question_id": 1
    }
}
```

### 删除回答（需要管理员权限）
- 请求方式：`DELETE /answers/:answerId`
- 请求头：
```
Authorization: Bearer <token>
```
- 响应：
```json
{
    "message": "回答删除成功"
}
```

## 错误处理

所有接口在发生错误时会返回相应的HTTP状态码和错误信息：

```json
{
    "error": "错误信息描述"
}
```

常见状态码：
- 400：请求参数错误
- 401：未授权
- 403：禁止访问
- 404：资源不存在
- 500：服务器内部错误

## 注意事项

1. 所有需要管理员权限的接口都需要在请求头中携带 JWT token
2. token 格式为：`Bearer <token>`
3. 请求体必须使用 JSON 格式
4. 所有时间戳使用 ISO 8601 格式
5. 分页接口默认每页10条数据 