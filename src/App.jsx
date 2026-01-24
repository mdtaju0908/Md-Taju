import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AuthSuccess from './pages/AuthSuccess';
import Feedback from './pages/Feedback';
import AIAssistant from './components/AIAssistant';

function App() {
  const RedirectToBlogHtml = () => {
    useEffect(() => {
      window.location.href = '/blog.html';
    }, []);
    return null;
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<Home />} />
              <Route path="/blogs" element={<RedirectToBlogHtml />} />
              <Route path="/blog/:slug" element={<RedirectToBlogHtml />} />
              <Route path="/blog/*" element={<RedirectToBlogHtml />} />
              <Route path="/auth/success" element={<AuthSuccess />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
            </Routes>
            <AIAssistant />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
