import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const BlogDetailPage = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 评论表单的状态
  const [commenter, setCommenter] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blog/${id}`);
      setPost(response.data);
      setError(null);
    } catch (err) {
      setError('无法加载文章详情。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commenter.trim() || !commentText.trim()) {
      alert('姓名和评论内容不能为空！');
      return;
    }

    setIsSubmitting(true);
    try {
      // 这里的 API 路径必须和后端 blogRoutes.js 里的对应
      const res = await api.post(`/blog/${id}/comments`, {
        user: commenter,
        text: commentText,
      });
      
      // 后端应该返回更新后的评论列表，或者我们可以重新获取整个文章
      // 假设后端返回的是更新后的 comments 数组
      if (res.data) {
        setPost(prev => ({ ...prev, comments: res.data }));
      } else {
        fetchPost(); // 如果后端没返回数据，就重新拉取
      }

      setCommenter('');
      setCommentText('');
      alert('评论发布成功！');
    } catch (err) {
      alert('评论失败，请稍后再试。');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) return <div className="text-center mt-10">正在加载...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!post) return <div className="text-center mt-10">未找到该文章。</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-8 pb-4 border-b">
          作者: <span className="font-semibold">{post.author}</span> | 
          发布于: {new Date(post.createdAt).toLocaleDateString()}
        </p>
        
        {/* 使用 dangerouslySetInnerHTML 来渲染可能包含 HTML 标签的内容 */}
        {/* 注意：在生产环境中这可能导致 XSS 攻击，建议使用 DOMPurify 等库进行清洗 */}
        <div 
          className="prose lg:prose-xl max-w-none text-gray-800 leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} 
        />
      </div>

      {/* 评论区 */}
      <section className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-blue-500 pl-3">评论区 ({post.comments?.length || 0})</h2>
        
        {/* 评论列表 */}
        <div className="space-y-6 mb-10">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-gray-800">{comment.user}</p>
                  <p className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">暂无评论，快来抢沙发吧！</p>
          )}
        </div>
        
        {/* 评论表单 */}
        <form onSubmit={handleCommentSubmit} className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">发表评论</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="commenter" className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
              <input 
                type="text" 
                id="commenter" 
                value={commenter}
                onChange={(e) => setCommenter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="如何称呼您？"
                required
              />
            </div>
            <div>
              <label htmlFor="commentText" className="block text-sm font-medium text-gray-700 mb-1">评论内容</label>
              <textarea 
                id="commentText"
                rows="4"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="写下您的想法..."
                required
              ></textarea>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`mt-4 w-full md:w-auto px-6 py-2 rounded-md text-white font-medium transition-colors
              ${isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? '提交中...' : '提交评论'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default BlogDetailPage;