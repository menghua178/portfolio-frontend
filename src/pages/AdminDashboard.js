import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' 或 'blog'
  
  // 数据列表状态
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  
  // 编辑/新建 状态
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // 表单数据 (合并了项目和博客的字段，按需使用)
  const [formData, setFormData] = useState({
    title: '',
    description: '', // 项目用
    imageUrl: '',    // 项目用
    link: '',        // 项目用
    content: '',     // 博客用
    author: 'Admin'  // 博客用
  });

  // 获取数据
  const fetchData = async () => {
    try {
      if (activeTab === 'projects') {
        const res = await api.get('/projects');
        setProjects(res.data);
      } else {
        const res = await api.get('/blog');
        setBlogPosts(res.data);
      }
    } catch (error) {
      console.error("获取数据失败", error);
    }
  };

  useEffect(() => {
    fetchData();
    // 切换标签时重置表单状态
    resetForm();
  }, [activeTab]);

  // 重置表单
  const resetForm = () => {
    setFormData({ title: '', description: '', imageUrl: '', link: '', content: '', author: 'Admin' });
    setIsEditing(false);
    setCurrentId(null);
  };

  // 处理输入变化
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 点击编辑按钮
  const handleEditClick = (item) => {
    setIsEditing(true);
    setCurrentId(item._id);
    // 根据当前标签填充数据
    setFormData({
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      link: item.link || '',
      content: item.content || '',
      author: item.author || 'Admin'
    });
    // 滚动到顶部
    window.scrollTo(0, 0);
  };

  // 提交表单 (创建或更新)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = activeTab === 'projects' ? '/projects' : '/blog';
      
      if (isEditing) {
        // 更新
        await api.put(`${endpoint}/${currentId}`, formData);
        alert('更新成功！');
      } else {
        // 创建
        await api.post(endpoint, formData);
        alert('创建成功！');
      }
      
      resetForm();
      fetchData(); // 刷新列表
    } catch (error) {
      console.error(error);
      alert('操作失败，请检查数据或登录状态。');
    }
  };

  // 删除条目
  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这条记录吗? 此操作无法撤销。')) {
      try {
        const endpoint = activeTab === 'projects' ? `/projects/${id}` : `/blog/${id}`;
        await api.delete(endpoint);
        fetchData();
      } catch (error) {
        alert('删除失败');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">管理后台</h1>
      
      {/* 标签切换 */}
      <div className="flex space-x-4 mb-8 border-b">
        <button
          className={`pb-2 px-4 ${activeTab === 'projects' ? 'border-b-2 border-blue-500 text-blue-500 font-bold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('projects')}
        >
          项目管理
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === 'blog' ? 'border-b-2 border-blue-500 text-blue-500 font-bold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('blog')}
        >
          博客管理
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：表单区域 */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? `编辑${activeTab === 'projects' ? '项目' : '博客'}` : `新建${activeTab === 'projects' ? '项目' : '博客'}`}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">标题</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              {activeTab === 'projects' && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">描述</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">图片链接 URL</label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">项目链接 URL</label>
                    <input
                      type="text"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                </>
              )}

              {activeTab === 'blog' && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">作者</label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">内容 (支持 HTML)</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                      rows="10"
                      required
                    ></textarea>
                  </div>
                </>
              )}

              <div className="flex space-x-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1">
                  {isEditing ? '更新' : '创建'}
                </button>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                    取消
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* 右侧：列表区域 */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {activeTab === 'projects' ? (
              projects.map(p => (
                <div key={p._id} className="bg-white p-4 rounded shadow flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-16 h-16 object-cover rounded" />}
                    <div>
                      <h3 className="font-bold text-lg">{p.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 min-w-fit ml-4">
                    <button onClick={() => handleEditClick(p)} className="text-blue-500 hover:text-blue-700">编辑</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700">删除</button>
                  </div>
                </div>
              ))
            ) : (
              blogPosts.map(b => (
                <div key={b._id} className="bg-white p-4 rounded shadow flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{b.title}</h3>
                    <p className="text-xs text-gray-500 mb-1">
                       {new Date(b.createdAt).toLocaleDateString()} | 作者: {b.author}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {b.content.substring(0, 100)}...
                    </p>
                  </div>
                  <div className="flex space-x-2 min-w-fit ml-4">
                    <button onClick={() => handleEditClick(b)} className="text-blue-500 hover:text-blue-700">编辑</button>
                    <button onClick={() => handleDelete(b._id)} className="text-red-500 hover:text-red-700">删除</button>
                  </div>
                </div>
              ))
            )}
            
            {((activeTab === 'projects' && projects.length === 0) || (activeTab === 'blog' && blogPosts.length === 0)) && (
               <p className="text-center text-gray-500 mt-10">暂无数据，请在左侧创建。</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;