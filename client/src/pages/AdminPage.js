import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import { questionsAPI } from '../services/api';

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, answered, unanswered

  // 检查管理员权限
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login');
      return;
    }
  }, [isAdmin, navigate]);

  // 获取问题列表
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionsAPI.getAll();
      setQuestions(response.data);
      setError('');
    } catch (error) {
      console.error('获取问题列表失败:', error);
      setError('获取问题列表失败，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin()) {
      fetchQuestions();
    }
  }, [isAdmin]);

  // 删除问题的回调
  const handleQuestionDelete = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  if (!isAdmin()) {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="glass-card p-12 text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto animate-ping opacity-20"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">正在加载管理数据...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <div className="text-red-600 mb-6 font-medium">{error}</div>
          <button onClick={fetchQuestions} className="btn-primary">
            🔄 重新加载
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter(q => q.answers && q.answers.length > 0).length;
  const unansweredQuestions = totalQuestions - answeredQuestions;

  // 过滤问题
  const filteredQuestions = questions.filter(question => {
    if (filter === 'answered') return question.answers && question.answers.length > 0;
    if (filter === 'unanswered') return !question.answers || question.answers.length === 0;
    return true; // all
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面头部 */}
      <div className="glass-card p-8 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div className="flex items-center mb-4 lg:mb-0">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-2xl">⚙️</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">
                管理员控制台
              </h1>
              <p className="text-gray-600">
                欢迎回来，<span className="font-semibold text-blue-600">{user?.username}</span>！
                您可以在这里管理所有问题和回复。
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-800">{user?.username}</div>
              <div className="text-xs text-green-600 font-medium">超级管理员</div>
            </div>
          </div>
        </div>
      </div>

      {/* 统计面板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stats-card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-blue-700">总问题数</div>
              <div className="text-3xl font-bold text-blue-600">{totalQuestions}</div>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">📝</span>
            </div>
          </div>
        </div>
        
        <div className="stats-card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-green-700">已回复</div>
              <div className="text-3xl font-bold text-green-600">{answeredQuestions}</div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">✅</span>
            </div>
          </div>
        </div>
        
        <div className="stats-card bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-orange-700">待回复</div>
              <div className="text-3xl font-bold text-orange-600">{unansweredQuestions}</div>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">⏳</span>
            </div>
          </div>
        </div>
        
        <div className="stats-card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-purple-700">总回答数</div>
              <div className="text-3xl font-bold text-purple-600">
                {questions.reduce((total, q) => total + (q.answers ? q.answers.length : 0), 0)}
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">💬</span>
            </div>
          </div>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="glass-card p-6 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
              <span className="mr-2">🚀</span>
              快捷操作
            </h3>
            <p className="text-gray-600 text-sm">常用管理功能快速访问</p>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
            <button 
              onClick={() => navigate('/')} 
              className="btn-secondary text-sm px-4 py-2"
            >
              <span className="flex items-center">
                <span className="mr-1">👁️</span>
                查看前台
              </span>
            </button>
            <button 
              onClick={fetchQuestions} 
              className="btn-primary text-sm px-4 py-2"
            >
              <span className="flex items-center">
                <span className="mr-1">🔄</span>
                刷新数据
              </span>
            </button>
            <button 
              onClick={() => window.open('/api', '_blank')} 
              className="btn-secondary text-sm px-4 py-2"
            >
              <span className="flex items-center">
                <span className="mr-1">🔧</span>
                API文档
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 问题管理 */}
      <div className="glass-card p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4 lg:mb-0">
            <span className="mr-3">📋</span>
            问题管理 
            <span className="ml-3 text-lg font-normal text-gray-500">({filteredQuestions.length})</span>
          </h2>
          
          {/* 筛选器 */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全部 ({totalQuestions})
            </button>
            <button
              onClick={() => setFilter('unanswered')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === 'unanswered'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              待回复 ({unansweredQuestions})
            </button>
            <button
              onClick={() => setFilter('answered')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === 'answered'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              已回复 ({answeredQuestions})
            </button>
          </div>
        </div>
        
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📭</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {filter === 'unanswered' && '暂无待回复问题'}
              {filter === 'answered' && '暂无已回复问题'}
              {filter === 'all' && '暂无问题需要管理'}
            </h3>
            <p className="text-gray-600 mb-8">
              {filter === 'unanswered' && '太棒了！所有问题都已得到回复。'}
              {filter === 'answered' && '还没有已回复的问题。'}
              {filter === 'all' && '当前没有任何问题，系统运行良好。'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredQuestions
              .sort((a, b) => {
                // 优先显示未回答的问题
                const aHasAnswer = a.answers && a.answers.length > 0;
                const bHasAnswer = b.answers && b.answers.length > 0;
                if (!aHasAnswer && bHasAnswer) return -1;
                if (aHasAnswer && !bHasAnswer) return 1;
                return new Date(b.created_at) - new Date(a.created_at);
              })
              .map((question, index) => (
                <div 
                  key={question.id} 
                  className="relative transform transition-all duration-300 hover:scale-[1.01]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* 状态标签 */}
                  {(!question.answers || question.answers.length === 0) && (
                    <div className="absolute -top-2 -right-2 z-20">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full shadow-lg animate-pulse">
                        <span className="flex items-center">
                          <span className="mr-1">⚠️</span>
                          待回复
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* 优先级指示器 */}
                  <div className="absolute left-0 top-4 w-1 h-16 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full opacity-60"></div>
                  
                  <QuestionCard
                    question={question}
                    onUpdate={fetchQuestions}
                    onDelete={handleQuestionDelete}
                  />
                </div>
              ))}
          </div>
        )}
      </div>

      {/* 管理提示 */}
      <div className="glass-card p-6 mt-8">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">💡</span>
          管理提示
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-start">
            <span className="text-blue-500 mr-2 mt-0.5">1.</span>
            <span>优先回复标记为"待回复"的问题</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2 mt-0.5">2.</span>
            <span>回复要详细具体，帮助用户解决问题</span>
          </div>
          <div className="flex items-start">
            <span className="text-purple-500 mr-2 mt-0.5">3.</span>
            <span>定期检查并删除不合适的问题</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 