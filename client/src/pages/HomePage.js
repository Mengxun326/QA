import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import { questionsAPI } from '../services/api';
import { useSearch } from '../context/SearchContext';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { 
    searchTerm, 
    searchResults, 
    allQuestions, 
    searchActive, 
    clearSearch, 
    setAllQuestions 
  } = useSearch();

  // 获取问题列表
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionsAPI.getAll();
      setAllQuestions(response.data);
      setError('');
    } catch (error) {
      console.error('获取问题列表失败:', error);
      setError('获取问题列表失败，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // 删除问题的回调
  const handleQuestionDelete = (questionId) => {
    const updatedQuestions = allQuestions.filter(q => q.id !== questionId);
    setAllQuestions(updatedQuestions);
  };

  // 根据搜索状态决定显示的问题
  const displayQuestions = searchActive ? searchResults : allQuestions;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass-card p-12 text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto animate-ping opacity-20"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">正在加载精彩内容...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass-card p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <div className="text-red-600 mb-6 font-medium">{error}</div>
          <button
            onClick={fetchQuestions}
            className="btn-primary"
          >
            🔄 重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="glass-card p-12 mb-8">
          <div className="mb-6">
            <h1 className="text-5xl font-bold text-gradient mb-4">
              Q&A 智慧问答平台（王智杰制作）
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              欢迎来到我们的智慧问答社区！在这里您可以提出问题、分享知识、获得专业解答。
              我们致力于打造一个友好、专业的学习交流环境。
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/ask" 
              className="btn-primary text-lg px-8 py-4"
            >
              <span className="flex items-center">
                <span className="mr-2">✨</span>
                立即提问
              </span>
            </Link>
            <Link 
              to="/smart-ask" 
              className="btn-secondary text-lg px-8 py-4"
            >
              <span className="flex items-center">
                <span className="mr-2">📖</span>
                提问指南
              </span>
            </Link>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="stats-card">
            <div className="text-4xl mb-2">📝</div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{allQuestions.length}</div>
            <div className="text-gray-600 font-medium">总问题数</div>
          </div>
          <div className="stats-card">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {allQuestions.filter(q => q.answers && q.answers.length > 0).length}
            </div>
            <div className="text-gray-600 font-medium">已解答</div>
          </div>
          <div className="stats-card">
            <div className="text-4xl mb-2">💬</div>
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {allQuestions.reduce((total, q) => total + (q.answers ? q.answers.length : 0), 0)}
            </div>
            <div className="text-gray-600 font-medium">总回答数</div>
          </div>
        </div>

        {/* 功能特色 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="feature-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-2xl">🚀</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">快速提问</h3>
            <p className="text-sm text-gray-600">简单几步，即可发布您的问题</p>
          </div>
          
          <div className="feature-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-2xl">👨‍💼</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">专业解答</h3>
            <p className="text-sm text-gray-600">管理员提供专业、详细的回答</p>
          </div>
          
          <div className="feature-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-2xl">🔍</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">知识搜索</h3>
            <p className="text-sm text-gray-600">使用顶部搜索框快速找到答案</p>
          </div>
          
          <div className="feature-card text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-2xl">🎯</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">提问指南</h3>
            <p className="text-sm text-gray-600">学习提问技巧，获得更好回答</p>
          </div>
        </div>
      </div>

      {/* 搜索结果提示 */}
      {searchActive && (
        <div className="mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🔍</span>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">搜索结果</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    找到 <span className="font-semibold text-blue-600">{searchResults.length}</span> 个包含 
                    "<span className="font-semibold text-blue-600">{searchTerm}</span>" 的问题
                  </p>
                </div>
              </div>
              
              <button
                onClick={clearSearch}
                className="btn-secondary px-4 py-2"
              >
                <span className="flex items-center">
                  <span className="mr-2">🔄</span>
                  查看所有问题
                </span>
              </button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-green-700 flex items-center text-sm">
                  <span className="mr-2">💡</span>
                  找到相关问题！请先查看是否已有您需要的答案，避免重复提问。
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 问题列表区域 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="mr-3">💡</span>
            {searchActive ? '搜索结果' : '最新问题'}
            <span className="ml-3 text-lg font-normal text-gray-500">
              ({displayQuestions.length})
            </span>
          </h2>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchQuestions}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors duration-200"
            >
              <span className="mr-1">🔄</span>
              刷新
            </button>
          </div>
        </div>
        
        {displayQuestions.length === 0 ? (
          <div className="glass-card text-center py-16">
            {searchActive ? (
              <>
                <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  没有找到相关问题
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  没有找到包含 "<span className="font-semibold text-blue-600">{searchTerm}</span>" 的问题。
                  试试其他关键词，或者提出新问题。
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={clearSearch}
                    className="btn-secondary px-6 py-3"
                  >
                    <span className="flex items-center">
                      <span className="mr-2">🔄</span>
                      查看所有问题
                    </span>
                  </button>
                  <Link to="/ask" className="btn-primary px-6 py-3">
                    <span className="flex items-center">
                      <span className="mr-2">✨</span>
                      提出新问题
                    </span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">💭</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  还没有任何问题
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  成为第一个提问者，开启知识分享的旅程！您的问题可能帮助到更多人。
                </p>
                <Link to="/ask" className="btn-primary text-lg px-8 py-4">
                  <span className="flex items-center">
                    <span className="mr-2">🚀</span>
                    立即提问
                  </span>
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {displayQuestions
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((question, index) => (
                <div 
                  key={question.id} 
                  className="transform transition-all duration-300 hover:scale-[1.01]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
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

      {/* 页脚信息 */}
      <div className="glass-card p-8 text-center mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">📝 如何提问</h4>
            <p className="text-sm text-gray-600">
              详细描述问题，提供背景信息，帮助获得更好的答案
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">⚡ 快速响应</h4>
            <p className="text-sm text-gray-600">
              我们的管理员团队会尽快为您提供专业解答
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🤝 社区规范</h4>
            <p className="text-sm text-gray-600">
              保持友善、尊重他人，共同维护良好的交流环境
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <span className="mr-2">💡</span>
            提问前请先使用顶部搜索框查找相关问题，遵守社区规范
            <Link to="/smart-ask" className="text-blue-600 hover:underline ml-2 font-medium">
              查看提问指南
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 