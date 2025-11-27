import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">我的作品集</Link>
        <div>
          <Link to="/" className="text-gray-600 hover:text-blue-500 px-3">主页</Link>
          <Link to="/projects" className="text-gray-600 hover:text-blue-500 px-3">项目</Link>
          <Link to="/blog" className="text-gray-600 hover:text-blue-500 px-3">博客</Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-500 px-3">联系我</Link>
          {user ? (
            <>
              <Link to="/admin" className="text-gray-600 hover:text-blue-500 px-3">管理后台</Link>
              <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                登出
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-500 px-3">登录</Link>
              <Link to="/register" className="text-gray-600 hover:text-blue-500 px-3">注册</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;