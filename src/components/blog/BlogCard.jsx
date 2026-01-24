import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaEye } from 'react-icons/fa';

const BlogCard = ({ blog }) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    let baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    baseUrl = baseUrl.replace(/\/api$/, '').replace(/\/+$/, '');

    // Ensure imagePath starts with /
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `${baseUrl}${cleanPath}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100 dark:border-gray-700">
      <Link to={`/blog/${blog.slug}`}>
        <img
          src={getImageUrl(blog.imageUrl || blog.image)}
          alt={blog.title}
          className="w-full h-48 object-cover object-center transition-opacity duration-300 hover:opacity-90"
          loading="lazy"
        />
      </Link>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold tracking-wide px-2 py-1 bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900 dark:text-blue-300">
            {blog.category}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
        </div>
        <Link to={`/blog/${blog.slug}`} className="block mt-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
            {blog.title}
          </h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {blog.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          {blog.readingTime && (
            <span className="inline-flex items-center">
              <FaClock className="mr-1" /> {blog.readingTime} min
            </span>
          )}
          <span className="inline-flex items-center">
            <FaEye className="mr-1" /> {blog.views || 0} views
          </span>
        </div>
        <div className="flex items-center justify-between mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
          <div className="flex items-center">
            {/* Placeholder Avatar or Initials */}
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-200 mr-2">
              {blog.author ? blog.author.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {blog.author}
            </span>
          </div>
          <Link
            to={`/blog/${blog.slug}`}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
          >
            Read More &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
