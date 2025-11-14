import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  // 这里还需要 state 来管理表单输入、编辑状态等

  // 获取所有项目和博客
  const fetchData = async () => {
    try {
      const projectRes = await api.get('/projects');
      setProjects(projectRes.data);
      const blogRes = await api.get('/blog');
      setBlogPosts(blogRes.data);
    } catch (error) {
      console.error("获取数据失败", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteProject = async (id) => {
    if (window.confirm('确定要删除这个项目吗?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchData(); // 重新获取数据刷新列表
      } catch (error) {
        alert('删除失败');
      }
    }
  };
  
  // handleDeleteBlogPost, handleCreateProject, etc. ...
  // 你需要为创建和更新功能创建表单和相应的处理函数

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">管理后台</h1>
      
      {/* 项目管理 */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">项目管理</h2>
        {/* 在这里添加一个“创建新项目”的按钮和表单 */}
        <div className="space-y-4">
          {projects.map(p => (
            <div key={p._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <span>{p.title}</span>
              <div>
                <button className="text-blue-500 mr-2">编辑</button>
                <button onClick={() => handleDeleteProject(p._id)} className="text-red-500">删除</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 博客管理 */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">博客管理</h2>
         {/* 在这里添加一个“创建新博客”的按钮和表单 */}
        <div className="space-y-4">
          {blogPosts.map(b => (
            <div key={b._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <span>{b.title}</span>
              <div>
                <button className="text-blue-500 mr-2">编辑</button>
                <button className="text-red-500">删除</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;