import React, { useState } from 'react';
import api from '../services/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState({ submitted: false, message: '', isError: false });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/contact', formData);
      setStatus({ submitted: true, message: response.data.message, isError: false });
      // 提交成功后清空表单
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ submitted: true, message: '发送失败，请稍后再试。', isError: true });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">联系我</h1>
        <p className="text-center text-gray-600 mb-8">
          有任何问题或合作意向？请随时给我留言。
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">姓名</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">电子邮箱</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">消息</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            发送消息
          </button>
        </form>
        
        {status.submitted && (
          <p className={`mt-4 text-center ${status.isError ? 'text-red-500' : 'text-green-500'}`}>
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactPage;