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

  // 从 URL 中获取博客文章的 id
  const { id } = useParams();

  // 定义一个函数来获取博客文章数据，方便复用
  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blog/${id}`);
      setPost(response.data);
      setError(null);
    } catch (err) {
      setError('无法加载文章详情。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]); // 当 URL 中的 id 变化时，重新获取数据

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commenter || !commentText) {
      alert('姓名和评论内容不能为空！');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/blog/${id}/comments`, {
        user: commenter,
        text: commentText,
      });
      // 提交成功后清空表单并重新获取文章数据（以显示最新评论）
      setCommenter('');
      setCommentText('');
      fetchPost(); 
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
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
      {/* 文章内容 */}
      <article>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-8">
          作者: {post.author} | 发布于: {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div className="prose lg:prose-xl max-w-none" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
      </article>

      <hr className="my-10" />

      {/* 评论区 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">评论</h2>
        {/* 评论列表 */}
        <div className="space-y-4 mb-8">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">{comment.user}</p>
                <p className="text-gray-700">{comment.text}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">暂无评论，快来抢沙发吧！</p>
          )}
        </div>
        
        {/* 评论表单 */}
        <form onSubmit={handleCommentSubmit} className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">发表你的看法</h3>
          <div className="mb-4">
            <label htmlFor="commenter" className="block text-gray-700 mb-1">你的名字</label>
            <input 
              type="text" 
              id="commenter" 
              value={commenter}
              onChange={(e) => setCommenter(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="commentText" className="block text-gray-700 mb-1">评论内容</label>
            <textarea 
              id="commentText"
              rows="4"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSubmitting ? '正在提交...' : '提交评论'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default BlogDetailPage;