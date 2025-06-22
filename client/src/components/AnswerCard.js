import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { answersAPI } from '../services/api';

const AnswerCard = ({ answer, onUpdate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(answer.content);
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

  // 检查是否为当前管理员的回复
  const isOwnAnswer = user && answer.admin_id === user.id;

  const handleEdit = () => {
    setEditContent(answer.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(answer.content);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;

    setLoading(true);
    try {
      await answersAPI.update(answer.id, { content: editContent });
      setIsEditing(false);
      onUpdate(); // 刷新数据
    } catch (error) {
      console.error('修改回复失败:', error);
      alert('修改失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('⚠️ 确定要删除这个回复吗？\n删除后将无法恢复。')) return;

    setLoading(true);
    try {
      await answersAPI.delete(answer.id);
      onUpdate(); // 刷新数据
    } catch (error) {
      console.error('删除回复失败:', error);
      alert('删除失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const isUpdated = answer.updated_at !== answer.created_at;

  return (
    <div className="answer-card group relative">
      {/* 管理员标识 */}
      <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full"></div>
      
      {/* 回复头部 */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-semibold">
              {answer.admin_username.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-blue-700 flex items-center">
                <span className="mr-1">👨‍💼</span>
                管理员 {answer.admin_username}
              </span>
              {isUpdated && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  <span className="mr-1">✏️</span>
                  已编辑
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <span className="mr-1">📅</span>
              回复于 {formatDate(answer.created_at)}
              {isUpdated && (
                <span className="ml-2 text-xs text-gray-400">
                  (编辑于 {formatDate(answer.updated_at)})
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* 管理员操作按钮 */}
        {isOwnAnswer && !isEditing && (
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleEdit}
              disabled={loading}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-all duration-200"
            >
              <span className="flex items-center">
                <span className="mr-1">✏️</span>
                编辑
              </span>
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-all duration-200"
            >
              <span className="flex items-center">
                <span className="mr-1">🗑️</span>
                删除
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 回复内容 */}
      {isEditing ? (
        <div className="bg-white rounded-xl p-4 border-2 border-blue-200">
          <div className="mb-4">
            <label className="form-label flex items-center">
              <span className="mr-2">✍️</span>
              编辑回答
            </label>
            <div className="relative">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="input-field min-h-[120px] resize-none"
                placeholder="输入回复内容..."
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {editContent.length} 字符
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 flex items-center">
              <span className="mr-1">💡</span>
              修改后的内容将立即更新
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleCancelEdit}
                disabled={loading}
                className="btn-secondary text-sm px-4 py-2"
              >
                <span className="flex items-center">
                  <span className="mr-1">❌</span>
                  取消
                </span>
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={loading || !editContent.trim()}
                className="btn-primary text-sm px-4 py-2"
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    保存中...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className="mr-1">💾</span>
                    保存
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          {/* 回答标签 */}
          <div className="flex items-center mb-3">
            <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              <span className="mr-1">✅</span>
              专业解答
            </div>
          </div>
          
          {/* 回答内容 */}
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {answer.content}
          </div>
        </div>
      )}

      {/* 质量标识 */}
      <div className="flex items-center justify-between mt-3 text-xs">
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-green-600">
            <span className="mr-1">🏆</span>
            <span>优质回答</span>
          </div>
          {answer.content.length > 100 && (
            <div className="flex items-center text-blue-600">
              <span className="mr-1">📝</span>
              <span>详细解答</span>
            </div>
          )}
        </div>
        
        {isOwnAnswer && (
          <div className="flex items-center text-indigo-600">
            <span className="mr-1">👑</span>
            <span>我的回答</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerCard; 