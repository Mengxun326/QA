import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionsAPI } from '../services/api';

const AskPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author_name: '',
    author_email: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除单个字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '问题标题不能为空';
    } else if (formData.title.length < 5) {
      newErrors.title = '标题至少需要5个字符';
    } else if (formData.title.length > 255) {
      newErrors.title = '标题不能超过255个字符';
    }

    if (!formData.content.trim()) {
      newErrors.content = '问题内容不能为空';
    } else if (formData.content.length < 10) {
      newErrors.content = '问题内容至少需要10个字符';
    }

    if (!formData.author_name.trim()) {
      newErrors.author_name = '姓名不能为空';
    } else if (formData.author_name.length < 2) {
      newErrors.author_name = '姓名至少需要2个字符';
    } else if (formData.author_name.length > 100) {
      newErrors.author_name = '姓名不能超过100个字符';
    }

    if (formData.author_email && !/^\S+@\S+\.\S+$/.test(formData.author_email)) {
      newErrors.author_email = '邮箱格式不正确';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await questionsAPI.create(formData);
      setShowSuccessModal(true);
      // 3秒后自动跳转
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('提交问题失败:', error);
      const errorMsg = error.response?.data?.error || '提交失败，请重试';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card p-8 m-4 text-center max-w-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-2xl">✅</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">提交成功！</h3>
        <p className="text-gray-600 mb-6">
          您的问题已成功提交，管理员会尽快为您回复。即将跳转到首页...
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex-1"
          >
            立即查看
          </button>
          <button
            onClick={() => setShowSuccessModal(false)}
            className="btn-secondary flex-1"
          >
            继续提问
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="glass-card p-8 mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">💬</span>
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-4">
            提交问题
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            请详细描述您的问题，管理员会尽快为您回复。好的问题描述能帮助您获得更精准的答案。
          </p>
        </div>

        {/* 提问表单 */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 问题标题 */}
            <div className="relative">
              <label htmlFor="title" className="form-label flex items-center">
                <span className="mr-2">📝</span>
                问题标题 <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`input-field pr-16 ${errors.title ? 'border-red-500 ring-red-500' : ''}`}
                  placeholder="请用一句话简洁地概括您的问题..."
                  maxLength="255"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                  {formData.title.length}/255
                </div>
              </div>
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.title}
                </p>
              )}
            </div>

            {/* 问题内容 */}
            <div className="relative">
              <label htmlFor="content" className="form-label flex items-center">
                <span className="mr-2">📄</span>
                问题详情 <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="8"
                className={`input-field resize-none ${errors.content ? 'border-red-500 ring-red-500' : ''}`}
                placeholder="请详细描述您的问题：&#10;• 问题的具体情况&#10;• 您已经尝试过的解决方法&#10;• 期望得到什么样的帮助&#10;• 其他相关的背景信息"
              />
              {errors.content && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.content}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500 flex items-center">
                <span className="mr-1">💡</span>
                当前 {formData.content.length} 字符，至少需要10个字符
              </p>
            </div>

            {/* 个人信息区域 */}
            <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">👤</span>
                个人信息
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 提问者姓名 */}
                <div>
                  <label htmlFor="author_name" className="form-label flex items-center">
                    <span className="mr-2">🏷️</span>
                    您的姓名 <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="author_name"
                    name="author_name"
                    value={formData.author_name}
                    onChange={handleChange}
                    className={`input-field ${errors.author_name ? 'border-red-500 ring-red-500' : ''}`}
                    placeholder="请输入您的姓名或昵称"
                    maxLength="100"
                  />
                  {errors.author_name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.author_name}
                    </p>
                  )}
                </div>

                {/* 邮箱（可选） */}
                <div>
                  <label htmlFor="author_email" className="form-label flex items-center">
                    <span className="mr-2">📧</span>
                    邮箱地址（可选）
                  </label>
                  <input
                    type="email"
                    id="author_email"
                    name="author_email"
                    value={formData.author_email}
                    onChange={handleChange}
                    className={`input-field ${errors.author_email ? 'border-red-500 ring-red-500' : ''}`}
                    placeholder="example@email.com"
                  />
                  {errors.author_email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.author_email}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-500 flex items-center">
                    <span className="mr-1">🔒</span>
                    邮箱仅用于回复通知，不会公开显示
                  </p>
                </div>
              </div>
            </div>

            {/* 提示信息 */}
            <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm border border-amber-200 rounded-xl p-6">
              <h3 className="font-semibold text-amber-900 mb-3 flex items-center">
                <span className="mr-2">📋</span>
                提问须知
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="text-sm text-amber-800 space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✓</span>
                    <span>问题将公开显示，其他用户可以查看</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">✓</span>
                    <span>请使用文明用语，遵守社区规范</span>
                  </li>
                </ul>
                <ul className="text-sm text-amber-800 space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-0.5">✓</span>
                    <span>管理员会尽快回复您的问题</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-0.5">✓</span>
                    <span>避免重复提交相同问题</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 py-4 text-lg font-semibold"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    提交中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">🚀</span>
                    提交问题
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary flex-1 py-4 text-lg font-semibold"
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">🏠</span>
                  返回首页
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* 帮助提示 */}
        <div className="glass-card p-6 mt-8">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            提问技巧
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-start">
              <span className="text-blue-500 mr-2 mt-0.5">1.</span>
              <span>标题要简洁明了，一眼就能看懂问题</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2 mt-0.5">2.</span>
              <span>描述要详细具体，包含背景信息</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-500 mr-2 mt-0.5">3.</span>
              <span>说明已尝试的解决方法</span>
            </div>
          </div>
        </div>
      </div>

      {/* 成功提示模态框 */}
      {showSuccessModal && <SuccessModal />}
    </>
  );
};

export default AskPage; 