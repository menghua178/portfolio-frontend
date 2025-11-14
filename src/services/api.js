import axios from 'axios';

const api = axios.create({
  // 重要：确保这里的 URL 指向你正在运行的后端服务器
  baseURL: 'https://portfolio-backend-phtb.onrender.com/api', 
});

// 你可以在这里添加请求拦截器，来动态设置 token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});


export default api;