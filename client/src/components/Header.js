import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { searchTerm, performSearch, clearSearch } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSearchChange = (value) => {
    performSearch(value);
    setShowSearchDropdown(value.length > 0);
    
    // 如果不在首页，搜索时跳转到首页
    if (value.trim() && location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleSearchClear = () => {
    clearSearch();
    setShowSearchDropdown(false);
  };

  // 点击外部关闭搜索下拉框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`relative px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
        isActive(to)
          ? 'text-blue-600 bg-blue-50 shadow-md'
          : 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
      }`}
    >
      {children}
      {isActive(to) && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
      )}
    </Link>
  );

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                <img 
                  src="https://meng-xun-image-host.oss-cn-shanghai.aliyuncs.com/img/favicon%20(2).ico" 
                  alt="Q&A平台Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Q&A平台</h1>
                <p className="text-xs text-gray-500">智慧问答社区</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            <NavLink to="/">
              <span className="flex items-center">
                <span className="mr-1">🏠</span>
                首页
              </span>
            </NavLink>
            
            <NavLink to="/ask">
              <span className="flex items-center">
                <span className="mr-1">💬</span>
                提问
              </span>
            </NavLink>

            <NavLink to="/smart-ask">
              <span className="flex items-center">
                <span className="mr-1">💡</span>
                提问指南
              </span>
            </NavLink>

            {/* 搜索框 */}
            <div className="relative ml-4" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowSearchDropdown(searchTerm.length > 0)}
                  placeholder="搜索问题..."
                  className="w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <span className="text-sm">🔍</span>
                </div>
                {searchTerm && (
                  <button
                    onClick={handleSearchClear}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <span className="text-sm">❌</span>
                  </button>
                )}
              </div>
              
              {/* 搜索提示下拉框 */}
              {showSearchDropdown && searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 text-sm text-gray-600 border-b border-gray-100">
                    <span className="flex items-center">
                      <span className="mr-2">🔍</span>
                      搜索 "{searchTerm}"
                    </span>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowSearchDropdown(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <span className="flex items-center">
                        <span className="mr-2">📋</span>
                        在首页查看搜索结果
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Section */}
            {isAdmin() ? (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-800">
                      {user.username}
                    </span>
                    <div className="text-xs text-green-600 font-medium">管理员</div>
                  </div>
                </div>
                <NavLink to="/admin">
                  <span className="flex items-center">
                    <span className="mr-1">⚙️</span>
                    管理面板
                  </span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-all duration-200 text-sm"
                >
                  <span className="flex items-center">
                    <span className="mr-1">🚪</span>
                    退出
                  </span>
                </button>
              </div>
            ) : (
              <div className="ml-4 pl-4 border-l border-gray-200">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
                >
                  <span className="mr-2">🔐</span>
                  管理员登录
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors duration-200"
            >
              <svg
                className={`h-6 w-6 transform transition-transform duration-200 ${
                  isMobileMenuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200 mt-4">
            <div className="flex flex-col space-y-2 pt-4">
              {/* 移动端搜索框 */}
              <div className="px-3 py-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="搜索问题..."
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <span>🔍</span>
                  </div>
                  {searchTerm && (
                    <button
                      onClick={handleSearchClear}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <span>❌</span>
                    </button>
                  )}
                </div>
                {searchTerm && (
                  <div className="mt-2 text-xs text-gray-600 flex items-center">
                    <span className="mr-1">💡</span>
                    点击首页查看搜索结果
                  </div>
                )}
              </div>

              <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="flex items-center">
                  <span className="mr-2">🏠</span>
                  首页
                </span>
              </NavLink>
              
              <NavLink to="/ask" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="flex items-center">
                  <span className="mr-2">💬</span>
                  提问
                </span>
              </NavLink>

              <NavLink to="/smart-ask" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="flex items-center">
                  <span className="mr-2">💡</span>
                  提问指南
                </span>
              </NavLink>

              {isAdmin() ? (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-800">
                        {user.username}
                      </span>
                      <div className="text-xs text-green-600 font-medium">管理员</div>
                    </div>
                  </div>
                  <NavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="flex items-center">
                      <span className="mr-2">⚙️</span>
                      管理面板
                    </span>
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <span className="flex items-center">
                      <span className="mr-2">🚪</span>
                      退出登录
                    </span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
                  >
                    <span className="mr-2">🔐</span>
                    管理员登录
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 