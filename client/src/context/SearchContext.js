import React, { createContext, useContext, useState, useEffect } from 'react';
import { questionsAPI } from '../services/api';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  // 获取所有问题数据
  const fetchAllQuestions = async () => {
    try {
      const response = await questionsAPI.getAll();
      setAllQuestions(response.data);
      return response.data;
    } catch (error) {
      console.error('获取问题数据失败:', error);
      return [];
    }
  };

  // 搜索功能
  const performSearch = (term) => {
    setSearchTerm(term);
    setIsSearching(true);
    
    if (!term.trim()) {
      setSearchResults([]);
      setSearchActive(false);
      setIsSearching(false);
      return;
    }

    const filtered = allQuestions.filter(question => {
      const titleMatch = question.title.toLowerCase().includes(term.toLowerCase());
      const contentMatch = question.content.toLowerCase().includes(term.toLowerCase());
      const authorMatch = question.author_name.toLowerCase().includes(term.toLowerCase());
      
      // 也搜索回答内容
      const answerMatch = question.answers && question.answers.some(answer => 
        answer.content.toLowerCase().includes(term.toLowerCase())
      );
      
      return titleMatch || contentMatch || authorMatch || answerMatch;
    });
    
    setSearchResults(filtered);
    setSearchActive(true);
    setIsSearching(false);
  };

  // 清空搜索
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSearchActive(false);
    setIsSearching(false);
  };

  // 初始化时获取所有问题
  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const value = {
    searchTerm,
    searchResults,
    allQuestions,
    isSearching,
    searchActive,
    performSearch,
    clearSearch,
    fetchAllQuestions,
    setAllQuestions
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext; 