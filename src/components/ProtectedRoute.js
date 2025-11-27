import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>加载中...</div>; // 或者一个加载动画
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;