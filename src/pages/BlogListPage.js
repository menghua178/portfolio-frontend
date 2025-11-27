import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

// BlogPostCard 子组件，用于展示单篇博客的摘要
const BlogPostCard = ({ post }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{post.title}</h2>
      <p className="text-gray-500 text-sm mb-4">
        作者: {post.author} | 发布于: {new Date(post.createdAt).toLocaleDateString()}
      </p>
      {/* 仅显示部分内容作为摘要 */}
      <p className="text-gray-700 mb-4">
        {post.content.substring(0, 150)}...
      </p>
      <Link 
        to={`/blog/${post._id}`} 
        className="text-blue-500 font-semibold hover:underline"
      >
        阅读全文 &rarr;
      </Link>
    </div>
  </div>
);


const BlogListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/blog');
        setPosts(response.data);
        setError(null);
      } catch (err) {
        setError('无法加载博客文章，请稍后再试。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // 空依赖数组意味着这个 effect 只在组件挂载时运行一次

  if (loading) {
    return <div className="text-center text-xl mt-10">正在加载文章...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-xl mt-10">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">我的博客</h1>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <BlogPostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">还没有任何博客文章。</p>
      )}
    </div>
  );
};

export default BlogListPage;