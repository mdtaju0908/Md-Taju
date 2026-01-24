import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogApi from '../../services/blogApi';
import { FaCalendar, FaUser, FaTag, FaArrowLeft } from 'react-icons/fa';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogApi.getBlogById(id);
        setBlog(data);
        document.title = `${data.title} | Blog`;
      } catch (err) {
        setError('Failed to load blog post.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;

    let baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    // Ensure we use root (strip /api if present)
    baseUrl = baseUrl.replace(/\/api$/, '').replace(/\/+$/, '');

    // Ensure imagePath starts with /
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    return `${baseUrl}${cleanPath}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{error || 'Blog not found'}</h2>
        <Link to="/blogs" className="text-blue-600 hover:underline">
          &larr; Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/blogs" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6">
          <FaArrowLeft className="mr-2" /> Back to Blogs
        </Link>
        
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {(blog.imageUrl || blog.image) && (
            <img
              src={getImageUrl(blog.imageUrl || blog.image)}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover object-center"
            />
          )}
          
          <div className="p-6 md:p-10">
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                  <FaTag className="mr-2" /> {blog.category}
                </span>
                <span className="flex items-center">
                  <FaCalendar className="mr-2" /> {new Date(blog.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <FaUser className="mr-2" /> {blog.author}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                {blog.title}
              </h1>
            </header>

            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetails;
