import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 获取登录后要跳转的页面
  const from = location.state?.from?.pathname || '/admin';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除错误信息
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.password) {
      setError('请输入用户名和密码');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(formData);
      
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('登录失败:', error);
      setError('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 页面头部 */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white text-3xl">🔐</span>
          </div>
          <h2 className="text-4xl font-bold text-gradient mb-2">
            管理员登录
          </h2>
          <p className="text-gray-600">
            请使用管理员账号登录以管理问答内容
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mt-4"></div>
        </div>

        {/* 登录表单 */}
        <div className="glass-card p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* 用户名输入 */}
              <div className="relative">
                <label htmlFor="username" className="form-label flex items-center">
                  <span className="mr-2">👤</span>
                  用户名
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="input-field pl-12"
                    placeholder="请输入管理员用户名"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <span>👤</span>
                  </div>
                </div>
              </div>

              {/* 密码输入 */}
              <div className="relative">
                <label htmlFor="password" className="form-label flex items-center">
                  <span className="mr-2">🔑</span>
                  密码
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-12"
                    placeholder="请输入登录密码"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <span>🔑</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 错误信息 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <span className="text-red-600 text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* 登录按钮 */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-lg font-semibold"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    登录中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">🚀</span>
                    立即登录
                  </span>
                )}
              </button>
            </div>

            {/* 返回首页链接 */}
            <div className="text-center pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center mx-auto transition-colors duration-200"
              >
                <span className="mr-1">🏠</span>
                返回首页
              </button>
            </div>
          </form>
        </div>

        {/* 安全提示 */}
        <div className="text-center">
          <div className="flex items-center justify-center text-xs text-gray-500 space-x-4">
            <span className="flex items-center">
              <span className="mr-1">🔒</span>
              安全登录
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="flex items-center">
              <span className="mr-1">🛡️</span>
              数据保护
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="flex items-center">
              <span className="mr-1">⚡</span>
              快速响应
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 