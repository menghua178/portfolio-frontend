// ==========================================================
//           前端文件: RegisterPage.js (完整修改版)
// ==========================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const RegisterPage = () => {
  // 1. 在 state 中增加 email 字段
  const [formData, setFormData] = useState({
    username: '',
    email: '', // 新增
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password.length < 6) {
      setError('密码长度不能少于6位');
      return;
    }

    try {
      // formData 中现在已包含 email，会自动发送给后端
      const response = await api.post('/users/register', formData);
      setSuccess(response.data.message + ' 正在跳转到登录页面...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || '注册失败，请重试。');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">创建管理员账户</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        
        <div className="mb-4">
          <label className="block text-gray-700">用户名</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {/* 2. 在表单中新增 Email 输入框 */}
        <div className="mb-4">
          <label className="block text-gray-700">邮箱</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700">密码 (最少6位)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          注册
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;