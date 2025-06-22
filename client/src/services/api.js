import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  withCredentials: false, // 禁用跨域请求携带cookie，因为使用JWT token认证
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 请求拦截器 - 添加认证token和调试信息
api.interceptors.request.use(
  (config) => {
    // 添加调试信息
    console.log('发送请求:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 增强的错误处理
api.interceptors.response.use(
  (response) => {
    // 添加响应调试信息
    console.log('收到响应:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    // 详细的错误日志
    console.error('API错误:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });

    // 处理特定的错误情况
    if (error.code === 'ECONNABORTED') {
      console.error('请求超时');
    } else if (!error.response) {
      console.error('网络错误或服务器未响应');
    } else {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          console.error('没有权限访问此资源');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error(`未处理的错误状态码: ${error.response.status}`);
      }
    }
    return Promise.reject(error);
  }
);

// API接口函数
export const authAPI = {
  // 管理员登录
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },
  
  // 创建管理员（开发用）
  createAdmin: async (adminData) => {
    try {
      const response = await api.post('/auth/create-admin', adminData);
      return response;
    } catch (error) {
      console.error('创建管理员失败:', error);
      throw error;
    }
  },
};

export const questionsAPI = {
  // 获取所有问题
  getAll: async () => {
    try {
      const response = await api.get('/questions');
      return response;
    } catch (error) {
      console.error('获取问题列表失败:', error);
      throw error;
    }
  },
  
  // 获取单个问题
  getById: async (id) => {
    try {
      const response = await api.get(`/questions/${id}`);
      return response;
    } catch (error) {
      console.error(`获取问题${id}失败:`, error);
      throw error;
    }
  },
  
  // 用户提交问题
  create: async (questionData) => {
    try {
      const response = await api.post('/questions', questionData);
      return response;
    } catch (error) {
      console.error('创建问题失败:', error);
      throw error;
    }
  },
  
  // 管理员回复问题
  addAnswer: async (questionId, answerData) => {
    try {
      const response = await api.post(`/questions/${questionId}/answers`, answerData);
      return response;
    } catch (error) {
      console.error(`回复问题${questionId}失败:`, error);
      throw error;
    }
  },
  
  // 管理员删除问题
  delete: async (id) => {
    try {
      const response = await api.delete(`/questions/${id}`);
      return response;
    } catch (error) {
      console.error(`删除问题${id}失败:`, error);
      throw error;
    }
  },
};

export const answersAPI = {
  // 管理员修改回复
  update: async (answerId, answerData) => {
    try {
      const response = await api.put(`/answers/${answerId}`, answerData);
      return response;
    } catch (error) {
      console.error(`更新回复${answerId}失败:`, error);
      throw error;
    }
  },
  
  // 管理员删除回复
  delete: async (answerId) => {
    try {
      const response = await api.delete(`/answers/${answerId}`);
      return response;
    } catch (error) {
      console.error(`删除回复${answerId}失败:`, error);
      throw error;
    }
  },
};

export default api; 