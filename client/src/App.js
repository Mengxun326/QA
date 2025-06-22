import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AskPage from './pages/AskPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import SmartAskPage from './pages/SmartAskPage';

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex flex-col">
            <Header />
            <main className="relative flex-1">
              {/* 装饰性背景元素 */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -top-4 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              </div>
              
              <div className="relative z-10">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/ask" element={<AskPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/smart-ask" element={<SmartAskPage />} />
                </Routes>
              </div>
            </main>
            <Footer />
          </div>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App; 