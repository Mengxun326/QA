import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { questionsAPI } from '../services/api';
import AnswerCard from './AnswerCard';

const QuestionCard = ({ question, onUpdate, onDelete }) => {
  const { isAdmin } = useAuth();
  const [replyContent, setReplyContent] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '刚刚';
    if (diffInHours < 24) return `${diffInHours}小时前`;
    if (diffInHours < 48) return '昨天';
    return date.toLocaleDateString('zh-CN');
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setLoading(true);
    try {
      await questionsAPI.addAnswer(question.id, { content: replyContent });
      setReplyContent('');
      setShowReplyForm(false);
      onUpdate(); // 刷新问题列表
    } catch (error) {
      console.error('回复失败:', error);
      alert('回复失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('⚠️ 确定要删除这个问题吗？\n删除后将无法恢复，请谨慎操作。')) return;

    try {
      await questionsAPI.delete(question.id);
      onDelete(question.id);
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    }
  };

  const hasAnswers = question.answers && question.answers.length > 0;

  return (
    <div className="question-card group">
      {/* 问题头部 */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1 min-w-0">
          {/* 状态标识 */}
          <div className="flex items-center mb-3">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              hasAnswers 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-orange-100 text-orange-800 border border-orange-200'
            }`}>
              <span className="mr-1">{hasAnswers ? '✅' : '⏳'}</span>
              {hasAnswers ? '已解答' : '待解答'}
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
            {question.title}
          </h3>
          
          <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4 mb-2">
            <span className="flex items-center">
              <span className="mr-1">👤</span>
              <span className="font-medium">{question.author_name}</span>
            </span>
            <span className="flex items-center">
              <span className="mr-1">📅</span>
              <span>{formatDate(question.created_at)}</span>
            </span>
            {hasAnswers && (
              <span className="flex items-center">
                <span className="mr-1">💬</span>
                <span>{question.answers.length} 个回答</span>
              </span>
            )}
          </div>
        </div>
        
        {/* 管理员操作按钮 */}
        {isAdmin() && (
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className={`btn-primary text-sm px-4 py-2 ${
                showReplyForm ? 'bg-gray-500 hover:bg-gray-600' : ''
              }`}
            >
              <span className="flex items-center">
                <span className="mr-1">{showReplyForm ? '❌' : '💬'}</span>
                {showReplyForm ? '取消' : '回复'}
              </span>
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger text-sm px-4 py-2"
            >
              <span className="flex items-center">
                <span className="mr-1">🗑️</span>
                删除
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 问题内容 */}
      <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 rounded-xl p-6 mb-6 border border-gray-100">
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {question.content}
        </div>
      </div>

      {/* 回答列表 */}
      {hasAnswers && (
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              <span className="text-lg mr-2">💡</span>
              <h4 className="text-lg font-semibold text-gray-900">
                专业解答 ({question.answers.length})
              </h4>
            </div>
            <div className="flex-1 ml-4 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
          </div>
          
          <div className="space-y-4">
            {question.answers.map((answer, index) => (
              <div 
                key={answer.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="transform transition-all duration-300"
              >
                <AnswerCard
                  answer={answer}
                  onUpdate={onUpdate}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 回复表单（仅管理员可见） */}
      {isAdmin() && showReplyForm && (
        <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl p-6 border border-blue-100">
          <form onSubmit={handleReply}>
            <div className="mb-4">
              <label className="form-label flex items-center">
                <span className="mr-2">✍️</span>
                专业回答
              </label>
              <div className="relative">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="input-field min-h-[120px] resize-none"
                  placeholder="请输入您的专业回答...&#10;• 详细说明解决方案&#10;• 提供相关参考资料&#10;• 给出实用的建议"
                  required
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {replyContent.length} 字符
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500 flex items-center">
                <span className="mr-1">💡</span>
                您的回答将帮助提问者解决问题
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  <span className="flex items-center">
                    <span className="mr-1">❌</span>
                    取消
                  </span>
                </button>
                <button
                  type="submit"
                  disabled={loading || !replyContent.trim()}
                  className="btn-primary text-sm px-6 py-2"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      提交中...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="mr-1">🚀</span>
                      提交回答
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 无回答提示 */}
      {!hasAnswers && !showReplyForm && (
        <div className="bg-gradient-to-r from-amber-50/80 to-yellow-50/80 rounded-xl p-6 border border-amber-200 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-yellow-600 text-2xl">💭</span>
          </div>
          <h4 className="font-medium text-amber-900 mb-2">等待专业解答</h4>
          <p className="text-amber-700 text-sm">
            管理员正在准备详细的解答，请耐心等待
          </p>
          {isAdmin() && (
            <button
              onClick={() => setShowReplyForm(true)}
              className="btn-primary text-sm px-4 py-2 mt-4"
            >
              <span className="flex items-center">
                <span className="mr-1">💬</span>
                立即回答
              </span>
            </button>
          )}
        </div>
      )}

      {/* 互动统计 */}
      <div className="flex items-center justify-end pt-4 border-t border-gray-200 text-xs text-gray-400">
        <div className="flex items-center">
          <span className="mr-1">#</span>
          <span>ID: {question.id}</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard; 