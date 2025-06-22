import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-lg border-t border-white/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* 版权信息 */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              © 2025 Q&A问答平台. 保留所有权利.
            </p>
          </div>
          
          {/* 链接区域 */}
          <div className="flex flex-wrap justify-center md:justify-end items-center space-x-6">
            <a
              href="https://www.meng-xun.top"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center"
            >
              <span className="mr-1">📝</span>
              梦寻の博客
            </a>
            
            <a
              href="https://csdiy.wiki"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center"
            >
              <span className="mr-1">📚</span>
              CS自学指南
            </a>
            
            <a
              href="https://github.com/Mengxun326/QA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center"
            >
              <span className="mr-1">🐙</span>
              项目GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 